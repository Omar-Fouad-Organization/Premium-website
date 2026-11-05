<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PortalController;
Route::prefix('api/portal')->middleware('throttle:120,1,portal')->group(function(){
    $c=PortalController::class;
    Route::get('csrf',[$c,'csrf']);Route::post('login',[$c,'login'])->middleware('throttle:5,1,portal-login');
    Route::post('activate',[$c,'activate'])->middleware('throttle:5,1,portal-activate');
    Route::post('forgot-password',[$c,'forgot'])->middleware('throttle:3,1,portal-recovery');Route::post('reset-password',[$c,'reset'])->middleware('throttle:5,1,portal-reset');
    Route::middleware(\App\Http\Middleware\PortalAuthenticated::class)->group(function()use($c){
        Route::get('me',[$c,'me']);Route::post('logout',[$c,'logout']);Route::post('revoke-sessions',[$c,'revoke']);
        Route::get('sessions',[$c,'sessions']);Route::post('sessions/{id}/revoke',[$c,'revokeDevice']);
        Route::get('contexts',[$c,'contexts']);Route::post('read',[$c,'read']);Route::post('commands',[$c,'submit']);Route::get('commands',[$c,'commands']);Route::get('commands/{id}',[$c,'status']);
        Route::post('link-invitation',[$c,'link'])->middleware('throttle:5,1,portal-link');Route::post('commands/{id}/retry',[$c,'retry'])->middleware('throttle:10,1,portal-retry');
        Route::post('media',[\App\Http\Controllers\PortalMediaController::class,'store'])->middleware('throttle:10,1,portal-upload');
        Route::post('notifications/{id}/read',[$c,'readNotification']);
        Route::get('amendments/{id}',[$c,'amendment']);
        Route::get('media/{id}',[\App\Http\Controllers\PortalMediaController::class,'show']);Route::post('media/{id}/archive',[\App\Http\Controllers\PortalMediaController::class,'archive']);
    });
});
