import { useState, useRef, useCallback } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { PageHeader } from '@/components/common/PageHeader'
import { StatusBadge } from '@/components/common/StatusBadge'
import { EmptyState } from '@/components/common/EmptyState'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { useToast } from '@/components/ui/toast'
import {
  Plus, Pencil, Trash2, Building2, MapPin, Phone, DoorOpen,
  DoorClosed, Users, ChevronRight, Search, X, Wrench,
  ImagePlus, Star, Image as ImageIcon,
} from 'lucide-react'
import { api } from '@/lib/api'
import { formatCurrency, cn } from '@/lib/utils'

const STATUS_ROOM: Record<string, { label: string; color: string }> = {
  available:   { label: 'Trống',      color: 'bg-green-100 text-green-700 border-green-200' },
  occupied:    { label: 'Đang thuê',  color: 'bg-blue-100 text-blue-700 border-blue-200' },
  maintenance: { label: 'Bảo trì',   color: 'bg-amber-100 text-amber-700 border-amber-200' },
}

const EMPTY_FORM = { name: '', address: '', phone: '', description: '', status: 'active' }

export default function PropertiesPage() {
  const queryClient = useQueryClient()
  const toast = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [editItem, setEditItem] = useState<any>(null)
  const [selectedProperty, setSelectedProperty] = useState<any>(null)
  const [form, setForm] = useState(EMPTY_FORM)

  // Image state for the form
  const [pendingImages, setPendingImages] = useState<File[]>([])
  const [previewUrls, setPreviewUrls] = useState<string[]>([])
  const [uploadingId, setUploadingId] = useState<number | null>(null)

  const { data: properties = [], isLoading } = useQuery({
    queryKey: ['properties', search, statusFilter],
    queryFn: () => api.getProperties({
      ...(search && { search }),
      ...(statusFilter && { status: statusFilter }),
    }),
  })

  // Detail view
  const { data: detail, isLoading: detailLoading } = useQuery({
    queryKey: ['property', selectedProperty?.id],
    queryFn: () => fetch(`http://127.0.0.1:8000/api/v1/properties/${selectedProperty.id}`)
      .then(r => r.json()),
    enabled: !!selectedProperty?.id,
  })

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const result = editItem ? await api.updateProperty(editItem.id, data) : await api.createProperty(data)
      // Upload pending images after save
      if (pendingImages.length > 0) {
        const id = editItem ? editItem.id : result.id
        setUploadingId(id)
        await api.uploadPropertyImages(id, pendingImages)
        setUploadingId(null)
      }
      return result
    },
    onSuccess: (_, _vars) => {
      queryClient.invalidateQueries({ queryKey: ['properties'] })
      if (selectedProperty) queryClient.invalidateQueries({ queryKey: ['property', selectedProperty.id] })
      setDialogOpen(false)
      setPendingImages([])
      setPreviewUrls([])
      toast.success(editItem ? 'Đã cập nhật nhà trọ' : 'Thêm nhà trọ thành công', pendingImages.length > 0 ? `Đã tải lên ${pendingImages.length} ảnh` : undefined)
    },
    onError: (err: any) => {
      toast.error('Lỗi', err.message || 'Không thể lưu nhà trọ')
    }
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.deleteProperty(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] })
      if (selectedProperty?.id === deleteId) setSelectedProperty(null)
      setDeleteId(null)
      toast.success('Đã xóa nhà trọ')
    },
    onError: (err: any) => toast.error('Không thể xóa', err.message),
  })

  const setMainMutation = useMutation({
    mutationFn: ({ propertyId, imageId }: { propertyId: number; imageId: number }) =>
      api.setMainPropertyImage(propertyId, imageId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] })
      queryClient.invalidateQueries({ queryKey: ['property', selectedProperty?.id] })
      toast.success('Đã đặt ảnh chính')
    },
    onError: (err: any) => toast.error('Lỗi', err.message),
  })

  const deleteImageMutation = useMutation({
    mutationFn: ({ propertyId, imageId }: { propertyId: number; imageId: number }) =>
      api.deletePropertyImage(propertyId, imageId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] })
      queryClient.invalidateQueries({ queryKey: ['property', selectedProperty?.id] })
      toast.success('Đã xóa ảnh')
    },
    onError: (err: any) => toast.error('Lỗi', err.message),
  })

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    if (!files.length) return
    setPendingImages(prev => [...prev, ...files])
    const urls = files.map(f => URL.createObjectURL(f))
    setPreviewUrls(prev => [...prev, ...urls])
    e.target.value = ''
  }, [])

  const removePendingImage = (idx: number) => {
    URL.revokeObjectURL(previewUrls[idx])
    setPendingImages(prev => prev.filter((_, i) => i !== idx))
    setPreviewUrls(prev => prev.filter((_, i) => i !== idx))
  }

  const openCreate = () => {
    setEditItem(null); setForm(EMPTY_FORM)
    setPendingImages([]); setPreviewUrls([])
    setDialogOpen(true)
  }
  const openEdit = (item: any, e?: React.MouseEvent) => {
    e?.stopPropagation()
    setEditItem(item)
    setForm({ name: item.name, address: item.address, phone: item.phone || '', description: item.description || '', status: item.status })
    setPendingImages([]); setPreviewUrls([])
    setDialogOpen(true)
  }

  const filtered = properties.filter((p: any) => {
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.address.toLowerCase().includes(search.toLowerCase())
    const matchStatus = !statusFilter || p.status === statusFilter
    return matchSearch && matchStatus
  })

  return (
    <div className="space-y-6">
      <PageHeader
        title="Nhà trọ"
        description={`${properties.length} nhà trọ · ${properties.reduce((s: number, p: any) => s + (p.rooms_count || 0), 0)} phòng`}
        action={<Button onClick={openCreate}><Plus className="mr-2 h-4 w-4" />Thêm nhà trọ</Button>}
      />

      {/* Search + Filter */}
      <div className="flex gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Tìm tên, địa chỉ..." className="pl-9" />
          {search && <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2"><X className="h-4 w-4 text-muted-foreground" /></button>}
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter} className="w-40">
          <option value="">Tất cả</option>
          <option value="active">Hoạt động</option>
          <option value="inactive">Ngừng</option>
          <option value="maintenance">Bảo trì</option>
        </Select>
      </div>

      <div className={`grid gap-6 ${selectedProperty ? 'lg:grid-cols-[1fr_400px]' : ''}`}>
        {/* Property Cards */}
        <div>
          {isLoading ? (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {[1,2,3].map(i => <div key={i} className="h-64 rounded-xl border bg-muted/40 animate-pulse" />)}
            </div>
          ) : filtered.length === 0 ? (
            <EmptyState icon={Building2} title="Chưa có nhà trọ" description="Thêm nhà trọ đầu tiên" actionLabel="Thêm nhà trọ" onAction={openCreate} />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((p: any) => {
                const occ = p.occupied_rooms_count ?? 0
                const total = p.rooms_count ?? 0
                const avail = p.available_rooms_count ?? 0
                const rate = total > 0 ? Math.round((occ / total) * 100) : 0
                const mainImg = p.images?.find((img: any) => img.is_main) ?? p.images?.[0]
                const isSelected = selectedProperty?.id === p.id

                return (
                  <Card
                    key={p.id}
                    onClick={() => setSelectedProperty(isSelected ? null : p)}
                    className={cn('cursor-pointer transition-all hover:shadow-md hover:-translate-y-0.5 overflow-hidden', isSelected && 'ring-2 ring-primary shadow-md')}
                  >
                    {/* Cover image */}
                    <div className="relative h-36 bg-muted/30 overflow-hidden">
                      {mainImg ? (
                        <img src={mainImg.url} alt={p.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Building2 className="h-10 w-10 text-muted-foreground/30" />
                        </div>
                      )}
                      {p.images?.length > 0 && (
                        <div className="absolute bottom-2 right-2 bg-black/50 text-white text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1">
                          <ImageIcon className="h-3 w-3" />{p.images.length}
                        </div>
                      )}
                      <div className="absolute top-2 right-2"><StatusBadge status={p.status} /></div>
                    </div>

                    <CardHeader className="pb-2 pt-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <CardTitle className="text-base truncate">{p.name}</CardTitle>
                          <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                            <MapPin className="h-3 w-3 shrink-0" />
                            <span className="truncate">{p.address}</span>
                          </p>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="pt-0 space-y-3">
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div className="rounded-lg bg-muted/50 p-2">
                          <div className="text-lg font-bold">{total}</div>
                          <div className="text-[10px] text-muted-foreground">Tổng</div>
                        </div>
                        <div className="rounded-lg bg-blue-50 p-2">
                          <div className="text-lg font-bold text-blue-600">{occ}</div>
                          <div className="text-[10px] text-blue-500">Đang thuê</div>
                        </div>
                        <div className="rounded-lg bg-green-50 p-2">
                          <div className="text-lg font-bold text-green-600">{avail}</div>
                          <div className="text-[10px] text-green-500">Trống</div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-muted-foreground">Lấp đầy</span>
                          <span className="font-medium">{rate}%</span>
                        </div>
                        <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                          <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${rate}%` }} />
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        {p.phone ? (
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Phone className="h-3 w-3" />{p.phone}
                          </span>
                        ) : <span />}
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={e => openEdit(p, e)}>
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={e => { e.stopPropagation(); setDeleteId(p.id) }}>
                            <Trash2 className="h-3.5 w-3.5 text-destructive" />
                          </Button>
                          <ChevronRight className={cn('h-4 w-4 self-center text-muted-foreground transition-transform', isSelected && 'rotate-90')} />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </div>

        {/* Detail Panel */}
        {selectedProperty && (
          <div className="sticky top-4">
            <Card className="h-fit overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-base">{selectedProperty.name}</CardTitle>
                    <p className="text-xs text-muted-foreground mt-0.5">Chi tiết & Ảnh</p>
                  </div>
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setSelectedProperty(null)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <Separator />

              {/* Image Gallery */}
              <div className="p-3">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Thư viện ảnh</p>
                {detailLoading ? (
                  <div className="grid grid-cols-3 gap-1.5">
                    {[1,2,3].map(i => <div key={i} className="h-20 rounded-lg bg-muted/40 animate-pulse" />)}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {(detail?.images ?? []).length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-24 rounded-lg border-2 border-dashed text-muted-foreground/60">
                        <ImageIcon className="h-6 w-6 mb-1" />
                        <p className="text-xs">Chưa có ảnh</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-3 gap-1.5">
                        {(detail?.images ?? []).map((img: any) => (
                          <div key={img.id} className="relative group h-20 rounded-lg overflow-hidden border">
                            <img src={img.url} alt="" className="w-full h-full object-cover" />
                            {img.is_main && (
                              <div className="absolute top-1 left-1 bg-amber-400 rounded-full p-0.5">
                                <Star className="h-2.5 w-2.5 text-white fill-white" />
                              </div>
                            )}
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                              {!img.is_main && (
                                <button
                                  onClick={() => setMainMutation.mutate({ propertyId: selectedProperty.id, imageId: img.id })}
                                  className="bg-amber-400 rounded-full p-1 hover:bg-amber-500"
                                  title="Đặt làm ảnh chính"
                                >
                                  <Star className="h-3 w-3 text-white fill-white" />
                                </button>
                              )}
                              <button
                                onClick={() => deleteImageMutation.mutate({ propertyId: selectedProperty.id, imageId: img.id })}
                                className="bg-red-500 rounded-full p-1 hover:bg-red-600"
                              >
                                <Trash2 className="h-3 w-3 text-white" />
                              </button>
                            </div>
                          </div>
                        ))}
                        {/* Upload more */}
                        <label className="h-20 rounded-lg border-2 border-dashed flex items-center justify-center cursor-pointer hover:bg-muted/30 transition-colors">
                          <input type="file" accept="image/*" multiple className="hidden"
                            onChange={async e => {
                              const files = Array.from(e.target.files ?? [])
                              if (!files.length) return
                              try {
                                await api.uploadPropertyImages(selectedProperty.id, files)
                                queryClient.invalidateQueries({ queryKey: ['property', selectedProperty.id] })
                                queryClient.invalidateQueries({ queryKey: ['properties'] })
                                toast.success(`Đã tải lên ${files.length} ảnh`)
                              } catch (err: any) {
                                toast.error('Lỗi tải ảnh', err.message)
                              }
                              e.target.value = ''
                            }}
                          />
                          <ImagePlus className="h-5 w-5 text-muted-foreground/50" />
                        </label>
                      </div>
                    )}
                  </div>
                )}
              </div>
              <Separator />

              {/* Room List */}
              <CardContent className="pt-3 px-3">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Danh sách phòng</p>
                <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
                  {(detail?.rooms ?? []).length === 0 ? (
                    <p className="text-sm text-center text-muted-foreground py-4">Chưa có phòng</p>
                  ) : (detail?.rooms ?? []).map((room: any) => {
                    const s = STATUS_ROOM[room.status] ?? STATUS_ROOM.available
                    return (
                      <div key={room.id} className="flex items-center justify-between rounded-lg border p-2.5 hover:bg-muted/30 transition-colors">
                        <div className="flex items-center gap-2.5">
                          <div className={cn('flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border text-xs font-bold', s.color)}>
                            {room.status === 'available' ? <DoorClosed className="h-3.5 w-3.5" /> :
                             room.status === 'maintenance' ? <Wrench className="h-3.5 w-3.5" /> :
                             <Users className="h-3.5 w-3.5" />}
                          </div>
                          <div>
                            <p className="text-sm font-medium">{room.code}</p>
                            <p className="text-xs text-muted-foreground">{room.tenant ? room.tenant.full_name : 'Trống'}</p>
                          </div>
                        </div>
                        <Badge variant="outline" className={cn('text-[10px] border', s.color)}>{s.label}</Badge>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              {editItem ? 'Sửa nhà trọ' : 'Thêm nhà trọ mới'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid gap-2">
              <Label>Tên nhà trọ <span className="text-destructive">*</span></Label>
              <Input placeholder="VD: Nhà trọ ABC" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="grid gap-2">
              <Label>Địa chỉ <span className="text-destructive">*</span></Label>
              <Input placeholder="Số, đường, quận, thành phố" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Số điện thoại</Label>
                <Input placeholder="09xx..." value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
              </div>
              <div className="grid gap-2">
                <Label>Trạng thái</Label>
                <Select value={form.status} onValueChange={v => setForm({ ...form, status: v })}>
                  <option value="active">Hoạt động</option>
                  <option value="inactive">Ngừng hoạt động</option>
                  <option value="maintenance">Đang bảo trì</option>
                </Select>
              </div>
            </div>
            <div className="grid gap-2">
              <Label>Mô tả</Label>
              <textarea
                className="flex min-h-[72px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
                placeholder="Ghi chú về nhà trọ..."
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
              />
            </div>

            {/* Image Upload */}
            <div className="grid gap-2">
              <Label>Ảnh nhà trọ</Label>
              {editItem && (editItem.images ?? []).length > 0 && (
                <p className="text-xs text-muted-foreground">Đã có {editItem.images.length} ảnh. Thêm ảnh mới bên dưới.</p>
              )}
              <div
                className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:bg-muted/20 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                <ImagePlus className="h-6 w-6 mx-auto mb-1 text-muted-foreground/60" />
                <p className="text-sm text-muted-foreground">Kéo thả hoặc <span className="text-primary font-medium">chọn file</span></p>
                <p className="text-xs text-muted-foreground/60 mt-0.5">JPG, PNG, WEBP · Tối đa 5MB/ảnh</p>
              </div>
              <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleFileSelect} />

              {previewUrls.length > 0 && (
                <div className="grid grid-cols-4 gap-2 mt-1">
                  {previewUrls.map((url, i) => (
                    <div key={i} className="relative group h-20 rounded-lg overflow-hidden border">
                      <img src={url} alt="" className="w-full h-full object-cover" />
                      {i === 0 && (
                        <div className="absolute top-1 left-1 bg-amber-400 rounded-full p-0.5" title="Ảnh chính">
                          <Star className="h-2.5 w-2.5 text-white fill-white" />
                        </div>
                      )}
                      <button
                        onClick={e => { e.stopPropagation(); removePendingImage(i) }}
                        className="absolute top-1 right-1 bg-red-500 rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-2.5 w-2.5 text-white" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              {pendingImages.length > 0 && (
                <p className="text-xs text-muted-foreground">{pendingImages.length} ảnh đã chọn — ảnh đầu tiên sẽ là ảnh chính</p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Hủy</Button>
            <Button
              onClick={() => createMutation.mutate(form)}
              disabled={createMutation.isPending || !form.name || !form.address}
            >
              {createMutation.isPending
                ? (uploadingId ? 'Đang tải ảnh...' : 'Đang lưu...')
                : editItem ? 'Cập nhật' : 'Thêm nhà trọ'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={deleteId !== null} onOpenChange={() => setDeleteId(null)}
        title="Xóa nhà trọ"
        description="Bạn có chắc muốn xóa nhà trọ này? Tất cả phòng, hình ảnh và dữ liệu liên quan sẽ bị xóa vĩnh viễn."
        onConfirm={() => deleteId && deleteMutation.mutate(deleteId)} destructive
      />
    </div>
  )
}
