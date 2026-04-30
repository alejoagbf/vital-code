import { type ReactNode, useMemo } from 'react'
import Sidebar from './Sidebar'
import { Bell, Settings, Search } from 'lucide-react'

interface Props {
  children: ReactNode
}

export default function DashboardLayout({ children }: Props) {
  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem('vitalcode_user') ?? '{}')
    } catch { return {} }
  }, [])

  const prefijo = user.tipoUsuario === 'PERSONAL_SALUD' ? 'Dr. ' : ''
  const nombre = user.nombre
    ? `${prefijo}${user.nombre} ${user.apellido?.[0] ?? ''}.`
    : 'Invitado'
  const rol = user.tipoUsuario === 'ADMINISTRADOR'
    ? 'Administrador Senior'
    : user.tipoUsuario === 'PERSONAL_SALUD'
    ? 'Personal de Salud'
    : user.tipoUsuario === 'PACIENTE'
    ? 'Paciente'
    : 'Usuario'

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <main className="flex-1 flex flex-col overflow-hidden min-w-0">

        {/* Header */}
        <header className="bg-white/70 backdrop-blur-xl border-b border-gray-200/70 px-8 py-3.5 flex items-center justify-between flex-shrink-0 gap-4 sticky top-0 z-30">

          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar pacientes, registros..."
              className="w-full bg-gray-50 border border-gray-200/80 rounded-full pl-11 pr-4 py-2.5
                         text-sm text-navy-900 placeholder-gray-400 outline-none
                         focus:bg-white focus:border-verde-300 focus:ring-2 focus:ring-verde-500/15
                         transition-all duration-200"
            />
          </div>

          {/* Right */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <button className="relative p-2.5 rounded-xl text-gray-500 hover:bg-gray-100 hover:text-navy-900 transition-all">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
            </button>
            <button className="p-2.5 rounded-xl text-gray-500 hover:bg-gray-100 hover:text-navy-900 transition-all">
              <Settings className="w-5 h-5" />
            </button>

            <div className="w-px h-7 bg-gray-200 mx-1" />

            <div className="flex items-center gap-3 pl-1">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-navy-900 leading-tight">{nombre}</p>
                <p className="text-[11px] text-gray-500 leading-tight font-semibold">{rol}</p>
              </div>
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-verde-400 to-verde-600 flex items-center justify-center text-white text-sm font-black shadow-glow-green flex-shrink-0 ring-2 ring-white">
                  {(user.nombre?.[0] ?? 'A').toUpperCase()}{(user.apellido?.[0] ?? 'V').toUpperCase()}
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-verde-500 rounded-full ring-2 ring-white" />
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 p-8 overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  )
}
