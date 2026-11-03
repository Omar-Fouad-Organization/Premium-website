<?php

return [
    'public_bindings_enabled' => env('CMS_PUBLIC_BINDINGS_ENABLED', false),
    'enabled' => env('CMS_GATEWAY_ENABLED', false),
    'issuer' => 'space-erp',
    'service' => 'space-erp-cms',
    'audience' => env('CMS_GATEWAY_AUDIENCE', 'green-life-cms'),
    'site' => 'green-life-expo',
    'exhibition_id' => env('CMS_ERP_EXHIBITION_ID'),
    'key_id' => env('CMS_GATEWAY_KEY_ID', 'primary'),
    'key' => env('CMS_GATEWAY_KEY'),
    'max_json_bytes' => 4194304,
    'max_upload_bytes' => 5242880,
    'max_response_bytes' => 8388608,
];
