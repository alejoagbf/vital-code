import { Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import PacientesPage from './pages/PacientesPage'
import AdministradoresPage from './pages/AdministradoresPage'
import PersonalSaludPage from './pages/PersonalSaludPage'

// Guard simple basado en token JWT en localStorage
// TODO: cuando el backend esté listo, cambiar 'true' por: !!localStorage.getItem('vitalcode_token')
function ProtectedRoute({ children }: { children: JSX.Element }) {
  const token = true || localStorage.getItem('vitalcode_token')
  return token ? children : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route
        path="/pacientes"
        element={<ProtectedRoute><PacientesPage /></ProtectedRoute>}
      />
      <Route
        path="/administradores"
        element={<ProtectedRoute><AdministradoresPage /></ProtectedRoute>}
      />
      <Route
        path="/personal-salud"
        element={<ProtectedRoute><PersonalSaludPage /></ProtectedRoute>}
      />

      {/* Redirige la raíz al módulo de pacientes (o al login si no hay sesión) */}
      <Route path="/" element={<Navigate to="/pacientes" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}
