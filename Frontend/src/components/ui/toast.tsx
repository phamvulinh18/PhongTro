import { useState, useEffect, createContext, useContext, useCallback } from 'react'
import { CheckCircle2, XCircle, AlertCircle, Info, X } from 'lucide-react'
import { cn } from '@/lib/utils'

type ToastType = 'success' | 'error' | 'warning' | 'info'

interface Toast {
  id: string
  type: ToastType
  title: string
  description?: string
  duration?: number
}

interface ToastContextValue {
  toast: (opts: Omit<Toast, 'id'>) => void
  success: (title: string, description?: string) => void
  error: (title: string, description?: string) => void
  warning: (title: string, description?: string) => void
  info: (title: string, description?: string) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

const ICONS = {
  success: CheckCircle2,
  error:   XCircle,
  warning: AlertCircle,
  info:    Info,
}

const STYLES = {
  success: 'border-green-200 bg-green-50 text-green-800',
  error:   'border-red-200 bg-red-50 text-red-800',
  warning: 'border-amber-200 bg-amber-50 text-amber-800',
  info:    'border-blue-200 bg-blue-50 text-blue-800',
}

const ICON_STYLES = {
  success: 'text-green-500',
  error:   'text-red-500',
  warning: 'text-amber-500',
  info:    'text-blue-500',
}

function ToastItem({ toast, onRemove }: { toast: Toast; onRemove: (id: string) => void }) {
  const [visible, setVisible] = useState(false)
  const Icon = ICONS[toast.type]

  useEffect(() => {
    // Animate in
    requestAnimationFrame(() => setVisible(true))
    const timer = setTimeout(() => {
      setVisible(false)
      setTimeout(() => onRemove(toast.id), 300)
    }, toast.duration ?? 4000)
    return () => clearTimeout(timer)
  }, [toast.id, toast.duration, onRemove])

  return (
    <div
      className={cn(
        'flex items-start gap-3 rounded-xl border p-4 shadow-lg pointer-events-auto max-w-sm w-full transition-all duration-300',
        STYLES[toast.type],
        visible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'
      )}
    >
      <Icon className={cn('h-5 w-5 shrink-0 mt-0.5', ICON_STYLES[toast.type])} />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold">{toast.title}</p>
        {toast.description && <p className="text-xs mt-0.5 opacity-80">{toast.description}</p>}
      </div>
      <button onClick={() => { setVisible(false); setTimeout(() => onRemove(toast.id), 300) }} className="opacity-60 hover:opacity-100 shrink-0">
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const remove = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  const add = useCallback((opts: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).slice(2)
    setToasts(prev => [...prev, { ...opts, id }])
  }, [])

  const ctx: ToastContextValue = {
    toast: add,
    success: (title, description) => add({ type: 'success', title, description }),
    error:   (title, description) => add({ type: 'error',   title, description }),
    warning: (title, description) => add({ type: 'warning', title, description }),
    info:    (title, description) => add({ type: 'info',    title, description }),
  }

  return (
    <ToastContext.Provider value={ctx}>
      {children}
      {/* Toast container */}
      <div className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-2 pointer-events-none">
        {toasts.map(t => <ToastItem key={t.id} toast={t} onRemove={remove} />)}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}
