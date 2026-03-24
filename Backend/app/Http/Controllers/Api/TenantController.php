<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Tenant;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TenantController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Tenant::with(['property', 'room']);

        if ($request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('full_name', 'like', "%{$request->search}%")
                  ->orWhere('phone', 'like', "%{$request->search}%");
            });
        }
        if ($request->property_id) {
            $query->where('property_id', $request->property_id);
        }
        if ($request->status) {
            $query->where('status', $request->status);
        }

        return response()->json($query->orderBy('created_at', 'desc')->get());
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'property_id' => 'nullable|exists:properties,id',
            'room_id' => 'nullable|exists:rooms,id',
            'full_name' => 'required|string|max:255',
            'phone' => 'required|string|max:20',
            'id_card' => 'nullable|string|max:20',
            'email' => 'nullable|email',
            'address' => 'nullable|string',
            'emergency_contact' => 'nullable|string',
            'move_in_date' => 'nullable|date',
            'status' => 'in:active,inactive',
        ]);

        return response()->json(Tenant::create($data), 201);
    }

    public function show(Tenant $tenant): JsonResponse
    {
        $tenant->load(['property', 'room', 'contracts', 'invoices']);
        return response()->json($tenant);
    }

    public function update(Request $request, Tenant $tenant): JsonResponse
    {
        $data = $request->validate([
            'property_id' => 'nullable|exists:properties,id',
            'room_id' => 'nullable|exists:rooms,id',
            'full_name' => 'sometimes|string|max:255',
            'phone' => 'sometimes|string|max:20',
            'id_card' => 'nullable|string|max:20',
            'email' => 'nullable|email',
            'address' => 'nullable|string',
            'emergency_contact' => 'nullable|string',
            'move_in_date' => 'nullable|date',
            'move_out_date' => 'nullable|date',
            'status' => 'in:active,inactive',
        ]);

        $tenant->update($data);
        return response()->json($tenant);
    }

    public function destroy(Tenant $tenant): JsonResponse
    {
        $tenant->delete();
        return response()->json(['message' => 'Đã xóa khách thuê']);
    }
}
