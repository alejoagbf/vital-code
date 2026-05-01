// =============================================================================
//  VitalCode – Capa de servicios / API
//  Adaptado al backend vital-code-victor (sin modificar el backend)
//  Usa el proxy de Vite para evitar CORS — BASE_URL es relativa
// =============================================================================

import axios from 'axios'
import type {
  Paciente, PacientePayload,
  Administrador, AdministradorPayload,
  PersonalSalud, PersonalSaludPayload,
  PaginatedResponse, UsuarioBackend, UsuarioPayload,
  EstadoUsuario, GrupoSanguineo, Genero, TipoUsuario,
} from '../types'

// ─── Axios ────────────────────────────────────────────────────────────────────
// URL relativa → pasa por el proxy de Vite → llega a localhost:8081
const BASE_URL = '/api'

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 6000,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('vitalcode_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('vitalcode_token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// ─── Helpers ──────────────────────────────────────────────────────────────────
const nowIso = () => new Date().toISOString().slice(0, 19)
const toIso  = (d: string | undefined) => {
  if (!d) return undefined
  if (d.length === 10) return `${d}T00:00:00`
  return new Date(d).toISOString().slice(0, 19)
}

// Agrupa un array de UsuarioBackend por un campo y devuelve {clave: cantidad}
const groupBy = (users: UsuarioBackend[], field: keyof UsuarioBackend): Record<string, number> => {
  const result: Record<string, number> = {}
  users.forEach((u) => {
    const key = String(u[field] ?? 'Sin definir')
    result[key] = (result[key] ?? 0) + 1
  })
  return result
}

// Convierte List<EstadisticaResponse> del backend a Record<string, number>
const statsToMap = (list: { categoria: string; cantidad: number }[]): Record<string, number> =>
  Object.fromEntries(list.map((i) => [i.categoria, Number(i.cantidad)]))

// =============================================================================
//  INTERFACES
// =============================================================================

export interface LoginResponseBackend {
  idUsuario: number
  tipoUsuario: string
  nombre: string
  apellido: string
  correo: string
  estado: boolean
  telefono: string
  fechaCreacion: string
  ultimoAcceso: string
  departamento?: string
  numDocumento?: number
  grupoSanguineo?: string
  eps?: string
  genero?: string
  fechaNacimiento?: string
  cargo?: string
  numLicencia?: number
  institucion?: string
}

export interface RegistroReciente {
  idUsuario: number
  nombre: string
  apellido: string
  correo: string
  tipoUsuario: string
  fechaCreacion: string | null
}

export interface EstadisticasBackend {
  totalUsuarios: number
  totalPacientes: number
  totalPersonalSalud: number
  totalAdministradores: number
  usuariosActivos: number
  usuariosInactivos: number
  pacientesPorEps: Record<string, number>
  pacientesPorGenero: Record<string, number>
  pacientesPorGrupoSanguineo: Record<string, number>
  personalPorCargo: Record<string, number>
  personalPorInstitucion: Record<string, number>
  administradoresPorDepartamento: Record<string, number>
  ultimosRegistrados: RegistroReciente[]
}

// ─── Usuarios demo (fallback si el backend no responde) ──────────────────────
const DEMO_USERS: Record<string, LoginResponseBackend> = {
  'admin@vitalcode.com': {
    idUsuario: 1, tipoUsuario: 'ADMINISTRADOR',
    nombre: 'Alejandro', apellido: 'Vélez',
    correo: 'admin@vitalcode.com', estado: true, telefono: '+57 300 000 0000',
    fechaCreacion: nowIso(), ultimoAcceso: nowIso(),
    departamento: 'Dirección General',
  },
  'medico@vitalcode.com': {
    idUsuario: 2, tipoUsuario: 'PERSONAL_SALUD',
    nombre: 'Elena', apellido: 'Santos',
    correo: 'medico@vitalcode.com', estado: true, telefono: '+57 301 000 0000',
    fechaCreacion: nowIso(), ultimoAcceso: nowIso(),
    cargo: 'Médico Internista', numLicencia: 123456, institucion: 'Clínica Valle del Lili',
  },
  'paciente@vitalcode.com': {
    idUsuario: 3, tipoUsuario: 'PACIENTE',
    nombre: 'Carlos', apellido: 'Méndez',
    correo: 'paciente@vitalcode.com', estado: true, telefono: '+57 302 000 0000',
    fechaCreacion: nowIso(), ultimoAcceso: nowIso(),
    numDocumento: 1078901234, grupoSanguineo: 'O+', eps: 'Sura', genero: 'MASCULINO',
    fechaNacimiento: '1990-05-15T00:00:00',
  },
}

// =============================================================================
//  AUTH
// =============================================================================

// vital-code-victor devuelve UsuarioResponse en el login (mismos campos que nuestro LoginResponse)
export const login = async (correo: string, contrasena: string): Promise<LoginResponseBackend> => {
  try {
    const { data } = await api.post<LoginResponseBackend>('/v1/usuarios/login', { correo, contrasena })
    localStorage.setItem('vitalcode_token', 'auth')
    localStorage.setItem('vitalcode_user', JSON.stringify(data))
    return data
  } catch (err: any) {
    // Si el error es de red (backend apagado), usar demo
    if (!err.response) {
      const demo = DEMO_USERS[correo.trim().toLowerCase()]
      if (demo && contrasena.length >= 3) {
        localStorage.setItem('vitalcode_token', 'demo')
        localStorage.setItem('vitalcode_user', JSON.stringify(demo))
        return demo
      }
    }
    throw err
  }
}

export const logout = (): void => {
  localStorage.removeItem('vitalcode_token')
  localStorage.removeItem('vitalcode_user')
}

// =============================================================================
//  ESTADÍSTICAS — vital-code-victor tiene 5 endpoints separados de stats
//  Los combinamos en el EstadisticasBackend que espera el frontend
// =============================================================================

export const obtenerEstadisticas = async (): Promise<EstadisticasBackend> => {
  const [todos, resEps, resEstados, resGeneros, resCargos, resRecientes] = await Promise.all([
    listarTodosUsuarios(),
    api.get<{ categoria: string; cantidad: number }[]>('/v1/usuarios/stats/eps'),
    api.get<{ categoria: string; cantidad: number }[]>('/v1/usuarios/stats/estados'),
    api.get<{ categoria: string; cantidad: number }[]>('/v1/usuarios/stats/generos'),
    api.get<{ categoria: string; cantidad: number }[]>('/v1/usuarios/stats/cargos'),
    api.get<UsuarioBackend[]>('/v1/usuarios/reporte/recientes'),
  ])

  const pacientes = todos.filter((u) => u.tipoUsuario === 'PACIENTE')
  const personal  = todos.filter((u) => u.tipoUsuario === 'PERSONAL_SALUD')
  const admins    = todos.filter((u) => u.tipoUsuario === 'ADMINISTRADOR')
  const estadosMap = statsToMap(resEstados.data)

  const ultimosRegistrados: RegistroReciente[] = resRecientes.data.map((u) => ({
    idUsuario:    u.idUsuario,
    nombre:       u.nombre,
    apellido:     u.apellido,
    correo:       u.correo,
    tipoUsuario:  u.tipoUsuario,
    fechaCreacion: u.fechaCreacion ?? null,
  }))

  return {
    totalUsuarios:        todos.length,
    totalPacientes:       pacientes.length,
    totalPersonalSalud:   personal.length,
    totalAdministradores: admins.length,
    usuariosActivos:      estadosMap['ACTIVO']   ?? 0,
    usuariosInactivos:    estadosMap['INACTIVO'] ?? 0,
    pacientesPorEps:               statsToMap(resEps.data),
    pacientesPorGenero:            statsToMap(resGeneros.data),
    pacientesPorGrupoSanguineo:    groupBy(pacientes, 'grupoSanguineo'),
    personalPorCargo:              statsToMap(resCargos.data),
    personalPorInstitucion:        groupBy(personal, 'institucion'),
    administradoresPorDepartamento: groupBy(admins, 'departamento'),
    ultimosRegistrados,
  }
}

// =============================================================================
//  USUARIOS — endpoint unificado
// =============================================================================

interface RawUsuario extends Omit<UsuarioBackend, 'tipoUsuario'> {
  tipoUsuario?: TipoUsuario
  tipo_usuario?: TipoUsuario
}

const normalizarUsuario = (raw: RawUsuario): UsuarioBackend => ({
  ...raw,
  tipoUsuario: (raw.tipoUsuario ?? raw.tipo_usuario ?? 'PACIENTE') as TipoUsuario,
})

export const listarTodosUsuarios = async (): Promise<UsuarioBackend[]> => {
  const { data } = await api.get<RawUsuario[]>('/v1/usuarios')
  return data.map(normalizarUsuario)
}

export const crearUsuarioUnificado = async (payload: UsuarioPayload): Promise<UsuarioBackend> => {
  const { data } = await api.post<RawUsuario>('/v1/usuarios', payload)
  return normalizarUsuario(data)
}

export const cambiarEstadoUsuario = async (idUsuario: number): Promise<UsuarioBackend> => {
  const { data } = await api.put<RawUsuario>(`/v1/usuarios/${idUsuario}`)
  return normalizarUsuario(data)
}

export const buscarUsuarioPorId = async (idUsuario: number): Promise<UsuarioBackend> => {
  const { data } = await api.get<RawUsuario>(`/v1/usuarios/encontrarId/${idUsuario}`)
  return normalizarUsuario(data)
}

// =============================================================================
//  CONSULTAS — vital-code-victor tiene algunos endpoints de reporte,
//  el resto se hace client-side filtrando GET /
// =============================================================================

export const consultaPorEstado = async (estado: boolean): Promise<UsuarioBackend[]> => {
  if (!estado) {
    // Existe endpoint para inactivos
    const { data } = await api.get<RawUsuario[]>('/v1/usuarios/reporte/inactivos')
    return data.map(normalizarUsuario)
  }
  // Para activos filtramos client-side
  const todos = await listarTodosUsuarios()
  return todos.filter((u) => u.estado === true)
}

export const consultaBuscarTexto = async (texto: string): Promise<UsuarioBackend[]> => {
  const todos = await listarTodosUsuarios()
  const q = texto.toLowerCase()
  return todos.filter((u) =>
    u.nombre.toLowerCase().includes(q) ||
    u.apellido.toLowerCase().includes(q)
  )
}

export const consultaPacientes = async (): Promise<UsuarioBackend[]> => {
  const todos = await listarTodosUsuarios()
  return todos.filter((u) => u.tipoUsuario === 'PACIENTE')
}

export const consultaPacientesPorEps = async (eps: string): Promise<UsuarioBackend[]> => {
  // Existe endpoint en vital-code-victor: GET /reporte/eps/{eps}
  const { data } = await api.get<RawUsuario[]>(`/v1/usuarios/reporte/eps/${encodeURIComponent(eps)}`)
  return data.map(normalizarUsuario)
}

export const consultaPacientePorDocumento = async (doc: number): Promise<UsuarioBackend> => {
  const todos = await listarTodosUsuarios()
  const found = todos.find((u) => u.tipoUsuario === 'PACIENTE' && u.numDocumento === doc)
  if (!found) throw new Error('No existe paciente con ese documento')
  return found
}

export const consultaPersonalSalud = async (): Promise<UsuarioBackend[]> => {
  const todos = await listarTodosUsuarios()
  return todos.filter((u) => u.tipoUsuario === 'PERSONAL_SALUD')
}

export const consultaPersonalPorCargo = async (cargo: string): Promise<UsuarioBackend[]> => {
  const todos = await listarTodosUsuarios()
  return todos.filter(
    (u) => u.tipoUsuario === 'PERSONAL_SALUD' &&
           u.cargo?.toLowerCase() === cargo.toLowerCase()
  )
}

export const consultaAdministradores = async (): Promise<UsuarioBackend[]> => {
  const todos = await listarTodosUsuarios()
  return todos.filter((u) => u.tipoUsuario === 'ADMINISTRADOR')
}

export const consultaUltimosRegistrados = async (limit = 10): Promise<UsuarioBackend[]> => {
  // Existe endpoint: GET /reporte/recientes (devuelve los últimos 10)
  const { data } = await api.get<RawUsuario[]>('/v1/usuarios/reporte/recientes')
  return data.map(normalizarUsuario).slice(0, limit)
}

// =============================================================================
//  WRAPPERS CON CONVERSIÓN DE TIPO (para los filtros de las páginas)
// =============================================================================

const PAGE_SIZE = 10
const estadoToString  = (b?: boolean): EstadoUsuario => (b ? 'ACTIVO' : 'INACTIVO')
const estadoToBool    = (s?: EstadoUsuario): boolean => s === 'ACTIVO'

const toPaciente = (u: UsuarioBackend): Paciente => ({
  idUsuario:      u.idUsuario,
  idPaciente:     u.idUsuario,
  nombre:         u.nombre,
  apellido:       u.apellido,
  correo:         u.correo,
  contraseña:     '',
  telefono:       u.telefono,
  estado:         estadoToString(u.estado),
  fechaCreacion:  u.fechaCreacion,
  ultimoAcceso:   u.ultimoAcceso,
  numDocumento:   u.numDocumento != null ? String(u.numDocumento) : '',
  fechaNacimiento: u.fechaNacimiento ?? '',
  grupoSanguineo: (u.grupoSanguineo as GrupoSanguineo) ?? 'O+',
  genero:         (u.genero as Genero) ?? 'OTRO',
  eps:            u.eps ?? '',
})

const toPersonalSalud = (u: UsuarioBackend): PersonalSalud => ({
  idUsuario:       u.idUsuario,
  idPersonalSalud: u.idUsuario,
  nombre:          u.nombre,
  apellido:        u.apellido,
  correo:          u.correo,
  contraseña:      '',
  telefono:        u.telefono,
  estado:          estadoToString(u.estado),
  fechaCreacion:   u.fechaCreacion,
  ultimoAcceso:    u.ultimoAcceso,
  cargo:           u.cargo ?? '',
  numLicencia:     u.numLicencia != null ? String(u.numLicencia) : '',
  institucion:     u.institucion ?? '',
})

const toAdministrador = (u: UsuarioBackend): Administrador => ({
  idUsuario:       u.idUsuario,
  idAdministrador: u.idUsuario,
  nombre:          u.nombre,
  apellido:        u.apellido,
  correo:          u.correo,
  contraseña:      '',
  telefono:        u.telefono,
  estado:          estadoToString(u.estado),
  fechaCreacion:   u.fechaCreacion,
  ultimoAcceso:    u.ultimoAcceso,
  departamento:    u.departamento ?? '',
})

const paginate = <T>(items: T[], page: number, size = PAGE_SIZE): PaginatedResponse<T> => {
  const totalElements = items.length
  const totalPages    = Math.max(1, Math.ceil(totalElements / size))
  return {
    content: items.slice(page * size, (page + 1) * size),
    totalElements, totalPages, number: page, size,
  }
}

const sincronizarEstado = async (id: number, actual: boolean, deseado: boolean) => {
  if (actual === deseado) return null
  return cambiarEstadoUsuario(id)
}

// ─── Filtros con tipo específico (para los filtros de las páginas) ────────────

export const filtrarPacientesPorEps = async (eps: string): Promise<Paciente[]> => {
  const data = await consultaPacientesPorEps(eps)
  return data.map(toPaciente)
}

export const buscarPacientesPorDocumento = async (doc: number): Promise<Paciente[]> => {
  try {
    const data = await consultaPacientePorDocumento(doc)
    return [toPaciente(data)]
  } catch { return [] }
}

export const filtrarPacientesPorEstado = async (estado: boolean): Promise<Paciente[]> => {
  const data = await consultaPorEstado(estado)
  return data.filter((u) => u.tipoUsuario === 'PACIENTE').map(toPaciente)
}

export const filtrarPersonalPorCargo = async (cargo: string): Promise<PersonalSalud[]> => {
  const data = await consultaPersonalPorCargo(cargo)
  return data.map(toPersonalSalud)
}

export const filtrarPersonalPorEstado = async (estado: boolean): Promise<PersonalSalud[]> => {
  const data = await consultaPorEstado(estado)
  return data.filter((u) => u.tipoUsuario === 'PERSONAL_SALUD').map(toPersonalSalud)
}

// =============================================================================
//  PACIENTES
// =============================================================================

export const listarPacientes = async (page = 0, size = PAGE_SIZE): Promise<PaginatedResponse<Paciente>> => {
  const data = await consultaPacientes()
  return paginate(data.map(toPaciente), page, size)
}

export const obtenerPaciente = async (id: number): Promise<Paciente> =>
  toPaciente(await buscarUsuarioPorId(id))

export const crearPaciente = async (payload: PacientePayload): Promise<Paciente> => {
  const created = await crearUsuarioUnificado({
    tipoUsuario: 'PACIENTE',
    nombre: payload.nombre, apellido: payload.apellido, correo: payload.correo,
    contrasena: payload.contraseña, telefono: payload.telefono,
    estado: estadoToBool(payload.estado),
    fechaCreacion: nowIso(), ultimoAcceso: nowIso(),
    numDocumento: Number(payload.numDocumento) || undefined,
    fechaNacimiento: toIso(payload.fechaNacimiento),
    grupoSanguineo: payload.grupoSanguineo, eps: payload.eps, genero: payload.genero,
  })
  return toPaciente(created)
}

export const actualizarPaciente = async (id: number, payload: PacientePayload): Promise<Paciente> => {
  const actual = await buscarUsuarioPorId(id)
  await sincronizarEstado(id, actual.estado, estadoToBool(payload.estado))
  return toPaciente(await buscarUsuarioPorId(id))
}

export const eliminarPaciente = async (id: number): Promise<void> => {
  const actual = await buscarUsuarioPorId(id)
  if (actual.estado) await cambiarEstadoUsuario(id)
}

// =============================================================================
//  ADMINISTRADORES
// =============================================================================

export const listarAdministradores = async (page = 0, size = PAGE_SIZE): Promise<PaginatedResponse<Administrador>> => {
  const data = await consultaAdministradores()
  return paginate(data.map(toAdministrador), page, size)
}

export const obtenerAdministrador = async (id: number): Promise<Administrador> =>
  toAdministrador(await buscarUsuarioPorId(id))

export const crearAdministrador = async (payload: AdministradorPayload): Promise<Administrador> => {
  const created = await crearUsuarioUnificado({
    tipoUsuario: 'ADMINISTRADOR',
    nombre: payload.nombre, apellido: payload.apellido, correo: payload.correo,
    contrasena: payload.contraseña, telefono: payload.telefono,
    estado: estadoToBool(payload.estado),
    fechaCreacion: nowIso(), ultimoAcceso: nowIso(),
    departamento: payload.departamento,
  })
  return toAdministrador(created)
}

export const actualizarAdministrador = async (id: number, payload: AdministradorPayload): Promise<Administrador> => {
  const actual = await buscarUsuarioPorId(id)
  await sincronizarEstado(id, actual.estado, estadoToBool(payload.estado))
  return toAdministrador(await buscarUsuarioPorId(id))
}

export const eliminarAdministrador = async (id: number): Promise<void> => {
  const actual = await buscarUsuarioPorId(id)
  if (actual.estado) await cambiarEstadoUsuario(id)
}

// =============================================================================
//  PERSONAL DE SALUD
// =============================================================================

export const listarPersonalSalud = async (page = 0, size = PAGE_SIZE): Promise<PaginatedResponse<PersonalSalud>> => {
  const data = await consultaPersonalSalud()
  return paginate(data.map(toPersonalSalud), page, size)
}

export const obtenerPersonalSalud = async (id: number): Promise<PersonalSalud> =>
  toPersonalSalud(await buscarUsuarioPorId(id))

export const crearPersonalSalud = async (payload: PersonalSaludPayload): Promise<PersonalSalud> => {
  const created = await crearUsuarioUnificado({
    tipoUsuario: 'PERSONAL_SALUD',
    nombre: payload.nombre, apellido: payload.apellido, correo: payload.correo,
    contrasena: payload.contraseña, telefono: payload.telefono,
    estado: estadoToBool(payload.estado),
    fechaCreacion: nowIso(), ultimoAcceso: nowIso(),
    cargo: payload.cargo,
    numLicencia: Number(payload.numLicencia) || undefined,
    institucion: payload.institucion,
  })
  return toPersonalSalud(created)
}

export const actualizarPersonalSalud = async (id: number, payload: PersonalSaludPayload): Promise<PersonalSalud> => {
  const actual = await buscarUsuarioPorId(id)
  await sincronizarEstado(id, actual.estado, estadoToBool(payload.estado))
  return toPersonalSalud(await buscarUsuarioPorId(id))
}

export const eliminarPersonalSalud = async (id: number): Promise<void> => {
  const actual = await buscarUsuarioPorId(id)
  if (actual.estado) await cambiarEstadoUsuario(id)
}

export default api
