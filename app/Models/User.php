<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;
use App\Models\System\System;
use App\Models\Archive\Archive;
use App\Models\System\SystemMail;


class User extends Authenticatable
{
    use HasApiTokens,HasFactory, Notifiable;
    use HasRoles;


    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'email', 'password','mobile','city','national_id'
    ];

    protected $with = [
            'locations'
    ];

    // removed => 1 : removed
    // removed => 0 : active
    // removed => 2 : pending
    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password', 'remember_token',
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    public function archive()
    {
        if (empty($this->archive_id)) {
            $this->createArchive();
        }
        return $this->belongsTo(Archive::class, 'archive_id', 'id');
    }

    public function createArchive()
    {
        if ($this->archive_id) return $this->archive_id;
        $archive = Archive::get("users/$this->id");
        $this->archive_id = $archive->id;
        $this->save();
        return $this->archive_id;
    }

    public function locations()
    {
        return $this->hasMany(Location::class);
    }

    public function data($type)
    {
        $data = (object)[];
        if($type == System::DATA_BRIEF)
        {
            $data->email = $this->email;
            $data->mobile = $this->mobile;
            // $data->national_id = $this->national_id;
            // $data->city = $this->city;
            $data->name = $this->name;
            $data->token = $this->token;          
        }
        if($type == System::DATA_LIST)
        {
            $data->email = $this->email;
            $data->mobile = $this->mobile;
            // $data->national_id = $this->national_id;
            // $data->city = $this->city;
            $data->name = $this->name;
        }
        if($type == System::DATA_DETAILS)
        {
            $data->email = $this->email;
            $data->mobile = $this->mobile;
            // $data->national_id = $this->national_id;
            // $data->city = $this->city;
            $data->name = $this->name;
            // $archive = $this->archive->findChildByShortName('PERSONAL_ID_CARD');
            // $data->photo = $archive ? route('secure_download_file', [$archive]) : null;
        }

        return $data;
    }

    public function orders()
    {
        return $this->hasMany(Order::class);
    }

    public function save(array $options = [])
    {
        $name = "$this->name";
        $mobile = ($this->mobile) ? str_replace(" ", "", $this->mobile) : "";
        $email = ($this->email) ? $this->email : "";
        $national_id = ($this->national_id) ? $this->national_id : "";
        $text = "#$this->id, " . getFTS($name) . ", $email, $mobile , $national_id";
        $this->search_text = $text;
        parent::save($options);
    }
}
