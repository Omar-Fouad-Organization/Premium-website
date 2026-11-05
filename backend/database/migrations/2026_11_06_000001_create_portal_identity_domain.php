<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration {
    public function up():void
    {
        Schema::create('portal_users',function(Blueprint $t){$t->uuid('id')->primary();$t->string('name');$t->string('email')->unique();$t->string('password');$t->string('activation_hash',64)->nullable();$t->timestamp('email_verified_at')->nullable();$t->boolean('active')->default(true);$t->unsignedInteger('auth_version')->default(1);$t->rememberToken();$t->timestamps();});
        Schema::create('portal_sessions',function(Blueprint $t){$t->string('id')->primary();$t->uuid('user_id')->nullable()->index();$t->string('ip_address',45)->nullable();$t->text('user_agent')->nullable();$t->longText('payload');$t->integer('last_activity')->index();});
        Schema::create('portal_password_reset_tokens',function(Blueprint $t){$t->string('email')->primary();$t->string('token');$t->timestamp('created_at')->nullable();});
        Schema::create('portal_devices',function(Blueprint $t){$t->uuid('id')->primary();$t->uuid('identity_id')->index();$t->string('session_hash',64)->unique();$t->unsignedInteger('auth_version');$t->timestamp('expires_at');$t->timestamp('last_seen_at');$t->timestamp('revoked_at')->nullable();$t->timestamps();});
        Schema::create('portal_outbox',function(Blueprint $t){$t->uuid('id')->primary();$t->uuid('identity_id')->index();$t->uuid('membership_id');$t->unsignedBigInteger('exhibition_id');$t->string('operation',40);$t->uuid('actor_device_id')->nullable();$t->unsignedInteger('actor_auth_version')->nullable();$t->longText('payload');$t->string('state',24)->default('pending');$t->unsignedInteger('attempts')->default(0);$t->longText('result')->nullable();$t->timestamp('next_attempt_at')->nullable();$t->timestamps();});
        Schema::create('portal_media',function(Blueprint $t){$t->uuid('id')->primary();$t->uuid('identity_id')->index();$t->uuid('membership_id');$t->unsignedBigInteger('exhibition_id');$t->unsignedBigInteger('participant_id')->index();$t->string('kind',16);$t->string('path')->unique();$t->string('mime',64);$t->unsignedInteger('bytes');$t->timestamp('archived_at')->nullable();$t->timestamps();});
        Schema::create('portal_notifications',function(Blueprint $t){$t->string('id',64)->primary();$t->uuid('identity_id')->index();$t->uuid('membership_id');$t->unsignedBigInteger('exhibition_id');$t->string('source_reference');$t->timestamp('read_at')->nullable();$t->timestamps();});
        Schema::create('portal_media_nonces',function(Blueprint $t){$t->string('id',64)->primary();$t->timestamp('expires_at')->index();});
    }
    public function down():void{foreach(['portal_media_nonces','portal_notifications','portal_media','portal_outbox','portal_devices','portal_password_reset_tokens','portal_sessions','portal_users']as $table)Schema::dropIfExists($table);}
};
