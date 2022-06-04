<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
    use HasFactory;
    protected $table = "posts";

    protected $fillable = ['header','content','user_id'];



    public function save(array $options = [])
    {
        $header = ($this->header) ? str_replace(" ", "", $this->header) : "";
        $content = ($this->content) ? str_replace(" ", "", $this->content) : "";
        $text = "#$this->id, $header, $content , $this->user_id";
        $this->search_text = $text;
        parent::save($options);
    }
}
