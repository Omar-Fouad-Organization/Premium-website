<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public static function userData(User $user): array
    {
        return ['id' => $user->id, 'name' => $user->name, 'email' => $user->email, 'role' => 'admin', 'created_at' => $user->created_at];
    }

    public function login(Request $request): JsonResponse
    {
        $data = $request->validate(['email' => 'required|email', 'password' => 'required|string']);
        if (! Auth::attempt([...$data, 'is_admin' => true])) {
            throw ValidationException::withMessages(['email' => 'The provided credentials are incorrect.']);
        }
        $request->session()->regenerate();

        return response()->json(['data' => ['user' => self::userData($request->user())]]);
    }

    public function me(Request $request): JsonResponse
    {
        return response()->json(['data' => ['user' => $request->user()?->is_admin ? self::userData($request->user()) : null]]);
    }

    public function logout(Request $request): JsonResponse
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json(['data' => ['success' => true]]);
    }

    public function createUser(Request $request): JsonResponse
    {
        abort_unless($request->user()?->is_admin, 403);
        $data = $request->validate(['email' => 'required|email|max:255|unique:users', 'password' => 'required|string|min:12|max:255']);
        $user = new User(['name' => $data['email'], ...$data]);
        $user->is_admin = true;
        $user->save();

        return response()->json(['data' => ['success' => true, 'message' => 'Administrator created.', 'user' => self::userData($user)]], 201);
    }
}
