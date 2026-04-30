// =============================================================================
//  VitalCode – Capa de servicios / API
//  HealthTech S.A.S.
//
//  Acoplado al backend Spring Boot ORIGINAL (sin tocar el backend).
//  Endpoints disponibles bajo /api/v1/usuarios:
//    POST   /                              -> crear usuario
//    GET    /                              -> listado general
//    PUT    /{id}                          -> alterna estado (activo/inactivo)
//    GET    /encontrarId/{id}              -> buscar por id
//    POST   /login                         -> login
//    GET    /estadisticas                  -> dashboard
//    GET    /consultas/...                 -> 10 consultas
//
//  IMPORTANTE: el backend NO tiene UPDATE completo ni DELETE. Por eso
//  "actualizar" y "eliminar" en el frontend se mapean al toggle de estado
//  (única acción de modificación que ofrece el backend).
//  El discriminador de Jackson es "tipo_usuario" (snake_case).
// =============================================================================

import axios from 'axios'
import type {
  Paciente,
  PacientePayload,
  Administrador,
  AdministradorPayload,
  PersonalSalud,
  PersonalSaludPayload,
  PaginatedResponse,
  UsuarioBackend,
  UsuarioPayload,
  EstadoUsuario,
  GrupoSanguineo,
  Genero,
  TipoUsuario,
} from '../types'

// ─── Configuración base de Axios ──────────────────────────────────────────────

