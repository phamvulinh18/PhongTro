import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select } from '@/components/ui/select'
import { mockMonthlyRevenue, mockProperties, mockRoomStatusChart } from '@/mock/data'
import { formatCurrency } from '@/lib/utils'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, LineChart, Line, AreaChart, Area
} from 'recharts'

const debtData = [
  { name: 'Nhà trọ Sunrise', debt: 500000 },
  { name: 'Nhà trọ Moonlight', debt: 200000 },
  { name: 'Nhà trọ Star', debt: 1000000 },
  { name: 'Nhà trọ Garden', debt: 0 },
  { name: 'Nhà trọ Lotus', debt: 0 },
]

export default function ReportsPage() {
  const [timeRange, setTimeRange] = useState('year')

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Thống kê & Báo cáo</h1>
          <p className="text-muted-foreground">Phân tích dữ liệu kinh doanh</p>
        </div>
        <div className="flex gap-3">
          <Select value={timeRange} onValueChange={setTimeRange} className="w-[150px]">
            <option value="month">Tháng này</option>
            <option value="quarter">Quý này</option>
            <option value="year">Năm nay</option>
          </Select>
          <Select className="w-[180px]">
            <option value="all">Tất cả nhà trọ</option>
            {mockProperties.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </Select>
        </div>
      </div>

      {/* Revenue Chart */}
      <Card>
        <CardHeader><CardTitle className="text-base">Biểu đồ doanh thu</CardTitle></CardHeader>
        <CardContent>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockMonthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(v) => `${(v / 1000000).toFixed(0)}tr`} />
                <Tooltip formatter={(v: number) => formatCurrency(v)} />
                <Area type="monotone" dataKey="revenue" stroke="hsl(220,70%,50%)" fill="hsl(220,70%,50%)" fillOpacity={0.1} name="Doanh thu" />
                <Area type="monotone" dataKey="expenses" stroke="hsl(0,84%,60%)" fill="hsl(0,84%,60%)" fillOpacity={0.1} name="Chi phí" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Room Stats */}
        <Card>
          <CardHeader><CardTitle className="text-base">Tình trạng phòng</CardTitle></CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={mockRoomStatusChart} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value">
                    {mockRoomStatusChart.map((e, i) => <Cell key={i} fill={e.color} />)}
                  </Pie>
                  <Legend /><Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Debt Report */}
        <Card>
          <CardHeader><CardTitle className="text-base">Báo cáo công nợ theo nhà trọ</CardTitle></CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={debtData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis type="number" tickFormatter={(v) => `${(v / 1000000).toFixed(1)}tr`} />
                  <YAxis type="category" dataKey="name" width={120} className="text-xs" />
                  <Tooltip formatter={(v: number) => formatCurrency(v)} />
                  <Bar dataKey="debt" fill="hsl(0,84%,60%)" radius={[0, 4, 4, 0]} name="Công nợ" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card><CardContent className="p-6 text-center">
          <p className="text-3xl font-bold text-primary">65</p>
          <p className="text-sm text-muted-foreground mt-1">Tổng số phòng</p>
        </CardContent></Card>
        <Card><CardContent className="p-6 text-center">
          <p className="text-3xl font-bold text-emerald-600">52</p>
          <p className="text-sm text-muted-foreground mt-1">Đang cho thuê</p>
        </CardContent></Card>
        <Card><CardContent className="p-6 text-center">
          <p className="text-3xl font-bold text-amber-600">13</p>
          <p className="text-sm text-muted-foreground mt-1">Phòng trống</p>
        </CardContent></Card>
        <Card><CardContent className="p-6 text-center">
          <p className="text-3xl font-bold text-red-600">80%</p>
          <p className="text-sm text-muted-foreground mt-1">Tỷ lệ lấp đầy</p>
        </CardContent></Card>
      </div>
    </div>
  )
}
