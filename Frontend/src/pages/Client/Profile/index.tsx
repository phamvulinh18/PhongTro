import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, Mail, Phone, MapPin, Save, ArrowLeft, Shield, Calendar, CreditCard, Upload, X, Camera } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function ClientProfilePage() {
  const navigate = useNavigate()
  const [user, setUser] = useState<any>(null)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [cccdFront, setCccdFront] = useState<string | null>(null)
  const [cccdBack, setCccdBack] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)
  const frontRef = useRef<HTMLInputElement>(null)
  const backRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    try {
      const s = localStorage.getItem('user')
      if (s) {
        const u = JSON.parse(s)
        setUser(u)
        setName(u.name || '')
        setEmail(u.email || '')
        setPhone(u.phone || '')
        setAddress(u.address || '')
        setCccdFront(u.cccd_front || null)
        setCccdBack(u.cccd_back || null)
      } else {
        navigate('/client/auth')
      }
    } catch { navigate('/client/auth') }
  }, [])

  const handleFile = (file: File, side: 'front' | 'back') => {
    if (!file.type.startsWith('image/')) return
    const reader = new FileReader()
    reader.onload = (e) => {
      const data = e.target?.result as string
      if (side === 'front') setCccdFront(data)
      else setCccdBack(data)
    }
    reader.readAsDataURL(file)
  }

  const handleSave = () => {
    const updated = { ...user, name, email, phone, address, cccd_front: cccdFront, cccd_back: cccdBack }
    localStorage.setItem('user', JSON.stringify(updated))
    setUser(updated)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  if (!user) return null

  return (
    <div className="pt-20 pb-12 bg-slate-50 min-h-screen">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate(-1)} className="h-9 w-9 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-white transition-colors">
            <ArrowLeft className="h-4 w-4" />
          </button>
          <h1 className="text-xl font-bold text-slate-900">Thông tin cá nhân</h1>
        </div>

        {/* Profile card */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          {/* Avatar header */}
          <div className="bg-emerald-500 h-28 relative">
            <div className="absolute -bottom-10 left-6">
              <div className="h-20 w-20 rounded-full bg-white border-4 border-white shadow-lg flex items-center justify-center text-emerald-600 text-2xl font-bold">
                {name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
            </div>
          </div>

          <div className="pt-14 px-6 pb-6">
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-lg font-bold text-slate-900">{name || 'Chưa cập nhật'}</h2>
              <span className="bg-emerald-50 text-emerald-600 text-xs font-medium px-2 py-0.5 rounded-full flex items-center gap-1">
                <Shield className="h-3 w-3" /> Đã xác minh
              </span>
            </div>
            <p className="text-sm text-slate-400 flex items-center gap-1">
              <Calendar className="h-3 w-3" /> Tham gia từ {new Date(user.created_at || Date.now()).toLocaleDateString('vi-VN')}
            </p>
          </div>

          {/* Form */}
          <div className="px-6 pb-6 space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-700 mb-1.5 block flex items-center gap-1.5">
                <User className="h-3.5 w-3.5 text-slate-400" /> Họ và tên
              </label>
              <input type="text" value={name} onChange={e => setName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400" />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700 mb-1.5 block flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5 text-slate-400" /> Email
              </label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400" />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700 mb-1.5 block flex items-center gap-1.5">
                <Phone className="h-3.5 w-3.5 text-slate-400" /> Số điện thoại
              </label>
              <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="0912 345 678"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400" />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700 mb-1.5 block flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-slate-400" /> Địa chỉ
              </label>
              <input type="text" value={address} onChange={e => setAddress(e.target.value)} placeholder="Nhập địa chỉ..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400" />
            </div>

            {/* ═══ CCCD Upload ═══ */}
            <div className="pt-2">
              <label className="text-sm font-medium text-slate-700 mb-3 block flex items-center gap-1.5">
                <CreditCard className="h-3.5 w-3.5 text-slate-400" /> Căn cước công dân (CCCD)
              </label>
              <div className="grid grid-cols-2 gap-4">
                {/* Front */}
                <div>
                  <p className="text-xs text-slate-500 mb-2 font-medium text-center">Mặt trước</p>
                  <input ref={frontRef} type="file" accept="image/*" className="hidden"
                    onChange={e => { if (e.target.files?.[0]) handleFile(e.target.files[0], 'front') }} />
                  {cccdFront ? (
                    <div className="relative rounded-xl overflow-hidden border-2 border-emerald-200 group">
                      <img src={cccdFront} alt="CCCD mặt trước" className="w-full h-36 object-cover" />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center gap-2">
                        <button onClick={() => frontRef.current?.click()}
                          className="opacity-0 group-hover:opacity-100 h-8 w-8 rounded-full bg-white/90 flex items-center justify-center text-slate-600 hover:bg-white transition-all">
                          <Camera className="h-4 w-4" />
                        </button>
                        <button onClick={() => setCccdFront(null)}
                          className="opacity-0 group-hover:opacity-100 h-8 w-8 rounded-full bg-white/90 flex items-center justify-center text-red-500 hover:bg-white transition-all">
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="absolute top-2 left-2 bg-emerald-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">✓ Đã tải</div>
                    </div>
                  ) : (
                    <button onClick={() => frontRef.current?.click()}
                      className="w-full h-36 rounded-xl border-2 border-dashed border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/30 transition-colors flex flex-col items-center justify-center gap-2 group">
                      <Upload className="h-6 w-6 text-slate-300 group-hover:text-emerald-500 transition-colors" />
                      <span className="text-xs text-slate-400 group-hover:text-emerald-600">Tải ảnh mặt trước</span>
                    </button>
                  )}
                </div>

                {/* Back */}
                <div>
                  <p className="text-xs text-slate-500 mb-2 font-medium text-center">Mặt sau</p>
                  <input ref={backRef} type="file" accept="image/*" className="hidden"
                    onChange={e => { if (e.target.files?.[0]) handleFile(e.target.files[0], 'back') }} />
                  {cccdBack ? (
                    <div className="relative rounded-xl overflow-hidden border-2 border-emerald-200 group">
                      <img src={cccdBack} alt="CCCD mặt sau" className="w-full h-36 object-cover" />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center gap-2">
                        <button onClick={() => backRef.current?.click()}
                          className="opacity-0 group-hover:opacity-100 h-8 w-8 rounded-full bg-white/90 flex items-center justify-center text-slate-600 hover:bg-white transition-all">
                          <Camera className="h-4 w-4" />
                        </button>
                        <button onClick={() => setCccdBack(null)}
                          className="opacity-0 group-hover:opacity-100 h-8 w-8 rounded-full bg-white/90 flex items-center justify-center text-red-500 hover:bg-white transition-all">
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="absolute top-2 left-2 bg-emerald-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">✓ Đã tải</div>
                    </div>
                  ) : (
                    <button onClick={() => backRef.current?.click()}
                      className="w-full h-36 rounded-xl border-2 border-dashed border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/30 transition-colors flex flex-col items-center justify-center gap-2 group">
                      <Upload className="h-6 w-6 text-slate-300 group-hover:text-emerald-500 transition-colors" />
                      <span className="text-xs text-slate-400 group-hover:text-emerald-600">Tải ảnh mặt sau</span>
                    </button>
                  )}
                </div>
              </div>
              <p className="text-[11px] text-slate-400 mt-2">Hỗ trợ JPG, PNG. Ảnh CCCD giúp xác minh danh tính khi đặt phòng.</p>
            </div>

            <button onClick={handleSave}
              className={cn('w-full flex items-center justify-center gap-2 font-semibold py-3 rounded-xl transition-all btn-press text-sm',
                saved ? 'bg-emerald-100 text-emerald-700' : 'bg-emerald-500 text-white hover:bg-emerald-600')}>
              {saved ? <><Save className="h-4 w-4" /> Đã lưu!</> : <><Save className="h-4 w-4" /> Lưu thay đổi</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
