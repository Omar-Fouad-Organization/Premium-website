<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ResourceController;
use App\Http\Controllers\UploadController;
use Illuminate\Support\Facades\Route;

// Web middleware provides session cookies and CSRF protection for the React SPA.
Route::prefix('api')->group(function () {
    Route::get('/cms-public-config', fn () => response()->json(['branding_enabled' => (bool) config('cms_gateway.public_bindings_enabled')])->header('Cache-Control', 'no-store'));
    Route::get('/auth/csrf', fn () => response()->json(['token' => csrf_token()]));
    Route::get('/auth/me', [AuthController::class, 'me']);
    Route::post('/auth/login', [AuthController::class, 'login'])->middleware('throttle:5,1');
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::post('/admin/users', [AuthController::class, 'createUser'])->middleware('throttle:20,1');
    Route::post('/uploads', [UploadController::class, 'store'])->middleware('throttle:30,1');
    Route::get('/admin/resources/{resource}', [ResourceController::class, 'adminRead'])->middleware('throttle:cms-api');
    Route::match(['GET', 'POST', 'PATCH', 'PUT', 'DELETE'], '/resources/{resource}', [ResourceController::class, 'handle'])->middleware('throttle:cms-api');
});

Route::get('/', fn () => response()->json(['service' => 'Green Life Expo Laravel API']));
Route::get('/storage/{path}', function (string $path) {
    // Portable local previews need no Windows symlink privileges.
    abort_if(str_contains($path, '..') || str_contains($path, '\\'), 404);
    abort_unless(preg_match('#^(premium_logos|premium_photos|partner_logos)/[A-Za-z0-9._-]+\.(jpg|jpeg|png|webp|gif|ico)$#i', $path), 404);
    $disk = \Illuminate\Support\Facades\Storage::disk('public');
    abort_unless($disk->exists($path), 404);

    return $disk->response($path, headers: ['X-Content-Type-Options' => 'nosniff']);
})->where('path', '.*');

Route::prefix('api/registrations')->group(function(){
    $c=\App\Http\Controllers\PublicRegistrationController::class;
    Route::get('controls',[$c,'controls'])->middleware('throttle:60,1,registration-controls');
    Route::post('submit',[$c,'submit'])->middleware('throttle:5,1,public-registration');
    Route::post('status',[$c,'status'])->middleware('throttle:20,1,registration-receipt');
    Route::post('withdraw',[$c,'withdraw'])->middleware('throttle:5,1,registration-withdraw');
});
