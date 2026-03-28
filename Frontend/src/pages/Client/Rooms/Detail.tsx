import { useQuery } from '@tanstack/react-query'
import { useParams, Link, useNavigate } from 'react-router-dom'
import {
  MapPin, Phone, DoorOpen, Building2, Ruler, Layers, Banknote,
  CheckCircle2, Heart, Calendar, MessageCircle, Share2, Flag, Clock,
  Wifi, Wind, Bath, CookingPot, Home, Maximize, Sun, Car, Camera,
  Fingerprint, Landmark, PawPrint, Users, Zap, Droplets, Globe, Shield,
  ChevronLeft, ChevronRight, Star,
} from 'lucide-react'
import { Lightbox } from '@/components/ui/lightbox'
import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'

const BOOKING_API = 'http://127.0.0.1:8000/api/v1/bookings'
const API = 'http://127.0.0.1:8000/api/v1/public'

function formatPrice(n: number) {
  return new Intl.NumberFormat('vi-VN').format(n) + ' đ'
}

const AMENITIES = [
  { icon: Wifi, label: 'Wifi' },
  { icon: Wind, label: 'Máy lạnh' },
  { icon: Bath, label: 'WC riêng' },
  { icon: CookingPot, label: 'Bếp riêng' },
  { icon: Home, label: 'Gác lửng' },
  { icon: Maximize, label: 'Cửa sổ' },
  { icon: Sun, label: 'Ban công' },
  { icon: Car, label: 'Chỗ để xe' },
  { icon: Camera, label: 'Camera' },
  { icon: Fingerprint, label: 'Khóa vân tay' },
  { icon: Shield, label: 'Không chung chủ' },
  { icon: PawPrint, label: 'Thú cưng OK' },
]

