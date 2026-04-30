import { useEffect, type ReactNode } from 'react'
import { X } from 'lucide-react'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  subtitle?: string
  icon?: ReactNode
  children: ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

const sizeClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
}

export default function Modal({
  isOpen, onClose, title, subtitle, icon, children, size = 'lg',
}: ModalProps) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    if (isOpen) document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[3px]" onClick={onClose} />

      {/* Panel */}
      <div
        className={`relative bg-white rounded-3xl shadow-2xl shadow-blue-900/10 w-full
                    ${sizeClasses[size]} max-h-[92vh] flex flex-col
                    animate-slide-up border border-gray-100/60`}
      >
        {/* Barra de acento top */}
        <div className="h-[3px] rounded-t-3xl bg-gradient-to-r from-primary-700 via-accent-500 to-primary-500 flex-shrink-0" />

        {/* Header */}
        <div className="flex items-start justify-between px-8 py-6 flex-shrink-0">
          <div className="flex items-center gap-4">
            {icon && (
              <div className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0
                              bg-gradient-to-br from-primary-500 to-primary-700 shadow-md shadow-primary-500/25">
                <span className="text-white [&>svg]:w-5 [&>svg]:h-5">{icon}</span>
              </div>
            )}
            <div>
              <h2 className="text-lg font-black text-gray-900 leading-tight">{title}</h2>
              {subtitle && (
                <p className="text-xs text-gray-400 mt-0.5 font-medium">{subtitle}</p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100
                       transition-all duration-150 flex-shrink-0 ml-4"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Divider */}
        <div className="h-px bg-gray-100 mx-8 flex-shrink-0" />

        {/* Body */}
        <div className="overflow-y-auto flex-1 px-8 py-6">{children}</div>
      </div>
    </div>
  )
}
