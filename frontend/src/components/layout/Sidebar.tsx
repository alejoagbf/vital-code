import { NavLink, useNavigate } from 'react-router-dom'
import { logout } from '../../services/api'
import toast from 'react-hot-toast'
import {
  LayoutDashboard, ClipboardList, Calendar, QrCode,
  ShieldCheck, LogOut, Users, Stethoscope, BarChart2,
} from 'lucide-react'

interface NavItem {
  to: string
  label: string
  icon: React.ReactNode
  badge?: string
}

type Rol = 'ADMINISTRADOR' | 'PERSONAL_SALUD' | 'PACIENTE'

function obtenerRol(): Rol {
  try {
    const raw = localStorage.getItem('vitalcode_user')
    if (!raw) return 'PACIENTE'
    const u = JSON.parse(raw)
    return (u.tipoUsuario as Rol) ?? 'PACIENTE'
  } catch {
    return 'PACIENTE'
  }
}

const menuPorRol: Record<Rol, NavItem[]> = {
  ADMINISTRADOR: [
    { to: '/dashboard',       label: 'Panel Principal',  icon: <LayoutDashboard className="w-5 h-5" /> },
    { to: '/estadisticas',    label: 'Estadísticas',     icon: <BarChart2 className="w-5 h-5" /> },
    { to: '/pacientes',       label: 'Pacientes',        icon: <ClipboardList className="w-5 h-5" /> },
    { to: '/personal-salud',  label: 'Personal de Salud', icon: <Stethoscope className="w-5 h-5" /> },
    { to: '/administradores', label: 'Administradores',  icon: <ShieldCheck className="w-5 h-5" /> },
    { to: '/administracion',  label: 'Administración',   icon: <Users className="w-5 h-5" />, badge: 'ADM' },
  ],
  PERSONAL_SALUD: [
    { to: '/dashboard',   label: 'Panel Principal',   icon: <LayoutDashboard className="w-5 h-5" /> },
    { to: '/pacientes',   label: 'Pacientes',         icon: <ClipboardList className="w-5 h-5" /> },
    { to: '/citas',       label: 'Citas Médicas',     icon: <Calendar className="w-5 h-5" /> },
    { to: '/historial',   label: 'Historial Clínico', icon: <ClipboardList className="w-5 h-5" /> },
  ],
  PACIENTE: [
    { to: '/dashboard',    label: 'Panel Principal',   icon: <LayoutDashboard className="w-5 h-5" /> },
    { to: '/historial',    label: 'Historial Clínico', icon: <ClipboardList className="w-5 h-5" /> },
    { to: '/citas',        label: 'Citas Médicas',     icon: <Calendar className="w-5 h-5" /> },
    { to: '/mi-codigo-qr', label: 'Mi Código QR',      icon: <QrCode className="w-5 h-5" /> },
  ],
}

export default function Sidebar() {
  const navigate = useNavigate()
  const rol = obtenerRol()
  const navItems = menuPorRol[rol]

  const handleLogout = () => {
    logout()
    toast.success('Sesión cerrada')
    navigate('/login')
  }

  return (
    <aside className="flex flex-col w-64 min-h-screen flex-shrink-0 bg-white/80 backdrop-blur-xl border-r border-gray-200/70 relative">

      {/* Logo */}
      <div className="flex flex-col items-center px-6 pt-8 pb-7 border-b border-gray-100">
        <div className="relative w-24 h-24 flex items-center justify-center">
          <div className="absolute inset-0 bg-verde-50 rounded-3xl rotate-6 opacity-60" />
          <div className="absolute inset-0 bg-white rounded-3xl shadow-card flex items-center justify-center overflow-hidden">
            <img
              src="/logo.svg"
              alt="VitalCode"
              className="w-16 h-16 object-contain"
              onError={(e) => {
                e.currentTarget.style.display = 'none'
                ;(e.currentTarget.nextElementSibling as HTMLElement)?.removeAttribute('style')
              }}
            />
            <span className="text-verde-600 font-black text-2xl" style={{ display: 'none' }}>♥</span>
          </div>
        </div>
        <p className="mt-3 text-base font-black text-navy-900 tracking-tight">
          Vital<span className="text-verde-600">Code</span>
        </p>
        <p className="mt-1 text-[10px] font-bold text-gray-500 tracking-[0.22em] uppercase">
          HEALTHTECH SOLUTIONS
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1.5">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/dashboard'}
            className={({ isActive }) =>
              `relative flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium
               transition-all duration-200 group ${
                isActive
                  ? 'bg-gradient-to-r from-verde-50 to-verde-50/40 text-verde-700 font-semibold shadow-sm'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-navy-900'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span className={`flex-shrink-0 transition-colors ${isActive ? 'text-verde-600' : 'text-gray-400 group-hover:text-verde-600'}`}>
                  {item.icon}
                </span>
                <span className="flex-1">{item.label}</span>
                {item.badge && (
                  <span className="px-1.5 py-0.5 rounded-md bg-navy-900 text-white text-[9px] font-black tracking-widest">
                    {item.badge}
                  </span>
                )}
                {isActive && (
                  <span className="absolute -right-4 top-2 bottom-2 w-1.5 rounded-l-full bg-verde-500 shadow-glow-green" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="px-4 pb-3 border-t border-gray-100 pt-4">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm
                     font-medium text-gray-500 hover:text-red-600 hover:bg-red-50
                     transition-all duration-200"
        >
          <LogOut className="w-5 h-5" />
          Cerrar sesión
        </button>
      </div>

      {/* Emergencia SOS - todos los roles excepto admin */}
      {rol !== 'ADMINISTRADOR' && (
        <div className="px-4 pb-6">
          <button className="group w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl
                             bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700
                             text-white font-bold text-sm
                             transition-all duration-200 shadow-glow-red hover:shadow-lg hover:-translate-y-0.5">
            <span className="text-lg leading-none animate-pulse">✱</span>
            Emergencia SOS
          </button>
        </div>
      )}
    </aside>
  )
}
