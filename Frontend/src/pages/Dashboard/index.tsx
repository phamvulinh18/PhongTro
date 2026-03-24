import { useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { StatCard } from '@/components/common/StatCard'
import { api } from '@/lib/api'
import { formatCurrency } from '@/lib/utils'
import {
  Building2, DoorOpen, DoorClosed, Users, Receipt, TrendingUp,
  Plus, FileText, Calculator, UserPlus,
} from 'lucide-react'
import {
  PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer,
} from 'recharts'
import { useNavigate } from 'react-router-dom'

export default function DashboardPage() {
  const navigate = useNavigate()
  const { data, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: api.getDashboard,
  })

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <div className="h-7 w-40 rounded-md bg-muted animate-pulse" />
          <div className="h-4 w-56 rounded-md bg-muted animate-pulse mt-2" />
        </div>
        <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 xl:grid-cols-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-24 rounded-xl border bg-muted/40 animate-pulse" />
          ))}
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-72 rounded-xl border bg-muted/40 animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  const stats = data?.stats || {}
  const roomStatusChart = data?.roomStatusChart || []
  const recentUnpaid = data?.recentUnpaid || []
  const expiringContracts = data?.expiringContracts || []

  const quickActions = [
    { label: 'Thêm phòng', icon: Plus, onClick: () => navigate('/rooms') },
    { label: 'Tạo hóa đơn', icon: Calculator, onClick: () => navigate('/invoices') },
    { label: 'Thêm khách', icon: UserPlus, onClick: () => navigate('/tenants') },
    { label: 'Tạo hợp đồng', icon: FileText, onClick: () => navigate('/contracts') },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground text-sm">Tổng quan hệ thống quản lý phòng trọ</p>
      </div>

      {/* Stats */}
      <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 xl:grid-cols-6">
        <StatCard title="Nhà trọ" value={stats.totalProperties || 0} icon={Building2} color="bg-blue-100 text-blue-600" />
        <StatCard title="Tổng phòng" value={stats.totalRooms || 0} icon={DoorOpen} color="bg-indigo-100 text-indigo-600" />
        <StatCard title="Phòng trống" value={stats.availableRooms || 0} icon={DoorClosed} color="bg-green-100 text-green-600" />
        <StatCard title="Khách thuê" value={stats.totalTenants || 0} icon={Users} color="bg-purple-100 text-purple-600" />
        <StatCard title="Chưa thanh toán" value={stats.unpaidInvoices || 0} icon={Receipt} color="bg-red-100 text-red-600" />
        <StatCard title="Doanh thu" value={formatCurrency(stats.totalRevenue || 0)} icon={TrendingUp} color="bg-amber-100 text-amber-600" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Room Status Chart */}
        <Card className="flex flex-col">
          <CardHeader className="pb-0"><CardTitle className="text-sm font-semibold">Tình trạng phòng</CardTitle></CardHeader>
          <CardContent className="flex-1 flex items-center">
            <div className="w-full h-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={roomStatusChart} cx="50%" cy="45%" innerRadius={52} outerRadius={82} paddingAngle={4} dataKey="value">
                    {roomStatusChart.map((e: any, i: number) => <Cell key={i} fill={e.color} />)}
                  </Pie>
                  <Legend iconSize={8} wrapperStyle={{ fontSize: '12px' }} />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="flex flex-col">
          <CardHeader className="pb-0"><CardTitle className="text-sm font-semibold">Thao tác nhanh</CardTitle></CardHeader>
          <CardContent className="flex-1 grid grid-cols-2 gap-3 pt-4">
            {quickActions.map((action) => (
              <Button key={action.label} variant="outline" className="h-full min-h-[100px] flex-col gap-2 rounded-xl border-dashed hover:border-primary hover:bg-primary/5 transition-colors" onClick={action.onClick}>
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                  <action.icon className="h-5 w-5 text-primary" />
                </div>
                <span className="text-xs font-medium">{action.label}</span>
              </Button>
            ))}
          </CardContent>
        </Card>

        {/* Occupancy */}
        <Card className="flex flex-col">
          <CardHeader className="pb-0"><CardTitle className="text-sm font-semibold">Tỷ lệ lấp đầy</CardTitle></CardHeader>
          <CardContent className="flex-1 flex flex-col items-center justify-center gap-3">
            <div className="relative flex h-36 w-36 items-center justify-center">
              <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="hsl(var(--muted))" strokeWidth="2.5" />
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="hsl(var(--primary))" strokeWidth="2.5"
                  strokeDasharray={`${stats.occupancyRate || 0}, 100`}
                  strokeLinecap="round" />
              </svg>
              <div className="absolute text-center">
                <div className="text-3xl font-bold text-primary">{stats.occupancyRate || 0}%</div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">{stats.occupiedRooms || 0}/{stats.totalRooms || 0} phòng đang thuê</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Unpaid Invoices */}
        <Card>
          <CardHeader><CardTitle className="text-base">Hóa đơn chưa thanh toán</CardTitle></CardHeader>
          <CardContent>
            {recentUnpaid.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">Không có hóa đơn chưa thanh toán</p>
            ) : (
              <div className="space-y-3">
                {recentUnpaid.map((inv: any) => (
                  <div key={inv.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div>
                      <p className="font-medium text-sm">{inv.room} - {inv.property}</p>
                      <p className="text-xs text-muted-foreground">{inv.tenant} • Hạn: {inv.due_date}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-sm text-destructive">{formatCurrency(inv.total)}</p>
                      <Badge variant={inv.status === 'overdue' ? 'destructive' : 'secondary'} className="text-[10px]">
                        {inv.status === 'overdue' ? 'Quá hạn' : 'Chưa thanh toán'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Expiring Contracts */}
        <Card>
          <CardHeader><CardTitle className="text-base">Hợp đồng sắp hết hạn</CardTitle></CardHeader>
          <CardContent>
            {expiringContracts.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">Không có hợp đồng sắp hết hạn</p>
            ) : (
              <div className="space-y-3">
                {expiringContracts.map((c: any) => (
                  <div key={c.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div>
                      <p className="font-medium text-sm">{c.room} - {c.property}</p>
                      <p className="text-xs text-muted-foreground">{c.tenant}</p>
                    </div>
                    <Badge variant="warning" className="text-xs">Hết hạn: {c.end_date}</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
