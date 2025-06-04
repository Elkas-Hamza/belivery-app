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
        Schema::create('country_distances', function (Blueprint $table) {
            $table->id();
            $table->string('from_country', 100);
            $table->string('to_country', 100);
            $table->decimal('distance_km', 10, 2); // Larger precision for international distances
            $table->enum('shipping_method', ['air', 'sea'])->default('air');
            $table->integer('estimated_days_min')->default(1);
            $table->integer('estimated_days_max')->default(7);
            $table->timestamps();

            // Create indexes for better performance
            $table->index(['from_country', 'to_country']);
            $table->index(['shipping_method']);

            // Ensure unique combinations per shipping method
            $table->unique(['from_country', 'to_country', 'shipping_method']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('country_distances');
    }
};
