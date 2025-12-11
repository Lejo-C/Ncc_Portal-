import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import MainPage from "./components/MainPage";
import AdminLogin from "./components/AdminLogin";
import CadetLogin from "./Cadets/CadetLogin";
import CadetSignup from "./Cadets/CadetSignup";

// Layouts
import CadetLayout from './layouts/CadetLayout';
import AdminLayout from './layouts/AdminLayout';

// Cadet Pages (content only)
import CadetDashboardContent from './Cadets/CadetDashboardContent';
import DrillVideosPage from './Cadets/DrillVideos';
import CadetProfilePage from './Cadets/CadetProfilePage';
import CadetEventViewPage from './Cadets/CadetEventViewPage';
import CadetAttendancePage from './Cadets/CadetAttendancePage';
import CadetQueryBox from './Cadets/CadetQueryBox';

// Admin Pages (content only)
import AdminDashboardContent from './components/AdminDashboardContent';
import DrillVideoAdminPage from './components/DrillVideoAdminPage';
import CadetManagementPage from './components/CadetManagementPage';
import AdminEventUpdatePage from './components/AdminEventUpdatePage';
import AdminAttendancePage from './components/AdminAttendancePage';
import AdminQueryBox from './components/AdminQueryBox';

import EmailVerificationPage from './components/EmailVerificationPage';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<MainPage />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/cdt-login" element={<CadetLogin />} />
        <Route path="/cdt-signup" element={<CadetSignup />} />
        <Route path="/verify-email/:token" element={<EmailVerificationPage />} />

        {/* Cadet Routes - with persistent sidebar */}
        <Route path="/cadet" element={<CadetLayout />}>
          <Route index element={<Navigate to="/cadet/dashboard" replace />} />
          <Route path="dashboard" element={<CadetDashboardContent />} />
          <Route path="attendance" element={<CadetAttendancePage />} />
          <Route path="drill-videos" element={<DrillVideosPage />} />
          <Route path="query-box" element={<CadetQueryBox />} />
          <Route path="events" element={<CadetEventViewPage />} />
          <Route path="profile" element={<CadetProfilePage />} />
        </Route>

        {/* Admin Routes - with persistent sidebar */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboardContent />} />
          <Route path="cadet-management" element={<CadetManagementPage />} />
          <Route path="events" element={<AdminEventUpdatePage />} />
          <Route path="drill-videos" element={<DrillVideoAdminPage />} />
          <Route path="attendance" element={<AdminAttendancePage />} />
          <Route path="query-box" element={<AdminQueryBox />} />
        </Route>

        {/* Legacy routes redirects */}
        <Route path="/admin" element={<Navigate to="/admin-login" replace />} />
        <Route path="/cdt-dashboard" element={<Navigate to="/cadet/dashboard" replace />} />
        <Route path="/admin-dashboard" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="/profile" element={<Navigate to="/cadet/profile" replace />} />
        <Route path="/cdt-attendance" element={<Navigate to="/cadet/attendance" replace />} />
        <Route path="/drill-videos" element={<Navigate to="/cadet/drill-videos" replace />} />
        <Route path="/events" element={<Navigate to="/cadet/events" replace />} />
        <Route path="/query-box" element={<Navigate to="/cadet/query-box" replace />} />
        <Route path="/cadet-management" element={<Navigate to="/admin/cadet-management" replace />} />
        <Route path="/update-event" element={<Navigate to="/admin/events" replace />} />
        <Route path="/upload-drill" element={<Navigate to="/admin/drill-videos" replace />} />
        <Route path="/attendance" element={<Navigate to="/admin/attendance" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
