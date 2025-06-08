<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Delivery;
use App\Models\Order;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class DevController extends Controller
{
    /**
     * Get all users (public access for development)
     */
    public function getUsers()
    {
        try {
            $users = User::select('id', 'name', 'email', 'role', 'profile_image', 'created_at')
                ->orderBy('created_at', 'desc')
                ->get();

            return response()->json($users);
        } catch (\Exception $e) {
            Log::error('Dev Error fetching users: ' . $e->getMessage());
            return response()->json([
                'error' => 'Failed to retrieve users',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get all deliveries (public access for development)
     */
    public function getDeliveries()
    {
        try {
            $deliveries = Delivery::with('user')
                ->orderBy('created_at', 'desc')
                ->get()
                ->map(function ($delivery) {
                    return [
                        'id' => $delivery->id,
                        'user_id' => $delivery->user_id,
                        'user_name' => $delivery->user ? $delivery->user->name : 'Unknown User',
                        'tracking_code' => $delivery->tracking_code,
                        'pickup_address' => $delivery->pickup_address,
                        'delivery_address' => $delivery->delivery_address,
                        'contact_number' => $delivery->contact_number,
                        'weight' => $delivery->weight,
                        'price' => $delivery->price,
                        'status' => $delivery->status,
                        'notes' => $delivery->notes,
                        'shipping_method' => $delivery->shipping_method,
                        'estimated_arrival_date' => $delivery->estimated_arrival_date,
                        'actual_arrival_date' => $delivery->actual_arrival_date,
                        'created_at' => $delivery->created_at
                    ];
                });

            return response()->json($deliveries);
        } catch (\Exception $e) {
            Log::error('Dev Error fetching deliveries: ' . $e->getMessage());
            return response()->json([
                'error' => 'Failed to retrieve deliveries',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get all orders (public access for development)
     */
    public function getOrders()
    {
        try {
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
                        'created_at' => $order->created_at
                    ];
                });

            return response()->json($orders);
        } catch (\Exception $e) {
            Log::error('Dev Error fetching orders: ' . $e->getMessage());
            return response()->json([
                'error' => 'Failed to retrieve orders',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get admin dashboard statistics (public access for development)
     */
    public function getStats()
    {
        try {
            $deliveriesCount = Delivery::count();
            $activeOrdersCount = Order::whereIn('status', ['pending', 'processing'])->count();
            $usersCount = User::count();
            $revenue = Order::where('status', 'completed')->sum('amount');

            return response()->json([
                'deliveries' => $deliveriesCount,
                'activeOrders' => $activeOrdersCount,
                'users' => $usersCount,
                'revenue' => $revenue ?: 0 // Default to 0 if no completed orders
            ]);
        } catch (\Exception $e) {
            Log::error('Dev Error fetching stats: ' . $e->getMessage());
            return response()->json([
                'deliveries' => 0,
                'activeOrders' => 0,
                'users' => 0,
                'revenue' => 0
            ]);
        }
    }

    /**
     * Get orders for a specific user (public access for development)
     */
    public function getUserOrders($userId)
    {
        try {
            // Get the user
            $user = User::findOrFail($userId);

            // Get user's orders
            $orders = Order::where('user_id', $userId)
                ->orderBy('created_at', 'desc')
                ->get()
                ->map(function ($order) {
                    return [
                        'id' => $order->id,
                        'delivery_id' => $order->delivery_id,
                        'amount' => $order->amount,
                        'status' => $order->status,
                        'created_at' => $order->created_at
                    ];
                });

            // Get user's deliveries
            $deliveries = Delivery::where('user_id', $userId)
                ->orderBy('created_at', 'desc')
                ->get()
                ->map(function ($delivery) {
                                    return [
                        'id' => $delivery->id,
                        'tracking_code' => $delivery->tracking_code,
                        'pickup_address' => $delivery->pickup_address,
                        'delivery_address' => $delivery->delivery_address,
                        'weight' => $delivery->weight,
                        'price' => $delivery->price,
                        'status' => $delivery->status,
                        'created_at' => $delivery->created_at
                    ];
                });

            return response()->json([
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role,
                    'profile_image' => $user->profile_image,
                    'created_at' => $user->created_at
                ],
                'orders' => $orders,
                'deliveries' => $deliveries
            ]);
        } catch (\Exception $e) {
            Log::error('Dev Error fetching user orders: ' . $e->getMessage());
            return response()->json([
                'error' => 'Failed to retrieve user data',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get details for a specific delivery (public access for development)
     */
    public function getDeliveryDetails($deliveryId)
    {
        try {
            // Get the delivery with user
            $delivery = Delivery::with('user')->findOrFail($deliveryId);

            return response()->json([
                'id' => $delivery->id,
                'user_id' => $delivery->user_id,
                'user_name' => $delivery->user ? $delivery->user->name : 'Unknown User',
                'tracking_code' => $delivery->tracking_code,
                'pickup_address' => $delivery->pickup_address,
                'delivery_address' => $delivery->delivery_address,
                'contact_number' => $delivery->contact_number,
                'weight' => $delivery->weight,
                'price' => $delivery->price,
                'status' => $delivery->status,
                'notes' => $delivery->notes,
                'shipping_method' => $delivery->shipping_method,
                'estimated_arrival_date' => $delivery->estimated_arrival_date,
                'actual_arrival_date' => $delivery->actual_arrival_date,
                'created_at' => $delivery->created_at
            ]);
        } catch (\Exception $e) {
            Log::error('Dev Error fetching delivery details: ' . $e->getMessage());
            return response()->json([
                'error' => 'Failed to retrieve delivery details',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get details for a specific order (public access for development)
     */
    public function getOrderDetails($orderId)
    {
        try {
            // Get the order with user and delivery
            $order = Order::with(['user', 'delivery'])->findOrFail($orderId);

            $result = [
                'id' => $order->id,
                'user_id' => $order->user_id,
                'user_name' => $order->user ? $order->user->name : 'Unknown User',
                'delivery_id' => $order->delivery_id,
                'amount' => $order->amount,
                'status' => $order->status,
                'created_at' => $order->created_at
            ];

            // Add delivery details if available
            if ($order->delivery) {
                $result['delivery'] = [
                    'id' => $order->delivery->id,
                    'pickup_address' => $order->delivery->pickup_address,
                    'delivery_address' => $order->delivery->delivery_address,
                    'contact_number' => $order->delivery->contact_number,
                    'weight' => $order->delivery->weight,
                    'price' => $order->delivery->price,
                    'status' => $order->delivery->status,
                    'tracking_code' => $order->delivery->tracking_code,
                    'created_at' => $order->delivery->created_at
                ];
            }

            return response()->json($result);
        } catch (\Exception $e) {
            Log::error('Dev Error fetching order details: ' . $e->getMessage());
            return response()->json([
                'error' => 'Failed to retrieve order details',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update delivery status (public access for development)
     */
    public function updateDeliveryStatus(Request $request, $deliveryId)
    {
        try {
            $request->validate([
                'status' => 'required|in:pending,in_progress,delivered,cancelled'
            ]);

            DB::beginTransaction();

            $delivery = Delivery::findOrFail($deliveryId);
            $delivery->status = $request->status;

            // If status is changed to "delivered", set arrival_date to current date
            if ($request->status === 'delivered') {
                $delivery->actual_arrival_date = now();
                Log::info("Dev: Set arrival date for delivery {$deliveryId} to current date");
            }

            $delivery->save();

            // Update the corresponding order status based on delivery status
            $order = $delivery->order;
            if ($order) {
                $orderStatus = $this->mapDeliveryStatusToOrderStatus($request->status);
                $order->status = $orderStatus;
                $order->save();

                Log::info("Dev: Updated order {$order->id} status to {$orderStatus} based on delivery status");
            }

            DB::commit();

            Log::info("Dev: Updated delivery {$deliveryId} status to {$request->status}");

            return response()->json([
                'message' => 'Delivery and order status updated successfully',
                'delivery' => [
                    'id' => $delivery->id,
                    'status' => $delivery->status,
                    'actual_arrival_date' => $delivery->actual_arrival_date,
                    'updated_at' => $delivery->updated_at
                ],
                'order' => $order ? [
                    'id' => $order->id,
                    'status' => $order->status,
                    'updated_at' => $order->updated_at
                ] : null
            ]);
        } catch (\Exception $e) {
            DB::rollback();
            Log::error('Dev Error updating delivery status: ' . $e->getMessage());
            return response()->json([
                'error' => 'Failed to update delivery status',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Map delivery status to corresponding order status
     */
    private function mapDeliveryStatusToOrderStatus($deliveryStatus)
    {
        return match($deliveryStatus) {
            'pending' => 'pending',
            'in_progress' => 'processing',
            'delivered' => 'completed',
            'cancelled' => 'cancelled',
            default => 'pending'
        };
    }

    /**
     * Update order status (public access for development)
     */
    public function updateOrderStatus(Request $request, $orderId)
    {
        try {
            $request->validate([
                'status' => 'required|in:pending,processing,completed,cancelled'
            ]);

            $order = Order::findOrFail($orderId);
            $order->status = $request->status;
            $order->save();

            Log::info("Dev: Updated order {$orderId} status to {$request->status}");

            return response()->json([
                'message' => 'Order status updated successfully',
                'order' => [
                    'id' => $order->id,
                    'status' => $order->status,
                    'updated_at' => $order->updated_at
                ]
            ]);
        } catch (\Exception $e) {
            Log::error('Dev Error updating order status: ' . $e->getMessage());
            return response()->json([
                'error' => 'Failed to update order status',
                'message' => $e->getMessage()
            ], 500);
        }
    }
}
