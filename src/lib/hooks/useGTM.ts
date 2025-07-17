'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { initGTM, trackPageView } from '../gtm';

export const useGTM = () => {
  const pathname = usePathname();

  useEffect(() => {
    // Initialize GTM
    initGTM();
  }, []);

  useEffect(() => {
    // Track page views on route changes
    if (pathname) {
      trackPageView(window.location.href);
    }
  }, [pathname]);

  return {
    trackPageView,
  };
}; 