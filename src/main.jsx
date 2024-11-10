import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AuthProvider } from './context/AuthContext';
import { ProfileProvider } from './context/ProfileContext';
import App from './App.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
        <ProfileProvider>
        <AuthProvider>
    <App />
    </AuthProvider>
    </ProfileProvider>
  </StrictMode>,
)
