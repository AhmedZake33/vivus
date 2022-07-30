<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\System\System;


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

    public function data($type)
    {   
        $data = (object)[];
        if($type == System::DATA_DETAILS)
        {
            $data->ar_name = $this->ar_name;
            $data->en_name = $this->en_name;
            $data->price = $this->price;
        }

        return $data;
    }
    
}
