<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->integer('archive_id')->nullable()->index('archive_id');
            $table->string('email')->nullable()->unique('email');
            $table->string('draft_email', 200)->nullable();
            $table->string('mobile', 12)->nullable()->unique('mobile');
            $table->string('verification_code',10)->nullable();
            $table->string('forget_code',10)->nullable();
            $table->string('national_id', 14)->nullable()->unique('national_id_2');
            $table->integer('firebase_token')->nullable()->default(0);
            $table->integer('removed')->default(0);
            $table->string('city')->nullable();
            $table->text('search_text')->nullable();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->rememberToken();
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
        Schema::dropIfExists('users');
    }
}
