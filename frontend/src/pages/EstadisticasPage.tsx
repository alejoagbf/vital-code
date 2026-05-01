import { useState, useEffect } from 'react'
import DashboardLayout from '../components/layout/DashboardLayout'
import { obtenerEstadisticas, type EstadisticasBackend } from '../services/api'
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from 'recharts'
import { BarChart2, Users, UserCheck, Stethoscope, ShieldCheck } from 'lucide-react'

const mapToArray = (obj: Record<string, number>) =>
  Object.entries(obj).map(([name, value]) => ({ name, value }))

const COLORES_GENERO  = ['#22c55e', '#38bdf8', '#f59e0b', '#a78bfa']
const COLORES_EPS     = ['#22c55e', '#16a34a', '#4ade80', '#86efac', '#bbf7d0', '#dcfce7']
const COLORES_SANGRE  = ['#f43f5e', '#fb923c', '#facc15', '#4ade80', '#38bdf8', '#818cf8', '#e879f9', '#f472b6']

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-lg px-4 py-3 text-sm">
      {label && <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{label}</p>}
      <p className="font-black text-navy-900 text-base">{payload[0].value}
        <span className="text-xs font-medium text-gray-400 ml-1">registros</span>
      </p>
    </div>
  )
}

const CustomPieTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-4 py-3 text-sm">
      <p className="font-black text-white text-base">{payload[0].name}</p>
      <p className="text-white/70 font-medium">{payload[0].value} registros</p>
    </div>
  )
}

