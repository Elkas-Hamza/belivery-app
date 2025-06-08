<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Delivery;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class DeliveryController extends Controller
{
    // Admin routes
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Delivery::with('user')->get();
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        try {
            // Log the incoming request
            \Log::info('Showing delivery details', [
                'delivery_id' => $id,
                'user_id' => Auth::id(),
                'user_role' => Auth::user() ? Auth::user()->role : 'guest'
            ]);

            // Find the delivery with user relationship
            $delivery = Delivery::with('user')->findOrFail($id);

            // If user is not admin, ensure they can only view their own deliveries
            if (Auth::user()->role !== 'admin' && $delivery->user_id !== Auth::id()) {
                \Log::warning('Unauthorized access attempt', [
                    'delivery_id' => $id,
                    'delivery_user_id' => $delivery->user_id,
                    'current_user_id' => Auth::id()
                ]);
                return response()->json(['message' => 'Unauthorized'], 403);
            }

            return response()->json($delivery);

        } catch (\Exception $e) {
            // Log the full exception
            \Log::error('Error in DeliveryController@show', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'delivery_id' => $id ?? 'null',
                'user_id' => Auth::id() ?? 'null'
            ]);

            return response()->json([
                'message' => 'Internal server error',
                'error' => config('app.debug') ? $e->getMessage() : 'An error occurred'
            ], 500);
        }
    }

    /**
     * Display the specified resource for tracking.
     * This is a public endpoint that can be accessed without authentication.
     */
    public function track(string $trackingCode)
    {
        $delivery = Delivery::where('tracking_code', $trackingCode)->first();

        if (!$delivery) {
            return response()->json(['message' => 'Delivery not found'], 404);
        }

        return response()->json($delivery);
    }

    /**
     * Update the status of the specified resource in storage.
     */
    public function updateStatus(Request $request, Delivery $delivery)
    {
        $validated = $request->validate([
            'status' => 'required|in:pending,in_progress,delivered,cancelled',
        ]);

        try {
            DB::beginTransaction();

            $updateData = ['status' => $validated['status']];

            // If status is being set to 'delivered' and actual_arrival_date is not set, set it to now
            if ($validated['status'] === 'delivered' && is_null($delivery->actual_arrival_date)) {
                $updateData['actual_arrival_date'] = now();
            }

            $delivery->update($updateData);

            // Update the corresponding order status based on delivery status
            $order = $delivery->order;
            if ($order) {
                $orderStatus = $this->mapDeliveryStatusToOrderStatus($validated['status']);
                $order->update(['status' => $orderStatus]);

                \Log::info('Order status updated with delivery', [
                    'delivery_id' => $delivery->id,
                    'order_id' => $order->id,
                    'delivery_status' => $validated['status'],
                    'order_status' => $orderStatus
                ]);
            }

            DB::commit();

            return response()->json([
                'delivery' => $delivery,
                'order' => $order,
                'message' => 'Delivery and order status updated successfully'
            ]);

        } catch (\Exception $e) {
            DB::rollback();

            \Log::error('Error updating delivery status', [
                'error' => $e->getMessage(),
                'delivery_id' => $delivery->id
            ]);

            return response()->json([
                'message' => 'An error occurred while updating the status',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error'
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
     * Remove the specified resource from storage.
     */
    public function destroy(Delivery $delivery)
    {
        $delivery->delete();
        return response()->noContent();
    }

    // User routes
    /**
     * Display a listing of the user's deliveries.
     */
    public function userDeliveries()
    {
        return Delivery::where('user_id', auth()->id())
            ->with('user')
            ->get();
    }

    /**
     * Display the specified resource for the authenticated user.
     */
    public function userDelivery($id)
    {
        try {
            // Log the incoming request
            \Log::info('Showing user delivery details', [
                'delivery_id' => $id,
                'user_id' => Auth::id()
            ]);

            $delivery = Delivery::where('id', $id)
                ->where('user_id', auth()->id())
                ->with('user')
                ->first();

            if (!$delivery) {
                \Log::warning('Delivery not found or unauthorized', [
                    'delivery_id' => $id,
                    'user_id' => Auth::id()
                ]);
                return response()->json(['message' => 'Delivery not found or unauthorized'], 404);
            }

            return response()->json($delivery);

        } catch (\Exception $e) {
            // Log the full exception
            \Log::error('Error in DeliveryController@userDelivery', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'delivery_id' => $id ?? 'null',
                'user_id' => Auth::id() ?? 'null'
            ]);

            return response()->json([
                'message' => 'Internal server error',
                'error' => config('app.debug') ? $e->getMessage() : 'An error occurred'
            ], 500);
        }
    }

    /**
     * Get dashboard statistics for the authenticated user.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getDashboardStats()
    {
        // Get user's deliveries
        $deliveries = Delivery::where('user_id', auth()->id())->get();

        // Calculate statistics
        $stats = [
            'totalDeliveries' => $deliveries->count(),
            'pendingDeliveries' => $deliveries->where('status', 'pending')->count(),
            'inProgressDeliveries' => $deliveries->where('status', 'in_progress')->count(),
            'deliveredDeliveries' => $deliveries->where('status', 'delivered')->count(),
            'cancelledDeliveries' => $deliveries->where('status', 'cancelled')->count(),

            // Add analytics data
            'analytics' => [
                'totalSpent' => $deliveries->where('status', '!=', 'cancelled')->sum('price'),
                'avgDeliveryTime' => $this->calculateAverageDeliveryTime($deliveries),
                'mostCommonDestination' => $this->getMostCommonDestination($deliveries)
            ],

            // Get recent deliveries
            'recentDeliveries' => $deliveries->sortByDesc('created_at')->take(5)->values()->all()
        ];

        return response()->json($stats);
    }

    /**
     * Calculate average delivery time in hours for completed deliveries.
     *
     * @param \Illuminate\Support\Collection $deliveries
     * @return float|null
     */
    private function calculateAverageDeliveryTime($deliveries)
    {
        $completedDeliveries = $deliveries->where('status', 'delivered')
            ->filter(function ($delivery) {
                return !is_null($delivery->created_at) && !is_null($delivery->actual_arrival_date);
            });

        if ($completedDeliveries->isEmpty()) {
            return null;
        }

        $totalHours = 0;
        foreach ($completedDeliveries as $delivery) {
            $totalHours += $delivery->created_at->diffInHours($delivery->actual_arrival_date);
        }

        return round($totalHours / $completedDeliveries->count(), 1);
    }

    /**
     * Get the most common delivery destination.
     *
     * @param \Illuminate\Support\Collection $deliveries
     * @return string|null
     */
    private function getMostCommonDestination($deliveries)
    {
        if ($deliveries->isEmpty()) {
            return null;
        }

        $destinations = $deliveries->groupBy('delivery_address')
            ->map(function ($group) {
                return $group->count();
            })
            ->sortDesc();

        if ($destinations->isEmpty()) {
            return null;
        }

        return $destinations->keys()->first();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'pickup_address' => 'required|string',
            'delivery_address' => 'required|string',
            'contact_number' => 'required|string',
            'weight' => 'required|numeric|min:0',
            'price' => 'required|numeric|min:0',
            'notes' => 'nullable|string',
            'shipping_method' => 'nullable|string|in:air,sea,truck,domestic',
            'estimated_arrival_date' => 'nullable|date',
            'actual_arrival_date' => 'nullable|date',
        ]);

        try {
            // Start a database transaction to ensure consistency
            \DB::beginTransaction();

            // Create the delivery
            $delivery = Delivery::create([
                'user_id' => auth()->id(),
                'pickup_address' => $validated['pickup_address'],
                'delivery_address' => $validated['delivery_address'],
                'contact_number' => $validated['contact_number'],
                'weight' => $validated['weight'],
                'price' => $validated['price'],
                'notes' => $validated['notes'] ?? null,
                'shipping_method' => $validated['shipping_method'] ?? 'domestic',
                'estimated_arrival_date' => $validated['estimated_arrival_date'] ?? null,
                'actual_arrival_date' => $validated['actual_arrival_date'] ?? null,
                'status' => 'pending'
            ]);

            // Automatically create an associated order
            $order = Order::create([
                'user_id' => auth()->id(),
                'delivery_id' => $delivery->id,
                'amount' => $validated['price'], // Use the delivery price as the order amount
                'status' => 'pending' // Start with pending status
            ]);

            // Commit the transaction
            \DB::commit();

            // Log the successful creation
            \Log::info('Delivery and order created successfully', [
                'delivery_id' => $delivery->id,
                'order_id' => $order->id,
                'user_id' => auth()->id()
            ]);

            // Return the delivery with the associated order
            return response()->json([
                'delivery' => $delivery,
                'order' => $order,
                'message' => 'Delivery and order created successfully'
            ], 201);

        } catch (\Exception $e) {
            // Rollback the transaction
            \DB::rollback();

            // Log the error
            \Log::error('Error creating delivery and order', [
                'error' => $e->getMessage(),
                'user_id' => auth()->id()
            ]);

            return response()->json([
                'message' => 'An error occurred while creating the delivery and order',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error'
            ], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Delivery $delivery)
    {
        try {
            // Check if user owns this delivery or is admin
            if (auth()->user()->role !== 'admin' && $delivery->user_id !== auth()->id()) {
                return response()->json(['message' => 'Unauthorized'], 403);
            }

            // Check if delivery can be modified
            if (in_array($delivery->status, ['delivered', 'cancelled', 'in_progress'])) {
                return response()->json([
                    'message' => 'Cannot modify delivered, cancelled, or in-progress deliveries'
                ], 422);
            }

            $validated = $request->validate([
                'pickup_address' => 'required|string',
                'delivery_address' => 'required|string',
                'contact_number' => 'required|string',
                'weight' => 'required|numeric|min:0',
                'price' => 'required|numeric|min:0',
                'notes' => 'nullable|string',
                'shipping_method' => 'nullable|string|in:air,sea,truck,domestic',
                'estimated_arrival_date' => 'nullable|date',
                'actual_arrival_date' => 'nullable|date',
            ]);

            $delivery->update([
                'pickup_address' => $validated['pickup_address'],
                'delivery_address' => $validated['delivery_address'],
                'contact_number' => $validated['contact_number'],
                'weight' => $validated['weight'],
                'price' => $validated['price'],
                'notes' => $validated['notes'] ?? null,
                'shipping_method' => $validated['shipping_method'] ?? $delivery->shipping_method,
                'estimated_arrival_date' => $validated['estimated_arrival_date'] ?? $delivery->estimated_arrival_date,
                'actual_arrival_date' => $validated['actual_arrival_date'] ?? $delivery->actual_arrival_date,
            ]);

            return response()->json($delivery->load('user'));

        } catch (\Exception $e) {
            \Log::error('Error updating delivery', [
                'error' => $e->getMessage(),
                'delivery_id' => $delivery->id,
                'user_id' => auth()->id()
            ]);

            return response()->json([
                'message' => 'An error occurred while updating the delivery'
            ], 500);
        }
    }

    /**
     * Cancel a user's own delivery.
     */
    public function cancelUserDelivery(Delivery $delivery)
    {
        try {
            // Check if user owns this delivery
            if ($delivery->user_id !== auth()->id()) {
                return response()->json(['message' => 'Unauthorized'], 403);
            }

            // Check if delivery can be cancelled
            if (in_array($delivery->status, ['delivered', 'cancelled'])) {
                return response()->json([
                    'message' => 'Cannot cancel delivered or already cancelled deliveries'
                ], 422);
            }

            DB::beginTransaction();

            $delivery->update(['status' => 'cancelled']);

            // Also cancel the corresponding order
            $order = $delivery->order;
            if ($order) {
                $order->update(['status' => 'cancelled']);

                \Log::info('Order cancelled with delivery', [
                    'delivery_id' => $delivery->id,
                    'order_id' => $order->id,
                    'user_id' => auth()->id()
                ]);
            }

            DB::commit();

            return response()->json([
                'delivery' => $delivery->load('user'),
                'order' => $order,
                'message' => 'Delivery and order cancelled successfully'
            ]);

        } catch (\Exception $e) {
            DB::rollback();

            \Log::error('Error cancelling user delivery', [
                'error' => $e->getMessage(),
                'delivery_id' => $delivery->id,
                'user_id' => auth()->id()
            ]);

            return response()->json([
                'message' => 'An error occurred while cancelling the delivery'
            ], 500);
        }
    }
}
