import React, { useEffect } from 'react';

function AuthListener() {
  useEffect(() => {
    const handleMessage = (event) => {
      if (event.origin === 'http://localhost:5174' && event.data.type === 'auth') {
        const { authToken } = event.data;

        if (authToken) {
          localStorage.setItem('token', authToken);

          window.location.href = '/home';
        } else {
          console.error('Received invalid auth token');
        }
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  return null;
}

export default AuthListener;
