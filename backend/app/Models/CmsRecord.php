<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class CmsRecord extends Model
{
    use HasUuids;

    protected $guarded = [];

    public static function forResource(string $resource): self
    {
        abort_unless(array_key_exists($resource, config('cms.resources')), 404);

        return (new self)->setTable($resource);
    }

    protected function casts(): array
    {
        $casts = [];
        $fields = array_merge(...array_column(config('cms.resources'), 'fields'));
        foreach ($fields as $field => $rules) {
            if (str_contains($rules, '|boolean')) {
                $casts[$field] = 'boolean';
            }
            if (str_contains($rules, '|array')) {
                $casts[$field] = 'array';
            }
            if (str_contains($rules, '|integer')) {
                $casts[$field] = 'integer';
            }
        }

        return $casts;
    }
}
