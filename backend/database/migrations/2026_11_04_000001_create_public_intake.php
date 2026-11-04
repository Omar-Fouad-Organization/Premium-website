<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration {
    public function up(): void
    {
        Schema::create('intake_nonces',function(Blueprint $t){$t->char('id',64)->primary();$t->timestamp('expires_at')->index();});
        Schema::create('public_submissions',function(Blueprint $t){
            $t->uuid('id')->primary();$t->uuid('idempotency_key')->unique();$t->char('payload_hash',64);$t->string('site',80);$t->unsignedBigInteger('exhibition_id');$t->string('type',30);
            $t->string('source_form',80);$t->longText('payload');$t->boolean('historical')->default(false);$t->string('legacy_table',80)->nullable();$t->timestamp('submitted_at');
            $t->char('receipt_hash',64)->nullable();$t->timestamp('receipt_expires_at')->nullable();$t->timestamp('withdrawn_at')->nullable();$t->timestamp('redacted_at')->nullable();$t->timestamps();
            $t->index(['site','exhibition_id','submitted_at']);
        });
        Schema::create('submission_outbox',function(Blueprint $t){
            $t->uuid('id')->primary();$t->uuid('submission_id');$t->foreign('submission_id')->references('id')->on('public_submissions')->restrictOnDelete();
            $t->string('event',30);$t->longText('envelope');$t->char('payload_hash',64);$t->unsignedInteger('attempts')->default(0);$t->string('status',20)->default('pending');
            $t->string('last_error',40)->nullable();$t->uuid('lease_token')->nullable();$t->timestamp('lease_until')->nullable();$t->timestamp('next_attempt_at')->nullable();$t->timestamp('delivered_at')->nullable();$t->timestamps();
            $t->unique(['submission_id','event']);$t->index(['status','next_attempt_at']);
        });
        Schema::create('submission_delivery_audits',function(Blueprint $t){$t->id();$t->uuid('message_id');$t->string('action',40);$t->string('actor',80)->nullable();$t->timestamp('created_at');});
    }
    public function down(): void
    {
        foreach(['submission_delivery_audits','submission_outbox','public_submissions','intake_nonces'] as $table){Schema::dropIfExists($table);}
    }
};
