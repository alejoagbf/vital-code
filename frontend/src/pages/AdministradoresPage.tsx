import { useState, useEffect, useCallback, type FormEvent } from 'react'
import toast from 'react-hot-toast'
import DashboardLayout from '../components/layout/DashboardLayout'
import Modal from '../components/ui/Modal'
import ConfirmDialog from '../components/ui/ConfirmDialog'
import Pagination from '../components/ui/Pagination'
import {
  listarAdministradores,
  crearAdministrador,
  actualizarAdministrador,
  eliminarAdministrador,
} from '../services/api'
import type { Administrador, AdministradorPayload, FormMode, EstadoUsuario } from '../types'
import {
  Search, UserPlus, Pencil, Trash2, ShieldCheck, UserCheck, UserX,
  Clock, Layers,
} from 'lucide-react'

const INITIAL_FORM: AdministradorPayload = {
  nombre: '', apellido: '', correo: '', contraseña: '', telefono: '',
  estado: 'ACTIVO', departamento: '',
}

const AVATAR_COLORS = [
  'from-violet-500 to-violet-700',
  'from-purple-500 to-purple-700',
  'from-indigo-500 to-indigo-700',
  'from-fuchsia-500 to-fuchsia-700',
  'from-blue-600 to-blue-800',
]
const avatarColor = (name: string) =>
  AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length]

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
      setAdministradores(res.content)
      setTotalPages(res.totalPages)
    } catch {
      toast.error('Error al cargar los administradores.')
    } finally {
      setLoading(false)
    }
  }, [page])

  useEffect(() => { fetchAdministradores() }, [fetchAdministradores])

  const filtered = administradores.filter((a) => {
    const q = search.toLowerCase()
    return (
      a.nombre.toLowerCase().includes(q) ||
      a.apellido.toLowerCase().includes(q) ||
      a.correo.toLowerCase().includes(q) ||
      a.departamento.toLowerCase().includes(q)
    )
  })

  const activos   = administradores.filter((a) => a.estado === 'ACTIVO').length
  const inactivos = administradores.filter((a) => a.estado === 'INACTIVO').length

  const openCreate = () => {
    setMode('create'); setSelected(null); setForm(INITIAL_FORM); setModalOpen(true)
  }
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
      if (mode === 'create') {
        await crearAdministrador(form); toast.success('Administrador registrado correctamente.')
      } else if (selected) {
        await actualizarAdministrador(selected.idAdministrador, form)
        toast.success('Administrador actualizado correctamente.')
      }
      setModalOpen(false); fetchAdministradores()
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
      await eliminarAdministrador(deleteId)
      toast.success('Administrador eliminado.')
      setConfirmOpen(false); fetchAdministradores()
    } catch {
      toast.error('Error al eliminar.')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <DashboardLayout title="Gestión de Administradores" subtitle="Control de acceso y privilegios">
      <div className="space-y-6 animate-fade-in">

        {/* ── Stat cards ───────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="stat-card">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-violet-500 to-violet-700
                            flex items-center justify-center shadow-md">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-2xl font-black text-gray-900">{administradores.length}</p>
              <p className="text-xs text-gray-500 font-medium">Total administradores</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700
                            flex items-center justify-center shadow-md">
              <UserCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-2xl font-black text-gray-900">{activos}</p>
              <p className="text-xs text-gray-500 font-medium">Activos</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-red-400 to-red-600
                            flex items-center justify-center shadow-md">
              <UserX className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-2xl font-black text-gray-900">{inactivos}</p>
              <p className="text-xs text-gray-500 font-medium">Inactivos</p>
            </div>
          </div>
        </div>

        {/* ── Toolbar ──────────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Buscar administrador…" className="form-input pl-10"
              value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <button onClick={openCreate} className="btn-primary flex-shrink-0">
            <UserPlus className="w-4 h-4" />
            Nuevo Administrador
          </button>
        </div>

        {/* ── Table ────────────────────────────────────────────────────── */}
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
                  <tr>
                    <td colSpan={6} className="py-16 text-center">
                      <svg className="animate-spin w-7 h-7 mx-auto mb-3 text-violet-500"
                        fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10"
                          stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      <p className="text-gray-400 text-sm font-medium">Cargando administradores…</p>
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-16 text-center">
                      <ShieldCheck className="w-10 h-10 mx-auto mb-3 text-gray-200" />
                      <p className="text-gray-400 text-sm font-medium">No se encontraron administradores.</p>
                    </td>
                  </tr>
                ) : (
                  filtered.map((a) => (
                    <tr key={a.idAdministrador} className="table-row">
                      <td className="table-td">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${avatarColor(a.nombre)}
                                          flex items-center justify-center text-white font-black text-xs
                                          flex-shrink-0 shadow-sm`}>
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
                          <Layers className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                          {a.departamento}
                        </span>
                      </td>
                      <td className="table-td text-gray-600">{a.telefono}</td>
                      <td className="table-td">
                        <span className={a.estado === 'ACTIVO' ? 'badge-active' : 'badge-inactive'}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            a.estado === 'ACTIVO' ? 'bg-emerald-500' : 'bg-red-500'
                          }`} />
                          {a.estado}
                        </span>
                      </td>
                      <td className="table-td">
                        {a.ultimoAcceso ? (
                          <span className="inline-flex items-center gap-1.5 text-gray-500 text-xs">
                            <Clock className="w-3.5 h-3.5 text-gray-400" />
                            {new Date(a.ultimoAcceso).toLocaleDateString('es-CO')}
                          </span>
                        ) : (
                          <span className="text-gray-300 text-xs">—</span>
                        )}
                      </td>
                      <td className="table-td">
                        <div className="flex items-center justify-center gap-1">
                          <button onClick={() => openEdit(a)}
                            className="btn-icon text-blue-500 hover:bg-blue-50 hover:text-blue-700"
                            title="Editar">
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button onClick={() => openDelete(a.idAdministrador)}
                            className="btn-icon text-red-400 hover:bg-red-50 hover:text-red-600"
                            title="Eliminar">
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
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}
        title={mode === 'create' ? 'Registrar administrador' : 'Editar administrador'}>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">
              Datos personales
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="form-label">Nombre *</label>
                <input className="form-input" placeholder="María" required
                  value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} />
              </div>
              <div>
                <label className="form-label">Apellido *</label>
                <input className="form-input" placeholder="Gómez" required
                  value={form.apellido} onChange={(e) => setForm({ ...form, apellido: e.target.value })} />
              </div>
              <div className="sm:col-span-2">
                <label className="form-label">Departamento *</label>
                <input className="form-input" placeholder="Ej: Sistemas, Recursos Humanos, Dirección…" required
                  value={form.departamento} onChange={(e) => setForm({ ...form, departamento: e.target.value })} />
              </div>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-5">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">
              Cuenta de usuario
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="form-label">Correo electrónico *</label>
                <input type="email" className="form-input" placeholder="correo@healthtech.com" required
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

          <div className="flex justify-end gap-3 border-t border-gray-100 pt-4">
            <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary">Cancelar</button>
            <button type="submit" disabled={saving} className="btn-primary">
              {saving ? 'Guardando…' : mode === 'create' ? 'Registrar' : 'Guardar cambios'}
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
