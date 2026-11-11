<?php
namespace Tests\Feature;
use App\Models\{PortalUser,User};
use App\Services\{PortalTransport,PortalOutbox};
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\{Crypt,DB,Http};
use Illuminate\Support\Str;
use Tests\TestCase;
class PortalIdentityTest extends TestCase
{
    use RefreshDatabase;
    private function enable():void{$this->withCredentials();Http::fake(['http://127.0.0.1:9999/api/internal/participant-portal/identity-status'=>fn()=>Http::response(['active'=>true])]);config(['participant_portal.enabled'=>true,'participant_onboarding.test_invites'=>true,'participant_portal.key'=>str_repeat('p',40),'participant_portal.peer_url'=>'http://127.0.0.1:9999']);}
    private function user():PortalUser{$u=new PortalUser(['name'=>'SYNTHETIC participant','email'=>'participant@example.test','password'=>'SyntheticPortal!2026']);$u->id=(string)Str::uuid();$u->active=true;$u->email_verified_at=now();$u->save();return $u;}
    public function test_readiness_uses_authenticated_outbox_and_requires_authoritative_acknowledgment(): void
    {
        $this->enable();
        $user = $this->user();
        $login = $this->postJson('/api/portal/login', ['email' => $user->email, 'password' => 'SyntheticPortal!2026'])->assertOk();
        $this->withUnencryptedCookie('green_life_participant_session', $login->getCookie('green_life_participant_session', false)->getValue());
        $target = 'http://127.0.0.1:9999/api/internal/participant-portal/command';
        Http::fake([$target => Http::sequence()
            ->push(['readiness' => ['status' => 'pending', 'items' => []]])
            ->push(['id' => 17, 'version' => 1, 'status' => 'approved'])
            ->push(['id' => 17, 'version' => 1, 'status' => 'submitted'])]);
        $context = ['membership_id' => (string) Str::uuid(), 'exhibition_id' => 8];
        $this->postJson('/api/portal/read', [...$context, 'operation' => 'readiness'])->assertOk()->assertJsonPath('readiness.status', 'pending');
        $command = [...$context, 'id' => (string) Str::uuid(), 'operation' => 'readiness.submit',
            'payload' => ['requirement_id' => 7, 'requirement_version' => 1, 'version' => 0, 'response' => 'Synthetic confirmation']];
        $this->postJson('/api/portal/commands', $command)->assertOk()->assertJsonPath('state', 'pending');
        DB::table('portal_outbox')->where('id', $command['id'])->update(['next_attempt_at' => now()->subSecond()]);
        $this->postJson('/api/portal/commands', $command)->assertOk()->assertJsonPath('state', 'confirmed')->assertJsonPath('result.status', 'submitted');
        $this->postJson('/api/portal/commands', $command)->assertOk()->assertJsonPath('state', 'confirmed');
        $this->assertDatabaseCount('portal_outbox', 1);
        Http::assertSent(fn ($request) => $request->url() === $target && $request->hasHeader('X-Space-Portal-Signature')
            && $request['operation'] === 'readiness.submit' && $request['identity_id'] === $user->id
            && $request['command_id'] === $command['id']);
    }

