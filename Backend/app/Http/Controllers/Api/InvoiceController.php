<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Invoice;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class InvoiceController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Invoice::with(['room.property', 'tenant']);

        if ($request->search) {
            $query->where('code', 'like', "%{$request->search}%");
        }
        if ($request->status) {
            $query->where('status', $request->status);
        }
        if ($request->room_id) {
            $query->where('room_id', $request->room_id);
        }

        return response()->json($query->orderBy('created_at', 'desc')->get());
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'code' => 'required|string|unique:invoices,code',
            'room_id' => 'required|exists:rooms,id',
            'tenant_id' => 'required|exists:tenants,id',
            'period' => 'required|string',
            'room_charge' => 'required|numeric|min:0',
            'electricity_old' => 'required|integer',
            'electricity_new' => 'required|integer',
            'electricity_price' => 'required|numeric',
            'water_old' => 'required|integer',
            'water_new' => 'required|integer',
            'water_price' => 'required|numeric',
            'other_fees' => 'nullable|numeric',
            'other_fees_note' => 'nullable|string',
            'due_date' => 'required|date',
            'note' => 'nullable|string',
        ]);

        // Auto-calculate
        $data['electricity_amount'] = ($data['electricity_new'] - $data['electricity_old']) * $data['electricity_price'];
        $data['water_amount'] = ($data['water_new'] - $data['water_old']) * $data['water_price'];
        $data['total_amount'] = $data['room_charge'] + $data['electricity_amount'] + $data['water_amount'] + ($data['other_fees'] ?? 0);

        return response()->json(Invoice::create($data), 201);
    }

    public function show(Invoice $invoice): JsonResponse
    {
        $invoice->load(['room.property', 'tenant']);
        return response()->json($invoice);
    }

    public function update(Request $request, Invoice $invoice): JsonResponse
    {
        $data = $request->validate([
            'status' => 'sometimes|in:paid,unpaid,overdue,partial',
            'paid_date' => 'nullable|date',
            'paid_amount' => 'nullable|numeric|min:0',
            'note' => 'nullable|string',
        ]);

        $invoice->update($data);
        return response()->json($invoice);
    }

    public function destroy(Invoice $invoice): JsonResponse
    {
        $invoice->delete();
        return response()->json(['message' => 'Đã xóa hóa đơn']);
    }
}
