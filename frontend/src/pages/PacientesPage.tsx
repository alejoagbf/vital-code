import { useState, useEffect, useCallback, type FormEvent } from 'react'
import toast from 'react-hot-toast'
import DashboardLayout from '../components/layout/DashboardLayout'
import Modal from '../components/ui/Modal'
import ConfirmDialog from '../components/ui/ConfirmDialog'
import Pagination from '../components/ui/Pagination'
import {
  listarPacientes, crearPaciente, actualizarPaciente, eliminarPaciente,
  filtrarPacientesPorEps, buscarPacientesPorDocumento, filtrarPacientesPorEstado,
} from '../services/api'
import type { Paciente, PacientePayload, FormMode, GrupoSanguineo, Genero, EstadoUsuario } from '../types'
import {
  Search, UserPlus, Pencil, Trash2, Users, UserCheck, UserX, Droplets,
  User, Mail, Lock, Phone, CreditCard, Calendar, HeartPulse, Building2,
  CheckCircle2, Filter, X as XIcon,
} from 'lucide-react'

const INITIAL_FORM: PacientePayload = {
  nombre: '', apellido: '', correo: '', contraseña: '', telefono: '',
  estado: 'ACTIVO', numDocumento: '', fechaNacimiento: '',
  grupoSanguineo: 'O+', genero: 'MASCULINO', eps: '',
}
const GRUPOS_SANGUINEOS: GrupoSanguineo[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
const GENEROS: Genero[] = ['MASCULINO', 'FEMENINO', 'OTRO']

const AVATAR_COLORS = [
  'from-blue-500 to-blue-700', 'from-violet-500 to-violet-700',
  'from-cyan-500 to-cyan-700', 'from-teal-500 to-teal-700', 'from-indigo-500 to-indigo-700',
]
const avatarColor = (name: string) => AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length]

// ── Input con ícono reutilizable ───────────────────────────────────────────────
function Field({
  label, icon, required, children,
}: { label: string; icon: React.ReactNode; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest">
        {label}{required && <span className="text-primary-500 ml-0.5">*</span>}
      </label>
      <div className="relative group">
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400
                        group-focus-within:text-primary-500 transition-colors duration-200 pointer-events-none z-10">
          {icon}
        </div>
        {children}
      </div>
    </div>
  )
}

const inputCls = 'w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm text-gray-800 placeholder-gray-400 outline-none focus:bg-white focus:border-primary-400 focus:ring-4 focus:ring-primary-500/10 transition-all duration-200'
const selectCls = inputCls + ' appearance-none cursor-pointer'

