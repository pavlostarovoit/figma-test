/**
 * PWA Install Prompt Component
 * Shows install instructions and handles the install prompt
 */

import { useEffect, useState } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    // Listen for beforeinstallprompt event
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      const promptEvent = e as BeforeInstallPromptEvent;
      setDeferredPrompt(promptEvent);
      setShowPrompt(true);
      console.log('[PWA] Install prompt is ready!');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    // Listen for app installed event
    const handleAppInstalled = () => {
      console.log('[PWA] App was installed');
      setIsInstalled(true);
      setShowPrompt(false);
    };

    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    // Show the install prompt
    await deferredPrompt.prompt();

    // Wait for the user's response
    const choiceResult = await deferredPrompt.userChoice;

    if (choiceResult.outcome === 'accepted') {
      console.log('[PWA] User accepted the install prompt');
    } else {
      console.log('[PWA] User dismissed the install prompt');
    }

    // Clear the prompt
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
  };

  // Don't show if already installed
  if (isInstalled) {
    return null;
  }

  // Don't show if prompt not ready
  if (!showPrompt || !deferredPrompt) {
    return null;
  }

  return (
    <div 
      className="fixed bottom-4 left-4 right-4 z-50 bg-black text-white rounded-lg shadow-lg"
      style={{
        maxWidth: '400px',
        margin: '0 auto',
      }}
    >
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 
              className="font-['Noto_Sans'] text-white mb-1"
              style={{ 
                fontSize: 'var(--text-lg)', 
                fontWeight: 'var(--font-weight-medium)' 
              }}
            >
              Install App
            </h3>
            <p 
              className="font-['Noto_Sans'] text-white opacity-80"
              style={{ 
                fontSize: 'var(--text-sm)', 
                fontWeight: 'var(--font-weight-normal)' 
              }}
            >
              Install Thrust Monitor for offline use and quick access
            </p>
          </div>
          <button
            onClick={handleDismiss}
            className="text-white opacity-60 hover:opacity-100 transition-opacity"
            aria-label="Dismiss"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path 
                d="M15 5L5 15M5 5L15 15" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
        
        <div className="flex gap-2 mt-3">
          <button
            onClick={handleInstallClick}
            className="flex-1 bg-white text-black px-4 py-2 rounded font-['Noto_Sans'] hover:bg-gray-100 transition-colors"
            style={{ 
              fontSize: 'var(--text-sm)', 
              fontWeight: 'var(--font-weight-medium)' 
            }}
          >
            Install
          </button>
          <button
            onClick={handleDismiss}
            className="px-4 py-2 rounded font-['Noto_Sans'] text-white opacity-80 hover:opacity-100 transition-opacity"
            style={{ 
              fontSize: 'var(--text-sm)', 
              fontWeight: 'var(--font-weight-normal)' 
            }}
          >
            Not Now
          </button>
        </div>
      </div>
    </div>
  );
}
