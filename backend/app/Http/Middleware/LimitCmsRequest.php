<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class LimitCmsRequest
{
    /** Reject unbounded bodies before global JSON-transform middleware reads php://input. */
    public function handle(Request $request, Closure $next): Response
    {
        if ($request->is('api/internal/cms/*')) {
            $length = $request->header('Content-Length');
            abort_unless(is_string($length) && preg_match('/^[0-9]{1,8}$/', $length) && ! $request->headers->has('Transfer-Encoding'), 411, 'CMS requests require a fixed content length.');
            $limit = str_ends_with($request->path(), '/upload') ? config('cms_gateway.max_upload_bytes') : config('cms_gateway.max_json_bytes');
            abort_if((int) $length > $limit, 413, 'CMS request is too large.');
        }
        return $next($request);
    }
}
