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
        if (!Schema::hasTable('city')) {
            Schema::create('city', function (Blueprint $table) {
                $table->id();
                $table->string('name');
                $table->integer('state_id')->unsigned();
                $table->index('state_id');
                $table->index('name');
                $table->timestamps();
            });
        }
        if (!Schema::hasTable('state')) {
            Schema::create('state', function (Blueprint $table) {
                $table->id();
                $table->string('name');
                $table->index('name');
                $table->timestamps();
            });
        }
        if (!Schema::hasColumn('users', 'city_id')) {
            Schema::table('users', function (Blueprint $table) {
                $table->integer('ref_id')->unsigned()->nullable();
                $table->integer('city_id')->unsigned();
                $table->integer('hometown_id')->unsigned();
                $table->integer('birthplace_id')->unsigned();
                $table->date('birthday')->nullable();
                $table->string('job')->nullable();
                $table->string('sosmed_fb')->nullable();
                $table->string('sosmed_ig')->nullable();
                $table->string('sosmed_twitter')->nullable();
                $table->tinyInteger('bloodtype')->nullable();
                $table->tinyInteger('religion')->nullable();
                $table->tinyInteger('marriage')->default(1);
                $table->tinyInteger('gender')->nullable();
                $table->tinyInteger('familymember')->nullable();
                $table->string('emergency_name')->nullable();
                $table->string('emergency_phone')->nullable();
                $table->string('emergency_relation')->nullable();
                $table->index('city_id');
                $table->index('hometown_id');
                $table->index('birthplace_id');
                $table->index('ref_id');
                $table->index('birthday');
                $table->index('job');
                $table->index('bloodtype');
                $table->index('religion');
                $table->index('marriage');
                $table->index('gender');
                $table->index('name');
                $table->index('no_telp');
                $table->index('jabatan_id');
                $table->index('status');
            });
        }
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
