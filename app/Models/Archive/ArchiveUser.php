<?php

namespace App\Models\Archive;

use Illuminate\Database\Eloquent\Model;

class ArchiveUser extends Model
{
    protected $table = 'archive_users';
    public $timestamps = false;

    public function archive() {
        return $this->belongsTo(Archive::class, 'archive_id', 'id');
    }
}
