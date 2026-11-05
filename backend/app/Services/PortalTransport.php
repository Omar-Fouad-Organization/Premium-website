<?php
namespace App\Services;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;
class PortalTransport
{
    public function send(string $operation,array $payload):array
    {
        abort_unless(config('participant_portal.enabled') && in_array($operation,['contexts','command','activate','activation-preflight','identity-status'],true),503);
        $origin=rtrim((string)config('participant_portal.peer_url'),'/');$url=parse_url($origin);
        $local=app()->environment(['local','testing']) && in_array($url['host']??'',['127.0.0.1','localhost'],true);
        abort_unless($url && ($url['scheme']??'')===($local?'http':'https') && empty($url['user']) && empty($url['pass']) && empty($url['path']) && empty($url['query']) && empty($url['fragment']),503,'Portal authority origin is not configured.');
        $key=config('participant_portal.key');abort_unless(is_string($key) && strlen($key)>=32,503);
        $body=json_encode($payload,JSON_THROW_ON_ERROR|JSON_UNESCAPED_SLASHES|JSON_UNESCAPED_UNICODE);abort_if(strlen($body)>65536,413);
        $target='/api/internal/participant-portal/'.$operation;
        $claims=['version'=>1,'purpose'=>'SPACE-PARTICIPANT-V1','issuer'=>'green-life-portal','audience'=>'space-participant-api','key_id'=>config('participant_portal.key_id'),'issued_at'=>time(),'expires_at'=>time()+30,'nonce'=>(string)Str::uuid(),'method'=>'POST','target'=>$target,'body_sha256'=>hash('sha256',$body)];
        $encoded=rtrim(strtr(base64_encode(json_encode($claims,JSON_THROW_ON_ERROR)),'+/','-_'),'=');
        $response=Http::connectTimeout(3)->timeout(10)->withoutRedirecting()->withOptions(['verify'=>true,'stream'=>true])->acceptJson()->withHeaders(['X-Space-Portal'=>$encoded,'X-Space-Portal-Signature'=>hash_hmac('sha256',$encoded,$key)])->withBody($body,'application/json')->post($origin.$target);
        $stream=$response->toPsrResponse()->getBody();$raw=$stream->read(262145);abort_if(strlen($raw)>262144 || !$stream->eof(),502);
        if(!$response->successful()){
            $status=in_array($response->status(),[403,404,409,422,429],true)?$response->status():503;$message='The portal authority could not confirm this request. Refresh or retry safely.';
            if(in_array($status,[409,422,429],true)){try{$error=json_decode($raw,true,16,JSON_THROW_ON_ERROR);if(is_string($error['message']??null))$message=mb_substr($error['message'],0,500);}catch(\JsonException){}}
            abort($status,$message);
        }
        try{$result=json_decode($raw,true,32,JSON_THROW_ON_ERROR);}catch(\JsonException){abort(502,'Portal authority response is invalid; no confirmation is available.');}abort_unless(is_array($result),502);return $result;
    }
}
