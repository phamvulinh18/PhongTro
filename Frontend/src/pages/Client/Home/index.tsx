import { Link } from 'react-router-dom'
import {
  Building2, DoorOpen, Users, FileText, Receipt, BarChart3,
  Bot, Shield, Eye, Zap, ArrowRight, Check, ChevronRight,
  Leaf, Home, UserCheck, ClipboardList, CreditCard, PieChart, MessageSquare,
} from 'lucide-react'
import { cn } from '@/lib/utils'

/* ─── Data ─── */
const WHY_ITEMS = [
  { icon: Building2, title: 'Quản lý nhiều nhà trọ', desc: 'Tập trung quản lý tất cả nhà trọ trên một nền tảng duy nhất, không giới hạn số lượng.' },
  { icon: Eye, title: 'Theo dõi phòng trực quan', desc: 'Xem nhanh tình trạng phòng trống, đang thuê với giao diện trực quan sinh động.' },
  { icon: UserCheck, title: 'Khách thuê & hợp đồng rõ ràng', desc: 'Quản lý thông tin khách thuê, hợp đồng chi tiết, nhắc hạn tự động.' },
  { icon: CreditCard, title: 'Hóa đơn & thanh toán minh bạch', desc: 'Tạo hóa đơn nhanh, theo dõi công nợ, thanh toán minh bạch từng kỳ.' },
  { icon: BarChart3, title: 'Báo cáo doanh thu nhanh', desc: 'Thống kê doanh thu, chi phí, occupancy rate theo thời gian thực.' },
  { icon: Bot, title: 'Trợ lý AI hỗ trợ', desc: 'Chat với AI để thao tác nhanh: thêm phòng, tạo hóa đơn, tra cứu dữ liệu.' },
]

const FEATURES = [
  { icon: Home, label: 'Quản lý nhà trọ', desc: 'Thêm, sửa, xóa nhà trọ. Upload ảnh, quản lý thông tin chi tiết.' },
  { icon: DoorOpen, label: 'Quản lý phòng', desc: 'Theo dõi trạng thái phòng, giá thuê, diện tích, tầng, tiện nghi.' },
  { icon: Users, label: 'Quản lý khách thuê', desc: 'Lưu trữ thông tin cá nhân, CCCD, liên hệ khẩn cấp.' },
  { icon: ClipboardList, label: 'Quản lý hợp đồng', desc: 'Tạo hợp đồng, theo dõi thời hạn, gia hạn tự động.' },
  { icon: Receipt, label: 'Hóa đơn & thanh toán', desc: 'Tạo hóa đơn hàng loạt, ghi nhận thanh toán, nhắc nợ.' },
  { icon: PieChart, label: 'Thống kê & báo cáo', desc: 'Biểu đồ doanh thu, occupancy, so sánh theo tháng.' },
  { icon: MessageSquare, label: 'Trợ lý AI', desc: 'Hỗ trợ thao tác bằng ngôn ngữ tự nhiên, tra cứu nhanh.' },
]

const STEPS = [
  { step: '01', title: 'Tạo nhà trọ & phòng', desc: 'Thêm thông tin nhà trọ, tạo danh sách phòng, upload ảnh.' },
  { step: '02', title: 'Thêm khách thuê & hợp đồng', desc: 'Ghi nhận thông tin khách, tạo hợp đồng ràng buộc.' },
  { step: '03', title: 'Theo dõi & báo cáo', desc: 'Quản lý hóa đơn, thanh toán, xem báo cáo doanh thu.' },
]

