<?php

namespace App\Mail;

use Illuminate\Mail\Mailable;

class PortalRecoveryMail extends Mailable
{
    public function __construct(#[\SensitiveParameter] public array $recovery) {}

    public function build(): self
    {
        $this->subject($this->recovery['locale'] === 'ar' ? 'استعادة حساب بوابة المشاركين' : 'Participant portal account recovery');
        if (config('participant_onboarding.from_address')) {
            $this->from(config('participant_onboarding.from_address'), config('participant_onboarding.from_name'));
        }

        return $this->view('mail.portal-recovery')->text('mail.portal-recovery-text');
    }
}
