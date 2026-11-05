<?php
require __DIR__.'/../../vendor/autoload.php';$app=require __DIR__.'/../../bootstrap/app.php';$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();
if(!app()->environment('testing')||config('database.connections.mysql.host')!=='127.0.0.1'||Illuminate\Support\Facades\DB::selectOne('SELECT DATABASE() AS name')->name!=='green_life_expo_test')throw new RuntimeException('Disposable website database required.');
config(['participant_portal.enabled'=>true]);$input=json_decode(stream_get_contents(STDIN),true,16,JSON_THROW_ON_ERROR);
app()->instance(App\Services\PortalTransport::class,new class extends App\Services\PortalTransport{public function send(string $operation,array $payload):array{Illuminate\Support\Facades\DB::table('portal_test_effects')->insert(['id'=>$payload['command_id']]);return ['id'=>1,'version'=>5,'status'=>'invitation_pending'];}});
$socket=stream_socket_client($input['barrier']);fwrite($socket,"ready\n");stream_set_timeout($socket,15);if(fgets($socket)!=="go\n")throw new RuntimeException('Barrier failed.');echo app(App\Services\PortalOutbox::class)->deliver($input['id'],$input['identity_id'])['state'];
