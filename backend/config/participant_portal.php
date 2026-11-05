<?php
return ['enabled'=>env('PARTICIPANT_PORTAL_ENABLED',false),'peer_url'=>env('PARTICIPANT_PORTAL_ERP_URL'),
    'key_id'=>env('PARTICIPANT_PORTAL_KEY_ID','primary'),'key'=>env('PARTICIPANT_PORTAL_SERVICE_KEY'),
    'media_keys'=>array_filter(['primary'=>env('PARTICIPANT_PORTAL_MEDIA_KEY'),'previous'=>env('PARTICIPANT_PORTAL_MEDIA_PREVIOUS_KEY')]),'email_enabled'=>env('PARTICIPANT_PORTAL_EMAIL_ENABLED',false)];
