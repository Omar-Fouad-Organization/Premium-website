<?php
namespace App\Notifications;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;
class PortalPasswordReset extends Notification
{
    public function __construct(private string $token){}
    public function via($notifiable):array{return config('participant_portal.email_enabled')?['mail']:[];}
    public function toMail($notifiable):MailMessage
    {
        return (new MailMessage)->subject('Green Life Expo portal recovery')->line('Reset your participant account password.')->action('Reset password',rtrim(config('app.url'),'/').'/#/portal/reset-password?'.http_build_query(['token'=>$this->token,'email'=>$notifiable->email]));
    }
}
