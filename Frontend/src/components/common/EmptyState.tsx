import { InboxIcon } from 'lucide-react'
import { isValidElement, createElement } from 'react'

interface EmptyStateProps {
  title?: string
  description?: string
  icon?: React.ReactNode | React.ComponentType<any>
  actionLabel?: string
  onAction?: () => void
}

export function EmptyState({
  title = 'Không có dữ liệu',
  description = 'Chưa có dữ liệu nào được tìm thấy.',
  icon,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  const iconElement = icon
    ? (typeof icon === 'function' || (typeof icon === 'object' && !isValidElement(icon)))
      ? createElement(icon as React.ComponentType<any>, { className: 'h-12 w-12' })
      : icon
    : <InboxIcon className="h-12 w-12" />

  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="mb-4 text-muted-foreground">
        {iconElement}
      </div>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-sm text-muted-foreground mt-1 max-w-sm">{description}</p>
      {actionLabel && onAction && (
        <button onClick={onAction} className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
          {actionLabel}
        </button>
      )}
    </div>
  )
}
