<?php

namespace App\Jobs;

use App\Services\PortalRecoveryOutbox;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class DeliverPortalRecovery implements ShouldQueue
{
    use Queueable;

    public int $tries = 1;

    public int $timeout = 30;

    public function __construct(public string $deliveryId) {}

    public function handle(PortalRecoveryOutbox $outbox): void
    {
        $outbox->deliver($this->deliveryId);
    }
}
