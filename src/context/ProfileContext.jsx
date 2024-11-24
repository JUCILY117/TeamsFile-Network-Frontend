import React, { createContext, useContext, useState, useEffect } from 'react';
import { getRandomImage } from '../utils/RandomImage';

const ProfileContext = createContext();

export const ProfileProvider = ({ children }) => {
  const [profileImage, setProfileImage] = useState(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const storedImage = localStorage.getItem('profileImage');
    
    if (storedImage) {
      setProfileImage(storedImage);
    } else {
      const randomImage = getRandomImage();
      setProfileImage(randomImage);
    }
    
    setIsReady(true);
  }, []);

  useEffect(() => {
    if (profileImage) {
      localStorage.setItem('profileImage', profileImage);
    }
  }, [profileImage]);

  const handleLogin = (userProfileImage) => {
    if (userProfileImage) {
      setProfileImage(userProfileImage);
    }
  };

  const handleLogout = () => {
    const randomImage = getRandomImage();
    setProfileImage(randomImage);
  };

  const updateProfileImage = (newImageUrl) => {
    setProfileImage(newImageUrl);
  };

  if (!isReady) {
    return null;
  }

  return (
    <ProfileContext.Provider value={{ profileImage, handleLogin, handleLogout, updateProfileImage }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => useContext(ProfileContext);
