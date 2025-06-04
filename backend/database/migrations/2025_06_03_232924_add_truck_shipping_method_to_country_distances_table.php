<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Update the enum to include 'truck'
        DB::statement("ALTER TABLE country_distances MODIFY COLUMN shipping_method ENUM('air', 'sea', 'truck') DEFAULT 'air'");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Remove 'truck' from the enum (this will delete any truck records)
        DB::statement("DELETE FROM country_distances WHERE shipping_method = 'truck'");
        DB::statement("ALTER TABLE country_distances MODIFY COLUMN shipping_method ENUM('air', 'sea') DEFAULT 'air'");
    }
};
