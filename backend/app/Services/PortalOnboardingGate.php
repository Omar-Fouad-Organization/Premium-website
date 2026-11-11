<?php

namespace App\Services;

use Illuminate\Support\Facades\DB;

class PortalOnboardingGate
{
    public function isolated(): bool
    {
        $connection = config('database.connections.mysql');

        return app()->environment('testing') && config('database.default') === 'mysql'
            && in_array($connection['host'] ?? '', ['127.0.0.1', 'localhost'], true) && empty($connection['url'])
            && in_array($connection['database'] ?? '', ['green_life_expo_test', 'green_life_expo_phase6_ui_test'], true)
            && DB::selectOne('SELECT DATABASE() AS name')->name === $connection['database'];
    }

    public function testInvites(): bool
    {
        return config('participant_onboarding.test_invites') && $this->isolated();
    }

    public function sandbox(): bool
    {
        return config('participant_onboarding.sandbox') && $this->isolated();
    }

    public function assertActivationReady(): void
    {
        abort_unless(config('participant_portal.enabled') && config('participant_onboarding.enabled'), 503, 'Verified-email onboarding is disabled.');
        abort_unless(strlen((string) config('participant_portal.key')) >= 32, 503);
        if (! $this->sandbox()) {
            abort_unless(! config('app.debug') && in_array(config('cache.default'), ['redis', 'database', 'memcached'], true), 503, 'Protected production configuration and shared cache are required.');
        }
    }

    public function assertProof(array $proof): void
    {
        if (in_array($proof['proof_channel'] ?? '', ['verified_email', 'verified_email_sandbox'], true)) {
            if ($proof['proof_channel'] === 'verified_email_sandbox') {
                abort_unless($this->sandbox(), 503, 'Isolated sandbox proofs cannot authorize operational onboarding.');
            }
            $this->assertActivationReady();
        } else {
            abort_unless($this->testInvites(), 503, 'Raw test invitation activation is unavailable.');
        }
    }

    public function assertRecoveryReady(): void
    {
        abort_unless(config('participant_portal.enabled') && config('participant_onboarding.recovery_enabled'), 503, 'Participant recovery delivery is disabled.');
        $sandbox = $this->sandbox();
        $origin = parse_url((string) config('participant_onboarding.website_origin'));
        abort_unless($origin && ! empty($origin['host']) && empty($origin['user']) && empty($origin['pass']) && empty($origin['path']) && empty($origin['query']) && empty($origin['fragment'])
            && (($origin['scheme'] ?? '') === 'https' || ($sandbox && ($origin['scheme'] ?? '') === 'http' && in_array($origin['host'] ?? '', ['127.0.0.1', 'localhost'], true))), 503);
        $mailer = config('mail.mailers.'.config('participant_onboarding.mailer'), []);
        if ($sandbox) {
            abort_unless(($mailer['transport'] ?? '') === 'array', 503);
        } else {
            abort_unless(config('participant_onboarding.live_mail_authorized') && config('participant_onboarding.sender_approved') && config('participant_onboarding.tracking_disabled_approved'), 503);
            $from = (string) config('participant_onboarding.from_address');
            $domain = (string) config('participant_onboarding.sender_domain');
            abort_unless(filter_var($from, FILTER_VALIDATE_EMAIL) && $domain !== '' && str_ends_with(strtolower($from), '@'.strtolower($domain)), 503);
            abort_unless(($mailer['transport'] ?? '') === 'smtp' && (($mailer['scheme'] ?? '') === 'smtps' || (($mailer['scheme'] ?? '') === 'smtp' && ($mailer['require_tls'] ?? false) === true && ($mailer['auto_tls'] ?? true) === true)) && ! empty($mailer['host']) && ! empty($mailer['username']) && ! empty($mailer['password']) && ($mailer['verify_peer'] ?? true) === true, 503);
            abort_unless(! config('app.debug') && in_array(config('cache.default'), ['redis', 'database', 'memcached'], true) && in_array(config('queue.default'), ['redis', 'database', 'sqs'], true), 503);
        }
        app(PortalDeliveryCipher::class)->assertConfigured();
    }
}
