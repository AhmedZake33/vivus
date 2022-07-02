<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePointsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('points', function (Blueprint $table) {
            $table->increments('id');
            $table->string('points',200);
            $table->integer('user_id');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::table('points', function (Blueprint $table) {
            Schema::dropIfExists('points');
        });
    }
}
