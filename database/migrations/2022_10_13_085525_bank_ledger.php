<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('bank_ledger', function (Blueprint $table) {
            $table->id();
            $table->integer('bank_id');
            $table->string('note');
            $table->integer('isIn');
            $table->decimal('amount', 18, 2);
            $table->string('author');
            $table->decimal('balance', 18, 2);
            $table->integer('next_id')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        //
    }
};
