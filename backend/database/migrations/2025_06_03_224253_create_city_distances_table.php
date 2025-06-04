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
        Schema::create('city_distances', function (Blueprint $table) {
            $table->id();
            $table->string('from_city', 100);
            $table->string('to_city', 100);
            $table->string('from_country', 100)->default('Morocco');
            $table->string('to_country', 100)->default('Morocco');
            $table->decimal('distance_km', 8, 2);
            $table->timestamps();

            // Create indexes for better performance
            $table->index(['from_city', 'to_city']);
            $table->index(['from_country', 'to_country']);

            // Ensure unique combinations (both directions should be stored)
            $table->unique(['from_city', 'to_city', 'from_country', 'to_country']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('city_distances');
    }
};
