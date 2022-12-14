<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\BankRepository;
use App\Models\Bank;
use App\Models\BankLedgerRepository;
use App\Models\BankLedger;

class FinanceController extends Controller
{
    function __construct(BankRepository $bankRepository, BankLedgerRepository $bankLedgerRepository) {
        $this->bank = $bankRepository;
        $this->bankLedger = $bankLedgerRepository;
    }

    function getBank(Request $request) {
        $data = [
            'bank' => $this->bank->getAll(),
            'active_bank' => $this->bank->getActive(),
        ];

        if($request->wantsJson()) {
            return response()->json($data);
        }
        return view('admin.finance', $data);
    }

    function getBankLedger(Request $request) {
        $myOption = $request->id;
        $bank_ledger = [];
        if(!empty($myOption)){
            $bank_ledger = $this->bankLedger->getByBank($myOption);
        }
        $data = [
            'bank_ledger' => $bank_ledger,
        ];
        
        if($request->wantsJson()) {
            return response()->json($data);
        }
    }

    function editBank(Request $request) {
        $bank = $this->bank->getById($request->id);
        
        if(empty($bank)){
            $request->validate([
                'no_rekening' => 'unique:bank'
            ],
            [
                'no_rekening.unique' => 'Nomor Rekening tidak tersedia'
            ]);

            $bank = new Bank;
            $bank->no_rekening = $request->no_rekening;
            $bank->nama_bank = $request->nama_bank;
            $bank->status = "aktif";
            $bank->name = $request->name;
            $bank->saldo = $request->saldo;
            $bank->save();
        } else {
            $bank->status = $request->status;
            $bank->save();
        }

        if($request->wantsJson()) {
            return response()->json(NULL);
        }

        return response()->redirectTo(route('admin-finance'));
    }

    function editBankLedger(Request $request) {
        $request->validate([
            'bank_id' => 'required',
        ],
        [
            'bank_id.required' => 'ID Bank belum terisi'
        ]);
        $previous = $this->bankLedger->getLast($request->bank_id);
        $bankLedger = new BankLedger;
        $bankLedger->bank_id = $request->bank_id;
        $bankLedger->note = $request->note;
        $bankLedger->isIn = $request->isIn;
        $bankLedger->amount = $request->amount;
        $bankLedger->author = $request->user()->id;
        $bank = $this->bank->getById($request->bank_id);
        if(!empty($previous)){
            if($request->isIn == 1)
                $bankLedger->balance = $previous->balance + $request->amount;
            else
                $bankLedger->balance = $previous->balance - $request->amount;
        } else{
            if($request->isIn == 1)
            $bankLedger->balance = $bank->saldo + $request->amount;
        else
            $bankLedger->balance = $bank->saldo - $request->amount;
        }
        $bankLedger->save();


        if(!empty($bank)){
            $bank->saldo = $bankLedger->balance;
            $bank->save();
        }
        if(!empty($previous)){
            $previous->next_id = $bankLedger->id;
            $previous->save();
        }
    
    if($request->isIn == 2){
        $request->validate([
            'bank_id' => 'required',
            'receiver_bank_id' => 'required',
        ],
        [
            'bank_id.required' => 'ID Bank belum terisi',
            'receiver_bank_id.required' => 'ID Bank Tujuan belum terisi'
        ]);
        $previous = $this->bankLedger->getLast($request->receiver_bank_id);
        $bankLedger = new BankLedger;
        $bankLedger->bank_id = $request->receiver_bank_id;
        $bankLedger->note = $request->note;
        $bankLedger->isIn = 1;
        $bankLedger->amount = $request->amount;
        $bankLedger->author = $request->user()->id;
        $bank = $this->bank->getById($request->receiver_bank_id);
        if(!empty($previous)){
            $bankLedger->balance = $previous->balance + $request->amount;
        } else{
            $bankLedger->balance = $bank->saldo + $request->amount;
        }
        $bankLedger->save();


        if(!empty($bank)){
            $bank->saldo = $bankLedger->balance;
            $bank->save();
        }
        if(!empty($previous)){
            $previous->next_id = $bankLedger->id;
            $previous->save();
        }
    }

    if($request->wantsJson()) {
        return response()->json(NULL);
    }
        
    return redirect()->route('admin-finance', ['myOption'=>$request->bank_id]);
    }

}
