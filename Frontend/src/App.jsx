import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import MainPage from "./components/MainPage";
import AdminLogin from "./components/AdminLogin";
import CadetLogin from "./Cadets/CadetLogin";
import CadetDashboard from './Cadets/CadetDashboard';
import AdminDashboard from './components/AdminDashboard';
import DrillVideosPage from './Cadets/DrillVideos';
import DrillVideoAdminPage from './components/DrillVideoAdminPage';
import CadetManagementPage from './components/CadetManagementPage';

function App() {
  

  return (
    <>
      <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/cdt-login" element={<CadetLogin />} />
        <Route path="/cdt-dashboard" element={<CadetDashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/drill-videos" element={<DrillVideosPage />} />
        <Route path="/upload-drill" element={<DrillVideoAdminPage />} />
        <Route path="/cadet-management" element={<CadetManagementPage />} />
      </Routes>
    </Router>
    </>
  )
}

export default App
