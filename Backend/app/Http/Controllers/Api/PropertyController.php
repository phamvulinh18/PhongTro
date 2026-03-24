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
        $query = Property::with(['images' => fn($q) => $q->orderBy('order')])->withCount([
            'rooms',
            'rooms as available_rooms_count' => fn($q) => $q->where('status', 'available'),
            'rooms as occupied_rooms_count'  => fn($q) => $q->where('status', 'occupied'),
        ]);

        if ($request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', "%{$request->search}%")
                  ->orWhere('address', 'like', "%{$request->search}%");
            });
        }

        if ($request->status) {
            $query->where('status', $request->status);
        }

        $properties = $query->orderBy('created_at', 'desc')->get()
            ->map(fn($p) => array_merge($p->toArray(), [
                'rooms_count'           => $p->rooms_count,
                'available_rooms_count' => $p->available_rooms_count,
                'occupied_rooms_count'  => $p->occupied_rooms_count,
                'occupancy_rate'        => $p->rooms_count > 0
                    ? round(($p->occupied_rooms_count / $p->rooms_count) * 100) : 0,
            ]));

        return response()->json($properties);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name'        => 'required|string|max:255',
            'address'     => 'required|string|max:500',
            'phone'       => 'nullable|string|max:20',
            'description' => 'nullable|string',
            'status'      => 'in:active,inactive,maintenance',
        ]);
        $data['user_id'] = 1;

        $property = Property::create($data);
        return response()->json($property, 201);
    }

    public function show(Property $property): JsonResponse
    {
        $property->load([
            'rooms'  => fn($q) => $q->with('tenant')->orderBy('code'),
            'images' => fn($q) => $q->orderBy('order'),
        ]);
        $property->loadCount([
            'rooms',
            'rooms as available_rooms_count' => fn($q) => $q->where('status', 'available'),
            'rooms as occupied_rooms_count'  => fn($q) => $q->where('status', 'occupied'),
        ]);

        return response()->json(array_merge($property->toArray(), [
            'occupancy_rate' => $property->rooms_count > 0
                ? round(($property->occupied_rooms_count / $property->rooms_count) * 100) : 0,
        ]));
    }

    public function update(Request $request, Property $property): JsonResponse
    {
        $data = $request->validate([
            'name'        => 'sometimes|string|max:255',
            'address'     => 'sometimes|string|max:500',
            'phone'       => 'nullable|string|max:20',
            'description' => 'nullable|string',
            'status'      => 'in:active,inactive,maintenance',
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
