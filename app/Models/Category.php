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

    public function save(array $options = [])
    {
        $ar_name = ($this->ar_name) ? str_replace(" ", "", $this->ar_name) : "";
        $en_name = ($this->en_name) ? str_replace(" ", "", $this->en_name) : "";
        $text = "#$this->id, $ar_name, $en_name , $this->price";
        $this->search_text = $text;
        parent::save($options);
    }
    
}
