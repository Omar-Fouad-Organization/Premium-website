<?php
namespace Tests\Feature;
use App\Models\PortalUser;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Support\Facades\{Crypt,DB,Schema};
use Illuminate\Support\Str;
use Symfony\Component\Process\Process;
use Tests\TestCase;
class PortalOutboxConcurrencyTest extends TestCase
{
 use DatabaseMigrations;
 protected function tearDown():void{Schema::dropIfExists('portal_test_effects');parent::tearDown();\Illuminate\Foundation\Testing\RefreshDatabaseState::$migrated=false;}
 public function test_two_independent_delivery_workers_send_one_effect():void{
  Schema::create('portal_test_effects',fn($t)=>$t->uuid('id')->primary());$u=new PortalUser(['name'=>'SYNTHETIC worker identity','email'=>'worker@example.test','password'=>'SyntheticWorker!2026']);$u->id=(string)Str::uuid();$u->active=true;$u->email_verified_at=now();$u->save();$id=(string)Str::uuid();
  $device=(string)Str::uuid();DB::table('portal_devices')->insert(['id'=>$device,'identity_id'=>$u->id,'session_hash'=>hash('sha256',(string)Str::uuid()),'auth_version'=>1,'expires_at'=>now()->addHour(),'last_seen_at'=>now()]);DB::table('portal_outbox')->insert(['actor_device_id'=>$device,'actor_auth_version'=>1,'id'=>$id,'identity_id'=>$u->id,'membership_id'=>(string)Str::uuid(),'exhibition_id'=>1,'operation'=>'invitation.respond','payload'=>Crypt::encryptString(json_encode(['match_id'=>1,'version'=>4,'action'=>'accept'])),'created_at'=>now(),'updated_at'=>now()]);
  $server=stream_socket_server('tcp://127.0.0.1:0');$this->assertNotFalse($server);$address='tcp://'.stream_socket_get_name($server,false);$db=config('database.connections.mysql');$env=['APP_ENV'=>'testing','APP_KEY'=>config('app.key'),'DB_CONNECTION'=>'mysql','DB_URL'=>'','DB_HOST'=>'127.0.0.1','DB_PORT'=>(string)$db['port'],'DB_DATABASE'=>'green_life_expo_test','DB_USERNAME'=>$db['username'],'DB_PASSWORD'=>$db['password'],'CACHE_STORE'=>'array'];$workers=[];$connections=[];
  try{for($i=0;$i<2;$i++){$p=new Process([PHP_BINARY,base_path('tests/Support/portal-outbox-worker.php')],base_path(),$env);$p->setInput(json_encode(['barrier'=>$address,'id'=>$id,'identity_id'=>$u->id]));$p->setTimeout(45);$p->start();$workers[]=$p;}
   foreach($workers as $worker){$c=stream_socket_accept($server,20);$this->assertNotFalse($c);stream_set_timeout($c,15);$this->assertSame("ready\n",fgets($c));$connections[]=$c;}foreach($connections as $c)fwrite($c,"go\n");
   foreach($workers as $worker){$worker->wait();$this->assertSame(0,$worker->getExitCode(),$worker->getErrorOutput());$this->assertSame('confirmed',trim($worker->getOutput()));}
   $this->assertSame(1,DB::table('portal_test_effects')->count());$this->assertSame(1,DB::table('portal_outbox')->value('attempts'));
  }finally{foreach($connections as $c)fclose($c);fclose($server);foreach($workers as $worker)if($worker->isRunning())$worker->stop();}
 }
}
