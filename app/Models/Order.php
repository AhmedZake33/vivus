<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;
    protected $fillable = ['Quantity','details','category_id'];
    protected $with = ['category:id,ar_name,en_name,price'];

    public function category()
    {
        return $this->belongsTo(category::class);
    }
}
