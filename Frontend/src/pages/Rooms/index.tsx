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
import { Plus, Pencil, Trash2, DoorOpen } from 'lucide-react'
import { api } from '@/lib/api'
import { formatCurrency } from '@/lib/utils'

export default function RoomsPage() {
  const queryClient = useQueryClient()
  const [search, setSearch] = useState('')
  const [propertyFilter, setPropertyFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [editItem, setEditItem] = useState<any>(null)
  const [form, setForm] = useState({ property_id: '', code: '', price: '', area: '', floor: '', status: 'available' })

  const { data: rooms = [], isLoading } = useQuery({
    queryKey: ['rooms', search, propertyFilter, statusFilter],
    queryFn: () => api.getRooms({
      ...(search && { search }),
      ...(propertyFilter && { property_id: propertyFilter }),
      ...(statusFilter && { status: statusFilter }),
    }),
  })

  const { data: properties = [] } = useQuery({
    queryKey: ['properties'],
    queryFn: () => api.getProperties(),
  })

  const createMutation = useMutation({
    mutationFn: (data: any) => editItem ? api.updateRoom(editItem.id, data) : api.createRoom(data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['rooms'] }); setDialogOpen(false) },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.deleteRoom(id),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['rooms'] }); setDeleteId(null) },
  })

  const openCreate = () => { setEditItem(null); setForm({ property_id: '', code: '', price: '', area: '', floor: '', status: 'available' }); setDialogOpen(true) }
  const openEdit = (item: any) => {
    setEditItem(item)
    setForm({ property_id: String(item.property_id), code: item.code, price: String(item.price), area: String(item.area || ''), floor: String(item.floor || ''), status: item.status })
    setDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Phòng" description="Quản lý danh sách phòng" action={<Button onClick={openCreate}><Plus className="mr-2 h-4 w-4" />Thêm phòng</Button>} />

      <SearchFilterBar
        searchValue={search} onSearchChange={setSearch} searchPlaceholder="Tìm mã phòng..."
        filters={[
          { label: 'Nhà trọ', value: propertyFilter, onChange: setPropertyFilter, options: properties.map((p: any) => ({ value: String(p.id), label: p.name })) },
          { label: 'Trạng thái', value: statusFilter, onChange: setStatusFilter, options: [
            { value: 'available', label: 'Trống' }, { value: 'occupied', label: 'Đang thuê' }, { value: 'maintenance', label: 'Bảo trì' },
          ]},
        ]}
      />

      {isLoading ? (
        <div className="text-center py-10 text-muted-foreground">Đang tải...</div>
      ) : rooms.length === 0 ? (
        <EmptyState icon={DoorOpen} title="Chưa có phòng" description="Thêm phòng đầu tiên" actionLabel="Thêm phòng" onAction={openCreate} />
      ) : (
        <Table>
          <TableHeader><TableRow>
            <TableHead>Mã phòng</TableHead><TableHead>Nhà trọ</TableHead><TableHead>Giá thuê</TableHead>
            <TableHead>Diện tích</TableHead><TableHead>Tầng</TableHead><TableHead>Khách thuê</TableHead>
            <TableHead>Trạng thái</TableHead><TableHead className="w-[100px]" />
          </TableRow></TableHeader>
          <TableBody>
            {rooms.map((r: any) => (
              <TableRow key={r.id}>
                <TableCell className="font-medium">{r.code}</TableCell>
                <TableCell>{r.property?.name || '—'}</TableCell>
                <TableCell>{formatCurrency(r.price)}</TableCell>
                <TableCell>{r.area ? `${r.area} m²` : '—'}</TableCell>
                <TableCell>{r.floor || '—'}</TableCell>
                <TableCell>{r.tenant?.full_name || '—'}</TableCell>
                <TableCell><StatusBadge status={r.status} /></TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" onClick={() => openEdit(r)}><Pencil className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => setDeleteId(r.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editItem ? 'Sửa phòng' : 'Thêm phòng'}</DialogTitle></DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid gap-2"><Label>Nhà trọ</Label>
              <Select value={form.property_id} onValueChange={(v) => setForm({ ...form, property_id: v })}>
                <option value="">Chọn nhà trọ</option>
                {properties.map((p: any) => <option key={p.id} value={String(p.id)}>{p.name}</option>)}
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2"><Label>Mã phòng</Label><Input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} /></div>
              <div className="grid gap-2"><Label>Giá thuê (VNĐ)</Label><Input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2"><Label>Diện tích (m²)</Label><Input type="number" value={form.area} onChange={(e) => setForm({ ...form, area: e.target.value })} /></div>
              <div className="grid gap-2"><Label>Tầng</Label><Input type="number" value={form.floor} onChange={(e) => setForm({ ...form, floor: e.target.value })} /></div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Hủy</Button>
            <Button onClick={() => createMutation.mutate({ ...form, property_id: Number(form.property_id), price: Number(form.price), area: Number(form.area) || null, floor: Number(form.floor) || null })} disabled={createMutation.isPending}>
              {createMutation.isPending ? 'Đang lưu...' : 'Lưu'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}
        title="Xóa phòng" description="Bạn có chắc muốn xóa phòng này?"
        onConfirm={() => deleteId && deleteMutation.mutate(deleteId)} destructive
      />
    </div>
  )
}
