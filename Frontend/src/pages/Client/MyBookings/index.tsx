import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CalendarCheck, Clock, CheckCircle2, XCircle, ArrowLeft, Building2, MapPin, Banknote, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'

const BOOKING_API = 'http://127.0.0.1:8000/api/v1/bookings'

const STATUS_MAP: Record<string, { label: string; color: string; icon: any }> = {
  pending:   { label: 'Chờ xác nhận', color: 'bg-amber-50 text-amber-700 border-amber-200', icon: Clock },
  confirmed: { label: 'Đã xác nhận',  color: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: CheckCircle2 },
  rejected:  { label: 'Bị từ chối',   color: 'bg-red-50 text-red-600 border-red-200', icon: XCircle },
  cancelled: { label: 'Đã hủy',       color: 'bg-slate-50 text-slate-500 border-slate-200', icon: XCircle },
}

function formatPrice(n: number) {
  return new Intl.NumberFormat('vi-VN').format(n) + ' đ'
}

export default function ClientMyBookingsPage() {
  const navigate = useNavigate()
  const [user, setUser] = useState<any>(null)
  const [bookings, setBookings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('all')

  useEffect(() => {
    try {
      const s = localStorage.getItem('user')
      if (s) setUser(JSON.parse(s))
      else navigate('/client/auth')
    } catch { navigate('/client/auth') }
  }, [])

  useEffect(() => {
    if (!user?.id) return
    setLoading(true)
    fetch(`${BOOKING_API}/my?user_id=${user.id}`)
      .then(r => r.json())
      .then(data => { setBookings(Array.isArray(data) ? data : []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [user])

  const handleCancel = async (bookingId: number) => {
    if (!confirm('Bạn có chắc muốn hủy đặt phòng này?')) return
    const res = await fetch(`${BOOKING_API}/${bookingId}/cancel`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: user.id }),
    })
    if (res.ok) {
      setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: 'cancelled' } : b))
    }
  }

  const tabs = [
    { key: 'all', label: 'Tất cả', count: bookings.length },
    { key: 'pending', label: 'Chờ xác nhận', count: bookings.filter(b => b.status === 'pending').length },
    { key: 'confirmed', label: 'Đã xác nhận', count: bookings.filter(b => b.status === 'confirmed').length },
    { key: 'rejected', label: 'Từ chối', count: bookings.filter(b => b.status === 'rejected').length },
  ]

  const filtered = tab === 'all' ? bookings : bookings.filter(b => b.status === tab)

  return (
    <div className="pt-20 pb-12 bg-slate-50 min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate(-1)} className="h-9 w-9 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-white transition-colors">
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-slate-900">Phòng đã đặt</h1>
            <p className="text-sm text-slate-400">{bookings.length} đơn đặt phòng</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
          {tabs.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={cn('px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors',
                tab === t.key ? 'bg-emerald-500 text-white shadow-sm' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50')}>
              {t.label} {t.count > 0 && <span className={cn('ml-1 text-xs', tab === t.key ? 'text-emerald-100' : 'text-slate-400')}>({t.count})</span>}
            </button>
          ))}
        </div>

        {/* List */}
        {loading ? (
          <div className="space-y-4">
            {[1,2,3].map(i => <div key={i} className="h-36 bg-white rounded-2xl animate-pulse" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-100">
            <CalendarCheck className="h-14 w-14 mx-auto text-slate-300 mb-3" />
            <h3 className="text-lg font-semibold text-slate-700">Chưa có đơn đặt phòng</h3>
            <p className="text-sm text-slate-400 mt-1">Hãy tìm và đặt phòng trọ phù hợp với bạn</p>
            <Link to="/client/rooms" className="inline-flex items-center gap-2 mt-4 px-5 py-2.5 bg-emerald-500 text-white text-sm font-semibold rounded-xl hover:bg-emerald-600 transition-colors btn-press">
              Tìm phòng trọ
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((booking: any) => {
              const st = STATUS_MAP[booking.status] || STATUS_MAP.pending
              const StatusIcon = st.icon
              const room = booking.room
              const prop = room?.property
              const img = prop?.images?.find((i: any) => i.is_main) ?? prop?.images?.[0]

              return (
                <div key={booking.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                  <div className="flex flex-col sm:flex-row">
                    {/* Image */}
                    <Link to={`/client/rooms/${room?.id}`} className="sm:w-44 h-36 sm:h-auto bg-slate-100 shrink-0 overflow-hidden group">
                      {img ? (
                        <img src={img.url} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center"><Building2 className="h-10 w-10 text-slate-300" /></div>
                      )}
                    </Link>

                    {/* Info */}
                    <div className="flex-1 p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <Link to={`/client/rooms/${room?.id}`} className="font-bold text-slate-900 hover:text-emerald-600 transition-colors">
                            Phòng {room?.code}
                          </Link>
                          <p className="text-sm text-slate-500 flex items-center gap-1 mt-0.5">
                            <Building2 className="h-3 w-3" /> {prop?.name}
                          </p>
                        </div>
                        <span className={cn('inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border', st.color)}>
                          <StatusIcon className="h-3 w-3" /> {st.label}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-500 mb-3">
                        <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {prop?.address}</span>
                        <span className="flex items-center gap-1"><Banknote className="h-3 w-3" /> {room?.price ? formatPrice(room.price) : '—'}/tháng</span>
                      </div>

                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-400">
                        <span>Ngày đặt: {new Date(booking.created_at).toLocaleDateString('vi-VN')}</span>
                        {booking.desired_date && <span>Ngày muốn nhận: {new Date(booking.desired_date).toLocaleDateString('vi-VN')}</span>}
                        {booking.note && <span>Ghi chú: {booking.note}</span>}
                      </div>

                      {booking.admin_note && (
                        <div className="mt-2 bg-slate-50 rounded-lg p-2 text-xs text-slate-600">
                          <span className="font-medium">Admin:</span> {booking.admin_note}
                        </div>
                      )}

                      {/* Actions */}
                      {booking.status === 'pending' && (
                        <div className="mt-3 pt-3 border-t border-slate-100">
                          <button onClick={() => handleCancel(booking.id)}
                            className="flex items-center gap-1.5 text-xs text-red-500 hover:text-red-600 transition-colors">
                            <Trash2 className="h-3 w-3" /> Hủy đặt phòng
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
