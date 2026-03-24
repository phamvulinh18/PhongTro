<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Contract;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ContractController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Contract::with(['tenant', 'room.property']);

        if ($request->search) {
            $query->where('code', 'like', "%{$request->search}%");
        }
        if ($request->status) {
            $query->where('status', $request->status);
        }

        return response()->json($query->orderBy('created_at', 'desc')->get());
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'code' => 'required|string|unique:contracts,code',
            'tenant_id' => 'required|exists:tenants,id',
            'room_id' => 'required|exists:rooms,id',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
            'deposit' => 'required|numeric|min:0',
            'rent_amount' => 'required|numeric|min:0',
            'terms' => 'nullable|string',
            'status' => 'in:active,expired,terminated,pending',
        ]);

        return response()->json(Contract::create($data), 201);
    }

    public function show(Contract $contract): JsonResponse
    {
        $contract->load(['tenant', 'room.property']);
        return response()->json($contract);
    }

    public function update(Request $request, Contract $contract): JsonResponse
    {
        $data = $request->validate([
            'tenant_id' => 'sometimes|exists:tenants,id',
            'room_id' => 'sometimes|exists:rooms,id',
            'start_date' => 'sometimes|date',
            'end_date' => 'sometimes|date',
            'deposit' => 'sometimes|numeric|min:0',
            'rent_amount' => 'sometimes|numeric|min:0',
            'terms' => 'nullable|string',
            'status' => 'in:active,expired,terminated,pending',
        ]);

        $contract->update($data);
        return response()->json($contract);
    }

    public function destroy(Contract $contract): JsonResponse
    {
        $contract->delete();
        return response()->json(['message' => 'Đã xóa hợp đồng']);
    }
}
