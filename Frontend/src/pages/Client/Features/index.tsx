import { Link } from 'react-router-dom'
import {
  Home, DoorOpen, Users, ClipboardList, Receipt, PieChart,
  MessageSquare, ArrowRight, Check, Leaf, Shield, Clock,
  Bell, FileText, BarChart3, Bot, Zap, Smartphone,
} from 'lucide-react'
import { cn } from '@/lib/utils'

/* ─── Detailed features ─── */
const FEATURES = [
  {
    icon: Home,
    title: 'Quản lý nhà trọ',
    desc: 'Quản lý toàn bộ thông tin nhà trọ: tên, địa chỉ, số phòng, hình ảnh. Hỗ trợ quản lý nhiều nhà trọ cùng lúc trên một tài khoản.',
    details: ['Thêm/sửa/xóa nhà trọ nhanh chóng', 'Upload nhiều ảnh cho mỗi nhà trọ', 'Quản lý nhà trọ không giới hạn', 'Thông tin chi tiết: địa chỉ, mô tả, tiện ích'],
    color: 'bg-emerald-500',
    mockup: 'dashboard',
  },
  {
    icon: DoorOpen,
    title: 'Quản lý phòng',
    desc: 'Theo dõi trạng thái từng phòng: trống, đang thuê, bảo trì. Quản lý giá thuê, diện tích, tầng và tiện nghi phòng.',
    details: ['Trạng thái phòng real-time', 'Bộ lọc nhanh theo trạng thái, giá', 'Thông tin diện tích, tầng, tiện nghi', 'Gắn khách thuê vào phòng'],
    color: 'bg-blue-500',
    mockup: 'rooms',
  },
  {
    icon: Users,
    title: 'Quản lý khách thuê',
    desc: 'Lưu trữ đầy đủ thông tin khách thuê: CCCD, liên hệ, liên hệ khẩn cấp. Liên kết khách thuê với phòng và hợp đồng.',
    details: ['Thông tin cá nhân đầy đủ', 'Quản lý CCCD/CMND', 'Liên hệ khẩn cấp', 'Lịch sử thuê phòng'],
    color: 'bg-violet-500',
    mockup: 'tenants',
  },
  {
    icon: ClipboardList,
    title: 'Quản lý hợp đồng',
    desc: 'Tạo và quản lý hợp đồng thuê phòng. Theo dõi thời hạn, nhắc nhở gia hạn trước khi hết hạn.',
    details: ['Tạo hợp đồng nhanh', 'Theo dõi ngày bắt đầu/kết thúc', 'Nhắc hợp đồng sắp hết hạn', 'Đặt cọc và điều khoản'],
    color: 'bg-amber-500',
    mockup: 'contracts',
  },
  {
    icon: Receipt,
    title: 'Hóa đơn & thanh toán',
    desc: 'Tạo hóa đơn tự động hoặc thủ công. Theo dõi thanh toán, quá hạn và công nợ từng khách thuê.',
    details: ['Tạo hóa đơn hàng loạt', 'Theo dõi trạng thái thanh toán', 'Nhắc nhở hóa đơn quá hạn', 'Quản lý công nợ chi tiết'],
    color: 'bg-rose-500',
    mockup: 'invoices',
  },
  {
    icon: PieChart,
    title: 'Thống kê & báo cáo',
    desc: 'Biểu đồ trực quan hiển thị doanh thu, tỷ lệ lấp đầy, so sánh theo tháng giúp ra quyết định nhanh chóng.',
    details: ['Biểu đồ doanh thu theo tháng', 'Tỷ lệ lấp đầy (occupancy rate)', 'So sánh hiệu suất các nhà trọ', 'Xuất báo cáo PDF/Excel'],
    color: 'bg-cyan-500',
    mockup: 'reports',
  },
  {
    icon: MessageSquare,
    title: 'Trợ lý AI',
    desc: 'Chat với AI thông minh để thao tác nhanh: tra cứu phòng trống, tạo hóa đơn, xem báo cáo chỉ bằng câu hỏi.',
    details: ['Chat bằng ngôn ngữ tự nhiên', 'Tra cứu dữ liệu nhanh', 'Gợi ý thao tác tự động', 'Hỗ trợ 24/7 không nghỉ'],
    color: 'bg-purple-500',
    mockup: 'ai',
  },
]

/* ─── Mockup components ─── */
function MockupDashboard() {
  return (
    <div className="bg-white rounded-xl shadow-sm border p-4 space-y-3">
      <div className="grid grid-cols-3 gap-2">
        {[{ l: 'Nhà trọ', v: '4', c: 'text-emerald-600 bg-emerald-50' }, { l: 'Phòng', v: '37', c: 'text-blue-600 bg-blue-50' }, { l: 'Trống', v: '6', c: 'text-amber-600 bg-amber-50' }].map((i, k) => (
          <div key={k} className={cn('rounded-lg p-3 text-center', i.c)}><div className="text-xl font-bold">{i.v}</div><div className="text-[10px] opacity-70">{i.l}</div></div>
        ))}
      </div>
      <div className="h-20 bg-slate-50 rounded-lg flex items-end p-2 gap-0.5">
        {[35, 55, 40, 70, 50, 65, 80, 55, 70, 85, 45, 90].map((h, i) => (
          <div key={i} className="flex-1 bg-emerald-400 rounded-t" style={{ height: `${h}%` }} />
        ))}
      </div>
    </div>
  )
}

