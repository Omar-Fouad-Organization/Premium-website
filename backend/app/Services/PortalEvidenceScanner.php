<?php

namespace App\Services;

class PortalEvidenceScanner
{
    public function __construct(private PortalOnboardingGate $gate) {}

    public function assertConfigured(): void
    {
        abort_unless(config('participant_scanning.enabled') && config('participant_scanning.scanner_verified'), 503, 'Required private-evidence scanning is unavailable.');
        if (config('participant_scanning.sandbox')) {
            abort_unless($this->gate->isolated(), 503, 'Scanning sandbox is restricted to the isolated test databases.');
        }
        $host = config('participant_scanning.host');
        abort_unless(is_string($host) && preg_match('/^[a-zA-Z0-9.-]+$/D', $host) && ! str_contains($host, '..')
            && config('participant_scanning.port') > 0 && config('participant_scanning.port') <= 65535 && config('participant_scanning.tls'), 503, 'Approved TLS scanning endpoint is required.');
    }

    public function assertAvailable(): void
    {
        $this->assertConfigured();
        $host = config('participant_scanning.host');
        $options = ['verify_peer' => true, 'verify_peer_name' => true, 'peer_name' => $host];
        if (config('participant_scanning.cafile')) {
            $options['cafile'] = config('participant_scanning.cafile');
        }
        $socket = @stream_socket_client('tls://'.$host.':'.config('participant_scanning.port'), $errorNumber, $errorText, 3, STREAM_CLIENT_CONNECT, stream_context_create(['ssl' => $options]));
        abort_unless($socket, 503, 'Required private-evidence scanner is unavailable.');
        try {
            stream_set_timeout($socket, 2);
            $this->write($socket, "zPING\0", microtime(true) + 2);
            $answer = stream_get_line($socket, 64, "\0");
            abort_unless($answer === 'PONG', 503, 'Required private-evidence scanner is unavailable.');
        } finally {
            fclose($socket);
        }
    }

    public function scan(#[\SensitiveParameter] string $bytes): array
    {
        $this->assertConfigured();
        abort_if(strlen($bytes) > 2097152, 422);
        $host = config('participant_scanning.host');
        $options = ['verify_peer' => true, 'verify_peer_name' => true, 'peer_name' => $host];
        if (config('participant_scanning.cafile')) {
            $options['cafile'] = config('participant_scanning.cafile');
        }
        $socket = @stream_socket_client('tls://'.$host.':'.config('participant_scanning.port'), $errorNumber, $errorText, 3, STREAM_CLIENT_CONNECT, stream_context_create(['ssl' => $options]));
        if (! $socket) {
            return ['status' => 'unavailable', 'reference' => null];
        }
        try {
            $deadline = microtime(true) + 10;
            stream_set_timeout($socket, 1);
            $this->write($socket, "zINSTREAM\0", $deadline);
            for ($offset = 0; $offset < strlen($bytes); $offset += 8192) {
                $chunk = substr($bytes, $offset, 8192);
                $this->write($socket, pack('N', strlen($chunk)).$chunk, $deadline);
            }
            $this->write($socket, pack('N', 0), $deadline);
            $response = stream_get_line($socket, 2048, "\0");
            if ($response === 'stream: OK') {
                return ['status' => 'clean', 'reference' => 'clamd-instream'];
            }
            if (is_string($response) && str_starts_with($response, 'stream: ') && str_ends_with($response, ' FOUND')) {
                return ['status' => 'infected', 'reference' => 'clamd-instream'];
            }

            return ['status' => 'unavailable', 'reference' => null];
        } catch (\Throwable) {
            return ['status' => 'unavailable', 'reference' => null];
        } finally {
            fclose($socket);
        }
    }

    private function write(mixed $socket, #[\SensitiveParameter] string $bytes, float $deadline): void
    {
        $written = 0;
        while ($written < strlen($bytes)) {
            if (microtime(true) >= $deadline) {
                throw new \RuntimeException('Scanner deadline exceeded.');
            }
            $count = @fwrite($socket, substr($bytes, $written));
            if (! $count) {
                throw new \RuntimeException('Scanning stream unavailable.');
            }
            $written += $count;
        }
    }
}
