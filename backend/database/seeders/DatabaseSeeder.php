<?php

namespace Database\Seeders;

use App\Models\CmsRecord;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $content = json_decode(file_get_contents(database_path('seeders/content.json')), true, flags: JSON_THROW_ON_ERROR);
        foreach ($content as $resource => $rows) {
            foreach ($rows as $record) {
                $keys = config("cms.resources.$resource.unique", ['package_type', 'package_name']);
                $identity = array_intersect_key($record, array_flip($keys));
                $model = CmsRecord::forResource($resource)->newQuery()->firstOrNew($identity);
                // Seeding never overwrites content already edited by an administrator.
                if (! $model->exists) {
                    $model->fill($record)->save();
                }
            }
        }
    }
}
