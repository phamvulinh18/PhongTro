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
import { Separator } from '@/components/ui/separator'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import {
  Plus, Pencil, Trash2, FileText, Search, X,
  CheckCircle2, Clock, XCircle, AlertCircle,
  User, Home, Calendar, Banknote, FileSignature,
} from 'lucide-react'
import { api } from '@/lib/api'
import { formatCurrency, formatDate, cn } from '@/lib/utils'

const STATUS_CFG = {
  active:     { label: 'Hiệu lực',  color: 'bg-green-100 text-green-700 border-green-200',  icon: CheckCircle2, dot: 'bg-green-500' },
  pending:    { label: 'Chờ duyệt', color: 'bg-amber-100 text-amber-700 border-amber-200',  icon: Clock,        dot: 'bg-amber-400' },
  expired:    { label: 'Hết hạn',   color: 'bg-slate-100 text-slate-600 border-slate-200',  icon: AlertCircle,  dot: 'bg-slate-400' },
  terminated: { label: 'Đã hủy',    color: 'bg-red-100 text-red-600 border-red-200',        icon: XCircle,      dot: 'bg-red-500' },
} as const

const EMPTY_FORM = {
  code: '', tenant_id: '', room_id: '', start_date: '', end_date: '',
  deposit: '', rent_amount: '', terms: '', status: 'active',
}

function daysLeft(endDate: string) {
  const diff = Math.ceil((new Date(endDate).getTime() - Date.now()) / 86400000)
  return diff
}

