import type { LucideIcon } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface StatCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  description?: string
  trend?: { value: number; label: string }
  className?: string
  color?: string
}

export function StatCard({ title, value, icon: Icon, description, trend, className, color = 'bg-primary/10 text-primary' }: StatCardProps) {
  const len = String(value).length
  const valueCls = len > 11 ? 'text-sm' : len > 7 ? 'text-lg' : 'text-2xl'
  return (
    <Card className={cn('hover:shadow-md transition-shadow', className)}>
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-muted-foreground truncate">{title}</p>
            <p className={`font-bold mt-1 leading-tight ${valueCls}`}>{value}</p>
            {description && (
              <p className="text-xs text-muted-foreground mt-0.5 truncate">{description}</p>
            )}
            {trend && (
              <p className={cn(
                'text-xs font-medium flex items-center gap-1 mt-1',
                trend.value >= 0 ? 'text-emerald-600' : 'text-red-600'
              )}>
                {trend.value >= 0 ? '↑' : '↓'} {Math.abs(trend.value)}% {trend.label}
              </p>
            )}
          </div>
          <div className={cn('flex h-11 w-11 shrink-0 items-center justify-center rounded-xl', color)}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
