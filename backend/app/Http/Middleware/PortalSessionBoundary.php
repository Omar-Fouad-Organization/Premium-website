<?php
namespace App\Http\Middleware;
use Closure;
use Illuminate\Http\Request;
class PortalSessionBoundary
{
    public function handle(Request $r,Closure $next)
    {
        if(!$r->is('api/portal/*'))return $next($r);
        abort_unless(config('participant_portal.enabled'),503,'Participant portal is not activated.');
        $limit=$r->is('api/portal/media')&&$r->isMethod('POST')?2200000:65536;
        abort_if((int)$r->header('Content-Length',0)>$limit||strlen($r->getContent())>$limit,413);
        $original=config('session');$manager=app('session');
        config(['session.driver'=>'database','session.connection'=>null,'session.encrypt'=>true,'session.cookie'=>'green_life_participant_session','session.path'=>'/api/portal','session.domain'=>null,'session.table'=>'portal_sessions','session.http_only'=>true,'session.same_site'=>'strict','session.secure'=>!app()->environment(['local','testing']),'session.lifetime'=>60]);
        $manager->forgetDrivers();app()->forgetInstance('session.store');\Illuminate\Support\Facades\Auth::forgetGuards();
        try{$response=$next($r);$response->headers->set('Cache-Control','no-store, private');return $response;}
        finally{config(['session'=>$original]);$manager->forgetDrivers();app()->forgetInstance('session.store');\Illuminate\Support\Facades\Auth::forgetGuards();}
    }
}
