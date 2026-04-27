import { useState, useEffect, useCallback, type FormEvent } from 'react'
import toast from 'react-hot-toast'
import DashboardLayout from '../components/layout/DashboardLayout'
import Modal from '../components/ui/Modal'
import ConfirmDialog from '../components/ui/ConfirmDialog'
import Pagination from '../components/ui/Pagination'
import {
  listarPacientes,
  crearPaciente,
  actualizarPaciente,
  eliminarPaciente,
} from '../services/api'
import type { Paciente, PacientePayload, FormMode, GrupoSanguineo, Genero, EstadoUsuario } from '../types'
import {
  Search, UserPlus, Pencil, Trash2, Users, UserCheck, UserX, Droplets,
} from 'lucide-react'

const INITIAL_FORM: PacientePayload = {
  nombre: '', apellido: '', correo: '', contraseña: '', telefono: '',
  estado: 'ACTIVO', numDocumento: '', fechaNacimiento: '',
  grupoSanguineo: 'O+', genero: 'MASCULINO', eps: '',
}
const GRUPOS_SANGUINEOS: GrupoSanguineo[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
const GENEROS: Genero[] = ['MASCULINO', 'FEMENINO', 'OTRO']

// Avatar color based on initials
const AVATAR_COLORS = [
  'from-blue-500 to-blue-700',
  'from-violet-500 to-violet-700',
  'from-cyan-500 to-cyan-700',
  'from-teal-500 to-teal-700',
  'from-indigo-500 to-indigo-700',
]
const avatarColor = (name: string) =>
  AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length]

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

  const fetchPacientes = useCallback(async () => {
    setLoading(true)
    try {
      const res = await listarPacientes(page)
      setPacientes(res.content)
      setTotalPages(res.totalPages)
    } catch {
      toast.error('Error al cargar los pacientes.')
    } finally {
      setLoading(false)
    }
  }, [page])

  useEffect(() => { fetchPacientes() }, [fetchPacientes])

  const filtered = pacientes.filter((p) => {
    const q = search.toLowerCase()
    return (
      p.nombre.toLowerCase().includes(q) ||
      p.apellido.toLowerCase().includes(q) ||
      p.numDocumento.includes(q) ||
      p.correo.toLowerCase().includes(q)
    )
  })

  const activos   = pacientes.filter((p) => p.estado === 'ACTIVO').length
  const inactivos = pacientes.filter((p) => p.estado === 'INACTIVO').length

  const openCreate = () => {
    setMode('create'); setSelected(null); setForm(INITIAL_FORM); setModalOpen(true)
  }
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
      if (mode === 'create') {
        await crearPaciente(form); toast.success('Paciente creado correctamente.')
      } else if (selected) {
        await actualizarPaciente(selected.idPaciente, form)
        toast.success('Paciente actualizado correctamente.')
      }
      setModalOpen(false); fetchPacientes()
    } catch {
      toast.error('Ocurrió un error. Intenta de nuevo.')
    } finally {
      setSaving(false)
    }
  }

  const openDelete = (id: number) => { setDeleteId(id); setConfirmOpen(true) }
  const handleDelete = async () => {
    if (!deleteId) return
    setDeleting(true)
    try {
      await eliminarPaciente(deleteId)
      toast.success('Paciente eliminado.')
      setConfirmOpen(false); fetchPacientes()
    } catch {
      toast.error('Error al eliminar el paciente.')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <DashboardLayout title="Gestión de Pacientes" subtitle="Registro y control de pacientes">
      <div className="space-y-6 animate-fade-in">

        {/* ── Stat cards ─────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="stat-card">
            <div className="w-11 h-11 rounded-xl bg-gradient-btn flex items-center justify-center shadow-md">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-2xl font-black text-gray-900">{pacientes.length}</p>
              <p className="text-xs text-gray-500 font-medium">Total pacientes</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700
                            flex items-center justify-center shadow-md">
              <UserCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-2xl font-black text-gray-900">{activos}</p>
              <p className="text-xs text-gray-500 font-medium">Pacientes activos</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-red-400 to-red-600
                            flex items-center justify-center shadow-md">
              <UserX className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-2xl font-black text-gray-900">{inactivos}</p>
              <p className="text-xs text-gray-500 font-medium">Pacientes inactivos</p>
            </div>
          </div>
        </div>

        {/* ── Toolbar ────────────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nombre, documento…"
              className="form-input pl-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button onClick={openCreate} className="btn-primary flex-shrink-0">
            <UserPlus className="w-4 h-4" />
            Nuevo Paciente
          </button>
        </div>

        {/* ── Table card ─────────────────────────────────────────────────── */}
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
                  <tr>
                    <td colSpan={7} className="py-16 text-center">
                      <svg className="animate-spin w-7 h-7 mx-auto mb-3 text-primary-500"
                        fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10"
                          stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      <p className="text-gray-400 text-sm font-medium">Cargando pacientes…</p>
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-16 text-center">
                      <Users className="w-10 h-10 mx-auto mb-3 text-gray-200" />
                      <p className="text-gray-400 text-sm font-medium">No se encontraron pacientes.</p>
                    </td>
                  </tr>
                ) : (
                  filtered.map((p) => (
                    <tr key={p.idPaciente} className="table-row">
                      <td className="table-td">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${avatarColor(p.nombre)}
                                          flex items-center justify-center text-white font-black text-xs
                                          flex-shrink-0 shadow-sm`}>
                            {p.nombre[0]}{p.apellido[0]}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{p.nombre} {p.apellido}</p>
                            <p className="text-xs text-gray-400 mt-0.5">{p.correo}</p>
                          </div>
                        </div>
                      </td>
                      <td className="table-td text-gray-600 font-mono text-xs">{p.numDocumento}</td>
                      <td className="table-td text-gray-600">{p.telefono}</td>
                      <td className="table-td text-gray-600">{p.eps}</td>
                      <td className="table-td">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg
                                         text-xs font-bold bg-blue-50 text-blue-700 border border-blue-100">
                          <Droplets className="w-3 h-3" />
                          {p.grupoSanguineo}
                        </span>
                      </td>
                      <td className="table-td">
                        <span className={p.estado === 'ACTIVO' ? 'badge-active' : 'badge-inactive'}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            p.estado === 'ACTIVO' ? 'bg-emerald-500' : 'bg-red-500'
                          }`} />
                          {p.estado}
                        </span>
                      </td>
                      <td className="table-td">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => openEdit(p)}
                            className="btn-icon text-blue-500 hover:bg-blue-50 hover:text-blue-700"
                            title="Editar paciente"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => openDelete(p.idPaciente)}
                            className="btn-icon text-red-400 hover:bg-red-50 hover:text-red-600"
                            title="Eliminar paciente"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      </div>

      {/* ── Modal CRUD ─────────────────────────────────────────────────────── */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={mode === 'create' ? 'Registrar nuevo paciente' : 'Editar paciente'}
        size="xl"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Datos personales */}
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">
              Datos personales
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="form-label">Nombre *</label>
                <input className="form-input" placeholder="Juan" required
                  value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} />
              </div>
              <div>
                <label className="form-label">Apellido *</label>
                <input className="form-input" placeholder="Pérez" required
                  value={form.apellido} onChange={(e) => setForm({ ...form, apellido: e.target.value })} />
              </div>
              <div>
                <label className="form-label">Número de documento *</label>
                <input className="form-input" placeholder="1234567890" required
                  value={form.numDocumento} onChange={(e) => setForm({ ...form, numDocumento: e.target.value })} />
              </div>
              <div>
                <label className="form-label">Fecha de nacimiento *</label>
                <input type="date" className="form-input" required
                  value={form.fechaNacimiento} onChange={(e) => setForm({ ...form, fechaNacimiento: e.target.value })} />
              </div>
              <div>
                <label className="form-label">Género *</label>
                <select className="form-input" value={form.genero}
                  onChange={(e) => setForm({ ...form, genero: e.target.value as Genero })}>
                  {GENEROS.map((g) => <option key={g}>{g}</option>)}
                </select>
              </div>
              <div>
                <label className="form-label">Grupo sanguíneo *</label>
                <select className="form-input" value={form.grupoSanguineo}
                  onChange={(e) => setForm({ ...form, grupoSanguineo: e.target.value as GrupoSanguineo })}>
                  {GRUPOS_SANGUINEOS.map((g) => <option key={g}>{g}</option>)}
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="form-label">EPS *</label>
                <input className="form-input" placeholder="Ej: Sura, Nueva EPS, Compensar…" required
                  value={form.eps} onChange={(e) => setForm({ ...form, eps: e.target.value })} />
              </div>
            </div>
          </div>

          {/* Cuenta de usuario */}
          <div className="border-t border-gray-100 pt-5">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">
              Cuenta de usuario
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="form-label">Correo electrónico *</label>
                <input type="email" className="form-input" placeholder="correo@ejemplo.com" required
                  value={form.correo} onChange={(e) => setForm({ ...form, correo: e.target.value })} />
              </div>
              <div>
                <label className="form-label">
                  Contraseña {mode === 'edit'
                    ? <span className="text-gray-400 font-normal normal-case tracking-normal">(vacío = sin cambio)</span>
                    : ' *'}
                </label>
                <input type="password" className="form-input" placeholder="••••••••"
                  required={mode === 'create'}
                  value={form.contraseña} onChange={(e) => setForm({ ...form, contraseña: e.target.value })} />
              </div>
              <div>
                <label className="form-label">Teléfono *</label>
                <input className="form-input" placeholder="3001234567" required
                  value={form.telefono} onChange={(e) => setForm({ ...form, telefono: e.target.value })} />
              </div>
              <div>
                <label className="form-label">Estado *</label>
                <select className="form-input" value={form.estado}
                  onChange={(e) => setForm({ ...form, estado: e.target.value as EstadoUsuario })}>
                  <option value="ACTIVO">ACTIVO</option>
                  <option value="INACTIVO">INACTIVO</option>
                </select>
              </div>
            </div>
          </div>

          {/* Botones */}
          <div className="flex justify-end gap-3 border-t border-gray-100 pt-4">
            <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary">
              Cancelar
            </button>
            <button type="submit" disabled={saving} className="btn-primary">
              {saving ? 'Guardando…' : mode === 'create' ? 'Registrar paciente' : 'Guardar cambios'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={confirmOpen}
        message="Esta acción eliminará al paciente permanentemente del sistema."
        onConfirm={handleDelete}
        onCancel={() => setConfirmOpen(false)}
        loading={deleting}
      />
    </DashboardLayout>
  )
}
