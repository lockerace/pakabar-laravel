<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Auth;

class OptionalSanctum
{
    public function handle(Request $request, Closure $next)
    {
        $user = auth('sanctum')->user();
        if (!empty($user)) {
            Auth::setUser($user);
        }
        return $next($request);
    }
}
