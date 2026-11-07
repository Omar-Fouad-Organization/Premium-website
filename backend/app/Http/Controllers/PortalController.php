<?php
namespace App\Http\Controllers;
use App\Models\PortalUser;
use App\Services\PortalTransport;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\{Auth,DB,Hash,Password,Crypt};
use Illuminate\Support\Str;
use Illuminate\Validation\Rules\Password as PasswordRule;
class PortalController extends Controller
{
    public function __construct(private \App\Services\PortalOnboardingGate $onboarding) {}

    public function csrf(){return response()->json(['token'=>csrf_token()]);}
    public function login(Request $r,PortalTransport $transport)
    {
        $v=$r->validate(['email'=>'required|email|max:255','password'=>'required|string|max:255']);$v['email']=strtolower($v['email']);
        abort_unless(Auth::guard('portal')->attempt([...$v,'active'=>true]),422,'Unable to sign in with those credentials.');
        $u=Auth::guard('portal')->user();if(!$u->email_verified_at){Auth::guard('portal')->logout();$r->session()->invalidate();abort(422,'Unable to sign in with those credentials.');}
        try{$status=$transport->send('identity-status',['identity_id'=>$u->id]);}catch(\Throwable $e){Auth::guard('portal')->logout();$r->session()->invalidate();throw $e;}
        abort_unless(isset($status['active']) && is_bool($status['active']),502,'Authority security response is invalid.');
        if(($status['active']??false)!==true){PortalUser::whereKey($u->id)->update(['active'=>false,'auth_version'=>DB::raw('auth_version + 1')]);Auth::guard('portal')->logout();$r->session()->invalidate();abort(403,'Participant account access has been revoked. Contact the organizer.');}
        $r->session()->regenerate();$r->session()->put('portal_auth_version',$u->auth_version);$device=(string)Str::uuid();$r->session()->put('portal_device',$device);
        DB::table('portal_devices')->insert(['id'=>$device,'identity_id'=>$u->id,'session_hash'=>hash('sha256',$r->session()->getId()),'auth_version'=>$u->auth_version,'expires_at'=>now()->addHour(),'last_seen_at'=>now(),'created_at'=>now(),'updated_at'=>now()]);return $this->user($u);
    }
    private function user(PortalUser $u):array{return ['user'=>['id'=>$u->id,'name'=>$u->name,'email'=>$u->email,'email_verified'=>true],'security'=>['session_minutes'=>60,'separate_participant_session'=>true]];}
    public function me(Request $r){return $this->user($r->attributes->get('portal_identity'));}
    public function logout(Request $r){DB::table('portal_devices')->where('id',$r->session()->get('portal_device'))->where('identity_id',$r->attributes->get('portal_identity')?->id)->update(['revoked_at'=>now(),'updated_at'=>now()]);Auth::guard('portal')->logout();$r->session()->invalidate();$r->session()->regenerateToken();return ['signed_out'=>true];}
    public function sessions(Request $r){$u=$r->attributes->get('portal_identity');return ['current'=>$r->session()->get('portal_device'),'items'=>DB::table('portal_devices')->where('identity_id',$u->id)->where('auth_version',$u->auth_version)->whereNull('revoked_at')->where('expires_at','>',now())->orderByDesc('last_seen_at')->limit(25)->get(['id','last_seen_at','expires_at'])];}
    public function revokeDevice(Request $r,string $id){$q=DB::table('portal_devices')->where('id',$id)->where('identity_id',$r->attributes->get('portal_identity')->id);abort_unless($q->exists(),404);$q->update(['revoked_at'=>now(),'updated_at'=>now()]);return ['revoked'=>true];}
    public function revoke(Request $r)
    {
        $u=$r->attributes->get('portal_identity');$r->validate(['password'=>'required|string']);abort_unless(Hash::check($r->string('password'),$u->password),422,'Password is incorrect.');
        PortalUser::whereKey($u->id)->increment('auth_version');return $this->logout($r);
    }
    public function forgot(Request $r): array
    {
        $v = $r->validate(['email'=>'required|email|max:255','locale'=>'sometimes|in:en,ar']);
        $available = false;
        try {
            $this->onboarding->assertRecoveryReady();
            $available = true;
            DB::transaction(function () use ($v): void {
                $user = PortalUser::where('email', strtolower($v['email']))->lockForUpdate()->first();
                if ($user && $user->active && $user->email_verified_at) {
                    Password::broker('portal_users')->sendResetLink(['email'=>$user->email], function (PortalUser $recipient, string $token) use ($v): void {
                        $recipient->notify((new \App\Notifications\PortalPasswordReset($token))->locale($v['locale'] ?? 'en'));
                    });
                }
            }, 3);
        } catch (\Throwable) {
            // A generic response prevents address enumeration and delivery claims.
        }
        return ['message'=>'If an eligible account exists and recovery delivery is available, recovery instructions will be sent.','delivery_enabled'=>$available];
    }
    public function reset(Request $r)
    {
        $v=$r->validate(['email'=>'required|email','token'=>'required|string|max:255','password'=>['required','confirmed','max:72',PasswordRule::min(12)->mixedCase()->numbers(),function($attribute,$value,$fail){if(strlen($value)>72)$fail('Password is too long; use a shorter passphrase.');}]]);$v['email']=strtolower($v['email']);
        $status=DB::transaction(function()use($v){$eligible=PortalUser::where('email',$v['email'])->lockForUpdate()->first();abort_unless($eligible && $eligible->active && $eligible->email_verified_at,422,'Recovery request is invalid or expired.');return Password::broker('portal_users')->reset($v,function(PortalUser $u,string $password){DB::table('portal_users')->where('id',$u->id)->update(['password'=>Hash::make($password),'auth_version'=>DB::raw('auth_version + 1'),'remember_token'=>Str::random(60),'updated_at'=>now()]);DB::table('portal_devices')->where('identity_id',$u->id)->whereNull('revoked_at')->update(['revoked_at'=>now(),'updated_at'=>now()]);DB::table('portal_recovery_deliveries')->where('identity_id',$u->id)->whereIn('state',['pending','sending'])->update(['state'=>'cancelled','secret_payload'=>null,'updated_at'=>now()]);});},3);
        abort_unless($status===Password::PASSWORD_RESET,422,'Recovery request is invalid or expired.');return ['reset'=>true];
    }
    public function activate(Request $r,PortalTransport $transport)
    {
        if (!$this->onboarding->testInvites()) { $this->onboarding->assertActivationReady(); }
        $v=$r->validate(['name'=>'required|string|max:255','email'=>'required|email|max:255','token'=>'required|string|min:40|max:255','password'=>['required','confirmed','max:72',PasswordRule::min(12)->mixedCase()->numbers(),function($attribute,$value,$fail){if(strlen($value)>72)$fail('Password is too long; use a shorter passphrase.');}]]);
        $email=strtolower($v['email']);$proof=$transport->send('activation-preflight',['email'=>$email,'token'=>$v['token']]);abort_unless(($proof['valid']??false)===true,502,'Invitation proof is invalid.');
        $this->onboarding->assertProof($proof);$bound=$proof['identity_id']??null;abort_unless($bound===null || (is_string($bound)&&Str::isUuid($bound)),502);
        $candidate=$bound??PortalUser::where('email',$email)->value('id')??(string)Str::uuid();$failure=null;
        $result=DB::transaction(function()use($v,$email,$transport,$bound,$candidate,&$failure){
            $failure=null;$u=PortalUser::where('email',$email)->lockForUpdate()->first();
            if($u){if($u->active && $u->email_verified_at){$receipt=DB::table('portal_activation_receipts')->where('identity_id',$u->id)->where('proof_hash',hash('sha256',$v['token']))->where('state','confirmed')->first();if($receipt){$confirmed=$transport->send('activate',['identity_id'=>$u->id,'email'=>$email,'token'=>$v['token']]);$this->onboarding->assertProof($confirmed);abort_unless(($confirmed['membership_id']??null)===$receipt->membership_id,502);return ['activated'=>true,'membership'=>$confirmed];}}abort_unless(!$u->active && !$u->email_verified_at,409,'Sign in to link another invitation to your existing identity.');abort_unless($bound===null || $bound===$u->id,409,'Account binding requires organizer review.');$u->name=$v['name'];$u->password=$v['password'];}
            else{abort_if(PortalUser::whereKey($candidate)->exists(),409,'Account binding requires organizer review.');$u=new PortalUser(['name'=>$v['name'],'email'=>$email,'password'=>$v['password']]);$u->id=$candidate;}
            $u->active=false;$u->activation_hash=hash('sha256',$v['token']);$u->save();
            DB::table('portal_activation_receipts')->insertOrIgnore(['id'=>(string)Str::uuid(),'identity_id'=>$u->id,'proof_hash'=>hash('sha256',$v['token']),'state'=>'pending','created_at'=>now(),'updated_at'=>now()]);
            try{$response=$transport->send('activate',['identity_id'=>$u->id,'email'=>$email,'token'=>$v['token']]);abort_unless(is_string($response['membership_id']??null)&&Str::isUuid($response['membership_id']),502,'Activation acknowledgment is invalid.');$this->onboarding->assertProof($response);}
            catch(\Throwable $e){DB::table('portal_activation_receipts')->where('identity_id',$u->id)->where('proof_hash',hash('sha256',$v['token']))->update(['last_error_code'=>$e instanceof \Symfony\Component\HttpKernel\Exception\HttpExceptionInterface?'authority_http_'.$e->getStatusCode():'authority_acknowledgment_unavailable','updated_at'=>now()]);$failure=$e;return null;}
            $u->active=true;$u->email_verified_at=now();$u->activation_hash=null;$u->save();DB::table('portal_activation_receipts')->where('identity_id',$u->id)->where('proof_hash',hash('sha256',$v['token']))->update(['state'=>'confirmed','membership_id'=>$response['membership_id'],'last_error_code'=>null,'updated_at'=>now()]);return ['activated'=>true,'membership'=>$response];
        },3);
        // Commit a retryable inactive reservation after an uncertain remote outcome, never a false activation.
        if($failure)throw $failure;return $result;
    }
    public function contexts(Request $r,PortalTransport $t){return $t->send('contexts',['identity_id'=>$r->attributes->get('portal_identity')->id]);}
    public function invitation(Request $r, PortalTransport $transport): array
    {
        if (!$this->onboarding->testInvites()) { $this->onboarding->assertActivationReady(); }
        $v=$r->validate(['email'=>'required|email|max:255','token'=>'required|string|min:40|max:255']);
        $proof=$transport->send('activation-preflight',['email'=>strtolower($v['email']),'token'=>$v['token']]);
        abort_unless(($proof['valid']??false)===true,502);$this->onboarding->assertProof($proof);
        $proof['sign_in_required']=PortalUser::where('email',strtolower($v['email']))->where('active',true)->whereNotNull('email_verified_at')->exists();
        unset($proof['identity_id']);return $proof;
    }
    public function reconcileActivation(Request $r, PortalTransport $transport): array
    {
        if (!$this->onboarding->testInvites()) { $this->onboarding->assertActivationReady(); }
        $v=$r->validate(['email'=>'required|email|max:255','token'=>'required|string|min:40|max:255']);$v['email']=strtolower($v['email']);
        $proof=$transport->send('activation-preflight',$v);abort_unless(($proof['valid']??false)===true,502);$this->onboarding->assertProof($proof);
        return DB::transaction(function () use ($v,$proof,$transport): array {
            $user=PortalUser::where('email',$v['email'])->lockForUpdate()->first();abort_unless($user,409,'Restart activation using your invitation.');
            $receipt=DB::table('portal_activation_receipts')->where('identity_id',$user->id)->where('proof_hash',hash('sha256',$v['token']))->lockForUpdate()->first();
            abort_unless($receipt && ($proof['identity_id']??$user->id)===$user->id,409,'Activation binding requires organizer review.');
            $response=$transport->send('activate',['identity_id'=>$user->id,'email'=>$v['email'],'token'=>$v['token']]);
            abort_unless(is_string($response['membership_id']??null)&&Str::isUuid($response['membership_id']),502);$this->onboarding->assertProof($response);
            $user->forceFill(['active'=>true,'email_verified_at'=>$user->email_verified_at??now(),'activation_hash'=>null])->save();
            DB::table('portal_activation_receipts')->where('id',$receipt->id)->update(['state'=>'confirmed','membership_id'=>$response['membership_id'],'last_error_code'=>null,'updated_at'=>now()]);
            return ['activated'=>true,'membership'=>$response];
        },3);
    }
    public function link(Request $r,PortalTransport $transport): array
    {
        if (!$this->onboarding->testInvites()) { $this->onboarding->assertActivationReady(); }
        $v=$r->validate(['token'=>'required|string|min:40|max:255']);$user=$r->attributes->get('portal_identity');
        $response=$transport->send('activate',['identity_id'=>$user->id,'email'=>$user->email,'token'=>$v['token']]);
        abort_unless(is_string($response['membership_id']??null)&&Str::isUuid($response['membership_id']),502);$this->onboarding->assertProof($response);return $response;
    }
    public function retry(Request $r,string $id){return app(\App\Services\PortalOutbox::class)->deliver($id,$r->attributes->get('portal_identity')->id);}
    public function read(Request $r,PortalTransport $t)
    {
        $v=$r->validate(['membership_id'=>'required|uuid','exhibition_id'=>'required|integer','operation'=>'required|in:overview,profile,categories,matches,meetings,discover,team,activity,requests','page'=>'sometimes|integer|min:1|max:10000','filters'=>'sometimes|array:search,country,sector,category','filters.search'=>'nullable|string|max:100','filters.country'=>'nullable|string|max:100','filters.sector'=>'nullable|string|max:150','filters.category'=>'nullable|integer|min:1']);
        $identity=$r->attributes->get('portal_identity')->id;$filters=$v['filters']??[];unset($v['filters']);$result=$t->send('command',[...$v,'identity_id'=>$identity,'payload'=>$filters]);
        if($v['operation']==='activity'){
            $result['items']=$result['items']??[];
            foreach($result['items'] as &$item){$source=$item['id'];$id=hash('sha256',$identity.':'.$v['membership_id'].':'.$source);DB::table('portal_notifications')->insertOrIgnore(['id'=>$id,'identity_id'=>$identity,'membership_id'=>$v['membership_id'],'exhibition_id'=>$v['exhibition_id'],'source_reference'=>$source,'created_at'=>now(),'updated_at'=>now()]);$item['id']=$id;$item['read_at']=DB::table('portal_notifications')->where('id',$id)->value('read_at');}unset($item);
        }
        if($v['operation']==='team'){
            $result['items']=$result['items']??[];$names=PortalUser::whereIn('id',array_column($result['items'],'identity_id'))->pluck('name','id');
            foreach($result['items'] as &$item){$item['name']=$names[$item['identity_id']]??'Representative';unset($item['identity_id']);}unset($item);
        }
        return $result;
    }
    public function submit(Request $r,PortalTransport $t)
    {
        $v=$r->validate(['id'=>'required|uuid','membership_id'=>'required|uuid','exhibition_id'=>'required|integer','operation'=>'required|in:profile.submit,invitation.respond,request.submit,team.revoke,participation.withdraw,membership.leave','payload'=>'present|array']);
        $identity=$r->attributes->get('portal_identity')->id;
        $device=$r->session()->get('portal_device');$authVersion=$r->attributes->get('portal_identity')->auth_version;
        $command=DB::transaction(function()use($v,$identity,$device,$authVersion){
            $old=DB::table('portal_outbox')->where('id',$v['id'])->lockForUpdate()->first();
            if($old){abort_unless($old->identity_id===$identity && $old->membership_id===$v['membership_id'] && $old->exhibition_id==$v['exhibition_id'] && $old->operation===$v['operation'] && json_decode(Crypt::decryptString($old->payload),true)===$v['payload'],409);return $old;}
            DB::table('portal_outbox')->insert(['id'=>$v['id'],'identity_id'=>$identity,'membership_id'=>$v['membership_id'],'exhibition_id'=>$v['exhibition_id'],'operation'=>$v['operation'],'actor_device_id'=>$device,'actor_auth_version'=>$authVersion,'payload'=>Crypt::encryptString(json_encode($v['payload'],JSON_THROW_ON_ERROR)),'created_at'=>now(),'updated_at'=>now()]);return DB::table('portal_outbox')->where('id',$v['id'])->first();
        });
        return app(\App\Services\PortalOutbox::class)->deliver($command->id,$identity);
    }
    public function commands(Request $r)
    {
        $v=$r->validate(['page'=>'sometimes|integer|min:1|max:10000']);$page=$v['page']??1;
        return ['page'=>$page,'per_page'=>25,'items'=>DB::table('portal_outbox')->where('identity_id',$r->attributes->get('portal_identity')->id)->orderByDesc('created_at')->offset(($page-1)*25)->limit(25)->get(['id','operation','state','attempts','next_attempt_at','created_at'])];
    }
    public function status(Request $r,string $id)
    {
        $row=DB::table('portal_outbox')->where('id',$id)->where('identity_id',$r->attributes->get('portal_identity')->id)->first();abort_unless($row,404);
        return ['id'=>$id,'state'=>$row->state,'result'=>$row->result?json_decode(Crypt::decryptString($row->result),true):null];
    }
    public function readNotification(Request $r,string $id,PortalTransport $t)
    {
        $identity=$r->attributes->get('portal_identity')->id;$row=DB::table('portal_notifications')->where('id',$id)->where('identity_id',$identity)->first();abort_unless($row,404);
        $t->send('command',['identity_id'=>$identity,'membership_id'=>$row->membership_id,'exhibition_id'=>$row->exhibition_id,'operation'=>'overview','payload'=>[]]);DB::table('portal_notifications')->where('id',$id)->update(['read_at'=>now(),'updated_at'=>now()]);return ['read'=>true];
    }
    public function amendment(Request $r,string $id,PortalTransport $t)
    {
        $v=$r->validate(['membership_id'=>'required|uuid','exhibition_id'=>'required|integer']);return $t->send('command',[...$v,'identity_id'=>$r->attributes->get('portal_identity')->id,'operation'=>'amendment','payload'=>['id'=>$id]]);
    }
}
