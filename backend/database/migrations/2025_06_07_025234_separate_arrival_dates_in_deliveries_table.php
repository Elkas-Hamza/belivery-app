<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('deliveries', function (Blueprint $table) {
            // Rename existing arrival_date to estimated_arrival_date
            $table->renameColumn('arrival_date', 'estimated_arrival_date');

            // Add new actual_arrival_date column
            $table->timestamp('actual_arrival_date')->nullable()->after('estimated_arrival_date');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('deliveries', function (Blueprint $table) {
            // Drop the new actual_arrival_date column
            $table->dropColumn('actual_arrival_date');

            // Rename back to original name
            $table->renameColumn('estimated_arrival_date', 'arrival_date');
        });
    }
};
