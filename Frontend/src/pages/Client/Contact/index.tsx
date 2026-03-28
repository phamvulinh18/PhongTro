import { useState } from 'react'
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2 } from 'lucide-react'
import { useToast } from '@/components/ui/toast'

export default function ClientContactPage() {
  const toast = useToast()
  const [form, setForm] = useState({ name: '', phone: '', email: '', message: '' })
  const [sent, setSent] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.phone || !form.message) {
      toast.error('Thiếu thông tin', 'Vui lòng điền đầy đủ họ tên, SĐT và nội dung.')
      return
    }
    // Simulate send
    setSent(true)
    toast.success('Đã gửi thành công!', 'Chúng tôi sẽ liên hệ lại sớm nhất.')
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-slate-900">Liên hệ với chúng tôi</h1>
        <p className="text-slate-500 mt-2">Bạn có câu hỏi hoặc cần tư vấn? Hãy liên hệ, chúng tôi luôn sẵn sàng hỗ trợ!</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">
        {/* Form */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
          {sent ? (
            <div className="text-center py-12">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-green-100 mb-4">
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 mb-2">Cảm ơn bạn!</h2>
              <p className="text-slate-500">Tin nhắn đã được gửi. Chúng tôi sẽ liên hệ lại trong thời gian sớm nhất.</p>
              <button onClick={() => { setSent(false); setForm({ name: '', phone: '', email: '', message: '' }) }} className="mt-4 text-blue-600 font-medium text-sm hover:underline">
                Gửi tin nhắn mới
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <h2 className="text-lg font-bold text-slate-900 mb-1">Gửi tin nhắn</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-1.5 block">Họ tên <span className="text-red-500">*</span></label>
                  <input
                    value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                    placeholder="Nguyễn Văn A"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-1.5 block">Số điện thoại <span className="text-red-500">*</span></label>
                  <input
                    value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
                    placeholder="09xx xxx xxx"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1.5 block">Email</label>
                <input
                  value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                  placeholder="email@example.com"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1.5 block">Nội dung <span className="text-red-500">*</span></label>
                <textarea
                  value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}
                  rows={5}
                  placeholder="Tôi muốn tìm phòng trọ ở quận 1, giá khoảng 3 triệu..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 resize-none"
                />
              </div>
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold py-3 rounded-xl hover:shadow-lg transition-all"
              >
                <Send className="h-4 w-4" /> Gửi tin nhắn
              </button>
            </form>
          )}
        </div>

        {/* Contact info */}
        <div className="space-y-5">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <h3 className="font-bold text-slate-900 text-lg mb-4">Thông tin liên hệ</h3>
            <div className="space-y-4">
              {[
                { icon: MapPin, color: 'text-red-500 bg-red-50', label: 'Địa chỉ', value: '123 Đường ABC, Q.1, TP.HCM' },
                { icon: Phone, color: 'text-green-500 bg-green-50', label: 'Hotline', value: '0901.234.567' },
                { icon: Mail, color: 'text-blue-500 bg-blue-50', label: 'Email', value: 'lienhe@phongtro.vn' },
                { icon: Clock, color: 'text-amber-500 bg-amber-50', label: 'Thời gian', value: '8:00 - 20:00, T2 - CN' },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${item.color}`}>
                    <item.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">{item.label}</p>
                    <p className="font-medium text-slate-800">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl overflow-hidden border border-slate-100 shadow-sm h-48 bg-slate-100">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.394!2d106.698!3d10.776!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTDCsDQ2JzM0LjAiTiAxMDbCsDQxJzUzLjAiRQ!5e0!3m2!1svi!2svn!4v1"
              className="w-full h-full border-0"
              loading="lazy"
              title="Bản đồ"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
