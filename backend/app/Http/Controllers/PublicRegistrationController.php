<?php
namespace App\Http\Controllers;

use App\Services\{IntakePayload,IntakeTransport,SubmissionOutbox};
use Illuminate\Http\{Request,JsonResponse};
use Illuminate\Support\Facades\{Crypt,DB,RateLimiter};
use Illuminate\Support\Str;

class PublicRegistrationController extends Controller
{
    public function controls(): JsonResponse
    {
        abort_unless(config('intake.enabled'),503,'Registration is not yet open.');
        try { $data=app(IntakeTransport::class)->send('controls',[]); }
        catch (\Throwable) { abort(503,'Registration status is temporarily unavailable. Please try later.'); }
        abort_unless(($data['site']??null)===config('intake.site') && ($data['exhibition_id']??null)===config('intake.exhibition_id'),503);
        return response()->json(['data'=>$data])->header('Cache-Control','no-store');
    }

    public function submit(Request $request): JsonResponse
    {
        abort_unless(config('intake.enabled'),503,'Registration is not yet open.');
        $v=$request->validate(['idempotency_key'=>'required|uuid','type'=>'required|in:'.implode(',',IntakePayload::TYPES),
            'payload'=>'required|array','website_url'=>'nullable|string|max:0','started_at'=>'required|integer']);
        abort_unless(time()-$v['started_at']>=2 && time()-$v['started_at']<=7200,422,'Please reload the form and try again.');
        $payload=$v['payload'];
        // Consent time is server-owned. Retry integrity excludes this generated timestamp.
        unset($payload['consented_at']);
        $inputHash=IntakePayload::hash(['type'=>$v['type'],'payload'=>$payload]);
        $prior=DB::table('public_submissions')->where('idempotency_key',$v['idempotency_key'])->first();
        if ($prior) {
            abort_unless(hash_equals($prior->payload_hash,$inputHash),409,'This submission key was already used with different data.');
            return response()->json(['data'=>['id'=>$prior->id,'status'=>$this->businessStatus($prior),'delivery_status'=>$this->deliveryStatus($prior),'replayed'=>true,'receipt_token'=>null]])->header('Cache-Control','no-store');
        }
        $controls=$this->controls()->getData(true)['data'];
        $group=in_array($v['type'],['exhibitor','sponsor','buyer','visitor'],true)?$v['type']:'general';
        $control=$controls['controls'][$group]??[];
        abort_unless(($control['open']??false)===true,403,'This registration or enquiry type is closed or not yet open.');
        abort_unless(($payload['policy_version']??null)===($control['policy_version']??null),409,'The privacy notice has changed. Reload the form.');
        $payload['consented_at']=now()->utc()->format('Y-m-d\TH:i:s\Z');
        $payload=IntakePayload::validate($payload,$v['type']);
        abort_if(!empty($payload['visit_date']) && ($v['type']!=='visitor' || !in_array($payload['visit_date'],$control['dates']??[],true)),422,'Select an approved visit date.');
        $rateKey='registration-email:'.hash('sha256',mb_strtolower(trim($payload['email'])));
        abort_if(RateLimiter::tooManyAttempts($rateKey,5),429,'Please try again later.');
        RateLimiter::hit($rateKey,3600);
        $token=bin2hex(random_bytes(32));
        try {
            $id=DB::transaction(function()use($v,$payload,$inputHash,$token){
                $id=Str::uuid()->toString();
                DB::table('public_submissions')->insert(['id'=>$id,'idempotency_key'=>$v['idempotency_key'],'payload_hash'=>$inputHash,
                    'site'=>config('intake.site'),'exhibition_id'=>config('intake.exhibition_id'),'type'=>$v['type'],
                    'registration_status'=>$v['type']==='visitor'?'registered':null,'visitor_registration_version'=>$v['type']==='visitor'?1:null,
                    'source_form'=>in_array($v['type'],['buyer','visitor'],true)?$v['type']:'contact',
                    'payload'=>Crypt::encryptString(json_encode($payload,JSON_THROW_ON_ERROR|JSON_UNESCAPED_UNICODE)),
                    'submitted_at'=>now(),'receipt_hash'=>hash('sha256',$token),'receipt_expires_at'=>now()->addDays(90),'created_at'=>now(),'updated_at'=>now()]);
                app(SubmissionOutbox::class)->enqueue(DB::table('public_submissions')->find($id),'submitted');
                return $id;
            });
        } catch (\Illuminate\Database\UniqueConstraintViolationException) {
            $prior=DB::table('public_submissions')->where('idempotency_key',$v['idempotency_key'])->first();
            abort_unless($prior && hash_equals($prior->payload_hash,$inputHash),409);
            return response()->json(['data'=>['id'=>$prior->id,'status'=>'accepted','replayed'=>true,'receipt_token'=>null]])->header('Cache-Control','no-store');
        }
        return response()->json(['data'=>['id'=>$id,'status'=>$v['type']==='visitor'?'registered':'accepted','delivery_status'=>'pending','receipt_token'=>$token,
            'message'=>$v['type']==='visitor'?'Your registration has been completed successfully. No email or QR ticket has been issued. Registration is not venue check-in.':'Submission saved for review. No email has been sent. This is not confirmation of attendance or buyer verification.']],201)->header('Cache-Control','no-store');
    }

