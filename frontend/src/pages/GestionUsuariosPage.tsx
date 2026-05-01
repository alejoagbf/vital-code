import { useState, useEffect, useCallback, type FormEvent } from 'react'
import toast from 'react-hot-toast'
import DashboardLayout from '../components/layout/DashboardLayout'
import {
  listarTodosUsuarios, crearUsuarioUnificado, cambiarEstadoUsuario, consultaBuscarTexto,
} from '../services/api'
import type { UsuarioBackend, UsuarioPayload, TipoUsuario } from '../types'
import {
  Search, UserPlus, Pencil, Users, X, Stethoscope, ShieldCheck, X as XIcon,
} from 'lucide-react'

const PAGE_SIZE = 8

const ROL_LABELS: Record<TipoUsuario, string> = {
  ADMINISTRADOR:  'ADMIN',
  PERSONAL_SALUD: 'PERSONAL DE SALUD',
  PACIENTE:       'PACIENTE',
}

const ROL_COLORS: Record<TipoUsuario, string> = {
  ADMINISTRADOR:  'bg-navy-900 text-white',
  PERSONAL_SALUD: 'bg-indigo-100 text-indigo-700',
  PACIENTE:       'bg-verde-100 text-verde-700',
}

const INITIALS_BG = [
  'bg-violet-200 text-violet-700',
  'bg-blue-200 text-blue-700',
  'bg-verde-200 text-verde-700',
  'bg-orange-200 text-orange-700',
  'bg-pink-200 text-pink-700',
  'bg-indigo-200 text-indigo-700',
]
const avatarBg = (name: string) => INITIALS_BG[name.charCodeAt(0) % INITIALS_BG.length]

const isoLocal = () => new Date().toISOString().slice(0, 19)
const NOW = isoLocal()

const EMPTY_FORM: UsuarioPayload = {
  tipoUsuario: 'PACIENTE',
  correo: '', contrasena: '', estado: true,
  nombre: '', apellido: '', telefono: '',
  fechaCreacion: NOW, ultimoAcceso: NOW,
  departamento: '',
  numDocumento: undefined, fechaNacimiento: '', grupoSanguineo: '', eps: '', genero: '',
  cargo: '', numLicencia: undefined, institucion: '',
}

const inputCls = 'w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 outline-none focus:bg-white focus:border-verde-400 focus:ring-2 focus:ring-verde-500/10 transition-all duration-200'

