<?php

use Illuminate\Database\UniqueConstraintViolationException;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/cms.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->prepend(\App\Http\Middleware\LimitCmsRequest::class);
        $middleware->trimStrings(except: [fn (Request $request): bool => $request->is('api/internal/cms/*')]);
        $middleware->convertEmptyStringsToNull(except: [fn (Request $request): bool => $request->is('api/internal/cms/*')]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->render(function (UniqueConstraintViolationException $exception, Request $request) {
            if ($request->is('api/*')) {
                return response()->json(['message' => 'A record with this unique value already exists.'], 409);
            }
        });
        $exceptions->shouldRenderJsonWhen(
            fn (Request $request) => $request->is('api/*') || $request->expectsJson(),
        );
    })->create()->addAbsoluteCachePathPrefix(PHP_OS_FAMILY === 'Windows' ? substr(__DIR__, 0, 3) : '/');
