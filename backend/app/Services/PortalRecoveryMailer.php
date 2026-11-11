<?php

namespace App\Services;

use App\Mail\PortalRecoveryMail;
use Illuminate\Support\Facades\Mail;
use Symfony\Component\Mailer\Exception\UnexpectedResponseException;

class PortalRecoveryMailer
{
    public function __construct(private PortalOnboardingGate $gate) {}

    public function send(string $recipient, #[\SensitiveParameter] array $message): array
    {
        $this->gate->assertRecoveryReady();
        try {
            $sent = Mail::mailer(config('participant_onboarding.mailer'))->to($recipient)->send(new PortalRecoveryMail($message));
        } catch (UnexpectedResponseException $exception) {
            $code = (int) $exception->getCode();
            throw new PortalRecoveryFailure($code >= 400 && $code < 500 ? 'temporary' : ($code >= 500 && $code < 600 ? 'permanent' : 'unknown'));
        }
        if ($this->gate->sandbox()) {
            return ['state' => 'sandbox_accepted', 'reference' => null];
        }
        if (! $sent) {
            throw new PortalRecoveryFailure('unknown');
        }

        return ['state' => 'provider_accepted', 'reference' => mb_substr($sent->getMessageId(), 0, 255)];
    }
}
