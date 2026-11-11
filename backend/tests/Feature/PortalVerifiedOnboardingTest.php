<?php

namespace Tests\Feature;

use App\Jobs\DeliverPortalRecovery;
use App\Mail\PortalRecoveryMail;
use App\Models\PortalUser;
use App\Services\PortalDeliveryCipher;
use App\Services\PortalRecoveryFailure;
use App\Services\PortalRecoveryMailer;
use App\Services\PortalRecoveryOutbox;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Queue;
use Illuminate\Support\Str;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\TestCase;

class PortalVerifiedOnboardingTest extends TestCase
{
    use RefreshDatabase;

    private function enable(): void
    {
        $this->withCredentials();
        config(['participant_portal.enabled' => true, 'participant_portal.key' => str_repeat('p', 40), 'participant_portal.peer_url' => 'http://127.0.0.1:9999',
            'participant_onboarding.enabled' => true, 'participant_onboarding.recovery_enabled' => true, 'participant_onboarding.sandbox' => true,
            'participant_onboarding.website_origin' => 'http://127.0.0.1:18891', 'participant_onboarding.mailer' => 'array',
            'participant_onboarding.from_address' => 'synthetic@example.test', 'participant_onboarding.from_name' => 'Synthetic SPACE',
            'participant_onboarding.keys.primary' => 'base64:'.base64_encode(str_repeat('w', 32))]);
        Queue::fake();
    }

    private function user(): PortalUser
    {
        $u = new PortalUser(['name' => 'Synthetic verified recipient', 'email' => 'synthetic@example.test', 'password' => 'SyntheticPortal!2026']);
        $u->id = (string) Str::uuid();
        $u->active = true;
        $u->email_verified_at = now();
        $u->save();

        return $u;
    }

    private function payload(): array
    {
        return ['name' => 'Synthetic approved recipient', 'email' => 'synthetic@example.test', 'token' => str_repeat('t', 64), 'password' => 'SyntheticPortal!2026', 'password_confirmation' => 'SyntheticPortal!2026'];
    }

    public function test_lost_acknowledgment_reconciles_original_identity_without_changing_reserved_password(): void
    {
        $this->enable();
        $p = $this->payload();
        $member = (string) Str::uuid();
        Http::fake(['*' => Http::sequence()->push(['valid' => true, 'identity_id' => null, 'proof_channel' => 'verified_email'])->push([], 503)->push(['valid' => true, 'identity_id' => null, 'proof_channel' => 'verified_email'])->push(['membership_id' => $member, 'proof_channel' => 'verified_email'])]);
        $this->postJson('/api/portal/activate', $p)->assertServiceUnavailable();
        $user = PortalUser::first();
        $originalPassword = $user->password;
        $this->assertFalse($user->active);
        $this->assertNull($user->email_verified_at);
        $this->assertDatabaseHas('portal_activation_receipts', ['identity_id' => $user->id, 'state' => 'pending']);

        $this->postJson('/api/portal/activate/reconcile', ['email' => $p['email'], 'token' => $p['token']])->assertOk()->assertJsonPath('activated', true);
        $this->assertTrue($user->fresh()->active);
        $this->assertNotNull($user->fresh()->email_verified_at);
        $this->assertSame($originalPassword, $user->fresh()->password);
        $this->assertDatabaseCount('portal_users', 1);
        $this->assertDatabaseHas('portal_activation_receipts', ['membership_id' => $member, 'state' => 'confirmed']);
    }

    public function test_preview_does_not_redeem_and_existing_verified_account_requires_authenticated_link(): void
    {
        $this->enable();
        $user = $this->user();
        $hash = $user->password;
        $p = $this->payload();
        Http::fake(fn () => Http::response(['valid' => true, 'identity_id' => null, 'proof_channel' => 'verified_email']));
        $this->postJson('/api/portal/invitations/preview', ['email' => $p['email'], 'token' => $p['token']])->assertOk()->assertJsonPath('sign_in_required', true)->assertJsonMissingPath('identity_id');
        $this->postJson('/api/portal/activate', $p)->assertConflict();
        $this->assertSame($hash, $user->fresh()->password);
        $this->assertDatabaseCount('portal_activation_receipts', 0);
        Http::assertNotSent(fn ($r) => str_ends_with($r->url(), '/activate'));
    }

