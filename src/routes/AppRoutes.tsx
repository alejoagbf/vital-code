import { Routes, Route, Navigate } from 'react-router-dom';

// Importamos únicamente la LandingPage que ya tienes lista
import LandingPage from '../components/pages/LandingPage';

export default function AppRoutes() {
  return (
    <Routes>
      
      <Route path="/" element={<LandingPage />} />

      {/* Si por error alguien escribe otra cosa en la URL, lo regresamos al inicio */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}