import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Building2, Eye, EyeOff, Loader2 } from 'lucide-react'

const loginSchema = z.object({
  email: z.string().email('Email không hợp lệ'),
  password: z.string().min(6, 'Mật khẩu tối thiểu 6 ký tự'),
})

type LoginForm = z.infer<typeof loginSchema>

export default function LoginPage() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  const onSubmit = async (_data: LoginForm) => {
    setIsLoading(true)
    // Mock login delay
    await new Promise((resolve) => setTimeout(resolve, 1200))
    setIsLoading(false)
    navigate('/')
  }

  return (
    <div className="min-h-screen flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800">
        {/* Decorative elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/3 w-48 h-48 bg-indigo-300/10 rounded-full blur-2xl" />
        </div>

        <div className="relative z-10 flex flex-col justify-center px-16 text-white">
          <div className="flex items-center gap-4 mb-8">
            <img src="https://tromoi.com/logo.png" alt="PhòngTrọ" className="h-14 w-14 rounded-2xl object-contain" />
            <div>
              <h1 className="text-3xl font-bold">PhòngTrọ</h1>
              <p className="text-blue-200 text-sm">Quản lý thông minh</p>
            </div>
          </div>

          <h2 className="text-4xl font-bold leading-tight mb-6">
            Hệ thống quản lý<br />
            phòng trọ tích hợp
            <span className="bg-gradient-to-r from-blue-200 to-cyan-200 bg-clip-text text-transparent"> AI</span>
          </h2>

          <p className="text-blue-100/80 text-lg leading-relaxed max-w-md">
            Quản lý nhà trọ, phòng, khách thuê, hợp đồng và hóa đơn
            một cách thông minh với sự hỗ trợ của trí tuệ nhân tạo.
          </p>

          <div className="mt-12 grid grid-cols-3 gap-6">
            {[
              { value: '500+', label: 'Chủ trọ tin dùng' },
              { value: '10K+', label: 'Phòng được quản lý' },
              { value: '99.9%', label: 'Uptime hệ thống' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-blue-200/70 text-xs mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-muted/30">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <img src="https://tromoi.com/logo.png" alt="PhòngTrọ" className="h-11 w-11 rounded-xl object-contain" />
            <div>
              <h1 className="text-xl font-bold">PhòngTrọ</h1>
              <p className="text-xs text-muted-foreground">Quản lý thông minh</p>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold tracking-tight">Đăng nhập</h2>
            <p className="text-muted-foreground mt-2">
              Chào mừng bạn trở lại! Đăng nhập để quản lý phòng trọ.
            </p>
          </div>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@phongtro.vn"
                    {...register('email')}
                    className={errors.email ? 'border-destructive' : ''}
                  />
                  {errors.email && (
                    <p className="text-xs text-destructive">{errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Mật khẩu</Label>
                    <button
                      type="button"
                      className="text-xs text-primary hover:underline cursor-pointer"
                    >
                      Quên mật khẩu?
                    </button>
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      {...register('password')}
                      className={errors.password ? 'border-destructive pr-10' : 'pr-10'}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-xs text-destructive">{errors.password.message}</p>
                  )}
                </div>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="h-4 w-4 rounded border-input" />
                  <span className="text-sm text-muted-foreground">Ghi nhớ đăng nhập</span>
                </label>

                <Button type="submit" className="w-full h-11 text-base" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Đang đăng nhập...
                    </>
                  ) : (
                    'Đăng nhập'
                  )}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground">
                  Demo: nhập bất kỳ email & mật khẩu (≥6 ký tự) để vào hệ thống
                </p>
              </div>
            </CardContent>
          </Card>

          <p className="text-xs text-center text-muted-foreground mt-6">
            © 2025 PhòngTrọ. Hệ thống quản lý phòng trọ tích hợp AI.
          </p>
        </div>
      </div>
    </div>
  )
}
