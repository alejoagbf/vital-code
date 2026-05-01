import { Routes, Route, Navigate } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import GestionUsuariosPage from './pages/GestionUsuariosPage'
import MiCodigoQRPage from './pages/MiCodigoQRPage'
import PacientesPage from './pages/PacientesPage'
import AdministradoresPage from './pages/AdministradoresPage'
import PersonalSaludPage from './pages/PersonalSaludPage'
import EstadisticasPage from './pages/EstadisticasPage'
import DashboardLayout from './components/layout/DashboardLayout'

type Rol = 'ADMINISTRADOR' | 'PERSONAL_SALUD' | 'PACIENTE'

function obtenerRol(): Rol | null {
  try {
    const raw = localStorage.getItem('vitalcode_user')
    if (!raw) return null
    const u = JSON.parse(raw)
    return (u.tipoUsuario as Rol) ?? null
  } catch {
    return null
  }
}

function ProtectedRoute({ children, roles }: { children: JSX.Element; roles?: Rol[] }) {
  const token = localStorage.getItem('vitalcode_token')
  if (!token) return <Navigate to="/login" replace />
  if (roles && roles.length > 0) {
    const rol = obtenerRol()
    if (!rol || !roles.includes(rol)) {
      return <Navigate to="/dashboard" replace />
    }
  }
  return children
}

function Placeholder({ title }: { title: string }) {
  return (
    <DashboardLayout>
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <p className="text-2xl font-black text-gray-200 mb-2">{title}</p>
        <p className="text-sm text-gray-400">Esta sección estará disponible próximamente.</p>
      </div>
    </DashboardLayout>
  )
}

export default function App() {
  return (
    <Routes>
      {/* Públicas */}
      <Route path="/"          element={<LandingPage />} />
      <Route path="/login"     element={<LoginPage />} />
      <Route path="/register"  element={<RegisterPage />} />

      {/* Protegidas - todos los roles */}
      <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />

      {/* Solo paciente */}
      <Route path="/mi-codigo-qr" element={
        <ProtectedRoute roles={['PACIENTE']}><MiCodigoQRPage /></ProtectedRoute>
      } />

      {/* Solo administrador */}
      <Route path="/administracion" element={
        <ProtectedRoute roles={['ADMINISTRADOR']}><GestionUsuariosPage /></ProtectedRoute>
      } />
      <Route path="/administradores" element={
        <ProtectedRoute roles={['ADMINISTRADOR']}><AdministradoresPage /></ProtectedRoute>
      } />

      {/* Admin y personal salud */}
      <Route path="/estadisticas" element={
        <ProtectedRoute roles={['ADMINISTRADOR']}><EstadisticasPage /></ProtectedRoute>
      } />
      <Route path="/pacientes" element={
        <ProtectedRoute roles={['ADMINISTRADOR', 'PERSONAL_SALUD']}><PacientesPage /></ProtectedRoute>
      } />
      <Route path="/personal-salud" element={
        <ProtectedRoute roles={['ADMINISTRADOR', 'PERSONAL_SALUD']}><PersonalSaludPage /></ProtectedRoute>
      } />

      {/* Comunes (placeholder) */}
      <Route path="/historial" element={<ProtectedRoute><Placeholder title="Historial Clínico" /></ProtectedRoute>} />
      <Route path="/citas"     element={<ProtectedRoute><Placeholder title="Citas Médicas" /></ProtectedRoute>} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
