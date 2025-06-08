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
            $table->dropColumn(['driver_name', 'driver_phone', 'estimated_delivery_time']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('deliveries', function (Blueprint $table) {
            $table->string('driver_name')->nullable()->after('status');
            $table->string('driver_phone')->nullable()->after('driver_name');
            $table->dateTime('estimated_delivery_time')->nullable()->after('driver_phone');
        });
    }
};
