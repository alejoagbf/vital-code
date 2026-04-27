import { ChevronLeft, ChevronRight } from 'lucide-react'

interface PaginationProps {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
}

export default function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null

  return (
    <div className="flex items-center justify-center gap-2 mt-2">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 0}
        className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-gray-200
                   text-sm font-semibold text-gray-600 bg-white shadow-sm
                   hover:bg-gray-50 hover:border-gray-300 disabled:opacity-35
                   disabled:cursor-not-allowed transition-all duration-200"
      >
        <ChevronLeft className="w-4 h-4" /> Anterior
      </button>

      <span className="px-4 py-2 rounded-xl bg-gradient-btn text-white text-sm
                       font-bold shadow-md min-w-[80px] text-center">
        {page + 1} / {totalPages}
      </span>

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page + 1 >= totalPages}
        className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-gray-200
                   text-sm font-semibold text-gray-600 bg-white shadow-sm
                   hover:bg-gray-50 hover:border-gray-300 disabled:opacity-35
                   disabled:cursor-not-allowed transition-all duration-200"
      >
        Siguiente <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  )
}