    public function test_recovery_mail_is_encrypted_durable_generic_and_single_use(): void
    {
        $this->enable();
        $u = $this->user();
        Mail::fake();
        $message = $this->postJson('/api/portal/forgot-password', ['email' => $u->email, 'locale' => 'ar'])->assertOk()->json();
        $unknown = $this->postJson('/api/portal/forgot-password', ['email' => 'unknown@example.test'])->assertOk()->json();
        $this->assertSame($message, $unknown);
        $row = DB::table('portal_recovery_deliveries')->first();
        $token = app(PortalDeliveryCipher::class)->open($row->key_id, $row->secret_payload)['token'];
        $this->assertStringNotContainsString($token, $row->secret_payload);
        Mail::assertNothingSent();
        $this->assertSame('sandbox_accepted', app(PortalRecoveryOutbox::class)->deliver($row->id)['state']);
        Mail::assertSent(PortalRecoveryMail::class);
        $this->assertNull(DB::table('portal_recovery_deliveries')->value('secret_payload'));
        $device = (string) Str::uuid();
        DB::table('portal_devices')->insert(['id' => $device, 'identity_id' => $u->id, 'auth_version' => 1, 'session_hash' => hash('sha256', $device), 'expires_at' => now()->addHour(), 'last_seen_at' => now()]);
        $p = ['email' => $u->email, 'token' => $token, 'password' => 'RecoveredPortal!2026', 'password_confirmation' => 'RecoveredPortal!2026'];
        $this->postJson('/api/portal/reset-password', $p)->assertOk();
        $this->postJson('/api/portal/reset-password', $p)->assertUnprocessable();
        $this->assertTrue(Hash::check('RecoveredPortal!2026', $u->fresh()->password));
        $this->assertFalse(Hash::check('SyntheticPortal!2026', $u->fresh()->password));
        $this->assertSame(2, $u->fresh()->auth_version);
        $this->assertNotNull(DB::table('portal_devices')->value('revoked_at'));
        Queue::assertPushed(DeliverPortalRecovery::class, fn ($job) => $job->deliveryId === $row->id && ! str_contains(serialize($job), $token));
    }

    public function test_unconfigured_and_legacy_proof_paths_fail_closed(): void
    {
        $this->enable();
        Http::fake(['*' => Http::response(['valid' => true, 'identity_id' => null])]);
        $this->postJson('/api/portal/activate', $this->payload())->assertServiceUnavailable();
        $this->assertDatabaseCount('portal_users', 0);
        config(['participant_onboarding.enabled' => false]);
        $this->postJson('/api/portal/activate', $this->payload())->assertServiceUnavailable();
        Http::assertSentCount(1);
    }

    public function test_existing_account_links_a_new_invitation_only_after_login_and_preserves_password(): void
    {
        $this->enable();
        $u = $this->user();
        $hash = $u->password;
        $membership = (string) Str::uuid();
        Http::fake(fn ($r) => Http::response(str_ends_with($r->url(), '/identity-status') ? ['active' => true] : ['membership_id' => $membership, 'proof_channel' => 'verified_email']));
        $this->postJson('/api/portal/link-invitation', ['token' => str_repeat('t', 64)])->assertUnauthorized();
        $r = $this->postJson('/api/portal/login', ['email' => $u->email, 'password' => 'SyntheticPortal!2026'])->assertOk();
        $this->withUnencryptedCookie('green_life_participant_session', $r->getCookie('green_life_participant_session', false)->getValue());
        $this->postJson('/api/portal/link-invitation', ['token' => str_repeat('t', 64), 'identity_id' => (string) Str::uuid(), 'email' => 'attacker@example.test'])->assertOk()->assertJsonPath('membership_id', $membership);
        Http::assertSent(fn ($request) => str_ends_with($request->url(), '/activate') && $request->data()['identity_id'] === $u->id && $request->data()['email'] === $u->email);
        $this->assertSame($hash, $u->fresh()->password);
        $this->assertDatabaseCount('portal_users', 1);
    }

