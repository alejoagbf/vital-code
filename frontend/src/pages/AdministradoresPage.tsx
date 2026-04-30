import { useState, useEffect, useCallback, type FormEvent } from 'react'
import toast from 'react-hot-toast'
import DashboardLayout from '../components/layout/DashboardLayout'
import Modal from '../components/ui/Modal'
import ConfirmDialog from '../components/ui/ConfirmDialog'
import Pagination from '../components/ui/Pagination'
import {
  listarAdministradores, crearAdministrador, actualizarAdministrador, eliminarAdministrador,
} from '../services/api'
import type { Administrador, AdministradorPayload, FormMode, EstadoUsuario } from '../types'
import {
  Search, UserPlus, Pencil, Trash2, ShieldCheck, UserCheck, UserX,
  Clock, Layers, User, Mail, Lock, Phone, HeartPulse, CheckCircle2,
} from 'lucide-react'

const INITIAL_FORM: AdministradorPayload = {
  nombre: '', apellido: '', correo: '', contraseña: '', telefono: '',
  estado: 'ACTIVO', departamento: '',
}

const AVATAR_COLORS = [
  'from-violet-500 to-violet-700', 'from-purple-500 to-purple-700',
  'from-indigo-500 to-indigo-700', 'from-fuchsia-500 to-fuchsia-700', 'from-blue-600 to-blue-800',
]
const avatarColor = (name: string) => AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length]

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

