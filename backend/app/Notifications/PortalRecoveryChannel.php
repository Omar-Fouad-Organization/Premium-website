<?php

namespace App\Notifications;

use App\Models\PortalUser;
use App\Services\PortalRecoveryOutbox;

class PortalRecoveryChannel
{
    public function __construct(private PortalRecoveryOutbox $outbox) {}

    public function send(PortalUser $notifiable, PortalPasswordReset $notification): void
    {
        $notification->queueFor($notifiable, $this->outbox);
    }
}