export default function EstadisticasPage() {
  const [stats, setStats] = useState<EstadisticasBackend | null>(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    obtenerEstadisticas()
      .then(setStats)
      .catch(() => setError(true))
      .finally(() => setCargando(false))
  }, [])

  if (cargando) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-verde-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </DashboardLayout>
    )
  }

  if (error || !stats) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <p className="text-lg font-bold text-gray-400">No se pudieron cargar las estadísticas.</p>
          <p className="text-sm text-gray-400 mt-1">Verifica que el backend esté activo en el puerto 8081.</p>
        </div>
      </DashboardLayout>
    )
  }

  const dataGenero        = mapToArray(stats.pacientesPorGenero)
  const dataEps           = mapToArray(stats.pacientesPorEps)
  const dataCargo         = mapToArray(stats.personalPorCargo)
  const dataGrupoSanguineo = mapToArray(stats.pacientesPorGrupoSanguineo)
  const dataEstado        = [
    { name: 'Activos',   value: stats.usuariosActivos },
    { name: 'Inactivos', value: stats.usuariosInactivos },
  ]

  const kpis = [
    { label: 'Total Usuarios',    value: stats.totalUsuarios,      icon: <Users className="w-5 h-5 text-white" />,       bg: 'from-navy-700 to-navy-900' },
    { label: 'Pacientes',         value: stats.totalPacientes,     icon: <UserCheck className="w-5 h-5 text-white" />,   bg: 'from-verde-500 to-verde-700' },
    { label: 'Personal de Salud', value: stats.totalPersonalSalud, icon: <Stethoscope className="w-5 h-5 text-white" />, bg: 'from-cyan-500 to-cyan-700' },
    { label: 'Administradores',   value: stats.totalAdministradores, icon: <ShieldCheck className="w-5 h-5 text-white" />, bg: 'from-violet-500 to-violet-700' },
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-verde-50 flex items-center justify-center">
            <BarChart2 className="w-5 h-5 text-verde-600" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-navy-900 tracking-tight">Estadísticas del Sistema</h1>
            <p className="text-sm text-gray-500 mt-0.5">Análisis estadístico en tiempo real desde la base de datos.</p>
          </div>
        </div>

        {/* KPI cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {kpis.map((k) => (
            <div key={k.label} className={`bg-gradient-to-br ${k.bg} rounded-2xl p-5 shadow-lg flex items-center gap-4`}>
              <div className="w-11 h-11 rounded-xl bg-white/15 flex items-center justify-center flex-shrink-0">
                {k.icon}
              </div>
              <div>
                <p className="text-3xl font-black text-white">{k.value}</p>
                <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest mt-0.5">{k.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Fila 1: Género + Estado — fondo oscuro */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Gráfico 1 — Pacientes por Género */}
          <div className="rounded-2xl p-6 relative overflow-hidden shadow-soft"
               style={{ background: 'linear-gradient(135deg, #0a182e 0%, #0d2147 60%, #13294a 100%)' }}>
            <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-verde-500/10 blur-3xl pointer-events-none" />
            <div className="relative z-10">
              <p className="text-lg font-black text-white mb-0.5">Pacientes por Género</p>
              <p className="text-xs text-white/40 mb-4">Distribución según género registrado</p>
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <defs>
                    {dataGenero.map((_, i) => (
                      <radialGradient key={i} id={`gGrad${i}`} cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor={COLORES_GENERO[i % COLORES_GENERO.length]} stopOpacity={1} />
                        <stop offset="100%" stopColor={COLORES_GENERO[i % COLORES_GENERO.length]} stopOpacity={0.7} />
                      </radialGradient>
                    ))}
                  </defs>
                  <Pie data={dataGenero} cx="50%" cy="50%" outerRadius={95} innerRadius={40}
                    dataKey="value" paddingAngle={3}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={{ stroke: 'rgba(255,255,255,0.3)' }}>
                    {dataGenero.map((_, i) => (
                      <Cell key={i} fill={`url(#gGrad${i})`} stroke="transparent" />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomPieTooltip />} />
                  <Legend formatter={(v) => <span className="text-white/70 text-xs font-semibold">{v}</span>} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Gráfico 2 — Estado de Usuarios */}
          <div className="rounded-2xl p-6 relative overflow-hidden shadow-soft"
               style={{ background: 'linear-gradient(135deg, #0a182e 0%, #0d2147 60%, #13294a 100%)' }}>
            <div className="absolute -bottom-16 -left-16 w-56 h-56 rounded-full bg-verde-400/10 blur-3xl pointer-events-none" />
            <div className="relative z-10">
              <p className="text-lg font-black text-white mb-0.5">Estado de Usuarios</p>
              <p className="text-xs text-white/40 mb-4">Proporción de usuarios activos e inactivos</p>
              <div className="relative">
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie data={dataEstado} cx="50%" cy="50%" innerRadius={70} outerRadius={105}
                      dataKey="value" paddingAngle={4} startAngle={90} endAngle={-270}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      labelLine={{ stroke: 'rgba(255,255,255,0.3)' }}>
                      <Cell fill="#22c55e" />
                      <Cell fill="#ef4444" />
                    </Pie>
                    <Tooltip content={<CustomPieTooltip />} />
                    <Legend formatter={(v) => <span className="text-white/70 text-xs font-semibold">{v}</span>} />
                  </PieChart>
                </ResponsiveContainer>
                {/* Centro del donut */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="text-center mt-2">
                    <p className="text-3xl font-black text-white">{stats.totalUsuarios}</p>
                    <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">total</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Gráfico 3 — Pacientes por EPS */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="text-lg font-black text-navy-900">Pacientes por EPS</p>
              <p className="text-xs text-gray-400 mt-0.5">Cantidad de pacientes por entidad promotora de salud</p>
            </div>
            <span className="px-3 py-1 rounded-full bg-verde-50 text-verde-700 text-xs font-black border border-verde-100">
              {dataEps.length} EPS
            </span>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dataEps} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <defs>
                <linearGradient id="gradEps" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#22c55e" stopOpacity={1} />
                  <stop offset="100%" stopColor="#16a34a" stopOpacity={0.7} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#d1d5db" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#6b7280', fontWeight: 600 }} axisLine={false} tickLine={false} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(34,197,94,0.05)' }} />
              <Bar dataKey="value" fill="url(#gradEps)" radius={[8, 8, 0, 0]} maxBarSize={60} name="Pacientes">
                {dataEps.map((_, i) => (
                  <Cell key={i} fill={`url(#gradEps)`} opacity={1 - i * 0.08} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Fila 2: Cargo + Grupo Sanguíneo */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Gráfico 4 — Personal por Cargo */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <p className="text-lg font-black text-navy-900">Personal por Cargo</p>
                <p className="text-xs text-gray-400 mt-0.5">Distribución del personal según especialidad</p>
              </div>
              <span className="px-3 py-1 rounded-full bg-navy-50 text-navy-700 text-xs font-black border border-navy-100">
                {stats.totalPersonalSalud} profesionales
              </span>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={dataCargo} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                <defs>
                  <linearGradient id="gradCargo" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#0d2147" stopOpacity={1} />
                    <stop offset="100%" stopColor="#1e40af" stopOpacity={0.8} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#d1d5db" horizontal={false} />
                <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 11, fill: '#374151', fontWeight: 600 }} width={120} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(13,33,71,0.04)' }} />
                <Bar dataKey="value" fill="url(#gradCargo)" radius={[0, 8, 8, 0]} maxBarSize={40} name="Personal" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Gráfico 5 — Grupo Sanguíneo */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <p className="text-lg font-black text-navy-900">Grupos Sanguíneos</p>
                <p className="text-xs text-gray-400 mt-0.5">Distribución de pacientes por tipo de sangre</p>
              </div>
              <span className="px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-black border border-rose-100">
                {dataGrupoSanguineo.length} tipos
              </span>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={dataGrupoSanguineo} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <defs>
                  {COLORES_SANGRE.map((color, i) => (
                    <linearGradient key={i} id={`gradSangre${i}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={color} stopOpacity={1} />
                      <stop offset="100%" stopColor={color} stopOpacity={0.6} />
                    </linearGradient>
                  ))}
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#d1d5db" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 13, fill: '#374151', fontWeight: 700 }} axisLine={false} tickLine={false} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(244,63,94,0.05)' }} />
                <Bar dataKey="value" radius={[8, 8, 0, 0]} maxBarSize={55} name="Pacientes">
                  {dataGrupoSanguineo.map((_, i) => (
                    <Cell key={i} fill={`url(#gradSangre${i})`} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </DashboardLayout>
  )
}
