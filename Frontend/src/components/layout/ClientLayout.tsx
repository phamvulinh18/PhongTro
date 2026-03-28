import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { Building2, Phone, Mail, MapPin, Menu, X, Leaf, LogOut, User, CalendarCheck, ChevronDown } from 'lucide-react'
import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'

const NAV = [
  { path: '/client', label: 'Trang chủ' },
  { path: '/client/features', label: 'Tính năng' },
  { path: '/client/rooms', label: 'Phòng trọ' },
  { path: '/client/about', label: 'Giới thiệu' },
  { path: '/client/contact', label: 'Liên hệ' },
]

export function ClientLayout() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [user, setUser] = useState<any>(null)

  // Only use transparent header on pages with green hero background
  const isHeroPage = pathname === '/client' || pathname === '/client/features' || pathname === '/client/about'
  const solidHeader = !isHeroPage || scrolled

  useEffect(() => {
    try {
      const stored = localStorage.getItem('user')
      if (stored) setUser(JSON.parse(stored))
    } catch {}
  }, [pathname]) // re-check on navigation

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header */}
      <header className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        solidHeader
          ? 'bg-white/95 backdrop-blur-md shadow-sm py-2'
          : 'bg-transparent py-4'
      )}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          {/* Logo */}
          <Link to="/client" className="flex items-center gap-2.5">
            <div className={cn(
              'h-9 w-9 rounded-xl flex items-center justify-center transition-colors',
              solidHeader ? 'bg-emerald-500 text-white' : 'bg-white/90 text-emerald-600'
            )}>
              <Leaf className="h-5 w-5" />
            </div>
            <div>
              <h1 className={cn('text-lg font-bold leading-tight transition-colors', solidHeader ? 'text-slate-900' : 'text-white')}>PhòngTrọ</h1>
              <p className={cn('text-[10px] -mt-0.5 transition-colors', solidHeader ? 'text-slate-400' : 'text-white/70')}>Quản lý thông minh</p>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV.map(item => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'relative px-4 py-2 rounded-lg text-sm font-medium transition-all',
                  pathname === item.path
                    ? solidHeader ? 'text-emerald-600 bg-emerald-50' : 'text-white bg-white/15'
                    : solidHeader ? 'text-slate-600 hover:text-emerald-600 hover:bg-emerald-50/50' : 'text-white/80 hover:text-white hover:bg-white/10'
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right CTA */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="relative group">
                {/* Trigger */}
                <div className={cn('flex items-center gap-2 px-3 py-1.5 rounded-xl cursor-pointer transition-colors',
                  solidHeader ? 'bg-emerald-50 hover:bg-emerald-100' : 'bg-white/15 hover:bg-white/25'
                )}>
                  <div className={cn('h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold',
                    solidHeader ? 'bg-emerald-500 text-white' : 'bg-white text-emerald-600'
                  )}>
                    {user.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <span className={cn('text-sm font-medium', solidHeader ? 'text-slate-700' : 'text-white')}>
                    Hi, {user.name?.split(' ').pop()}
                  </span>
                  <ChevronDown className={cn('h-3.5 w-3.5 transition-transform group-hover:rotate-180', solidHeader ? 'text-slate-400' : 'text-white/60')} />
                </div>

                {/* Dropdown */}
                <div className="absolute right-0 top-full mt-1 w-64 bg-white rounded-xl shadow-xl border border-slate-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  {/* User info */}
                  <div className="p-4 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold text-base">
                        {user.name?.charAt(0)?.toUpperCase() || 'U'}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900 text-sm">{user.name}</p>
                        <p className="text-xs text-slate-400">{user.email || 'Chưa cập nhật email'}</p>
                      </div>
                    </div>
                  </div>
                  {/* Menu items */}
                  <div className="py-1.5">
                    <Link to="/client/profile" className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 transition-colors">
                      <User className="h-4 w-4" /> Thông tin cá nhân
                    </Link>
                    <Link to="/client/my-bookings" className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 transition-colors">
                      <CalendarCheck className="h-4 w-4" /> Phòng đã đặt
                    </Link>
                  </div>
                  {/* Logout */}
                  <div className="border-t border-slate-100 py-1.5">
                    <button onClick={() => { localStorage.removeItem('user'); setUser(null); navigate('/client') }}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors w-full text-left">
                      <LogOut className="h-4 w-4" /> Đăng xuất
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <Link to="/client/auth" className={cn(
                  'text-sm font-medium transition-colors',
                  solidHeader ? 'text-slate-600 hover:text-emerald-600' : 'text-white/80 hover:text-white'
                )}>Đăng nhập</Link>
                <Link to="/client/auth" className={cn(
                  'text-sm font-semibold px-5 py-2 rounded-xl transition-all btn-press',
                  solidHeader
                    ? 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-sm'
                    : 'bg-white text-emerald-600 hover:bg-white/90'
                )}>Bắt đầu ngay</Link>
              </>
            )}
          </div>

          {/* Mobile menu */}
          <button className="md:hidden p-2" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen
              ? <X className={cn('h-5 w-5', solidHeader ? 'text-slate-700' : 'text-white')} />
              : <Menu className={cn('h-5 w-5', solidHeader ? 'text-slate-700' : 'text-white')} />}
          </button>
        </div>

        {/* Mobile dropdown */}
        {menuOpen && (
          <div className="md:hidden bg-white border-t shadow-lg animate-slide-down">
            <div className="px-4 py-3 space-y-1">
              {NAV.map(item => (
                <Link key={item.path} to={item.path} onClick={() => setMenuOpen(false)}
                  className={cn('block px-3 py-2.5 rounded-lg text-sm font-medium',
                    pathname === item.path ? 'bg-emerald-50 text-emerald-600' : 'text-slate-600 hover:bg-slate-50'
                  )}>
                  {item.label}
                </Link>
              ))}
              <div className="pt-2 border-t mt-2">
                {user ? (
                  <div className="flex items-center justify-between px-3 py-2">
                    <span className="text-sm font-medium text-slate-700">Hii, {user.name?.split(' ').pop()}</span>
                    <button onClick={() => { localStorage.removeItem('user'); setUser(null); setMenuOpen(false) }}
                      className="text-sm text-red-500 font-medium">Đăng xuất</button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Link to="/client/auth" onClick={() => setMenuOpen(false)} className="flex-1 text-center py-2.5 rounded-lg text-sm font-medium border border-slate-200 text-slate-600">Đăng nhập</Link>
                    <Link to="/client/auth" onClick={() => setMenuOpen(false)} className="flex-1 text-center py-2.5 rounded-lg text-sm font-semibold bg-emerald-500 text-white">Bắt đầu ngay</Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main */}
      <main className="flex-1"><Outlet /></main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 pt-14 pb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-10 border-b border-slate-800">
            <div className="md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="h-8 w-8 rounded-lg bg-emerald-500 flex items-center justify-center"><Leaf className="h-4 w-4 text-white" /></div>
                <span className="text-white font-bold text-lg">PhòngTrọ</span>
              </div>
              <p className="text-sm leading-relaxed">Hệ thống quản lý phòng trọ tích hợp AI — thông minh, hiệu quả, dễ sử dụng.</p>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-3 text-sm uppercase tracking-wider">Sản phẩm</h3>
              <div className="space-y-2 text-sm">
                <Link to="/client" className="block hover:text-white transition-colors">Trang chủ</Link>
                <Link to="/client/rooms" className="block hover:text-white transition-colors">Tìm phòng trọ</Link>
                <a href="#features" className="block hover:text-white transition-colors">Tính năng</a>
              </div>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-3 text-sm uppercase tracking-wider">Hỗ trợ</h3>
              <div className="space-y-2 text-sm">
                <Link to="/client/contact" className="block hover:text-white transition-colors">Liên hệ</Link>
                <a href="#" className="block hover:text-white transition-colors">Hướng dẫn</a>
                <a href="#" className="block hover:text-white transition-colors">FAQ</a>
              </div>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-3 text-sm uppercase tracking-wider">Liên hệ</h3>
              <div className="space-y-2.5 text-sm">
                <p className="flex items-center gap-2"><MapPin className="h-4 w-4 shrink-0 text-emerald-400" /> 123 Đường ABC, Q.1, TP.HCM</p>
                <p className="flex items-center gap-2"><Phone className="h-4 w-4 shrink-0 text-emerald-400" /> 0901.234.567</p>
                <p className="flex items-center gap-2"><Mail className="h-4 w-4 shrink-0 text-emerald-400" /> lienhe@phongtro.vn</p>
              </div>
            </div>
          </div>
          <p className="text-center text-xs text-slate-500 pt-6">© 2026 PhòngTrọ. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
