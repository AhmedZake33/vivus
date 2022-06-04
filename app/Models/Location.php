<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Location extends Model
{   
    use HasFactory;

    protected $fillable = ['lat','lng','street','city','country','type','user_id'];


    public function user()
    {
       
        return $this->belongsTo(User::class);
        
    }


    public function save(array $options = [])
    {
        $street = ($this->street) ? str_replace(" ", "", $this->street) : "";
        $national_id = ($this->national_id) ? $this->national_id : "";
        $text = "#$this->id, $this->lat, $this->lng , $street , $this->city , $this->country , $this->type , $this->user_id";
        $this->search_text = $text;
        parent::save($options);
    }


    
}
