<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateArchiveTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('archive', function (Blueprint $table) {
            $table->integer('id', true);
            $table->integer('related_id')->default(0)->index('related_id');
            $table->integer('version')->default(0);
            $table->char('language', 2)->default('en');
            $table->string('short_name', 32)->nullable();
            $table->integer('parent_id')->default(0)->index('parent_id');
            $table->integer('type')->default(0)->comment('0: folder, 1:page, 2:binary, 3:text, 4:json 5:xml, 6:url');
            $table->string('archive_link', 200)->nullable();
            $table->integer('order')->nullable();
            $table->integer('flags')->default(3);
            $table->integer('user_id')->nullable()->index('user_id');
            $table->string('title', 300);
            $table->string('sub_title', 512)->nullable();
            $table->mediumText('description')->nullable();
            $table->string('extension', 200)->nullable();
            $table->string('application_type', 256)->nullable();
            $table->string('content_type', 128)->nullable();
            $table->integer('document_type_id')->nullable();
            $table->integer('document_id')->nullable();
            $table->integer('uploading_stage')->nullable();
            $table->integer('size')->default(0);
            $table->string('path', 1024)->nullable();
            $table->text('search_text')->nullable();
            $table->integer('access_count')->default(0);
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
        Schema::dropIfExists('archive');
    }
}
