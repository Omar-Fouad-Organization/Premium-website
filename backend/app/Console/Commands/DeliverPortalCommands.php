<?php
namespace App\Console\Commands;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
class DeliverPortalCommands extends Command
{
    protected $signature='portal:deliver {--limit=25}';
    protected $description='Retry a bounded batch of pending participant commands; never schedule meetings';
    public function handle():int
    {
        if(!config('participant_portal.enabled')){$this->error('Participant portal is disabled.');return self::FAILURE;}
        $limit=filter_var($this->option('limit'),FILTER_VALIDATE_INT);if(!$limit || $limit<1 || $limit>100)return self::FAILURE;
        $rows=DB::table('portal_outbox')->where('state','pending')->where('attempts','<',8)->where(fn($q)=>$q->whereNull('next_attempt_at')->orWhere('next_attempt_at','<=',now()))->orderBy('created_at')->limit($limit)->get(['id','identity_id']);
        $counts=[];foreach($rows as $r){try{$result=app(\App\Services\PortalOutbox::class)->deliver($r->id,$r->identity_id);$key=$result['state'];}catch(\Symfony\Component\HttpKernel\Exception\HttpException){$key='access_unavailable';}$counts[$key]=($counts[$key]??0)+1;}
        $this->line(json_encode(['processed'=>$rows->count(),'states'=>$counts]));return self::SUCCESS;
    }
}
