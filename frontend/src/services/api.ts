// =============================================================================
//  VitalCode – Capa de servicios / API
//  HealthTech S.A.S.
//
//  ✅ Todas las funciones usan axios con interceptores para el token JWT.
//  📌 Busca los comentarios "ENDPOINT SPRING BOOT" para pegar las URLs.
// =============================================================================

import axios from 'axios'
import type {
  LoginPayload,
  AuthResponse,
  Paciente,
  PacientePayload,
  Administrador,
  AdministradorPayload,
  PersonalSalud,
  PersonalSaludPayload,
  PaginatedResponse,
} from '../types'

// ─── Configuración base de Axios ──────────────────────────────────────────────

// 📌 ENDPOINT SPRING BOOT: cambia esta URL base cuando tu compañero te dé la URL del servidor
const BASE_URL = 'http://localhost:8080/api'

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

// Interceptor: adjunta el token JWT en cada petición
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('vitalcode_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Interceptor: manejo global de errores (401 → redirige al login)
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

// =============================================================================
//  AUTH
// =============================================================================

/**
 * Inicia sesión y almacena el token JWT en localStorage.
 * 📌 ENDPOINT SPRING BOOT: POST /api/auth/login
 */
export const login = async (payload: LoginPayload): Promise<AuthResponse> => {
  const { data } = await api.post<AuthResponse>('/auth/login', payload)
  localStorage.setItem('vitalcode_token', data.token)
  return data
}

/**
 * Cierra sesión y elimina el token del almacenamiento local.
 */
export const logout = (): void => {
  localStorage.removeItem('vitalcode_token')
}

// =============================================================================
//  PACIENTES
// =============================================================================

/**
 * Lista todos los pacientes (paginado).
 * 📌 ENDPOINT SPRING BOOT: GET /api/pacientes?page=0&size=10
 */
export const listarPacientes = async (
  page = 0,
  size = 10
): Promise<PaginatedResponse<Paciente>> => {
  const { data } = await api.get<PaginatedResponse<Paciente>>(
    `/pacientes?page=${page}&size=${size}`
  )
  return data
}

/**
 * Obtiene un paciente por ID.
 * 📌 ENDPOINT SPRING BOOT: GET /api/pacientes/{id}
 */
export const obtenerPaciente = async (id: number): Promise<Paciente> => {
  const { data } = await api.get<Paciente>(`/pacientes/${id}`)
  return data
}

/**
 * Crea un nuevo paciente.
 * 📌 ENDPOINT SPRING BOOT: POST /api/pacientes
 */
export const crearPaciente = async (
  payload: PacientePayload
): Promise<Paciente> => {
  const { data } = await api.post<Paciente>('/pacientes', payload)
  return data
}

/**
 * Actualiza un paciente existente.
 * 📌 ENDPOINT SPRING BOOT: PUT /api/pacientes/{id}
 */
export const actualizarPaciente = async (
  id: number,
  payload: PacientePayload
): Promise<Paciente> => {
  const { data } = await api.put<Paciente>(`/pacientes/${id}`, payload)
  return data
}

/**
 * Elimina un paciente.
 * 📌 ENDPOINT SPRING BOOT: DELETE /api/pacientes/{id}
 */
export const eliminarPaciente = async (id: number): Promise<void> => {
  await api.delete(`/pacientes/${id}`)
}

// =============================================================================
//  ADMINISTRADORES
// =============================================================================

/**
 * Lista todos los administradores (paginado).
 * 📌 ENDPOINT SPRING BOOT: GET /api/administradores?page=0&size=10
 */
export const listarAdministradores = async (
  page = 0,
  size = 10
): Promise<PaginatedResponse<Administrador>> => {
  const { data } = await api.get<PaginatedResponse<Administrador>>(
    `/administradores?page=${page}&size=${size}`
  )
  return data
}

/**
 * Obtiene un administrador por ID.
 * 📌 ENDPOINT SPRING BOOT: GET /api/administradores/{id}
 */
export const obtenerAdministrador = async (
  id: number
): Promise<Administrador> => {
  const { data } = await api.get<Administrador>(`/administradores/${id}`)
  return data
}

/**
 * Crea un nuevo administrador.
 * 📌 ENDPOINT SPRING BOOT: POST /api/administradores
 */
export const crearAdministrador = async (
  payload: AdministradorPayload
): Promise<Administrador> => {
  const { data } = await api.post<Administrador>('/administradores', payload)
  return data
}

/**
 * Actualiza un administrador existente.
 * 📌 ENDPOINT SPRING BOOT: PUT /api/administradores/{id}
 */
export const actualizarAdministrador = async (
  id: number,
  payload: AdministradorPayload
): Promise<Administrador> => {
  const { data } = await api.put<Administrador>(
    `/administradores/${id}`,
    payload
  )
  return data
}

/**
 * Elimina un administrador.
 * 📌 ENDPOINT SPRING BOOT: DELETE /api/administradores/{id}
 */
export const eliminarAdministrador = async (id: number): Promise<void> => {
  await api.delete(`/administradores/${id}`)
}

// =============================================================================
//  PERSONAL DE SALUD
// =============================================================================

/**
 * Lista todo el personal de salud (paginado).
 * 📌 ENDPOINT SPRING BOOT: GET /api/personal-salud?page=0&size=10
 */
export const listarPersonalSalud = async (
  page = 0,
  size = 10
): Promise<PaginatedResponse<PersonalSalud>> => {
  const { data } = await api.get<PaginatedResponse<PersonalSalud>>(
    `/personal-salud?page=${page}&size=${size}`
  )
  return data
}

/**
 * Obtiene un miembro del personal de salud por ID.
 * 📌 ENDPOINT SPRING BOOT: GET /api/personal-salud/{id}
 */
export const obtenerPersonalSalud = async (
  id: number
): Promise<PersonalSalud> => {
  const { data } = await api.get<PersonalSalud>(`/personal-salud/${id}`)
  return data
}

/**
 * Crea un nuevo miembro del personal de salud.
 * 📌 ENDPOINT SPRING BOOT: POST /api/personal-salud
 */
export const crearPersonalSalud = async (
  payload: PersonalSaludPayload
): Promise<PersonalSalud> => {
  const { data } = await api.post<PersonalSalud>('/personal-salud', payload)
  return data
}

/**
 * Actualiza un miembro del personal de salud.
 * 📌 ENDPOINT SPRING BOOT: PUT /api/personal-salud/{id}
 */
export const actualizarPersonalSalud = async (
  id: number,
  payload: PersonalSaludPayload
): Promise<PersonalSalud> => {
  const { data } = await api.put<PersonalSalud>(
    `/personal-salud/${id}`,
    payload
  )
  return data
}

/**
 * Elimina un miembro del personal de salud.
 * 📌 ENDPOINT SPRING BOOT: DELETE /api/personal-salud/{id}
 */
export const eliminarPersonalSalud = async (id: number): Promise<void> => {
  await api.delete(`/personal-salud/${id}`)
}

export default api