function MockupRooms() {
  return (
    <div className="bg-white rounded-xl shadow-sm border p-4 space-y-2">
      {[{ r: 'A01', s: 'Đang thuê', c: 'bg-blue-100 text-blue-700', p: '3.5M' }, { r: 'A02', s: 'Trống', c: 'bg-emerald-100 text-emerald-700', p: '3.2M' }, { r: 'A03', s: 'Bảo trì', c: 'bg-amber-100 text-amber-700', p: '3.8M' }].map((r, i) => (
        <div key={i} className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg">
          <div className="flex items-center gap-2"><DoorOpen className="h-4 w-4 text-slate-400" /><span className="text-sm font-medium text-slate-700">{r.r}</span></div>
          <div className="flex items-center gap-2"><span className={cn('text-[10px] font-medium px-2 py-0.5 rounded-full', r.c)}>{r.s}</span><span className="text-xs text-slate-500">{r.p}</span></div>
        </div>
      ))}
    </div>
  )
}

function MockupChat() {
  return (
    <div className="bg-white rounded-xl shadow-sm border p-4 space-y-2.5">
      <div className="flex gap-2 items-start">
        <div className="h-6 w-6 rounded-full bg-purple-100 flex items-center justify-center shrink-0"><Bot className="h-3 w-3 text-purple-600" /></div>
        <div className="bg-slate-50 rounded-lg rounded-tl-none p-2.5 text-xs text-slate-600 flex-1">Xin chào! Tôi có thể giúp gì?</div>
      </div>
      <div className="flex gap-2 items-start justify-end">
        <div className="bg-emerald-500 text-white rounded-lg rounded-tr-none p-2.5 text-xs max-w-[70%]">Phòng nào đang trống?</div>
      </div>
      <div className="flex gap-2 items-start">
        <div className="h-6 w-6 rounded-full bg-purple-100 flex items-center justify-center shrink-0"><Bot className="h-3 w-3 text-purple-600" /></div>
        <div className="bg-slate-50 rounded-lg rounded-tl-none p-2.5 text-xs text-slate-600 flex-1">Hiện có 6 phòng trống: A02, B01, B03...</div>
      </div>
    </div>
  )
}

const MOCKUPS: Record<string, () => React.ReactNode> = {
  dashboard: MockupDashboard,
  rooms: MockupRooms,
  tenants: MockupRooms,
  contracts: MockupDashboard,
  invoices: MockupRooms,
  reports: MockupDashboard,
  ai: MockupChat,
}

export default function ClientFeaturesPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-emerald-600 text-white pt-28 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-white/15 rounded-full px-4 py-1.5 text-sm mb-5">
            <Zap className="h-4 w-4" /> Tính năng đầy đủ
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Mọi công cụ bạn cần</h1>
          <p className="text-emerald-100 text-lg max-w-xl mx-auto">Quản lý phòng trọ chuyên nghiệp với bộ tính năng toàn diện, tích hợp AI thông minh.</p>
        </div>
      </section>

      {/* Quick stats */}
      <section className="py-10 bg-white border-b">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[{ icon: Home, n: '7+', l: 'Tính năng chính' }, { icon: Shield, n: '100%', l: 'Bảo mật dữ liệu' }, { icon: Smartphone, n: '24/7', l: 'Truy cập mọi lúc' }, { icon: Bot, n: 'AI', l: 'Trợ lý thông minh' }].map((s, i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <div className="h-10 w-10 rounded-xl bg-emerald-50 flex items-center justify-center"><s.icon className="h-5 w-5 text-emerald-500" /></div>
                <div className="text-2xl font-bold text-slate-900">{s.n}</div>
                <div className="text-sm text-slate-500">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature sections */}
      {FEATURES.map((f, i) => {
        const Mockup = MOCKUPS[f.mockup]
        const even = i % 2 === 0
        return (
          <section key={i} className={cn('py-16', even ? 'bg-white' : 'bg-slate-50')}>
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
              <div className={cn('grid grid-cols-1 lg:grid-cols-2 gap-12 items-center', !even && 'lg:flex-row-reverse')}>
                {/* Text */}
                <div className={cn(!even && 'lg:order-2')}>
                  <div className={cn('h-12 w-12 rounded-xl flex items-center justify-center text-white mb-5', f.color)}>
                    <f.icon className="h-6 w-6" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">{f.title}</h2>
                  <p className="text-slate-500 text-lg leading-relaxed mb-6">{f.desc}</p>
                  <ul className="space-y-3">
                    {f.details.map((d, j) => (
                      <li key={j} className="flex items-start gap-3">
                        <div className="h-5 w-5 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="h-3 w-3 text-emerald-600" />
                        </div>
                        <span className="text-slate-600">{d}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                {/* Mockup */}
                <div className={cn(!even && 'lg:order-1')}>
                  <div className="bg-slate-100 rounded-2xl p-6 lg:p-8">
                    <Mockup />
                  </div>
                </div>
              </div>
            </div>
          </section>
        )
      })}

      {/* CTA */}
      <section className="py-16 bg-emerald-600 text-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Sẵn sàng trải nghiệm?</h2>
          <p className="text-emerald-100 mb-8">Đăng ký miễn phí và khám phá toàn bộ tính năng ngay hôm nay.</p>
          <Link to="/client/auth" className="inline-flex items-center gap-2 bg-white text-emerald-700 font-semibold px-8 py-3.5 rounded-xl hover:shadow-lg transition-all btn-press text-lg">
            Dùng thử miễn phí <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  )
}
