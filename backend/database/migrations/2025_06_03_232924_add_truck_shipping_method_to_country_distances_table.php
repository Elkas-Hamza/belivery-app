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
        if (config('database.default') === 'mysql') {
            DB::statement("ALTER TABLE country_distances MODIFY COLUMN shipping_method ENUM('air', 'sea', 'truck') DEFAULT 'air'");
        } else {
            // For SQLite, we need to recreate the table to remove the CHECK constraint
            Schema::table('country_distances', function (Blueprint $table) {
                $table->dropColumn('shipping_method');
            });

            Schema::table('country_distances', function (Blueprint $table) {
                $table->string('shipping_method', 20)->default('air')->after('distance_km');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Remove 'truck' from the enum (this will delete any truck records)
        DB::statement("DELETE FROM country_distances WHERE shipping_method = 'truck'");
        if (config('database.default') === 'mysql') {
            DB::statement("ALTER TABLE country_distances MODIFY COLUMN shipping_method ENUM('air', 'sea') DEFAULT 'air'");
        }
    }
};
