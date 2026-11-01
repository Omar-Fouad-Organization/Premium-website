<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', fn (Blueprint $table) => $table->boolean('is_admin')->default(false));
        foreach (config('cms.resources') as $name => $spec) {
            Schema::create($name, function (Blueprint $table) use ($spec) {
                $table->uuid('id')->primary();
                foreach ($spec['fields'] as $field => $rules) {
                    if (str_contains($rules, '|boolean')) {
                        $table->boolean($field)->default($field === 'is_active');
                    } elseif (str_contains($rules, '|integer')) {
                        $table->unsignedInteger($field)->default(0);
                    } elseif (str_contains($rules, '|array')) {
                        $table->json($field)->nullable();
                    } elseif (in_array($field, $spec['unique'] ?? [])) {
                        preg_match('/max:(\d+)/', $rules, $matches);
                        $table->string($field, (int) ($matches[1] ?? 191));
                    } else {
                        $table->longText($field)->nullable();
                    }
                }
                if (isset($spec['unique'])) {
                    $table->unique($spec['unique']);
                }
                $table->timestamps();
            });
        }
    }

    public function down(): void
    {
        foreach (array_reverse(array_keys(config('cms.resources'))) as $name) {
            Schema::dropIfExists($name);
        }
        Schema::table('users', fn (Blueprint $table) => $table->dropColumn('is_admin'));
    }
};
