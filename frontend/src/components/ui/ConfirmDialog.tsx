import { AlertTriangle, Trash2, X } from 'lucide-react'

interface ConfirmDialogProps {
  isOpen: boolean
  message: string
  onConfirm: () => void
  onCancel: () => void
  loading?: boolean
}

export default function ConfirmDialog({
  isOpen, message, onConfirm, onCancel, loading = false,
}: ConfirmDialogProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="absolute inset-0 bg-black/45 backdrop-blur-[2px]" onClick={onCancel} />

      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm animate-slide-up
                      border border-gray-100 overflow-hidden">
        {/* Top danger accent */}
        <div className="h-0.5 bg-gradient-to-r from-red-400 to-red-600" />

        <div className="p-7 text-center">
          <div className="mx-auto mb-4 flex items-center justify-center w-14 h-14
                          rounded-2xl bg-red-50 border border-red-100">
            <AlertTriangle className="w-7 h-7 text-red-500" />
          </div>
          <h3 className="text-base font-black text-gray-900 mb-1.5">¿Estás seguro?</h3>
          <p className="text-sm text-gray-500 leading-relaxed mb-6">{message}</p>

          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="btn-secondary flex-1 justify-center text-sm"
            >
              <X className="w-4 h-4" />
              Cancelar
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              className="btn-danger flex-1 justify-center text-sm"
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10"
                      stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Eliminando…
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4" />
                  Eliminar
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
