'use client';

import { useEffect } from 'react';

export default function WarmupPing() {
  useEffect(() => {
    fetch('https://autograde-server.koyeb.app/ping')
      .then(res => res.text())
      .then(data => console.log('Backend pinged:', data))
      .catch(err => console.error('Error pinging backend:', err));
  }, []);

  // This component doesn't render anything
  return null;
} 