export default function PacientesPage() {
  const [pacientes, setPacientes] = useState<Paciente[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [search, setSearch] = useState('')

  const [modalOpen, setModalOpen] = useState(false)
  const [mode, setMode] = useState<FormMode>('create')
  const [selected, setSelected] = useState<Paciente | null>(null)
  const [form, setForm] = useState<PacientePayload>(INITIAL_FORM)
  const [saving, setSaving] = useState(false)

  const [confirmOpen, setConfirmOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [deleting, setDeleting] = useState(false)

  const [filtroEpsInput, setFiltroEpsInput] = useState('')
  const [filtroDocInput, setFiltroDocInput] = useState('')
  const [filtroEstado, setFiltroEstado] = useState<'TODOS' | 'ACTIVO' | 'INACTIVO'>('TODOS')
  const [filtroActivo, setFiltroActivo] = useState<string | null>(null)

  const fetchPacientes = useCallback(async () => {
    setLoading(true)
    try {
      const res = await listarPacientes(page)
      setPacientes(res.content); setTotalPages(res.totalPages)
    } catch { toast.error('Error al cargar los pacientes.') }
    finally { setLoading(false) }
  }, [page])

  useEffect(() => { fetchPacientes() }, [fetchPacientes])

  const filtered = pacientes.filter((p) => {
    const q = search.toLowerCase()
    return p.nombre.toLowerCase().includes(q) || p.apellido.toLowerCase().includes(q) ||
      p.numDocumento.includes(q) || p.correo.toLowerCase().includes(q)
  })

  const activos   = pacientes.filter((p) => p.estado === 'ACTIVO').length
  const inactivos = pacientes.filter((p) => p.estado === 'INACTIVO').length

  const openCreate = () => { setMode('create'); setSelected(null); setForm(INITIAL_FORM); setModalOpen(true) }
  const openEdit = (p: Paciente) => {
    setMode('edit'); setSelected(p)
    setForm({
      nombre: p.nombre, apellido: p.apellido, correo: p.correo, contraseña: '',
      telefono: p.telefono, estado: p.estado, numDocumento: p.numDocumento,
      fechaNacimiento: p.fechaNacimiento.slice(0, 10),
      grupoSanguineo: p.grupoSanguineo, genero: p.genero, eps: p.eps,
    })
    setModalOpen(true)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault(); setSaving(true)
    try {
      if (mode === 'create') { await crearPaciente(form); toast.success('Paciente creado.') }
      else if (selected) { await actualizarPaciente(selected.idPaciente, form); toast.success('Paciente actualizado.') }
      setModalOpen(false); fetchPacientes()
    } catch { toast.error('Ocurrió un error. Intenta de nuevo.') }
    finally { setSaving(false) }
  }

  const limpiarFiltros = () => {
    setFiltroEpsInput('')
    setFiltroDocInput('')
    setFiltroEstado('TODOS')
    setFiltroActivo(null)
    fetchPacientes()
  }

  const aplicarFiltroEps = async () => {
    if (!filtroEpsInput.trim()) return
    setLoading(true)
    try {
      const data = await filtrarPacientesPorEps(filtroEpsInput.trim())
      setPacientes(data); setTotalPages(1); setPage(0)
      setFiltroActivo(`EPS: ${filtroEpsInput.trim()}`)
    } catch { toast.error('Error al filtrar por EPS') }
    finally { setLoading(false) }
  }

  const aplicarFiltroDoc = async () => {
    if (!filtroDocInput.trim()) return
    setLoading(true)
    try {
      const data = await buscarPacientesPorDocumento(Number(filtroDocInput))
      setPacientes(data); setTotalPages(1); setPage(0)
      setFiltroActivo(`Documento: ${filtroDocInput}`)
      if (data.length === 0) toast.error('No se encontró paciente con ese documento.')
    } catch { toast.error('Error al buscar por documento') }
    finally { setLoading(false) }
  }

  const aplicarFiltroEstado = async (estado: 'TODOS' | 'ACTIVO' | 'INACTIVO') => {
    setFiltroEstado(estado)
    if (estado === 'TODOS') { limpiarFiltros(); return }
    setLoading(true)
    try {
      const data = await filtrarPacientesPorEstado(estado === 'ACTIVO')
      setPacientes(data); setTotalPages(1); setPage(0)
      setFiltroActivo(`Estado: ${estado}`)
    } catch { toast.error('Error al filtrar por estado') }
    finally { setLoading(false) }
  }

  const openDelete = (id: number) => { setDeleteId(id); setConfirmOpen(true) }
  const handleDelete = async () => {
    if (!deleteId) return; setDeleting(true)
    try {
      await eliminarPaciente(deleteId); toast.success('Paciente eliminado.')
      setConfirmOpen(false); fetchPacientes()
    } catch { toast.error('Error al eliminar.') }
    finally { setDeleting(false) }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">

        {/* Header profesional */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-6 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-verde-50 to-verde-100 border border-verde-200 flex items-center justify-center flex-shrink-0">
              <Users className="w-7 h-7 text-verde-600" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-navy-900 tracking-tight">Gestión de Pacientes</h1>
              <p className="text-sm text-gray-500 mt-0.5">Administra historiales clínicos y datos personales de pacientes registrados.</p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-canvas border border-gray-100">
            <span className="w-1.5 h-1.5 rounded-full bg-verde-500 animate-pulse" />
            <span className="text-[11px] font-bold text-gray-600 uppercase tracking-wider">{pacientes.length} en sistema</span>
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { icon: <Users className="w-5 h-5 text-white" />, value: pacientes.length, label: 'Total pacientes', from: 'from-primary-500', to: 'to-primary-700' },
            { icon: <UserCheck className="w-5 h-5 text-white" />, value: activos, label: 'Pacientes activos', from: 'from-emerald-500', to: 'to-emerald-700' },
            { icon: <UserX className="w-5 h-5 text-white" />, value: inactivos, label: 'Pacientes inactivos', from: 'from-red-400', to: 'to-red-600' },
          ].map((s) => (
            <div key={s.label} className="stat-card">
              <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${s.from} ${s.to} flex items-center justify-center shadow-md flex-shrink-0`}>{s.icon}</div>
              <div><p className="text-2xl font-black text-gray-900">{s.value}</p><p className="text-xs text-gray-500 font-medium">{s.label}</p></div>
            </div>
          ))}
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Buscar por nombre, documento…" className="form-input pl-10"
              value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <button onClick={openCreate} className="btn-primary flex-shrink-0">
            <UserPlus className="w-4 h-4" /> Nuevo Paciente
          </button>
        </div>

        {/* Filter bar */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-4 space-y-3">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Filtros de consulta</span>
            {filtroActivo && (
              <button onClick={limpiarFiltros}
                className="ml-auto flex items-center gap-1.5 px-3 py-1 rounded-full bg-verde-50 text-verde-700 border border-verde-200 text-xs font-bold hover:bg-verde-100 transition-colors">
                <span>{filtroActivo}</span>
                <XIcon className="w-3 h-3" />
                Limpiar
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* EPS */}
            <div className="flex gap-2">
              <input type="text" placeholder="Filtrar por EPS…"
                className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-verde-400 focus:ring-2 focus:ring-verde-500/10 transition-all"
                value={filtroEpsInput}
                onChange={(e) => setFiltroEpsInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && aplicarFiltroEps()} />
              <button onClick={aplicarFiltroEps} disabled={!filtroEpsInput.trim() || loading}
                className="px-3 py-2 rounded-xl bg-verde-600 hover:bg-verde-700 text-white text-xs font-bold disabled:opacity-40 transition-colors">
                Filtrar
              </button>
            </div>
            {/* Documento */}
            <div className="flex gap-2">
              <input type="number" placeholder="Buscar por documento…"
                className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-navy-400 focus:ring-2 focus:ring-navy-500/10 transition-all"
                value={filtroDocInput}
                onChange={(e) => setFiltroDocInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && aplicarFiltroDoc()} />
              <button onClick={aplicarFiltroDoc} disabled={!filtroDocInput.trim() || loading}
                className="px-3 py-2 rounded-xl bg-navy-700 hover:bg-navy-800 text-white text-xs font-bold disabled:opacity-40 transition-colors">
                Buscar
              </button>
            </div>
            {/* Estado */}
            <div className="flex gap-1.5">
              {(['TODOS', 'ACTIVO', 'INACTIVO'] as const).map((e) => (
                <button key={e} onClick={() => aplicarFiltroEstado(e)}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                    filtroEstado === e
                      ? e === 'ACTIVO' ? 'bg-emerald-500 text-white shadow-sm'
                        : e === 'INACTIVO' ? 'bg-red-500 text-white shadow-sm'
                        : 'bg-navy-700 text-white shadow-sm'
                      : 'bg-gray-50 text-gray-500 hover:bg-gray-100 border border-gray-200'
                  }`}>
                  {e}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-card border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gradient-header">
                  <th className="table-th">Paciente</th>
                  <th className="table-th">Documento</th>
                  <th className="table-th">Contacto</th>
                  <th className="table-th">EPS</th>
                  <th className="table-th">Grupo</th>
                  <th className="table-th">Estado</th>
                  <th className="table-th text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={7} className="py-16 text-center">
                    <svg className="animate-spin w-7 h-7 mx-auto mb-3 text-primary-500" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    <p className="text-gray-400 text-sm font-medium">Cargando pacientes…</p>
                  </td></tr>
                ) : filtered.length === 0 ? (
                  <tr><td colSpan={7} className="py-16 text-center">
                    <Users className="w-10 h-10 mx-auto mb-3 text-gray-200" />
                    <p className="text-gray-400 text-sm font-medium">No se encontraron pacientes.</p>
                  </td></tr>
                ) : filtered.map((p) => (
                  <tr key={p.idPaciente} className="table-row">
                    <td className="table-td">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${avatarColor(p.nombre)} flex items-center justify-center text-white font-black text-xs flex-shrink-0 shadow-sm`}>
                          {p.nombre[0]}{p.apellido[0]}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{p.nombre} {p.apellido}</p>
                          <p className="text-xs text-gray-400 mt-0.5">{p.correo}</p>
                        </div>
                      </div>
                    </td>
                    <td className="table-td font-mono text-xs text-gray-600">{p.numDocumento}</td>
                    <td className="table-td text-gray-600">{p.telefono}</td>
                    <td className="table-td text-gray-600">{p.eps}</td>
                    <td className="table-td">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-blue-50 text-blue-700 border border-blue-100">
                        <Droplets className="w-3 h-3" />{p.grupoSanguineo}
                      </span>
                    </td>
                    <td className="table-td">
                      <span className={p.estado === 'ACTIVO' ? 'badge-active' : 'badge-inactive'}>
                        <span className={`w-1.5 h-1.5 rounded-full ${p.estado === 'ACTIVO' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                        {p.estado}
                      </span>
                    </td>
                    <td className="table-td">
                      <div className="flex items-center justify-center gap-1">
                        <button onClick={() => openEdit(p)} className="btn-icon text-blue-500 hover:bg-blue-50 hover:text-blue-700" title="Editar"><Pencil className="w-4 h-4" /></button>
                        <button onClick={() => openDelete(p.idPaciente)} className="btn-icon text-red-400 hover:bg-red-50 hover:text-red-600" title="Eliminar"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      </div>

      {/* ══════════════════ MODAL CRUD ══════════════════ */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={mode === 'create' ? 'Registro de Nuevo Paciente' : 'Editar Paciente'}
        subtitle="Complete la información para dar de alta en el sistema"
        icon={<UserPlus />}
        size="xl"
      >
        <form onSubmit={handleSubmit} className="space-y-8">

          {/* ── Sección: Datos personales ── */}
          <div>
            <div className="flex items-center gap-2 mb-5">
              <div className="w-1 h-5 rounded-full bg-gradient-to-b from-primary-500 to-accent-500" />
              <p className="text-xs font-black text-gray-500 uppercase tracking-widest">Datos personales</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              <Field label="Nombre" icon={<User className="w-4 h-4" />} required>
                <input className={inputCls} placeholder="Juan" required
                  value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} />
              </Field>

              <Field label="Apellido" icon={<User className="w-4 h-4" />} required>
                <input className={inputCls} placeholder="Pérez" required
                  value={form.apellido} onChange={(e) => setForm({ ...form, apellido: e.target.value })} />
              </Field>

              <Field label="Número de documento" icon={<CreditCard className="w-4 h-4" />} required>
                <input className={inputCls} placeholder="1234567890" required
                  value={form.numDocumento} onChange={(e) => setForm({ ...form, numDocumento: e.target.value })} />
              </Field>

              <Field label="Fecha de nacimiento" icon={<Calendar className="w-4 h-4" />} required>
                <input type="date" className={inputCls} required
                  value={form.fechaNacimiento} onChange={(e) => setForm({ ...form, fechaNacimiento: e.target.value })} />
              </Field>

              <Field label="Género" icon={<Users className="w-4 h-4" />} required>
                <select className={selectCls} value={form.genero}
                  onChange={(e) => setForm({ ...form, genero: e.target.value as Genero })}>
                  {GENEROS.map((g) => <option key={g}>{g}</option>)}
                </select>
              </Field>

              <Field label="Grupo sanguíneo" icon={<Droplets className="w-4 h-4" />} required>
                <select className={selectCls} value={form.grupoSanguineo}
                  onChange={(e) => setForm({ ...form, grupoSanguineo: e.target.value as GrupoSanguineo })}>
                  {GRUPOS_SANGUINEOS.map((g) => <option key={g}>{g}</option>)}
                </select>
              </Field>

              <div className="md:col-span-2">
                <Field label="EPS" icon={<Building2 className="w-4 h-4" />} required>
                  <input className={inputCls} placeholder="Ej: Sura, Nueva EPS, Compensar…" required
                    value={form.eps} onChange={(e) => setForm({ ...form, eps: e.target.value })} />
                </Field>
              </div>
            </div>
          </div>

          {/* ── Sección: Cuenta de usuario ── */}
          <div className="border-t border-gray-100 pt-6">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-1 h-5 rounded-full bg-gradient-to-b from-accent-500 to-accent-700" />
              <p className="text-xs font-black text-gray-500 uppercase tracking-widest">Cuenta de usuario</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              <Field label="Correo electrónico" icon={<Mail className="w-4 h-4" />} required>
                <input type="email" className={inputCls} placeholder="correo@ejemplo.com" required
                  value={form.correo} onChange={(e) => setForm({ ...form, correo: e.target.value })} />
              </Field>

              <Field label={mode === 'edit' ? 'Contraseña (vacío = sin cambio)' : 'Contraseña'} icon={<Lock className="w-4 h-4" />} required={mode === 'create'}>
                <input type="password" className={inputCls} placeholder="••••••••"
                  required={mode === 'create'}
                  value={form.contraseña} onChange={(e) => setForm({ ...form, contraseña: e.target.value })} />
              </Field>

              <Field label="Teléfono" icon={<Phone className="w-4 h-4" />} required>
                <input className={inputCls} placeholder="3001234567" required
                  value={form.telefono} onChange={(e) => setForm({ ...form, telefono: e.target.value })} />
              </Field>

              <Field label="Estado" icon={<HeartPulse className="w-4 h-4" />} required>
                <select className={selectCls} value={form.estado}
                  onChange={(e) => setForm({ ...form, estado: e.target.value as EstadoUsuario })}>
                  <option value="ACTIVO">ACTIVO</option>
                  <option value="INACTIVO">INACTIVO</option>
                </select>
              </Field>
            </div>
          </div>

          {/* ── Botones ── */}
          <div className="flex justify-end gap-3 border-t border-gray-100 pt-6">
            <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary">
              Cancelar
            </button>
            <button type="submit" disabled={saving}
              className="flex items-center gap-2.5 px-7 py-3 rounded-xl text-white text-sm font-bold
                         transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed
                         shadow-lg hover:shadow-[0_8px_25px_rgba(30,58,138,0.3)]
                         hover:-translate-y-0.5 active:scale-[0.98]"
              style={{ background: 'linear-gradient(135deg, #1E3A8A 0%, #152866 100%)' }}>
              {saving ? (
                <><svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>Guardando…</>
              ) : (
                <><CheckCircle2 className="w-4 h-4" />
                  {mode === 'create' ? 'Registrar paciente' : 'Guardar cambios'}</>
              )}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog isOpen={confirmOpen}
        message="Esta acción eliminará al paciente permanentemente del sistema."
        onConfirm={handleDelete} onCancel={() => setConfirmOpen(false)} loading={deleting} />
    </DashboardLayout>
  )
}
