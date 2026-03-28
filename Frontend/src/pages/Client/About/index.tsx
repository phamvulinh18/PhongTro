import { Link } from 'react-router-dom'
import {
  Leaf, Users, Target, Heart, Shield, Clock, ArrowRight,
  Award, Globe, Zap, CheckCircle, Star, TrendingUp,
  Building2, MessageSquare, BarChart3,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const MILESTONES = [
  { year: '2024', title: 'Ý tưởng', desc: 'Bắt đầu nghiên cứu và phát triển ý tưởng quản lý phòng trọ tích hợp AI.' },
  { year: '2025', title: 'Ra mắt v1.0', desc: 'Phiên bản đầu tiên với đầy đủ tính năng quản lý: phòng, khách thuê, hợp đồng.' },
  { year: '2026', title: 'Tích hợp AI', desc: 'Ra mắt trợ lý AI giúp tự động hóa quy trình quản lý phòng trọ.' },
]

const VALUES = [
  { icon: Target, title: 'Đơn giản', desc: 'Giao diện trực quan, dễ sử dụng ngay cả với người không rành công nghệ.' },
  { icon: Shield, title: 'Bảo mật', desc: 'Dữ liệu được mã hóa và bảo vệ an toàn tuyệt đối.' },
  { icon: Zap, title: 'Nhanh chóng', desc: 'Tốc độ xử lý nhanh, đáp ứng mọi thao tác tức thì.' },
  { icon: Heart, title: 'Tận tâm', desc: 'Đội ngũ hỗ trợ luôn sẵn sàng giúp đỡ mọi lúc mọi nơi.' },
]

const STATS = [
  { value: '500+', label: 'Phòng đang quản lý', icon: Building2 },
  { value: '50+', label: 'Nhà trọ sử dụng', icon: Globe },
  { value: '1,000+', label: 'Khách thuê hài lòng', icon: Users },
  { value: '99%', label: 'Uptime hệ thống', icon: TrendingUp },
]

const TEAM = [
  { name: 'Phạm Vũ Linh', role: 'Founder & CEO', initial: 'L', color: 'bg-emerald-500' },
  { name: 'AI Assistant', role: 'Trợ lý thông minh', initial: 'AI', color: 'bg-purple-500' },
  { name: 'Đội phát triển', role: 'Engineering Team', initial: 'D', color: 'bg-blue-500' },
]

export default function ClientAboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-emerald-600 text-white pt-28 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-white/15 rounded-full px-4 py-1.5 text-sm mb-5">
            <Leaf className="h-4 w-4" /> Về chúng tôi
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Câu chuyện PhòngTrọ</h1>
          <p className="text-emerald-100 text-lg max-w-2xl mx-auto leading-relaxed">
            Chúng tôi xây dựng PhòngTrọ với mục tiêu giúp chủ trọ Việt Nam quản lý hiệu quả hơn, tiết kiệm thời gian và tăng doanh thu nhờ công nghệ AI.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Sứ mệnh của chúng tôi</h2>
              <p className="text-slate-500 text-lg leading-relaxed mb-6">
                Quản lý phòng trọ không cần phải phức tạp. Chúng tôi tin rằng mọi chủ trọ, dù lớn hay nhỏ, đều xứng đáng có một công cụ quản lý chuyên nghiệp, dễ sử dụng và thông minh.
              </p>
              <p className="text-slate-500 leading-relaxed mb-6">
                PhòngTrọ được xây dựng để giải quyết những vấn đề thực tiễn mà chủ trọ gặp phải hàng ngày: quản lý phòng, khách thuê, hợp đồng, hóa đơn và doanh thu — tất cả trên một nền tảng duy nhất.
              </p>
              <div className="flex gap-4">
                <div className="flex items-center gap-2 text-sm text-emerald-600 font-medium">
                  <CheckCircle className="h-4 w-4" /> Miễn phí sử dụng
                </div>
                <div className="flex items-center gap-2 text-sm text-emerald-600 font-medium">
                  <CheckCircle className="h-4 w-4" /> Hỗ trợ 24/7
                </div>
                <div className="flex items-center gap-2 text-sm text-emerald-600 font-medium">
                  <CheckCircle className="h-4 w-4" /> Tích hợp AI
                </div>
              </div>
            </div>
            {/* Illustration */}
            <div className="bg-slate-50 rounded-2xl p-8">
              <div className="bg-white rounded-xl shadow-sm border p-5 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-emerald-500 flex items-center justify-center"><Leaf className="h-5 w-5 text-white" /></div>
                  <div>
                    <div className="text-sm font-bold text-slate-900">PhòngTrọ</div>
                    <div className="text-xs text-slate-400">Quản lý phòng trọ tích hợp AI</div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[{ l: 'Phòng', v: '37', c: 'bg-emerald-50 text-emerald-600' }, { l: 'Khách', v: '30', c: 'bg-blue-50 text-blue-600' }, { l: 'Doanh thu', v: '52M', c: 'bg-purple-50 text-purple-600' }].map((s, i) => (
                    <div key={i} className={cn('rounded-lg p-3 text-center', s.c)}>
                      <div className="text-lg font-bold">{s.v}</div>
                      <div className="text-[10px] opacity-70">{s.l}</div>
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-2 bg-emerald-50 rounded-lg p-3">
                  <MessageSquare className="h-4 w-4 text-emerald-500" />
                  <span className="text-xs text-emerald-700">"Phòng nào đang trống?" → AI: "Có 6 phòng trống..."</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-emerald-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {STATS.map((s, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 text-center hover-lift border border-emerald-100">
                <div className="h-10 w-10 rounded-xl bg-emerald-100 flex items-center justify-center mx-auto mb-3">
                  <s.icon className="h-5 w-5 text-emerald-600" />
                </div>
                <div className="text-3xl font-bold text-slate-900 mb-1">{s.value}</div>
                <div className="text-sm text-slate-500">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-3">Giá trị cốt lõi</h2>
            <p className="text-slate-500 max-w-lg mx-auto">Những nguyên tắc hướng dẫn mọi quyết định và sản phẩm của chúng tôi.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUES.map((v, i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-100 p-6 hover-lift text-center">
                <div className="h-12 w-12 rounded-xl bg-emerald-50 flex items-center justify-center mx-auto mb-4">
                  <v.icon className="h-6 w-6 text-emerald-500" />
                </div>
                <h3 className="font-bold text-slate-900 text-lg mb-2">{v.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-3">Hành trình phát triển</h2>
            <p className="text-slate-500">Từ ý tưởng đến sản phẩm, từng bước vững chắc.</p>
          </div>
          <div className="space-y-0">
            {MILESTONES.map((m, i) => (
              <div key={i} className="flex gap-6 items-start">
                <div className="flex flex-col items-center">
                  <div className="h-14 w-14 rounded-2xl bg-emerald-500 text-white flex items-center justify-center font-bold text-sm shrink-0">{m.year}</div>
                  {i < MILESTONES.length - 1 && <div className="w-0.5 h-12 bg-emerald-200 mt-2" />}
                </div>
                <div className="pt-2 pb-6">
                  <h3 className="font-bold text-slate-900 text-lg mb-1">{m.title}</h3>
                  <p className="text-slate-500">{m.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-3">Đội ngũ</h2>
            <p className="text-slate-500">Những người đứng sau sản phẩm.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {TEAM.map((t, i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-100 p-6 text-center hover-lift">
                <div className={cn('h-16 w-16 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4', t.color)}>
                  {t.initial}
                </div>
                <h3 className="font-bold text-slate-900">{t.name}</h3>
                <p className="text-sm text-slate-500">{t.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-emerald-600 text-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Cùng chúng tôi thay đổi cách quản lý phòng trọ</h2>
          <p className="text-emerald-100 mb-8">Đăng ký miễn phí và trải nghiệm ngay hôm nay.</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/client/auth" className="inline-flex items-center gap-2 bg-white text-emerald-700 font-semibold px-8 py-3.5 rounded-xl hover:shadow-lg transition-all btn-press text-lg">
              Bắt đầu ngay <ArrowRight className="h-5 w-5" />
            </Link>
            <Link to="/client/contact" className="inline-flex items-center gap-2 bg-white/15 border border-white/30 font-semibold px-8 py-3.5 rounded-xl hover:bg-white/25 transition-all btn-press text-lg">
              Liên hệ tư vấn
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
