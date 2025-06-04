<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Delivery;
use App\Models\Order;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class AdminController extends Controller
{
    /**
     * Get admin dashboard statistics
     */
    public function getStats()
    {
        // Get counts and stats for the admin dashboard
        $deliveriesCount = Delivery::count();
        $activeOrdersCount = Order::whereIn('status', ['pending', 'processing'])->count();
        $usersCount = User::count();
        $revenue = Order::where('status', 'completed')->sum('amount');

        return response()->json([
            'deliveries' => $deliveriesCount,
            'activeOrders' => $activeOrdersCount,
            'users' => $usersCount,
            'revenue' => $revenue
        ]);
    }

    /**
     * Get all users (admin only)
     */
    public function getUsers()
    {
        $users = User::select('id', 'name', 'email', 'role', 'profile_image', 'created_at')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($users);
    }
    
    /**
     * Update user role
     */
    public function updateUserRole(Request $request, $userId)
    {
        $request->validate([
            'role' => 'required|in:user,admin',
        ]);

        $user = User::findOrFail($userId);
        $user->role = $request->role;
        $user->save();

        return response()->json(['message' => 'User role updated successfully']);
    }
    
    /**
     * Get all orders (admin only)
     */
    public function getOrders()
    {
        try {
            // First check if we have any orders
            $orderCount = Order::count();
            
            if ($orderCount == 0) {
                // If no orders exist yet, return an empty array
                return response()->json([]);
            }
            
            // Use Eloquent instead of raw query builder for better error handling
            $orders = Order::with('user')
                ->orderBy('created_at', 'desc')
                ->get()
                ->map(function ($order) {
                    return [
                        'id' => $order->id,
                        'user_id' => $order->user_id,
                        'user_name' => $order->user ? $order->user->name : 'Unknown User',
                        'delivery_id' => $order->delivery_id,
                        'amount' => $order->amount,
                        'status' => $order->status,
                        'payment_method' => $order->payment_method,
                        'created_at' => $order->created_at
                    ];
                });
            
            return response()->json($orders);
        } catch (\Exception $e) {
            // Log the error
            Log::error('Error fetching orders: ' . $e->getMessage());
            
            // Return a helpful error message
            return response()->json([
                'error' => 'Failed to retrieve orders',
                'message' => $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Update order status
     */
    public function updateOrderStatus(Request $request, $orderId)
    {
        $request->validate([
            'status' => 'required|in:pending,processing,completed,cancelled',
        ]);

        $order = Order::findOrFail($orderId);
        $order->status = $request->status;
        $order->save();

        return response()->json(['message' => 'Order status updated successfully']);
    }
}
