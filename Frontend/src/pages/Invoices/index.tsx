import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { PageHeader } from '@/components/common/PageHeader'
import { SearchFilterBar } from '@/components/common/SearchFilterBar'
import { StatusBadge } from '@/components/common/StatusBadge'
import { EmptyState } from '@/components/common/EmptyState'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { Receipt, Eye } from 'lucide-react'
import { api } from '@/lib/api'
import { formatCurrency, formatDate } from '@/lib/utils'

export default function InvoicesPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null)

  const { data: invoices = [], isLoading } = useQuery({
    queryKey: ['invoices', search, statusFilter],
    queryFn: () => api.getInvoices({ ...(search && { search }), ...(statusFilter && { status: statusFilter }) }),
  })

  return (
    <div className="space-y-6">
      <PageHeader title="Hóa đơn & Thanh toán" description="Quản lý hóa đơn thu tiền phòng" />

      <SearchFilterBar
        searchValue={search} onSearchChange={setSearch} searchPlaceholder="Tìm mã hóa đơn..."
        filters={[{ label: 'Trạng thái', value: statusFilter, onChange: setStatusFilter, options: [
          { value: 'paid', label: 'Đã thanh toán' }, { value: 'unpaid', label: 'Chưa thanh toán' }, { value: 'overdue', label: 'Quá hạn' },
        ]}]}
      />

      {isLoading ? (
        <div className="text-center py-10 text-muted-foreground">Đang tải...</div>
      ) : invoices.length === 0 ? (
        <EmptyState icon={Receipt} title="Chưa có hóa đơn" description="Tạo hóa đơn cho tháng này" />
      ) : (
        <Table>
          <TableHeader><TableRow>
            <TableHead>Mã HĐ</TableHead><TableHead>Phòng</TableHead><TableHead>Khách thuê</TableHead>
            <TableHead>Kỳ</TableHead><TableHead>Tổng tiền</TableHead><TableHead>Hạn</TableHead>
            <TableHead>Trạng thái</TableHead><TableHead className="w-[60px]" />
          </TableRow></TableHeader>
          <TableBody>
            {invoices.map((inv: any) => (
              <TableRow key={inv.id}>
                <TableCell className="font-medium">{inv.code}</TableCell>
                <TableCell>{inv.room?.code} - {inv.room?.property?.name}</TableCell>
                <TableCell>{inv.tenant?.full_name || '—'}</TableCell>
                <TableCell>{inv.period}</TableCell>
                <TableCell className="font-semibold">{formatCurrency(inv.total_amount)}</TableCell>
                <TableCell>{formatDate(inv.due_date)}</TableCell>
                <TableCell><StatusBadge status={inv.status} /></TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon" onClick={() => setSelectedInvoice(inv)}><Eye className="h-4 w-4" /></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {/* Invoice Detail Modal */}
      <Dialog open={!!selectedInvoice} onOpenChange={() => setSelectedInvoice(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Chi tiết hóa đơn</DialogTitle></DialogHeader>
          {selectedInvoice && (
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="font-medium">{selectedInvoice.code}</span>
                <StatusBadge status={selectedInvoice.status} />
              </div>
              <Separator />
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-muted-foreground">Phòng:</span> <strong>{selectedInvoice.room?.code}</strong></div>
                <div><span className="text-muted-foreground">Khách:</span> <strong>{selectedInvoice.tenant?.full_name}</strong></div>
                <div><span className="text-muted-foreground">Kỳ:</span> <strong>{selectedInvoice.period}</strong></div>
                <div><span className="text-muted-foreground">Hạn:</span> <strong>{formatDate(selectedInvoice.due_date)}</strong></div>
              </div>
              <Separator />
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span>Tiền phòng</span><span>{formatCurrency(selectedInvoice.room_charge)}</span></div>
                <div className="flex justify-between"><span>Điện ({selectedInvoice.electricity_new - selectedInvoice.electricity_old} kWh × {formatCurrency(selectedInvoice.electricity_price)})</span><span>{formatCurrency(selectedInvoice.electricity_amount)}</span></div>
                <div className="flex justify-between"><span>Nước ({selectedInvoice.water_new - selectedInvoice.water_old} m³ × {formatCurrency(selectedInvoice.water_price)})</span><span>{formatCurrency(selectedInvoice.water_amount)}</span></div>
                {selectedInvoice.other_fees > 0 && <div className="flex justify-between"><span>Phí khác ({selectedInvoice.other_fees_note})</span><span>{formatCurrency(selectedInvoice.other_fees)}</span></div>}
                <Separator />
                <div className="flex justify-between font-bold text-base"><span>Tổng cộng</span><span className="text-primary">{formatCurrency(selectedInvoice.total_amount)}</span></div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
