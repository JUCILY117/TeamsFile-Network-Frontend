import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ProfileProvider } from './context/ProfileContext';
import LandingPage from './pages/LandingPage';
import HomePage from './pages/HomePage';
import TeamDetails from './components/TeamDetails';
import AuthListener from './components/AuthListener';
import AuthPage from './pages/AuthPage';
import './App.css';

function App() {
  return (
    <Router>
      <AuthListener /> 
      <AuthProvider>
      <ProfileProvider>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/signup" element={<AuthPage/>}/>
        <Route path="/team/:teamId" element={<TeamDetails />} />
        <Route path="/login" element={<AuthPage/>}/>
      </Routes>
      </ProfileProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
