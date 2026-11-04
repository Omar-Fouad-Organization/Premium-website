<?php
namespace Tests\Feature;
use App\Services\{SubmissionOutbox,IntakePayload};
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\{DB,Http,Crypt};
use Illuminate\Support\Str;
use Tests\TestCase;

class PublicRegistrationTest extends TestCase
{
    use RefreshDatabase;
    private bool $open=true;
    private bool $outage=false;
    private string $remoteStatus='awaiting_processing';
    protected function setUp(): void
    {
        parent::setUp();config(['intake.enabled'=>true,'intake.exhibition_id'=>42,'intake.key'=>'SyntheticRegistrationServiceKeyForTestsOnly123456789','intake.peer_url'=>'https://erp.example.test']);
        Http::preventStrayRequests();$this->fake();
    }
    private function fake(bool $outage=false): void
    {
        $this->outage=$outage;
        Http::fake(function($r)use($outage){
            if(str_ends_with($r->url(),'/controls')) {
                $controls=[];foreach(['exhibitor','sponsor','buyer','visitor','general'] as $type){$controls[$type]=['open'=>$this->open,'dates'=>['2027-01-02'],'policy_version'=>'synthetic-v1','timezone'=>'Africa/Cairo','version'=>1];}
                return Http::response(['site'=>'green-life-expo','exhibition_id'=>42,'exhibition_name'=>'Synthetic event','controls'=>$controls]);
            }
            if($this->outage){return Http::response([],503);}
            if(str_ends_with($r->url(),'/status')){return Http::response(['status'=>$this->remoteStatus]);}
            $body=json_decode($r->body(),true);
            return Http::response(['accepted'=>true,'message_id'=>$body['message_id']??null,'source_id'=>$body['source_id']??null]);
        });
    }
    private function input(string $type='visitor'): array
    {
        return ['idempotency_key'=>Str::uuid()->toString(),'type'=>$type,'website_url'=>'','started_at'=>time()-5,
            'payload'=>['name'=>'زائر تجريبي Test','email'=>Str::random(8).'@example.test','country'=>'Brazil','country_code'=>'+55','phone'=>'11987654321','company'=>'Synthetic buyer','job_title'=>'Procurement','classification'=>'distributor','sourcing_interests'=>'Organic food','interests'=>['organic'],'language'=>'ar','message'=>'Synthetic enquiry','operational_consent'=>true,'marketing_consent'=>false,'policy_version'=>'synthetic-v1']];
    }
    private function registrationPost(string $path,array $body)
    {
        return $this->withServerVariables(['CONTENT_LENGTH'=>strlen(json_encode($body))])->postJson('/api/registrations/'.$path,$body);
    }
    public function test_all_legitimate_types_persist_source_and_outbox_atomically(): void
    {
        foreach(['visitor','buyer','speaker','exhibitor','sponsor'] as $type){$this->registrationPost('submit',$this->input($type))->assertCreated()->assertJsonPath('data.status',$type==='visitor'?'registered':'accepted');}
        $this->assertDatabaseCount('public_submissions',5);$this->assertDatabaseCount('submission_outbox',5);
        $this->assertDatabaseCount('visitor_registrations',0);$this->assertDatabaseCount('contact_submissions',0);
        $row=DB::table('public_submissions')->first();$this->assertStringNotContainsString('example.test',$row->payload);
        $p=json_decode(Crypt::decryptString($row->payload),true);$this->assertSame('Brazil',$p['country']);$this->assertFalse($p['marketing_consent']);
    }
    public function test_transport_retries_are_distinct_from_repeated_legitimate_enquiries(): void
    {
        $i=$this->input('exhibitor');$first=$this->registrationPost('submit',$i)->assertCreated()->json('data.id');
        $this->registrationPost('submit',$i)->assertOk()->assertJsonPath('data.id',$first);
        $i['payload']['message']='Changed request';$this->registrationPost('submit',$i)->assertStatus(409);
        $i['idempotency_key']=Str::uuid()->toString();$this->registrationPost('submit',$i)->assertCreated();
        $this->assertDatabaseCount('public_submissions',2);$this->assertDatabaseCount('submission_outbox',2);
    }
    public function test_closed_controls_reject_submissions_and_invalid_dates(): void
    {
        $this->open=false;$this->registrationPost('submit',$this->input())->assertForbidden();$this->assertDatabaseCount('public_submissions',0);
        $this->open=true;$i=$this->input();$i['payload']['visit_date']='2028-01-01';$this->registrationPost('submit',$i)->assertUnprocessable();
    }
    public function test_consent_honeypot_and_input_bounds_are_enforced(): void
    {
        $i=$this->input('buyer');$i['payload']['operational_consent']=false;$this->registrationPost('submit',$i)->assertUnprocessable();
        $i=$this->input();$i['website_url']='spam';$this->registrationPost('submit',$i)->assertUnprocessable();
        $i=$this->input();$i['started_at']=time();$this->registrationPost('submit',$i)->assertUnprocessable();
        $i=$this->input();$i['payload']['message']=str_repeat('a',70000);$this->registrationPost('submit',$i)->assertStatus(413);
    }
    public function test_outbox_survives_erp_outage_and_recovers_with_same_message(): void
    {
        $this->registrationPost('submit',$this->input())->assertCreated();$id=DB::table('submission_outbox')->value('id');
        $this->fake(true);$this->assertSame(['delivered'=>0,'failed'=>1],app(SubmissionOutbox::class)->deliver());
        $this->assertDatabaseHas('submission_outbox',['id'=>$id,'status'=>'retry']);
        $this->fake();app(SubmissionOutbox::class)->replay($id,'erp:1');$this->assertSame(['delivered'=>1,'failed'=>0],app(SubmissionOutbox::class)->deliver());
        $this->assertDatabaseHas('submission_outbox',['id'=>$id,'status'=>'delivered','attempts'=>2]);$this->assertDatabaseCount('submission_delivery_audits',1);
    }
    public function test_failure_to_enqueue_rolls_back_the_accepted_source(): void
    {
        $mock=\Mockery::mock(SubmissionOutbox::class);$mock->shouldReceive('enqueue')->once()->andThrow(new \RuntimeException('Synthetic outbox failure'));
        $this->app->instance(SubmissionOutbox::class,$mock);$this->registrationPost('submit',$this->input())->assertStatus(500);
        $this->assertDatabaseCount('public_submissions',0);
    }
    public function test_delivery_monitor_worker_and_replay_are_bound_to_the_configured_exhibition(): void
    {
        $this->registrationPost('submit',$this->input())->assertCreated();
        $id=DB::table('submission_outbox')->value('id');
        config(['intake.exhibition_id'=>43]);
        $this->assertSame(['delivered'=>0,'failed'=>0],app(SubmissionOutbox::class)->deliver());
        $monitor=app(\App\Http\Controllers\IntakeDeliveryController::class)->monitor();
        $this->assertCount(0,$monitor['data']);$this->assertCount(0,$monitor['counts']);
        try {app(SubmissionOutbox::class)->replay($id,'erp:1');$this->fail('Cross-event replay was accepted.');}
        catch(\Symfony\Component\HttpKernel\Exception\HttpException $exception){$this->assertSame(404,$exception->getStatusCode());}
        $this->assertDatabaseHas('submission_outbox',['id'=>$id,'status'=>'pending','attempts'=>0]);
        $this->assertDatabaseCount('submission_delivery_audits',0);
    }
    public function test_receipt_is_required_and_withdrawal_is_idempotent(): void
    {
        $receipt=$this->registrationPost('submit',$this->input())->assertCreated()->json('data');
        $this->registrationPost('status',['id'=>$receipt['id'],'token'=>str_repeat('0',64)])->assertNotFound();
        $auth=['id'=>$receipt['id'],'token'=>$receipt['receipt_token']];
        $this->registrationPost('withdraw',$auth)->assertOk()->assertJsonPath('data.status','withdrawn');$this->registrationPost('withdraw',$auth)->assertOk();
        $this->assertDatabaseCount('submission_outbox',2);$this->registrationPost('status',$auth)->assertOk()->assertJsonPath('data.status','withdrawn');
        $this->assertSame(hash('sha256',$receipt['receipt_token']),DB::table('public_submissions')->value('receipt_hash'));
    }
    public function test_private_data_is_not_exposed_by_cms_or_old_submission_route(): void
    {
        foreach(['public_submissions','submission_outbox','contact_submissions','visitor_registrations'] as $table){$this->getJson('/api/resources/'.$table)->assertStatus(in_array($table,['public_submissions','submission_outbox'])?404:403);}
        $this->postJson('/api/resources/contact_submissions',['records'=>[['name'=>'Test']]])->assertStatus(409);
    }
    public function test_historical_import_is_dry_run_by_default_and_restart_safe(): void
    {
        $id=Str::uuid()->toString();
        DB::table('visitor_registrations')->insert(['id'=>$id,'name'=>'Legacy synthetic visitor','email'=>'legacy@example.test','country'=>'France','created_at'=>'2025-01-01 12:00:00','updated_at'=>'2025-01-01 12:00:00']);
        $this->artisan('intake:reconcile-history',['table'=>'visitor_registrations','--exhibition'=>42])->assertSuccessful();
        $this->assertDatabaseCount('public_submissions',0);
        $args=['table'=>'visitor_registrations','--exhibition'=>42,'--apply'=>true];
        $this->artisan('intake:reconcile-history',$args)->assertSuccessful();$this->artisan('intake:reconcile-history',$args)->assertSuccessful();
        $this->assertDatabaseCount('public_submissions',1);$this->assertDatabaseCount('submission_outbox',1);
        $this->assertDatabaseHas('public_submissions',['id'=>$id,'type'=>'visitor_interest','historical'=>true,'submitted_at'=>'2025-01-01 12:00:00']);
        $this->assertDatabaseHas('visitor_registrations',['id'=>$id,'name'=>'Legacy synthetic visitor','created_at'=>'2025-01-01 12:00:00']);
        $p=json_decode(Crypt::decryptString(DB::table('public_submissions')->value('payload')),true);$this->assertSame($id,$p['legacy_original']['id']);$this->assertFalse($p['operational_consent']);
    }
    public function test_unexpired_delivery_lease_prevents_another_worker_and_manual_replay(): void
    {
        $this->registrationPost('submit',$this->input())->assertCreated();$id=DB::table('submission_outbox')->value('id');
        DB::table('submission_outbox')->where('id',$id)->update(['lease_token'=>Str::uuid()->toString(),'lease_until'=>now()->addMinute()]);
        $this->assertSame(['delivered'=>0,'failed'=>0],app(SubmissionOutbox::class)->deliver());
        $this->expectException(\Symfony\Component\HttpKernel\Exception\HttpException::class);app(SubmissionOutbox::class)->replay($id,'erp:1');
    }
    public function test_visitor_acceptance_is_registered_even_while_delivery_is_pending_or_unavailable(): void
    {
        $input=$this->input();$receipt=$this->registrationPost('submit',$input)->assertCreated()->assertJsonPath('data.status','registered')->assertJsonPath('data.delivery_status','pending')->json('data');
        $this->assertDatabaseHas('public_submissions',['id'=>$receipt['id'],'registration_status'=>'registered','visitor_registration_version'=>1]);
        $envelope=json_decode(Crypt::decryptString(DB::table('submission_outbox')->value('envelope')),true);
        $this->assertSame(1,$envelope['visitor_registration_version']);
        $auth=['id'=>$receipt['id'],'token'=>$receipt['receipt_token']];
        $this->registrationPost('status',$auth)->assertOk()->assertJsonPath('data.status','registered');
        $this->fake(true);$this->registrationPost('status',$auth)->assertOk()->assertJsonPath('data.status','registered');
        $this->registrationPost('submit',$input)->assertOk()->assertJsonPath('data.status','registered');
        $this->registrationPost('withdraw',$auth)->assertOk()->assertJsonPath('data.status','withdrawn');
        $this->registrationPost('submit',$input)->assertOk()->assertJsonPath('data.status','withdrawn');
    }
    public function test_observed_cancellation_never_downgrades_during_outage_or_late_registered_status(): void
    {
        $receipt=$this->registrationPost('submit',$this->input())->assertCreated()->json('data');
        $auth=['id'=>$receipt['id'],'token'=>$receipt['receipt_token']];$this->remoteStatus='cancelled';
        $this->registrationPost('status',$auth)->assertOk()->assertJsonPath('data.status','cancelled');
        $this->fake(true);$this->registrationPost('status',$auth)->assertOk()->assertJsonPath('data.status','cancelled');
        $this->fake();$this->remoteStatus='registered';$this->registrationPost('status',$auth)->assertOk()->assertJsonPath('data.status','cancelled');
        $this->assertDatabaseHas('public_submissions',['id'=>$receipt['id'],'registration_status'=>'cancelled']);
    }
    public function test_legacy_visitor_receipts_and_buyer_applications_are_not_automatically_verified(): void
    {
        $receipt=$this->registrationPost('submit',$this->input())->assertCreated()->json('data');
        DB::table('public_submissions')->where('id',$receipt['id'])->update(['registration_status'=>null,'visitor_registration_version'=>null]);
        $this->remoteStatus='confirmed';$this->registrationPost('status',['id'=>$receipt['id'],'token'=>$receipt['receipt_token']])->assertOk()->assertJsonPath('data.status','legacy_requires_review');
        $buyer=$this->registrationPost('submit',$this->input('buyer'))->assertCreated()->assertJsonPath('data.status','accepted')->json('data');
        $this->assertDatabaseHas('public_submissions',['id'=>$buyer['id'],'registration_status'=>null,'visitor_registration_version'=>null]);
        $this->fake(true);
        $this->registrationPost('status',['id'=>$buyer['id'],'token'=>$buyer['receipt_token']])->assertOk()->assertJsonPath('data.status','accepted_awaiting_processing');
    }

}