export default function ClientHomePage() {
  return (
    <div>
      {/* ═══ SECTION 1: HERO ═══ */}
      <section className="relative bg-emerald-600 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 rounded-full bg-white/20" />
          <div className="absolute bottom-10 right-20 w-96 h-96 rounded-full bg-white/10" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-32 pb-20 md:pt-36 md:pb-28">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left text */}
            <div className="animate-slide-up">
              <div className="inline-flex items-center gap-2 bg-white/15 rounded-full px-4 py-1.5 text-sm mb-6">
                <Leaf className="h-4 w-4" />
                <span>Hệ thống quản lý phòng trọ tích hợp AI</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-5">
                Quản lý phòng trọ<br />
                đơn giản, thông minh<br />
                <span className="text-emerald-200">và hiệu quả hơn</span>
              </h1>
              <p className="text-emerald-100 text-lg leading-relaxed mb-8 max-w-lg">
                Quản lý nhà trọ, phòng, khách thuê, hợp đồng, hóa đơn, thanh toán và báo cáo trên một nền tảng duy nhất.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link to="/client/auth" className="inline-flex items-center gap-2 bg-white text-emerald-700 font-semibold px-6 py-3 rounded-xl hover:shadow-lg transition-all btn-press">
                  Dùng thử ngay <ArrowRight className="h-4 w-4" />
                </Link>
                <a href="#demo" className="inline-flex items-center gap-2 bg-white/15 border border-white/30 font-semibold px-6 py-3 rounded-xl hover:bg-white/25 transition-all btn-press">
                  Xem demo
                </a>
              </div>

              <div className="flex gap-8 mt-10 text-sm">
                {[{ n: '500+', l: 'Phòng quản lý' }, { n: '50+', l: 'Nhà trọ' }, { n: '99%', l: 'Hài lòng' }].map((s, i) => (
                  <div key={i}>
                    <div className="text-2xl font-bold">{s.n}</div>
                    <div className="text-emerald-200">{s.l}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — Dashboard mockup */}
            <div className="hidden lg:block animate-slide-up delay-200">
              <div className="bg-white rounded-2xl shadow-2xl p-5 transform rotate-1 hover:rotate-0 transition-transform duration-500">
                {/* Fake browser bar */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-amber-400" />
                    <div className="w-3 h-3 rounded-full bg-emerald-400" />
                  </div>
                  <div className="flex-1 bg-slate-100 rounded-lg h-7 flex items-center px-3">
                    <span className="text-xs text-slate-400">phongtro.vn/dashboard</span>
                  </div>
                </div>
                {/* Fake dashboard content */}
                <div className="space-y-3">
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { label: 'Nhà trọ', val: '4', color: 'bg-emerald-50 text-emerald-600' },
                      { label: 'Phòng', val: '37', color: 'bg-blue-50 text-blue-600' },
                      { label: 'Trống', val: '6', color: 'bg-amber-50 text-amber-600' },
                      { label: 'Doanh thu', val: '52M', color: 'bg-purple-50 text-purple-600' },
                    ].map((c, i) => (
                      <div key={i} className={cn('rounded-lg p-2.5 text-center', c.color)}>
                        <div className="text-lg font-bold">{c.val}</div>
                        <div className="text-[10px] opacity-70">{c.label}</div>
                      </div>
                    ))}
                  </div>
                  <div className="h-24 bg-slate-50 rounded-lg flex items-end p-3 gap-1">
                    {[40, 65, 45, 80, 55, 70, 90, 60, 75, 85, 50, 95].map((h, i) => (
                      <div key={i} className="flex-1 bg-emerald-400 rounded-t" style={{ height: `${h}%` }} />
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-slate-50 rounded-lg p-2.5">
                      <div className="text-[10px] text-slate-400 mb-1">Phòng trống</div>
                      <div className="flex gap-1">{[1,2,3].map(i => <div key={i} className="h-2 flex-1 rounded-full bg-emerald-300" />)}<div className="h-2 flex-1 rounded-full bg-slate-200" /></div>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-2.5">
                      <div className="text-[10px] text-slate-400 mb-1">Hóa đơn</div>
                      <div className="flex gap-1">{[1,2].map(i => <div key={i} className="h-2 flex-1 rounded-full bg-blue-300" />)}<div className="h-2 flex-1 rounded-full bg-amber-300" /></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ SECTION 2: WHY CHOOSE ═══ */}
      <section id="about" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14 animate-fade-in">
            <h2 className="text-3xl font-bold text-slate-900 mb-3">Vì sao nên chọn hệ thống này?</h2>
            <p className="text-slate-500 max-w-xl mx-auto">Giải pháp toàn diện giúp chủ trọ quản lý hiệu quả, tiết kiệm thời gian và tăng doanh thu.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {WHY_ITEMS.map((item, i) => (
              <div key={i} className={cn('bg-white rounded-2xl border border-slate-100 p-7 hover-lift animate-slide-up', `delay-${(i + 1) * 100}`)}>
                <div className="h-12 w-12 rounded-xl bg-emerald-50 flex items-center justify-center mb-4">
                  <item.icon className="h-6 w-6 text-emerald-500" />
                </div>
                <h3 className="font-bold text-slate-900 text-lg mb-2">{item.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ SECTION 3: FEATURES ═══ */}
      <section id="features" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-slate-900 mb-3">Tính năng nổi bật</h2>
            <p className="text-slate-500 max-w-xl mx-auto">Tất cả công cụ bạn cần để quản lý phòng trọ chuyên nghiệp</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {FEATURES.map((f, i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-100 p-6 hover-lift group">
                <div className="h-11 w-11 rounded-xl bg-emerald-50 flex items-center justify-center mb-4 group-hover:bg-emerald-500 transition-colors">
                  <f.icon className="h-5 w-5 text-emerald-500 group-hover:text-white transition-colors" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-1.5">{f.label}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ SECTION 4: PROCESS ═══ */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-slate-900 mb-3">Bắt đầu chỉ với 3 bước</h2>
            <p className="text-slate-500">Quy trình đơn giản, hiệu quả ngay từ phút đầu tiên</p>
          </div>
          <div className="space-y-0">
            {STEPS.map((s, i) => (
              <div key={i} className="flex gap-6 items-start group">
                {/* Step indicator */}
                <div className="flex flex-col items-center">
                  <div className="h-14 w-14 rounded-2xl bg-emerald-500 text-white flex items-center justify-center font-bold text-lg shrink-0 group-hover:shadow-lg transition-shadow">
                    {s.step}
                  </div>
                  {i < STEPS.length - 1 && <div className="w-0.5 h-16 bg-emerald-200 mt-2" />}
                </div>
                {/* Content */}
                <div className="pt-2 pb-8">
                  <h3 className="font-bold text-slate-900 text-lg mb-1">{s.title}</h3>
                  <p className="text-slate-500">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ SECTION 5: DEMO PREVIEW ═══ */}
      <section id="demo" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-slate-900 mb-3">Xem trước giao diện</h2>
            <p className="text-slate-500">Thiết kế hiện đại, trực quan, dễ sử dụng</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { title: 'Dashboard', desc: 'Tổng quan doanh thu, phòng, khách thuê', color: 'bg-emerald-500', icon: BarChart3 },
              { title: 'Quản lý phòng', desc: 'Danh sách phòng, trạng thái, bộ lọc nhanh', color: 'bg-blue-500', icon: DoorOpen },
              { title: 'Hóa đơn', desc: 'Tạo hóa đơn, theo dõi thanh toán', color: 'bg-amber-500', icon: Receipt },
              { title: 'AI Assistant', desc: 'Chat AI hỗ trợ thao tác nhanh', color: 'bg-purple-500', icon: Bot },
            ].map((demo, i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-100 overflow-hidden hover-lift">
                <div className={cn('h-44 flex items-center justify-center', demo.color)}>
                  <demo.icon className="h-16 w-16 text-white/80" />
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-slate-900 mb-1">{demo.title}</h3>
                  <p className="text-sm text-slate-500">{demo.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ SECTION 6: CTA ═══ */}
      <section className="py-20 bg-emerald-600 text-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Bắt đầu quản lý nhà trọ hiệu quả hơn ngay hôm nay</h2>
          <p className="text-emerald-100 text-lg mb-8 max-w-lg mx-auto">Đăng ký miễn phí, không cần thẻ tín dụng. Trải nghiệm đầy đủ tính năng trong 30 ngày.</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/client/auth" className="inline-flex items-center gap-2 bg-white text-emerald-700 font-semibold px-8 py-3.5 rounded-xl hover:shadow-lg transition-all btn-press text-lg">
              Đăng ký miễn phí <ArrowRight className="h-5 w-5" />
            </Link>
            <Link to="/client/contact" className="inline-flex items-center gap-2 bg-white/15 border border-white/30 font-semibold px-8 py-3.5 rounded-xl hover:bg-white/25 transition-all btn-press text-lg">
              Liên hệ tư vấn
            </Link>
          </div>
          <div className="flex items-center justify-center gap-6 mt-8 text-sm text-emerald-200">
            {['Miễn phí 30 ngày', 'Không cần thẻ tín dụng', 'Hỗ trợ 24/7'].map((t, i) => (
              <span key={i} className="flex items-center gap-1.5"><Check className="h-4 w-4" />{t}</span>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
