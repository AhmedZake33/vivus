<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    use HasFactory;
    protected $fillable = ['ar_name','en_name','price'];

    public function orders()
    {
        return $this->hasMany(Order::class);
    }
}
