<?php

namespace App\Console\Commands;

use App\Services\PortalEvidence;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class ScanParticipantEvidence extends Command
{
    protected $signature = 'portal:scan-evidence {--limit=25} {--retry=} {--reason=}';

    protected $description = 'Scan bounded private quarantine rows; never publish unscanned evidence';

    public function handle(PortalEvidence $evidence): int
    {
        $evidence->assertUploadReady();
        if ($this->option('retry')) {
            $id = (string) $this->option('retry');
            $reason = (string) $this->option('reason');
            if (! Str::isUuid($id) || mb_strlen($reason) < 10 || mb_strlen($reason) > 200) {
                return self::FAILURE;
            }
            DB::transaction(function () use ($id, $reason): void {
                $row = DB::table('portal_media')->where('id', $id)->where('kind', 'evidence')->lockForUpdate()->first();
                abort_unless($row && $row->scan_status === 'unavailable', 409, 'Only unavailable evidence may be retried after scanner recovery.');
                DB::table('portal_scan_events')->insert(['file_id' => $id, 'claim_id' => null, 'outcome' => 'reviewed_retry', 'reason_hash' => hash('sha256', $reason), 'attempt' => $row->scan_attempts, 'created_at' => now()]);
                DB::table('portal_media')->where('id', $id)->update(['scan_status' => 'pending', 'scan_attempts' => 0, 'scan_due_at' => null, 'scan_claim_id' => null, 'updated_at' => now()]);
            }, 3);
            $this->line(json_encode($evidence->scan($id)));

            return self::SUCCESS;
        }
        $limit = filter_var($this->option('limit'), FILTER_VALIDATE_INT);
        if (! $limit || $limit < 1 || $limit > 100) {
            return self::FAILURE;
        }
        $rows = DB::table('portal_media')->where('kind', 'evidence')->where(fn ($query) => $query->whereNull('scan_status')->orWhereIn('scan_status', ['pending', 'unavailable', 'scanning']))
            ->where(fn ($query) => $query->whereNull('scan_due_at')->orWhere('scan_due_at', '<=', now()))
            ->orderBy('created_at')->orderBy('id')->limit($limit)->get(['id']);
        $states = [];
        foreach ($rows as $row) {
            $state = $evidence->scan($row->id)['status'];
            $states[$state] = ($states[$state] ?? 0) + 1;
        }
        $this->line(json_encode(['processed' => $rows->count(), 'states' => $states]));

        return self::SUCCESS;
    }
}