    public function test_portal_disabled_and_cms_session_does_not_authorize_participant():void
    {
        $this->getJson('/api/portal/me')->assertStatus(503);$this->enable();
        $this->actingAs(User::factory()->create(['is_admin'=>true]));$this->getJson('/api/portal/me')->assertUnauthorized();
    }
    public function test_participant_login_uses_separate_guard_and_revokes_all_sessions():void
    {
        $this->enable();$u=$this->user();
        $response=$this->postJson('/api/portal/login',['email'=>$u->email,'password'=>'SyntheticPortal!2026'])->assertOk()->assertJsonPath('user.id',$u->id);
        $cookie=$response->getCookie('green_life_participant_session',false);$this->withUnencryptedCookie('green_life_participant_session',$cookie->getValue());
        $this->assertSame(1,DB::table('portal_sessions')->count(),'Portal session must be persisted independently.');
        $this->assertSame(DB::table('portal_devices')->value('session_hash'),hash('sha256',DB::table('portal_sessions')->value('id')),'Device must bind the final session identifier.');
        $this->getJson('/api/portal/me')->assertOk();$this->getJson('/api/portal/commands')->assertOk()->assertJsonPath('items',[]);$this->getJson('/api/admin/resources/site_settings')->assertForbidden();$this->getJson('/api/auth/me')->assertJsonPath('data.user',null);
        $this->postJson('/api/portal/revoke-sessions',['password'=>'SyntheticPortal!2026'])->assertOk();
        $this->assertSame(2,$u->fresh()->auth_version);$this->getJson('/api/portal/me')->assertUnauthorized();
    }
    public function test_activation_has_no_false_success_on_outage_and_can_retry_same_reserved_identity():void
    {
        $this->enable();$payload=['name'=>'SYNTHETIC buyer','email'=>'invite@example.test','token'=>str_repeat('t',64),'password'=>'SyntheticPortal!2026','password_confirmation'=>'SyntheticPortal!2026'];
        Http::fake(['*'=>Http::sequence()->push(['valid'=>true,'identity_id'=>null])->push([],503)->push(['valid'=>true,'identity_id'=>null])->push(['membership_id'=>(string)Str::uuid()])]);$this->postJson('/api/portal/activate',$payload)->assertStatus(503);
        $u=PortalUser::where('email',$payload['email'])->first();$this->assertFalse($u->active);$this->assertNull($u->email_verified_at);
        $this->postJson('/api/portal/login',['email'=>$u->email,'password'=>$payload['password']])->assertStatus(422);
        $this->postJson('/api/portal/activate',$payload)->assertOk();
        $this->assertSame($u->id,PortalUser::where('email',$payload['email'])->value('id'));$this->assertTrue($u->fresh()->active);
    }
    public function test_durable_command_outage_retry_and_final_state_are_distinct():void
    {
        $this->enable();$u=$this->user();$id=(string)Str::uuid();
        $device=(string)Str::uuid();DB::table('portal_devices')->insert(['id'=>$device,'identity_id'=>$u->id,'session_hash'=>hash('sha256',(string)Str::uuid()),'auth_version'=>1,'expires_at'=>now()->addHour(),'last_seen_at'=>now()]);DB::table('portal_outbox')->insert(['actor_device_id'=>$device,'actor_auth_version'=>1,'id'=>$id,'identity_id'=>$u->id,'membership_id'=>(string)Str::uuid(),'exhibition_id'=>1,'operation'=>'invitation.respond','payload'=>Crypt::encryptString(json_encode(['match_id'=>1,'version'=>4,'action'=>'accept'])),'created_at'=>now(),'updated_at'=>now()]);
        Http::fake(['*'=>Http::sequence()->push([],503)->push(['unexpected'=>'malformed acknowledgment'])->push(['id'=>1,'version'=>5,'status'=>'invitation_pending'])]);$this->assertSame('pending',app(PortalOutbox::class)->deliver($id,$u->id)['state']);
        DB::table('portal_outbox')->where('id',$id)->update(['next_attempt_at'=>now()->subSecond()]);
        $this->assertSame('pending',app(PortalOutbox::class)->deliver($id,$u->id)['state']);
        DB::table('portal_outbox')->where('id',$id)->update(['next_attempt_at'=>now()->subSecond()]);
        $this->assertSame('confirmed',app(PortalOutbox::class)->deliver($id,$u->id)['state']);
        $this->assertSame('confirmed',app(PortalOutbox::class)->deliver($id,$u->id)['state']);$this->assertSame(3,DB::table('portal_outbox')->where('id',$id)->value('attempts'));
    }
    public function test_recovery_does_not_claim_delivery_without_provider():void
    {
        $this->enable();$this->postJson('/api/portal/forgot-password',['email'=>'unknown@example.test'])->assertOk()->assertJsonPath('delivery_enabled',false);
    }
    public function test_real_cms_and_portal_cookies_remain_independent_in_both_directions():void
    {
        $this->enable();config(['session.driver'=>'database']);$this->app['session']->forgetDrivers();$this->app->forgetInstance('session.store');\Illuminate\Support\Facades\Auth::forgetGuards();
        $cms=User::factory()->create(['is_admin'=>true,'password'=>\Illuminate\Support\Facades\Hash::make('SyntheticCms!2026')]);$cmsCookie=config('session.cookie');
        $r=$this->postJson('/api/auth/login',['email'=>$cms->email,'password'=>'SyntheticCms!2026'])->assertOk();$this->withUnencryptedCookie($cmsCookie,$r->getCookie($cmsCookie,false)->getValue());
        $u=$this->user();$r=$this->postJson('/api/portal/login',['email'=>$u->email,'password'=>'SyntheticPortal!2026'])->assertOk();$cookie=$r->getCookie('green_life_participant_session',false);
        $this->assertTrue($cookie->isHttpOnly());$this->assertSame('/api/portal',$cookie->getPath());$this->assertSame('strict',$cookie->getSameSite());$this->withUnencryptedCookie('green_life_participant_session',$cookie->getValue());
        $this->getJson('/api/portal/me')->assertOk()->assertJsonPath('user.id',$u->id);$this->getJson('/api/auth/me')->assertOk()->assertJsonPath('data.user.id',$cms->id);
        $this->assertSame($cmsCookie,config('session.cookie'));$this->assertSame('sessions',config('session.table'));
        $this->postJson('/api/portal/logout',[])->assertOk();$this->getJson('/api/auth/me')->assertJsonPath('data.user.id',$cms->id);$this->getJson('/api/portal/me')->assertUnauthorized();
    }
    public function test_csrf_is_enforced_outside_the_framework_testing_bypass():void
    {
        $this->enable();$u=$this->user();$this->app->instance('env','local');
        $this->postJson('/api/portal/login',['email'=>$u->email,'password'=>'SyntheticPortal!2026'])->assertStatus(419);
        $r=$this->getJson('/api/portal/csrf')->assertOk();$token=$r->json('token');$this->withUnencryptedCookie('green_life_participant_session',$r->getCookie('green_life_participant_session',false)->getValue());
        $this->postJson('/api/portal/login',['email'=>$u->email,'password'=>'SyntheticPortal!2026'],['X-CSRF-TOKEN'=>$token])->assertOk();
    }
    public function test_server_side_account_deactivation_and_password_recovery_revoke_sessions():void
    {
        $this->enable();$u=$this->user();$r=$this->postJson('/api/portal/login',['email'=>$u->email,'password'=>'SyntheticPortal!2026'])->assertOk();$this->withUnencryptedCookie('green_life_participant_session',$r->getCookie('green_life_participant_session',false)->getValue());
        $token=\Illuminate\Support\Facades\Password::broker('portal_users')->createToken($u);$payload=['email'=>$u->email,'token'=>$token,'password'=>'RecoveredPortal!2026','password_confirmation'=>'RecoveredPortal!2026'];
        $this->postJson('/api/portal/reset-password',$payload)->assertOk();$this->postJson('/api/portal/reset-password',$payload)->assertUnprocessable();$this->getJson('/api/portal/me')->assertUnauthorized();
        $r=$this->postJson('/api/portal/login',['email'=>$u->email,'password'=>'RecoveredPortal!2026'])->assertOk();$this->withUnencryptedCookie('green_life_participant_session',$r->getCookie('green_life_participant_session',false)->getValue());$u->fresh()->forceFill(['active'=>false])->save();$this->getJson('/api/portal/me')->assertUnauthorized();
    }

