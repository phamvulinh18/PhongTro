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
import { Plus, Pencil, Trash2, Building2 } from 'lucide-react'
import { api } from '@/lib/api'

export default function PropertiesPage() {
  const queryClient = useQueryClient()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [editItem, setEditItem] = useState<any>(null)
  const [form, setForm] = useState({ name: '', address: '', phone: '', status: 'active' })

  const { data: properties = [], isLoading } = useQuery({
    queryKey: ['properties', search, statusFilter],
    queryFn: () => api.getProperties({
      ...(search && { search }),
      ...(statusFilter && { status: statusFilter }),
    }),
  })

  const createMutation = useMutation({
    mutationFn: (data: any) => editItem ? api.updateProperty(editItem.id, data) : api.createProperty(data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['properties'] }); setDialogOpen(false) },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.deleteProperty(id),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['properties'] }); setDeleteId(null) },
  })

  const openCreate = () => { setEditItem(null); setForm({ name: '', address: '', phone: '', status: 'active' }); setDialogOpen(true) }
  const openEdit = (item: any) => { setEditItem(item); setForm({ name: item.name, address: item.address, phone: item.phone || '', status: item.status }); setDialogOpen(true) }

  return (
    <div className="space-y-6">
      <PageHeader title="Nhà trọ" description="Quản lý danh sách nhà trọ" action={<Button onClick={openCreate}><Plus className="mr-2 h-4 w-4" />Thêm nhà trọ</Button>} />

      <SearchFilterBar
        searchValue={search} onSearchChange={setSearch} searchPlaceholder="Tìm tên, địa chỉ..."
        filters={[{ label: 'Trạng thái', value: statusFilter, onChange: setStatusFilter, options: [
          { value: 'active', label: 'Hoạt động' }, { value: 'inactive', label: 'Ngừng' }, { value: 'maintenance', label: 'Bảo trì' },
        ]}]}
      />

      {isLoading ? (
        <div className="text-center py-10 text-muted-foreground">Đang tải...</div>
      ) : properties.length === 0 ? (
        <EmptyState icon={Building2} title="Chưa có nhà trọ" description="Thêm nhà trọ đầu tiên" actionLabel="Thêm nhà trọ" onAction={openCreate} />
      ) : (
        <Table>
          <TableHeader><TableRow>
            <TableHead>Tên</TableHead><TableHead>Địa chỉ</TableHead><TableHead>SĐT</TableHead>
            <TableHead>Số phòng</TableHead><TableHead>Trạng thái</TableHead><TableHead className="w-[100px]" />
          </TableRow></TableHeader>
          <TableBody>
            {properties.map((p: any) => (
              <TableRow key={p.id}>
                <TableCell className="font-medium">{p.name}</TableCell>
                <TableCell>{p.address}</TableCell>
                <TableCell>{p.phone || '—'}</TableCell>
                <TableCell>{p.rooms_count ?? 0}</TableCell>
                <TableCell><StatusBadge status={p.status} /></TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" onClick={() => openEdit(p)}><Pencil className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => setDeleteId(p.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editItem ? 'Sửa nhà trọ' : 'Thêm nhà trọ'}</DialogTitle></DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid gap-2"><Label>Tên nhà trọ</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
            <div className="grid gap-2"><Label>Địa chỉ</Label><Input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} /></div>
            <div className="grid gap-2"><Label>Số điện thoại</Label><Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
            <div className="grid gap-2"><Label>Trạng thái</Label>
              <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                <option value="active">Hoạt động</option><option value="inactive">Ngừng</option><option value="maintenance">Bảo trì</option>
              </Select>
            </div>
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
        title="Xóa nhà trọ" description="Bạn có chắc muốn xóa? Tất cả phòng liên quan sẽ bị xóa."
        onConfirm={() => deleteId && deleteMutation.mutate(deleteId)} destructive
      />
    </div>
  )
}
