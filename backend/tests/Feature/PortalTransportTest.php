<?php

namespace Tests\Feature;

use App\Services\PortalTransport;
use GuzzleHttp\Psr7\FnStream;
use GuzzleHttp\Psr7\Utils;
use Illuminate\Support\Facades\Http;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Tests\TestCase;

class PortalTransportTest extends TestCase
{
    public function test_partial_reads_are_assembled_without_false_activation_acknowledgment_failure(): void
    {
        config(['participant_portal.enabled' => true, 'participant_portal.key' => str_repeat('p', 40), 'participant_portal.peer_url' => 'http://127.0.0.1:9999']);
        $base = Utils::streamFor('{"valid":true,"proof_channel":"verified_email"}');
        $stream = FnStream::decorate($base, ['read' => fn ($length) => $base->read(min(7, $length))]);
        Http::fake(fn () => Http::response($stream));
        $this->assertSame(['valid' => true, 'proof_channel' => 'verified_email'], app(PortalTransport::class)->send('activation-preflight', ['email' => 'synthetic@example.test', 'token' => str_repeat('t', 64)]));
        Http::assertSentCount(1);
    }

    public function test_streaming_authority_response_is_still_bounded_before_json_decoding(): void
    {
        config(['participant_portal.enabled' => true, 'participant_portal.key' => str_repeat('p', 40), 'participant_portal.peer_url' => 'http://127.0.0.1:9999']);
        Http::fake(fn () => Http::response(str_repeat('x', 262145)));
        try {
            app(PortalTransport::class)->send('contexts', ['identity_id' => 'synthetic']);
            $this->fail('Oversized authority response accepted');
        } catch (HttpException $e) {
            $this->assertSame(502, $e->getStatusCode());
        }Http::assertSentCount(1);
    }
}
