import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Header } from './Header'
import { cn } from '@/lib/utils'

export function AppLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="min-h-screen bg-muted/30">
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />
      <div
        className={cn(
          'transition-all duration-300',
          // Desktop margin for sidebar
          'lg:ml-[260px]',
          sidebarCollapsed && 'lg:ml-[70px]',
          // Mobile: no margin
          'ml-0'
        )}
      >
        <Header onMenuClick={() => setMobileOpen(true)} />
        <main className="p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
