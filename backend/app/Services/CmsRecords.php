<?php

namespace App\Services;

use App\Models\CmsRecord;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class CmsRecords
{
    public function spec(string $resource): array
    {
        $spec = config('cms_contract.resources.'.$resource);
        abort_unless(is_array($spec), 404, 'Unknown CMS resource.');
        return $spec;
    }

    public function capability(array $claims, string $permission): void
    {
        abort_unless(in_array($permission, $claims['permissions'], true), 403, 'Delegation does not permit this CMS action.');
    }

    public function version(CmsRecord $row): string
    {
        $data = $row->toArray();
        ksort($data);
        return hash('sha256', json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_THROW_ON_ERROR));
    }

    public function present(CmsRecord $row): array
    {
        $data = $row->toArray();
        $data['_version'] = $this->version($row);
        if ($row->getTable() === 'blogs') {
            foreach (['content','content_ar'] as $field) {
                $data[$field] = CmsHtml::sanitize($data[$field] ?? '');
            }
        }
        foreach ($data as $field=>$value) {
            if (is_string($value) && str_ends_with($field,'_url') && ! CmsHtml::safeUrl($value,true)) {
                $data[$field]='';
            }
        }
        if ($row->getTable() === 'site_settings' && str_ends_with($data['setting_key'] ?? '', '_url') && ! CmsHtml::safeUrl($data['setting_value'] ?? '')) {
            $data['setting_value']='';
        }
        if ($row->getTable() === 'site_settings' && ($data['setting_key'] ?? '') === 'map_embed_url' && ! CmsHtml::safeMapUrl($data['setting_value'] ?? '')) {
            $data['setting_value'] = '';
        }
        return $data;
    }

    public function scope(array $spec): Builder
    {
        $query = CmsRecord::forResource($spec['table'])->newQuery();
        if ($spec['keys'] !== null) {
            $query->whereIn('setting_key', $spec['keys']);
        }
        return $query;
    }

    public function selection(Builder $query, array $spec, array $filters): Builder
    {
        abort_if(count($filters) > 20, 422, 'Too many CMS filters.');
        foreach ($filters as $filter) {
            abort_unless(is_array($filter) && in_array($filter['column'] ?? null, $spec['filters'], true)
                && in_array($filter['operator'] ?? null, ['eq','neq','in'], true) && array_key_exists('value', $filter), 422, 'Unsupported CMS filter.');
            $value = $filter['value'];
            if ($filter['operator'] === 'in') {
                abort_unless(is_array($value) && count($value) <= 100 && count(array_filter($value, fn ($v): bool => ! is_scalar($v) && $v !== null)) === 0, 422);
                $query->whereIn($filter['column'], $value);
            } else {
                abort_unless(is_scalar($value) || $value === null, 422);
                $query->where($filter['column'], $filter['operator'] === 'eq' ? '=' : '!=', $value);
            }
        }
        return $query;
    }

    public function validateRecord(array $spec, array $record, bool $partial): array
    {
        $record = array_diff_key($record, array_flip(['id','created_at','updated_at','_version']));
        abort_if(array_diff(array_keys($record), array_keys($spec['fields'])), 422, 'Unsupported CMS field.');
        $rules = $spec['fields'];
        if ($partial) {
            foreach ($rules as &$rule) {
                $rule = 'sometimes|'.$rule;
            }
            unset($rule);
        }
        if (isset($rules['features'])) {
            $rules['features.*'] = 'string|max:1000';
        }
        $data = Validator::make($record, $rules)->validate();
        if (isset($data['setting_key']) && $spec['keys'] !== null) {
            abort_unless(in_array($data['setting_key'], $spec['keys'], true), 422, 'Setting is outside this editor.');
        }
        foreach ($data as $field=>$value) {
            if (is_string($value) && str_ends_with($field, '_url')) {
                abort_unless(CmsHtml::safeUrl($value, true), 422, 'Unsafe asset URL.');
            }
        }
        if ($spec['table'] === 'blogs') {
            foreach (['content','content_ar'] as $field) {
                if (array_key_exists($field, $data)) {
                    $data[$field] = CmsHtml::sanitize($data[$field]);
                }
            }
        }
        return $data;
    }

    public function validateSetting(array $data, ?CmsRecord $before): void
    {
        $key = $data['setting_key'] ?? $before?->setting_key;
        $value = $data['setting_value'] ?? $before?->setting_value ?? '';
        if (str_ends_with($key ?? '', '_url') && $value !== '') {
            abort_unless(CmsHtml::safeUrl($value), 422, 'Unsafe public URL.');
        }
        if ($key === 'map_embed_url' && $value !== '') {
            abort_unless(CmsHtml::safeMapUrl($value), 422, 'Use an HTTPS Google Maps embed URL.');
        }
        if ($key === 'site_language') {
            abort_unless(in_array($value, ['en','ar'], true), 422, 'Unsupported language.');
        }
        $ranges = ['map_latitude' => [-90, 90], 'map_longitude' => [-180, 180], 'map_zoom' => [1, 20]];
        if (isset($ranges[$key]) && $value !== '') {
            abort_unless(is_numeric($value) && (float) $value >= $ranges[$key][0] && (float) $value <= $ranges[$key][1], 422, 'Use valid map coordinates and zoom.');
        }
        if (str_contains($key ?? '', 'color') && $value !== '') {
            $hex = (bool) preg_match('/^#[a-f0-9]{3}(?:[a-f0-9]{3})?$/i', $value);
            $hsl = preg_match('/^(\d{1,3}(?:\.\d+)?)\s+(\d{1,3}(?:\.\d+)?)%\s+(\d{1,3}(?:\.\d+)?)%$/', $value, $parts)
                && (float) $parts[1] <= 360 && (float) $parts[2] <= 100 && (float) $parts[3] <= 100;
            abort_unless($hex || $hsl, 422, 'Use a hexadecimal color or hue saturation% lightness%.');
        }
    }

    public function execute(string $resource, array $input, array $claims): array
    {
        $spec = $this->spec($resource);
        $this->capability($claims, 'website.view');
        $this->capability($claims, $spec['family'].'.view');
        abort_if(array_diff(array_keys($input), ['operation','filters','orders','limit','offset','records','expected_version']), 422, 'Unsupported CMS request property.');
        $v = Validator::make($input, [
            'operation'=>['required',Rule::in(['list','create','update','upsert','delete'])],
            'filters'=>'sometimes|array|max:20','orders'=>'sometimes|array|max:5',
            'limit'=>'sometimes|integer|min:1|max:100','offset'=>'sometimes|integer|min:0|max:10000',
            'records'=>'sometimes|array','expected_version'=>'present|nullable|string|size:64',
        ])->validate();
        $query = $this->selection($this->scope($spec), $spec, $v['filters'] ?? []);
        if ($v['operation'] === 'list') {
            $count = (clone $query)->count();
            foreach ($v['orders'] ?? [] as $order) {
                abort_unless(is_array($order) && in_array($order['column'] ?? null, $spec['orders'], true) && is_bool($order['ascending'] ?? null), 422, 'Unsupported CMS ordering.');
                $query->orderBy($order['column'], $order['ascending'] ? 'asc' : 'desc');
            }
            $query->orderBy('id');
            return ['data'=>$query->offset($v['offset'] ?? 0)->limit($v['limit'] ?? 20)->get()->map(fn (CmsRecord $row): array => $this->present($row))->all(), 'count'=>$count];
        }
        return DB::transaction(function () use ($spec, $query, $v, $claims): array {
            $operation = $v['operation'];
            $record = $v['records'] ?? [];
            if (array_is_list($record) && $record !== []) {
                abort_unless(count($record) === 1 && is_array($record[0]), 422, 'CMS writes target one record.');
                $record = $record[0];
            }
            $data = $operation === 'delete' ? [] : $this->validateRecord($spec, $record, $operation === 'update');
            $existing = null;
            if ($operation === 'upsert') {
                abort_unless($spec['unique'] !== [], 422, 'This resource has no supported upsert identity.');
                $identity = array_intersect_key($data, array_flip($spec['unique']));
                abort_unless(count($identity) === count($spec['unique']), 422, 'Complete CMS identity is required.');
                $existing = $this->scope($spec)->where($identity)->lockForUpdate()->first();
            } elseif (in_array($operation, ['update','delete'], true)) {
                abort_unless(($v['filters'] ?? []) !== [], 422, 'A specific CMS record is required.');
                $equal=[];
                foreach($v['filters'] as $filter){
                    abort_unless($filter['operator']==='eq',422,'Select a specific CMS identity.');
                    $equal[$filter['column']]=$filter['value'];
                }
                abort_unless(isset($equal['id'])||($spec['unique']!==[]&&count(array_intersect($spec['unique'],array_keys($equal)))===count($spec['unique'])),422,'Select a specific CMS identity.');
                $rows = $query->lockForUpdate()->limit(2)->get();
                abort_unless($rows->count() === 1, $rows->isEmpty() ? 404 : 422, 'Select one CMS record.');
                $existing = $rows->first();
            }
            $action = $operation === 'delete' ? 'delete' : ($existing ? 'edit' : 'create');
            $this->capability($claims, $spec['family'].'.'.$action);
            if ($existing) {
                abort_unless(is_string($v['expected_version']) && hash_equals($this->version($existing), $v['expected_version']), 409, 'Content changed. Reload before saving; your edit was not applied.');
            } else {
                abort_unless($v['expected_version'] === null, 409, 'Content changed. Reload before saving.');
            }
            $visible = $spec['visible'];
            $publishing = $visible === null || ($existing && (bool) $existing->$visible) || ($operation !== 'delete' && (bool) ($data[$visible] ?? ($visible === 'is_active')));
            if ($publishing) {
                $this->capability($claims, $spec['family'].'.publish');
            }
            if ($spec['table'] === 'site_settings') {
                $this->validateSetting($data, $existing);
            }
            if ($operation === 'delete') {
                $existing->delete();
                return ['data'=>[]];
            }
            $row = $existing ?? CmsRecord::forResource($spec['table']);
            $row->fill($data)->save();
            return ['data'=>[$this->present($row->fresh())]];
        });
    }
}
