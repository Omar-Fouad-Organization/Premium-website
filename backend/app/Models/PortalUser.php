<?php
namespace App\Models;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
class PortalUser extends Authenticatable
{
    use Notifiable;
    public $incrementing=false; protected $keyType='string';
    protected $fillable=['name','email','password']; protected $hidden=['password','remember_token','activation_hash'];
    protected function casts():array{return ['active'=>'boolean','password'=>'hashed','email_verified_at'=>'datetime'];}
    public function sendPasswordResetNotification($token):void
    {
        $this->notify(new \App\Notifications\PortalPasswordReset($token));
    }
}
