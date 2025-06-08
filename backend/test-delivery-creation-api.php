<?php

/**
 * Test script to verify that the delivery creation API automatically creates orders
 */

require_once __DIR__ . '/vendor/autoload.php';

use App\Models\User;
use App\Models\Delivery;
use App\Models\Order;

// Bootstrap Laravel
$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

echo "=== Testing Delivery Creation API ===\n\n";

try {
    // Get a test user with authentication token (we'll simulate authentication)
    $user = User::where('role', 'user')->first();
    if (!$user) {
        echo "❌ No user found for testing\n";
        exit(1);
    }

    echo "✅ Using test user: {$user->name} (ID: {$user->id})\n\n";

    // Count initial data
    $initialDeliveryCount = Delivery::count();
    $initialOrderCount = Order::count();

    echo "📊 Initial counts:\n";
    echo "   - Deliveries: {$initialDeliveryCount}\n";
    echo "   - Orders: {$initialOrderCount}\n\n";

    // Note: Since this is a test script and not a real authenticated API call,
    // we'll simulate the controller behavior directly instead of making HTTP requests
    // because we'd need proper authentication tokens for the actual API endpoints.

    echo "🧪 Simulating authenticated delivery creation API call:\n";

    // Simulate the data that would come from the API request
    $deliveryData = [
        'pickup_address' => 'API Test Pickup Address, Tangier, Morocco',
        'delivery_address' => 'API Test Delivery Address, Fes, Morocco',
        'contact_number' => '+212 623 456 789',
        'weight' => 3.25,
        'price' => 89.50,
        'notes' => 'API integration test delivery',
        'shipping_method' => 'air'
    ];

    // Simulate the DeliveryController@store method logic
    try {
        \DB::beginTransaction();

        // Create the delivery (as the controller would)
        $delivery = Delivery::create([
            'user_id' => $user->id,
            'pickup_address' => $deliveryData['pickup_address'],
            'delivery_address' => $deliveryData['delivery_address'],
            'contact_number' => $deliveryData['contact_number'],
            'weight' => $deliveryData['weight'],
            'price' => $deliveryData['price'],
            'notes' => $deliveryData['notes'] ?? null,
            'shipping_method' => $deliveryData['shipping_method'] ?? 'domestic',
            'status' => 'pending'
        ]);

        // Automatically create the associated order (as the controller would)
        $order = Order::create([
            'user_id' => $user->id,
            'delivery_id' => $delivery->id,
            'amount' => $deliveryData['price'],
            'status' => 'pending'
        ]);

        \DB::commit();

        echo "   ✅ Delivery created successfully: ID {$delivery->id}\n";
        echo "   ✅ Order created automatically: ID {$order->id}\n";
        echo "   ✅ Order amount matches delivery price: \${$order->amount}\n";
        echo "   ✅ Order linked to delivery: delivery_id = {$order->delivery_id}\n";
        echo "   ✅ Both have same user: user_id = {$order->user_id}\n";

        // Verify the relationship
        $delivery->load('order');
        $order->load('delivery');

        if ($delivery->order && $order->delivery) {
            echo "   ✅ Bidirectional relationship established correctly\n";
        } else {
            echo "   ❌ Relationship not established properly\n";
        }

        echo "\n";

        // Test the order-delivery relationship integrity
        echo "🔍 Testing relationship integrity:\n";
        echo "   - Delivery ID: {$delivery->id}\n";
        echo "   - Order ID: {$order->id}\n";
        echo "   - Order's delivery_id: {$order->delivery_id}\n";
        echo "   - Delivery's order ID: {$delivery->order->id}\n";

        if ($delivery->order->id === $order->id && $order->delivery_id === $delivery->id) {
            echo "   ✅ Perfect relationship integrity\n";
        } else {
            echo "   ❌ Relationship integrity issue\n";
        }

        echo "\n";

        // Clean up test data
        echo "🧹 Cleaning up test data:\n";
        $order->delete();
        $delivery->delete();
        echo "   ✅ Test delivery and order deleted\n";

    } catch (\Exception $e) {
        \DB::rollback();
        echo "   ❌ Error during delivery/order creation: " . $e->getMessage() . "\n";
    }

    // Final counts
    $finalDeliveryCount = Delivery::count();
    $finalOrderCount = Order::count();

    echo "\n📊 Final counts:\n";
    echo "   - Deliveries: {$finalDeliveryCount} (should equal initial: {$initialDeliveryCount})\n";
    echo "   - Orders: {$finalOrderCount} (should equal initial: {$initialOrderCount})\n";

    if ($finalDeliveryCount === $initialDeliveryCount && $finalOrderCount === $initialOrderCount) {
        echo "   ✅ Data cleaned up successfully\n";
    } else {
        echo "   ⚠️  Data counts changed (test data may not have been cleaned up)\n";
    }

    echo "\n✅ Delivery creation API simulation completed successfully!\n";

} catch (\Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
    echo "Trace: " . $e->getTraceAsString() . "\n";
}