    private function receipt(Request $request): object
    {
        abort_unless(config('intake.enabled'),503);
        $v=$request->validate(['id'=>'required|uuid','token'=>['required','regex:/^[a-f0-9]{64}$/']]);
        $row=DB::table('public_submissions')->where('id',$v['id'])->where('site',config('intake.site'))->where('exhibition_id',config('intake.exhibition_id'))->first();
        abort_unless($row && $row->receipt_hash && hash_equals($row->receipt_hash,hash('sha256',$v['token'])) && $row->receipt_expires_at && now()->lt($row->receipt_expires_at),404,'Registration reference not found or expired.');
        return $row;
    }

    private function businessStatus(object $row): string
    {
        if($row->withdrawn_at){return 'withdrawn';}
        if($row->type!=='visitor'){return 'accepted';}
        return (int)$row->visitor_registration_version===1?($row->registration_status??'legacy_requires_review'):'legacy_requires_review';
    }

    private function deliveryStatus(object $row): string
    {
        return DB::table('submission_outbox')->where('submission_id',$row->id)->where('event',$row->withdrawn_at?'withdrawn':'submitted')->value('status')??'not_queued';
    }

    public function status(Request $request): JsonResponse
    {
        $row=$this->receipt($request);
        $status=$row->type==='visitor' || $row->withdrawn_at?$this->businessStatus($row):'accepted_awaiting_processing';
        if (!$row->withdrawn_at) {
            try {
                $remote=app(IntakeTransport::class)->send('status',['source_id'=>$row->id])['status']??null;
                if($row->type==='visitor') {
                    if((int)$row->visitor_registration_version===1 && in_array($remote,['cancelled','duplicate','withdrawn'],true)) {
                        DB::table('public_submissions')->where('id',$row->id)->whereNull('withdrawn_at')->where('registration_status','registered')->update(['registration_status'=>$remote,'updated_at'=>now()]);
                    }
                } elseif($remote){$status=$remote;}
            } catch (\Throwable) { /* Acceptance survives delivery delays and ERP outages. */ }
        }
        $row=DB::table('public_submissions')->find($row->id);
        if($row->type==='visitor' || $row->withdrawn_at){$status=$this->businessStatus($row);}
        return response()->json(['data'=>['id'=>$row->id,'status'=>$status,'delivery_status'=>$this->deliveryStatus($row)]])->header('Cache-Control','no-store');
    }

    public function withdraw(Request $request): JsonResponse
    {
        $row=$this->receipt($request);
        DB::transaction(function()use($row){
            $locked=DB::table('public_submissions')->where('id',$row->id)->lockForUpdate()->first();
            if (!$locked->withdrawn_at) {
                DB::table('public_submissions')->where('id',$row->id)->update(['withdrawn_at'=>now(),'registration_status'=>$locked->type==='visitor'?'withdrawn':null,'updated_at'=>now()]);
                app(SubmissionOutbox::class)->enqueue($locked,'withdrawn');
            }
        });
        return response()->json(['data'=>['id'=>$row->id,'status'=>'withdrawn']])->header('Cache-Control','no-store');
    }
}
