<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Room;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class RoomController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Room::with(['property', 'tenant']);

        if ($request->search) {
            $query->where('code', 'like', "%{$request->search}%");
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
            'property_id' => 'required|exists:properties,id',
            'code' => 'required|string|max:50',
            'price' => 'required|numeric|min:0',
            'area' => 'nullable|numeric',
            'floor' => 'nullable|integer',
            'description' => 'nullable|string',
            'status' => 'in:available,occupied,maintenance',
        ]);

        return response()->json(Room::create($data), 201);
    }

    public function show(Room $room): JsonResponse
    {
        $room->load(['property', 'tenant', 'contracts', 'invoices']);
        return response()->json($room);
    }

    public function update(Request $request, Room $room): JsonResponse
    {
        $data = $request->validate([
            'property_id' => 'sometimes|exists:properties,id',
            'code' => 'sometimes|string|max:50',
            'price' => 'sometimes|numeric|min:0',
            'area' => 'nullable|numeric',
            'floor' => 'nullable|integer',
            'description' => 'nullable|string',
            'status' => 'in:available,occupied,maintenance',
        ]);

        $room->update($data);
        return response()->json($room);
    }

    public function destroy(Room $room): JsonResponse
    {
        $room->delete();
        return response()->json(['message' => 'Đã xóa phòng']);
    }
}
