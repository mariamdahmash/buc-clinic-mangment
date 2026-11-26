import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import ClinicLandingPage from './pages/ClinicLandingPage';
import NotFoundPage from './pages/NotFoundPage';
import LoginPage from './pages/LoginPage';
import SuperAdminDashboard from './pages/admin/SuperAdminDashboard';
import AdminLayout from './pages/admin/AdminLayout';
import ClinicOverview from './pages/admin/ClinicOverview';
import SpecialtiesPage from './pages/admin/SpecialtiesPage';
import DoctorsPage from './pages/admin/DoctorsPage';
import ServicesPage from './pages/admin/ServicesPage';
import SchedulesPage from './pages/admin/SchedulesPage';
import BookingsPage from './pages/admin/BookingsPage';
import { AuthProvider, useAuth } from './context/AuthContext';

function RoleGuard({ role }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== role) {
    return (
      <Navigate
        to={
          user.role === 'superadmin'
            ? '/super-admin'
            : user.role === 'clinicadmin'
              ? '/clinic-admin'
              : '/login'
        }
        replace
      />
    );
  }
  return <Outlet />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      {/* مسارات مدير النظام */}
      <Route element={<RoleGuard role="superadmin" />}>
        <Route path="/super-admin" element={<SuperAdminDashboard />} />
      </Route>

      {/* مسارات مدير العيادة (السايد بار + الصفحات المستقلة) */}
      <Route element={<RoleGuard role="clinicadmin" />}>
        <Route path="/clinic-admin" element={<AdminLayout />}>
          <Route index element={<ClinicOverview />} />
          <Route path="specialties" element={<SpecialtiesPage />} />
          <Route path="doctors" element={<DoctorsPage />} />
          <Route path="services" element={<ServicesPage />} />
          <Route path="schedules" element={<SchedulesPage />} />
          <Route path="bookings" element={<BookingsPage />} />
        </Route>
      </Route>

      {/* المسارات العامة للعيادات */}
      <Route path="/" element={<Navigate to="/shorok-clinic" replace />} />
      <Route path="/:slug" element={<ClinicLandingPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}