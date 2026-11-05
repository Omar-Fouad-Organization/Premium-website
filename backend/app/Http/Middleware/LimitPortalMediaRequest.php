<?php
namespace App\Http\Middleware;
use Closure;
use Illuminate\Http\Request;
class LimitPortalMediaRequest
{
 public function handle(Request $r,Closure $next)
 {
  if(!$r->is('api/internal/participant-portal/media/*'))return $next($r);
  abort_unless($r->isMethod('POST')&&$r->isJson(),415);$length=$r->header('Content-Length');abort_unless(is_string($length)&&ctype_digit($length)&&!$r->hasHeader('Transfer-Encoding'),411);abort_if((int)$length>4096||strlen($r->getContent())>4096,413);
  $response=$next($r);$response->headers->set('Cache-Control','no-store, private');return $response;
 }
}
