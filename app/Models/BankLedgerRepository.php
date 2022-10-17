<?php

namespace App\Models;

class BankLedgerRepository {
    function getAll() {
        return BankLedger::orderBy('id', 'desc')->get();
    }
    function getById($id) {
        return BankLedger::where('id', $id)->first();
    }
    function getByBank($id){
        return BankLedger::where('bank_id', $id)->orderBy('id', 'desc')->get();
    }
    function getLast($id){
        return BankLedger::where('bank_id', $id)->whereNull('next_id')->orderBy('id', 'desc')->first();
    }
}