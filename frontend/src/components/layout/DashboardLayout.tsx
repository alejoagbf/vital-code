import { type ReactNode } from 'react'
import Sidebar from './Sidebar'
import { Bell, Activity } from 'lucide-react'

interface Props {
  title: string
  subtitle?: string
  children: ReactNode
}

export default function DashboardLayout({ title, subtitle, children }: Props) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />

      <main className="flex-1 flex flex-col overflow-hidden min-w-0">

        {/* ── Top Header ───────────────────────────────────────────────────── */}
        <header className="bg-white border-b border-gray-100 px-8 py-4
                           flex items-center justify-between shadow-sm flex-shrink-0">
          <div>
            <h1 className="text-xl font-black text-gray-900 leading-none">{title}</h1>
            {subtitle && (
              <p className="text-xs text-gray-400 mt-0.5 font-medium">{subtitle}</p>
            )}
          </div>

          <div className="flex items-center gap-3">
            {/* System status */}
            <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold
                             text-emerald-700 bg-emerald-50 border border-emerald-200/70
                             px-3 py-1.5 rounded-full">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              Sistema activo
            </span>

            {/* Notification bell */}
            <button className="relative p-2 rounded-xl text-gray-400 hover:text-gray-600
                               hover:bg-gray-100 transition-all duration-200">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent-500 rounded-full
                               border-2 border-white" />
            </button>

            {/* User avatar */}
            <div className="flex items-center gap-2.5 pl-3 border-l border-gray-100">
              <div className="w-8 h-8 rounded-xl bg-gradient-btn flex items-center justify-center
                              text-white text-xs font-black shadow-sm">
                AD
              </div>
              <div className="hidden sm:block">
                <p className="text-xs font-bold text-gray-800 leading-none">Administrador</p>
                <p className="text-[10px] text-gray-400 mt-0.5 leading-none flex items-center gap-1">
                  <Activity className="w-2.5 h-2.5 text-accent-500" />
                  VitalCode
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* ── Content ──────────────────────────────────────────────────────── */}
        <div className="flex-1 p-8 overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  )
}
