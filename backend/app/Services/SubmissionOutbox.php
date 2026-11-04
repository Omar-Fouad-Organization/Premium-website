<?php
namespace App\Services;

use Illuminate\Support\Facades\{Crypt,DB};
use Illuminate\Support\Str;

class SubmissionOutbox
{
    public function enqueue(object $source, string $event): void
    {
        $id=Str::uuid()->toString();
        $payload=json_decode(Crypt::decryptString($source->payload),true,32,JSON_THROW_ON_ERROR);
        $envelope=['message_id'=>$id,'source_id'=>$source->id,'source_system'=>'green-life-website','site'=>$source->site,
            'exhibition_id'=>(int)$source->exhibition_id,'source_form'=>$source->source_form,'type'=>$source->type,'event'=>$event,
            'historical'=>(bool)$source->historical,'submitted_at'=>\Carbon\Carbon::parse($source->submitted_at)->utc()->format('Y-m-d\TH:i:s\Z'),
            'payload'=>$payload,'source_hash'=>IntakePayload::hash($payload)];
        if($source->type==='visitor' && ($source->visitor_registration_version??null)==1){$envelope['visitor_registration_version']=1;}
        abort_if(strlen(json_encode($envelope,JSON_THROW_ON_ERROR|JSON_UNESCAPED_UNICODE|JSON_UNESCAPED_SLASHES))>config('intake.max_bytes'),413,'Submission exceeds the delivery size limit.');
        DB::table('submission_outbox')->insert(['id'=>$id,'submission_id'=>$source->id,'event'=>$event,
            'envelope'=>Crypt::encryptString(json_encode($envelope,JSON_THROW_ON_ERROR|JSON_UNESCAPED_UNICODE)),
            'payload_hash'=>IntakePayload::hash($envelope),'next_attempt_at'=>now(),'created_at'=>now(),'updated_at'=>now()]);
    }

    public function deliver(int $limit=50): array
    {
        abort_unless(config('intake.enabled'),503);
        $counts=['delivered'=>0,'failed'=>0];
        for($i=0;$i<min(max($limit,1),100);$i++) {
            $row=DB::transaction(function(){
                $row=DB::table('submission_outbox')->whereIn('status',['pending','retry'])
                    ->whereIn('submission_id',DB::table('public_submissions')->where('site',config('intake.site'))->where('exhibition_id',config('intake.exhibition_id'))->select('id'))
                    ->where('next_attempt_at','<=',now())->where(fn($q)=>$q->whereNull('lease_until')->orWhere('lease_until','<',now()))
                    ->orderBy('created_at')->lock('for update skip locked')->first();
                if (!$row) { return null; }
                $row->lease_token=Str::uuid()->toString();
                DB::table('submission_outbox')->where('id',$row->id)->update(['lease_token'=>$row->lease_token,'lease_until'=>now()->addMinute(),'attempts'=>DB::raw('attempts+1'),'updated_at'=>now()]);
                return $row;
            });
            if (!$row) { break; }
            try {
                $envelope=json_decode(Crypt::decryptString($row->envelope),true,32,JSON_THROW_ON_ERROR);
                if (!hash_equals(IntakePayload::hash($envelope),$row->payload_hash)) { throw new \RuntimeException('Integrity mismatch'); }
                $ack=app(IntakeTransport::class)->send('accept',$envelope);
                if (($ack['accepted']??null)!==true || ($ack['message_id']??null)!==$row->id || ($ack['source_id']??null)!==$row->submission_id) { throw new \RuntimeException('Invalid acknowledgement'); }
                DB::table('submission_outbox')->where('id',$row->id)->where('lease_token',$row->lease_token)->update(['status'=>'delivered','delivered_at'=>now(),'lease_until'=>null,'lease_token'=>null,'last_error'=>null,'updated_at'=>now()]);
                $counts['delivered']++;
            } catch (\Throwable) {
                $attempt=$row->attempts+1;
                DB::table('submission_outbox')->where('id',$row->id)->where('lease_token',$row->lease_token)->update(['status'=>$attempt>=10?'failed':'retry',
                    'next_attempt_at'=>now()->addSeconds(min(3600,30*(2**min($attempt,7)))),'lease_until'=>null,'lease_token'=>null,'last_error'=>'delivery_unconfirmed','updated_at'=>now()]);
                $counts['failed']++;
            }
        }
        return $counts;
    }

    public function replay(string $id, string $actor): void
    {
        DB::transaction(function()use($id,$actor){
            $row=DB::table('submission_outbox')->where('id',$id)->lockForUpdate()->first();
            abort_unless($row,404);
            abort_unless(DB::table('public_submissions')->where('id',$row->submission_id)->where('site',config('intake.site'))->where('exhibition_id',config('intake.exhibition_id'))->exists(),404);
            abort_if($row->lease_until && now()->lt($row->lease_until),409,'Delivery is in progress.');
            DB::table('submission_outbox')->where('id',$id)->update(['status'=>'pending','next_attempt_at'=>now(),'lease_token'=>null,'lease_until'=>null,'updated_at'=>now()]);
            DB::table('submission_delivery_audits')->insert(['message_id'=>$id,'action'=>'replay_requested','actor'=>$actor,'created_at'=>now()]);
        });
    }
}
