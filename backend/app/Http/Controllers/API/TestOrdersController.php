<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class TestOrdersController extends Controller
{
    /**
     * Test the orders table and return diagnostic info
     */
    public function testOrders()
    {
        try {
            // Log that we're starting the test
            Log::info('Starting orders diagnostic test');

            // Check if orders table exists
            $tableExists = DB::getSchemaBuilder()->hasTable('orders');

            // Get table structure
            $columns = [];
            if ($tableExists) {
                $columns = DB::getSchemaBuilder()->getColumnListing('orders');
            }

            // Count orders
            $orderCount = 0;
            if ($tableExists) {
                $orderCount = Order::count();
            }

            // Try the original query from AdminController but with error catching
            $orders = [];
            $queryError = null;

            try {
                if ($tableExists) {
                    $orders = DB::table('orders')
                        ->join('users', 'orders.user_id', '=', 'users.id')
                        ->select(
                            'orders.id',
                            'orders.user_id',
                            'users.name as user_name',
                            'orders.delivery_id',
                            'orders.amount',
                            'orders.status',
                            'orders.created_at'
                        )
                        ->limit(2)
                        ->get();
                }
            } catch (\Exception $e) {
                $queryError = $e->getMessage();
                Log::error('Query error: ' . $e->getMessage());
            }

            return response()->json([
                'success' => true,
                'table_exists' => $tableExists,
                'columns' => $columns,
                'order_count' => $orderCount,
                'query_error' => $queryError,
                'sample_orders' => $orders
            ]);

        } catch (\Exception $e) {
            Log::error('Diagnostic error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ], 500);
        }
    }
}
