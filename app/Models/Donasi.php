<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Donasi extends Model
{
    protected $fillable = [
        'order_id', 'name', 'email', 'nominal', 'message', 'status','payment_method'
    ];
}
