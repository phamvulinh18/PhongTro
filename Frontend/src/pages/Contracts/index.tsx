import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { PageHeader } from '@/components/common/PageHeader'
import { SearchFilterBar } from '@/components/common/SearchFilterBar'
import { StatusBadge } from '@/components/common/StatusBadge'
import { EmptyState } from '@/components/common/EmptyState'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { Plus, Pencil, Trash2, FileText } from 'lucide-react'
import { api } from '@/lib/api'
import { formatCurrency, formatDate } from '@/lib/utils'

export default function ContractsPage() {
  const queryClient = useQueryClient()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [editItem, setEditItem] = useState<any>(null)
  const [form, setForm] = useState({ code: '', tenant_id: '', room_id: '', start_date: '', end_date: '', deposit: '', rent_amount: '', status: 'active' })

  const { data: contracts = [], isLoading } = useQuery({
    queryKey: ['contracts', search, statusFilter],
    queryFn: () => api.getContracts({ ...(search && { search }), ...(statusFilter && { status: statusFilter }) }),
  })

  const { data: tenants = [] } = useQuery({ queryKey: ['tenants'], queryFn: () => api.getTenants() })
  const { data: rooms = [] } = useQuery({ queryKey: ['rooms'], queryFn: () => api.getRooms() })

  const createMutation = useMutation({
    mutationFn: (data: any) => editItem ? api.updateContract(editItem.id, data) : api.createContract(data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['contracts'] }); setDialogOpen(false) },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.deleteContract(id),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['contracts'] }); setDeleteId(null) },
  })

  const openCreate = () => { setEditItem(null); setForm({ code: '', tenant_id: '', room_id: '', start_date: '', end_date: '', deposit: '', rent_amount: '', status: 'active' }); setDialogOpen(true) }

  return (
    <div className="space-y-6">
      <PageHeader title="Hợp đồng" description="Quản lý hợp đồng thuê phòng" action={<Button onClick={openCreate}><Plus className="mr-2 h-4 w-4" />Tạo hợp đồng</Button>} />

      <SearchFilterBar
        searchValue={search} onSearchChange={setSearch} searchPlaceholder="Tìm mã hợp đồng..."
        filters={[{ label: 'Trạng thái', value: statusFilter, onChange: setStatusFilter, options: [
          { value: 'active', label: 'Hiệu lực' }, { value: 'expired', label: 'Hết hạn' }, { value: 'terminated', label: 'Đã hủy' }, { value: 'pending', label: 'Chờ duyệt' },
        ]}]}
      />

      {isLoading ? (
        <div className="text-center py-10 text-muted-foreground">Đang tải...</div>
      ) : contracts.length === 0 ? (
        <EmptyState icon={FileText} title="Chưa có hợp đồng" description="Tạo hợp đồng đầu tiên" actionLabel="Tạo hợp đồng" onAction={openCreate} />
      ) : (
        <Table>
          <TableHeader><TableRow>
            <TableHead>Mã HĐ</TableHead><TableHead>Khách thuê</TableHead><TableHead>Phòng</TableHead>
            <TableHead>Nhà trọ</TableHead><TableHead>Thời hạn</TableHead><TableHead>Tiền thuê</TableHead>
            <TableHead>Trạng thái</TableHead><TableHead className="w-[100px]" />
          </TableRow></TableHeader>
          <TableBody>
            {contracts.map((c: any) => (
              <TableRow key={c.id}>
                <TableCell className="font-medium">{c.code}</TableCell>
                <TableCell>{c.tenant?.full_name || '—'}</TableCell>
                <TableCell>{c.room?.code || '—'}</TableCell>
                <TableCell>{c.room?.property?.name || '—'}</TableCell>
                <TableCell className="text-xs">{formatDate(c.start_date)} → {formatDate(c.end_date)}</TableCell>
                <TableCell>{formatCurrency(c.rent_amount)}</TableCell>
                <TableCell><StatusBadge status={c.status} /></TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" onClick={() => setDeleteId(c.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Tạo hợp đồng</DialogTitle></DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid gap-2"><Label>Mã hợp đồng</Label><Input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2"><Label>Khách thuê</Label>
                <Select value={form.tenant_id} onValueChange={(v) => setForm({ ...form, tenant_id: v })}>
                  <option value="">Chọn</option>
                  {tenants.map((t: any) => <option key={t.id} value={String(t.id)}>{t.full_name}</option>)}
                </Select>
              </div>
              <div className="grid gap-2"><Label>Phòng</Label>
                <Select value={form.room_id} onValueChange={(v) => setForm({ ...form, room_id: v })}>
                  <option value="">Chọn</option>
                  {rooms.map((r: any) => <option key={r.id} value={String(r.id)}>{r.code} - {r.property?.name}</option>)}
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2"><Label>Ngày bắt đầu</Label><Input type="date" value={form.start_date} onChange={(e) => setForm({ ...form, start_date: e.target.value })} /></div>
              <div className="grid gap-2"><Label>Ngày kết thúc</Label><Input type="date" value={form.end_date} onChange={(e) => setForm({ ...form, end_date: e.target.value })} /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2"><Label>Tiền cọc (VNĐ)</Label><Input type="number" value={form.deposit} onChange={(e) => setForm({ ...form, deposit: e.target.value })} /></div>
              <div className="grid gap-2"><Label>Tiền thuê (VNĐ)</Label><Input type="number" value={form.rent_amount} onChange={(e) => setForm({ ...form, rent_amount: e.target.value })} /></div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Hủy</Button>
            <Button onClick={() => createMutation.mutate({ ...form, tenant_id: Number(form.tenant_id), room_id: Number(form.room_id), deposit: Number(form.deposit), rent_amount: Number(form.rent_amount) })} disabled={createMutation.isPending}>
              {createMutation.isPending ? 'Đang lưu...' : 'Lưu'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}
        title="Xóa hợp đồng" description="Bạn có chắc muốn xóa hợp đồng này?"
        onConfirm={() => deleteId && deleteMutation.mutate(deleteId)} destructive
      />
    </div>
  )
}
