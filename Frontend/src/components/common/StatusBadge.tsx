import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

type StatusType =
  | 'active' | 'inactive' | 'maintenance'
  | 'available' | 'occupied'
  | 'paid' | 'unpaid' | 'overdue' | 'partial'
  | 'expired' | 'terminated' | 'pending'

const statusConfig: Record<StatusType, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning' }> = {
  active: { label: 'Hoạt động', variant: 'success' },
  inactive: { label: 'Ngừng', variant: 'secondary' },
  maintenance: { label: 'Bảo trì', variant: 'warning' },
  available: { label: 'Trống', variant: 'success' },
  occupied: { label: 'Đang thuê', variant: 'default' },
  paid: { label: 'Đã thanh toán', variant: 'success' },
  unpaid: { label: 'Chưa thanh toán', variant: 'warning' },
  overdue: { label: 'Quá hạn', variant: 'destructive' },
  partial: { label: 'Thanh toán 1 phần', variant: 'outline' },
  expired: { label: 'Hết hạn', variant: 'destructive' },
  terminated: { label: 'Đã hủy', variant: 'secondary' },
  pending: { label: 'Chờ duyệt', variant: 'warning' },
}

interface StatusBadgeProps {
  status: StatusType
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status] || { label: status, variant: 'secondary' as const }
  return (
    <Badge variant={config.variant} className={cn('text-[11px]', className)}>
      {config.label}
    </Badge>
  )
}
