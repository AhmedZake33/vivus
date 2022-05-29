<?php

namespace App\Models\Archive;

use Illuminate\Database\Eloquent\Model;

class ArchiveRole extends Model
{
    protected $table = 'archive_roles';
    public $timestamps = false;

    public function archive() {
        return $this->belongsTo(Archive::class, 'archive_id', 'id');
    }
}
