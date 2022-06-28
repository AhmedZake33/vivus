<?php
namespace App\Models\System;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Mail;

use App\Models\Users\User;


//you should the queue with: php artisan queue:listen or php artisan queue:work
//nohup php artisan queue:listen --tries=3 > /dev/null 2>&1 &

//In WHM go Server Configuration/Tweak Settings/Restrict outgoing SMTP to root --> off

class SystemMail extends Mailable
{
    use Queueable, SerializesModels;

    protected $body;
    protected $template;
    protected $data;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($title, $template, $data) {
        $this->title = $title;
        $this->template = $template;
        $this->data = $data;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build() {

        $data = (object)$this->data;

        return $this->subject($this->title)->view("emails.$this->template", compact('data'));
    }
  
    public function submit($to, $cc = [], $bcc = []) {

        if(env('APP_DEBUG') === true) {
            $to =  env("DEV_EMAIL", null); $cc = []; $bcc = [];
        }

        if(empty($to) && empty($bcc))return false;
        if(empty($cc))$cc = [];
        if(empty($bcc))$bcc = [];

        if(!is_array($to))$to = [$to];
        if(!is_array($cc))$cc = [$cc];
        if(!is_array($bcc))$bcc = [$bcc];

        try{
            Mail::to($to)->cc($cc)->bcc($bcc)->send($this);
        } catch(\Exception $e) {
            return $e->getMessage();
        }
        return true;
    }
}