export default function AdministradoresPage() {
  const [administradores, setAdministradores] = useState<Administrador[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [search, setSearch] = useState('')

  const [modalOpen, setModalOpen] = useState(false)
  const [mode, setMode] = useState<FormMode>('create')
  const [selected, setSelected] = useState<Administrador | null>(null)
  const [form, setForm] = useState<AdministradorPayload>(INITIAL_FORM)
  const [saving, setSaving] = useState(false)

  const [confirmOpen, setConfirmOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [deleting, setDeleting] = useState(false)

  const fetchAdministradores = useCallback(async () => {
    setLoading(true)
    try {
      const res = await listarAdministradores(page)
      setAdministradores(res.content); setTotalPages(res.totalPages)
    } catch { toast.error('Error al cargar los administradores.') }
    finally { setLoading(false) }
  }, [page])

  useEffect(() => { fetchAdministradores() }, [fetchAdministradores])

  const filtered = administradores.filter((a) => {
    const q = search.toLowerCase()
    return a.nombre.toLowerCase().includes(q) || a.apellido.toLowerCase().includes(q) ||
      a.correo.toLowerCase().includes(q) || a.departamento.toLowerCase().includes(q)
  })

  const activos   = administradores.filter((a) => a.estado === 'ACTIVO').length
  const inactivos = administradores.filter((a) => a.estado === 'INACTIVO').length

  const openCreate = () => { setMode('create'); setSelected(null); setForm(INITIAL_FORM); setModalOpen(true) }
  const openEdit = (a: Administrador) => {
    setMode('edit'); setSelected(a)
    setForm({
      nombre: a.nombre, apellido: a.apellido, correo: a.correo, contraseña: '',
      telefono: a.telefono, estado: a.estado, departamento: a.departamento,
    })
    setModalOpen(true)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault(); setSaving(true)
    try {
      if (mode === 'create') { await crearAdministrador(form); toast.success('Administrador registrado.') }
      else if (selected) { await actualizarAdministrador(selected.idAdministrador, form); toast.success('Administrador actualizado.') }
      setModalOpen(false); fetchAdministradores()
    } catch { toast.error('Ocurrió un error. Intenta de nuevo.') }
    finally { setSaving(false) }
  }

  const openDelete = (id: number) => { setDeleteId(id); setConfirmOpen(true) }
  const handleDelete = async () => {
    if (!deleteId) return; setDeleting(true)
    try {
      await eliminarAdministrador(deleteId); toast.success('Administrador eliminado.')
      setConfirmOpen(false); fetchAdministradores()
    } catch { toast.error('Error al eliminar.') }
    finally { setDeleting(false) }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">

        {/* Header profesional */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-6 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-50 to-violet-100 border border-violet-200 flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-7 h-7 text-violet-600" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-navy-900 tracking-tight">Administradores</h1>
              <p className="text-sm text-gray-500 mt-0.5">Gestiona los administradores del sistema y sus departamentos asignados.</p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-canvas border border-gray-100">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse" />
            <span className="text-[11px] font-bold text-gray-600 uppercase tracking-wider">{administradores.length} cuentas</span>
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { icon: <ShieldCheck className="w-5 h-5 text-violet-600" />, value: administradores.length, label: 'TOTAL ADMINISTRADORES', iconBg: 'bg-violet-50', pillCls: 'bg-violet-100 text-violet-700', pillText: 'EQUIPO' },
            { icon: <UserCheck className="w-5 h-5 text-verde-600" />,    value: activos,                 label: 'ACTIVOS',                iconBg: 'bg-verde-50',  pillCls: 'bg-verde-100 text-verde-700',   pillText: 'EN LÍNEA' },
            { icon: <UserX className="w-5 h-5 text-red-500" />,          value: inactivos,               label: 'INACTIVOS',              iconBg: 'bg-red-50',     pillCls: 'bg-red-100 text-red-700',       pillText: 'PAUSA' },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-2xl border border-gray-100 shadow-card p-5 hover:shadow-card-hover transition-all">
              <div className="flex items-start justify-between mb-3">
                <div className={`w-11 h-11 rounded-xl ${s.iconBg} flex items-center justify-center`}>{s.icon}</div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-black tracking-wider ${s.pillCls}`}>{s.pillText}</span>
              </div>
              <p className="text-3xl font-black text-navy-900 tracking-tight">{loading ? '—' : s.value}</p>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Toolbar */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-3 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          <div className="relative w-full sm:max-w-md flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Buscar administrador por nombre, correo o departamento…"
              className="w-full bg-canvas border border-transparent rounded-xl pl-11 pr-4 py-3 text-sm text-navy-900 placeholder-gray-400 outline-none focus:bg-white focus:border-violet-300 focus:ring-2 focus:ring-violet-500/10 transition-all"
              value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <button onClick={openCreate}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-white text-sm font-bold
                       bg-gradient-to-r from-violet-500 to-violet-600 hover:from-violet-600 hover:to-violet-700
                       shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all">
            <UserPlus className="w-4 h-4" /> Nuevo Administrador
          </button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-card border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gradient-header">
                  <th className="table-th">Administrador</th>
                  <th className="table-th">Departamento</th>
                  <th className="table-th">Teléfono</th>
                  <th className="table-th">Estado</th>
                  <th className="table-th">Último acceso</th>
                  <th className="table-th text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={6} className="py-16 text-center">
                    <svg className="animate-spin w-7 h-7 mx-auto mb-3 text-violet-500" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    <p className="text-gray-400 text-sm font-medium">Cargando administradores…</p>
                  </td></tr>
                ) : filtered.length === 0 ? (
                  <tr><td colSpan={6} className="py-16 text-center">
                    <ShieldCheck className="w-10 h-10 mx-auto mb-3 text-gray-200" />
                    <p className="text-gray-400 text-sm font-medium">No se encontraron administradores.</p>
                  </td></tr>
                ) : filtered.map((a) => (
                  <tr key={a.idAdministrador} className="table-row">
                    <td className="table-td">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${avatarColor(a.nombre)} flex items-center justify-center text-white font-black text-xs flex-shrink-0 shadow-sm`}>
                          {a.nombre[0]}{a.apellido[0]}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{a.nombre} {a.apellido}</p>
                          <p className="text-xs text-gray-400 mt-0.5">{a.correo}</p>
                        </div>
                      </div>
                    </td>
                    <td className="table-td">
                      <span className="inline-flex items-center gap-1.5 text-gray-600">
                        <Layers className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />{a.departamento}
                      </span>
                    </td>
                    <td className="table-td text-gray-600">{a.telefono}</td>
                    <td className="table-td">
                      <span className={a.estado === 'ACTIVO' ? 'badge-active' : 'badge-inactive'}>
                        <span className={`w-1.5 h-1.5 rounded-full ${a.estado === 'ACTIVO' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                        {a.estado}
                      </span>
                    </td>
                    <td className="table-td">
                      {a.ultimoAcceso ? (
                        <span className="inline-flex items-center gap-1.5 text-gray-500 text-xs">
                          <Clock className="w-3.5 h-3.5 text-gray-400" />
                          {new Date(a.ultimoAcceso).toLocaleDateString('es-CO')}
                        </span>
                      ) : <span className="text-gray-300 text-xs">—</span>}
                    </td>
                    <td className="table-td">
                      <div className="flex items-center justify-center gap-1">
                        <button onClick={() => openEdit(a)} className="btn-icon text-blue-500 hover:bg-blue-50 hover:text-blue-700" title="Editar"><Pencil className="w-4 h-4" /></button>
                        <button onClick={() => openDelete(a.idAdministrador)} className="btn-icon text-red-400 hover:bg-red-50 hover:text-red-600" title="Eliminar"><Trash2 className="w-4 h-4" /></button>
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
        title={mode === 'create' ? 'Registro de Nuevo Administrador' : 'Editar Administrador'}
        subtitle="Complete la información para dar de alta en el sistema"
        icon={<ShieldCheck />}
      >
        <form onSubmit={handleSubmit} className="space-y-8">

          {/* Datos personales */}
          <div>
            <div className="flex items-center gap-2 mb-5">
              <div className="w-1 h-5 rounded-full bg-gradient-to-b from-violet-500 to-violet-700" />
              <p className="text-xs font-black text-gray-500 uppercase tracking-widest">Datos personales</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              <Field label="Nombre" icon={<User className="w-4 h-4" />} required>
                <input className={inputCls} placeholder="María" required
                  value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} />
              </Field>

              <Field label="Apellido" icon={<User className="w-4 h-4" />} required>
                <input className={inputCls} placeholder="Gómez" required
                  value={form.apellido} onChange={(e) => setForm({ ...form, apellido: e.target.value })} />
              </Field>

              <div className="md:col-span-2">
                <Field label="Departamento" icon={<Layers className="w-4 h-4" />} required>
                  <input className={inputCls} placeholder="Ej: Sistemas, Recursos Humanos, Dirección…" required
                    value={form.departamento} onChange={(e) => setForm({ ...form, departamento: e.target.value })} />
                </Field>
              </div>
            </div>
          </div>

          {/* Cuenta de usuario */}
          <div className="border-t border-gray-100 pt-6">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-1 h-5 rounded-full bg-gradient-to-b from-primary-500 to-accent-500" />
              <p className="text-xs font-black text-gray-500 uppercase tracking-widest">Cuenta de usuario</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              <Field label="Correo electrónico" icon={<Mail className="w-4 h-4" />} required>
                <input type="email" className={inputCls} placeholder="correo@healthtech.com" required
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

          {/* Botones */}
          <div className="flex justify-end gap-3 border-t border-gray-100 pt-6">
            <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary">Cancelar</button>
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
                <><CheckCircle2 className="w-4 h-4" />{mode === 'create' ? 'Registrar administrador' : 'Guardar cambios'}</>
              )}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog isOpen={confirmOpen}
        message="Esta acción eliminará al administrador permanentemente."
        onConfirm={handleDelete} onCancel={() => setConfirmOpen(false)} loading={deleting} />
    </DashboardLayout>
  )
}
