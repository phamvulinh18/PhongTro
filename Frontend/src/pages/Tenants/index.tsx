import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useToast } from '@/components/ui/toast'
import { PageHeader } from '@/components/common/PageHeader'
import { EmptyState } from '@/components/common/EmptyState'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import {
  Plus, Pencil, Trash2, Users, Search, X,
  UserCheck, UserX, Phone, CreditCard, Mail, MapPin, Home, Calendar,
} from 'lucide-react'
import { api } from '@/lib/api'
import { formatDate, cn } from '@/lib/utils'

const EMPTY_FORM = {
  full_name: '', phone: '', id_card: '', email: '', address: '',
  emergency_contact: '', move_in_date: '', room_id: '', property_id: '', status: 'active',
}

function TenantAvatar({ name, size = 'md' }: { name: string; size?: 'sm' | 'md' | 'lg' }) {
  const initials = name.split(' ').slice(-2).map(w => w[0]).join('').toUpperCase()
  const colors = ['bg-blue-100 text-blue-700', 'bg-purple-100 text-purple-700', 'bg-green-100 text-green-700',
    'bg-amber-100 text-amber-700', 'bg-rose-100 text-rose-700', 'bg-cyan-100 text-cyan-700']
  const color = colors[name.charCodeAt(0) % colors.length]
  const sz = size === 'lg' ? 'h-12 w-12 text-lg' : size === 'sm' ? 'h-7 w-7 text-xs' : 'h-9 w-9 text-sm'
  return (
    <div className={cn('rounded-full flex items-center justify-center font-bold shrink-0', color, sz)}>
      {initials}
    </div>
  )
}

