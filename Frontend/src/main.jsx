import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { VideoProvider } from "./context/VideoContext";
import { AuthProvider } from "./context/AuthContext";


createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <VideoProvider>
      <App />
    </VideoProvider>
  </AuthProvider>
)
