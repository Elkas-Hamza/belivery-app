<?php

// Simple test script to verify API updates
echo "=== API UPDATES TEST ===\n\n";

// Test orders endpoint (should not have payment_method)
echo "Testing Orders API...\n";
$ordersResponse = file_get_contents('http://localhost:8000/api/dev/orders');
$orders = json_decode($ordersResponse, true);

if (!empty($orders)) {
    $firstOrder = $orders[0];
    echo "✓ Orders API working\n";
    echo "✓ Order fields: " . implode(', ', array_keys($firstOrder)) . "\n";

    if (isset($firstOrder['payment_method'])) {
        echo "✗ ERROR: payment_method field still present!\n";
    } else {
        echo "✓ payment_method field successfully removed\n";
    }
} else {
    echo "✗ No orders found\n";
}

echo "\n";

// Test deliveries endpoint (should have driver fields)
echo "Testing Deliveries API...\n";
$deliveriesResponse = file_get_contents('http://localhost:8000/api/dev/deliveries');
$deliveries = json_decode($deliveriesResponse, true);

if (!empty($deliveries)) {
    $firstDelivery = $deliveries[0];
    echo "✓ Deliveries API working\n";
    echo "✓ Delivery fields: " . implode(', ', array_keys($firstDelivery)) . "\n";

    // Check that driver fields are NOT present (as they have been removed)
    $removedDriverFields = ['driver_name', 'driver_phone', 'estimated_delivery_time'];
    $presentDriverFields = [];

    foreach ($removedDriverFields as $field) {
        if (array_key_exists($field, $firstDelivery)) {
            $presentDriverFields[] = $field;
        }
    }

    if (empty($presentDriverFields)) {
        echo "✓ Driver fields successfully removed from API response\n";
        echo "✓ Core delivery fields present: ID, status, addresses, weight, price\n";
    } else {
        echo "✗ Driver fields still present: " . implode(', ', $presentDriverFields) . "\n";
        echo "✗ These fields should have been removed from the system\n";
    }

    // Check for essential fields
    $essentialFields = ['id', 'status', 'pickup_address', 'delivery_address', 'weight', 'price'];
    $missingFields = [];

    foreach ($essentialFields as $field) {
        if (!array_key_exists($field, $firstDelivery)) {
            $missingFields[] = $field;
        }
    }

    if (empty($missingFields)) {
        echo "✓ All essential delivery fields present\n";
    } else {
        echo "✗ Missing essential fields: " . implode(', ', $missingFields) . "\n";
    }
} else {
    echo "✗ No deliveries found\n";
}

echo "\n=== TEST COMPLETE ===\n";
