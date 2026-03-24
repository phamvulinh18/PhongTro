<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Property;
use App\Models\Room;
use App\Models\Tenant;
use App\Models\Contract;
use App\Models\Invoice;
use Illuminate\Http\JsonResponse;

class DashboardController extends Controller
{
    public function index(): JsonResponse
    {
        $totalProperties = Property::count();
        $totalRooms = Room::count();
        $availableRooms = Room::where('status', 'available')->count();
        $occupiedRooms = Room::where('status', 'occupied')->count();
        $totalTenants = Tenant::where('status', 'active')->count();
        $unpaidInvoices = Invoice::whereIn('status', ['unpaid', 'overdue'])->count();

        $totalRevenue = Invoice::where('status', 'paid')->sum('total_amount');
        $monthlyRevenue = Invoice::where('status', 'paid')
            ->whereMonth('paid_date', now()->month)
            ->whereYear('paid_date', now()->year)
            ->sum('total_amount');

        $occupancyRate = $totalRooms > 0
            ? round(($occupiedRooms / $totalRooms) * 100, 1)
            : 0;

        // Room status chart
        $roomStatusChart = [
            ['name' => 'Đang thuê', 'value' => $occupiedRooms, 'color' => '#3b82f6'],
            ['name' => 'Trống', 'value' => $availableRooms, 'color' => '#22c55e'],
            ['name' => 'Bảo trì', 'value' => Room::where('status', 'maintenance')->count(), 'color' => '#f59e0b'],
        ];

        // Recent unpaid invoices
        $recentUnpaid = Invoice::with(['room.property', 'tenant'])
            ->whereIn('status', ['unpaid', 'overdue'])
            ->orderBy('due_date')
            ->limit(5)
            ->get()
            ->map(fn($inv) => [
                'id' => $inv->id,
                'code' => $inv->code,
                'room' => $inv->room->code ?? '',
                'property' => $inv->room->property->name ?? '',
                'tenant' => $inv->tenant->full_name ?? '',
                'total' => $inv->total_amount,
                'due_date' => $inv->due_date->format('d/m/Y'),
                'status' => $inv->status,
            ]);

        // Expiring contracts (within 30 days)
        $expiringContracts = Contract::with(['room.property', 'tenant'])
            ->where('status', 'active')
            ->where('end_date', '<=', now()->addDays(30))
            ->orderBy('end_date')
            ->limit(5)
            ->get()
            ->map(fn($c) => [
                'id' => $c->id,
                'code' => $c->code,
                'room' => $c->room->code ?? '',
                'property' => $c->room->property->name ?? '',
                'tenant' => $c->tenant->full_name ?? '',
                'end_date' => $c->end_date->format('d/m/Y'),
            ]);

        return response()->json([
            'stats' => [
                'totalProperties' => $totalProperties,
                'totalRooms' => $totalRooms,
                'availableRooms' => $availableRooms,
                'occupiedRooms' => $occupiedRooms,
                'totalTenants' => $totalTenants,
                'unpaidInvoices' => $unpaidInvoices,
                'totalRevenue' => $totalRevenue,
                'monthlyRevenue' => $monthlyRevenue,
                'occupancyRate' => $occupancyRate,
            ],
            'roomStatusChart' => $roomStatusChart,
            'recentUnpaid' => $recentUnpaid,
            'expiringContracts' => $expiringContracts,
        ]);
    }
}
