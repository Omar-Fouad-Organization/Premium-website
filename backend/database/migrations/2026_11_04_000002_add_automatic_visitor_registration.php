<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration {
    public function up(): void
    {
        Schema::table('public_submissions',function(Blueprint $table): void {
            $table->unsignedTinyInteger('visitor_registration_version')->nullable();
            $table->string('registration_status',30)->nullable();
        });
    }
    public function down(): void
    {
        Schema::table('public_submissions',function(Blueprint $table): void {
            $table->dropColumn(['visitor_registration_version','registration_status']);
        });
    }
};
