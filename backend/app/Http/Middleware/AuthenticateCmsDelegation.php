<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Database\UniqueConstraintViolationException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpFoundation\Response;

class AuthenticateCmsDelegation
{
    public function handle(Request $request, Closure $next): Response
    {
        abort_unless(config('cms_gateway.enabled'), 503, 'CMS delegation is not activated.');
        $key = config('cms_gateway.key');
        abort_unless(is_string($key) && strlen($key) >= 32 && (int) config('cms_gateway.exhibition_id') > 0, 503, 'CMS delegation requires a reviewed binding.');
        $encoded = $request->header('X-Space-Delegation', '');
        $signature = $request->header('X-Space-Signature', '');
        abort_unless(strlen($encoded) <= 8192 && preg_match('/^[A-Za-z0-9_-]+$/', $encoded)
            && preg_match('/^[a-f0-9]{64}$/', $signature) && hash_equals(hash_hmac('sha256', $encoded, $key), $signature), 401, 'Invalid CMS service authentication.');
        $claims = json_decode(base64_decode(strtr($encoded, '-_', '+/'), true) ?: '', true);
        abort_unless(is_array($claims), 401, 'Invalid CMS service authentication.');
        $now = time();
        abort_unless(($claims['version'] ?? null) === 1 && ($claims['issuer'] ?? null) === config('cms_gateway.issuer')
            && ($claims['service'] ?? null) === config('cms_gateway.service') && ($claims['audience'] ?? null) === config('cms_gateway.audience')
            && ($claims['key_id'] ?? null) === config('cms_gateway.key_id') && ($claims['site'] ?? null) === config('cms_gateway.site')
            && ($claims['site'] ?? null) === $request->route('site') && ($claims['exhibition_id'] ?? null) === (int) config('cms_gateway.exhibition_id')
            && is_string($claims['actor'] ?? null) && preg_match('/^erp:[1-9][0-9]{0,18}$/', $claims['actor'])
            && is_int($claims['issued_at'] ?? null) && is_int($claims['expires_at'] ?? null)
            && $claims['issued_at'] <= $now + 5 && $claims['expires_at'] > $now
            && $claims['expires_at'] > $claims['issued_at'] && $claims['expires_at'] - $claims['issued_at'] <= 30
            && is_string($claims['nonce'] ?? null) && preg_match('/^[a-f0-9]{64}$/', $claims['nonce'])
            && is_string($claims['correlation_id'] ?? null) && preg_match('/^[a-f0-9-]{36}$/', $claims['correlation_id'])
            && is_array($claims['permissions'] ?? null) && count($claims['permissions']) <= 32
            && count(array_filter($claims['permissions'], fn ($p): bool => ! is_string($p))) === 0
            && ($claims['method'] ?? null) === $request->method() && ($claims['target'] ?? null) === $request->getRequestUri(), 401, 'Invalid or expired CMS delegation.');
        $limit = $request->route('resource') === 'upload' ? config('cms_gateway.max_upload_bytes') : config('cms_gateway.max_json_bytes');
        abort_if((int) $request->header('Content-Length', 0) > $limit, 413, 'CMS request is too large.');
        $body = $request->getContent();
        abort_if(strlen($body) > $limit, 413, 'CMS request is too large.');
        abort_unless(is_string($claims['body_sha256'] ?? null) && hash_equals(hash('sha256', $body), $claims['body_sha256']), 401, 'CMS request binding mismatch.');
        try {
            DB::table('cms_delegation_nonces')->insert(['id'=>hash('sha256', $claims['key_id'].':'.$claims['nonce']), 'expires_at'=>date('Y-m-d H:i:s', $claims['expires_at'])]);
        } catch (UniqueConstraintViolationException) {
            abort(409, 'CMS delegation has already been used.');
        }
        $request->attributes->set('cms_delegation', $claims);
        return $next($request);
    }
}
