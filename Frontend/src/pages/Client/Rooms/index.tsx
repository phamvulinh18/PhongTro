import { useQuery } from '@tanstack/react-query'
import { Link, useSearchParams } from 'react-router-dom'
import { Search, DoorOpen, MapPin, X, Building2, Filter, ChevronDown, ChevronUp, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react'
import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'

const API = 'http://127.0.0.1:8000/api/v1/public'

function formatPrice(n: number) {
  return new Intl.NumberFormat('vi-VN').format(n) + ' đ'
}

const PRICE_RANGES = [
  { label: 'Tất cả', min: '', max: '' },
  { label: 'Dưới 2 triệu', min: '', max: '2000000' },
  { label: '2 - 3 triệu', min: '2000000', max: '3000000' },
  { label: '3 - 5 triệu', min: '3000000', max: '5000000' },
  { label: 'Trên 5 triệu', min: '5000000', max: '' },
]

const AREAS = [
  { label: 'Tất cả', min: '', max: '' },
  { label: 'Dưới 20m²', min: '', max: '20' },
  { label: '20 - 30m²', min: '20', max: '30' },
  { label: '30 - 50m²', min: '30', max: '50' },
  { label: 'Trên 50m²', min: '50', max: '' },
]

export default function ClientRoomListPage() {
  const [searchParams] = useSearchParams()
  const initialSearch = searchParams.get('search') || ''
  const initialPropertyId = searchParams.get('property_id') || ''

  const [search, setSearch] = useState(initialSearch)
  const [propertyId, setPropertyId] = useState(initialPropertyId)
  const [priceRange, setPriceRange] = useState(0)
  const [areaRange, setAreaRange] = useState(0)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [page, setPage] = useState(1)
  const ITEMS_PER_PAGE = 6

  // Collapsible sections
  const [openSections, setOpenSections] = useState({ property: true, price: true, area: true })
  const toggleSection = (key: keyof typeof openSections) => setOpenSections(s => ({ ...s, [key]: !s[key] }))

  const { data: properties = [] } = useQuery({
    queryKey: ['public-properties'],
    queryFn: () => fetch(`${API}/properties`).then(r => r.json()),
  })

  const params = new URLSearchParams()
  if (search) params.set('search', search)
  if (propertyId) params.set('property_id', propertyId)
  if (PRICE_RANGES[priceRange]?.min) params.set('min_price', PRICE_RANGES[priceRange].min)
  if (PRICE_RANGES[priceRange]?.max) params.set('max_price', PRICE_RANGES[priceRange].max)

  const { data: rooms = [], isLoading } = useQuery({
    queryKey: ['public-rooms', search, propertyId, priceRange, areaRange],
    queryFn: () => fetch(`${API}/rooms?${params}`).then(r => r.json()),
  })

  const hasFilters = propertyId || priceRange > 0 || areaRange > 0
  const clearFilters = () => { setPropertyId(''); setPriceRange(0); setAreaRange(0); setPage(1) }

  // Reset page when filters change
  useEffect(() => { setPage(1) }, [search, propertyId, priceRange, areaRange])

  // Filter rooms by area on client side
  const filteredRooms = areaRange === 0 ? rooms : rooms.filter((r: any) => {
    const a = r.area || 0
    const { min, max } = AREAS[areaRange]
    if (min && a < Number(min)) return false
    if (max && a > Number(max)) return false
    return true
  })

  // Pagination
  const totalPages = Math.ceil(filteredRooms.length / ITEMS_PER_PAGE)
  const pagedRooms = filteredRooms.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)

  return (
    <div className="pt-20 pb-12">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6">

        <div className="flex gap-6">
          {/* ─── LEFT SIDEBAR FILTER ─── */}
          <aside className={cn(
            'shrink-0 transition-all duration-300',
            sidebarOpen ? 'w-[300px]' : 'w-0 overflow-hidden'
          )}>
            <div className="sticky top-20 max-h-[calc(100vh-100px)] overflow-y-auto rounded-2xl bg-white border border-slate-200 shadow-sm">
              {/* Sidebar header */}
              <div className="flex items-center justify-between p-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-emerald-500" />
                  <span className="font-semibold text-slate-900 text-sm">Bộ lọc</span>
                </div>
                {hasFilters && (
                  <button onClick={clearFilters} className="flex items-center gap-1 text-xs text-red-500 hover:text-red-600 font-medium">
                    <RotateCcw className="h-3 w-3" /> Xóa lọc
                  </button>
                )}
              </div>

              {/* Search */}
              <div className="p-4 border-b border-slate-100">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Tìm phòng, địa chỉ..."
                    className="w-full pl-9 pr-8 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400"
                  />
                  {search && <button onClick={() => setSearch('')} className="absolute right-2.5 top-1/2 -translate-y-1/2"><X className="h-3.5 w-3.5 text-slate-400" /></button>}
                </div>
              </div>

              {/* Filter: Nhà trọ */}
              <div className="border-b border-slate-100">
                <button onClick={() => toggleSection('property')} className="flex items-center justify-between w-full p-4 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
                  <span className="flex items-center gap-2"><Building2 className="h-4 w-4 text-slate-400" /> Nhà trọ</span>
                  {openSections.property ? <ChevronUp className="h-4 w-4 text-slate-400" /> : <ChevronDown className="h-4 w-4 text-slate-400" />}
                </button>
                {openSections.property && (
                  <div className="px-4 pb-4 space-y-1.5">
                    <button onClick={() => setPropertyId('')}
                      className={cn('w-full text-left px-3 py-2 rounded-lg text-sm transition-colors',
                        !propertyId ? 'bg-emerald-50 text-emerald-700 font-medium' : 'text-slate-600 hover:bg-slate-50'
                      )}>Tất cả</button>
                    {properties.map((p: any) => (
                      <button key={p.id} onClick={() => setPropertyId(String(p.id) === propertyId ? '' : String(p.id))}
                        className={cn('w-full text-left px-3 py-2 rounded-lg text-sm transition-colors',
                          String(p.id) === propertyId ? 'bg-emerald-50 text-emerald-700 font-medium' : 'text-slate-600 hover:bg-slate-50'
                        )}>{p.name}</button>
                    ))}
                  </div>
                )}
              </div>

              {/* Filter: Khoảng giá */}
              <div className="border-b border-slate-100">
                <button onClick={() => toggleSection('price')} className="flex items-center justify-between w-full p-4 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
                  <span className="flex items-center gap-2"><span className="text-slate-400">💰</span> Khoảng giá</span>
                  {openSections.price ? <ChevronUp className="h-4 w-4 text-slate-400" /> : <ChevronDown className="h-4 w-4 text-slate-400" />}
                </button>
                {openSections.price && (
                  <div className="px-4 pb-4 space-y-1.5">
                    {PRICE_RANGES.map((range, i) => (
                      <button key={i} onClick={() => setPriceRange(i)}
                        className={cn('w-full text-left px-3 py-2 rounded-lg text-sm transition-colors',
                          priceRange === i ? 'bg-emerald-50 text-emerald-700 font-medium' : 'text-slate-600 hover:bg-slate-50'
                        )}>{range.label}</button>
                    ))}
                  </div>
                )}
              </div>

              {/* Filter: Diện tích */}
              <div>
                <button onClick={() => toggleSection('area')} className="flex items-center justify-between w-full p-4 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
                  <span className="flex items-center gap-2"><span className="text-slate-400">📐</span> Diện tích</span>
                  {openSections.area ? <ChevronUp className="h-4 w-4 text-slate-400" /> : <ChevronDown className="h-4 w-4 text-slate-400" />}
                </button>
                {openSections.area && (
                  <div className="px-4 pb-4 space-y-1.5">
                    {AREAS.map((a, i) => (
                      <button key={i} onClick={() => setAreaRange(i)}
                        className={cn('w-full text-left px-3 py-2 rounded-lg text-sm transition-colors',
                          areaRange === i ? 'bg-emerald-50 text-emerald-700 font-medium' : 'text-slate-600 hover:bg-slate-50'
                        )}>{a.label}</button>
                    ))}
                  </div>
                )}
              </div>

              {/* Apply button */}
              {hasFilters && (
                <div className="p-4 border-t border-slate-100">
                  <div className="text-xs text-slate-500 text-center">
                    {filteredRooms.length} kết quả phù hợp
                  </div>
                </div>
              )}
            </div>
          </aside>

          {/* Toggle sidebar button (mobile/collapsed) */}
          {!sidebarOpen && (
            <button onClick={() => setSidebarOpen(true)}
              className="fixed left-4 bottom-6 z-30 h-12 w-12 rounded-full bg-emerald-500 text-white shadow-lg flex items-center justify-center hover:bg-emerald-600 transition-colors btn-press">
              <Filter className="h-5 w-5" />
            </button>
          )}

          {/* ─── MAIN CONTENT ─── */}
          <div className="flex-1 min-w-0">
            {/* Mobile filter toggle + sort */}
            <div className="flex items-center justify-between mb-4">
              <button onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-600 hover:bg-slate-50 hidden">
                {sidebarOpen ? '← Ẩn bộ lọc' : 'Hiện bộ lọc →'}
              </button>
              {/* Active filter pills */}
              <div className="flex flex-wrap gap-2 flex-1 ml-3">
                {propertyId && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium">
                    {properties.find((p: any) => String(p.id) === propertyId)?.name}
                    <button onClick={() => setPropertyId('')}><X className="h-3 w-3" /></button>
                  </span>
                )}
                {priceRange > 0 && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium">
                    {PRICE_RANGES[priceRange].label}
                    <button onClick={() => setPriceRange(0)}><X className="h-3 w-3" /></button>
                  </span>
                )}
                {areaRange > 0 && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium">
                    {AREAS[areaRange].label}
                    <button onClick={() => setAreaRange(0)}><X className="h-3 w-3" /></button>
                  </span>
                )}
              </div>
            </div>

            {/* Results Grid */}
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {[1,2,3,4,5,6].map(i => <div key={i} className="h-72 rounded-2xl bg-slate-100 animate-pulse" />)}
              </div>
            ) : filteredRooms.length === 0 ? (
              <div className="text-center py-20">
                <DoorOpen className="h-16 w-16 mx-auto text-slate-300 mb-4" />
                <h3 className="text-lg font-semibold text-slate-700">Không tìm thấy phòng</h3>
                <p className="text-slate-500 mt-1">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
                {hasFilters && (
                  <button onClick={clearFilters} className="mt-4 px-4 py-2 rounded-lg bg-emerald-50 text-emerald-600 text-sm font-medium hover:bg-emerald-100 transition-colors">
                    Xóa tất cả bộ lọc
                  </button>
                )}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {pagedRooms.map((room: any) => {
                    const propImg = room.property?.images?.find((i: any) => i.is_main) ?? room.property?.images?.[0]
                    return (
                      <Link
                        key={room.id}
                        to={`/client/rooms/${room.id}`}
                        className="group rounded-2xl overflow-hidden bg-white border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                      >
                        <div className="relative h-44 bg-slate-100 overflow-hidden">
                          {propImg ? (
                            <img src={propImg.url} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center"><Building2 className="h-10 w-10 text-slate-300" /></div>
                          )}
                          <div className="absolute top-3 left-3 bg-white/90 backdrop-blur text-xs font-bold px-2.5 py-1 rounded-lg text-emerald-600 shadow">
                            {room.code}
                          </div>
                          <div className="absolute bottom-3 right-3 bg-emerald-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow">
                            Trống
                          </div>
                        </div>
                        <div className="p-4">
                          <p className="text-sm text-slate-500 flex items-center gap-1 truncate">
                            <MapPin className="h-3 w-3 shrink-0" />{room.property?.name} · {room.property?.address}
                          </p>
                          <p className="text-xl font-bold text-slate-900 mt-1">
                            {formatPrice(room.price)}
                            <span className="text-sm font-normal text-slate-400">/tháng</span>
                          </p>
                          <div className="flex gap-4 mt-3 pt-3 border-t border-slate-100 text-xs text-slate-500">
                            {room.area && <span className="flex items-center gap-1">📐 {room.area}m²</span>}
                            {room.floor && <span className="flex items-center gap-1">🏢 Tầng {room.floor}</span>}
                          </div>
                        </div>
                      </Link>
                    )
                  })}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-8">
                    <button
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="h-9 w-9 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                      <button
                        key={p}
                        onClick={() => setPage(p)}
                        className={cn('h-9 w-9 rounded-lg text-sm font-medium transition-colors',
                          p === page
                            ? 'bg-emerald-500 text-white shadow-sm'
                            : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
                        )}
                      >
                        {p}
                      </button>
                    ))}
                    <button
                      onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                      className="h-9 w-9 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                    <span className="ml-3 text-sm text-slate-400">
                      Trang {page}/{totalPages}
                    </span>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
