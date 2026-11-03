<?php

namespace App\Http\Controllers;

use App\Services\{CmsMedia, CmsRecords};
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;
use Throwable;

class CmsGatewayController extends Controller
{
    public function handle(Request $request, string $site, string $resource): JsonResponse
    {
        $claims = $request->attributes->get('cms_delegation');
        $records = app(CmsRecords::class);
        $status = 500;
        $operation = $resource === 'upload' ? 'upload' : ($request->input('operation') ?? 'unknown');
        DB::beginTransaction();
        try {
            $records->capability($claims, 'website.view');
            if ($resource === 'overview') {
                $data = [];
                foreach (config('cms_contract.resources') as $name=>$spec) {
                    if ($spec['keys'] === null && in_array($spec['family'].'.view', $claims['permissions'], true)) {
                        $data[$name] = $records->scope($spec)->count();
                    }
                }
                $result = ['data'=>$data];
            } elseif ($resource === 'upload') {
                $records->capability($claims, 'media.view');
                $records->capability($claims, 'media.upload');
                $result = app(CmsMedia::class)->upload($request);
            } elseif ($resource === 'asset-delete') {
                $records->capability($claims, 'media.view');
                $records->capability($claims, 'media.delete');
                $v = $request->validate(['path'=>'required|string|max:250']);
                $result = app(CmsMedia::class)->remove($v['path']);
            } else {
                $result = $records->execute($resource, $request->json()->all(), $claims);
            }
            $json = json_encode([...$result,'correlation_id'=>$claims['correlation_id']], JSON_THROW_ON_ERROR);
            abort_if(strlen($json) > config('cms_gateway.max_response_bytes'), 413, 'CMS response is too large. Request a smaller page.');
            $status = 200;
            $this->audit($claims, $resource, $operation, $status);
            DB::commit();
            return response()->json(json_decode($json, true))->header('X-Correlation-ID', $claims['correlation_id'])->header('Cache-Control', 'no-store');
        } catch (Throwable $error) {
            DB::rollBack();
            $status = $error instanceof HttpExceptionInterface ? $error->getStatusCode() : ($error instanceof \Illuminate\Validation\ValidationException ? 422 : 500);
            $this->audit($claims, $resource, $operation, $status);
            throw $error;
        }
    }

    private function audit(array $claims, string $resource, mixed $operation, int $status): void
    {
            DB::table('cms_gateway_audits')->insert(['correlation_id'=>$claims['correlation_id'],'actor'=>$claims['actor'],
                'exhibition_id'=>$claims['exhibition_id'],'resource'=>$resource,'operation'=>is_string($operation) ? substr($operation,0,20) : 'invalid',
                'status'=>$status,'created_at'=>now()]);
    }
}
