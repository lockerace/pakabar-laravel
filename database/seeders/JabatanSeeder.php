<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use DB;
use App\Models\Jabatan;

class JabatanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $data = [
            [ 'id' => 1, 'name' => 'Admin',],
            [ 'id' => 2, 'name' => 'Member',],
            [ 'id' => 3, 'name' => 'Founder',],
        ];

        foreach ($data as $row) {
            Jabatan::firstOrCreate(['id' => $row['id']], $row);
        }
    }
}
