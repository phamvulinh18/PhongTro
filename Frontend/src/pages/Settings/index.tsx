import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select } from '@/components/ui/select'

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Cài đặt</h1>
        <p className="text-muted-foreground">Quản lý thông tin và cấu hình hệ thống</p>
      </div>

      <Tabs defaultValue="profile">
        <TabsList>
          <TabsTrigger value="profile">Thông tin chủ trọ</TabsTrigger>
          <TabsTrigger value="payment">Cấu hình thanh toán</TabsTrigger>
          <TabsTrigger value="password">Đổi mật khẩu</TabsTrigger>
          <TabsTrigger value="notifications">Thông báo</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card><CardHeader><CardTitle>Thông tin chủ trọ</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2"><Label>Họ tên</Label><Input defaultValue="Nguyễn Văn Admin" /></div>
                <div className="grid gap-2"><Label>Số điện thoại</Label><Input defaultValue="0901234567" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2"><Label>Email</Label><Input defaultValue="admin@phongtro.vn" /></div>
                <div className="grid gap-2"><Label>Địa chỉ</Label><Input defaultValue="TP. Hồ Chí Minh" /></div>
              </div>
              <Separator />
              <h3 className="font-semibold">Thông tin ngân hàng</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="grid gap-2"><Label>Ngân hàng</Label><Input defaultValue="Vietcombank" /></div>
                <div className="grid gap-2"><Label>Số tài khoản</Label><Input defaultValue="1234567890" /></div>
                <div className="grid gap-2"><Label>Chủ tài khoản</Label><Input defaultValue="NGUYEN VAN ADMIN" /></div>
              </div>
              <Button>Lưu thay đổi</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payment">
          <Card><CardHeader><CardTitle>Cấu hình thanh toán</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2"><Label>Giá điện (VNĐ/kWh)</Label><Input type="number" defaultValue="5000" /></div>
                <div className="grid gap-2"><Label>Giá nước (VNĐ/m³)</Label><Input type="number" defaultValue="10000" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2"><Label>Phí Internet (VNĐ/tháng)</Label><Input type="number" defaultValue="100000" /></div>
                <div className="grid gap-2"><Label>Phí rác (VNĐ/tháng)</Label><Input type="number" defaultValue="30000" /></div>
              </div>
              <div className="grid gap-2 max-w-xs">
                <Label>Ngày hạn thanh toán mặc định</Label>
                <Select defaultValue="10">
                  {[5, 10, 15, 20, 25].map(d => <option key={d} value={String(d)}>Ngày {d} hàng tháng</option>)}
                </Select>
              </div>
              <Button>Lưu cấu hình</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="password">
          <Card><CardHeader><CardTitle>Đổi mật khẩu</CardTitle></CardHeader>
            <CardContent className="space-y-4 max-w-md">
              <div className="grid gap-2"><Label>Mật khẩu hiện tại</Label><Input type="password" /></div>
              <div className="grid gap-2"><Label>Mật khẩu mới</Label><Input type="password" /></div>
              <div className="grid gap-2"><Label>Xác nhận mật khẩu mới</Label><Input type="password" /></div>
              <Button>Cập nhật mật khẩu</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card><CardHeader><CardTitle>Cấu hình thông báo</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {['Hóa đơn quá hạn', 'Hợp đồng sắp hết hạn', 'Thanh toán mới', 'Khách thuê mới'].map((item) => (
                  <label key={item} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 cursor-pointer">
                    <input type="checkbox" defaultChecked className="h-4 w-4 rounded" />
                    <span className="text-sm">{item}</span>
                  </label>
                ))}
              </div>
              <Button>Lưu cài đặt</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
