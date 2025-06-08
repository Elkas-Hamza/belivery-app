# Delivery-Order Integration Documentation

## Overview

This document describes the automatic delivery-order integration implemented in the Laravel backend system. When deliveries are created, corresponding orders are automatically created, and status changes are synchronized between deliveries and orders.

## Features Implemented

### 1. Automatic Order Creation

-   When a delivery is created via the API (`POST /api/deliveries`), an order is automatically created
-   The order contains:
    -   `user_id`: Same as the delivery
    -   `delivery_id`: Links to the created delivery
    -   `amount`: Uses the delivery's `price` field
    -   `status`: Starts as 'pending'

### 2. Status Synchronization

Status changes between deliveries and orders are automatically synchronized:

| Delivery Status | Order Status |
| --------------- | ------------ |
| `pending`       | `pending`    |
| `in_progress`   | `processing` |
| `delivered`     | `completed`  |
| `cancelled`     | `cancelled`  |

### 3. Database Relationships

-   **Delivery Model**: `hasOne(Order::class)`
-   **Order Model**: `belongsTo(Delivery::class)`
-   Both models also have `belongsTo(User::class)` relationships

## Implementation Details

### Modified Files

#### 1. DeliveryController (`app/Http/Controllers/API/DeliveryController.php`)

-   **Added imports**: `use App\Models\Order;`
-   **Modified `store()` method**: Automatically creates orders when deliveries are created
-   **Enhanced `updateStatus()` method**: Synchronizes order status when delivery status changes
-   **Updated `cancelUserDelivery()` method**: Cancels associated orders when deliveries are cancelled
-   **Added status mapping function**: `mapDeliveryStatusToOrderStatus()`

#### 2. DevController (`app/Http/Controllers/API/DevController.php`)

-   **Added imports**: `use Illuminate\Support\Facades\DB;`
-   **Enhanced `updateDeliveryStatus()` method**: Synchronizes order status for development endpoints
-   **Added status mapping function**: `mapDeliveryStatusToOrderStatus()`

#### 3. DeliveriesTableSeeder (`database/seeders/DeliveriesTableSeeder.php`)

-   **Updated seeder**: Now creates matching orders for each delivery during seeding
-   **Added status mapping**: Ensures seeded orders have appropriate statuses

### Key Methods

#### DeliveryController@store

```php
public function store(Request $request)
{
    // Validation...

    DB::beginTransaction();

    // Create delivery
    $delivery = Delivery::create([...]);

    // Automatically create associated order
    $order = Order::create([
        'user_id' => auth()->id(),
        'delivery_id' => $delivery->id,
        'amount' => $validated['price'],
        'status' => 'pending'
    ]);

    DB::commit();

    return response()->json([
        'delivery' => $delivery,
        'order' => $order,
        'message' => 'Delivery and order created successfully'
    ], 201);
}
```

#### Status Synchronization

```php
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
```

## API Endpoints

### Delivery Creation

-   **Endpoint**: `POST /api/deliveries`
-   **Authentication**: Required (Sanctum)
-   **Response**: Returns both delivery and automatically created order
-   **Transaction**: Uses database transactions for data consistency

### Status Updates

-   **Delivery Status**: `PATCH /api/deliveries/{id}/updateStatus`
-   **Dev Status Update**: `PATCH /api/dev/deliveries/{id}/status`
-   **Effect**: Updates both delivery and associated order status

## Testing

### Test Scripts Created

1. **Integration Test**: `test-delivery-order-integration.php`

    - Tests automatic order creation
    - Tests status synchronization
    - Verifies data relationships

2. **API Test**: `test-api-integration.php`

    - Tests actual API endpoints
    - Verifies HTTP responses
    - Tests status update endpoints

3. **Creation API Test**: `test-delivery-creation-api.php`
    - Simulates delivery creation API
    - Tests relationship integrity
    - Verifies data cleanup

### Running Tests

```bash
cd /path/to/backend
php test-delivery-order-integration.php
php test-api-integration.php
php test-delivery-creation-api.php
```

## Database Schema

### Orders Table

```sql
CREATE TABLE orders (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    delivery_id BIGINT UNSIGNED NULL,
    amount DECIMAL(8,2) NOT NULL,
    status ENUM('pending','processing','completed','cancelled') NOT NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (delivery_id) REFERENCES deliveries(id)
);
```

## Error Handling

### Transaction Safety

-   All create/update operations use database transactions
-   Automatic rollback on errors
-   Comprehensive error logging

### Validation

-   Input validation on all endpoints
-   Status transition validation
-   Authorization checks (user ownership)

## Frontend Integration Notes

### Updated Response Format

Delivery creation now returns:

```json
{
    "delivery": {
        /* delivery object */
    },
    "order": {
        /* automatically created order */
    },
    "message": "Delivery and order created successfully"
}
```

### Status Updates Response

```json
{
    "delivery": {
        /* updated delivery */
    },
    "order": {
        /* synchronized order */
    },
    "message": "Delivery and order status updated successfully"
}
```

## Backwards Compatibility

-   Existing deliveries without orders continue to work
-   Old API responses include additional order information
-   No breaking changes to existing endpoints

## Future Enhancements

1. **Email Notifications**: Send order confirmations when deliveries are created
2. **Payment Integration**: Link order amounts to payment processing
3. **Inventory Management**: Update stock levels based on delivery completion
4. **Reporting**: Enhanced reporting with delivery-order correlation
5. **Bulk Operations**: Bulk delivery/order creation and status updates

## Troubleshooting

### Common Issues

1. **Orders not created**: Check authentication and transaction logs
2. **Status not syncing**: Verify order exists and relationship is intact
3. **Data inconsistency**: Check for failed transactions in logs

### Debugging

-   Check Laravel logs: `storage/logs/laravel.log`
-   Database transactions are logged
-   Status changes are logged with context

## Conclusion

The delivery-order integration provides a robust, automated system for maintaining data consistency between deliveries and orders. The implementation uses Laravel best practices including database transactions, proper error handling, and comprehensive testing.
