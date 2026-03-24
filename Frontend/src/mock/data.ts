import type { Property, Room, Tenant, Contract, Invoice, DashboardStats, MonthlyRevenue, RoomStatusChart, ChatMessage, Notification } from '@/types'

// ===================== PROPERTIES =====================
export const mockProperties: Property[] = [
  { id: '1', name: 'Nhà trọ Sunrise', address: '123 Nguyễn Văn Cừ, Q.5, TP.HCM', totalRooms: 20, availableRooms: 3, occupancyRate: 85, status: 'active', createdAt: '2024-01-15', phone: '0901234567', description: 'Nhà trọ cao cấp' },
  { id: '2', name: 'Nhà trọ Moonlight', address: '456 Lê Hồng Phong, Q.10, TP.HCM', totalRooms: 15, availableRooms: 5, occupancyRate: 67, status: 'active', createdAt: '2024-03-20', phone: '0907654321' },
  { id: '3', name: 'Nhà trọ Star', address: '789 Trần Hưng Đạo, Q.1, TP.HCM', totalRooms: 10, availableRooms: 1, occupancyRate: 90, status: 'active', createdAt: '2024-06-10' },
  { id: '4', name: 'Nhà trọ Garden', address: '321 Võ Văn Tần, Q.3, TP.HCM', totalRooms: 8, availableRooms: 0, occupancyRate: 100, status: 'active', createdAt: '2023-11-01' },
  { id: '5', name: 'Nhà trọ Lotus', address: '654 Cách Mạng Tháng 8, Tân Bình', totalRooms: 12, availableRooms: 4, occupancyRate: 67, status: 'maintenance', createdAt: '2024-02-28' },
]

// ===================== ROOMS =====================
export const mockRooms: Room[] = [
  { id: '1', code: 'A101', propertyId: '1', propertyName: 'Nhà trọ Sunrise', price: 3000000, status: 'occupied', currentTenant: 'Nguyễn Văn A', debt: 0, area: 25, floor: 1 },
  { id: '2', code: 'A102', propertyId: '1', propertyName: 'Nhà trọ Sunrise', price: 3500000, status: 'available', debt: 0, area: 30, floor: 1 },
  { id: '3', code: 'A201', propertyId: '1', propertyName: 'Nhà trọ Sunrise', price: 2800000, status: 'occupied', currentTenant: 'Trần Thị B', debt: 500000, area: 22, floor: 2 },
  { id: '4', code: 'A202', propertyId: '1', propertyName: 'Nhà trọ Sunrise', price: 4000000, status: 'maintenance', debt: 0, area: 35, floor: 2 },
  { id: '5', code: 'B101', propertyId: '2', propertyName: 'Nhà trọ Moonlight', price: 2500000, status: 'occupied', currentTenant: 'Lê Văn C', debt: 200000, area: 20, floor: 1 },
  { id: '6', code: 'B102', propertyId: '2', propertyName: 'Nhà trọ Moonlight', price: 2500000, status: 'available', debt: 0, area: 20, floor: 1 },
  { id: '7', code: 'B201', propertyId: '2', propertyName: 'Nhà trọ Moonlight', price: 3000000, status: 'occupied', currentTenant: 'Phạm Thị D', debt: 0, area: 25, floor: 2 },
  { id: '8', code: 'C101', propertyId: '3', propertyName: 'Nhà trọ Star', price: 5000000, status: 'occupied', currentTenant: 'Hoàng Văn E', debt: 1000000, area: 40, floor: 1 },
  { id: '9', code: 'C102', propertyId: '3', propertyName: 'Nhà trọ Star', price: 4500000, status: 'available', debt: 0, area: 35, floor: 1 },
  { id: '10', code: 'D101', propertyId: '4', propertyName: 'Nhà trọ Garden', price: 2000000, status: 'occupied', currentTenant: 'Vũ Thị F', debt: 0, area: 18, floor: 1 },
]

// ===================== TENANTS =====================
export const mockTenants: Tenant[] = [
  { id: '1', fullName: 'Nguyễn Văn A', phone: '0901111111', idCard: '079201001234', roomId: '1', roomCode: 'A101', propertyId: '1', propertyName: 'Nhà trọ Sunrise', moveInDate: '2024-06-01', debt: 0, status: 'active', email: 'nguyenvana@gmail.com' },
  { id: '2', fullName: 'Trần Thị B', phone: '0902222222', idCard: '079201005678', roomId: '3', roomCode: 'A201', propertyId: '1', propertyName: 'Nhà trọ Sunrise', moveInDate: '2024-07-15', debt: 500000, status: 'active' },
  { id: '3', fullName: 'Lê Văn C', phone: '0903333333', idCard: '079201009012', roomId: '5', roomCode: 'B101', propertyId: '2', propertyName: 'Nhà trọ Moonlight', moveInDate: '2024-08-01', debt: 200000, status: 'active' },
  { id: '4', fullName: 'Phạm Thị D', phone: '0904444444', idCard: '079201003456', roomId: '7', roomCode: 'B201', propertyId: '2', propertyName: 'Nhà trọ Moonlight', moveInDate: '2024-05-20', debt: 0, status: 'active' },
  { id: '5', fullName: 'Hoàng Văn E', phone: '0905555555', idCard: '079201007890', roomId: '8', roomCode: 'C101', propertyId: '3', propertyName: 'Nhà trọ Star', moveInDate: '2024-03-10', debt: 1000000, status: 'active' },
  { id: '6', fullName: 'Vũ Thị F', phone: '0906666666', idCard: '079201002345', roomId: '10', roomCode: 'D101', propertyId: '4', propertyName: 'Nhà trọ Garden', moveInDate: '2024-09-01', debt: 0, status: 'active' },
  { id: '7', fullName: 'Đặng Văn G', phone: '0907777777', idCard: '079201006789', moveInDate: '2024-01-15', debt: 0, status: 'inactive' },
]

