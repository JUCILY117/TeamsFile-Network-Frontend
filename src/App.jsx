import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProfileProvider } from './context/ProfileContext';
import LandingPage from './pages/LandingPage';
import HomePage from './pages/HomePage';
import TeamDetails from './components/TeamDetails';
import AuthListener from './components/AuthListener';
import AuthPage from './pages/AuthPage';
import MaintenancePage from './pages/Maintenance';
import './App.css';

function App() {
  // Check if the app is in maintenance mode using environment variable
  const isMaintenanceMode = import.meta.env.VITE_MAINTENANCE_MODE === 'true';

  if (isMaintenanceMode) {
    // If maintenance mode is true, render the maintenance page and block all other routes
    return <MaintenancePage />;
  }

  return (
    <Router>
      <AuthListener /> 
      <AuthProvider>
        <ProfileProvider>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/signup" element={<AuthPage />} />
            <Route path="/team/:teamId" element={<TeamDetails />} />
            <Route path="/login" element={<AuthPage />} />
            {/* Redirect any invalid routes to Home or Landing Page */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </ProfileProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
