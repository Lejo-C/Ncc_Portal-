import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import MainPage from "./components/MainPage";
import AdminLogin from "./components/AdminLogin";
import CadetLogin from "./components/CadetLogin";
import CadetDashboard from './components/CadetDashboard';
import AdminDashboard from './components/AdminDashboard';

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
      </Routes>
    </Router>
    </>
  )
}

export default App
