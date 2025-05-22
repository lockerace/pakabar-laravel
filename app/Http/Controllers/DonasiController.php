<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
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
            'anonymous' => 'boolean',
            'payment_method' => 'required|string|max:50'
        ]);

        // Masked name if anonymous
        $name = $request->name;
        if ($request->anonymous) {
            $name = substr($name, 0, 1) . '***' . substr($name, -1);
        }

        $orderId = 'DON-' . time();

        // Simpan ke database (status pending)
        $donasi = Donasi::create([
            'name' => $name,
            'email' => $request->email,
            'nominal' => $request->nominal,
            'message' => $request->message,
            'status' => 'pending',
            'order_id' => $orderId,
            'payment_method' => $request->payment_method
        ]);

        // Midtrans configuration
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
                'name' => 'Donasi via ' . $request->payment_method
            ]]
        ];

        $snapToken = Snap::getSnapToken($params);

        return response()->json(['snap_token' => $snapToken]);
    }

    public function callback(Request $request)
    {
        Config::$serverKey = config('midtrans.server_key');
        Config::$isProduction = config('midtrans.is_production');
        Config::$isSanitized = true;
        Config::$is3ds = true;

        $notification = new Notification();

        $orderId = $notification->order_id;
        $transactionStatus = $notification->transaction_status;
        $paymentType = $notification->payment_type;
        $fraudStatus = $notification->fraud_status ?? null;

        $donasi = Donasi::where('order_id', $orderId)->first();
        if (!$donasi) {
            return response()->json(['message' => 'Donasi not found'], 404);
        }

        // Update status berdasarkan status dari Midtrans
        if ($transactionStatus == 'settlement') {
            $donasi->status = 'paid';
        } elseif ($transactionStatus == 'pending') {
            $donasi->status = 'pending';
        } elseif (in_array($transactionStatus, ['expire', 'cancel', 'deny'])) {
            $donasi->status = 'failed';
        }

        $donasi->transaction_id = $notification->transaction_id;
        
        $donasi->save();

        return response()->json(['message' => 'Callback processed']);
    }
}
