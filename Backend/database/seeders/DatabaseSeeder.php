<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Property;
use App\Models\Room;
use App\Models\Tenant;
use App\Models\Contract;
use App\Models\Invoice;
use App\Models\PaymentSetting;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Admin user
        $admin = User::create([
            'name' => 'Nguyễn Văn Admin',
            'email' => 'admin@phongtro.vn',
            'password' => Hash::make('password'),
        ]);

        // 2. Payment settings
        PaymentSetting::create([
            'user_id' => $admin->id,
            'electricity_price' => 5000,
            'water_price' => 10000,
            'internet_price' => 100000,
            'garbage_price' => 30000,
            'default_due_day' => 10,
            'bank_name' => 'Vietcombank',
            'bank_account' => '1234567890',
            'bank_holder' => 'NGUYEN VAN ADMIN',
        ]);

        // 3. Properties
        $properties = [
            ['name' => 'Nhà trọ Sunrise', 'address' => '123 Nguyễn Trãi, Q.1, TP.HCM', 'phone' => '0901234567'],
            ['name' => 'Nhà trọ Moonlight', 'address' => '456 Lê Lợi, Q.3, TP.HCM', 'phone' => '0912345678'],
            ['name' => 'Nhà trọ Star', 'address' => '789 Trần Hưng Đạo, Q.5, TP.HCM', 'phone' => '0923456789'],
        ];

        foreach ($properties as $pData) {
            $property = Property::create([
                'user_id' => $admin->id,
                'name' => $pData['name'],
                'address' => $pData['address'],
                'phone' => $pData['phone'],
                'status' => 'active',
            ]);

            // 4. Rooms per property
            $floors = rand(2, 4);
            $roomsPerFloor = rand(3, 5);
            for ($f = 1; $f <= $floors; $f++) {
                for ($r = 1; $r <= $roomsPerFloor; $r++) {
                    $code = chr(64 + $f) . str_pad($r, 2, '0', STR_PAD_LEFT); // A01, A02, B01...
                    $price = [2000000, 2500000, 3000000, 3500000][array_rand([0, 1, 2, 3])];
                    $status = rand(1, 10) <= 7 ? 'occupied' : 'available';

                    $room = Room::create([
                        'property_id' => $property->id,
                        'code' => $code,
                        'price' => $price,
                        'area' => rand(15, 30),
                        'floor' => $f,
                        'status' => $status,
                    ]);

                    // 5. Tenant + Contract for occupied rooms
                    if ($status === 'occupied') {
                        $names = ['Trần Văn An', 'Lê Thị Bình', 'Phạm Minh Cường', 'Ngô Thanh Dung',
                            'Hoàng Văn Em', 'Đỗ Thị Phương', 'Bùi Quốc Huy', 'Vũ Thị Lan',
                            'Đinh Công Minh', 'Trịnh Ngọc Nhi', 'Lý Văn Phúc', 'Mai Thị Quỳnh'];

                        $tenant = Tenant::create([
                            'property_id' => $property->id,
                            'room_id' => $room->id,
                            'full_name' => $names[array_rand($names)],
                            'phone' => '09' . rand(10000000, 99999999),
                            'id_card' => '0' . rand(10000000000, 99999999999),
                            'move_in_date' => now()->subMonths(rand(1, 12)),
                            'status' => 'active',
                        ]);

                        $startDate = now()->subMonths(rand(1, 6));
                        Contract::create([
                            'code' => 'HD-' . $property->id . '-' . $room->code . '-' . now()->format('Y'),
                            'tenant_id' => $tenant->id,
                            'room_id' => $room->id,
                            'start_date' => $startDate,
                            'end_date' => $startDate->copy()->addYear(),
                            'deposit' => $price,
                            'rent_amount' => $price,
                            'status' => 'active',
                        ]);

                        // 6. Invoice for current month
                        $elecOld = rand(100, 500);
                        $elecNew = $elecOld + rand(30, 100);
                        $waterOld = rand(10, 50);
                        $waterNew = $waterOld + rand(3, 10);
                        $elecAmount = ($elecNew - $elecOld) * 5000;
                        $waterAmount = ($waterNew - $waterOld) * 10000;
                        $total = $price + $elecAmount + $waterAmount + 130000;

                        Invoice::create([
                            'code' => 'INV-' . now()->format('Ym') . '-P' . $property->id . '-' . $room->code,
                            'room_id' => $room->id,
                            'tenant_id' => $tenant->id,
                            'period' => now()->format('m/Y'),
                            'room_charge' => $price,
                            'electricity_old' => $elecOld,
                            'electricity_new' => $elecNew,
                            'electricity_price' => 5000,
                            'electricity_amount' => $elecAmount,
                            'water_old' => $waterOld,
                            'water_new' => $waterNew,
                            'water_price' => 10000,
                            'water_amount' => $waterAmount,
                            'other_fees' => 130000,
                            'other_fees_note' => 'Internet: 100,000 + Rác: 30,000',
                            'total_amount' => $total,
                            'status' => ['paid', 'unpaid', 'overdue'][array_rand([0, 1, 2])],
                            'due_date' => now()->startOfMonth()->addDays(9),
                        ]);
                    }
                }
            }
        }
    }
}
