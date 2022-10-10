<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use DB;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        //
        DB::table('users')->insert([
            'name' => 'admin',
            'email' => 'admin@gmail.com',
            'password' => Hash::make('1234'),
            'no_anggota' => 'PKB000',
            'no_ktp' => '0',
            'jabatan_id' => 1,
        ]);

        DB::table('users')->insert([
            'name' => 'founder',
            'email' => 'founder@gmail.com',
            'password' => Hash::make('1234'),
            'no_anggota' => 'PKB090',
            'no_ktp' => '00',
            'jabatan_id' => 3,
        ]);
    }
}
