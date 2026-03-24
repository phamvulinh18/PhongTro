<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Property;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PropertyController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Property::withCount(['rooms', 'tenants']);

        if ($request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', "%{$request->search}%")
                  ->orWhere('address', 'like', "%{$request->search}%");
            });
        }

        if ($request->status) {
            $query->where('status', $request->status);
        }

        $properties = $query->orderBy('created_at', 'desc')->get();

        return response()->json($properties);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'address' => 'required|string|max:500',
            'phone' => 'nullable|string|max:20',
            'description' => 'nullable|string',
            'status' => 'in:active,inactive,maintenance',
        ]);
        $data['user_id'] = 1; // Demo: hardcoded admin

        $property = Property::create($data);

        return response()->json($property, 201);
    }

    public function show(Property $property): JsonResponse
    {
        $property->loadCount(['rooms', 'tenants']);
        return response()->json($property);
    }

    public function update(Request $request, Property $property): JsonResponse
    {
        $data = $request->validate([
            'name' => 'sometimes|string|max:255',
            'address' => 'sometimes|string|max:500',
            'phone' => 'nullable|string|max:20',
            'description' => 'nullable|string',
            'status' => 'in:active,inactive,maintenance',
        ]);

        $property->update($data);

        return response()->json($property);
    }

    public function destroy(Property $property): JsonResponse
    {
        $property->delete();
        return response()->json(['message' => 'Đã xóa nhà trọ']);
    }
}
