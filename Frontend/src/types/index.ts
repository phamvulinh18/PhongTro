// ===================== PROPERTY (NHÀ TRỌ) =====================
export interface Property {
  id: string
  name: string
  address: string
  totalRooms: number
  availableRooms: number
  occupancyRate: number
  status: 'active' | 'inactive' | 'maintenance'
  createdAt: string
  phone?: string
  description?: string
}

// ===================== ROOM (PHÒNG) =====================
export interface Room {
  id: string
  code: string
  propertyId: string
  propertyName: string
  price: number
  status: 'available' | 'occupied' | 'maintenance'
  currentTenant?: string
  debt: number
  area?: number
  floor?: number
  description?: string
}

// ===================== TENANT (KHÁCH THUÊ) =====================
export interface Tenant {
  id: string
  fullName: string
  phone: string
  idCard: string
  roomId?: string
  roomCode?: string
  propertyId?: string
  propertyName?: string
  moveInDate: string
  debt: number
  status: 'active' | 'inactive'
  email?: string
  address?: string
  emergencyContact?: string
}

// ===================== CONTRACT (HỢP ĐỒNG) =====================
export interface Contract {
  id: string
  code: string
  tenantId: string
  tenantName: string
  roomId: string
  roomCode: string
  propertyName: string
  startDate: string
  endDate: string
  deposit: number
  rentAmount: number
  status: 'active' | 'expired' | 'terminated' | 'pending'
}

// ===================== INVOICE (HÓA ĐƠN) =====================
export interface Invoice {
  id: string
  code: string
  roomId: string
  roomCode: string
  tenantId: string
  tenantName: string
  propertyName: string
  period: string
  roomCharge: number
  electricity: number
  water: number
  otherFees: number
  totalAmount: number
  status: 'paid' | 'unpaid' | 'overdue' | 'partial'
  dueDate: string
  paidDate?: string
  electricityUsage?: { old: number; new: number; unitPrice: number }
  waterUsage?: { old: number; new: number; unitPrice: number }
}

// ===================== DASHBOARD =====================
export interface DashboardStats {
  totalProperties: number
  totalRooms: number
  availableRooms: number
  activeTenants: number
  unpaidInvoices: number
  monthlyRevenue: number
}

export interface MonthlyRevenue {
  month: string
  revenue: number
  expenses: number
}

export interface RoomStatusChart {
  name: string
  value: number
  color: string
}

// ===================== CHAT (TRỢ LÝ AI) =====================
export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

// ===================== NOTIFICATION =====================
export interface Notification {
  id: string
  title: string
  message: string
  type: 'info' | 'warning' | 'error' | 'success'
  read: boolean
  createdAt: string
}

// ===================== SETTINGS =====================
export interface OwnerProfile {
  fullName: string
  phone: string
  email: string
  address: string
  bankName?: string
  bankAccount?: string
  bankHolder?: string
}

export interface PaymentConfig {
  electricityPrice: number
  waterPrice: number
  internetPrice: number
  garbagePrice: number
  defaultDueDay: number
}
