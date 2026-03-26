"use client";

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { trackPageView } from '@/lib/analytics';

export const usePageTracking = () => {
  const pathname = usePathname();

  useEffect(() => {
    // Only track if we're on the client side and have valid data
    if (typeof window !== 'undefined' && pathname) {
      // Get search params from window.location to avoid SSR issues
      const searchParams = window.location.search;
      const url = pathname + searchParams;
      trackPageView(url);
    }
  }, [pathname]);
}; 