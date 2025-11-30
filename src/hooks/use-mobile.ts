'use client';

import { useState, useEffect } from 'react';

export function useIsMobile(query: string = '(max-width: 767px)') {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') {
        return;
    }

    const mediaQuery = window.matchMedia(query);
    const handleResize = () => {
      setIsMobile(mediaQuery.matches);
    };

    // Set the initial state
    handleResize();

    // Add event listener for changes
    mediaQuery.addEventListener('change', handleResize);

    // Clean up event listener on unmount
    return () => {
      mediaQuery.removeEventListener('change', handleResize);
    };
  }, [query]);

  return isMobile;
}
