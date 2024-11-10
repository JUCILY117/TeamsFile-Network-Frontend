import React, { useEffect } from 'react';

function AuthListener() {
  useEffect(() => {
    // This function will handle messages from Website A
    const handleMessage = (event) => {
      // Ensure the message comes from Website A (replace with your actual URL)
      if (event.origin === 'http://localhost:5174' && event.data.type === 'auth') {
        const { authToken } = event.data;

        if (authToken) {
          // Store the token in localStorage (or sessionStorage if you prefer)
          localStorage.setItem('token', authToken);

          // You can add any additional logic here, like setting a user state or making API calls

          // Optionally, navigate to a page after logging in
          window.location.href = '/home';  // Redirect to homepage or a dashboard page
        } else {
          console.error('Received invalid auth token');
        }
      }
    };

    // Add event listener for 'message' events
    window.addEventListener('message', handleMessage);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  return null;  // This component doesn't need to render anything
}

export default AuthListener;
