import { useState, useEffect, useMemo } from 'react'
import DashboardLayout from '../components/layout/DashboardLayout'
import {
  Users, CalendarDays, FlaskConical, AlertTriangle, ChevronRight,
  Download, Plus, MoreHorizontal, ArrowUpRight,
} from 'lucide-react'
import { obtenerEstadisticas, type EstadisticasBackend } from '../services/api'

const dias = ['LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB', 'DOM']

// Agenda de turnos demo
const agendaTurnos = [
  { hora: '14:00', paciente: 'Roberto Carlos', especialidad: 'Cardiología',  estado: 'CONFIRMADO', cls: 'bg-verde-50 text-verde-700 border border-verde-100' },
  { hora: '14:30', paciente: 'María Estela',   especialidad: 'Dermatología', estado: 'EN ESPERA',  cls: 'bg-amber-50 text-amber-700 border border-amber-100' },
  { hora: '15:15', paciente: 'Juan Pablo G.',  especialidad: 'Psicología',   estado: 'PENDIENTE',  cls: 'bg-gray-100 text-gray-600 border border-gray-200' },
]

// Pacientes recientes demo
const pacientesRecientesDemo = [
  { nombre: 'Elena Garrido', detalle: 'Consulta General · 09:15 AM', online: true },
  { nombre: 'Marcos Ruiz',   detalle: 'Traumatología · 10:30 AM',    online: false },
  { nombre: 'Lucía Méndez',  detalle: 'Pediatría · 11:45 AM',        online: true },
]

