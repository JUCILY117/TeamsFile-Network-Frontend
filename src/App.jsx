import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProfileProvider } from './context/ProfileContext';
import LandingPage from './pages/LandingPage';
import HomePage from './pages/HomePage';
import TeamDetails from './components/TeamDetails';
import AuthListener from './components/AuthListener';
import Navbar from './components/Navbar';
import AuthPage from './pages/AuthPage';
import MaintenancePage from './pages/Maintenance';
import './App.css';

function App() {
  const isMaintenanceMode = import.meta.env.VITE_MAINTENANCE_MODE === 'true';

  if (isMaintenanceMode) {
    return <MaintenancePage />;
  }

  return (
    <Router>
      <AuthListener /> 
      <AuthProvider>
        <ProfileProvider>
          <Navbar/>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/signup" element={<AuthPage />} />
            <Route path="/team/:teamId" element={<TeamDetails />} />
            <Route path="/login" element={<AuthPage />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </ProfileProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
