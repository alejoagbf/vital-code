import { NavLink, useNavigate } from 'react-router-dom'
import { logout } from '../../services/api'
import toast from 'react-hot-toast'
import {
  Users, ShieldCheck, Stethoscope, LogOut, Activity, ChevronRight,
} from 'lucide-react'

interface NavItem {
  to: string
  label: string
  description: string
  icon: React.ReactNode
}

const navItems: NavItem[] = [
  {
    to: '/pacientes',
    label: 'Pacientes',
    description: 'Gestión de pacientes',
    icon: <Users className="w-5 h-5" />,
  },
  {
    to: '/administradores',
    label: 'Administradores',
    description: 'Control de acceso',
    icon: <ShieldCheck className="w-5 h-5" />,
  },
  {
    to: '/personal-salud',
    label: 'Personal de Salud',
    description: 'Equipo médico',
    icon: <Stethoscope className="w-5 h-5" />,
  },
]

export default function Sidebar() {
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    toast.success('Sesión cerrada')
    navigate('/login')
  }

  return (
    <aside
      className="flex flex-col w-64 min-h-screen flex-shrink-0 shadow-sidebar"
      style={{ background: 'linear-gradient(180deg, #0b1442 0%, #1E3A8A 55%, #101e54 100%)' }}
    >
      {/* ── Logo / Brand ───────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-white/8">
        {/* Logo image – coloca tu logo en /public/logo.png */}
        <div className="w-11 h-11 rounded-xl bg-white/10 backdrop-blur-sm border border-white/15
                        flex items-center justify-center shadow-glow-cyan flex-shrink-0 overflow-hidden">
          <img
            src="/logo.png"
            alt="VitalCode"
            className="w-9 h-9 object-contain"
            onError={(e) => {
              e.currentTarget.style.display = 'none'
              ;(e.currentTarget.nextElementSibling as HTMLElement)?.removeAttribute('style')
            }}
          />
          <Activity className="w-6 h-6 text-accent-400" style={{ display: 'none' }} />
        </div>
        <div>
          <p className="font-black text-white text-base leading-none tracking-tight">VitalCode</p>
          <p className="text-[10px] text-white/40 mt-0.5 font-medium tracking-wider uppercase">
            HealthTech S.A.S.
          </p>
        </div>
      </div>

      {/* ── Navigation ─────────────────────────────────────────────────────── */}
      <nav className="flex-1 px-3 py-5 space-y-1">
        <p className="px-3 pb-2 text-[9px] font-black text-white/25 uppercase tracking-[0.15em]">
          Módulos del sistema
        </p>

        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `group flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold
               transition-all duration-200 ${
                isActive
                  ? 'bg-white/12 text-white shadow-inner-glow border border-white/10'
                  : 'text-white/55 hover:bg-white/8 hover:text-white/90'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span className={`flex-shrink-0 transition-colors ${
                  isActive ? 'text-accent-400' : 'text-white/40 group-hover:text-white/70'
                }`}>
                  {item.icon}
                </span>
                <span className="flex-1 min-w-0">
                  <span className="block leading-none">{item.label}</span>
                  <span className={`block text-[10px] mt-0.5 font-normal leading-none ${
                    isActive ? 'text-white/45' : 'text-white/25 group-hover:text-white/35'
                  }`}>
                    {item.description}
                  </span>
                </span>
                {isActive && (
                  <ChevronRight className="w-3.5 h-3.5 text-accent-400 flex-shrink-0" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* ── User profile ───────────────────────────────────────────────────── */}
      <div className="px-3 pb-2 border-t border-white/8 pt-3">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/6">
          <div className="w-8 h-8 rounded-lg bg-gradient-accent flex items-center justify-center
                          text-white font-black text-xs flex-shrink-0">
            AD
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-xs font-semibold truncate leading-none">Administrador</p>
            <p className="text-white/35 text-[10px] mt-0.5 leading-none">Sistema activo</p>
          </div>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
        </div>
      </div>

      {/* ── Logout ─────────────────────────────────────────────────────────── */}
      <div className="px-3 pb-5 pt-1">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm
                     font-semibold text-white/45 hover:text-red-300 hover:bg-red-500/10
                     transition-all duration-200 group"
        >
          <LogOut className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          Cerrar sesión
        </button>
      </div>
    </aside>
  )
}
