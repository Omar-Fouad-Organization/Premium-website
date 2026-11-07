<?php

return [
    'enabled' => env('PARTICIPANT_EVIDENCE_SCANNING_ENABLED', false),
    'scanner_verified' => env('PARTICIPANT_EVIDENCE_SCANNER_VERIFIED', false),
    'sandbox' => env('PARTICIPANT_EVIDENCE_SCANNING_SANDBOX', false),
    'host' => env('PARTICIPANT_EVIDENCE_SCANNER_HOST'),
    'port' => (int) env('PARTICIPANT_EVIDENCE_SCANNER_PORT', 3310),
    'tls' => true,
    'cafile' => env('PARTICIPANT_EVIDENCE_SCANNER_CA_FILE'),
    'queue' => 'participant-evidence',
];
