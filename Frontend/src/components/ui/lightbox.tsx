import { useState, useEffect, useCallback } from 'react'
import { X, ChevronLeft, ChevronRight, Star, ZoomIn, ZoomOut } from 'lucide-react'
import { cn } from '@/lib/utils'

interface LightboxImage {
  id: number
  url: string
  is_main?: boolean
}

interface LightboxProps {
  images: LightboxImage[]
  initialIndex?: number
  open: boolean
  onClose: () => void
}

export function Lightbox({ images, initialIndex = 0, open, onClose }: LightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)
  const [zoomed, setZoomed] = useState(false)

  useEffect(() => {
    if (open) setCurrentIndex(initialIndex)
  }, [open, initialIndex])

  const goNext = useCallback(() => {
    setCurrentIndex(i => (i + 1) % images.length)
    setZoomed(false)
  }, [images.length])

  const goPrev = useCallback(() => {
    setCurrentIndex(i => (i - 1 + images.length) % images.length)
    setZoomed(false)
  }, [images.length])

  // Keyboard navigation
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') goNext()
      if (e.key === 'ArrowLeft') goPrev()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, onClose, goNext, goPrev])

  if (!open || images.length === 0) return null

  const current = images[currentIndex]

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center" onClick={onClose}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" />

      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 rounded-full bg-white/10 p-2 text-white hover:bg-white/20 transition-colors"
      >
        <X className="h-6 w-6" />
      </button>

      {/* Counter */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 text-white/80 text-sm font-medium bg-black/30 px-4 py-1.5 rounded-full">
        {currentIndex + 1} / {images.length}
        {current?.is_main && (
          <span className="ml-2 inline-flex items-center gap-1 text-amber-400">
            <Star className="h-3 w-3 fill-amber-400" /> Ảnh chính
          </span>
        )}
      </div>

      {/* Zoom toggle */}
      <button
        onClick={(e) => { e.stopPropagation(); setZoomed(!zoomed) }}
        className="absolute top-4 right-16 z-10 rounded-full bg-white/10 p-2 text-white hover:bg-white/20 transition-colors"
      >
        {zoomed ? <ZoomOut className="h-5 w-5" /> : <ZoomIn className="h-5 w-5" />}
      </button>

      {/* Previous button */}
      {images.length > 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); goPrev() }}
          className="absolute left-4 z-10 rounded-full bg-white/10 p-3 text-white hover:bg-white/20 transition-colors"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
      )}

      {/* Image */}
      <div
        className={cn(
          'relative z-[1] max-h-[85vh] max-w-[90vw] transition-transform duration-300',
          zoomed && 'max-h-none max-w-none cursor-zoom-out'
        )}
        onClick={(e) => { e.stopPropagation(); setZoomed(!zoomed) }}
      >
        <img
          src={current?.url}
          alt={`Ảnh ${currentIndex + 1}`}
          className={cn(
            'rounded-lg shadow-2xl transition-all duration-300 select-none',
            zoomed ? 'max-h-[95vh] max-w-[95vw] cursor-zoom-out' : 'max-h-[85vh] max-w-[90vw] cursor-zoom-in'
          )}
          draggable={false}
        />
      </div>

      {/* Next button */}
      {images.length > 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); goNext() }}
          className="absolute right-4 z-10 rounded-full bg-white/10 p-3 text-white hover:bg-white/20 transition-colors"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      )}

      {/* Thumbnail strip */}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-1.5 bg-black/40 p-1.5 rounded-xl max-w-[80vw] overflow-x-auto">
          {images.map((img, i) => (
            <button
              key={img.id}
              onClick={(e) => { e.stopPropagation(); setCurrentIndex(i); setZoomed(false) }}
              className={cn(
                'shrink-0 h-14 w-14 rounded-lg overflow-hidden border-2 transition-all',
                i === currentIndex ? 'border-white scale-105' : 'border-transparent opacity-50 hover:opacity-80'
              )}
            >
              <img src={img.url} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
