<?php
namespace App\Console\Commands;

use App\Services\{IntakePayload,SubmissionOutbox};
use Illuminate\Console\Command;
use Illuminate\Support\Facades\{Crypt,DB};

class ReconcileHistoricalSubmissions extends Command
{
    protected $signature='intake:reconcile-history {table : contact_submissions or visitor_registrations} {--after=} {--limit=100} {--apply : Write after separately approved historical import} {--exhibition= : Explicit reviewed ERP exhibition ID}';
    protected $description='Dry-run historical intake reconciliation by default; preserve original records, UUIDs and timestamps';

    public function handle(): int
    {
        $table=$this->argument('table');
        if(!in_array($table,['contact_submissions','visitor_registrations'],true) || !config('intake.enabled') || (int)$this->option('exhibition')!==config('intake.exhibition_id') || config('intake.exhibition_id')<1){$this->error('A reviewed enabled binding and matching --exhibition are required.');return 1;}
        $after=$this->option('after');
        if($after && !\Illuminate\Support\Str::isUuid($after)){$this->error('Invalid cursor.');return 1;}
        $rows=DB::table($table)->when($after,fn($q)=>$q->where('id','>',$after))->orderBy('id')->limit(max(1,min(500,(int)$this->option('limit'))))->get();
        $counts=['examined'=>0,'eligible'=>0,'existing'=>0,'invalid'=>0,'written'=>0];$hashes=[];
        foreach($rows as $row){
            $counts['examined']++;
            try {
                if(!\Illuminate\Support\Str::isUuid($row->id) || !$row->created_at){throw new \RuntimeException('Invalid historical identity');}
                $type=$table==='visitor_registrations'?'visitor_interest':($row->inquiry_type==='visitor'?'visitor_interest':$row->inquiry_type);
                $payload=['name'=>$row->name,'email'=>$row->email,'phone'=>$row->phone,'company'=>$row->company,'country'=>$row->country?:'Not provided',
                    'language'=>'en','job_title'=>$row->title??$row->job_title??null,'message'=>$row->message??'Historic visitor interest; not a confirmed registration.',
                    'operational_consent'=>false,'marketing_consent'=>false,'policy_version'=>null,'consented_at'=>null,'legacy_original'=>(array)$row];
                $payload=IntakePayload::validate($payload,$type,true);
                // Reserve ample room for fixed envelope metadata; dry-run and apply reject the same oversized source.
                if(strlen(json_encode($payload,JSON_THROW_ON_ERROR|JSON_UNESCAPED_UNICODE|JSON_UNESCAPED_SLASHES))>config('intake.max_bytes')-2048){throw new \RuntimeException('Historical source exceeds delivery limit');}
                $hash=IntakePayload::hash($payload);$hashes[]=$row->id.':'.$hash;
                $existing=DB::table('public_submissions')->where('id',$row->id)->first();
                if($existing){
                    if($existing->legacy_table!==$table || !hash_equals(IntakePayload::hash(json_decode(Crypt::decryptString($existing->payload),true)),$hash)){throw new \RuntimeException('Historical source conflict');}
                    $counts['existing']++;continue;
                }
                $counts['eligible']++;
                if($this->option('apply')){
                    DB::transaction(function()use($row,$table,$type,$payload,$hash){
                        DB::table('public_submissions')->insert(['id'=>$row->id,'idempotency_key'=>$row->id,'payload_hash'=>$hash,'site'=>config('intake.site'),
                            'exhibition_id'=>config('intake.exhibition_id'),'source_form'=>'legacy_'.$table,'type'=>$type,'historical'=>true,'legacy_table'=>$table,
                            'payload'=>Crypt::encryptString(json_encode($payload,JSON_THROW_ON_ERROR|JSON_UNESCAPED_UNICODE)),
                            'submitted_at'=>$row->created_at,'created_at'=>now(),'updated_at'=>now()]);
                        app(SubmissionOutbox::class)->enqueue(DB::table('public_submissions')->find($row->id),'submitted');
                    });
                    $counts['written']++;
                }
            }catch(\Throwable){$counts['invalid']++;}
        }
        sort($hashes);$this->line(json_encode([...$counts,'mode'=>$this->option('apply')?'apply':'dry_run','cursor'=>$rows->last()?->id,'checksum'=>hash('sha256',implode("\n",$hashes))]));
        return $counts['invalid']?1:0;
    }
}
