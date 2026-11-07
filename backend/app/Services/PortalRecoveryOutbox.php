<?php

namespace App\Services;

use App\Jobs\DeliverPortalRecovery;
use App\Models\PortalUser;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;

class PortalRecoveryOutbox
{
    public function __construct(private PortalOnboardingGate $gate, private PortalDeliveryCipher $cipher, private PortalRecoveryMailer $mailer) {}

    public function enqueue(PortalUser $user, #[\SensitiveParameter] string $token, string $locale): void
    {
        $this->gate->assertRecoveryReady();
        abort_unless($user->active && $user->email_verified_at, 403);
        $id = (string) Str::uuid();
        DB::table('portal_recovery_deliveries')->where('identity_id', $user->id)->whereIn('state', ['pending', 'sending'])
            ->update(['state' => 'cancelled', 'secret_payload' => null, 'updated_at' => now()]);
        DB::table('portal_recovery_deliveries')->insert([
            'id' => $id, 'identity_id' => $user->id, 'auth_version' => $user->auth_version, 'key_id' => config('participant_onboarding.key_id'),
            'secret_payload' => $this->cipher->seal(['token' => $token, 'locale' => $locale]),
            'expires_at' => now()->addMinutes(config('auth.passwords.portal_users.expire')), 'created_at' => now(), 'updated_at' => now(),
        ]);
        DB::afterCommit(function () use ($id): void {
            try {
                DeliverPortalRecovery::dispatch($id)->onQueue(config('participant_onboarding.queue'));
            } catch (\Throwable) {
                // The bounded recovery sweep can recover this durable intent.
            }
        });
    }

    public function deliver(string $id): array
    {
        $this->gate->assertRecoveryReady();
        $claimed = DB::transaction(function () use ($id): ?array {
            $seed = DB::table('portal_recovery_deliveries')->where('id', $id)->first();
            abort_unless($seed, 404);
            $user = PortalUser::whereKey($seed->identity_id)->lockForUpdate()->first();
            $row = DB::table('portal_recovery_deliveries')->where('id', $id)->lockForUpdate()->first();
            if ($row->state === 'sending') {
                if (now()->gte($row->lease_until)) {
                    $this->finish($row, 'delivery_unknown', null, 'lease_expired');
                }

                return null;
            }
            if ($row->state !== 'pending' || ($row->next_attempt_at && now()->lt($row->next_attempt_at))) {
                return null;
            }
            if (! $user || ! $user->active || ! $user->email_verified_at || $user->auth_version != $row->auth_version || now()->gte($row->expires_at) || ! $row->secret_payload || $row->attempts >= 5) {
                $this->finish($row, 'cancelled', null, 'identity_or_proof_no_longer_current');

                return null;
            }
            DB::table('portal_recovery_deliveries')->where('id', $id)->update(['state' => 'sending', 'attempts' => $row->attempts + 1, 'lease_until' => now()->addSeconds(90), 'updated_at' => now()]);

            return [$row, $user];
        }, 3);
        if (! $claimed) {
            return $this->status($id);
        }
        [$row,$user] = $claimed;
        try {
            $payload = $this->cipher->open($row->key_id, $row->secret_payload);
            if (! Password::broker('portal_users')->tokenExists($user, $payload['token'])) {
                $state = 'cancelled';
                $reference = null;
                $failure = 'reset_proof_superseded';
            } else {
                $url = rtrim(config('participant_onboarding.website_origin'), '/').'/#/portal/reset-password?'.http_build_query(['token' => $payload['token'], 'email' => $user->email]);
                $sent = $this->mailer->send($user->email, ['url' => $url, 'locale' => $payload['locale'], 'minutes' => config('auth.passwords.portal_users.expire')]);
                abort_unless(in_array($sent['state'] ?? '', ['provider_accepted', 'sandbox_accepted'], true), 502);
                $state = $sent['state'];
                $reference = $sent['reference'] ?? null;
                $failure = $state === 'delivery_unknown' ? 'provider_outcome_unknown' : null;
            }
        } catch (PortalRecoveryFailure $error) {
            $state = match ($error->category) {
                'temporary' => 'pending','permanent' => 'failed',default => 'delivery_unknown'
            };
            $reference = null;
            $failure = 'transport_'.$error->category;
        } catch (\Throwable) {
            $state = 'delivery_unknown';
            $reference = null;
            $failure = 'provider_outcome_unknown';
        }
        DB::transaction(function () use ($id, $state, $reference, $failure): void {
            $current = DB::table('portal_recovery_deliveries')->where('id', $id)->lockForUpdate()->first();
            if ($current->state === 'sending') {
                $this->finish($current, $state, $reference, $failure);
            }
        }, 3);

        return $this->status($id);
    }

    private function finish(object $row, string $state, ?string $reference, ?string $failure): void
    {
        if ($state === 'pending' && $row->attempts >= 5) {
            $state = 'failed';
            $failure = 'retry_exhausted';
        }
        DB::table('portal_recovery_deliveries')->where('id', $row->id)->update([
            'state' => $state, 'provider_reference' => $reference, 'failure_code' => $failure, 'secret_payload' => $state === 'pending' ? $row->secret_payload : null,
            'lease_until' => null, 'next_attempt_at' => $state === 'pending' ? now()->addSeconds(min(3600, 30 * (2 ** $row->attempts))) : null, 'updated_at' => now(),
        ]);
    }

    private function status(string $id): array
    {
        $row = DB::table('portal_recovery_deliveries')->where('id', $id)->first();

        return ['id' => $id, 'state' => $row->state, 'attempts' => $row->attempts];
    }
}