export default function GestionUsuariosPage() {
  const [usuarios, setUsuarios] = useState<UsuarioBackend[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(0)

  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState<UsuarioPayload>(EMPTY_FORM)
  const [saving, setSaving] = useState(false)

  const [togglingId, setTogglingId] = useState<number | null>(null)
  const [buscandoBackend, setBuscandoBackend] = useState(false)
  const [busquedaActiva, setBusquedaActiva] = useState(false)

  const fetchUsuarios = useCallback(async () => {
    setLoading(true)
    try {
      const data = await listarTodosUsuarios()
      setUsuarios(data)
    } catch {
      toast.error('Error al cargar los usuarios.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchUsuarios() }, [fetchUsuarios])

  const buscarEnBackend = async () => {
    if (!search.trim()) return
    setBuscandoBackend(true)
    try {
      const data = await consultaBuscarTexto(search.trim())
      setUsuarios(data)
      setBusquedaActiva(true)
      setPage(0)
    } catch { toast.error('Error al buscar en el sistema.') }
    finally { setBuscandoBackend(false) }
  }

  const limpiarBusqueda = () => {
    setSearch('')
    setBusquedaActiva(false)
    fetchUsuarios()
  }

  const filtered = usuarios.filter((u) => {
    if (busquedaActiva) return true
    const q = search.toLowerCase()
    return (
      u.nombre.toLowerCase().includes(q) ||
      u.apellido.toLowerCase().includes(q) ||
      u.correo.toLowerCase().includes(q)
    )
  })

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paged = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)

  const totales = {
    total:    usuarios.length,
    pacientes: usuarios.filter((u) => u.tipoUsuario === 'PACIENTE').length,
    personal:  usuarios.filter((u) => u.tipoUsuario === 'PERSONAL_SALUD').length,
    admins:    usuarios.filter((u) => u.tipoUsuario === 'ADMINISTRADOR').length,
  }

  const handleToggleEstado = async (u: UsuarioBackend) => {
    setTogglingId(u.idUsuario)
    try {
      await cambiarEstadoUsuario(u.idUsuario)
      toast.success(`${u.nombre} ${u.estado ? 'desactivado' : 'activado'}.`)
      fetchUsuarios()
    } catch {
      toast.error('Error al cambiar el estado.')
    } finally {
      setTogglingId(null)
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      await crearUsuarioUnificado({ ...form, fechaCreacion: isoLocal(), ultimoAcceso: isoLocal() })
      toast.success('Usuario creado correctamente.')
      setModalOpen(false)
      setForm(EMPTY_FORM)
      fetchUsuarios()
    } catch {
      toast.error('Error al crear el usuario.')
    } finally {
      setSaving(false)
    }
  }

  const f = (field: keyof UsuarioPayload) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }))
  }

  return (
    <DashboardLayout>
      <div className="space-y-5 animate-fade-in">

        {/* Header profesional */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-6 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-navy-50 to-navy-100 border border-navy-200 flex items-center justify-center flex-shrink-0">
              <Users className="w-7 h-7 text-navy-700" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-navy-900 tracking-tight">Administración</h1>
              <p className="text-sm text-gray-500 mt-0.5">Gestiona el acceso y roles de todo el personal y pacientes de VitalCode.</p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-canvas border border-gray-100">
            <span className="w-1.5 h-1.5 rounded-full bg-navy-700 animate-pulse" />
            <span className="text-[11px] font-bold text-gray-600 uppercase tracking-wider">{totales.total} usuarios totales</span>
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'TOTAL USUARIOS',   value: totales.total,     icon: <Users className="w-5 h-5 text-navy-700" />,        iconBg: 'bg-navy-50',    pill: '+12%',    pillCls: 'bg-verde-100 text-verde-700' },
            { label: 'PACIENTES',        value: totales.pacientes, icon: <Users className="w-5 h-5 text-verde-600" />,       iconBg: 'bg-verde-50',   pill: totales.total ? `${Math.round(totales.pacientes/totales.total*100)}%` : '0%', pillCls: 'bg-verde-50 text-verde-700 border border-verde-100' },
            { label: 'PERSONAL SALUD',   value: totales.personal,  icon: <Stethoscope className="w-5 h-5 text-cyan-600" />,  iconBg: 'bg-cyan-50',    pill: totales.total ? `${Math.round(totales.personal/totales.total*100)}%`  : '0%', pillCls: 'bg-cyan-50 text-cyan-700 border border-cyan-100' },
            { label: 'ADMINISTRADORES',  value: totales.admins,    icon: <ShieldCheck className="w-5 h-5 text-violet-600" />, iconBg: 'bg-violet-50', pill: totales.total ? `${Math.round(totales.admins/totales.total*100)}%`    : '0%', pillCls: 'bg-violet-50 text-violet-700 border border-violet-100' },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-2xl border border-gray-100 shadow-card p-5 hover:shadow-card-hover transition-all">
              <div className="flex items-start justify-between mb-3">
                <div className={`w-11 h-11 rounded-xl ${s.iconBg} flex items-center justify-center`}>{s.icon}</div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-black tracking-wider ${s.pillCls}`}>{s.pill}</span>
              </div>
              <p className="text-3xl font-black text-navy-900 tracking-tight">{loading ? '—' : s.value.toLocaleString()}</p>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Toolbar */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-3 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          <div className="flex gap-2 w-full sm:max-w-lg flex-1">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por nombre o correo y presiona Enter…"
                className="w-full bg-canvas border border-transparent rounded-xl pl-11 pr-4 py-3
                           text-sm text-navy-900 placeholder-gray-400 outline-none
                           focus:bg-white focus:border-navy-300 focus:ring-2 focus:ring-navy-500/10 transition-all"
                value={search}
                onChange={(e) => { setSearch(e.target.value); if (!e.target.value) limpiarBusqueda() }}
                onKeyDown={(e) => e.key === 'Enter' && buscarEnBackend()}
              />
            </div>
            {busquedaActiva ? (
              <button onClick={limpiarBusqueda}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-50 text-amber-700 border border-amber-200 text-xs font-bold hover:bg-amber-100 transition-colors whitespace-nowrap">
                <XIcon className="w-3.5 h-3.5" /> Limpiar
              </button>
            ) : (
              <button onClick={buscarEnBackend} disabled={!search.trim() || buscandoBackend}
                className="px-4 py-2 rounded-xl bg-navy-700 hover:bg-navy-800 text-white text-xs font-bold disabled:opacity-40 transition-colors whitespace-nowrap">
                {buscandoBackend ? 'Buscando…' : 'Buscar'}
              </button>
            )}
          </div>
          <button
            onClick={() => { setForm(EMPTY_FORM); setModalOpen(true) }}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-white text-sm font-bold
                       bg-gradient-to-r from-navy-700 to-navy-900 hover:from-navy-800 hover:to-navy-950
                       shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all"
          >
            <UserPlus className="w-4 h-4" />
            Nuevo Usuario
          </button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  {['NOMBRE COMPLETO', 'CORREO', 'ROL', 'ESTADO', 'ACCIONES'].map((h) => (
                    <th key={h} className="px-5 py-3.5 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} className="py-16 text-center">
                      <svg className="animate-spin w-6 h-6 mx-auto mb-3 text-verde-500" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      <p className="text-gray-400 text-sm font-medium">Cargando usuarios...</p>
                    </td>
                  </tr>
                ) : paged.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-16 text-center">
                      <Users className="w-10 h-10 mx-auto mb-3 text-gray-200" />
                      <p className="text-gray-400 text-sm">No se encontraron usuarios.</p>
                    </td>
                  </tr>
                ) : paged.map((u) => {
                  const initials = `${u.nombre[0] ?? ''}${u.apellido[0] ?? ''}`.toUpperCase()
                  return (
                    <tr key={u.idUsuario} className="border-b border-gray-50 hover:bg-canvas/60 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full ${avatarBg(u.nombre)} flex items-center
                                          justify-center text-xs font-black flex-shrink-0`}>
                            {initials}
                          </div>
                          <span className="font-bold text-navy-900">{u.nombre} {u.apellido}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-500">{u.correo}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1.5 rounded-full text-[10px] font-black tracking-wider ${ROL_COLORS[u.tipoUsuario]}`}>
                          {ROL_LABELS[u.tipoUsuario]}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleToggleEstado(u)}
                          disabled={togglingId === u.idUsuario}
                          title={u.estado ? 'Desactivar usuario' : 'Activar usuario'}
                          className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors duration-200
                            focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed
                            ${u.estado ? 'bg-verde-500' : 'bg-gray-200'}`}
                        >
                          <span className={`inline-block w-5 h-5 transform rounded-full bg-white shadow transition-transform duration-200
                            ${u.estado ? 'translate-x-6' : 'translate-x-1'}`} />
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <button className="p-2 rounded-xl text-gray-400 hover:text-verde-600 hover:bg-verde-50 transition-all">
                          <Pencil className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-5 py-3.5 border-t border-gray-50 flex items-center justify-between">
            <p className="text-xs text-gray-400 font-medium">
              Mostrando {Math.min(page * PAGE_SIZE + 1, filtered.length)} a {Math.min((page + 1) * PAGE_SIZE, filtered.length)} de {filtered.length} usuarios
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-semibold
                           text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                ‹
              </button>
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i)}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-semibold transition-colors
                    ${page === i ? 'bg-verde-600 text-white' : 'text-gray-500 hover:bg-gray-100'}`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                disabled={page >= totalPages - 1}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-semibold
                           text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                ›
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal - Nuevo Usuario */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setModalOpen(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-slide-up">
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <div>
                <h2 className="text-lg font-black text-gray-900">Nuevo Usuario</h2>
                <p className="text-xs text-gray-400 mt-0.5">Complete la información para registrar en el sistema</p>
              </div>
              <button onClick={() => setModalOpen(false)} className="p-2 rounded-xl text-gray-400 hover:bg-gray-100 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">

              {/* Tipo */}
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest">Tipo de Usuario *</label>
                <select className={inputCls} value={form.tipoUsuario} onChange={f('tipoUsuario')} required>
                  <option value="PACIENTE">Paciente</option>
                  <option value="PERSONAL_SALUD">Personal de Salud</option>
                  <option value="ADMINISTRADOR">Administrador</option>
                </select>
              </div>

              {/* Nombre / Apellido */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest">Nombre *</label>
                  <input className={inputCls} placeholder="Juan" required value={form.nombre} onChange={f('nombre')} />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest">Apellido *</label>
                  <input className={inputCls} placeholder="Pérez" required value={form.apellido} onChange={f('apellido')} />
                </div>
              </div>

              {/* Correo / Contraseña */}
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest">Correo electrónico *</label>
                <input type="email" className={inputCls} placeholder="correo@ejemplo.com" required value={form.correo} onChange={f('correo')} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest">Contraseña *</label>
                  <input type="password" className={inputCls} placeholder="••••••••" required value={form.contrasena} onChange={f('contrasena')} />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest">Teléfono *</label>
                  <input className={inputCls} placeholder="3001234567" required value={form.telefono} onChange={f('telefono')} />
                </div>
              </div>

              {/* Campos condicionales */}
              {form.tipoUsuario === 'ADMINISTRADOR' && (
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest">Departamento *</label>
                  <input className={inputCls} placeholder="Ej: Sistemas, Dirección..." required value={form.departamento} onChange={f('departamento')} />
                </div>
              )}

              {form.tipoUsuario === 'PERSONAL_SALUD' && (
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest">Cargo *</label>
                    <input className={inputCls} placeholder="Ej: Médico Internista" required value={form.cargo} onChange={f('cargo')} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest">N° Licencia *</label>
                      <input type="number" className={inputCls} placeholder="123456" required
                        value={form.numLicencia ?? ''} onChange={(e) => setForm((p) => ({ ...p, numLicencia: Number(e.target.value) || undefined }))} />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest">Institución *</label>
                      <input className={inputCls} placeholder="Clínica Valle" required value={form.institucion} onChange={f('institucion')} />
                    </div>
                  </div>
                </div>
              )}

              {form.tipoUsuario === 'PACIENTE' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest">N° Documento *</label>
                      <input type="number" className={inputCls} placeholder="1234567890" required
                        value={form.numDocumento ?? ''} onChange={(e) => setForm((p) => ({ ...p, numDocumento: Number(e.target.value) || undefined }))} />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest">Fecha Nacimiento *</label>
                      <input type="datetime-local" className={inputCls} required value={form.fechaNacimiento} onChange={f('fechaNacimiento')} />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest">Grupo Sanguíneo</label>
                      <select className={inputCls} value={form.grupoSanguineo} onChange={f('grupoSanguineo')}>
                        <option value="">Seleccionar</option>
                        {['A+','A-','B+','B-','AB+','AB-','O+','O-'].map((g) => <option key={g}>{g}</option>)}
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest">Género</label>
                      <select className={inputCls} value={form.genero} onChange={f('genero')}>
                        <option value="">Seleccionar</option>
                        <option value="MASCULINO">Masculino</option>
                        <option value="FEMENINO">Femenino</option>
                        <option value="OTRO">Otro</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest">EPS</label>
                      <input className={inputCls} placeholder="Sura, Sanitas..." value={form.eps} onChange={f('eps')} />
                    </div>
                  </div>
                </div>
              )}

              {/* Buttons */}
              <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
                <button type="button" onClick={() => setModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-700 bg-white
                             border border-gray-200 hover:bg-gray-50 transition-all">
                  Cancelar
                </button>
                <button type="submit" disabled={saving}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold
                             text-white bg-verde-600 hover:bg-verde-700 disabled:opacity-60
                             transition-all shadow-md">
                  {saving ? (
                    <><svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>Guardando...</>
                  ) : 'Registrar Usuario'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
