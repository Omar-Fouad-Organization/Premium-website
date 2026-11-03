<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('cms_delegation_nonces', function (Blueprint $table): void {
            $table->string('id', 64)->primary();
            $table->timestamp('expires_at')->index();
        });
        Schema::create('cms_gateway_audits', function (Blueprint $table): void {
            $table->id();
            $table->uuid('correlation_id')->index();
            $table->string('actor', 80);
            $table->unsignedBigInteger('exhibition_id');
            $table->string('resource', 60);
            $table->string('operation', 20);
            $table->unsignedSmallInteger('status');
            $table->timestamp('created_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('cms_gateway_audits');
        Schema::dropIfExists('cms_delegation_nonces');
    }
};