// ===================== CONTRACTS =====================
export const mockContracts: Contract[] = [
  { id: '1', code: 'HD-001', tenantId: '1', tenantName: 'Nguyễn Văn A', roomId: '1', roomCode: 'A101', propertyName: 'Nhà trọ Sunrise', startDate: '2024-06-01', endDate: '2025-06-01', deposit: 3000000, rentAmount: 3000000, status: 'active' },
  { id: '2', code: 'HD-002', tenantId: '2', tenantName: 'Trần Thị B', roomId: '3', roomCode: 'A201', propertyName: 'Nhà trọ Sunrise', startDate: '2024-07-15', endDate: '2025-01-15', deposit: 2800000, rentAmount: 2800000, status: 'active' },
  { id: '3', code: 'HD-003', tenantId: '3', tenantName: 'Lê Văn C', roomId: '5', roomCode: 'B101', propertyName: 'Nhà trọ Moonlight', startDate: '2024-08-01', endDate: '2025-02-01', deposit: 2500000, rentAmount: 2500000, status: 'active' },
  { id: '4', code: 'HD-004', tenantId: '4', tenantName: 'Phạm Thị D', roomId: '7', roomCode: 'B201', propertyName: 'Nhà trọ Moonlight', startDate: '2024-05-20', endDate: '2025-05-20', deposit: 3000000, rentAmount: 3000000, status: 'active' },
  { id: '5', code: 'HD-005', tenantId: '5', tenantName: 'Hoàng Văn E', roomId: '8', roomCode: 'C101', propertyName: 'Nhà trọ Star', startDate: '2024-03-10', endDate: '2025-03-31', deposit: 5000000, rentAmount: 5000000, status: 'active' },
  { id: '6', code: 'HD-006', tenantId: '6', tenantName: 'Vũ Thị F', roomId: '10', roomCode: 'D101', propertyName: 'Nhà trọ Garden', startDate: '2024-09-01', endDate: '2025-09-01', deposit: 2000000, rentAmount: 2000000, status: 'active' },
  { id: '7', code: 'HD-007', tenantId: '7', tenantName: 'Đặng Văn G', roomId: '2', roomCode: 'A102', propertyName: 'Nhà trọ Sunrise', startDate: '2023-06-01', endDate: '2024-06-01', deposit: 3500000, rentAmount: 3500000, status: 'expired' },
]

// ===================== INVOICES =====================
export const mockInvoices: Invoice[] = [
  { id: '1', code: 'INV-2025-001', roomId: '1', roomCode: 'A101', tenantId: '1', tenantName: 'Nguyễn Văn A', propertyName: 'Nhà trọ Sunrise', period: '03/2025', roomCharge: 3000000, electricity: 350000, water: 100000, otherFees: 50000, totalAmount: 3500000, status: 'paid', dueDate: '2025-03-10', paidDate: '2025-03-08', electricityUsage: { old: 1200, new: 1270, unitPrice: 5000 }, waterUsage: { old: 50, new: 60, unitPrice: 10000 } },
  { id: '2', code: 'INV-2025-002', roomId: '3', roomCode: 'A201', tenantId: '2', tenantName: 'Trần Thị B', propertyName: 'Nhà trọ Sunrise', period: '03/2025', roomCharge: 2800000, electricity: 280000, water: 80000, otherFees: 50000, totalAmount: 3210000, status: 'unpaid', dueDate: '2025-03-10', electricityUsage: { old: 800, new: 856, unitPrice: 5000 }, waterUsage: { old: 30, new: 38, unitPrice: 10000 } },
  { id: '3', code: 'INV-2025-003', roomId: '5', roomCode: 'B101', tenantId: '3', tenantName: 'Lê Văn C', propertyName: 'Nhà trọ Moonlight', period: '03/2025', roomCharge: 2500000, electricity: 200000, water: 60000, otherFees: 30000, totalAmount: 2790000, status: 'overdue', dueDate: '2025-03-05', electricityUsage: { old: 500, new: 540, unitPrice: 5000 }, waterUsage: { old: 20, new: 26, unitPrice: 10000 } },
  { id: '4', code: 'INV-2025-004', roomId: '7', roomCode: 'B201', tenantId: '4', tenantName: 'Phạm Thị D', propertyName: 'Nhà trọ Moonlight', period: '03/2025', roomCharge: 3000000, electricity: 300000, water: 90000, otherFees: 50000, totalAmount: 3440000, status: 'paid', dueDate: '2025-03-10', paidDate: '2025-03-09', electricityUsage: { old: 600, new: 660, unitPrice: 5000 }, waterUsage: { old: 25, new: 34, unitPrice: 10000 } },
  { id: '5', code: 'INV-2025-005', roomId: '8', roomCode: 'C101', tenantId: '5', tenantName: 'Hoàng Văn E', propertyName: 'Nhà trọ Star', period: '03/2025', roomCharge: 5000000, electricity: 500000, water: 150000, otherFees: 100000, totalAmount: 5750000, status: 'unpaid', dueDate: '2025-03-15', electricityUsage: { old: 1000, new: 1100, unitPrice: 5000 }, waterUsage: { old: 40, new: 55, unitPrice: 10000 } },
  { id: '6', code: 'INV-2025-006', roomId: '10', roomCode: 'D101', tenantId: '6', tenantName: 'Vũ Thị F', propertyName: 'Nhà trọ Garden', period: '03/2025', roomCharge: 2000000, electricity: 150000, water: 50000, otherFees: 30000, totalAmount: 2230000, status: 'partial', dueDate: '2025-03-10', electricityUsage: { old: 300, new: 330, unitPrice: 5000 }, waterUsage: { old: 15, new: 20, unitPrice: 10000 } },
]

