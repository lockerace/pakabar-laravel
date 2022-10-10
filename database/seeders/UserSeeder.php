<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use DB;
use App\Models\User;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $now = new \DateTime();
        $data = [
            [
                'id' => 1,
                'name' => 'admin',
                'email' => 'admin@gmail.com',
                'password' => Hash::make('1234'),
                'no_anggota' => 'PKB000',
                'no_ktp' => '0',
                'jabatan_id' => 1,
                'created_at' => $now, 'updated_at' => $now
            ],
            [
                'id' => 2,
                'name' => 'founder',
                'email' => 'founder@gmail.com',
                'password' => Hash::make('1234'),
                'no_anggota' => 'PKB090',
                'no_ktp' => '00',
                'jabatan_id' => 3,
                'created_at' => $now, 'updated_at' => $now
            ],
        ];

        foreach ($data as $row) {
            User::firstOrCreate(['id' => $row['id']], $row);
        }
    }
}