 public function test_invalid_invitation_cannot_reserve_an_email_address():void{
  $this->enable();Http::fake(['*'=>Http::response(['message'=>'Invalid invitation'],403)]);
  $this->postJson('/api/portal/activate',['name'=>'SYNTHETIC invalid claimant','email'=>'victim@example.test','token'=>str_repeat('x',64),'password'=>'SyntheticPortal!2026','password_confirmation'=>'SyntheticPortal!2026'])->assertForbidden();
  $this->assertSame(0,PortalUser::where('email','victim@example.test')->count());
 }
 public function test_revoked_submitting_device_requires_reconciliation_without_delivery():void{
  $this->enable();$u=$this->user();$id=(string)Str::uuid();$device=(string)Str::uuid();
  DB::table('portal_devices')->insert(['id'=>$device,'identity_id'=>$u->id,'session_hash'=>hash('sha256',$device),'auth_version'=>1,'expires_at'=>now()->addHour(),'last_seen_at'=>now(),'revoked_at'=>now()]);
  DB::table('portal_outbox')->insert(['id'=>$id,'identity_id'=>$u->id,'membership_id'=>(string)Str::uuid(),'exhibition_id'=>1,'operation'=>'invitation.respond','payload'=>Crypt::encryptString('{}'),'actor_device_id'=>$device,'actor_auth_version'=>1,'created_at'=>now(),'updated_at'=>now()]);
  Http::fake();$this->assertSame('review_required',app(PortalOutbox::class)->deliver($id,$u->id)['state']);Http::assertNothingSent();$this->assertSame(0,DB::table('portal_outbox')->where('id',$id)->value('attempts'));
 }

 public function test_environment_name_alone_cannot_disable_secure_participant_cookies(): void
 {
  $this->enable();$response=$this->getJson('/api/portal/csrf')->assertOk();$this->assertFalse($response->getCookie('green_life_participant_session',false)->isSecure());
  $this->app->instance('env','local');$response=$this->getJson('/api/portal/csrf')->assertOk();$this->assertTrue($response->getCookie('green_life_participant_session',false)->isSecure());
 }
}
