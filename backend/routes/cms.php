<?php

use App\Http\Controllers\CmsGatewayController;
use App\Http\Middleware\AuthenticateCmsDelegation;
use Illuminate\Support\Facades\Route;

Route::post('internal/cms/{site}/{resource}', [CmsGatewayController::class, 'handle'])
    ->middleware([AuthenticateCmsDelegation::class, 'throttle:900,1,cms-delegation']);
