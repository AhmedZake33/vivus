<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;
    protected $fillable = ['Quantity','details','category_id','user_id'];
    protected $with = ['category:id,ar_name,en_name,price'];

    public function category()
    {
        return $this->belongsTo(category::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }  

    public function save(array $options = [])
    {
        $text = "#$this->id, $this->Quantity, $this->details , $this->category_id";
        $this->search_text = $text;
        parent::save($options);
    }
}
