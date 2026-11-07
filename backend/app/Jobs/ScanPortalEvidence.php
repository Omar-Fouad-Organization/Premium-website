<?php

namespace App\Jobs;

use App\Services\PortalEvidence;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class ScanPortalEvidence implements ShouldQueue
{
    use Queueable;

    public int $tries = 1;

    public int $timeout = 30;

    public function __construct(public string $fileId) {}

    public function handle(PortalEvidence $evidence): void
    {
        $evidence->scan($this->fileId);
    }
}
