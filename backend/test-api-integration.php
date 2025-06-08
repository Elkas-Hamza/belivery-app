<?php

/**
 * Test script to verify the API endpoints for delivery-order integration
 */

require_once __DIR__ . '/vendor/autoload.php';

use App\Models\User;
use App\Models\Delivery;
use App\Models\Order;

// Bootstrap Laravel
$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

echo "=== Testing API Integration ===\n\n";

try {
    // Get a test user
    $user = User::where('role', 'user')->first();
    if (!$user) {
        echo "❌ No user found for testing\n";
        exit(1);
    }

    echo "✅ Using test user: {$user->name} (ID: {$user->id})\n\n";

    // Test API base URL (for local development)
    $baseUrl = 'http://localhost';
    $apiUrl = $baseUrl . '/abdsamad/backend/public/api';

    echo "🌐 Testing API endpoints:\n";
    echo "   API URL: {$apiUrl}\n\n";

    // Test 1: Check if API is accessible (test GET /dev/deliveries endpoint)
    echo "🔍 Testing dev deliveries endpoint:\n";

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $apiUrl . '/dev/deliveries');
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Content-Type: application/json',
        'Accept: application/json'
    ]);

    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($httpCode === 200) {
        $data = json_decode($response, true);
        $deliveryCount = is_array($data) ? count($data) : 0;
        echo "   ✅ API accessible - Retrieved {$deliveryCount} deliveries\n";
    } else {
        echo "   ❌ API not accessible - HTTP {$httpCode}\n";
        echo "   Response: " . substr($response, 0, 200) . "...\n";
    }

    echo "\n";

    // Test 2: Check orders endpoint
    echo "🔍 Testing dev orders endpoint:\n";

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $apiUrl . '/dev/orders');
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Content-Type: application/json',
        'Accept: application/json'
    ]);

    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($httpCode === 200) {
        $data = json_decode($response, true);
        $orderCount = is_array($data) ? count($data) : 0;
        echo "   ✅ Orders API accessible - Retrieved {$orderCount} orders\n";
    } else {
        echo "   ❌ Orders API not accessible - HTTP {$httpCode}\n";
        echo "   Response: " . substr($response, 0, 200) . "...\n";
    }

    echo "\n";

    // Test 3: Test status update endpoint
    echo "🔄 Testing delivery status update:\n";

    // Get a delivery to test with
    $testDelivery = Delivery::with('order')->where('status', '!=', 'delivered')->first();

    if ($testDelivery) {
        echo "   Using delivery ID: {$testDelivery->id} (current status: {$testDelivery->status})\n";

        if ($testDelivery->order) {
            echo "   Associated order ID: {$testDelivery->order->id} (current status: {$testDelivery->order->status})\n";
        }

        // Test updating to 'in_progress'
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $apiUrl . '/dev/deliveries/' . $testDelivery->id . '/status');
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'PATCH');
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode(['status' => 'in_progress']));
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Content-Type: application/json',
            'Accept: application/json'
        ]);

        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        if ($httpCode === 200) {
            $data = json_decode($response, true);
            echo "   ✅ Status update successful\n";
            echo "   Response: " . substr($response, 0, 300) . "...\n";

            // Refresh the delivery and order to check if sync worked
            $testDelivery->refresh();
            if ($testDelivery->order) {
                $testDelivery->order->refresh();
                echo "   📋 After update:\n";
                echo "     - Delivery status: {$testDelivery->status}\n";
                echo "     - Order status: {$testDelivery->order->status}\n";

                if ($testDelivery->status === 'in_progress' && $testDelivery->order->status === 'processing') {
                    echo "   ✅ Status synchronization working!\n";
                } else {
                    echo "   ❌ Status synchronization not working properly\n";
                }
            }
        } else {
            echo "   ❌ Status update failed - HTTP {$httpCode}\n";
            echo "   Response: " . substr($response, 0, 200) . "...\n";
        }
    } else {
        echo "   ❌ No suitable test delivery found\n";
    }

    echo "\n✅ API integration tests completed!\n";

} catch (\Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
    echo "Trace: " . $e->getTraceAsString() . "\n";
}
