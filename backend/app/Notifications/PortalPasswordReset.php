<?php
namespace App\Notifications;

use App\Models\PortalUser;
use App\Services\PortalRecoveryOutbox;
use Illuminate\Notifications\Notification;

class PortalPasswordReset extends Notification
{
    public function __construct(#[\SensitiveParameter] private string $token) {}

    public function via(mixed $notifiable): array
    {
        return config('participant_onboarding.recovery_enabled') ? [PortalRecoveryChannel::class] : [];
    }

    public function queueFor(PortalUser $user, PortalRecoveryOutbox $outbox): void
    {
        $outbox->enqueue($user, $this->token, $this->locale === 'ar' ? 'ar' : 'en');
    }
}
