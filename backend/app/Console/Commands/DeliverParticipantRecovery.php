<?php

namespace App\Console\Commands;

use App\Services\PortalOnboardingGate;
use App\Services\PortalRecoveryOutbox;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class DeliverParticipantRecovery extends Command
{
    protected $signature = 'portal:deliver-recovery {--limit=25}';

    protected $description = 'Deliver bounded participant recovery intents without logging reset proofs';

    public function handle(PortalOnboardingGate $gate, PortalRecoveryOutbox $outbox): int
    {
        $gate->assertRecoveryReady();
        $limit = filter_var($this->option('limit'), FILTER_VALIDATE_INT);
        if (! $limit || $limit < 1 || $limit > 100) {
            return self::FAILURE;
        }
        $rows = DB::table('portal_recovery_deliveries')->whereIn('state', ['pending', 'sending'])->orderBy('created_at')->orderBy('id')->limit($limit)->get(['id']);
        $states = [];
        foreach ($rows as $row) {
            $state = $outbox->deliver($row->id)['state'];
            $states[$state] = ($states[$state] ?? 0) + 1;
        }
        $this->line(json_encode(['processed' => $rows->count(), 'states' => $states]));

        return self::SUCCESS;
    }
}
