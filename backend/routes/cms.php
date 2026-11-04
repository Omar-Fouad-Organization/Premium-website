<?php

use App\Http\Controllers\CmsGatewayController;
use App\Http\Middleware\AuthenticateCmsDelegation;
use Illuminate\Support\Facades\Route;

Route::post('internal/cms/{site}/{resource}', [CmsGatewayController::class, 'handle'])
    ->middleware([AuthenticateCmsDelegation::class, 'throttle:900,1,cms-delegation']);

Route::prefix('internal/intake')->middleware([\App\Http\Middleware\AuthenticateIntake::class,'throttle:60,1,intake-service'])->group(function(){
    $c=\App\Http\Controllers\IntakeDeliveryController::class;
    Route::post('monitor',[$c,'monitor']);Route::post('replay',[$c,'replay']);Route::post('manifest',[$c,'manifest']);
});