// ===================== DASHBOARD STATS =====================
export const mockDashboardStats: DashboardStats = {
  totalProperties: 5,
  totalRooms: 65,
  availableRooms: 13,
  activeTenants: 52,
  unpaidInvoices: 8,
  monthlyRevenue: 156000000,
}

export const mockMonthlyRevenue: MonthlyRevenue[] = [
  { month: 'T1', revenue: 120000000, expenses: 25000000 },
  { month: 'T2', revenue: 135000000, expenses: 28000000 },
  { month: 'T3', revenue: 128000000, expenses: 22000000 },
  { month: 'T4', revenue: 142000000, expenses: 30000000 },
  { month: 'T5', revenue: 138000000, expenses: 26000000 },
  { month: 'T6', revenue: 150000000, expenses: 32000000 },
  { month: 'T7', revenue: 145000000, expenses: 27000000 },
  { month: 'T8', revenue: 155000000, expenses: 29000000 },
  { month: 'T9', revenue: 148000000, expenses: 24000000 },
  { month: 'T10', revenue: 160000000, expenses: 31000000 },
  { month: 'T11', revenue: 152000000, expenses: 28000000 },
  { month: 'T12', revenue: 156000000, expenses: 33000000 },
]

export const mockRoomStatusChart: RoomStatusChart[] = [
  { name: 'Đang thuê', value: 52, color: '#3b82f6' },
  { name: 'Trống', value: 13, color: '#22c55e' },
]

// ===================== CHAT MESSAGES =====================
export const mockChatMessages: ChatMessage[] = [
  { id: '1', role: 'assistant', content: 'Xin chào! Tôi là trợ lý AI của hệ thống quản lý phòng trọ. Tôi có thể giúp bạn thêm phòng, kiểm tra tình trạng phòng, xem doanh thu, và nhiều thao tác khác. Hãy hỏi tôi bất cứ điều gì!', timestamp: '2025-03-23T10:00:00' },
  { id: '2', role: 'user', content: 'Cho tôi biết phòng nào đang trống?', timestamp: '2025-03-23T10:01:00' },
  { id: '3', role: 'assistant', content: 'Hiện tại có **13 phòng trống** trên tổng số 65 phòng:\n\n• **Nhà trọ Sunrise**: A102 (3.5tr), A202 (đang bảo trì)\n• **Nhà trọ Moonlight**: B102 (2.5tr) + 4 phòng khác\n• **Nhà trọ Star**: C102 (4.5tr)\n• **Nhà trọ Lotus**: 4 phòng (đang bảo trì)\n\nBạn muốn xem chi tiết phòng nào?', timestamp: '2025-03-23T10:01:30' },
]

// ===================== NOTIFICATIONS =====================
export const mockNotifications: Notification[] = [
  { id: '1', title: 'Hóa đơn quá hạn', message: 'Phòng B101 - Lê Văn C có hóa đơn quá hạn thanh toán', type: 'warning', read: false, createdAt: '2025-03-23T08:00:00' },
  { id: '2', title: 'Hợp đồng sắp hết hạn', message: 'Hợp đồng HD-002 của Trần Thị B sẽ hết hạn trong 30 ngày', type: 'info', read: false, createdAt: '2025-03-22T14:00:00' },
  { id: '3', title: 'Thanh toán thành công', message: 'Nguyễn Văn A đã thanh toán hóa đơn INV-2025-001', type: 'success', read: true, createdAt: '2025-03-21T10:00:00' },
  { id: '4', title: 'Phòng cần bảo trì', message: 'Phòng A202 cần bảo trì hệ thống điện', type: 'error', read: false, createdAt: '2025-03-20T16:00:00' },
]
