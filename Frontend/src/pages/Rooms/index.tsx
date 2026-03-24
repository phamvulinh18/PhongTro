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
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Plus, Pencil, Trash2, DoorOpen, Search, X,
  Users, Wrench, CheckCircle2, Home,
} from 'lucide-react'
import { api } from '@/lib/api'
import { formatCurrency, cn } from '@/lib/utils'

const STATUS_CFG = {
  available:   { label: 'Trống',       color: 'bg-green-100 text-green-700 border-green-200',  icon: CheckCircle2, dot: 'bg-green-500' },
  occupied:    { label: 'Đang thuê',   color: 'bg-blue-100 text-blue-700 border-blue-200',     icon: Users,        dot: 'bg-blue-500' },
  maintenance: { label: 'Bảo trì',    color: 'bg-amber-100 text-amber-700 border-amber-200',  icon: Wrench,       dot: 'bg-amber-500' },
} as const

const EMPTY_FORM = { property_id: '', code: '', price: '', area: '', floor: '', status: 'available', description: '' }

export default function RoomsPage() {
  const queryClient = useQueryClient()
  const toast = useToast()
  const [search, setSearch] = useState('')
  const [propertyFilter, setPropertyFilter] = useState('')
  const [statusTab, setStatusTab] = useState('all')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [editItem, setEditItem] = useState<any>(null)
  const [form, setForm] = useState(EMPTY_FORM)

  const { data: rooms = [], isLoading } = useQuery({
    queryKey: ['rooms', search, propertyFilter],
    queryFn: () => api.getRooms({
      ...(search && { search }),
      ...(propertyFilter && { property_id: propertyFilter }),
    }),
  })

  const { data: properties = [] } = useQuery({
    queryKey: ['properties'],
    queryFn: () => api.getProperties(),
  })

  const createMutation = useMutation({
    mutationFn: (data: any) => editItem ? api.updateRoom(editItem.id, data) : api.createRoom(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rooms'] })
      setDialogOpen(false)
      toast.success(editItem ? 'Đã cập nhật phòng' : 'Thêm phòng thành công')
    },
    onError: (err: any) => toast.error('Lỗi', err.message),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.deleteRoom(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rooms'] })
      setDeleteId(null)
      toast.success('Đã xóa phòng')
    },
    onError: (err: any) => toast.error('Không thể xóa', err.message),
  })

  const openCreate = () => { setEditItem(null); setForm(EMPTY_FORM); setDialogOpen(true) }
  const openEdit = (item: any) => {
    setEditItem(item)
    setForm({
      property_id: String(item.property_id), code: item.code,
      price: String(item.price), area: String(item.area || ''),
      floor: String(item.floor || ''), status: item.status,
      description: item.description || '',
    })
    setDialogOpen(true)
  }

  const handleSave = () => {
    createMutation.mutate({
      ...form,
      property_id: Number(form.property_id),
      price: Number(form.price),
      area: form.area ? Number(form.area) : null,
      floor: form.floor ? Number(form.floor) : null,
    })
  }

  // Filtered rooms
  const filtered = rooms.filter((r: any) => {
    const matchStatus = statusTab === 'all' || r.status === statusTab
    const matchSearch = !search || r.code.toLowerCase().includes(search.toLowerCase()) ||
      r.tenant?.full_name?.toLowerCase().includes(search.toLowerCase())
    return matchStatus && matchSearch
  })

  // Stats
  const total = rooms.length
  const available = rooms.filter((r: any) => r.status === 'available').length
  const occupied = rooms.filter((r: any) => r.status === 'occupied').length
  const maintenance = rooms.filter((r: any) => r.status === 'maintenance').length

  return (
    <div className="space-y-5">
      <PageHeader
        title="Phòng"
        description={`${total} phòng · ${occupied} đang thuê · ${available} trống`}
        action={<Button onClick={openCreate}><Plus className="mr-2 h-4 w-4" />Thêm phòng</Button>}
      />

      {/* Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Tổng phòng',   value: total,       cls: 'bg-muted/50',                   icon: Home },
          { label: 'Đang thuê',    value: occupied,     cls: 'bg-blue-50 text-blue-700',      icon: Users },
          { label: 'Phòng trống',  value: available,    cls: 'bg-green-50 text-green-700',    icon: CheckCircle2 },
          { label: 'Bảo trì',      value: maintenance,  cls: 'bg-amber-50 text-amber-700',    icon: Wrench },
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

      {/* Filters row */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Tabs value={statusTab} onValueChange={setStatusTab} className="w-full sm:w-auto">
          <TabsList>
            <TabsTrigger value="all">Tất cả <Badge variant="secondary" className="ml-1.5 h-5 px-1.5 text-xs">{total}</Badge></TabsTrigger>
            <TabsTrigger value="occupied">Đang thuê <Badge variant="secondary" className="ml-1.5 h-5 px-1.5 text-xs">{occupied}</Badge></TabsTrigger>
            <TabsTrigger value="available">Trống <Badge variant="secondary" className="ml-1.5 h-5 px-1.5 text-xs">{available}</Badge></TabsTrigger>
            <TabsTrigger value="maintenance">Bảo trì <Badge variant="secondary" className="ml-1.5 h-5 px-1.5 text-xs">{maintenance}</Badge></TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex gap-2 ml-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Tìm mã phòng, khách thuê..." className="pl-9 w-56"
            />
            {search && <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2"><X className="h-3.5 w-3.5 text-muted-foreground" /></button>}
          </div>
          <Select value={propertyFilter} onValueChange={setPropertyFilter} className="w-40">
            <option value="">Tất cả nhà trọ</option>
            {properties.map((p: any) => <option key={p.id} value={String(p.id)}>{p.name}</option>)}
          </Select>
        </div>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="space-y-2">
          {[...Array(6)].map((_, i) => <div key={i} className="h-14 rounded-lg border bg-muted/40 animate-pulse" />)}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState icon={DoorOpen} title="Không có phòng nào" description={statusTab !== 'all' ? 'Thử chọn bộ lọc khác' : 'Thêm phòng đầu tiên'} actionLabel="Thêm phòng" onAction={openCreate} />
      ) : (
        <div className="rounded-xl border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30 hover:bg-muted/30">
                <TableHead className="font-semibold">Mã phòng</TableHead>
                <TableHead className="font-semibold">Nhà trọ</TableHead>
                <TableHead className="font-semibold">Giá thuê</TableHead>
                <TableHead className="font-semibold">Diện tích</TableHead>
                <TableHead className="font-semibold">Tầng</TableHead>
                <TableHead className="font-semibold">Khách thuê</TableHead>
                <TableHead className="font-semibold">Trạng thái</TableHead>
                <TableHead className="w-[90px]" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((r: any) => {
                const s = STATUS_CFG[r.status as keyof typeof STATUS_CFG] ?? STATUS_CFG.available
                return (
                  <TableRow key={r.id} className="hover:bg-muted/20">
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className={cn('h-2 w-2 rounded-full shrink-0', s.dot)} />
                        <span className="font-semibold">{r.code}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">{r.property?.name || '—'}</TableCell>
                    <TableCell className="font-medium">{formatCurrency(r.price)}</TableCell>
                    <TableCell className="text-muted-foreground">{r.area ? `${r.area} m²` : '—'}</TableCell>
                    <TableCell className="text-muted-foreground">{r.floor ? `Tầng ${r.floor}` : '—'}</TableCell>
                    <TableCell>
                      {r.tenant ? (
                        <div className="flex items-center gap-1.5">
                          <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary">
                            {r.tenant.full_name?.charAt(0)}
                          </div>
                          <span className="text-sm">{r.tenant.full_name}</span>
                        </div>
                      ) : <span className="text-muted-foreground">—</span>}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={cn('text-xs border font-medium', s.color)}>
                        {s.label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(r)}>
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setDeleteId(r.id)}>
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

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <DoorOpen className="h-5 w-5" />
              {editItem ? `Sửa phòng ${editItem.code}` : 'Thêm phòng mới'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            {/* Nhà trọ */}
            <div className="grid gap-2">
              <Label>Nhà trọ <span className="text-destructive">*</span></Label>
              <Select value={form.property_id} onValueChange={v => setForm({ ...form, property_id: v })}>
                <option value="">Chọn nhà trọ...</option>
                {properties.map((p: any) => <option key={p.id} value={String(p.id)}>{p.name}</option>)}
              </Select>
            </div>

            {/* Code + Price */}
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Mã phòng <span className="text-destructive">*</span></Label>
                <Input placeholder="VD: A01" value={form.code} onChange={e => setForm({ ...form, code: e.target.value })} />
              </div>
              <div className="grid gap-2">
                <Label>Giá thuê (VNĐ) <span className="text-destructive">*</span></Label>
                <Input type="number" placeholder="VD: 3500000" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} />
              </div>
            </div>

            {/* Area + Floor */}
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Diện tích (m²)</Label>
                <Input type="number" placeholder="VD: 25" value={form.area} onChange={e => setForm({ ...form, area: e.target.value })} />
              </div>
              <div className="grid gap-2">
                <Label>Tầng</Label>
                <Input type="number" placeholder="VD: 2" value={form.floor} onChange={e => setForm({ ...form, floor: e.target.value })} />
              </div>
            </div>

            {/* Status */}
            <div className="grid gap-2">
              <Label>Trạng thái</Label>
              <div className="grid grid-cols-3 gap-2">
                {(Object.entries(STATUS_CFG) as [string, typeof STATUS_CFG[keyof typeof STATUS_CFG]][]).map(([key, cfg]) => (
                  <button
                    key={key} type="button"
                    onClick={() => setForm({ ...form, status: key })}
                    className={cn(
                      'flex items-center gap-2 rounded-lg border p-2.5 text-sm font-medium transition-colors',
                      form.status === key ? cfg.color + ' border-2' : 'hover:bg-muted/40'
                    )}
                  >
                    <cfg.icon className="h-4 w-4" />
                    {cfg.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="grid gap-2">
              <Label>Mô tả</Label>
              <textarea
                className="flex min-h-[70px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
                placeholder="Ghi chú về phòng (tiện nghi, đặc điểm...)"
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Hủy</Button>
            <Button
              onClick={handleSave}
              disabled={createMutation.isPending || !form.property_id || !form.code || !form.price}
            >
              {createMutation.isPending ? 'Đang lưu...' : editItem ? 'Cập nhật' : 'Thêm phòng'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={deleteId !== null} onOpenChange={() => setDeleteId(null)}
        title="Xóa phòng"
        description="Bạn có chắc muốn xóa phòng này? Hợp đồng và hóa đơn liên quan cũng sẽ bị xóa."
        onConfirm={() => deleteId && deleteMutation.mutate(deleteId)} destructive
      />
    </div>
  )
}
