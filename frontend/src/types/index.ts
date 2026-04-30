// =============================================================================
//  VitalCode – Interfaces TypeScript
//  Derivadas del diagrama ER (ER_sinterminar.png)
//  HealthTech S.A.S.
// =============================================================================

// ─── Enums de dominio ────────────────────────────────────────────────────────

export type EstadoUsuario = 'ACTIVO' | 'INACTIVO'

export type GrupoSanguineo =
  | 'A+'
  | 'A-'
  | 'B+'
  | 'B-'
  | 'AB+'
  | 'AB-'
  | 'O+'
  | 'O-'

export type Genero = 'MASCULINO' | 'FEMENINO' | 'OTRO'

// ─── Entidad base: Usuario ────────────────────────────────────────────────────

export interface Usuario {
  idUsuario: number
  nombre: string
  apellido: string
  correo: string
  contraseña: string          // Solo se envía al crear/actualizar; nunca se muestra
  telefono: string
  estado: EstadoUsuario
  fechaCreacion: string       // ISO 8601 — lo genera el backend
  ultimoAcceso: string | null // ISO 8601
}

// ─── Entidad: Administrador (hereda Usuario 1:1) ──────────────────────────────

export interface Administrador extends Usuario {
  idAdministrador: number
  departamento: string
}

// Payload para crear/editar (sin campos auto-generados por el backend)
export type AdministradorPayload = Omit<
  Administrador,
  'idUsuario' | 'idAdministrador' | 'fechaCreacion' | 'ultimoAcceso'
>

// ─── Entidad: Personal de Salud (hereda Usuario 1:1) ─────────────────────────

export interface PersonalSalud extends Usuario {
  idPersonalSalud: number
  cargo: string
  numLicencia: string
  institucion: string
}

export type PersonalSaludPayload = Omit<
  PersonalSalud,
  'idUsuario' | 'idPersonalSalud' | 'fechaCreacion' | 'ultimoAcceso'
>

// ─── Entidad: Paciente (hereda Usuario 1:1) ───────────────────────────────────

export interface Paciente extends Usuario {
  idPaciente: number
  numDocumento: string
  fechaNacimiento: string    // ISO 8601 date
  grupoSanguineo: GrupoSanguineo
  genero: Genero
  eps: string
}

export type PacientePayload = Omit<
  Paciente,
  'idUsuario' | 'idPaciente' | 'fechaCreacion' | 'ultimoAcceso'
>

// ─── Auth ─────────────────────────────────────────────────────────────────────

export interface LoginPayload {
  correo: string
  contraseña: string
}

export interface AuthResponse {
  token: string
  tipo: string          // Ej: "Bearer"
  idUsuario: number
  nombre: string
  apellido: string
  correo: string
  rol: 'ADMINISTRADOR' | 'PERSONAL_SALUD' | 'PACIENTE'
}

// ─── Respuesta paginada genérica ─────────────────────────────────────────────

export interface PaginatedResponse<T> {
  content: T[]
  totalElements: number
  totalPages: number
  number: number        // página actual (0-indexed)
  size: number
}

// ─── Estado de formulario ────────────────────────────────────────────────────

export type FormMode = 'create' | 'edit'

// ─── Backend real: /api/v1/usuarios ──────────────────────────────────────────

export type TipoUsuario = 'PACIENTE' | 'PERSONAL_SALUD' | 'ADMINISTRADOR'

export interface UsuarioBackend {
  tipoUsuario: TipoUsuario
  idUsuario: number
  correo: string
  contrasena: string
  estado: boolean
  nombre: string
  apellido: string
  telefono: string
  fechaCreacion: string
  ultimoAcceso: string
  // ADMINISTRADOR
  departamento?: string
  // PACIENTE
  numDocumento?: number
  fechaNacimiento?: string
  grupoSanguineo?: string
  eps?: string
  genero?: string
  // PERSONAL_SALUD
  cargo?: string
  numLicencia?: number
  institucion?: string
}

export interface UsuarioPayload {
  tipoUsuario: TipoUsuario
  correo: string
  contrasena: string
  estado: boolean
  nombre: string
  apellido: string
  telefono: string
  fechaCreacion: string
  ultimoAcceso: string
  departamento?: string
  numDocumento?: number
  fechaNacimiento?: string
  grupoSanguineo?: string
  eps?: string
  genero?: string
  cargo?: string
  numLicencia?: number
  institucion?: string
}
