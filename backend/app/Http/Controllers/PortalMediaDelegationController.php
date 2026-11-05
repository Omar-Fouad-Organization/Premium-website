<?php
namespace App\Http\Controllers;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\{DB,Storage};
use Illuminate\Database\UniqueConstraintViolationException;
class PortalMediaDelegationController extends Controller
{
 public function read(Request $r)
 {
  abort_unless(config('participant_portal.enabled'),503);abort_if(strlen($r->getContent())>4096,413);
  $encoded=$r->header('X-Space-Portal-Media','');$signature=$r->header('X-Space-Portal-Media-Signature','');abort_unless(strlen($encoded)<=2048&&preg_match('/^[A-Za-z0-9_-]+$/D',$encoded),401);
  $c=json_decode(base64_decode(strtr($encoded,'-_','+/'),true)?:'',true,16);abort_unless(is_array($c)&&is_string($c['key_id']??null)&&in_array($c['key_id'],['primary','previous'],true),401);$key=config('participant_portal.media_keys')[$c['key_id']]??null;
  abort_unless(is_string($key)&&strlen($key)>=32&&strlen($encoded)<=2048&&preg_match('/^[A-Za-z0-9_-]+$/D',$encoded)&&preg_match('/^[a-f0-9]{64}$/D',$signature)&&hash_equals(hash_hmac('sha256',$encoded,$key),$signature),401);
  abort_unless(is_array($c)&&($c['version']??null)===1&&($c['purpose']??null)==='SPACE-PARTICIPANT-MEDIA-V1'&&($c['issuer']??null)==='space-participant-api'&&($c['audience']??null)==='green-life-portal-files'&&($c['method']??null)==='POST'&&($c['target']??null)===$r->getRequestUri()&&is_int($c['issued_at']??null)&&is_int($c['expires_at']??null)&&$c['issued_at']<=time()+5&&$c['expires_at']>time()&&$c['expires_at']>$c['issued_at']&&$c['expires_at']-$c['issued_at']<=30&&is_string($c['nonce']??null)&&preg_match('/^[a-f0-9-]{36}$/D',$c['nonce'])&&is_string($c['body_sha256']??null)&&hash_equals(hash('sha256',$r->getContent()),$c['body_sha256']),401);
  try{DB::table('portal_media_nonces')->insert(['id'=>hash('sha256',$c['nonce']),'expires_at'=>date('Y-m-d H:i:s',$c['expires_at'])]);}catch(UniqueConstraintViolationException){abort(409);}
  $v=$r->validate(['file_id'=>'required|uuid','membership_id'=>'required|uuid','participant_id'=>'required|integer','exhibition_id'=>'required|integer','employee_id'=>'required|integer']);
  $file=DB::table('portal_media')->where('id',$v['file_id'])->where('participant_id',$v['participant_id'])->where('exhibition_id',$v['exhibition_id'])->first();abort_unless($file,404);
  return Storage::disk('participant_portal')->download($file->path,$file->kind==='image'?'image.png':'evidence.pdf',['Content-Type'=>$file->mime,'Cache-Control'=>'no-store, private','X-Content-Type-Options'=>'nosniff','Content-Security-Policy'=>"default-src 'none'; sandbox"]);
 }
}
