/**
 * Offline Debug Utilities
 * 
 * Console helpers for testing PWA offline functionality.
 * Available globally as window.offline
 */

export const offlineDebug = {
  /**
   * Clear all service workers and caches, then reload
   */
  async clearAll(): Promise<void> {
    console.log('🗑️ Clearing all service workers and caches...');
    
    try {
      // Unregister service workers
      const registrations = await navigator.serviceWorker.getRegistrations();
      await Promise.all(registrations.map(reg => reg.unregister()));
      console.log('✅ Service workers unregistered');

      // Delete caches
      const cacheNames = await caches.keys();
      await Promise.all(cacheNames.map(name => caches.delete(name)));
      console.log('✅ Caches deleted');

      console.log('🔄 Reloading in 2 seconds...');
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error('❌ Clear failed:', error);
    }
  },

  /**
   * Check cache status
   */
  async checkCache(): Promise<void> {
    console.log('🔍 Checking cache status...\n');

    try {
      const cacheNames = await caches.keys();
      console.log('📦 Cache names:', cacheNames);

      if (cacheNames.length === 0) {
        console.log('❌ No caches found');
        console.log('💡 Visit the app online first to build cache');
        return;
      }

      for (const cacheName of cacheNames) {
        const cache = await caches.open(cacheName);
        const keys = await cache.keys();
        console.log(`\n📂 ${cacheName}:`);
        console.log(`   Files: ${keys.length}`);
        
        if (keys.length > 0) {
          console.log('   Contents:');
          keys.forEach((request, index) => {
            const url = new URL(request.url);
            console.log(`   ${index + 1}. ${url.pathname}`);
          });
        }
      }

      console.log('\n✅ Cache check complete');
    } catch (error) {
      console.error('❌ Cache check failed:', error);
    }
  },

  /**
   * Check service worker status
   */
  async checkServiceWorker(): Promise<void> {
    console.log('🔍 Checking service worker status...\n');

    if (!('serviceWorker' in navigator)) {
      console.log('❌ Service workers not supported');
      return;
    }

    try {
      const registrations = await navigator.serviceWorker.getRegistrations();

      if (registrations.length === 0) {
        console.log('❌ No service worker registered');
        console.log('💡 Reload the page to register');
        return;
      }

      registrations.forEach((reg, index) => {
        console.log(`\n📋 Registration ${index + 1}:`);
        console.log('   Scope:', reg.scope);
        
        if (reg.installing) {
          console.log('   Installing:', reg.installing.state);
        }
        if (reg.waiting) {
          console.log('   Waiting:', reg.waiting.state);
        }
        if (reg.active) {
          console.log('   Active:', reg.active.state);
          console.log('   Script:', reg.active.scriptURL);
        }
      });

      if (navigator.serviceWorker.controller) {
        console.log('\n✅ Service worker is controlling this page');
      } else {
        console.log('\n⚠️ Service worker not controlling page yet');
        console.log('💡 Reload the page to activate');
      }
    } catch (error) {
      console.error('❌ Service worker check failed:', error);
    }
  },

  /**
   * Full diagnostic
   */
  async diagnostic(): Promise<void> {
    console.log('═══════════════════════════════════════');
    console.log('🔍 PWA OFFLINE DIAGNOSTIC');
    console.log('═══════════════════════════════════════\n');

    // Network status
    console.log('1️⃣ NETWORK STATUS');
    console.log('   Online:', navigator.onLine ? '✅ Yes' : '⚠️ No (Offline)');
    console.log('');

    // Service worker
    console.log('2️⃣ SERVICE WORKER');
    await this.checkServiceWorker();
    console.log('');

    // Cache
    console.log('3️⃣ CACHE');
    await this.checkCache();
    console.log('');

    console.log('═══════════════════════════════════════');
    console.log('📊 SUMMARY');
    console.log('═══════════════════════════════════════');
    
    const hasServiceWorker = navigator.serviceWorker.controller !== null;
    const cacheNames = await caches.keys();
    const hasCache = cacheNames.length > 0;
    
    if (hasServiceWorker && hasCache) {
      console.log('✅ PWA is ready for offline mode!');
      console.log('');
      console.log('🧪 To test:');
      console.log('   1. F12 → Network → Offline');
      console.log('   2. Reload page (Ctrl+R)');
      console.log('   3. Should work! ✅');
    } else {
      console.log('⚠️ PWA not fully ready');
      console.log('');
      if (!hasServiceWorker) {
        console.log('   ❌ Service worker not active');
        console.log('   💡 Reload the page');
      }
      if (!hasCache) {
        console.log('   ❌ No cache found');
        console.log('   💡 Make sure you\'re online');
        console.log('   💡 Wait 10 seconds after page load');
      }
    }
    console.log('═══════════════════════════════════════');
  },

  /**
   * Force service worker update
   */
  async forceUpdate(): Promise<void> {
    console.log('🔄 Forcing service worker update...');

    try {
      const registrations = await navigator.serviceWorker.getRegistrations();
      
      if (registrations.length === 0) {
        console.log('❌ No service worker to update');
        return;
      }

      await registrations[0].update();
      console.log('✅ Update triggered');
      console.log('💡 Close all tabs and reopen to activate new version');
    } catch (error) {
      console.error('❌ Update failed:', error);
    }
  },

  /**
   * Show help
   */
  help(): void {
    console.log('═══════════════════════════════════════');
    console.log('📚 OFFLINE DEBUG COMMANDS');
    console.log('═══════════════════════════════════════\n');
    
    console.log('offline.clearAll()');
    console.log('  → Clear everything and reload\n');
    
    console.log('offline.diagnostic()');
    console.log('  → Full diagnostic check\n');
    
    console.log('offline.checkCache()');
    console.log('  → Check cache contents\n');
    
    console.log('offline.checkServiceWorker()');
    console.log('  → Check service worker status\n');
    
    console.log('offline.forceUpdate()');
    console.log('  → Force service worker update\n');
    
    console.log('offline.help()');
    console.log('  → Show this help\n');
    
    console.log('═══════════════════════════════════════');
    console.log('🎯 QUICK START:');
    console.log('═══════════════════════════════════════\n');
    console.log('1. offline.clearAll()    // Clear old data');
    console.log('2. Wait for reload');
    console.log('3. Wait 10 seconds');
    console.log('4. offline.diagnostic()  // Check status');
    console.log('5. Test offline!');
    console.log('');
  }
};

