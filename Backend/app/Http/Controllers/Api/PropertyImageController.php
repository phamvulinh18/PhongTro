<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Property;
use App\Models\PropertyImage;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class PropertyImageController extends Controller
{
    /** Upload one or more images for a property */
    public function store(Request $request, Property $property): JsonResponse
    {
        $request->validate([
            'images'   => 'required|array|min:1',
            'images.*' => 'image|mimes:jpg,jpeg,png,webp|max:5120', // 5 MB
        ]);

        $hasMain = $property->images()->where('is_main', true)->exists();
        $order   = $property->images()->count();
        $created = [];

        $baseUrl = $request->getSchemeAndHttpHost(); // e.g. http://127.0.0.1:8000

        foreach ($request->file('images') as $i => $file) {
            $path = $file->store("properties/{$property->id}", 'public');
            $url  = $baseUrl . '/storage/' . $path;

            $isMain = !$hasMain && $i === 0;

            $img = PropertyImage::create([
                'property_id' => $property->id,
                'path'        => $path,
                'url'         => $url,
                'is_main'     => $isMain,
                'order'       => $order + $i,
            ]);

            if ($isMain) $hasMain = true;
            $created[] = $img;
        }

        return response()->json($created, 201);
    }

    /** Set an image as the main image */
    public function setMain(Property $property, PropertyImage $image): JsonResponse
    {
        // Remove current main
        $property->images()->update(['is_main' => false]);
        // Set new main
        $image->update(['is_main' => true]);

        return response()->json(['message' => 'Đã đặt ảnh chính', 'image' => $image]);
    }

    /** Delete an image */
    public function destroy(Property $property, PropertyImage $image): JsonResponse
    {
        Storage::disk('public')->delete($image->path);
        $image->delete();

        // If deleted image was main, promote first remaining
        if ($image->is_main) {
            $property->images()->oldest('order')->first()?->update(['is_main' => true]);
        }

        return response()->json(['message' => 'Đã xóa ảnh']);
    }

    /** Reorder images */
    public function reorder(Request $request, Property $property): JsonResponse
    {
        $request->validate(['order' => 'required|array', 'order.*' => 'integer']);
        foreach ($request->order as $i => $id) {
            PropertyImage::where('id', $id)->where('property_id', $property->id)->update(['order' => $i]);
        }
        return response()->json(['message' => 'Đã cập nhật thứ tự ảnh']);
    }
}
