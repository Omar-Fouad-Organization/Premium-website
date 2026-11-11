<!doctype html>
<html lang="{{ $recovery['locale'] }}" dir="{{ $recovery['locale'] === 'ar' ? 'rtl' : 'ltr' }}">
<body style="background:#faf9f6;color:#25322a;font-family:Arial,sans-serif;padding:24px">
<main style="max-width:620px;margin:auto;background:white;padding:32px;border-radius:12px">
@if($recovery['locale'] === 'ar')
<h1 style="color:#2a713a">استعادة حساب بوابة المشاركين</h1>
<p>طلب شخص استعادة كلمة مرور حسابك. إذا كنت أنت، استخدم الرابط الخاص لإنشاء كلمة مرور جديدة.</p>
<p><a href="{{ $recovery['url'] }}">إعادة تعيين كلمة المرور</a></p>
<p>تنتهي صلاحية الرابط بعد {{ $recovery['minutes'] }} دقيقة. لا تشاركه مع أي شخص. لا نرسل كلمات مرور بالبريد.</p>
<p>إذا لم تطلب الاستعادة، تجاهل الرسالة. لا يغير فتح الرابط كلمة المرور أو ينهي جلساتك؛ يتم ذلك بعد التأكيد.</p>
@else
<h1 style="color:#2a713a">Participant portal account recovery</h1>
<p>Someone requested a password reset for your participant account. If this was you, use this private link to choose a new password.</p>
<p><a href="{{ $recovery['url'] }}">Reset your password</a></p>
<p>This link expires after {{ $recovery['minutes'] }} minutes. Do not share it. We never email passwords.</p>
<p>If you did not request this change, ignore the message. Opening the link does not reset your password or end your sessions; confirmation is required.</p>
@endif
</main></body></html>