export default function ClientRoomDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIdx, setLightboxIdx] = useState(0)
  const [saved, setSaved] = useState(false)
  const [mainImgIdx, setMainImgIdx] = useState(0)

  // Booking
  const [bookingModal, setBookingModal] = useState(false)
  const [bookingDate, setBookingDate] = useState('')
  const [bookingNote, setBookingNote] = useState('')
  const [bookingLoading, setBookingLoading] = useState(false)
  const [bookingSuccess, setBookingSuccess] = useState(false)
  const [bookingError, setBookingError] = useState('')
  const [existingBooking, setExistingBooking] = useState<any>(null)

  const [user, setUser] = useState<any>(null)
  useEffect(() => { try { const s = localStorage.getItem('user'); if (s) setUser(JSON.parse(s)) } catch {} }, [])

  useEffect(() => {
    if (user?.id && id) {
      fetch(`${BOOKING_API}/my?user_id=${user.id}`)
        .then(r => r.json())
        .then(bookings => {
          const found = bookings.find?.((b: any) => String(b.room_id) === String(id) && b.status === 'pending')
          if (found) setExistingBooking(found)
        }).catch(() => {})
    }
  }, [user, id])

  const handleBooking = async () => {
    if (!user) { navigate('/client/auth'); return }
    setBookingLoading(true); setBookingError('')
    try {
      const res = await fetch(`${BOOKING_API}/`, { method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user.id, room_id: Number(id), desired_date: bookingDate || null, note: bookingNote || null }) })
      const data = await res.json()
      if (res.ok) { setBookingSuccess(true); setExistingBooking(data.booking) }
      else { setBookingError(data.message || 'Có lỗi xảy ra') }
    } catch { setBookingError('Không thể kết nối server') }
    setBookingLoading(false)
  }

  const openBookingModal = () => {
    if (!user) { navigate('/client/auth'); return }
    setBookingModal(true); setBookingSuccess(false); setBookingError('')
  }

  const { data: room, isLoading } = useQuery({
    queryKey: ['public-room', id],
    queryFn: () => fetch(`${API}/rooms/${id}`).then(r => r.json()),
    enabled: !!id,
  })

  const { data: allRooms = [] } = useQuery({
    queryKey: ['public-rooms-similar'],
    queryFn: () => fetch(`${API}/rooms`).then(r => r.json()),
  })

  if (isLoading) {
    return (
      <div className="pt-20 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-5 w-60 bg-slate-200 rounded" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="h-[460px] bg-slate-200 rounded-2xl" />
            <div className="space-y-4"><div className="h-8 w-3/4 bg-slate-200 rounded" /><div className="h-10 w-1/3 bg-slate-200 rounded" /><div className="h-40 bg-slate-200 rounded-xl" /></div>
          </div>
        </div>
      </div>
    )
  }

  if (!room) {
    return (
      <div className="pt-20 max-w-5xl mx-auto px-4 py-20 text-center">
        <DoorOpen className="h-16 w-16 mx-auto text-slate-300 mb-4" />
        <h2 className="text-xl font-bold text-slate-700">Không tìm thấy phòng</h2>
        <Link to="/client/rooms" className="text-emerald-600 mt-2 inline-block hover:underline">← Quay lại danh sách</Link>
      </div>
    )
  }

  const images = room.property?.images ?? []
  const currentImg = images[mainImgIdx] ?? images[0]
  const similarRooms = allRooms.filter((r: any) => r.id !== room.id).slice(0, 4)

  return (
    <div className="pt-20 pb-20 lg:pb-12 bg-white min-h-screen">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">

        {/* Breadcrumb */}
        <div className="py-3 flex items-center gap-2 text-sm text-slate-400 border-b border-slate-100 mb-6">
          <Link to="/client" className="hover:text-emerald-600">Trang chủ</Link><span>›</span>
          <Link to="/client/rooms" className="hover:text-emerald-600">Phòng trọ</Link><span>›</span>
          <span className="text-slate-700">{room.property?.name} — Phòng {room.code}</span>
        </div>

        {/* ═══ MAIN: Image Left + Info Right ═══ */}
        <div className="grid grid-cols-1 lg:grid-cols-[520px_1fr] gap-8">

          {/* ─── LEFT: Gallery ─── */}
          <div>
            {/* Main image */}
            <div className="relative rounded-xl overflow-hidden bg-slate-100 aspect-square cursor-pointer group"
              onClick={() => { if (images.length) { setLightboxIdx(mainImgIdx); setLightboxOpen(true) } }}>
              {currentImg ? (
                <img src={currentImg.url} alt="" className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500" />
              ) : (
                <div className="w-full h-full flex items-center justify-center"><Building2 className="h-20 w-20 text-slate-300" /></div>
              )}
              {/* Nav arrows */}
              {images.length > 1 && (
                <>
                  <button onClick={(e) => { e.stopPropagation(); setMainImgIdx(i => i > 0 ? i - 1 : images.length - 1) }}
                    className="absolute left-2 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-white/80 shadow flex items-center justify-center hover:bg-white transition-colors">
                    <ChevronLeft className="h-5 w-5 text-slate-600" />
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); setMainImgIdx(i => i < images.length - 1 ? i + 1 : 0) }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-white/80 shadow flex items-center justify-center hover:bg-white transition-colors">
                    <ChevronRight className="h-5 w-5 text-slate-600" />
                  </button>
                  <div className="absolute bottom-3 right-3 bg-black/50 text-white text-xs px-2.5 py-1 rounded-lg backdrop-blur">
                    {mainImgIdx + 1}/{images.length}
                  </div>
                </>
              )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
                {images.map((img: any, i: number) => (
                  <button key={img.id} onClick={() => setMainImgIdx(i)}
                    className={cn('shrink-0 h-16 w-16 rounded-lg overflow-hidden border-2 transition-colors',
                      i === mainImgIdx ? 'border-emerald-500' : 'border-transparent hover:border-slate-300')}>
                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Share + Like */}
            <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100">
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Share2 className="h-4 w-4" /> <span>Chia sẻ</span>
              </div>
              <button onClick={() => setSaved(!saved)} className={cn('flex items-center gap-1.5 text-sm transition-colors',
                saved ? 'text-red-500' : 'text-slate-500 hover:text-red-500')}>
                <Heart className={cn('h-4 w-4', saved && 'fill-current')} /> {saved ? 'Đã thích' : 'Thích'}
              </button>
            </div>
          </div>

          {/* ─── RIGHT: Info ─── */}
          <div>
            {/* Title + Status */}
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className="bg-emerald-50 text-emerald-600 text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" /> Còn phòng
                </span>
                <span className="text-xs text-slate-400 flex items-center gap-1"><Clock className="h-3 w-3" /> Cập nhật hôm nay</span>
              </div>
              <h1 className="text-xl lg:text-2xl font-bold text-slate-900 leading-tight">
                Phòng {room.code} — {room.property?.name}
              </h1>
              <p className="text-sm text-slate-500 mt-1.5 flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5 text-emerald-500 shrink-0" /> {room.property?.address}
              </p>
            </div>

            {/* Price */}
            <div className="bg-slate-50 rounded-xl px-5 py-4 mb-5">
              <p className="text-3xl font-bold text-emerald-600">
                {formatPrice(room.price)}
                <span className="text-base font-normal text-slate-400 ml-1">/tháng</span>
              </p>
            </div>

            {/* Quick specs */}
            <div className="mb-5">
              <h3 className="text-sm font-semibold text-slate-700 mb-3">Thông tin phòng</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {[
                  { icon: Ruler, label: 'Diện tích', value: room.area ? `${room.area} m²` : '—' },
                  { icon: Layers, label: 'Tầng', value: room.floor || '—' },
                  { icon: Banknote, label: 'Tiền cọc', value: formatPrice(room.price) },
                  { icon: Zap, label: 'Điện', value: '3.500 đ/kWh' },
                  { icon: Droplets, label: 'Nước', value: '20.000 đ/m³' },
                  { icon: Globe, label: 'Internet', value: 'Miễn phí' },
                  { icon: Car, label: 'Gửi xe', value: '100K/tháng' },
                  { icon: Clock, label: 'Giờ giấc', value: 'Tự do' },
                  { icon: Users, label: 'Tối đa', value: '2 người' },
                ].map((s, i) => (
                  <div key={i} className="flex items-center gap-2.5 p-2.5 bg-white border border-slate-100 rounded-lg text-sm">
                    <s.icon className="h-4 w-4 text-emerald-500 shrink-0" />
                    <div><p className="text-slate-400 text-[11px]">{s.label}</p><p className="font-medium text-slate-800 -mt-0.5">{s.value}</p></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Amenities */}
            <div className="mb-5">
              <h3 className="text-sm font-semibold text-slate-700 mb-3">Tiện ích</h3>
              <div className="flex flex-wrap gap-2">
                {AMENITIES.map((a, i) => (
                  <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-100 rounded-lg text-xs text-emerald-700 font-medium">
                    <a.icon className="h-3.5 w-3.5" /> {a.label}
                  </span>
                ))}
              </div>
            </div>

            {/* Action buttons */}
            <div className="border-t border-slate-100 pt-5 space-y-3">
              <div className="flex gap-3">
                {existingBooking ? (
                  <div className="flex-1 flex items-center justify-center gap-2 bg-amber-50 border border-amber-200 text-amber-700 font-semibold py-3 rounded-xl text-sm">
                    <Clock className="h-4 w-4" /> Đang chờ xác nhận
                  </div>
                ) : (
                  <button onClick={openBookingModal}
                    className="flex-1 flex items-center justify-center gap-2 bg-emerald-500 text-white font-semibold py-3 rounded-xl hover:bg-emerald-600 transition-colors btn-press text-sm">
                    <Calendar className="h-4 w-4" /> Đặt phòng ngay
                  </button>
                )}
                {room.property?.phone && (
                  <a href={`tel:${room.property.phone}`}
                    className="flex-1 flex items-center justify-center gap-2 border-2 border-emerald-500 text-emerald-600 font-semibold py-3 rounded-xl hover:bg-emerald-50 transition-colors btn-press text-sm">
                    <Phone className="h-4 w-4" /> Gọi {room.property.phone}
                  </a>
                )}
              </div>
              <button className="w-full flex items-center justify-center gap-2 bg-blue-500 text-white font-semibold py-3 rounded-xl hover:bg-blue-600 transition-colors btn-press text-sm">
                <MessageCircle className="h-4 w-4" /> Chat / Nhắn Zalo
              </button>
            </div>
          </div>
        </div>

        {/* ═══ BELOW: Description + Map + Landlord ═══ */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6 mt-10">
          {/* Left content */}
          <div className="space-y-6">
            {/* Description */}
            <div className="bg-white rounded-2xl border border-slate-100 p-6">
              <h2 className="text-lg font-bold text-slate-900 mb-3">Mô tả chi tiết</h2>
              <div className="text-sm text-slate-600 leading-relaxed space-y-2">
                {room.description ? <p>{room.description}</p> : (
                  <ul className="space-y-2">
                    {['Phòng mới, sạch sẽ, thoáng mát, có cửa sổ đón gió', 'An ninh tốt, có camera giám sát 24/7', 'Giờ giấc tự do, không chung chủ', 'Phù hợp sinh viên, người đi làm, gia đình nhỏ', 'Gần trường học, chợ, siêu thị'].map((item, i) => (
                      <li key={i} className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" /> {item}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* Map */}
            <div className="bg-white rounded-2xl border border-slate-100 p-6">
              <h2 className="text-lg font-bold text-slate-900 mb-3">Vị trí</h2>
              <div className="bg-slate-50 rounded-xl h-48 flex items-center justify-center mb-4">
                <div className="text-center">
                  <MapPin className="h-8 w-8 text-emerald-400 mx-auto mb-2" />
                  <p className="text-sm text-slate-500">{room.property?.address}</p>
                  <a href={`https://maps.google.com/?q=${encodeURIComponent(room.property?.address || '')}`} target="_blank" rel="noopener"
                    className="text-sm text-emerald-600 font-medium mt-1 inline-block hover:underline">Xem trên Google Maps →</a>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs">
                {[{ l: 'Trường học', d: '500m' }, { l: 'Chợ', d: '300m' }, { l: 'Siêu thị', d: '1.2km' }, { l: 'Bệnh viện', d: '2km' }, { l: 'Bến xe', d: '3km' }, { l: 'Trung tâm', d: '4km' }].map((p, i) => (
                  <div key={i} className="flex items-center gap-1.5 p-2 bg-slate-50 rounded-lg"><MapPin className="h-3 w-3 text-emerald-500" /><span className="text-slate-600">{p.l} ~{p.d}</span></div>
                ))}
              </div>
            </div>

            {/* Report */}
            <div className="flex items-center gap-3 text-xs text-slate-400 pb-4">
              <Flag className="h-3.5 w-3.5" />
              <button className="hover:text-slate-600">Báo tin sai</button><span>·</span>
              <button className="hover:text-slate-600">Báo trùng</button><span>·</span>
              <button className="hover:text-red-500">Báo lừa đảo</button>
            </div>
          </div>

          {/* Right sidebar */}
          <div className="space-y-5">
            <div className="sticky top-20 space-y-5">
              {/* Landlord */}
              <div className="bg-white rounded-2xl border border-slate-100 p-5">
                <h3 className="font-bold text-slate-900 mb-3 text-sm">Thông tin chủ trọ</h3>
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-11 w-11 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold">C</div>
                  <div><p className="font-semibold text-slate-900 text-sm">Chủ trọ</p><p className="text-xs text-slate-400">Từ 2024 · 12 tin đăng</p></div>
                </div>
                <div className="space-y-2 text-xs">
                  {[{ l: 'Phản hồi', v: '95%' }, { l: 'Thời gian', v: '~15 phút' }].map((s, i) => (
                    <div key={i} className="flex justify-between p-2 bg-slate-50 rounded-lg"><span className="text-slate-500">{s.l}</span><span className="font-semibold text-emerald-600">{s.v}</span></div>
                  ))}
                </div>
              </div>
              {/* Property */}
              <div className="bg-white rounded-2xl border border-slate-100 p-5">
                <h3 className="font-bold text-slate-900 mb-3 text-sm">Nhà trọ</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-start gap-2"><Building2 className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" /><div><p className="font-medium text-slate-800">{room.property?.name}</p><p className="text-xs text-slate-400">Tên nhà trọ</p></div></div>
                  <div className="flex items-start gap-2"><MapPin className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" /><div><p className="font-medium text-slate-800">{room.property?.address}</p><p className="text-xs text-slate-400">Địa chỉ</p></div></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ═══ SIMILAR ROOMS ═══ */}
        {similarRooms.length > 0 && (
          <div className="mt-10 pt-8 border-t border-slate-100">
            <h2 className="text-lg font-bold text-slate-900 mb-5">Phòng tương tự</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {similarRooms.map((r: any) => {
                const img = r.property?.images?.find((i: any) => i.is_main) ?? r.property?.images?.[0]
                return (
                  <Link key={r.id} to={`/client/rooms/${r.id}`}
                    className="group rounded-xl overflow-hidden bg-white border border-slate-100 hover:shadow-lg transition-all hover:-translate-y-0.5">
                    <div className="relative h-36 bg-slate-100 overflow-hidden">
                      {img ? <img src={img.url} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform" /> :
                        <div className="w-full h-full flex items-center justify-center"><Building2 className="h-8 w-8 text-slate-300" /></div>}
                      <div className="absolute top-2 left-2 bg-white/90 text-[10px] font-bold px-2 py-0.5 rounded text-emerald-600">{r.code}</div>
                    </div>
                    <div className="p-3">
                      <p className="text-xs text-slate-500 truncate">{r.property?.name}</p>
                      <p className="text-base font-bold text-slate-900">{formatPrice(r.price)}<span className="text-xs font-normal text-slate-400">/th</span></p>
                      <div className="flex gap-3 mt-1.5 text-[11px] text-slate-400">
                        {r.area && <span>📐 {r.area}m²</span>}
                        {r.floor && <span>T{r.floor}</span>}
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {/* Mobile fixed bottom */}
      <div className="fixed bottom-0 left-0 right-0 lg:hidden bg-white border-t border-slate-200 shadow-lg p-3 z-40">
        <div className="flex gap-2 max-w-lg mx-auto">
          <button onClick={openBookingModal} className="flex-1 flex items-center justify-center gap-2 bg-emerald-500 text-white font-semibold py-3 rounded-xl btn-press text-sm">
            <Calendar className="h-4 w-4" /> Đặt phòng
          </button>
          {room.property?.phone && (
            <a href={`tel:${room.property.phone}`} className="flex-1 flex items-center justify-center gap-2 border-2 border-emerald-500 text-emerald-600 font-semibold py-3 rounded-xl text-sm">
              <Phone className="h-4 w-4" /> Gọi
            </a>
          )}
          <button onClick={() => setSaved(!saved)} className={cn('px-4 py-3 rounded-xl border transition-colors',
            saved ? 'bg-red-50 border-red-200 text-red-500' : 'border-slate-200 text-slate-500')}>
            <Heart className={cn('h-4 w-4', saved && 'fill-current')} />
          </button>
        </div>
      </div>

      {/* ═══ BOOKING MODAL ═══ */}
      {bookingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setBookingModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-slide-up">
            {bookingSuccess ? (
              <div className="text-center py-4">
                <div className="h-16 w-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4"><CheckCircle2 className="h-8 w-8 text-emerald-600" /></div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Đặt phòng thành công!</h3>
                <p className="text-slate-500 mb-4">Yêu cầu đã được gửi. Admin sẽ xác nhận sớm nhất.</p>
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-sm text-amber-700 flex items-center gap-2 mb-4"><Clock className="h-4 w-4" /> Đang chờ xác nhận</div>
                <button onClick={() => setBookingModal(false)} className="w-full bg-emerald-500 text-white font-semibold py-3 rounded-xl hover:bg-emerald-600 btn-press">Đóng</button>
              </div>
            ) : (
              <>
                <h3 className="text-xl font-bold text-slate-900 mb-1">Đặt phòng</h3>
                <p className="text-sm text-slate-500 mb-5">Phòng {room.code} — {formatPrice(room.price)}/tháng</p>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-slate-700 mb-1.5 block">Ngày muốn xem/nhận phòng</label>
                    <input type="date" value={bookingDate} onChange={e => setBookingDate(e.target.value)} min={new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700 mb-1.5 block">Ghi chú <span className="text-slate-400">(tùy chọn)</span></label>
                    <textarea value={bookingNote} onChange={e => setBookingNote(e.target.value)} placeholder="VD: Muốn xem phòng buổi chiều..." rows={3}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400" />
                  </div>
                </div>
                {bookingError && <div className="mt-3 bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-600">{bookingError}</div>}
                <div className="flex gap-3 mt-5">
                  <button onClick={() => setBookingModal(false)} className="flex-1 border border-slate-200 text-slate-600 font-medium py-3 rounded-xl hover:bg-slate-50 text-sm">Hủy</button>
                  <button onClick={handleBooking} disabled={bookingLoading}
                    className="flex-1 bg-emerald-500 text-white font-semibold py-3 rounded-xl hover:bg-emerald-600 btn-press text-sm disabled:opacity-50 flex items-center justify-center gap-2">
                    {bookingLoading ? <><div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Đang gửi...</> : <><Calendar className="h-4 w-4" /> Xác nhận</>}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <Lightbox images={images} initialIndex={lightboxIdx} open={lightboxOpen} onClose={() => setLightboxOpen(false)} />
    </div>
  )
}
