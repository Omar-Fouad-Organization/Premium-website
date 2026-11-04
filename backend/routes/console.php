<?php

use App\Models\User;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

Artisan::command('cms:prune-nonces', function (): int {
    if (! Schema::hasTable('cms_delegation_nonces')) {
        $this->error('CMS security schema has not been installed.');
        return 1;
    }
    // Requests expire after 30 seconds. Keep an additional five-minute margin.
    // Never prune content or audit history as part of replay-store maintenance.
    $count = DB::table('cms_delegation_nonces')->where('expires_at', '<', now()->subMinutes(5))->limit(5000)->delete();
    $this->info('Expired CMS nonces pruned: '.$count);
    return 0;
})->purpose('Prune at most 5000 expired CMS replay tokens; retain all content and audits');

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


Artisan::command('intake:deliver {--limit=50}', function(): int {
    $result=app(\App\Services\SubmissionOutbox::class)->deliver((int)$this->option('limit'));
    $this->info(json_encode($result));return $result['failed']?1:0;
})->purpose('Deliver a bounded batch from the durable registration outbox');

Artisan::command('intake:prune-nonces',function(): int {
    $count=DB::table('intake_nonces')->where('expires_at','<',now()->subMinutes(5))->limit(5000)->delete();
    $this->info('Expired replay nonces: '.$count);return 0;
})->purpose('Prune expired service replay nonces only; preserve inbox, outbox and audit history');
