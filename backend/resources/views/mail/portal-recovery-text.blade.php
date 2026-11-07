@if($recovery['locale'] === 'ar')
استعادة حساب بوابة المشاركين. لا تشارك الرابط الخاص. إذا لم تطلب التغيير، تجاهل الرسالة.
@else
Participant portal recovery. Keep this link private. Ignore this message if you did not request the change.
@endif
{{ $recovery['url'] }}
{{ $recovery['minutes'] }}
