<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class CheckAdmin
{
    public function handle(Request $request, Closure $next)
    {
        try {
            Log::info('CheckAdmin middleware executed', [
                'user_id' => auth()->id(),
                'user_role' => auth()->check() ? auth()->user()->role : 'guest'
            ]);

            if (!auth()->check()) {
                Log::warning('Unauthenticated access attempt to admin route');
                return response()->json([
                    'message' => 'Authentication required',
                    'error' => 'User not authenticated'
                ], 401);
            }

            if (auth()->user()->role !== 'admin') {
                Log::warning('Unauthorized access attempt to admin route', [
                    'user_id' => auth()->id(),
                    'user_role' => auth()->user()->role
                ]);
                return response()->json([
                    'message' => 'Access denied',
                    'error' => 'Insufficient permissions'
                ], 403);
            }

            return $next($request);
            
        } catch (\Exception $e) {
            Log::error('Error in CheckAdmin middleware', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'message' => 'An error occurred while processing your request',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error'
            ], 500);
        }
    }
}
