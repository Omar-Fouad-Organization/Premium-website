<?php
namespace App\Services;
use Illuminate\Support\Facades\{DB,Crypt};
class PortalOutbox
{
    public function deliver(string $id,string $identity):array
    {
        abort_unless(config('participant_portal.enabled'),503);
        // Serialize this command on a dedicated row. No business transaction spans databases.
        return DB::transaction(function()use($id,$identity){
            $user=DB::table('portal_users')->where('id',$identity)->lockForUpdate()->first();
            $row=DB::table('portal_outbox')->where('id',$id)->where('identity_id',$identity)->lockForUpdate()->first();abort_unless($row,404);
            if(in_array($row->state,['confirmed','rejected','review_required'],true))return $this->projection($row);
            $device=$row->actor_device_id?DB::table('portal_devices')->where('id',$row->actor_device_id)->where('identity_id',$identity)->where('auth_version',$row->actor_auth_version)->whereNull('revoked_at')->where('expires_at','>',now())->lockForUpdate()->first():null;
            if(!$user || !$user->active || !$user->email_verified_at || !$device || (int)$user->auth_version!==(int)$row->actor_auth_version){DB::table('portal_outbox')->where('id',$id)->update(['state'=>'review_required','result'=>Crypt::encryptString(json_encode(['message'=>'The submitting session is no longer current; organizer reconciliation is required.'])),'updated_at'=>now()]);return $this->projection(DB::table('portal_outbox')->where('id',$id)->first());}
            abort_unless($row->attempts<8,409,'Automatic retry limit reached; organizer reconciliation required.');
            if($row->next_attempt_at && now()->lt($row->next_attempt_at))return $this->projection($row);
            $attempt=$row->attempts+1;
            try{
                if($row->operation==='profile.submit')$this->checkAssets($row);
                $result=app(PortalTransport::class)->send('command',['identity_id'=>$row->identity_id,'membership_id'=>$row->membership_id,'exhibition_id'=>$row->exhibition_id,'command_id'=>$row->id,'operation'=>$row->operation,'authentication'=>['device_id'=>$row->actor_device_id,'auth_version'=>(int)$row->actor_auth_version],'payload'=>json_decode(Crypt::decryptString($row->payload),true)]);
                $this->validateAcknowledgment($row,$result);
                $state='confirmed';
            }catch(\Symfony\Component\HttpKernel\Exception\HttpException $e){
                if(in_array($e->getStatusCode(),[403,404,409,422],true)){$state=$row->attempts>0?'review_required':'rejected';$result=['message'=>$row->attempts>0?'Organizer reconciliation is required; a prior delivery outcome may be unknown.':(in_array($e->getStatusCode(),[409,422],true)?$e->getMessage():'Authority rejected this request. Refresh and review current information.')];}
                else{$state='pending';$result=null;}
            }catch(\Illuminate\Http\Client\ConnectionException){$state='pending';$result=null;}
            DB::table('portal_outbox')->where('id',$id)->update(['state'=>$state,'attempts'=>$attempt,'result'=>$result?Crypt::encryptString(json_encode($result,JSON_THROW_ON_ERROR)):null,'next_attempt_at'=>$state==='pending'?now()->addSeconds(min(3600,30*(2**$attempt))):null,'updated_at'=>now()]);
            return $this->projection(DB::table('portal_outbox')->where('id',$id)->first());
        },3);
    }
    private function projection(object $r):array{return ['id'=>$r->id,'state'=>$r->state,'result'=>$r->result?json_decode(Crypt::decryptString($r->result),true):null];}
    private function validateAcknowledgment(object $row,array $result):void
    {
        $payload=json_decode(Crypt::decryptString($row->payload),true);
        $uuid=is_string($result['id']??null)&&\Illuminate\Support\Str::isUuid($result['id']);
        $version=is_int($result['version']??null)&&$result['version']>0;
        $valid=match($row->operation){
            'profile.submit'=>$uuid&&$version&&in_array($result['status']??null,['draft','submitted','approved','changes_requested','rejected'],true),
            'invitation.respond'=>is_int($result['id']??null)&&$result['id']===($payload['match_id']??null)&&$version&&$result['version']>($payload['version']??PHP_INT_MAX)&&in_array($result['status']??null,['invitation_pending','mutually_accepted','declined'],true),
            'request.submit'=>$uuid&&($result['status']??null)==='submitted',
            'team.revoke'=>$uuid&&$result['id']===($payload['membership_id']??null)&&($result['status']??null)==='revoked',
            'membership.leave'=>$uuid&&$result['id']===$row->membership_id&&($result['status']??null)==='revoked',
            'participation.withdraw'=>is_int($result['id']??null)&&$result['id']>0&&($result['status']??null)==='withdrawn',
            default=>false,
        };
        abort_unless($valid,502,'Authority acknowledgment is invalid; the outcome remains unconfirmed.');
    }
    private function checkAssets(object $row):void
    {
        $payload=json_decode(Crypt::decryptString($row->payload),true,32,JSON_THROW_ON_ERROR);$validator=\Illuminate\Support\Facades\Validator::make($payload,['profile'=>'required|array','profile_version'=>'required|integer|min:1','profile.products'=>'sometimes|array|max:50','profile.products.*'=>'array','profile.products.*.media_id'=>'nullable|uuid','profile.certifications'=>'sometimes|array|max:30','profile.certifications.*'=>'array','profile.certifications.*.media_id'=>'nullable|uuid','profile.logo_media_id'=>'nullable|uuid']);abort_if($validator->fails(),422,'Profile asset references are invalid.');$p=$payload['profile'];$expected=[];
        foreach($p['products']??[] as $product)if(!empty($product['media_id']))$expected[$product['media_id']]='image';foreach($p['certifications']??[]as $cert)if(!empty($cert['media_id']))$expected[$cert['media_id']]='evidence';if(!empty($p['logo_media_id']))$expected[$p['logo_media_id']]='image';
        if(!$expected)return;
        $current=app(PortalTransport::class)->send('command',['identity_id'=>$row->identity_id,'membership_id'=>$row->membership_id,'exhibition_id'=>$row->exhibition_id,'operation'=>'profile','payload'=>[]]);abort_unless(is_int($current['participant_id']??null)&&is_array($current['capabilities']??null)&&is_array($current['profile']??null)&&is_int($current['version']??null),502);abort_unless(in_array('profile.submit',$current['capabilities'],true),403);abort_unless($payload['profile_version']==$current['version'],409);
        $approved=$current['profile']??[];$old=[...array_column($approved['products']??[],'media_id'),...array_column($approved['certifications']??[],'media_id'),$approved['logo_media_id']??null];
        $files=DB::table('portal_media')->whereIn('id',array_keys($expected))->where('exhibition_id',$row->exhibition_id)->where('participant_id',$current['participant_id'])->get()->keyBy('id');
        foreach($expected as $id=>$kind){$file=$files->get($id);abort_unless($file && $file->kind===$kind && (!$file->archived_at||in_array($id,$old,true)),422,'Media must belong to the authorized organization and exhibition.');if($kind==='evidence'){app(PortalEvidence::class)->assertReleased($file);}}
    }
}