export default function ContractsPage() {
  const queryClient = useQueryClient()
  const toast = useToast()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [editItem, setEditItem] = useState<any>(null)
  const [selectedContract, setSelectedContract] = useState<any>(null)
  const [form, setForm] = useState(EMPTY_FORM)

  const { data: contracts = [], isLoading } = useQuery({
    queryKey: ['contracts', search, statusFilter],
    queryFn: () => api.getContracts({ ...(search && { search }), ...(statusFilter && { status: statusFilter }) }),
  })

  const { data: tenants = [] } = useQuery({ queryKey: ['tenants'], queryFn: () => api.getTenants() })
  const { data: rooms = [] } = useQuery({ queryKey: ['rooms'], queryFn: () => api.getRooms() })

  const createMutation = useMutation({
    mutationFn: (data: any) => editItem ? api.updateContract(editItem.id, data) : api.createContract(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contracts'] })
      setDialogOpen(false)
      toast.success(editItem ? 'Đã cập nhật hợp đồng' : 'Tạo hợp đồng thành công')
    },
    onError: (err: any) => toast.error('Lỗi', err.message),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.deleteContract(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contracts'] })
      if (selectedContract?.id === deleteId) setSelectedContract(null)
      setDeleteId(null)
      toast.success('Đã xóa hợp đồng')
    },
    onError: (err: any) => toast.error('Không thể xóa', err.message),
  })

  const openCreate = () => { setEditItem(null); setForm(EMPTY_FORM); setDialogOpen(true) }
  const openEdit = (c: any, e?: React.MouseEvent) => {
    e?.stopPropagation()
    setEditItem(c)
    setForm({
      code: c.code, tenant_id: String(c.tenant_id), room_id: String(c.room_id),
      start_date: c.start_date, end_date: c.end_date,
      deposit: String(c.deposit), rent_amount: String(c.rent_amount),
      terms: c.terms || '', status: c.status,
    })
    setDialogOpen(true)
  }

  const handleSave = () => {
    createMutation.mutate({
      ...form,
      tenant_id: Number(form.tenant_id), room_id: Number(form.room_id),
      deposit: Number(form.deposit), rent_amount: Number(form.rent_amount),
    })
  }

  const filtered = contracts.filter((c: any) => {
    const matchStatus = !statusFilter || c.status === statusFilter
    const matchSearch = !search || c.code.toLowerCase().includes(search.toLowerCase()) ||
      c.tenant?.full_name?.toLowerCase().includes(search.toLowerCase())
    return matchStatus && matchSearch
  })

  const countByStatus = (s: string) => contracts.filter((c: any) => c.status === s).length

  return (
    <div className="space-y-5">
      <PageHeader
        title="Hợp đồng"
        description={`${contracts.length} hợp đồng · ${countByStatus('active')} hiệu lực`}
        action={<Button onClick={openCreate}><Plus className="mr-2 h-4 w-4" />Tạo hợp đồng</Button>}
      />

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {(Object.entries(STATUS_CFG) as [string, typeof STATUS_CFG[keyof typeof STATUS_CFG]][]).map(([key, cfg]) => (
          <button
            key={key}
            onClick={() => setStatusFilter(statusFilter === key ? '' : key)}
            className={cn(
              'rounded-xl border p-4 flex items-center gap-3 text-left transition-all hover:shadow-sm',
              statusFilter === key ? cfg.color + ' border-2' : 'bg-muted/50 hover:bg-muted'
            )}
          >
            <cfg.icon className="h-5 w-5 shrink-0 opacity-70" />
            <div>
              <div className="text-2xl font-bold">{countByStatus(key)}</div>
              <div className="text-xs opacity-70">{cfg.label}</div>
            </div>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="flex gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Tìm mã HĐ, khách thuê..." className="pl-9" />
          {search && <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2"><X className="h-3.5 w-3.5 text-muted-foreground" /></button>}
        </div>
        {statusFilter && (
          <Button variant="outline" size="sm" onClick={() => setStatusFilter('')} className="gap-1.5">
            <X className="h-3.5 w-3.5" /> Bỏ lọc
          </Button>
        )}
      </div>

      <div className={`grid gap-6 ${selectedContract ? 'lg:grid-cols-[1fr_340px]' : ''}`}>
        {/* Table */}
        <div>
          {isLoading ? (
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => <div key={i} className="h-16 rounded-lg border bg-muted/40 animate-pulse" />)}
            </div>
          ) : filtered.length === 0 ? (
            <EmptyState icon={FileText} title="Không có hợp đồng" description="Thay đổi bộ lọc hoặc tạo hợp đồng mới" actionLabel="Tạo hợp đồng" onAction={openCreate} />
          ) : (
            <div className="rounded-xl border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30 hover:bg-muted/30">
                    <TableHead className="font-semibold">Mã HĐ</TableHead>
                    <TableHead className="font-semibold">Khách thuê</TableHead>
                    <TableHead className="font-semibold">Phòng</TableHead>
                    <TableHead className="font-semibold">Thời hạn</TableHead>
                    <TableHead className="font-semibold">Tiền thuê</TableHead>
                    <TableHead className="font-semibold">Trạng thái</TableHead>
                    <TableHead className="w-[90px]" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((c: any) => {
                    const s = STATUS_CFG[c.status as keyof typeof STATUS_CFG] ?? STATUS_CFG.active
                    const days = c.status === 'active' ? daysLeft(c.end_date) : null
                    const isSelected = selectedContract?.id === c.id
                    return (
                      <TableRow
                        key={c.id}
                        className={cn('cursor-pointer hover:bg-muted/20', isSelected && 'bg-primary/5')}
                        onClick={() => setSelectedContract(isSelected ? null : c)}
                      >
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className={cn('h-2 w-2 rounded-full shrink-0', s.dot)} />
                            <span className="font-mono font-semibold text-sm">{c.code}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium text-sm">{c.tenant?.full_name || '—'}</div>
                        </TableCell>
                        <TableCell className="text-sm">
                          {c.room ? (
                            <span className="font-medium">{c.room.code}
                              <span className="text-muted-foreground font-normal"> · {c.room.property?.name}</span>
                            </span>
                          ) : '—'}
                        </TableCell>
                        <TableCell>
                          <div className="text-xs text-muted-foreground">
                            <div>{formatDate(c.start_date)}</div>
                            <div>→ {formatDate(c.end_date)}</div>
                            {days !== null && days <= 30 && (
                              <div className={cn('font-medium mt-0.5', days <= 7 ? 'text-red-600' : 'text-amber-600')}>
                                {days > 0 ? `Còn ${days} ngày` : 'Đã hết hạn'}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{formatCurrency(c.rent_amount)}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={cn('text-xs font-medium border', s.color)}>
                            {s.label}
                          </Badge>
                        </TableCell>
                        <TableCell onClick={e => e.stopPropagation()}>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={e => openEdit(c, e)}>
                              <Pencil className="h-3.5 w-3.5" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setDeleteId(c.id)}>
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
        {selectedContract && (() => {
          const s = STATUS_CFG[selectedContract.status as keyof typeof STATUS_CFG] ?? STATUS_CFG.active
          const days = selectedContract.status === 'active' ? daysLeft(selectedContract.end_date) : null
          return (
            <div className="sticky top-4">
              <div className="rounded-xl border bg-card overflow-hidden">
                <div className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-mono font-bold text-lg">{selectedContract.code}</p>
                      <Badge variant="outline" className={cn('text-xs mt-1 border', s.color)}>{s.label}</Badge>
                    </div>
                    <button onClick={() => setSelectedContract(null)} className="text-muted-foreground hover:text-foreground">
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  {days !== null && days <= 30 && (
                    <div className={cn('rounded-lg p-3 text-sm mb-3',
                      days <= 7 ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-amber-50 text-amber-700 border border-amber-200')}>
                      ⚠️ {days > 0 ? `Hết hạn trong ${days} ngày` : 'Hợp đồng đã hết hạn'}
                    </div>
                  )}
                </div>

                <Separator />
                <div className="p-4 space-y-3">
                  {[
                    { icon: User, label: 'Khách thuê', value: selectedContract.tenant?.full_name || '—' },
                    { icon: Home, label: 'Phòng', value: selectedContract.room ? `${selectedContract.room.code} — ${selectedContract.room.property?.name}` : '—' },
                    { icon: Calendar, label: 'Bắt đầu', value: formatDate(selectedContract.start_date) },
                    { icon: Calendar, label: 'Kết thúc', value: formatDate(selectedContract.end_date) },
                    { icon: Banknote, label: 'Tiền thuê', value: formatCurrency(selectedContract.rent_amount) },
                    { icon: Banknote, label: 'Tiền cọc', value: formatCurrency(selectedContract.deposit) },
                  ].map(({ icon: Icon, label, value }) => (
                    <div key={label} className="flex items-center gap-3">
                      <div className="h-7 w-7 rounded-lg bg-muted/50 flex items-center justify-center shrink-0">
                        <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-[11px] text-muted-foreground">{label}</p>
                        <p className="text-sm font-medium">{value}</p>
                      </div>
                    </div>
                  ))}
                  {selectedContract.terms && (
                    <div className="mt-2 pt-2 border-t">
                      <p className="text-[11px] text-muted-foreground mb-1">Điều khoản</p>
                      <p className="text-xs text-muted-foreground leading-relaxed">{selectedContract.terms}</p>
                    </div>
                  )}
                </div>
                <Separator />
                <div className="p-3 flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1" onClick={e => openEdit(selectedContract, e)}>
                    <Pencil className="h-3.5 w-3.5 mr-1.5" /> Chỉnh sửa
                  </Button>
                  <Button size="sm" variant="outline" className="text-destructive hover:text-destructive" onClick={() => setDeleteId(selectedContract.id)}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          )
        })()}
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileSignature className="h-5 w-5" />
              {editItem ? `Sửa hợp đồng ${editItem.code}` : 'Tạo hợp đồng mới'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-5 py-2">
            {/* Thông tin hợp đồng */}
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Thông tin hợp đồng</p>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Mã hợp đồng <span className="text-destructive">*</span></Label>
                  <Input
                    placeholder="VD: HD2024001"
                    value={form.code}
                    onChange={e => setForm({ ...form, code: e.target.value })}
                    readOnly={!!editItem}
                    className={editItem ? 'opacity-60' : ''}
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Trạng thái</Label>
                  <Select value={form.status} onValueChange={v => setForm({ ...form, status: v })}>
                    <option value="pending">Chờ duyệt</option>
                    <option value="active">Hiệu lực</option>
                    <option value="expired">Hết hạn</option>
                    <option value="terminated">Đã hủy</option>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Khách thuê <span className="text-destructive">*</span></Label>
                  <Select value={form.tenant_id} onValueChange={v => setForm({ ...form, tenant_id: v })}>
                    <option value="">Chọn khách thuê...</option>
                    {tenants.map((t: any) => <option key={t.id} value={String(t.id)}>{t.full_name} — {t.phone}</option>)}
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Phòng <span className="text-destructive">*</span></Label>
                  <Select value={form.room_id} onValueChange={v => setForm({ ...form, room_id: v })}>
                    <option value="">Chọn phòng...</option>
                    {rooms.map((r: any) => <option key={r.id} value={String(r.id)}>{r.code} — {r.property?.name}</option>)}
                  </Select>
                </div>
              </div>
            </div>

            <Separator />

            {/* Thời hạn & Tài chính */}
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Thời hạn & Tài chính</p>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Ngày bắt đầu <span className="text-destructive">*</span></Label>
                  <Input type="date" value={form.start_date} onChange={e => setForm({ ...form, start_date: e.target.value })} />
                </div>
                <div className="grid gap-2">
                  <Label>Ngày kết thúc <span className="text-destructive">*</span></Label>
                  <Input type="date" value={form.end_date} onChange={e => setForm({ ...form, end_date: e.target.value })} />
                </div>
                <div className="grid gap-2">
                  <Label>Tiền cọc (VNĐ)</Label>
                  <Input type="number" placeholder="VD: 3000000" value={form.deposit} onChange={e => setForm({ ...form, deposit: e.target.value })} />
                </div>
                <div className="grid gap-2">
                  <Label>Tiền thuê/tháng (VNĐ) <span className="text-destructive">*</span></Label>
                  <Input type="number" placeholder="VD: 3500000" value={form.rent_amount} onChange={e => setForm({ ...form, rent_amount: e.target.value })} />
                </div>
              </div>
            </div>

            <Separator />

            {/* Điều khoản */}
            <div className="grid gap-2">
              <Label>Điều khoản hợp đồng</Label>
              <textarea
                className="flex min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
                placeholder="Ghi các điều khoản đặc biệt, quy định nhà trọ..."
                value={form.terms}
                onChange={e => setForm({ ...form, terms: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Hủy</Button>
            <Button
              onClick={handleSave}
              disabled={createMutation.isPending || !form.code || !form.tenant_id || !form.room_id || !form.start_date || !form.end_date || !form.rent_amount}
            >
              {createMutation.isPending ? 'Đang lưu...' : editItem ? 'Cập nhật' : 'Tạo hợp đồng'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={deleteId !== null} onOpenChange={() => setDeleteId(null)}
        title="Xóa hợp đồng"
        description="Bạn có chắc muốn xóa hợp đồng này? Hành động này không thể hoàn tác."
        onConfirm={() => deleteId && deleteMutation.mutate(deleteId)} destructive
      />
    </div>
  )
}
