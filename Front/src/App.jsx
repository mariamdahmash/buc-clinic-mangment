import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import ClinicLandingPage from './pages/ClinicLandingPage';
import NotFoundPage from './pages/NotFoundPage';
import LoginPage from './pages/LoginPage';
import SuperAdminDashboard from './pages/admin/SuperAdminDashboard';
import ClinicAdminDashboard from './pages/admin/ClinicAdminDashboard';
import { AuthProvider, useAuth } from './context/AuthContext';

function RoleGuard({ role }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== role) return <Navigate to={user.role === 'superadmin' ? '/super-admin' : user.role === 'clinicadmin' ? '/clinic-admin' : '/login'} replace />;
  return <Outlet />;
}
function AppRoutes() {
  return <Routes>
    <Route path="/login" element={<LoginPage />} />
    <Route element={<RoleGuard role="superadmin" />}><Route path="/super-admin" element={<SuperAdminDashboard />} /></Route>
    <Route element={<RoleGuard role="clinicadmin" />}><Route path="/clinic-admin" element={<ClinicAdminDashboard />} /></Route>
    <Route path="/" element={<Navigate to="/shorouk-clinic" replace />} />
    <Route path="/:slug" element={<ClinicLandingPage />} />
    <Route path="*" element={<NotFoundPage />} />
  </Routes>;
}
export default function App() {
  return <BrowserRouter><AuthProvider><AppRoutes /></AuthProvider></BrowserRouter>;
}
