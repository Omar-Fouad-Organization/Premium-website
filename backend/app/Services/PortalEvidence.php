<?php

namespace App\Services;

use App\Jobs\ScanPortalEvidence;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class PortalEvidence
{
    public function __construct(private PortalEvidenceScanner $scanner) {}

    public function assertUploadReady(): void
    {
        $this->scanner->assertAvailable();
    }

    public function dispatch(string $id): void
    {
        DB::afterCommit(function () use ($id): void {
            try {
                ScanPortalEvidence::dispatch($id)->onQueue(config('participant_scanning.queue'));
            } catch (\Throwable) {
                // The durable quarantine row remains due for the scan sweep.
            }
        });
    }

    public function assertReleased(object $file): void
    {
        if ($file->kind !== 'evidence') {
            return;
        }
        $this->scanner->assertAvailable();
        abort_unless($file->scan_status === 'clean' && $file->scanned_at && is_string($file->sha256), 423, 'Private evidence is quarantined pending a required clean scan.');
        $bytes = Storage::disk('participant_portal')->get($file->path);
        abort_unless(is_string($bytes) && hash_equals($file->sha256, hash('sha256', $bytes)), 503, 'Evidence integrity must be reviewed.');
    }

    public function scan(string $id): array
    {
        $this->scanner->assertConfigured();
        $file = DB::transaction(function () use ($id): ?object {
            $row = DB::table('portal_media')->where('id', $id)->where('kind', 'evidence')->lockForUpdate()->first();
            abort_unless($row, 404);
            if (in_array($row->scan_status, ['clean', 'infected'], true)) {
                return null;
            }
            if ($row->scan_status === 'scanning' && $row->scan_lease_until && now()->lt($row->scan_lease_until)) {
                return null;
            }
            if (($row->scan_attempts ?? 0) >= 3 || ($row->scan_due_at && now()->lt($row->scan_due_at))) {
                return null;
            }
            DB::table('portal_media')->where('id', $id)->update([
                'scan_status' => 'scanning', 'scan_attempts' => ($row->scan_attempts ?? 0) + 1,
                'scan_lease_until' => now()->addSeconds(90), 'scan_claim_id' => $row->scan_claim_id = (string) Str::uuid(), 'updated_at' => now(),
            ]);
            DB::table('portal_scan_events')->insert(['file_id' => $id, 'claim_id' => $row->scan_claim_id, 'outcome' => 'scan_claimed', 'attempt' => ($row->scan_attempts ?? 0) + 1, 'created_at' => now()]);

            return $row;
        }, 3);
        if (! $file) {
            return $this->status($id);
        }
        try {
            $raw = Storage::disk('participant_portal')->get($file->path);
            if (! is_string($raw) || strlen($raw) > 2097152 || ! str_starts_with($raw, '%PDF-')) {
                $result = ['status' => 'infected', 'reference' => null];
            } else {
                $result = $this->scanner->scan($raw);
            }
            if (! in_array($result['status'] ?? '', ['clean', 'infected', 'unavailable'], true)) {
                $result = ['status' => 'unavailable', 'reference' => null];
            }
        } catch (\Throwable) {
            $raw = null;
            $result = ['status' => 'unavailable', 'reference' => null];
        }
        $updated = DB::table('portal_media')->where('id', $id)->where('scan_claim_id', $file->scan_claim_id)->where('scan_status', 'scanning')->update([
            'scan_claim_id' => null,
            'sha256' => is_string($raw) ? hash('sha256', $raw) : $file->sha256,
            'scan_status' => $result['status'], 'scan_reference' => $result['reference'] ?? null, 'scan_lease_until' => null,
            'scanned_at' => $result['status'] === 'clean' ? now() : null,
            'scan_failure_code' => $result['status'] === 'unavailable' ? 'scanner_unavailable' : ($result['status'] === 'infected' ? 'quarantined' : null),
            'scan_due_at' => $result['status'] === 'unavailable' ? now()->addMinutes(2 ** (($file->scan_attempts ?? 0) + 1)) : null,
            'updated_at' => now(),
        ]);
        DB::table('portal_scan_events')->insert(['file_id' => $id, 'claim_id' => $file->scan_claim_id, 'outcome' => $updated ? $result['status'] : 'stale_outcome_ignored', 'attempt' => ($file->scan_attempts ?? 0) + 1, 'created_at' => now()]);

        return $this->status($id);
    }

    private function status(string $id): array
    {
        $row = DB::table('portal_media')->where('id', $id)->first();

        return ['id' => $id, 'status' => $row->scan_status ?? 'legacy_quarantine'];
    }
}
