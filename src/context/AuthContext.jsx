import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // For navigation
import { useProfile } from './ProfileContext';

const apiBaseUrl = import.meta.env.VITE_BASE_API;

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const { handleLogin, handleLogout } = useProfile();

  // Function to fetch user data using the token
  const fetchUser = async () => {
    if (token) {
      try {
        const response = await axios.get(`${apiBaseUrl}/api/auth/user`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const userData = response.data;
        setUser(userData);  // Set the user data
        handleLogin(userData.profileImage);  // Set the user's profile image
      } catch (error) {
        console.error('Error fetching user data:', error);
        setUser(null);
        setToken(null);
        localStorage.removeItem('token');
      }
    } else {
      setUser(null);
    }
  };

  useEffect(() => {
    fetchUser(); // Fetch user data on token change or first mount
  }, [token, handleLogin]);

  // Login function that updates the token and fetches the user data
  const login = (token) => {
    setToken(token);
    localStorage.setItem('token', token);
    fetchUser(); // Fetch user data after setting the token
  };

  // Logout function that removes the token and clears user data
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    handleLogout();
    window.location.href='/login';  // Use navigate for React Router navigation
  };

  return (
    <AuthContext.Provider value={{ user, setUser, setToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
