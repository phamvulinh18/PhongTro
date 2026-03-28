import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Leaf, Eye, EyeOff, Mail, Lock, User, Phone, ArrowRight, Loader2 } from 'lucide-react'
import { useToast } from '@/components/ui/toast'
import { cn } from '@/lib/utils'

const API = 'http://127.0.0.1:8000/api'

type AuthMode = 'login' | 'register' | 'forgot'

export default function ClientAuthPage() {
  const toast = useToast()
  const navigate = useNavigate()
  const [mode, setMode] = useState<AuthMode>('login')
  const [showPw, setShowPw] = useState(false)
  const [showPw2, setShowPw2] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ identifier: '', password: '', password2: '', name: '' })
  const [forgotSent, setForgotSent] = useState(false)

  // If already logged in, redirect away from auth page
  useEffect(() => {
    try {
      const stored = localStorage.getItem('user')
      if (stored) navigate('/client', { replace: true })
    } catch {}
  }, [navigate])

  const isEmail = form.identifier.includes('@')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (mode === 'forgot') {
      if (!form.identifier) return toast.error('Vui lòng nhập email hoặc SĐT')
      setForgotSent(true)
      toast.success('Đã gửi hướng dẫn khôi phục')
      return
    }

    if (mode === 'register') {
      if (!form.name) return toast.error('Vui lòng nhập họ tên')
      if (!form.identifier) return toast.error('Vui lòng nhập email hoặc SĐT')
      if (form.password.length < 6) return toast.error('Mật khẩu tối thiểu 6 ký tự')
      if (form.password !== form.password2) return toast.error('Mật khẩu nhập lại không khớp')

      setLoading(true)
      try {
        const res = await fetch(`${API}/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({
            name: form.name,
            identifier: form.identifier,
            password: form.password,
            password_confirmation: form.password2,
          }),
        })
        const data = await res.json()
        if (!res.ok) {
          toast.error(data.message || 'Đăng ký thất bại')
          return
        }
        toast.success('Đăng ký thành công!', `Chào mừng ${data.user.name}`)
        localStorage.setItem('user', JSON.stringify(data.user))
        setMode('login')
        setForm({ ...form, password: '', password2: '' })
      } catch {
        toast.error('Lỗi kết nối server')
      } finally {
        setLoading(false)
      }
      return
    }

    // Login
    if (!form.identifier || !form.password) return toast.error('Vui lòng nhập đầy đủ thông tin')

    setLoading(true)
    try {
      const res = await fetch(`${API}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          identifier: form.identifier,
          password: form.password,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.message || 'Đăng nhập thất bại')
        return
      }
      toast.success('Đăng nhập thành công!', `Xin chào ${data.user.name}`)
      localStorage.setItem('user', JSON.stringify(data.user))
      // Redirect based on role
      if (data.user.role === 'admin') {
        navigate('/')
      } else {
        navigate('/client')
      }
    } catch {
      toast.error('Lỗi kết nối server')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = () => {
    toast.info('Google Login', 'Tính năng đăng nhập Google sẽ sớm được tích hợp')
  }

  const inputClass = 'w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 transition-colors'

  return (
    <div className="min-h-screen flex">
      {/* Left branding */}
      <div className="hidden lg:flex lg:w-[45%] bg-emerald-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 rounded-full bg-white/20" />
          <div className="absolute bottom-10 right-20 w-96 h-96 rounded-full bg-white/10" />
        </div>
        <div className="relative flex flex-col justify-between p-12 w-full">
          <Link to="/client" className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-white/20 flex items-center justify-center">
              <Leaf className="h-6 w-6" />
            </div>
            <span className="text-xl font-bold">PhòngTrọ</span>
          </Link>
          <div className="space-y-6">
            <h2 className="text-3xl font-bold leading-tight">
              Quản lý phòng trọ<br />chưa bao giờ<br />
              <span className="text-emerald-200">dễ dàng hơn</span>
            </h2>
            <p className="text-emerald-100 text-lg leading-relaxed max-w-sm">
              Đăng ký tài khoản để quản lý nhà trọ, theo dõi doanh thu và nhiều tính năng hấp dẫn.
            </p>
            <div className="flex gap-4 text-sm">
              {[{ n: '500+', l: 'Phòng cho thuê' }, { n: '50+', l: 'Nhà trọ uy tín' }, { n: '1000+', l: 'Khách hài lòng' }].map((s, i) => (
                <div key={i} className="bg-white/10 rounded-xl px-4 py-3">
                  <div className="text-xl font-bold">{s.n}</div>
                  <div className="text-emerald-200 text-xs">{s.l}</div>
                </div>
              ))}
            </div>
          </div>
          <p className="text-emerald-200 text-sm">© 2026 PhòngTrọ. All rights reserved.</p>
        </div>
      </div>

      {/* Right form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-slate-50">
        <div className="w-full max-w-md animate-fade-in">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8 justify-center">
            <div className="h-9 w-9 rounded-xl bg-emerald-500 flex items-center justify-center">
              <Leaf className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold text-slate-900">PhòngTrọ</span>
          </div>

          {/* Tabs */}
          {mode !== 'forgot' && (
            <div className="flex bg-white rounded-xl p-1 border border-slate-200 mb-8 shadow-sm">
              {(['login', 'register'] as const).map(m => (
                <button key={m} onClick={() => { setMode(m); setForm({ identifier: '', password: '', password2: '', name: '' }) }}
                  className={cn('flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all',
                    mode === m ? 'bg-emerald-500 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'
                  )}>
                  {m === 'login' ? 'Đăng nhập' : 'Đăng ký'}
                </button>
              ))}
            </div>
          )}

          {mode === 'forgot' ? (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 animate-scale-in">
              {forgotSent ? (
                <div className="text-center py-4">
                  <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 mb-4">
                    <Mail className="h-7 w-7 text-emerald-500" />
                  </div>
                  <h2 className="text-xl font-bold text-slate-900 mb-2">Kiểm tra hộp thư</h2>
                  <p className="text-slate-500 text-sm">Hướng dẫn khôi phục đã gửi đến <strong>{form.identifier}</strong></p>
                  <button onClick={() => { setMode('login'); setForgotSent(false) }} className="mt-6 text-emerald-600 font-medium text-sm hover:underline">← Quay lại</button>
                </div>
              ) : (
                <>
                  <h2 className="text-xl font-bold text-slate-900 mb-1">Quên mật khẩu?</h2>
                  <p className="text-slate-500 text-sm mb-6">Nhập email hoặc SĐT để nhận hướng dẫn khôi phục</p>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <input value={form.identifier} onChange={e => setForm({ ...form, identifier: e.target.value })} placeholder="Email hoặc số điện thoại" className={inputClass} />
                    </div>
                    <button type="submit" className="w-full bg-emerald-500 text-white font-semibold py-3 rounded-xl hover:bg-emerald-600 transition-colors btn-press">Gửi hướng dẫn</button>
                  </form>
                  <button onClick={() => setMode('login')} className="w-full mt-3 text-sm text-slate-500 hover:text-emerald-600 transition-colors">← Quay lại đăng nhập</button>
                </>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 animate-scale-in">
              <h2 className="text-xl font-bold text-slate-900 mb-1">{mode === 'login' ? 'Chào mừng trở lại!' : 'Tạo tài khoản mới'}</h2>
              <p className="text-slate-500 text-sm mb-6">{mode === 'login' ? 'Đăng nhập để tiếp tục' : 'Đăng ký miễn phí, bắt đầu ngay'}</p>

              {/* Google */}
              <button onClick={handleGoogleLogin} className="w-full flex items-center justify-center gap-3 py-3 rounded-xl border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors mb-5 btn-press">
                <svg viewBox="0 0 24 24" className="h-5 w-5"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                {mode === 'login' ? 'Đăng nhập bằng Google' : 'Đăng ký bằng Google'}
              </button>
              <div className="flex items-center gap-3 mb-5">
                <div className="flex-1 h-px bg-slate-200" /><span className="text-xs text-slate-400 font-medium">HOẶC</span><div className="flex-1 h-px bg-slate-200" />
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {mode === 'register' && (
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Họ và tên" className={inputClass} />
                  </div>
                )}
                <div className="relative">
                  {isEmail ? <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" /> : <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />}
                  <input value={form.identifier} onChange={e => setForm({ ...form, identifier: e.target.value })} placeholder="Email hoặc số điện thoại" className={inputClass} />
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input type={showPw ? 'text' : 'password'} value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="Mật khẩu" className={cn(inputClass, 'pr-10')} />
                  <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {mode === 'register' && (
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input type={showPw2 ? 'text' : 'password'} value={form.password2} onChange={e => setForm({ ...form, password2: e.target.value })} placeholder="Nhập lại mật khẩu" className={cn(inputClass, 'pr-10')} />
                    <button type="button" onClick={() => setShowPw2(!showPw2)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                      {showPw2 ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                )}
                {mode === 'login' && (
                  <div className="text-right">
                    <button type="button" onClick={() => { setMode('forgot'); setForgotSent(false) }} className="text-sm text-emerald-600 hover:text-emerald-700 font-medium">Quên mật khẩu?</button>
                  </div>
                )}
                <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 bg-emerald-500 text-white font-semibold py-3 rounded-xl hover:bg-emerald-600 transition-colors btn-press disabled:opacity-60">
                  {loading ? (
                    <><Loader2 className="h-4 w-4 animate-spin" /> Đang xử lý...</>
                  ) : (
                    <>{mode === 'login' ? 'Đăng nhập' : 'Đăng ký tài khoản'} <ArrowRight className="h-4 w-4" /></>
                  )}
                </button>
              </form>

              <p className="text-center text-sm text-slate-500 mt-5">
                {mode === 'login'
                  ? <>Chưa có tài khoản? <button onClick={() => setMode('register')} className="text-emerald-600 font-medium hover:underline">Đăng ký ngay</button></>
                  : <>Đã có tài khoản? <button onClick={() => setMode('login')} className="text-emerald-600 font-medium hover:underline">Đăng nhập</button></>
                }
              </p>
            </div>
          )}

          <Link to="/client" className="flex items-center justify-center gap-1 mt-6 text-sm text-slate-500 hover:text-emerald-600 transition-colors">← Quay về trang chủ</Link>
        </div>
      </div>
    </div>
  )
}
