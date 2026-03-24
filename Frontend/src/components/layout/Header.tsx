import { useState } from 'react'
import { Search, Bell, ChevronDown, LogOut, User, Settings, Menu } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Select } from '@/components/ui/select'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { mockProperties, mockNotifications } from '@/mock/data'

interface HeaderProps {
  onMenuClick: () => void
}

export function Header({ onMenuClick }: HeaderProps) {
  const [selectedProperty, setSelectedProperty] = useState('all')
  const unreadCount = mockNotifications.filter((n) => !n.read).length

  return (
    <header className="sticky top-0 z-30 flex h-14 lg:h-16 items-center gap-3 lg:gap-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 lg:px-6">
      {/* Mobile menu button */}
      <Button variant="ghost" size="icon" className="lg:hidden shrink-0" onClick={onMenuClick}>
        <Menu className="h-5 w-5" />
      </Button>

      {/* Search */}
      <div className="relative flex-1 max-w-md hidden sm:block">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Tìm kiếm phòng, khách thuê..."
          className="pl-9 bg-muted/50 border-0 focus-visible:ring-1"
        />
      </div>

      <div className="flex items-center gap-2 lg:gap-3 ml-auto">
        {/* Property Selector - hidden on small mobile */}
        <Select
          value={selectedProperty}
          onValueChange={setSelectedProperty}
          className="w-[140px] lg:w-[200px] bg-muted/50 border-0 text-xs lg:text-sm hidden sm:flex"
        >
          <option value="all">Tất cả nhà trọ</option>
          {mockProperties.map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </Select>

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative h-9 w-9">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
                  {unreadCount}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-72 sm:w-80">
            <DropdownMenuLabel>Thông báo</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {mockNotifications.slice(0, 4).map((notif) => (
              <DropdownMenuItem key={notif.id} className="flex flex-col items-start gap-1 p-3">
                <div className="flex items-center gap-2">
                  {!notif.read && <span className="h-2 w-2 rounded-full bg-primary" />}
                  <span className="font-medium text-sm">{notif.title}</span>
                </div>
                <span className="text-xs text-muted-foreground">{notif.message}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 px-2 h-9">
              <Avatar className="h-7 w-7 lg:h-8 lg:w-8">
                <AvatarFallback className="bg-primary text-primary-foreground text-xs">AD</AvatarFallback>
              </Avatar>
              <div className="hidden md:flex flex-col items-start">
                <span className="text-sm font-medium">Admin</span>
                <span className="text-[10px] text-muted-foreground">Chủ trọ</span>
              </div>
              <ChevronDown className="h-4 w-4 text-muted-foreground hidden md:block" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Tài khoản</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem><User className="mr-2 h-4 w-4" />Thông tin cá nhân</DropdownMenuItem>
            <DropdownMenuItem><Settings className="mr-2 h-4 w-4" />Cài đặt</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive"><LogOut className="mr-2 h-4 w-4" />Đăng xuất</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
