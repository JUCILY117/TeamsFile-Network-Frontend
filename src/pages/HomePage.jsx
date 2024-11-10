import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import HomeContent from '../components/HomeContent';
import TeamsContent from '../components/TeamsContent';
import RecentContent from '../components/RecentContent';
import { useAuth } from '../context/AuthContext';

function HomePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const Token = localStorage.getItem('token');
  const [selected, setSelected] = useState(() => {
    return localStorage.getItem('selected') || 'home';
  });

  useEffect(() => {
    localStorage.setItem('selected', selected);
  }, [selected]);

  useEffect(() => {
    if (!Token) {
      navigate('/login');
    }
  }, [Token, navigate]);

  return (
    <>
      <Navbar />
      <div className="flex">
        {/* Sidebar */}
        <Sidebar selected={selected} setSelected={setSelected} />

        {/* Main Content */}
        <div className="flex-1 bg-gray-100 h-auto min-h-screen">
          {selected === 'home' && <HomeContent />}
          {selected === 'teams' && <TeamsContent />}
          {selected === 'recent' && <RecentContent />}
        </div>
      </div>
    </>
  );
}

export default HomePage;
