<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class UploadController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        abort_unless($request->user()?->is_admin, 403);
        $data = $request->validate([
            'bucket' => 'required|in:premium_logos,premium_photos,partner_logos',
            'file' => 'required|file|mimes:jpg,jpeg,png,webp,gif,ico|max:5120',
        ]);
        $path = $data['file']->store($data['bucket'], 'public');

        return response()->json(['data' => ['url' => '/storage/'.$path]], 201);
    }
}