// Expose to window and show welcome message
if (typeof window !== 'undefined') {
  (window as any).offline = offlineDebug;
  
  // Show styled welcome message
  setTimeout(() => {
    console.log('%c🚀 PWA Offline Testing Ready!', 'font-size: 16px; font-weight: bold; color: #0066cc; background: #f0f8ff; padding: 8px; border-radius: 4px;');
    console.log('');
    console.log('%c📋 Quick Test (30 seconds):', 'font-weight: bold; font-size: 14px;');
    console.log('%c1.', 'font-weight: bold;', 'offline.clearAll()', '%c→ Clear & reload', 'color: #666;');
    console.log('%c2.', 'font-weight: bold;', 'Wait 10 seconds after reload');
    console.log('%c3.', 'font-weight: bold;', 'offline.diagnostic()', '%c→ Check if ready', 'color: #666;');
    console.log('%c4.', 'font-weight: bold;', 'F12 → Network → Offline → Reload');
    console.log('');
    console.log('%c💡 All Commands:', 'font-weight: bold;');
    console.log('offline.help()', '%c→ Show all commands', 'color: #666;');
    console.log('');
    console.log('%c📚 Guides:', 'font-weight: bold;');
    console.log('/QUICK_TEST.md', '%c→ Step-by-step testing', 'color: #666;');
    console.log('');
  }, 1000); // Delay so PWA init messages show first
}
