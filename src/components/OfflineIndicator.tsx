/**
 * Offline Indicator Component
 * 
 * Shows a banner when the app is running offline from cache.
 * Uses design system tokens for consistent styling.
 */

import { useState, useEffect } from 'react';

export function OfflineIndicator() {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [isCached, setIsCached] = useState(false);

  useEffect(() => {
    // Check if service worker is active and controlling the page
    const checkCacheStatus = async () => {
      if (navigator.serviceWorker.controller) {
        setIsCached(true);
      }
    };

    checkCacheStatus();

    // Listen for online/offline events
    const handleOnline = () => {
      console.log('[PWA] Network connection restored');
      setIsOffline(false);
    };

    const handleOffline = () => {
      console.log('[PWA] Network connection lost - running from cache');
      setIsOffline(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Only show indicator if offline AND we have cached content
  if (!isOffline || !isCached) {
    return null;
  }

  return (
    <div 
      className="w-full px-4 py-2 text-center"
      style={{
        backgroundColor: '#ff6b00',
        color: '#ffffff'
      }}
    >
      <p 
        className="font-['Noto_Sans']"
        style={{
          fontSize: 'var(--text-sm)',
          fontWeight: 'var(--font-weight-medium)'
        }}
      >
        📱 Running offline from cache
      </p>
    </div>
  );
}
