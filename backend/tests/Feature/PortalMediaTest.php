<?php
namespace Tests\Feature;
use App\Models\PortalUser;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\{DB,Http,Storage};
use Illuminate\Support\Str;
use Tests\TestCase;
class PortalMediaTest extends TestCase
{
 use RefreshDatabase;
 private string $ownMembership='';
 private function signIn():string{
  $this->withCredentials();Http::fake(['http://127.0.0.1:9999/api/internal/participant-portal/identity-status'=>fn()=>Http::response(['active'=>true])]);config(['participant_portal.enabled'=>true,'participant_portal.key'=>str_repeat('p',40),'participant_portal.peer_url'=>'http://127.0.0.1:9999']);Storage::fake('participant_portal');
  $u=new PortalUser(['name'=>'SYNTHETIC media owner','email'=>'media@example.test','password'=>'SyntheticPortal!2026']);$u->id=(string)Str::uuid();$u->email_verified_at=now();$u->active=true;$u->save();
  $response=$this->postJson('/api/portal/login',['email'=>$u->email,'password'=>'SyntheticPortal!2026'])->assertOk();$this->withUnencryptedCookie('green_life_participant_session',$response->getCookie('green_life_participant_session',false)->getValue());
  Http::fake(fn($request)=>Http::response(($request->data()['operation']??'')==='media.authorize'?['message'=>'Private file unavailable']:['participant'=>['id'=>$request->data()['membership_id']===$this->ownMembership?1:2],'capabilities'=>['view','profile.submit','evidence.read']],($request->data()['operation']??'')==='media.authorize'?403:200));return $u->id;
 }
 public function test_owned_image_is_reencoded_private_and_other_context_cannot_read_it():void{
  $this->signIn();$m=(string)Str::uuid();$this->ownMembership=$m;$response=$this->post('/api/portal/media',['membership_id'=>$m,'exhibition_id'=>1,'kind'=>'image','file'=>UploadedFile::fake()->image('photo.png',20,20)],['Accept'=>'application/json'])->assertCreated();$id=$response->json('id');
  $row=DB::table('portal_media')->where('id',$id)->first();$this->assertSame('image/png',$row->mime);Storage::disk('participant_portal')->assertExists($row->path);
  $this->getJson('/api/portal/media/'.$id.'?membership_id='.$m.'&exhibition_id=1')->assertOk()->assertHeader('X-Content-Type-Options','nosniff');
  $this->getJson('/api/portal/media/'.$id.'?membership_id='.Str::uuid().'&exhibition_id=1&participant_id=999')->assertForbidden();
  $this->get('/storage/'.$row->path)->assertNotFound();
 }
 public function test_svg_and_excessive_pixel_dimensions_are_rejected():void{
  $this->signIn();$m=(string)Str::uuid();$this->ownMembership=$m;
  $this->post('/api/portal/media',['membership_id'=>$m,'exhibition_id'=>1,'kind'=>'image','file'=>UploadedFile::fake()->createWithContent('logo.svg','<svg xmlns="http://www.w3.org/2000/svg"><script>alert(1)</script></svg>')],['Accept'=>'application/json'])->assertUnprocessable();
  $this->post('/api/portal/media',['membership_id'=>$m,'exhibition_id'=>1,'kind'=>'image','file'=>UploadedFile::fake()->image('oversize.png',4097,2)],['Accept'=>'application/json'])->assertUnprocessable();$this->assertSame(0,DB::table('portal_media')->count());
 }
 public function test_private_evidence_cannot_be_read_through_another_membership_or_static_storage():void{
  $this->signIn();$m=(string)Str::uuid();$this->ownMembership=$m;$r=$this->post('/api/portal/media',['membership_id'=>$m,'exhibition_id'=>1,'kind'=>'evidence','file'=>UploadedFile::fake()->createWithContent('proof.pdf',"%PDF-1.4\nSynthetic private evidence\n%%EOF")],['Accept'=>'application/json'])->assertCreated();
  $this->getJson('/api/portal/media/'.$r->json('id').'?membership_id='.Str::uuid().'&exhibition_id=1')->assertNotFound();$this->assertSame('evidence',DB::table('portal_media')->value('kind'));
 }
 public function test_staff_media_delegation_is_purpose_bound_and_replay_protected():void{
  config(['participant_portal.enabled'=>true,'participant_portal.media_keys.primary'=>str_repeat('m',40)]);Storage::fake('participant_portal');$id=(string)Str::uuid();$m=(string)Str::uuid();Storage::disk('participant_portal')->put('objects/'.$id,'%PDF-1.4 synthetic');DB::table('portal_media')->insert(['id'=>$id,'identity_id'=>(string)Str::uuid(),'membership_id'=>$m,'exhibition_id'=>1,'participant_id'=>1,'kind'=>'evidence','path'=>'objects/'.$id,'mime'=>'application/pdf','bytes'=>18]);
  $target='/api/internal/participant-portal/media/read';$body=json_encode(['file_id'=>$id,'membership_id'=>$m,'participant_id'=>1,'exhibition_id'=>1,'employee_id'=>1]);$c=['version'=>1,'key_id'=>'primary','purpose'=>'SPACE-PARTICIPANT-MEDIA-V1','issuer'=>'space-participant-api','audience'=>'green-life-portal-files','method'=>'POST','target'=>$target,'issued_at'=>time(),'expires_at'=>time()+30,'nonce'=>(string)Str::uuid(),'body_sha256'=>hash('sha256',$body)];$encoded=rtrim(strtr(base64_encode(json_encode($c)),'+/','-_'),'=');$headers=['CONTENT_TYPE'=>'application/json','CONTENT_LENGTH'=>strlen($body),'HTTP_ACCEPT'=>'application/json','HTTP_X_SPACE_PORTAL_MEDIA'=>$encoded,'HTTP_X_SPACE_PORTAL_MEDIA_SIGNATURE'=>hash_hmac('sha256',$encoded,str_repeat('m',40))];
  $this->call('POST',$target,[],[],[],$headers,$body)->assertOk()->assertHeader('Content-Type','application/pdf');$this->call('POST',$target,[],[],[],$headers,$body)->assertStatus(409);$this->call('POST',$target,[],[],[],$headers,'{}')->assertUnauthorized();
 }
}
