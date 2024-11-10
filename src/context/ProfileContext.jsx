import React, { createContext, useContext, useState, useEffect } from 'react';
import { getRandomImage } from '../utils/RandomImage';

const ProfileContext = createContext();

export const ProfileProvider = ({ children }) => {
  const [profileImage, setProfileImage] = useState(() => {
    return localStorage.getItem('profileImage') || getRandomImage();
  });

  useEffect(() => {
    localStorage.setItem('profileImage', profileImage);
  }, [profileImage]);

  const handleLogin = (userProfileImage) => {
    setProfileImage(userProfileImage || profileImage);
  };

  const handleLogout = () => {
    setProfileImage(getRandomImage());
  };

  const updateProfileImage = (newImageUrl) => {
    setProfileImage(newImageUrl);
    localStorage.setItem('profileImage', newImageUrl);
  };

  return (
    <ProfileContext.Provider value={{ profileImage, handleLogin, handleLogout, updateProfileImage }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => useContext(ProfileContext);