export default function DashboardPage() {
  const [stats, setStats] = useState<EstadisticasBackend | null>(null)
  const [tab, setTab] = useState<'Hoy' | 'Semana' | 'Mes'>('Hoy')

  useEffect(() => {
    const cargar = () => obtenerEstadisticas().then(setStats).catch(() => {})
    cargar()
    const id = setInterval(cargar, 10000)
    return () => clearInterval(id)
  }, [])

  const fmt = (n?: number) => (n ?? 0).toLocaleString('es-CO')

  // Ocupación de camas — datos simulados con 7 días
  const ocupacion = useMemo(
    () => [60, 75, 45, 90, 35, 80, 100],
    []
  )

  const pacientesRecientes = (stats?.ultimosRegistrados ?? []).slice(0, 3).map((u, i) => ({
    nombre: `${u.nombre} ${u.apellido}`,
    detalle: pacientesRecientesDemo[i]?.detalle ?? 'Consulta · Hoy',
    online: i % 2 === 0,
  }))
  const recientes = pacientesRecientes.length ? pacientesRecientes : pacientesRecientesDemo

  return (
    <DashboardLayout>
      <div className="space-y-5 animate-fade-in">

        {/* ── Title bar ── */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-black text-navy-900 tracking-tight">Panel Principal</h1>
            <p className="text-sm text-gray-500 mt-0.5">Resumen operativo del centro de salud en tiempo real.</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="btn-secondary px-4 py-2.5 text-sm">
              <Download className="w-4 h-4" /> Exportar Reporte
            </button>
            <button className="btn-primary px-5 py-2.5 text-sm shadow-glow-green">
              <Plus className="w-4 h-4" /> Nueva Consulta
            </button>
          </div>
        </div>

        {/* ── Grid principal: stats + main + side ── */}
        <div className="grid grid-cols-12 gap-5">

          {/* IZQUIERDA (8/12) */}
          <div className="col-span-12 lg:col-span-8 space-y-5">

            {/* Stat cards (3) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <StatCard
                label="PACIENTES TOTALES"
                value={fmt(stats?.totalUsuarios) || '1,284'}
                badge={<span className="px-2 py-0.5 rounded-full bg-verde-100 text-verde-700 text-[10px] font-black">+12%</span>}
                icon={<Users className="w-5 h-5 text-verde-600" />}
                iconBg="bg-verde-50"
              />
              <StatCard
                label="CITAS HOY"
                value={String(stats?.totalPacientes ?? 42)}
                icon={<CalendarDays className="w-5 h-5 text-navy-700" />}
                iconBg="bg-navy-50"
              />
              <StatCard
                label="RESULTADOS LAB"
                value={String(stats?.totalPersonalSalud ?? 15)}
                badge={<span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 text-[10px] font-black">PENDIENTE</span>}
                icon={<FlaskConical className="w-5 h-5 text-amber-600" />}
                iconBg="bg-amber-50"
              />
            </div>

            {/* Ocupación de Camas — gráfica de barras */}
            <div className="rounded-2xl p-7 relative overflow-hidden shadow-soft"
                 style={{ background: 'linear-gradient(135deg, #0a182e 0%, #0d2147 60%, #13294a 100%)' }}>
              {/* Glow orbs */}
              <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-verde-500/10 blur-3xl pointer-events-none" />
              <div className="absolute -bottom-20 -left-10 w-64 h-64 rounded-full bg-verde-400/8 blur-3xl pointer-events-none" />

              <div className="relative z-10 flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-xl font-black text-white tracking-tight">Ocupación de Camas</h2>
                  <p className="text-sm text-white/60 mt-1">Monitoreo de disponibilidad en tiempo real</p>
                </div>
                <span className="px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 text-white text-xs font-bold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-verde-400 animate-pulse" />
                  Actualizado: 12:45 PM
                </span>
              </div>

              <div className="relative z-10 flex items-end gap-3 h-44 mb-3">
                {ocupacion.map((h, i) => {
                  const isPeak = h === Math.max(...ocupacion)
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center justify-end gap-2 h-full">
                      <div className={`w-full rounded-t-lg transition-all duration-700 shadow-lg ${
                        isPeak
                          ? 'bg-white'
                          : 'bg-gradient-to-t from-verde-700 to-verde-400'
                        }`}
                        style={{ height: `${h}%` }}
                      />
                    </div>
                  )
                })}
              </div>
              <div className="relative z-10 grid grid-cols-7 gap-3">
                {dias.map((d) => (
                  <p key={d} className="text-[10px] font-bold text-white/50 text-center tracking-widest">{d}</p>
                ))}
              </div>
            </div>

            {/* Agenda de Turnos */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-card overflow-hidden">
              <div className="px-6 py-5 flex items-center justify-between flex-wrap gap-3">
                <p className="text-lg font-black text-navy-900">Agenda de Turnos</p>
                <div className="flex items-center bg-canvas rounded-lg p-1">
                  {(['Hoy', 'Semana', 'Mes'] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setTab(t)}
                      className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${
                        tab === t ? 'bg-white shadow-sm text-navy-900' : 'text-gray-500 hover:text-navy-700'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-y border-gray-50">
                    {['HORARIO', 'PACIENTE', 'ESPECIALIDAD', 'ESTADO', 'ACCIONES'].map((h, i) => (
                      <th key={h} className={`px-6 py-3 text-[10px] font-black text-gray-400 uppercase tracking-widest ${
                        i === 4 ? 'text-right' : 'text-left'
                      }`}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {agendaTurnos.map((t) => (
                    <tr key={t.hora} className="border-b border-gray-50 hover:bg-canvas/50 transition-colors">
                      <td className="px-6 py-4 font-bold text-navy-900">{t.hora}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-black text-gray-600">
                            {t.paciente.split(' ').map((s) => s[0]).join('').slice(0, 2)}
                          </div>
                          <p className="text-sm text-navy-900">{t.paciente}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{t.especialidad}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black ${t.cls}`}>
                          {t.estado}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="p-1.5 rounded-lg text-gray-400 hover:text-navy-900 hover:bg-gray-100 transition-all">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="px-6 py-4 text-center border-t border-gray-50">
                <button className="text-xs font-bold text-verde-600 hover:text-verde-700 inline-flex items-center gap-1">
                  Cargar más registros <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>

          {/* DERECHA (4/12) */}
          <div className="col-span-12 lg:col-span-4 space-y-5">

            {/* Pacientes Recientes */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-6">
              <div className="flex items-center justify-between mb-5">
                <p className="text-lg font-black text-navy-900">Pacientes Recientes</p>
                <button className="text-xs font-bold text-verde-600 hover:text-verde-700 inline-flex items-center gap-0.5">
                  Ver todos <ChevronRight className="w-3 h-3" />
                </button>
              </div>
              <div className="space-y-3">
                {recientes.map((p) => (
                  <div key={p.nombre} className="flex items-center gap-3 group cursor-pointer">
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-black text-gray-600 ring-2 ring-white">
                        {p.nombre.split(' ').map((s) => s[0]).join('').slice(0, 2).toUpperCase()}
                      </div>
                      {p.online && (
                        <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-verde-500 rounded-full ring-2 ring-white" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-navy-900 truncate group-hover:text-verde-700 transition-colors">{p.nombre}</p>
                      <p className="text-[11px] text-gray-500 truncate">{p.detalle}</p>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-gray-300 group-hover:text-verde-600 transition-colors" />
                  </div>
                ))}
              </div>
            </div>

            {/* Alertas Críticas */}
            <div className="rounded-2xl p-6 border border-red-200 relative overflow-hidden"
                 style={{ background: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)' }}>
              <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-red-300/20 blur-3xl pointer-events-none" />
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  <p className="text-base font-black text-red-700">Alertas Críticas</p>
                </div>
                <p className="text-sm text-red-800/80 leading-relaxed mb-4">
                  Hay <span className="font-black">2 registros</span> de signos vitales fuera de
                  rango que requieren atención inmediata en el Pabellón B.
                </p>
                <button className="w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-bold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2">
                  Revisar Protocolos
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </DashboardLayout>
  )
}

function StatCard({ label, value, badge, icon, iconBg }: {
  label: string
  value: string
  badge?: React.ReactNode
  icon: React.ReactNode
  iconBg: string
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-5 hover:shadow-card-hover transition-all">
      <div className="flex items-start justify-between mb-3">
        <div className={`w-11 h-11 rounded-xl ${iconBg} flex items-center justify-center`}>
          {icon}
        </div>
        {badge}
      </div>
      <p className="text-3xl font-black text-navy-900 tracking-tight">{value}</p>
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">{label}</p>
    </div>
  )
}
