import { useState, useEffect, useCallback, type FormEvent } from 'react'
import toast from 'react-hot-toast'
import DashboardLayout from '../components/layout/DashboardLayout'
import Modal from '../components/ui/Modal'
import ConfirmDialog from '../components/ui/ConfirmDialog'
import Pagination from '../components/ui/Pagination'
import {
  listarPersonalSalud, crearPersonalSalud, actualizarPersonalSalud, eliminarPersonalSalud,
} from '../services/api'
import type { PersonalSalud, PersonalSaludPayload, FormMode, EstadoUsuario } from '../types'
import {
  Search, UserPlus, Pencil, Trash2, Stethoscope, UserCheck, UserX, Building2,
  User, Mail, Lock, Phone, BadgeCheck, Briefcase, HeartPulse, CheckCircle2,
} from 'lucide-react'

const INITIAL_FORM: PersonalSaludPayload = {
  nombre: '', apellido: '', correo: '', contraseña: '', telefono: '',
  estado: 'ACTIVO', cargo: '', numLicencia: '', institucion: '',
}

const AVATAR_COLORS = [
  'from-teal-500 to-teal-700', 'from-cyan-500 to-cyan-700',
  'from-emerald-500 to-emerald-700', 'from-sky-500 to-sky-700', 'from-green-500 to-green-700',
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

export default function PersonalSaludPage() {
  const [personal, setPersonal] = useState<PersonalSalud[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [search, setSearch] = useState('')

  const [modalOpen, setModalOpen] = useState(false)
  const [mode, setMode] = useState<FormMode>('create')
  const [selected, setSelected] = useState<PersonalSalud | null>(null)
  const [form, setForm] = useState<PersonalSaludPayload>(INITIAL_FORM)
  const [saving, setSaving] = useState(false)

  const [confirmOpen, setConfirmOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [deleting, setDeleting] = useState(false)

  const fetchPersonal = useCallback(async () => {
    setLoading(true)
    try {
      const res = await listarPersonalSalud(page)
      setPersonal(res.content); setTotalPages(res.totalPages)
    } catch { toast.error('Error al cargar el personal de salud.') }
    finally { setLoading(false) }
  }, [page])

  useEffect(() => { fetchPersonal() }, [fetchPersonal])

  const filtered = personal.filter((p) => {
    const q = search.toLowerCase()
    return p.nombre.toLowerCase().includes(q) || p.apellido.toLowerCase().includes(q) ||
      p.cargo.toLowerCase().includes(q) || p.institucion.toLowerCase().includes(q) ||
      p.numLicencia.toLowerCase().includes(q)
  })

  const activos   = personal.filter((p) => p.estado === 'ACTIVO').length
  const inactivos = personal.filter((p) => p.estado === 'INACTIVO').length

  const openCreate = () => { setMode('create'); setSelected(null); setForm(INITIAL_FORM); setModalOpen(true) }
  const openEdit = (p: PersonalSalud) => {
    setMode('edit'); setSelected(p)
    setForm({
      nombre: p.nombre, apellido: p.apellido, correo: p.correo, contraseña: '',
      telefono: p.telefono, estado: p.estado, cargo: p.cargo,
      numLicencia: p.numLicencia, institucion: p.institucion,
    })
    setModalOpen(true)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault(); setSaving(true)
    try {
      if (mode === 'create') { await crearPersonalSalud(form); toast.success('Personal registrado.') }
      else if (selected) { await actualizarPersonalSalud(selected.idPersonalSalud, form); toast.success('Registro actualizado.') }
      setModalOpen(false); fetchPersonal()
    } catch { toast.error('Ocurrió un error. Intenta de nuevo.') }
    finally { setSaving(false) }
  }

  const openDelete = (id: number) => { setDeleteId(id); setConfirmOpen(true) }
  const handleDelete = async () => {
    if (!deleteId) return; setDeleting(true)
    try {
      await eliminarPersonalSalud(deleteId); toast.success('Registro eliminado.')
      setConfirmOpen(false); fetchPersonal()
    } catch { toast.error('Error al eliminar.') }
    finally { setDeleting(false) }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">

        {/* Header profesional */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-6 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-50 to-cyan-100 border border-cyan-200 flex items-center justify-center flex-shrink-0">
              <Stethoscope className="w-7 h-7 text-cyan-600" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-navy-900 tracking-tight">Personal de Salud</h1>
              <p className="text-sm text-gray-500 mt-0.5">Médicos, enfermeros y especialistas habilitados en la red clínica.</p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-canvas border border-gray-100">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
            <span className="text-[11px] font-bold text-gray-600 uppercase tracking-wider">{personal.length} profesionales</span>
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { icon: <Stethoscope className="w-5 h-5 text-cyan-600" />, value: personal.length, label: 'TOTAL PERSONAL',  iconBg: 'bg-cyan-50',    pillCls: 'bg-cyan-100 text-cyan-700',     pillText: 'EQUIPO' },
            { icon: <UserCheck className="w-5 h-5 text-verde-600" />,  value: activos,         label: 'PERSONAL ACTIVO', iconBg: 'bg-verde-50',  pillCls: 'bg-verde-100 text-verde-700',   pillText: 'EN LÍNEA' },
            { icon: <UserX className="w-5 h-5 text-red-500" />,        value: inactivos,       label: 'INACTIVO',        iconBg: 'bg-red-50',     pillCls: 'bg-red-100 text-red-700',       pillText: 'PAUSA' },
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
            <input type="text" placeholder="Buscar por nombre, cargo, institución…"
              className="w-full bg-canvas border border-transparent rounded-xl pl-11 pr-4 py-3 text-sm text-navy-900 placeholder-gray-400 outline-none focus:bg-white focus:border-cyan-300 focus:ring-2 focus:ring-cyan-500/10 transition-all"
              value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <button onClick={openCreate}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-white text-sm font-bold
                       bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700
                       shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all">
            <UserPlus className="w-4 h-4" /> Nuevo Personal
          </button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-card border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gradient-header">
                  <th className="table-th">Personal</th>
                  <th className="table-th">Cargo</th>
                  <th className="table-th">N° Licencia</th>
                  <th className="table-th">Institución</th>
                  <th className="table-th">Teléfono</th>
                  <th className="table-th">Estado</th>
                  <th className="table-th text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={7} className="py-16 text-center">
                    <svg className="animate-spin w-7 h-7 mx-auto mb-3 text-accent-500" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    <p className="text-gray-400 text-sm font-medium">Cargando personal…</p>
                  </td></tr>
                ) : filtered.length === 0 ? (
                  <tr><td colSpan={7} className="py-16 text-center">
                    <Stethoscope className="w-10 h-10 mx-auto mb-3 text-gray-200" />
                    <p className="text-gray-400 text-sm font-medium">No se encontró personal de salud.</p>
                  </td></tr>
                ) : filtered.map((p) => (
                  <tr key={p.idPersonalSalud} className="table-row">
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
                    <td className="table-td">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold bg-cyan-50 text-cyan-700 border border-cyan-100">{p.cargo}</span>
                    </td>
                    <td className="table-td font-mono text-xs text-gray-500">{p.numLicencia}</td>
                    <td className="table-td">
                      <span className="inline-flex items-center gap-1.5 text-gray-600">
                        <Building2 className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />{p.institucion}
                      </span>
                    </td>
                    <td className="table-td text-gray-600">{p.telefono}</td>
                    <td className="table-td">
                      <span className={p.estado === 'ACTIVO' ? 'badge-active' : 'badge-inactive'}>
                        <span className={`w-1.5 h-1.5 rounded-full ${p.estado === 'ACTIVO' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                        {p.estado}
                      </span>
                    </td>
                    <td className="table-td">
                      <div className="flex items-center justify-center gap-1">
                        <button onClick={() => openEdit(p)} className="btn-icon text-blue-500 hover:bg-blue-50 hover:text-blue-700" title="Editar"><Pencil className="w-4 h-4" /></button>
                        <button onClick={() => openDelete(p.idPersonalSalud)} className="btn-icon text-red-400 hover:bg-red-50 hover:text-red-600" title="Eliminar"><Trash2 className="w-4 h-4" /></button>
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
        title={mode === 'create' ? 'Registro de Nuevo Personal' : 'Editar Personal de Salud'}
        subtitle="Complete la información para dar de alta en el sistema"
        icon={<Stethoscope />}
      >
        <form onSubmit={handleSubmit} className="space-y-8">

          {/* Datos profesionales */}
          <div>
            <div className="flex items-center gap-2 mb-5">
              <div className="w-1 h-5 rounded-full bg-gradient-to-b from-accent-500 to-accent-700" />
              <p className="text-xs font-black text-gray-500 uppercase tracking-widest">Datos profesionales</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              <Field label="Nombre" icon={<User className="w-4 h-4" />} required>
                <input className={inputCls} placeholder="Carlos" required
                  value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} />
              </Field>

              <Field label="Apellido" icon={<User className="w-4 h-4" />} required>
                <input className={inputCls} placeholder="Rodríguez" required
                  value={form.apellido} onChange={(e) => setForm({ ...form, apellido: e.target.value })} />
              </Field>

              <Field label="Cargo" icon={<Briefcase className="w-4 h-4" />} required>
                <input className={inputCls} placeholder="Ej: Médico General, Enfermero…" required
                  value={form.cargo} onChange={(e) => setForm({ ...form, cargo: e.target.value })} />
              </Field>

              <Field label="Número de licencia" icon={<BadgeCheck className="w-4 h-4" />} required>
                <input className={inputCls} placeholder="LIC-00001" required
                  value={form.numLicencia} onChange={(e) => setForm({ ...form, numLicencia: e.target.value })} />
              </Field>

              <div className="md:col-span-2">
                <Field label="Institución" icon={<Building2 className="w-4 h-4" />} required>
                  <input className={inputCls} placeholder="Ej: Hospital Universitario, Clínica Valle…" required
                    value={form.institucion} onChange={(e) => setForm({ ...form, institucion: e.target.value })} />
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
                <><CheckCircle2 className="w-4 h-4" />{mode === 'create' ? 'Registrar personal' : 'Guardar cambios'}</>
              )}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog isOpen={confirmOpen}
        message="Esta acción eliminará al personal de salud permanentemente del sistema."
        onConfirm={handleDelete} onCancel={() => setConfirmOpen(false)} loading={deleting} />
    </DashboardLayout>
  )
}
