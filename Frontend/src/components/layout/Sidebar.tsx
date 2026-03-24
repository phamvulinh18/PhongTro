import { NavLink, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import {
  LayoutDashboard, Building2, DoorOpen, Users, FileText,
  Receipt, BarChart3, Bot, Settings, ChevronLeft, ChevronRight, X,
} from 'lucide-react'

const menuItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/properties', label: 'Nhà trọ', icon: Building2 },
  { path: '/rooms', label: 'Phòng', icon: DoorOpen },
  { path: '/tenants', label: 'Khách thuê', icon: Users },
  { path: '/contracts', label: 'Hợp đồng', icon: FileText },
  { path: '/invoices', label: 'Hóa đơn & Thanh toán', icon: Receipt },
  { path: '/reports', label: 'Thống kê & Báo cáo', icon: BarChart3 },
  { path: '/ai-assistant', label: 'Trợ lý AI', icon: Bot },
  { path: '/settings', label: 'Cài đặt', icon: Settings },
]

interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
  mobileOpen: boolean
  onMobileClose: () => void
}

export function Sidebar({ collapsed, onToggle, mobileOpen, onMobileClose }: SidebarProps) {
  const location = useLocation()

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onMobileClose}
        />
      )}

      <aside
        className={cn(
          'fixed left-0 top-0 z-50 h-screen border-r bg-sidebar-background transition-all duration-300 flex flex-col',
          // Desktop
          'hidden lg:flex',
          collapsed ? 'lg:w-[70px]' : 'lg:w-[260px]',
          // Mobile: show as overlay when mobileOpen
          mobileOpen && '!flex w-[280px]'
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between border-b px-4">
          <div className="flex items-center gap-3">
            <img src="https://tromoi.com/logo.png" alt="PhòngTrọ" className="h-9 w-9 shrink-0 rounded-lg object-contain" />
            {(!collapsed || mobileOpen) && (
              <div className="flex flex-col">
                <span className="text-sm font-bold text-sidebar-foreground">PhòngTrọ</span>
                <span className="text-[10px] text-muted-foreground">Quản lý thông minh</span>
              </div>
            )}
          </div>
          {/* Mobile close button */}
          {mobileOpen && (
            <Button variant="ghost" size="icon" className="lg:hidden h-8 w-8" onClick={onMobileClose}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Menu */}
        <ScrollArea className="flex-1 py-4">
          <nav className="flex flex-col gap-1 px-3">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path ||
                (item.path !== '/' && location.pathname.startsWith(item.path))
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onMobileClose}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
                    isActive
                      ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-sm'
                      : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                    collapsed && !mobileOpen && 'justify-center px-2'
                  )}
                  title={collapsed && !mobileOpen ? item.label : undefined}
                >
                  <item.icon className="h-5 w-5 shrink-0" />
                  {(!collapsed || mobileOpen) && <span>{item.label}</span>}
                </NavLink>
              )
            })}
          </nav>
        </ScrollArea>

        {/* Toggle (desktop only) */}
        <div className="border-t p-3 hidden lg:block">
          <Button variant="ghost" size="sm" className="w-full justify-center" onClick={onToggle}>
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>
      </aside>
    </>
  )
}
