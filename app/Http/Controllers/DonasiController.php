<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Str;
use App\Models\Donasi;
use Midtrans\Snap;
use Midtrans\Config;
use Midtrans\Notification;

class DonasiController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email',
            'nominal' => 'required|numeric|min:1000',
            'message' => 'nullable|string',
            'anonymous' => 'boolean'
        ]);

        $name = $request->name;
        if ($request->anonymous) {
            $name = substr($name, 0, 1) . '***' . substr($name, -1);
        }

       $orderId = 'DON-' . (string) Str::uuid();

        $donasi = Donasi::create([
            'name' => $name,
            'email' => $request->email,
            'nominal' => $request->nominal,
            'message' => $request->message,
            'status' => 'pending',
            'order_id' => $orderId,
            'payment_method' => 'default'
        ]);

        Config::$serverKey = config('midtrans.server_key');
        Config::$isProduction = config('midtrans.is_production');
        Config::$isSanitized = true;
        Config::$is3ds = true;

        $params = [
            'transaction_details' => [
                'order_id' => $orderId,
                'gross_amount' => $request->nominal
            ],
            'customer_details' => [
                'first_name' => $request->name,
                'email' => $request->email
            ],
            'item_details' => [[
                'id' => 'DON-' . $donasi->id,
                'price' => $request->nominal,
                'quantity' => 1,
                'name' => 'Donasi'
            ]]
        ];

        $snapToken = Snap::getSnapToken($params);

        return response()->json(['snap_token' => $snapToken, 'order_id' => $orderId ]);
    }

    public function callback(Request $request)
    {
        
        // Config::$serverKey = config('midtrans.server_key');
        // Config::$isProduction = config('midtrans.is_production');
        // Config::$isSanitized = true;
        // Config::$is3ds = true;

        // $notification = new Notification();

        // $orderId = $notification->order_id;
        // $transactionStatus = $notification->transaction_status;
        // $paymentType = $notification->payment_type;
        // $fraudStatus = $notification->fraud_status ?? null;
        // $transactionId = $notification->transaction_id;

        // $donasi = Donasi::where('order_id', $orderId)->first();
        // if (!$donasi) {
        //     return response()->json(['message' => 'Donasi not found'], 404);
        // }

        // // Update status
        // if ($transactionStatus == 'settlement') {
        //     $donasi->status = 'paid';
        // } elseif ($transactionStatus == 'pending') {
        //     $donasi->status = 'pending';
        // } elseif (in_array($transactionStatus, ['expire', 'cancel', 'deny'])) {
        //     $donasi->status = 'failed';
        // }

        // // Simpan transaction_id dan payment_type
        // $donasi->transaction_id = $transactionId;
        // $donasi->payment_method = $paymentType;

        // $donasi->save();

        // return response()->json(['message' => 'Callback processed']);
    }

    public function checkStatus(Request $request)
{
    $request->validate([
        'order_id' => 'required|string'
    ]);

    \Midtrans\Config::$serverKey = config('midtrans.server_key');
    \Midtrans\Config::$isProduction = config('midtrans.is_production');
    \Midtrans\Config::$isSanitized = true;
    \Midtrans\Config::$is3ds = true;

    try {
        $status = \Midtrans\Transaction::status($request->order_id);
        

        $donasi = Donasi::where('order_id', $request->order_id)->first();
        if (!$donasi) {
            return response()->json(['message' => 'Donasi tidak ditemukan'], 404);
        }

      $donasi->status = match ($status->transaction_status) {
    'settlement', 'capture' => 'paid',  // tambahkan 'capture' sebagai paid
    'pending' => 'pending',
    'expire', 'cancel', 'deny' => 'failed',
    default => $donasi->status
};


        $donasi->payment_method = $status->payment_type ?? $donasi->payment_method;
        $donasi->transaction_id = $status->transaction_id ?? $donasi->transaction_id;
        $donasi->save();

        return response()->json([
            'status' => $donasi->status,
            'payment_method' => $donasi->payment_method,
            'transaction_id' => $donasi->transaction_id
        ])
       

        ;
    } catch (\Exception $e) {
        return response()->json(['error' => $e->getMessage()], 500);
    }
}
}
