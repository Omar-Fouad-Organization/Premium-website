<?php
namespace App\Http\Controllers;
use App\Services\SubmissionOutbox;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
class IntakeDeliveryController extends Controller
{
    private function deliveries(): \Illuminate\Database\Query\Builder
    {
        return DB::table('submission_outbox')->whereIn('submission_id',DB::table('public_submissions')->where('site',config('intake.site'))->where('exhibition_id',config('intake.exhibition_id'))->select('id'));
    }
    public function monitor(): array
    {
        return ['counts'=>$this->deliveries()->selectRaw('status, count(*) as count')->groupBy('status')->get(),
            'data'=>$this->deliveries()->where('status','!=','delivered')->orderBy('created_at')->limit(100)->get(['id','submission_id','event','status','attempts','last_error','next_attempt_at','created_at'])];
    }
    public function replay(Request $request): array
    {
        $v=$request->validate(['message_id'=>'required|uuid','actor'=>['required','regex:/^erp:[1-9][0-9]*$/']]);
        app(SubmissionOutbox::class)->replay($v['message_id'],$v['actor']);
        return ['queued'=>true];
    }
    public function manifest(Request $request): array
    {
        $v=$request->validate(['after'=>'nullable|uuid']);
        $q=DB::table('public_submissions')->where('site',config('intake.site'))->where('exhibition_id',config('intake.exhibition_id'));
        if(!empty($v['after'])){$q->where('id','>',$v['after']);}
        $rows=$q->orderBy('id')->limit(100)->get(['id','submitted_at','historical','type']);
        return ['data'=>$rows,'cursor'=>$rows->last()?->id,'checksum'=>hash('sha256',$rows->toJson())];
    }
}
