<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('portal_activation_receipts', function (Blueprint $table): void {
            $table->uuid('id')->primary();
            $table->uuid('identity_id')->index();
            $table->string('proof_hash', 64)->unique();
            $table->string('state', 24)->default('pending');
            $table->uuid('membership_id')->nullable();
            $table->string('last_error_code', 64)->nullable();
            $table->timestamps();
        });
        Schema::create('portal_recovery_deliveries', function (Blueprint $table): void {
            $table->uuid('id')->primary();
            $table->uuid('identity_id')->index();
            $table->unsignedInteger('auth_version');
            $table->string('key_id', 24);
            $table->longText('secret_payload')->nullable();
            $table->string('state', 32)->default('pending');
            $table->unsignedInteger('attempts')->default(0);
            $table->timestamp('next_attempt_at')->nullable();
            $table->timestamp('lease_until')->nullable();
            $table->timestamp('expires_at');
            $table->string('provider_reference', 255)->nullable();
            $table->string('failure_code', 64)->nullable();
            $table->timestamps();
            $table->index(['state', 'next_attempt_at'], 'portal_recovery_delivery_due');
        });
        Schema::create('portal_scan_events', function (Blueprint $table): void {
            $table->id();
            $table->uuid('file_id')->index();
            $table->uuid('claim_id')->nullable();
            $table->string('reason_hash', 64)->nullable();
            $table->string('outcome', 32);
            $table->unsignedInteger('attempt');
            $table->timestamp('created_at');
        });
        Schema::table('portal_media', function (Blueprint $table): void {
            $table->string('sha256', 64)->nullable();
            $table->string('scan_status', 24)->nullable();
            $table->unsignedInteger('scan_attempts')->nullable();
            $table->timestamp('scan_due_at')->nullable();
            $table->timestamp('scan_lease_until')->nullable();
            $table->uuid('scan_claim_id')->nullable();
            $table->timestamp('scanned_at')->nullable();
            $table->string('scan_reference', 255)->nullable();
            $table->string('scan_failure_code', 64)->nullable();
            $table->index(['scan_status', 'scan_due_at'], 'portal_media_scan_due');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('portal_media', function (Blueprint $table): void {
            $table->dropIndex('portal_media_scan_due');
            $table->dropColumn(['sha256', 'scan_status', 'scan_attempts', 'scan_due_at', 'scan_lease_until', 'scan_claim_id', 'scanned_at', 'scan_reference', 'scan_failure_code']);
        });
        Schema::dropIfExists('portal_scan_events');
        Schema::dropIfExists('portal_recovery_deliveries');
        Schema::dropIfExists('portal_activation_receipts');
    }
};