export default function TenantsPage() {
  const queryClient = useQueryClient()
  const toast = useToast()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [editItem, setEditItem] = useState<any>(null)
  const [selectedTenant, setSelectedTenant] = useState<any>(null)
  const [form, setForm] = useState(EMPTY_FORM)

  const { data: tenants = [], isLoading } = useQuery({
    queryKey: ['tenants', search, statusFilter],
    queryFn: () => api.getTenants({
      ...(search && { search }),
      ...(statusFilter && { status: statusFilter }),
    }),
  })

  const { data: properties = [] } = useQuery({ queryKey: ['properties'], queryFn: () => api.getProperties() })
  const { data: rooms = [] } = useQuery({ queryKey: ['rooms'], queryFn: () => api.getRooms({ status: 'available' }) })

  // All rooms (available + occupied) for edit mode
  const { data: allRooms = [] } = useQuery({ queryKey: ['rooms-all'], queryFn: () => api.getRooms() })

  const createMutation = useMutation({
    mutationFn: (data: any) => editItem ? api.updateTenant(editItem.id, data) : api.createTenant(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenants'] })
      setDialogOpen(false)
      toast.success(editItem ? 'Đã cập nhật khách thuê' : 'Thêm khách thuê thành công')
    },
    onError: (err: any) => toast.error('Lỗi', err.message),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.deleteTenant(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenants'] })
      if (selectedTenant?.id === deleteId) setSelectedTenant(null)
      setDeleteId(null)
      toast.success('Đã xóa khách thuê')
    },
    onError: (err: any) => toast.error('Không thể xóa', err.message),
  })

  const openCreate = () => {
    setEditItem(null)
    setForm(EMPTY_FORM)
    setDialogOpen(true)
  }
  const openEdit = (item: any) => {
    setEditItem(item)
    setForm({
      full_name: item.full_name, phone: item.phone,
      id_card: item.id_card || '', email: item.email || '',
      address: item.address || '', emergency_contact: item.emergency_contact || '',
      move_in_date: item.move_in_date || '', room_id: String(item.room_id || ''),
      property_id: String(item.property_id || ''), status: item.status,
    })
    setDialogOpen(true)
  }

  const handleSave = () => {
    createMutation.mutate({
      ...form,
      room_id: form.room_id ? Number(form.room_id) : null,
      property_id: form.property_id ? Number(form.property_id) : null,
    })
  }

  // Filter available rooms per selected property
  const availableRooms = (editItem ? allRooms : rooms).filter((r: any) =>
    !form.property_id || String(r.property_id) === String(form.property_id)
  )

  const filtered = tenants.filter((t: any) => {
    const matchStatus = !statusFilter || t.status === statusFilter
    const matchSearch = !search || t.full_name.toLowerCase().includes(search.toLowerCase()) ||
      t.phone.includes(search) || (t.id_card || '').includes(search)
    return matchStatus && matchSearch
  })

  const active = tenants.filter((t: any) => t.status === 'active').length
  const inactive = tenants.filter((t: any) => t.status !== 'active').length

  return (
    <div className="space-y-5">
      <PageHeader
        title="Khách thuê"
        description={`${tenants.length} khách · ${active} đang thuê · ${inactive} đã trả phòng`}
        action={<Button onClick={openCreate}><Plus className="mr-2 h-4 w-4" />Thêm khách thuê</Button>}
      />

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {[
          { label: 'Tổng khách',      value: tenants.length, cls: 'bg-muted/50',             icon: Users },
          { label: 'Đang thuê',       value: active,          cls: 'bg-blue-50 text-blue-700', icon: UserCheck },
          { label: 'Đã trả phòng',    value: inactive,        cls: 'bg-slate-50 text-slate-500', icon: UserX },
        ].map(s => (
          <div key={s.label} className={cn('rounded-xl border p-4 flex items-center gap-3', s.cls)}>
            <s.icon className="h-5 w-5 shrink-0 opacity-70" />
            <div>
              <div className="text-2xl font-bold">{s.value}</div>
              <div className="text-xs opacity-70">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Search + Filter */}
      <div className="flex gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Tìm tên, SĐT, CCCD..." className="pl-9" />
          {search && <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2"><X className="h-3.5 w-3.5 text-muted-foreground" /></button>}
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter} className="w-44">
          <option value="">Tất cả trạng thái</option>
          <option value="active">Đang thuê</option>
          <option value="inactive">Đã trả phòng</option>
        </Select>
      </div>

      {/* Table */}
      <div className={`grid gap-6 ${selectedTenant ? 'lg:grid-cols-[1fr_320px]' : ''}`}>
        <div>
          {isLoading ? (
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => <div key={i} className="h-16 rounded-lg border bg-muted/40 animate-pulse" />)}
            </div>
          ) : filtered.length === 0 ? (
            <EmptyState icon={Users} title="Không có khách thuê" description={statusFilter ? 'Thử bỏ bộ lọc' : 'Thêm khách thuê đầu tiên'} actionLabel="Thêm khách thuê" onAction={openCreate} />
          ) : (
            <div className="rounded-xl border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30 hover:bg-muted/30">
                    <TableHead className="font-semibold">Khách thuê</TableHead>
                    <TableHead className="font-semibold">Liên hệ</TableHead>
                    <TableHead className="font-semibold">CCCD</TableHead>
                    <TableHead className="font-semibold">Phòng</TableHead>
                    <TableHead className="font-semibold">Ngày vào</TableHead>
                    <TableHead className="font-semibold">Trạng thái</TableHead>
                    <TableHead className="w-[90px]" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((t: any) => {
                    const isSelected = selectedTenant?.id === t.id
                    return (
                      <TableRow
                        key={t.id}
                        className={cn('cursor-pointer hover:bg-muted/20', isSelected && 'bg-primary/5')}
                        onClick={() => setSelectedTenant(isSelected ? null : t)}
                      >
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <TenantAvatar name={t.full_name} size="sm" />
                            <span className="font-semibold">{t.full_name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">{t.phone}</TableCell>
                        <TableCell className="text-sm font-mono text-muted-foreground">{t.id_card || '—'}</TableCell>
                        <TableCell>
                          {t.room ? (
                            <div className="flex items-center gap-1.5">
                              <Home className="h-3.5 w-3.5 text-muted-foreground" />
                              <span className="font-medium text-sm">{t.room.code}</span>
                              {t.property && <span className="text-xs text-muted-foreground">· {t.property.name}</span>}
                            </div>
                          ) : <span className="text-muted-foreground">—</span>}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {t.move_in_date ? formatDate(t.move_in_date) : '—'}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={cn('text-xs font-medium border',
                            t.status === 'active'
                              ? 'bg-blue-50 text-blue-700 border-blue-200'
                              : 'bg-slate-50 text-slate-500 border-slate-200'
                          )}>
                            {t.status === 'active' ? 'Đang thuê' : 'Đã trả phòng'}
                          </Badge>
                        </TableCell>
                        <TableCell onClick={e => e.stopPropagation()}>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(t)}>
                              <Pencil className="h-3.5 w-3.5" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setDeleteId(t.id)}>
                              <Trash2 className="h-3.5 w-3.5 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </div>

        {/* Detail Panel */}
        {selectedTenant && (
          <div className="sticky top-4">
            <div className="rounded-xl border bg-card overflow-hidden">
              {/* Header */}
              <div className="p-5 flex items-start gap-4">
                <TenantAvatar name={selectedTenant.full_name} size="lg" />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-base truncate">{selectedTenant.full_name}</h3>
                  <Badge variant="outline" className={cn('text-xs mt-1 border',
                    selectedTenant.status === 'active'
                      ? 'bg-blue-50 text-blue-700 border-blue-200'
                      : 'bg-slate-50 text-slate-500 border-slate-200')}>
                    {selectedTenant.status === 'active' ? 'Đang thuê' : 'Đã trả phòng'}
                  </Badge>
                </div>
                <button onClick={() => setSelectedTenant(null)} className="text-muted-foreground hover:text-foreground">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <Separator />

              {/* Info */}
              <div className="p-4 space-y-3">
                {[
                  { icon: Phone, label: 'SĐT', value: selectedTenant.phone },
                  { icon: CreditCard, label: 'CCCD', value: selectedTenant.id_card || '—' },
                  { icon: Mail, label: 'Email', value: selectedTenant.email || '—' },
                  { icon: MapPin, label: 'Địa chỉ', value: selectedTenant.address || '—' },
                  { icon: Home, label: 'Phòng', value: selectedTenant.room ? `${selectedTenant.room.code} — ${selectedTenant.property?.name || ''}` : '—' },
                  { icon: Calendar, label: 'Ngày vào', value: selectedTenant.move_in_date ? formatDate(selectedTenant.move_in_date) : '—' },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-start gap-3">
                    <div className="h-7 w-7 rounded-lg bg-muted/50 flex items-center justify-center shrink-0">
                      <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[11px] text-muted-foreground">{label}</p>
                      <p className="text-sm font-medium truncate">{value}</p>
                    </div>
                  </div>
                ))}
                {selectedTenant.emergency_contact && (
                  <div className="flex items-start gap-3">
                    <div className="h-7 w-7 rounded-lg bg-muted/50 flex items-center justify-center shrink-0">
                      <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-[11px] text-muted-foreground">Liên hệ khẩn cấp</p>
                      <p className="text-sm font-medium">{selectedTenant.emergency_contact}</p>
                    </div>
                  </div>
                )}
              </div>
              <Separator />
              <div className="p-3 flex gap-2">
                <Button size="sm" variant="outline" className="flex-1" onClick={() => openEdit(selectedTenant)}>
                  <Pencil className="h-3.5 w-3.5 mr-1.5" /> Chỉnh sửa
                </Button>
                <Button size="sm" variant="outline" className="text-destructive hover:text-destructive" onClick={() => setDeleteId(selectedTenant.id)}>
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              {editItem ? `Sửa thông tin — ${editItem.full_name}` : 'Thêm khách thuê mới'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-5 py-2">
            {/* Thông tin cá nhân */}
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Thông tin cá nhân</p>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Họ và tên <span className="text-destructive">*</span></Label>
                  <Input placeholder="VD: Nguyễn Văn A" value={form.full_name} onChange={e => setForm({ ...form, full_name: e.target.value })} />
                </div>
                <div className="grid gap-2">
                  <Label>Số điện thoại <span className="text-destructive">*</span></Label>
                  <Input placeholder="09xx..." value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
                </div>
                <div className="grid gap-2">
                  <Label>Số CCCD</Label>
                  <Input placeholder="12 chữ số" value={form.id_card} onChange={e => setForm({ ...form, id_card: e.target.value })} />
                </div>
                <div className="grid gap-2">
                  <Label>Email</Label>
                  <Input type="email" placeholder="email@example.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                </div>
                <div className="col-span-2 grid gap-2">
                  <Label>Địa chỉ thường trú</Label>
                  <Input placeholder="Số nhà, đường, quận, tỉnh/thành phố" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} />
                </div>
                <div className="col-span-2 grid gap-2">
                  <Label>Liên hệ khẩn cấp</Label>
                  <Input placeholder="Tên và SĐT người thân" value={form.emergency_contact} onChange={e => setForm({ ...form, emergency_contact: e.target.value })} />
                </div>
              </div>
            </div>

            <Separator />

            {/* Thông tin thuê phòng */}
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Thông tin thuê phòng</p>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Nhà trọ</Label>
                  <Select value={form.property_id} onValueChange={v => setForm({ ...form, property_id: v, room_id: '' })}>
                    <option value="">Chọn nhà trọ...</option>
                    {properties.map((p: any) => <option key={p.id} value={String(p.id)}>{p.name}</option>)}
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Phòng</Label>
                  <Select value={form.room_id} onValueChange={v => setForm({ ...form, room_id: v })}
                    disabled={!form.property_id}>
                    <option value="">Chọn phòng...</option>
                    {availableRooms.map((r: any) => (
                      <option key={r.id} value={String(r.id)}>
                        {r.code} — {r.price?.toLocaleString('vi-VN')}₫
                      </option>
                    ))}
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Ngày vào ở</Label>
                  <Input type="date" value={form.move_in_date} onChange={e => setForm({ ...form, move_in_date: e.target.value })} />
                </div>
                <div className="grid gap-2">
                  <Label>Trạng thái</Label>
                  <Select value={form.status} onValueChange={v => setForm({ ...form, status: v })}>
                    <option value="active">Đang thuê</option>
                    <option value="inactive">Đã trả phòng</option>
                  </Select>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Hủy</Button>
            <Button onClick={handleSave} disabled={createMutation.isPending || !form.full_name || !form.phone}>
              {createMutation.isPending ? 'Đang lưu...' : editItem ? 'Cập nhật' : 'Thêm khách thuê'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={deleteId !== null} onOpenChange={() => setDeleteId(null)}
        title="Xóa khách thuê"
        description="Bạn có chắc muốn xóa khách thuê này? Hợp đồng và hóa đơn liên quan sẽ không bị xóa."
        onConfirm={() => deleteId && deleteMutation.mutate(deleteId)} destructive
      />
    </div>
  )
}