    public function test_recovery_temporary_failure_has_bounded_backoff_and_ambiguous_failure_requires_new_request(): void
    {
        $this->enable();
        $u = $this->user();
        $this->postJson('/api/portal/forgot-password', ['email' => $u->email])->assertOk();
        $row = DB::table('portal_recovery_deliveries')->first();
        $this->mock(PortalRecoveryMailer::class)->shouldReceive('send')->once()->andThrow(new PortalRecoveryFailure('temporary'));
        $this->assertSame('pending', app(PortalRecoveryOutbox::class)->deliver($row->id)['state']);
        $this->assertNotNull(DB::table('portal_recovery_deliveries')->value('secret_payload'));
        $this->travel(61)->seconds();
        $this->app->forgetInstance(PortalRecoveryOutbox::class);
        $this->mock(PortalRecoveryMailer::class)->shouldReceive('send')->once()->andThrow(new \RuntimeException('Synthetic unknown provider outcome'));
        $this->assertSame('delivery_unknown', app(PortalRecoveryOutbox::class)->deliver($row->id)['state']);
        $this->assertSame('delivery_unknown', app(PortalRecoveryOutbox::class)->deliver($row->id)['state']);
        $this->assertNull(DB::table('portal_recovery_deliveries')->value('secret_payload'));
        $this->assertSame(2, DB::table('portal_recovery_deliveries')->value('attempts'));
    }

    public function test_expired_recovery_payload_is_erased_even_after_recovery_delivery_is_disabled(): void
    {
        $this->enable();
        $u = $this->user();
        $this->postJson('/api/portal/forgot-password', ['email' => $u->email])->assertOk();
        $id = DB::table('portal_recovery_deliveries')->value('id');
        DB::table('portal_recovery_deliveries')->where('id', $id)->update(['expires_at' => now()->subSecond()]);
        config(['participant_onboarding.recovery_enabled' => false]);
        $this->artisan('portal:purge-delivery-secrets')->assertSuccessful();
        $this->assertDatabaseHas('portal_recovery_deliveries', ['id' => $id, 'state' => 'cancelled', 'secret_payload' => null]);
        $this->assertTrue($u->fresh()->active);
        $this->assertSame(1, $u->fresh()->auth_version);
    }

    public function test_sandbox_proof_cannot_be_promoted_to_operational_activation(): void
    {
        $this->enable();
        config(['participant_onboarding.sandbox' => false, 'app.debug' => false, 'cache.default' => 'database']);
        Http::fake(fn () => Http::response(['valid' => true, 'identity_id' => null, 'proof_channel' => 'verified_email_sandbox']));
        $this->postJson('/api/portal/activate', $this->payload())->assertServiceUnavailable();
        $this->assertDatabaseCount('portal_users', 0);
        Http::assertSentCount(1);
    }

    public static function recoveryTransportPolicies(): array
    {
        return ['implicit_tls' => ['smtps', true, true], 'required_starttls' => ['smtp', true, true], 'plaintext_rejected' => ['smtp', false, false]];
    }

    #[DataProvider('recoveryTransportPolicies')]
    public function test_recovery_requires_authenticated_certificate_verified_tls(string $scheme, bool $requireTls, bool $enabled): void
    {
        $this->enable();
        config(['app.debug' => false, 'cache.default' => 'database', 'queue.default' => 'database', 'participant_onboarding.sandbox' => false,
            'participant_onboarding.live_mail_authorized' => true, 'participant_onboarding.sender_approved' => true, 'participant_onboarding.tracking_disabled_approved' => true,
            'participant_onboarding.sender_domain' => 'example.test', 'participant_onboarding.mailer' => 'participant_recovery', 'participant_onboarding.website_origin' => 'https://portal.example.test',
            'mail.mailers.participant_recovery.transport' => 'smtp', 'mail.mailers.participant_recovery.scheme' => $scheme, 'mail.mailers.participant_recovery.require_tls' => $requireTls, 'mail.mailers.participant_recovery.auto_tls' => true,
            'mail.mailers.participant_recovery.verify_peer' => true, 'mail.mailers.participant_recovery.host' => 'smtp.example.test', 'mail.mailers.participant_recovery.username' => 'synthetic-only', 'mail.mailers.participant_recovery.password' => 'synthetic-placeholder-not-an-operational-credential']);
        $user = $this->user();
        $this->postJson('/api/portal/forgot-password', ['email' => $user->email])->assertOk()->assertJsonPath('delivery_enabled', $enabled);
        $this->assertDatabaseCount('portal_recovery_deliveries', $enabled ? 1 : 0);
        if ($enabled) {
            Queue::assertPushed(DeliverPortalRecovery::class);
        } else {
            Queue::assertNothingPushed();
        }
    }
}
