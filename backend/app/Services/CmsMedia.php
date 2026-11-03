<?php

namespace App\Services;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class CmsMedia
{
    private const MIME = ['image/jpeg'=>'jpg','image/png'=>'png','image/webp'=>'webp','image/gif'=>'gif','image/x-icon'=>'ico','image/vnd.microsoft.icon'=>'ico'];

    public function upload(Request $request): array
    {
        $bucket = $request->query('bucket');
        abort_unless(in_array($bucket, ['premium_logos','premium_photos','partner_logos'], true), 422, 'Unsupported image bucket.');
        $bytes = $request->getContent();
        abort_if($bytes === '' || strlen($bytes) > config('cms_gateway.max_upload_bytes'), 422, 'Select an image up to 5 MB.');
        $mime = (new \finfo(FILEINFO_MIME_TYPE))->buffer($bytes);
        abort_unless(isset(self::MIME[$mime]), 422, 'Only JPEG, PNG, WebP, GIF and ICO images are supported.');
        $dimensions = @getimagesizefromstring($bytes);
        abort_unless($dimensions && $dimensions[0] <= 10000 && $dimensions[1] <= 10000 && $dimensions[0] * $dimensions[1] <= 40000000, 422, 'Invalid or oversized image dimensions.');
        $path = $bucket.'/'.Str::uuid().'.'.self::MIME[$mime];
        $stream = fopen('php://temp/maxmemory:1048576', 'w+b');
        try {
            fwrite($stream, $bytes);
            rewind($stream);
            abort_unless(Storage::disk('public')->put($path, $stream), 503, 'Public image storage is unavailable.');
        } finally {
            fclose($stream);
        }
        return ['data'=>['url'=>'/storage/'.$path]];
    }

    public function remove(string $path): array
    {
        abort_unless(! str_contains($path, '..') && preg_match('#^(premium_logos|premium_photos|partner_logos)/[A-Za-z0-9._-]+$#', $path), 404);
        $url = '/storage/'.$path;
        $checked = [];
        foreach (config('cms_contract.resources') as $spec) {
            if (isset($checked[$spec['table']])) {
                continue;
            }
            $checked[$spec['table']] = true;
            // Decode historical HTML, JSON and URL encodings before reference checks.
            // Chunk the fixed CMS tables; never scan arbitrary client-selected tables.
            DB::table($spec['table'])->select(['id', ...array_keys($spec['fields'])])->orderBy('id')->chunkById(100, function ($rows) use ($url): void {
                foreach ($rows as $row) {
                    foreach ((array) $row as $value) {
                        if (! is_string($value)) {
                            continue;
                        }
                        $decoded = str_replace('\\/', '/', $value);
                        for ($pass = 0; $pass < 3; $pass++) {
                            $decoded = rawurldecode(html_entity_decode($decoded, ENT_QUOTES | ENT_HTML5, 'UTF-8'));
                        }
                        abort_if(str_contains($decoded, $url), 409, 'This image is still referenced by CMS content. Replace those references before deleting it.');
                    }
                }
            });
        }
        abort_unless(Storage::disk('public')->exists($path), 404);
        abort_unless(Storage::disk('public')->delete($path), 503, 'Image deletion failed.');
        return ['data'=>[]];
    }
}
