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

    public function save(array $options = [])
    {
        $text = "#$this->id, $this->Quantity, $this->details , $this->category_id";
        $this->search_text = $text;
        parent::save($options);
    }
}
