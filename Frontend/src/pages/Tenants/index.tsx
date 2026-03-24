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
import { Plus, Pencil, Trash2, Users } from 'lucide-react'
import { api } from '@/lib/api'
import { formatDate } from '@/lib/utils'

export default function TenantsPage() {
  const queryClient = useQueryClient()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [editItem, setEditItem] = useState<any>(null)
  const [form, setForm] = useState({ full_name: '', phone: '', id_card: '', email: '', address: '', status: 'active' })

  const { data: tenants = [], isLoading } = useQuery({
    queryKey: ['tenants', search, statusFilter],
    queryFn: () => api.getTenants({
      ...(search && { search }),
      ...(statusFilter && { status: statusFilter }),
    }),
  })

  const createMutation = useMutation({
    mutationFn: (data: any) => editItem ? api.updateTenant(editItem.id, data) : api.createTenant(data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['tenants'] }); setDialogOpen(false) },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.deleteTenant(id),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['tenants'] }); setDeleteId(null) },
  })

  const openCreate = () => { setEditItem(null); setForm({ full_name: '', phone: '', id_card: '', email: '', address: '', status: 'active' }); setDialogOpen(true) }
  const openEdit = (item: any) => {
    setEditItem(item)
    setForm({ full_name: item.full_name, phone: item.phone, id_card: item.id_card || '', email: item.email || '', address: item.address || '', status: item.status })
    setDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Khách thuê" description="Quản lý danh sách khách thuê" action={<Button onClick={openCreate}><Plus className="mr-2 h-4 w-4" />Thêm khách thuê</Button>} />

      <SearchFilterBar
        searchValue={search} onSearchChange={setSearch} searchPlaceholder="Tìm tên, SĐT..."
        filters={[{ label: 'Trạng thái', value: statusFilter, onChange: setStatusFilter, options: [
          { value: 'active', label: 'Đang thuê' }, { value: 'inactive', label: 'Đã trả phòng' },
        ]}]}
      />

      {isLoading ? (
        <div className="text-center py-10 text-muted-foreground">Đang tải...</div>
      ) : tenants.length === 0 ? (
        <EmptyState icon={Users} title="Chưa có khách thuê" description="Thêm khách thuê đầu tiên" actionLabel="Thêm khách thuê" onAction={openCreate} />
      ) : (
        <Table>
          <TableHeader><TableRow>
            <TableHead>Họ tên</TableHead><TableHead>SĐT</TableHead><TableHead>CCCD</TableHead>
            <TableHead>Phòng</TableHead><TableHead>Nhà trọ</TableHead><TableHead>Ngày vào</TableHead>
            <TableHead>Trạng thái</TableHead><TableHead className="w-[100px]" />
          </TableRow></TableHeader>
          <TableBody>
            {tenants.map((t: any) => (
              <TableRow key={t.id}>
                <TableCell className="font-medium">{t.full_name}</TableCell>
                <TableCell>{t.phone}</TableCell>
                <TableCell>{t.id_card || '—'}</TableCell>
                <TableCell>{t.room?.code || '—'}</TableCell>
                <TableCell>{t.property?.name || '—'}</TableCell>
                <TableCell>{t.move_in_date ? formatDate(t.move_in_date) : '—'}</TableCell>
                <TableCell><StatusBadge status={t.status} /></TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" onClick={() => openEdit(t)}><Pencil className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => setDeleteId(t.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editItem ? 'Sửa khách thuê' : 'Thêm khách thuê'}</DialogTitle></DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2"><Label>Họ tên</Label><Input value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} /></div>
              <div className="grid gap-2"><Label>Số điện thoại</Label><Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2"><Label>CCCD</Label><Input value={form.id_card} onChange={(e) => setForm({ ...form, id_card: e.target.value })} /></div>
              <div className="grid gap-2"><Label>Email</Label><Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
            </div>
            <div className="grid gap-2"><Label>Địa chỉ</Label><Input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Hủy</Button>
            <Button onClick={() => createMutation.mutate(form)} disabled={createMutation.isPending}>
              {createMutation.isPending ? 'Đang lưu...' : 'Lưu'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}
        title="Xóa khách thuê" description="Bạn có chắc muốn xóa khách thuê này?"
        onConfirm={() => deleteId && deleteMutation.mutate(deleteId)} destructive
      />
    </div>
  )
}
