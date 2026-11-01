<?php

namespace App\Providers;

use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        RateLimiter::for('cms-api', function (Request $request) {
            $admin = $request->user()?->is_admin;
            $limit = $admin ? 300 : ($request->isMethod('GET') ? 600 : 10);

            return Limit::perMinute($limit)->by(($admin ? 'admin:'.$request->user()->id : 'public:'.$request->ip()).':'.$request->method());
        });
    }
}
