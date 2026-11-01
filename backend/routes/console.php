<?php

use App\Models\User;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Artisan::command('admin:create {email}', function () {
    $email = $this->argument('email');
    if (! filter_var($email, FILTER_VALIDATE_EMAIL) || User::where('email', $email)->exists()) {
        $this->error('Provide a valid, unused email address.');

        return 1;
    }
    $password = $this->secret('Administrator password (at least 12 characters)');
    if (! is_string($password) || strlen($password) < 12) {
        $this->error('Password must contain at least 12 characters.');

        return 1;
    }
    $user = new User(['name' => $email, 'email' => $email, 'password' => $password]);
    $user->is_admin = true;
    $user->save();
    $this->info('Administrator created.');

    return 0;
})->purpose('Create an administrator securely without a default password');
