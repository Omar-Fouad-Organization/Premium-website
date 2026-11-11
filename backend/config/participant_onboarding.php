<?php

return [
    'enabled' => env('PARTICIPANT_ONBOARDING_ENABLED', false),
    'test_invites' => env('PARTICIPANT_ONBOARDING_TEST_INVITES', false),
    'sandbox' => env('PARTICIPANT_ONBOARDING_SANDBOX', false),
    'recovery_enabled' => env('PARTICIPANT_ONBOARDING_RECOVERY_ENABLED', false),
    'live_mail_authorized' => env('PARTICIPANT_ONBOARDING_LIVE_MAIL_AUTHORIZED', false),
    'sender_approved' => env('PARTICIPANT_ONBOARDING_SENDER_APPROVED', false),
    'tracking_disabled_approved' => env('PARTICIPANT_ONBOARDING_TRACKING_DISABLED_APPROVED', false),
    'sender_domain' => env('PARTICIPANT_ONBOARDING_SENDER_DOMAIN'),
    'from_address' => env('PARTICIPANT_ONBOARDING_FROM_ADDRESS'),
    'from_name' => env('PARTICIPANT_ONBOARDING_FROM_NAME'),
    'website_origin' => env('PARTICIPANT_ONBOARDING_WEBSITE_ORIGIN'),
    'mailer' => env('PARTICIPANT_ONBOARDING_MAILER', 'participant_recovery'),
    'queue' => 'participant-recovery',
    'key_id' => env('PARTICIPANT_ONBOARDING_KEY_ID', 'primary'),
    'keys' => array_filter(['primary' => env('PARTICIPANT_ONBOARDING_DELIVERY_KEY'), 'previous' => env('PARTICIPANT_ONBOARDING_PREVIOUS_DELIVERY_KEY')]),
];
