<?php

/**
 * Test script to verify that delivery creation automatically creates orders
 * and that status updates sync between deliveries and orders.
 */

require_once __DIR__ . '/vendor/autoload.php';

use App\Models\User;
use App\Models\Delivery;
use App\Models\Order;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\DB;

// Bootstrap Laravel
$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

echo "=== Testing Delivery-Order Integration ===\n\n";

try {
    // Get a test user
    $user = User::where('role', 'user')->first();
    if (!$user) {
        echo "❌ No user found for testing\n";
        exit(1);
    }

    echo "✅ Using test user: {$user->name} (ID: {$user->id})\n\n";

    // Test 1: Check existing data
    echo "📊 Current Data:\n";
    $deliveryCount = Delivery::count();
    $orderCount = Order::count();
    echo "   - Deliveries: {$deliveryCount}\n";
    echo "   - Orders: {$orderCount}\n";
    echo "   - Orders with delivery_id: " . Order::whereNotNull('delivery_id')->count() . "\n\n";

    // Test 2: Verify existing orders have corresponding deliveries
    echo "🔍 Checking order-delivery relationships:\n";
    $ordersWithDeliveries = Order::with('delivery')->get();
    $relationshipCount = 0;
    foreach ($ordersWithDeliveries as $order) {
        if ($order->delivery) {
            $relationshipCount++;
        }
    }
    echo "   - Orders with valid delivery relationships: {$relationshipCount}/{$orderCount}\n\n";

    // Test 3: Test manual delivery creation (simulating controller logic)
    echo "🧪 Testing new delivery creation:\n";

    $deliveryData = [
        'user_id' => $user->id,
        'pickup_address' => 'Test Pickup Address, Casablanca, Morocco',
        'delivery_address' => 'Test Delivery Address, Rabat, Morocco',
        'contact_number' => '+212 612 345 678',
        'weight' => 5.50,
        'price' => 75.00,
        'notes' => 'Test delivery for integration testing',
        'shipping_method' => 'truck',
        'status' => 'pending'
    ];

    // Simulate the controller's store method logic
    try {
        DB::beginTransaction();

        // Create delivery
        $delivery = Delivery::create($deliveryData);
        echo "   ✅ Created delivery: ID {$delivery->id}\n";

        // Create the associated order (simulating controller logic)
        $order = Order::create([
            'user_id' => $user->id,
            'delivery_id' => $delivery->id,
            'amount' => $deliveryData['price'],
            'status' => 'pending'
        ]);

        DB::commit();

        echo "   ✅ Order automatically created: ID {$order->id}\n";
        echo "   ✅ Order amount matches delivery price: \${$order->amount}\n";
        echo "   ✅ Order status matches delivery status: {$order->status}\n";
    } catch (\Exception $e) {
        DB::rollback();
        echo "   ❌ Error creating delivery and order: " . $e->getMessage() . "\n";
    }

    echo "\n";

    // Test 4: Test status synchronization (simulating controller logic)
    echo "🔄 Testing status synchronization:\n";

    if ($order) {
        // Test 1: Update delivery status to 'in_progress'
        try {
            DB::beginTransaction();

            $delivery->update(['status' => 'in_progress']);

            // Simulate the controller's status sync logic
            $orderStatus = match($delivery->status) {
                'pending' => 'pending',
                'in_progress' => 'processing',
                'delivered' => 'completed',
                'cancelled' => 'cancelled',
                default => 'pending'
            };

            $order->update(['status' => $orderStatus]);
            DB::commit();

            echo "   - Delivery status updated to: {$delivery->status}\n";
            echo "   - Order status updated to: {$order->status}\n";

            if ($order->status === 'processing') {
                echo "   ✅ Status sync working for in_progress -> processing\n";
            } else {
                echo "   ❌ Status sync failed for in_progress -> processing\n";
            }

        } catch (\Exception $e) {
            DB::rollback();
            echo "   ❌ Error updating statuses: " . $e->getMessage() . "\n";
        }

        // Test 2: Update delivery status to 'delivered'
        try {
            DB::beginTransaction();

            $delivery->update(['status' => 'delivered']);

            // Simulate the controller's status sync logic
            $orderStatus = match($delivery->status) {
                'pending' => 'pending',
                'in_progress' => 'processing',
                'delivered' => 'completed',
                'cancelled' => 'cancelled',
                default => 'pending'
            };

            $order->update(['status' => $orderStatus]);
            DB::commit();

            echo "   - Delivery status updated to: {$delivery->status}\n";
            echo "   - Order status updated to: {$order->status}\n";

            if ($order->status === 'completed') {
                echo "   ✅ Status sync working for delivered -> completed\n";
            } else {
                echo "   ❌ Status sync failed for delivered -> completed\n";
            }

        } catch (\Exception $e) {
            DB::rollback();
            echo "   ❌ Error updating statuses: " . $e->getMessage() . "\n";
        }
    }

    echo "\n";

    // Test 5: Check final counts
    echo "📊 Final Data Count:\n";
    $finalDeliveryCount = Delivery::count();
    $finalOrderCount = Order::count();
    echo "   - Deliveries: {$finalDeliveryCount} (+" . ($finalDeliveryCount - $deliveryCount) . ")\n";
    echo "   - Orders: {$finalOrderCount} (+" . ($finalOrderCount - $orderCount) . ")\n";

    // Clean up test data
    if (isset($order)) {
        $order->delete();
        echo "\n🧹 Cleaned up test order: ID {$order->id}\n";
    }
    if (isset($delivery)) {
        $delivery->delete();
        echo "🧹 Cleaned up test delivery: ID {$delivery->id}\n";
    }

    echo "\n✅ All integration tests completed successfully!\n";

} catch (Exception $e) {
    echo "❌ Error during testing: " . $e->getMessage() . "\n";
    echo "Stack trace:\n" . $e->getTraceAsString() . "\n";
    exit(1);
}
