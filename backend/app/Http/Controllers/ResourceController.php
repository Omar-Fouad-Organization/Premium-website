<?php

namespace App\Http\Controllers;

use App\Models\CmsRecord;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class ResourceController extends Controller
{
    public function adminRead(Request $request, string $resource): JsonResponse
    {
        abort_unless($request->user()?->is_admin, 403);
        $request->attributes->set('cms_admin_read', true);
        return $this->handle($request, $resource);
    }

    public function handle(Request $request, string $resource): JsonResponse
    {
        $reading = $request->isMethod('GET');
        $admin = (bool) $request->user()?->is_admin && (! $reading || $request->attributes->get('cms_admin_read') === true);
        if ($resource === 'admin_users') {
            return $this->users($request, $admin);
        }
        abort_unless(array_key_exists($resource, config('cms.resources')), 404);
        $spec = config("cms.resources.$resource");
        if (config('intake.enabled') && ($spec['submit'] ?? false) && !$reading) {
            abort(409, 'Use the dedicated registration form or SPACE ERP processing workflow.');
        }
        $submission = ! $admin && $request->isMethod('POST') && ($spec['submit'] ?? false);
        abort_unless($admin || ($reading && $spec['public']) || $submission, 403);
        if ($admin && ! $reading && $spec['public'] && config('cms_gateway.enabled')) {
            abort(409, 'Website content is now managed through SPACE ERP. Reload it there before editing.');
        }
        if ($submission && $resource === 'visitor_registrations') {
            $enabled = CmsRecord::forResource('site_settings')->where('setting_key', 'visitor_registration_enabled')->value('setting_value');
            abort_unless($enabled === 'true', 403, 'Visitor registration is closed.');
        }
        $allowed = ['id', 'created_at', 'updated_at', ...array_keys($spec['fields'])];
        $query = CmsRecord::forResource($resource)->newQuery();
        if (! $admin && $reading && $resource === 'site_settings') {
            $query->whereIn('setting_key', config('cms_contract.public_setting_keys'));
            $allowed = array_values(array_diff($allowed, ['description']));
        }
        if (! $admin && isset($spec['visible'])) {
            $query->where($spec['visible'], true);
        }
        if (! $admin && $reading && $resource === 'blogs') {
            $query->where(fn ($q) => $q->whereNull('published_date')->orWhere('published_date', '<=', now()->toIso8601String()));
        }
        $filters = $this->filters($request, $allowed);
        $this->applyFilters($query, $filters);
        if ($reading) {
            $count = (clone $query)->count();
            $orders = json_decode($request->query('orders', '[]'), true);
            abort_unless(is_array($orders) && count($orders) <= 5, 422);
            foreach ($orders as $order) {
                abort_unless(in_array($order['column'] ?? '', $allowed, true), 422);
                $query->orderBy($order['column'], ($order['ascending'] ?? true) ? 'asc' : 'desc');
            }
            $columns = explode(',', str_replace(' ', '', $request->query('columns', '*')));
            foreach ($columns as $column) {
                abort_unless($column === '*' || in_array($column, $allowed, true), 422, 'Invalid column.');
            }
            if (! $admin && $resource === 'site_settings' && $columns === ['*']) {
                $columns = $allowed;
            }
            $rows = $query->offset(max(0, min((int) $request->query('offset', 0), 10000)))->limit(max(1, min((int) $request->query('limit', 1000), 1000)))->get($columns);
            if ($resource === 'blogs') {
                foreach ($rows as $row) {
                    foreach (['content', 'content_ar'] as $field) {
                        if (array_key_exists($field, $row->getAttributes())) {
                            $row->$field = \App\Services\CmsHtml::sanitize($row->$field);
                        }
                    }
                }
            }

            foreach ($rows as $row) {
                foreach ($row->getAttributes() as $field => $value) {
                    if (is_string($value) && str_ends_with($field, '_url') && ! \App\Services\CmsHtml::safeUrl($value, true)) {
                        $row->$field = '';
                    }
                }
                if ($resource === 'site_settings' && isset($row->setting_key, $row->setting_value)
                    && preg_match('/(_url|^social_)/', $row->setting_key) && ! \App\Services\CmsHtml::safeUrl($row->setting_value)) {
                    $row->setting_value = '';
                }
            }
            if ($resource === 'site_settings') {
                foreach ($rows as $row) {
                    if ($row->setting_key === 'map_embed_url' && ! \App\Services\CmsHtml::safeMapUrl($row->setting_value ?? '')) {
                        $row->setting_value = '';
                    }
                }
            }
            return response()->json(['data' => $request->boolean('single') ? $rows->first() : $rows, 'count' => $count]);
        }
        if ($request->isMethod('DELETE')) {
            abort_if(count($filters) === 0, 422, 'A deletion requires a filter.');
            $query->delete();

            return response()->json(['data' => []]);
        }
        $input = $request->input('records');
        abort_unless(is_array($input) && count($input) > 0, 422, 'Records are required.');
        $records = array_is_list($input) ? $input : [$input];
        abort_if(count($records) > ($submission ? 1 : 100), 422);
        $updating = $request->isMethod('PATCH');
        abort_if($updating && ! $filters, 422, 'An update requires a filter.');
        $rows = DB::transaction(function () use ($records, $spec, $resource, $query, $request, $updating, $submission) {
            $result = collect();
            foreach ($records as $record) {
                abort_unless(is_array($record), 422);
                $record = array_diff_key($record, array_flip(['id', 'created_at', 'updated_at']));
                abort_if(array_diff(array_keys($record), array_keys($spec['fields'])), 422, 'Unknown field.');
                abort_if($submission && array_key_exists('is_read', $record), 422, 'Read status is managed by administrators.');
                $rules = $spec['fields'];
                if ($updating) {
                    foreach ($rules as &$rule) {
                        $rule = 'sometimes|'.$rule;
                    }
                }
                unset($rule);
                if (isset($rules['features'])) {
                    $rules['features.*'] = 'string|max:1000';
                }
                if (isset($rules['interests'])) {
                    $rules['interests.*'] = 'string|max:255';
                }
                $validated = Validator::make($record, $rules)->validate();
                if ($resource === 'blogs') {
                    foreach (['content','content_ar'] as $field) {
                        if (array_key_exists($field, $validated)) {
                            $validated[$field] = \App\Services\CmsHtml::sanitize($validated[$field]);
                        }
                    }
                }
                foreach ($validated as $field => $value) {
                    if ($value && str_ends_with($field, '_url')) {
                        abort_unless((str_starts_with($value, '/') && ! str_starts_with($value, '//')) || preg_match('#^https?://#i', $value), 422, 'Invalid asset URL.');
                    }
                }
                if ($updating) {
                    foreach ((clone $query)->get() as $row) {
                        $row->fill($validated)->save();
                        $result->push($row);
                    }
                } elseif ($request->isMethod('PUT')) {
                    $keys = $spec['unique'] ?? [];
                    abort_unless($keys && $request->query('conflict') === implode(',', $keys), 422, 'Unsupported upsert key.');
                    $identity = array_intersect_key($validated, array_flip($keys));
                    abort_unless(count($identity) === count($keys), 422);
                    $row = CmsRecord::forResource($resource)->newQuery()->firstOrNew($identity);
                    $row->fill($validated)->save();
                    $result->push($row);
                } else {
                    $row = CmsRecord::forResource($resource);
                    $row->fill($validated)->save();
                    $result->push($row);
                }
            }

            return $result;
        });
        if ($submission) {
            return response()->json(['data' => ['success' => true]], 201);
        }

        return response()->json(['data' => $request->boolean('single') ? $rows->first() : $rows]);
    }

    private function filters(Request $request, array $allowed): array
    {
        $filters = json_decode($request->query('filters', '[]'), true);
        abort_unless(is_array($filters) && count($filters) <= 20, 422);
        foreach ($filters as $filter) {
            abort_unless(in_array($filter['column'] ?? '', $allowed, true) && in_array($filter['operator'] ?? '', ['eq', 'neq', 'in'], true), 422);
            abort_unless(array_key_exists('value', $filter), 422);
            if ($filter['operator'] === 'in') {
                abort_unless(is_array($filter['value']) && count($filter['value']) <= 100, 422);
            } else {
                abort_unless(is_scalar($filter['value']) || is_null($filter['value']), 422);
            }
        }

        return $filters;
    }

    private function applyFilters(\Illuminate\Database\Eloquent\Builder $query, array $filters): void
    {
        foreach ($filters as $filter) {
            if ($filter['operator'] === 'in') {
                $query->whereIn($filter['column'], $filter['value']);
            } else {
                $query->where($filter['column'], $filter['operator'] === 'eq' ? '=' : '!=', $filter['value']);
            }
        }
    }

    private function users(Request $request, bool $admin): JsonResponse
    {
        abort_unless($admin, 403);
        if ($request->isMethod('GET')) {
            return response()->json(['data' => User::where('is_admin', true)->latest()->get()->map(fn ($user) => AuthController::userData($user))]);
        }
        abort_unless($request->isMethod('DELETE'), 405);
        $filters = $this->filters($request, ['id']);
        abort_unless(count($filters) === 1 && $filters[0]['operator'] === 'eq', 422);
        $user = User::findOrFail($filters[0]['value']);
        abort_if($user->id === $request->user()->id, 422, 'You cannot delete your own account.');
        $user->delete();

        return response()->json(['data' => []]);
    }
}
