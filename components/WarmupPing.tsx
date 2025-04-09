'use client';

import { useEffect } from 'react';

export default function WarmupPing() {
  useEffect(() => {
    const ping = () => {
      fetch('https://autograde-server.koyeb.app/ping')
        .then(res => res.text())
        .then(data => console.log('Backend pinged:', data))
        .catch(err => console.error('Error pinging backend:', err));
    };

    ping(); 

    const interval = setInterval(ping, 1000 * 60 * 7); 

    return () => clearInterval(interval); 
  }, []);

  // This component doesn't render anything
  return null;
} 