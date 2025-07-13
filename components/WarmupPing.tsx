'use client';

import { useEffect } from 'react';
import { config } from '../config';

export default function WarmupPing() {
  useEffect(() => {
    fetch(`${config.api.baseUrl}/ping`)
      .then(res => res.text())
      .then(data => console.log('Backend pinged:', data))
      .catch(err => console.error('Error pinging backend:', err));
  }, []);

  // This component doesn't render anything
  return null;
} 