<?php
namespace App\Http\Middleware;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
class PortalAuthenticated
{
    public function handle(Request $r,Closure $next)
    {
        $u=Auth::guard('portal')->user();
        if($u)$u=$u->fresh();
        $device=$u?DB::table('portal_devices')->where('id',$r->session()->get('portal_device'))->where('identity_id',$u->id)->where('session_hash',hash('sha256',$r->session()->getId()))->where('auth_version',$u->auth_version)->whereNull('revoked_at')->where('expires_at','>',now())->first():null;
        if(!$u || !$u->active || !$u->email_verified_at || $r->session()->get('portal_auth_version')!==$u->auth_version || !$device){
            Auth::guard('portal')->logout();$r->session()->invalidate();abort(401,'Sign in to the participant portal.');
        }
        if($r->is('api/portal/me')){
            $status=app(\App\Services\PortalTransport::class)->send('identity-status',['identity_id'=>$u->id]);abort_unless(isset($status['active'])&&is_bool($status['active']),502,'Authority security response is invalid.');
            if(!$status['active']){DB::table('portal_users')->where('id',$u->id)->update(['active'=>false,'auth_version'=>DB::raw('auth_version + 1'),'updated_at'=>now()]);Auth::guard('portal')->logout();$r->session()->invalidate();abort(401,'Participant account access is revoked.');}
        }
        DB::table('portal_devices')->where('id',$device->id)->update(['last_seen_at'=>now(),'updated_at'=>now()]);
        $r->attributes->set('portal_identity',$u);return $next($r);
    }
}