const BASE_URL = 'http://localhost:8080/api'

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  // Timeout corto para que, si el puerto 8080 está ocupado por otro proceso
  // (MiniTool ShadowMaker es un caso real visto), el fallback demo se dispare
  // en vez de colgar la UI indefinidamente.
  timeout: 6000,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('vitalcode_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('vitalcode_token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// ─── Helpers de fecha ────────────────────────────────────────────────────────
// Spring Boot espera LocalDateTime sin offset (ej: "2024-05-15T10:30:00"),
// no acepta el sufijo Z de toISOString().
const nowIso = () => new Date().toISOString().slice(0, 19)
const toIso = (d: string | undefined) => {
  if (!d) return undefined
  if (d.length === 10) return `${d}T00:00:00`
  return new Date(d).toISOString().slice(0, 19)
}

// =============================================================================
//  AUTH
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

// ─── Usuarios DEMO (sirven cuando el backend no responde) ────────────────────
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

export const login = async (correo: string, contrasena: string): Promise<LoginResponseBackend> => {
  try {
    const { data } = await api.post<LoginResponseBackend>('/v1/usuarios/login', { correo, contrasena })
    localStorage.setItem('vitalcode_token', 'auth')
    localStorage.setItem('vitalcode_user', JSON.stringify(data))
    return data
  } catch (err) {
    const demo = DEMO_USERS[correo.trim().toLowerCase()]
    if (demo && contrasena.length >= 3) {
      localStorage.setItem('vitalcode_token', 'demo')
      localStorage.setItem('vitalcode_user', JSON.stringify(demo))
      return demo
    }
    throw err
  }
}

export const obtenerEstadisticas = async (): Promise<EstadisticasBackend> => {
  const { data } = await api.get<EstadisticasBackend>('/v1/usuarios/estadisticas')
  return data
}

export const logout = (): void => {
  localStorage.removeItem('vitalcode_token')
  localStorage.removeItem('vitalcode_user')
}

// =============================================================================
//  USUARIOS — endpoint unificado real
// =============================================================================
//
// El backend usa @JsonTypeInfo property = "tipo_usuario" (snake_case) en GET.
// Aquí normalizamos todo a camelCase para que el resto del frontend trabaje
// con `tipoUsuario`.

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

export const crearUsuarioUnificado = async (
  payload: UsuarioPayload
): Promise<UsuarioBackend> => {
  const { data } = await api.post<RawUsuario>('/v1/usuarios', payload)
  return normalizarUsuario(data)
}

export const cambiarEstadoUsuario = async (
  idUsuario: number
): Promise<UsuarioBackend> => {
  const { data } = await api.put<RawUsuario>(`/v1/usuarios/${idUsuario}`)
  return normalizarUsuario(data)
}

export const buscarUsuarioPorId = async (
  idUsuario: number
): Promise<UsuarioBackend> => {
  const { data } = await api.get<RawUsuario>(`/v1/usuarios/encontrarId/${idUsuario}`)
  return normalizarUsuario(data)
}

// =============================================================================
//  CONSULTAS (req. 14) — 10 consultas
// =============================================================================

export const consultaPorEstado = async (estado: boolean): Promise<UsuarioBackend[]> => {
  const { data } = await api.get<RawUsuario[]>(`/v1/usuarios/consultas/por-estado?estado=${estado}`)
  return data.map(normalizarUsuario)
}

export const consultaBuscarTexto = async (texto: string): Promise<UsuarioBackend[]> => {
  const { data } = await api.get<RawUsuario[]>(`/v1/usuarios/consultas/buscar?texto=${encodeURIComponent(texto)}`)
  return data.map(normalizarUsuario)
}

export const consultaPacientes = async (): Promise<UsuarioBackend[]> => {
  const { data } = await api.get<RawUsuario[]>('/v1/usuarios/consultas/pacientes')
  return data.map(normalizarUsuario)
}

export const consultaPacientesPorEps = async (eps: string): Promise<UsuarioBackend[]> => {
  const { data } = await api.get<RawUsuario[]>(`/v1/usuarios/consultas/pacientes/eps?eps=${encodeURIComponent(eps)}`)
  return data.map(normalizarUsuario)
}

export const consultaPacientePorDocumento = async (doc: number): Promise<UsuarioBackend> => {
  const { data } = await api.get<RawUsuario>(`/v1/usuarios/consultas/pacientes/documento/${doc}`)
  return normalizarUsuario(data)
}

export const consultaPersonalSalud = async (): Promise<UsuarioBackend[]> => {
  const { data } = await api.get<RawUsuario[]>('/v1/usuarios/consultas/personal-salud')
  return data.map(normalizarUsuario)
}

export const consultaPersonalPorCargo = async (cargo: string): Promise<UsuarioBackend[]> => {
  const { data } = await api.get<RawUsuario[]>(`/v1/usuarios/consultas/personal-salud/cargo?cargo=${encodeURIComponent(cargo)}`)
  return data.map(normalizarUsuario)
}

export const consultaAdministradores = async (): Promise<UsuarioBackend[]> => {
  const { data } = await api.get<RawUsuario[]>('/v1/usuarios/consultas/administradores')
  return data.map(normalizarUsuario)
}

export const consultaUltimosRegistrados = async (limit = 10): Promise<UsuarioBackend[]> => {
  const { data } = await api.get<RawUsuario[]>(`/v1/usuarios/consultas/ultimos-registrados?limit=${limit}`)
  return data.map(normalizarUsuario)
}

// =============================================================================
//  ADAPTADORES BACKEND ↔ UI LEGACY
//  Las pantallas Pacientes/PersonalSalud/Administradores usan tipos con
//  `estado: 'ACTIVO' | 'INACTIVO'` y `numDocumento/numLicencia: string`.
//  El backend devuelve booleanos y números — aquí está la traducción.
// =============================================================================

const PAGE_SIZE = 10

const estadoToString = (b?: boolean): EstadoUsuario => (b ? 'ACTIVO' : 'INACTIVO')
const estadoToBool = (s?: EstadoUsuario): boolean => s === 'ACTIVO'

const toPaciente = (u: UsuarioBackend): Paciente => ({
  idUsuario: u.idUsuario,
  idPaciente: u.idUsuario,
  nombre: u.nombre,
  apellido: u.apellido,
  correo: u.correo,
  contraseña: '',
  telefono: u.telefono,
  estado: estadoToString(u.estado),
  fechaCreacion: u.fechaCreacion,
  ultimoAcceso: u.ultimoAcceso,
  numDocumento: u.numDocumento != null ? String(u.numDocumento) : '',
  fechaNacimiento: u.fechaNacimiento ?? '',
  grupoSanguineo: (u.grupoSanguineo as GrupoSanguineo) ?? 'O+',
  genero: (u.genero as Genero) ?? 'OTRO',
  eps: u.eps ?? '',
})

const toPersonalSalud = (u: UsuarioBackend): PersonalSalud => ({
  idUsuario: u.idUsuario,
  idPersonalSalud: u.idUsuario,
  nombre: u.nombre,
  apellido: u.apellido,
  correo: u.correo,
  contraseña: '',
  telefono: u.telefono,
  estado: estadoToString(u.estado),
  fechaCreacion: u.fechaCreacion,
  ultimoAcceso: u.ultimoAcceso,
  cargo: u.cargo ?? '',
  numLicencia: u.numLicencia != null ? String(u.numLicencia) : '',
  institucion: u.institucion ?? '',
})

const toAdministrador = (u: UsuarioBackend): Administrador => ({
  idUsuario: u.idUsuario,
  idAdministrador: u.idUsuario,
  nombre: u.nombre,
  apellido: u.apellido,
  correo: u.correo,
  contraseña: '',
  telefono: u.telefono,
  estado: estadoToString(u.estado),
  fechaCreacion: u.fechaCreacion,
  ultimoAcceso: u.ultimoAcceso,
  departamento: u.departamento ?? '',
})

const paginate = <T>(items: T[], page: number, size = PAGE_SIZE): PaginatedResponse<T> => {
  const totalElements = items.length
  const totalPages = Math.max(1, Math.ceil(totalElements / size))
  const from = page * size
  return {
    content: items.slice(from, from + size),
    totalElements,
    totalPages,
    number: page,
    size,
  }
}

// Asegura que el estado del usuario coincida con el solicitado, usando
// el toggle del backend si está desfasado. Es lo más cercano a un
// "actualizar estado" que ofrece el backend original.
const sincronizarEstado = async (idUsuario: number, estadoActual: boolean, estadoDeseado: boolean): Promise<UsuarioBackend | null> => {
  if (estadoActual === estadoDeseado) return null
  return cambiarEstadoUsuario(idUsuario)
}

// =============================================================================
//  PACIENTES (legacy adapter)
// =============================================================================

export const listarPacientes = async (
  page = 0,
  size = PAGE_SIZE
): Promise<PaginatedResponse<Paciente>> => {
  const data = await consultaPacientes()
  return paginate(data.map(toPaciente), page, size)
}

export const obtenerPaciente = async (id: number): Promise<Paciente> => {
  const u = await buscarUsuarioPorId(id)
  return toPaciente(u)
}

export const crearPaciente = async (payload: PacientePayload): Promise<Paciente> => {
  const created = await crearUsuarioUnificado({
    tipoUsuario: 'PACIENTE',
    nombre: payload.nombre,
    apellido: payload.apellido,
    correo: payload.correo,
    contrasena: payload.contraseña,
    telefono: payload.telefono,
    estado: estadoToBool(payload.estado),
    fechaCreacion: nowIso(),
    ultimoAcceso: nowIso(),
    numDocumento: Number(payload.numDocumento) || undefined,
    fechaNacimiento: toIso(payload.fechaNacimiento),
    grupoSanguineo: payload.grupoSanguineo,
    eps: payload.eps,
    genero: payload.genero,
  })
  return toPaciente(created)
}

// El backend NO tiene update completo. Solo podemos sincronizar el estado.
export const actualizarPaciente = async (
  id: number,
  payload: PacientePayload
): Promise<Paciente> => {
  const actual = await buscarUsuarioPorId(id)
  await sincronizarEstado(id, actual.estado, estadoToBool(payload.estado))
  const refreshed = await buscarUsuarioPorId(id)
  return toPaciente(refreshed)
}

// El backend NO tiene DELETE. Como sustituto, desactivamos el usuario.
export const eliminarPaciente = async (id: number): Promise<void> => {
  const actual = await buscarUsuarioPorId(id)
  if (actual.estado) await cambiarEstadoUsuario(id)
}

// =============================================================================
//  ADMINISTRADORES (legacy adapter)
// =============================================================================

export const listarAdministradores = async (
  page = 0,
  size = PAGE_SIZE
): Promise<PaginatedResponse<Administrador>> => {
  const data = await consultaAdministradores()
  return paginate(data.map(toAdministrador), page, size)
}

export const obtenerAdministrador = async (id: number): Promise<Administrador> => {
  const u = await buscarUsuarioPorId(id)
  return toAdministrador(u)
}

export const crearAdministrador = async (
  payload: AdministradorPayload
): Promise<Administrador> => {
  const created = await crearUsuarioUnificado({
    tipoUsuario: 'ADMINISTRADOR',
    nombre: payload.nombre,
    apellido: payload.apellido,
    correo: payload.correo,
    contrasena: payload.contraseña,
    telefono: payload.telefono,
    estado: estadoToBool(payload.estado),
    fechaCreacion: nowIso(),
    ultimoAcceso: nowIso(),
    departamento: payload.departamento,
  })
  return toAdministrador(created)
}

export const actualizarAdministrador = async (
  id: number,
  payload: AdministradorPayload
): Promise<Administrador> => {
  const actual = await buscarUsuarioPorId(id)
  await sincronizarEstado(id, actual.estado, estadoToBool(payload.estado))
  const refreshed = await buscarUsuarioPorId(id)
  return toAdministrador(refreshed)
}

export const eliminarAdministrador = async (id: number): Promise<void> => {
  const actual = await buscarUsuarioPorId(id)
  if (actual.estado) await cambiarEstadoUsuario(id)
}

// =============================================================================
//  PERSONAL DE SALUD (legacy adapter)
// =============================================================================

export const listarPersonalSalud = async (
  page = 0,
  size = PAGE_SIZE
): Promise<PaginatedResponse<PersonalSalud>> => {
  const data = await consultaPersonalSalud()
  return paginate(data.map(toPersonalSalud), page, size)
}

export const obtenerPersonalSalud = async (id: number): Promise<PersonalSalud> => {
  const u = await buscarUsuarioPorId(id)
  return toPersonalSalud(u)
}

export const crearPersonalSalud = async (
  payload: PersonalSaludPayload
): Promise<PersonalSalud> => {
  const created = await crearUsuarioUnificado({
    tipoUsuario: 'PERSONAL_SALUD',
    nombre: payload.nombre,
    apellido: payload.apellido,
    correo: payload.correo,
    contrasena: payload.contraseña,
    telefono: payload.telefono,
    estado: estadoToBool(payload.estado),
    fechaCreacion: nowIso(),
    ultimoAcceso: nowIso(),
    cargo: payload.cargo,
    numLicencia: Number(payload.numLicencia) || undefined,
    institucion: payload.institucion,
  })
  return toPersonalSalud(created)
}

export const actualizarPersonalSalud = async (
  id: number,
  payload: PersonalSaludPayload
): Promise<PersonalSalud> => {
  const actual = await buscarUsuarioPorId(id)
  await sincronizarEstado(id, actual.estado, estadoToBool(payload.estado))
  const refreshed = await buscarUsuarioPorId(id)
  return toPersonalSalud(refreshed)
}

export const eliminarPersonalSalud = async (id: number): Promise<void> => {
  const actual = await buscarUsuarioPorId(id)
  if (actual.estado) await cambiarEstadoUsuario(id)
}

export default api
