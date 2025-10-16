import { useEffect } from 'react';
import svgPaths from './imports/svg-6eos6lj7at';
import svgPathsDisconnected from './imports/svg-4ui8lfeb8l';
import { useMeasurementData } from './hooks/useMeasurementData';
// For testing without hardware, uncomment the next line and use useMockData instead:
// import { useMockData } from './hooks/useMockData';
import { ThrustGraph } from './components/ThrustGraph';
import { CameraFeed } from './components/CameraFeed';
import { APP_CONFIG, STATE_CONFIG, StateCode } from './config/app-config';
import { PWAInstallPrompt } from './components/PWAInstallPrompt';
import { OfflineIndicator } from './components/OfflineIndicator';
// For debugging connection issues, uncomment and add <ConnectionDebug /> to the return:
// import { ConnectionDebug } from './components/ConnectionDebug';

// Status Bar Components
function WifiStrength4({ signalStrength }: { signalStrength: number }) {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="wifi-strength-4">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="wifi-strength-4">
          <path 
            d={svgPaths.p16e59a80} 
            fill={signalStrength > -60 ? "#545454" : signalStrength > -70 ? "#777777" : "#999999"} 
            id="Vector" 
          />
        </g>
      </svg>
    </div>
  );
}

function RefreshRate({ rate }: { rate: number }) {
  return (
    <div className="h-[20px] relative shrink-0 w-[34px]" data-name="Refresh rate">
      <p className="absolute bottom-0 font-['Noto_Sans'] leading-[20px] left-0 not-italic opacity-50 right-[2.94%] text-[#3d3c3c] text-nowrap top-0 whitespace-pre" style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-weight-normal)' }}>
        {rate}Hz
      </p>
    </div>
  );
}

// Component for disconnected state
function WifiStrengthOffOutline() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="wifi-strength-off-outline">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="wifi-strength-off-outline">
          <path d={svgPathsDisconnected.p20eb4900} fill="#C13211" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Rssi({ rssi, rate, isConnected }: { rssi: number; rate: number; isConnected: boolean }) {
  // If disconnected, show "No connection" message
  if (!isConnected) {
    return (
      <div className="box-border content-stretch flex gap-[4px] items-center px-[4px] py-0 relative rounded-[4px] shrink-0" data-name="RSSI">
        <WifiStrengthOffOutline />
        <p className="font-['Noto_Sans'] leading-[20px] not-italic relative shrink-0 text-[#c13211] text-nowrap whitespace-pre" style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-weight-medium)' }}>
          No connection
        </p>
      </div>
    );
  }

  // Convert RSSI to percentage (rough approximation)
  const signalPercent = Math.min(100, Math.max(0, (rssi + 100) * 2));
  
  return (
    <div className="box-border content-stretch flex gap-[4px] items-center px-[4px] py-0 relative rounded-[4px] shrink-0" data-name="RSSI">
      <WifiStrength4 signalStrength={rssi} />
      <p className="font-['Noto_Sans'] leading-[20px] not-italic relative shrink-0 text-[#545454] text-nowrap whitespace-pre" style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-weight-medium)' }}>
        {signalPercent.toFixed(0)}%
      </p>
      <RefreshRate rate={rate} />
    </div>
  );
}

function DateTime() {
  const [currentTime, setCurrentTime] = React.useState(new Date());

  React.useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const dateStr = currentTime.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  const timeStr = currentTime.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="box-border content-stretch flex gap-[4px] items-center leading-[20px] not-italic px-[4px] py-0 relative rounded-[4px] shrink-0 text-nowrap whitespace-pre" data-name="Date & Time" style={{ fontSize: 'var(--text-lg)' }}>
      <p className="font-['Noto_Sans'] opacity-50 relative shrink-0 text-[#3d3c3c]" style={{ fontWeight: 'var(--font-weight-normal)' }}>{dateStr}</p>
      <p className="font-['Noto_Sans'] relative shrink-0 text-[#545454]" style={{ fontWeight: 'var(--font-weight-medium)' }}>{timeStr}</p>
    </div>
  );
}

function StatusBar({ rssi, rate, isConnected }: { rssi: number; rate: number; isConnected: boolean }) {
  return (
    <div className="bg-white relative shrink-0 w-full" data-name="Status bar">
      <div aria-hidden="true" className="absolute border-[#efefef] border-[0px_0px_1px] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex items-center justify-between p-[8px] relative w-full">
          <Rssi rssi={rssi} rate={rate} isConnected={isConnected} />
          <DateTime />
        </div>
      </div>
    </div>
  );
}

// Data Section Components
function Status({ state }: { state: string }) {
  const stateKey = (state in STATE_CONFIG ? state : 'UNKNOWN') as StateCode;
  const config = STATE_CONFIG[stateKey];
  const label = config.label;
  const bgColor = config.color;

  return (
    <div className="relative shrink-0" data-name="Status" style={{ backgroundColor: bgColor }}>
      <div className="box-border content-stretch flex gap-[4px] items-center justify-center overflow-clip px-[8px] py-[4px] relative rounded-[inherit]">
        <div className="flex flex-col font-['Noto_Sans'] justify-center leading-[0] not-italic relative shrink-0 text-center text-nowrap text-white uppercase" style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)' }}>
          <p className="leading-[16px] whitespace-pre">{label}</p>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border-dashed bottom-[-2px] left-0 pointer-events-none right-0 top-0" style={{ borderColor: bgColor, borderWidth: '0px 0px 2px' }} />
    </div>
  );
}

function Thrust({ thrust }: { thrust: number }) {
  return (
    <div className="content-stretch flex gap-[4px] items-center not-italic relative shrink-0 text-nowrap text-right whitespace-pre" data-name="Thrust">
      <p className="font-['Noto_Sans'] leading-[24px] relative shrink-0 text-black" style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--font-weight-medium)' }}>
        {thrust.toFixed(2)}
      </p>
      <p className="font-['Noto_Sans'] leading-[20px] relative shrink-0 text-[#545454]" style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-weight-normal)' }}>
        kg
      </p>
    </div>
  );
}

function Title({ state, thrust }: { state: string; thrust: number }) {
  return (
    <div className="content-stretch flex items-start justify-between relative shrink-0 w-full" data-name="Title">
      <Status state={state} />
      <Thrust thrust={thrust} />
    </div>
  );
}

function Component3() {
  return (
    <div className="content-stretch flex gap-[8px] h-[20px] items-center relative shrink-0 w-full" data-name="3">
      <p className="font-['Noto_Sans'] leading-[16px] not-italic relative shrink-0 text-[#545454] text-nowrap text-right whitespace-pre" style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-normal)' }}>3</p>
      <div className="basis-0 grow h-0 min-h-px min-w-px relative shrink-0" data-name="Guide line">
        <div className="absolute bottom-0 left-0 right-0 top-[-1px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 313 1">
            <line id="Guide line" stroke="#EFEFEF" strokeLinecap="round" x1="0.5" x2="312.5" y1="0.5" y2="0.5" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Component2() {
  return (
    <div className="content-stretch flex gap-[8px] h-[20px] items-center relative shrink-0 w-full" data-name="2">
      <p className="font-['Noto_Sans'] leading-[16px] not-italic relative shrink-0 text-[#545454] text-nowrap text-right whitespace-pre" style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-normal)' }}>2</p>
      <div className="basis-0 grow h-0 min-h-px min-w-px relative shrink-0" data-name="Guide line">
        <div className="absolute bottom-0 left-0 right-0 top-[-1px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 313 1">
            <line id="Guide line" stroke="#EFEFEF" strokeLinecap="round" x1="0.5" x2="312.5" y1="0.5" y2="0.5" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Component1() {
  return (
    <div className="content-stretch flex gap-[8px] h-[20px] items-center relative shrink-0 w-full" data-name="1">
      <p className="font-['Noto_Sans'] leading-[16px] not-italic relative shrink-0 text-[#545454] text-nowrap text-right whitespace-pre" style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-normal)' }}>1</p>
      <div className="basis-0 grow h-0 min-h-px min-w-px relative shrink-0" data-name="Guide line">
        <div className="absolute bottom-0 left-0 right-0 top-[-1px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 313 1">
            <line id="Guide line" stroke="#EFEFEF" strokeLinecap="round" x1="0.5" x2="312.5" y1="0.5" y2="0.5" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Component0() {
  return (
    <div className="content-stretch flex gap-[8px] h-[20px] items-center relative shrink-0 w-full" data-name="0">
      <p className="font-['Noto_Sans'] leading-[16px] not-italic relative shrink-0 text-[#545454] text-nowrap text-right whitespace-pre" style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-normal)' }}>0</p>
      <div className="basis-0 grow h-0 min-h-px min-w-px relative shrink-0" data-name="Guide line">
        <div className="absolute bottom-0 left-0 right-0 top-[-1px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 313 1">
            <line id="Guide line" stroke="#EFEFEF" strokeLinecap="round" x1="0.5" x2="312.5" y1="0.5" y2="0.5" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Kilograms() {
  return (
    <div className="basis-0 content-stretch flex flex-col grow items-start justify-between min-h-px min-w-px overflow-clip relative shrink-0 w-full" data-name="Kilograms">
      <Component3 />
      <Component2 />
      <Component1 />
      <Component0 />
    </div>
  );
}

function Seconds() {
  return (
    <div className="relative shrink-0 w-full" data-name="Seconds">
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex font-['Noto_Sans'] items-center justify-between leading-[16px] not-italic pl-[12px] pr-0 py-0 relative text-[#545454] text-nowrap text-right w-full whitespace-pre" style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-normal)' }}>
          <p className="relative shrink-0">0</p>
          <p className="relative shrink-0">2</p>
          <p className="relative shrink-0">4</p>
          <p className="relative shrink-0">6</p>
          <p className="relative shrink-0">8</p>
          <p className="relative shrink-0">10</p>
          <p className="relative shrink-0">12</p>
          <p className="relative shrink-0">14</p>
        </div>
      </div>
    </div>
  );
}

function Graph({ thrustHistory }: { thrustHistory: any[] }) {
  return (
    <div className="content-stretch flex flex-col h-[116px] items-start justify-between overflow-clip relative rounded-[8px] shrink-0 w-full" data-name="Graph">
      <Kilograms />
      <Seconds />
      <ThrustGraph data={thrustHistory} maxThrust={3} />
    </div>
  );
}

function MeasureRate({ rate }: { rate: number }) {
  return (
    <div className="basis-0 bg-white grow min-h-px min-w-px relative rounded-[4px] shrink-0" data-name="Measure rate">
      <div aria-hidden="true" className="absolute border border-[#efefef] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <div className="size-full">
        <div className="box-border content-stretch flex flex-col gap-[4px] items-start p-[8px] relative w-full">
          <div className="flex flex-col font-['Noto_Sans'] justify-center leading-[0] min-w-full not-italic relative shrink-0 text-[#545454] uppercase w-[min-content]" style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)' }}>
            <p className="leading-[16px]">Measure Rate</p>
          </div>
          <div className="content-stretch flex gap-[4px] items-center justify-center leading-[20px] not-italic relative shrink-0 text-nowrap text-right whitespace-pre" style={{ fontSize: 'var(--text-lg)' }}>
            <p className="font-['Noto_Sans'] relative shrink-0 text-black" style={{ fontWeight: 'var(--font-weight-medium)' }}>{rate}</p>
            <p className="font-['Noto_Sans'] relative shrink-0 text-[#545454]" style={{ fontWeight: 'var(--font-weight-normal)' }}>Hz</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Parameters({ rate }: { rate: number }) {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full" data-name="Parameters">
      <div className="content-stretch flex gap-[8px] items-start relative shrink-0 w-full" data-name="Parameters blocks">
        {/* Total Impulse - disabled/grayed out */}
        <div className="basis-0 bg-[#f7f7f7] grow min-h-px min-w-px opacity-50 relative rounded-[4px] shrink-0">
          <div aria-hidden="true" className="absolute border border-[#efefef] border-solid inset-0 pointer-events-none rounded-[4px]" />
          <div className="size-full">
            <div className="box-border content-stretch flex flex-col gap-[4px] items-start p-[8px] relative w-full">
              <div className="flex flex-col font-['Noto_Sans'] justify-center leading-[0] min-w-full not-italic relative shrink-0 text-[#545454] uppercase w-[min-content]" style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)' }}>
                <p className="leading-[16px]">total impulse</p>
              </div>
              <div className="content-stretch flex gap-[4px] items-center justify-center leading-[20px] not-italic relative shrink-0 text-nowrap text-right whitespace-pre" style={{ fontSize: 'var(--text-lg)' }}>
                <p className="font-['Noto_Sans'] relative shrink-0 text-black" style={{ fontWeight: 'var(--font-weight-medium)' }}>-</p>
                <p className="font-['Noto_Sans'] relative shrink-0 text-[#545454]" style={{ fontWeight: 'var(--font-weight-normal)' }}>Ns</p>
              </div>
            </div>
          </div>
        </div>
        {/* Average Thrust - disabled/grayed out */}
        <div className="basis-0 bg-[#f7f7f7] grow min-h-px min-w-px opacity-50 relative rounded-[4px] shrink-0">
          <div aria-hidden="true" className="absolute border border-[#efefef] border-solid inset-0 pointer-events-none rounded-[4px]" />
          <div className="size-full">
            <div className="box-border content-stretch flex flex-col gap-[4px] items-start p-[8px] relative w-full">
              <div className="flex flex-col font-['Noto_Sans'] justify-center leading-[0] min-w-full not-italic relative shrink-0 text-[#545454] uppercase w-[min-content]" style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)' }}>
                <p className="leading-[16px]">Average thrust</p>
              </div>
              <div className="content-stretch flex gap-[4px] items-center justify-center leading-[20px] not-italic relative shrink-0 text-nowrap text-right whitespace-pre" style={{ fontSize: 'var(--text-lg)' }}>
                <p className="font-['Noto_Sans'] relative shrink-0 text-black" style={{ fontWeight: 'var(--font-weight-medium)' }}>-</p>
                <p className="font-['Noto_Sans'] relative shrink-0 text-[#545454]" style={{ fontWeight: 'var(--font-weight-normal)' }}>kg</p>
              </div>
            </div>
          </div>
        </div>
        {/* Peak Thrust - disabled/grayed out */}
        <div className="basis-0 bg-[#f7f7f7] grow min-h-px min-w-px opacity-50 relative rounded-[4px] shrink-0">
          <div aria-hidden="true" className="absolute border border-[#efefef] border-solid inset-0 pointer-events-none rounded-[4px]" />
          <div className="size-full">
            <div className="box-border content-stretch flex flex-col gap-[4px] items-start p-[8px] relative w-full">
              <div className="flex flex-col font-['Noto_Sans'] justify-center leading-[0] min-w-full not-italic relative shrink-0 text-[#545454] uppercase w-[min-content]" style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)' }}>
                <p className="leading-[16px]">Peak thrust</p>
              </div>
              <div className="content-stretch flex gap-[4px] items-center justify-center leading-[20px] not-italic relative shrink-0 text-nowrap text-right whitespace-pre" style={{ fontSize: 'var(--text-lg)' }}>
                <p className="font-['Noto_Sans'] relative shrink-0 text-black" style={{ fontWeight: 'var(--font-weight-medium)' }}>-</p>
                <p className="font-['Noto_Sans'] relative shrink-0 text-[#545454]" style={{ fontWeight: 'var(--font-weight-normal)' }}>kg</p>
              </div>
            </div>
          </div>
        </div>
        <MeasureRate rate={rate} />
      </div>
    </div>
  );
}

function DataSection({ state, thrust, rate, thrustHistory }: { state: string; thrust: number; rate: number; thrustHistory: any[] }) {
  return (
    <div className="bg-white relative shrink-0 w-full" data-name="Data section">
      <div className="size-full">
        <div className="box-border content-stretch flex flex-col gap-[16px] items-start p-[16px] relative w-full">
          <Title state={state} thrust={thrust} />
          <Graph thrustHistory={thrustHistory} />
          <Parameters rate={rate} />
        </div>
      </div>
    </div>
  );
}

// Main App Component
export default function App() {
  // Switch to useMockData() for testing without hardware
  const { data, thrustHistory, isConnected, error } = useMeasurementData();

  // Load offline debug utilities for console testing
  useEffect(() => {
    import('./utils/offlineDebug').catch(() => {
      // Debug utils failed to load - not critical
    });
  }, []);

  // Register service worker for PWA (enables offline functionality and app installation)
  useEffect(() => {
    if (APP_CONFIG.ui.enablePWA) {
      // Initialize PWA using traditional service worker (Figma Make supports /public files!)
      const initPWA = async () => {
        try {
          console.log('═══════════════════════════════════════');
          console.log('[PWA] 🚀 STARTING PWA INIT - SERVICE WORKER V11');
          console.log('═══════════════════════════════════════');
          
          // Step 1: Generate and register PWA icons
          const { initializePWAIcons, checkPWAInstallability } = await import('./utils/pwaIcons');
          console.log('[PWA] STEP 1/3: Generating PWA icons...');
          await initializePWAIcons();
          console.log('[PWA] ✅ STEP 1 COMPLETE: Icons ready');
          
          // Step 2: Register service worker
          console.log('[PWA] STEP 2/3: Registering service worker...');
          
          // Register service worker with detailed error handling
          if ('serviceWorker' in navigator) {
            let registration: ServiceWorkerRegistration | null = null;
            
            // Try method 1: Static file /sw.js
            try {
              console.log('[PWA] Method 1: Attempting to register /sw.js...');
              
              registration = await navigator.serviceWorker.register('/sw.js');
              
              console.log('[PWA] ✅ Registration successful with /sw.js!');
              console.log('[PWA] Scope:', registration.scope);
              
            } catch (staticFileError) {
              console.warn('[PWA] ⚠️ Static file /sw.js failed (expected on Figma Make)');
              console.warn('[PWA] Error:', staticFileError);
              
              // Try method 2: Inline service worker (for Figma Make)
              try {
                console.log('[PWA] Method 2: Trying inline service worker...');
                
                // Create service worker code as blob
                const swCode = `
const CACHE_NAME = 'thrust-monitor-v11-inline';
const urlsToCache = ['/', '/index.html'];

console.log('[ServiceWorker] Inline v11 loading...');

self.addEventListener('install', (event) => {
  console.log('[ServiceWorker] Installing inline v11...');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[ServiceWorker] Cache opened');
      return cache.addAll(urlsToCache).catch(e => console.log('[ServiceWorker] Cache preload failed:', e));
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('[ServiceWorker] Activating inline v11...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[ServiceWorker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Skip API requests
  if (event.request.url.includes('192.168.4.1')) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (response && response.status === 200) {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return response;
      })
      .catch(() => {
        console.log('[ServiceWorker] Using cache for:', event.request.url.split('/').pop());
        return caches.match(event.request);
      })
  );
});

console.log('[ServiceWorker] Inline v11 ready!');
`;

                const blob = new Blob([swCode], { type: 'application/javascript' });
                const blobURL = URL.createObjectURL(blob);
                
                console.log('[PWA] Created blob URL for service worker');
                
                registration = await navigator.serviceWorker.register(blobURL, {
                  scope: '/'
                });
                
                console.log('[PWA] ✅ Inline service worker registered!');
                
              } catch (inlineError) {
                console.error('[PWA] ❌ Inline service worker also failed');
                console.error('[PWA] Error:', inlineError);
                
                console.log('');
                console.log('═══════════════════════════════════════');
                console.log('❌ SERVICE WORKER REGISTRATION FAILED');
                console.log('═══════════════════════════════════════');
                console.log('');
                console.log('Both static file and inline methods failed.');
                console.log('This is a Figma Make platform limitation.');
                console.log('');
                console.log('🔍 NEXT STEPS:');
                console.log('');
                console.log('1. Check your working Figma Make project:');
                console.log('   Visit: https://your-working-project.figma.site/sw.js');
                console.log('   Does it show JavaScript or 404/UI?');
                console.log('');
                console.log('2. Share the registration code from working project');
                console.log('');
                console.log('3. Or deploy to Netlify/Vercel for full PWA support');
                console.log('   See: /DEPLOY_INSTRUCTIONS.md');
                console.log('');
                console.log('App works fine without service worker!');
                console.log('Only offline mode is unavailable.');
                console.log('═══════════════════════════════════════');
                console.log('');
                
                return; // Exit - no registration
              }
            }
            
            // If we got here, registration succeeded (one way or another)
            if (registration) {
              console.log('[PWA] Scope:', registration.scope);
              console.log('[PWA] Active:', registration.active?.state || 'none');
              console.log('[PWA] Installing:', registration.installing?.state || 'none');
              console.log('[PWA] Waiting:', registration.waiting?.state || 'none');
              
              // Wait for service worker to be ready
              await navigator.serviceWorker.ready;
              console.log('[PWA] ✅ Service worker is ready!');
              
              // Check if controlling page
              if (navigator.serviceWorker.controller) {
                console.log('[PWA] ✅ STEP 2 COMPLETE: Service worker is controlling the page!');
                console.log('[PWA] ✅ App is now available OFFLINE!');
                console.log('[PWA] 💡 Test offline: F12 → Network → Offline → Reload');
              } else {
                console.warn('[PWA] ⚠️ Service worker registered but not controlling page yet');
                console.log('[PWA] 💡 Reload the page to activate offline mode');
              }
            }
          } else {
            console.error('[PWA] ❌ Service workers not supported in this browser');
          }
          
          // Step 3: Check if app is installable
          console.log('[PWA] STEP 3/3: Checking installability...');
          checkPWAInstallability();
          
          console.log('═══════════════════════════════════════');
          console.log('[PWA] ✅ PWA INITIALIZATION COMPLETE!');
          console.log('[PWA] 💡 Check console for caching messages');
          console.log('═══════════════════════════════════════');
          
        } catch (error) {
          console.error('[PWA] ❌ Initialization failed:', error);
          if (error instanceof Error) {
            console.error('[PWA] Error details:', error.message);
          }
        }
      };

      // Start PWA initialization immediately (don't wait for load event)
      initPWA();
    }

    // Request fullscreen on mobile devices if enabled in config
    if (APP_CONFIG.ui.enableFullscreen) {
      const requestFullscreen = () => {
        const elem = document.documentElement;
        if (elem.requestFullscreen) {
          elem.requestFullscreen().catch(err => console.log('Fullscreen request failed:', err));
        }
      };

      // Try to go fullscreen on user interaction
      document.addEventListener('click', requestFullscreen, { once: true });
      document.addEventListener('touchstart', requestFullscreen, { once: true });

      return () => {
        document.removeEventListener('click', requestFullscreen);
        document.removeEventListener('touchstart', requestFullscreen);
      };
    }
  }, []);

  // Default values when no data
  const state = data?.state || 'S';
  const thrust = data?.thrust || 0;
  const rate = data?.rate || 0;
  const rssi = data?.rssi || -100;

  return (
    <div className="bg-white content-stretch flex flex-col items-center relative size-full min-h-screen" data-name="Main - Standby - Default">
      <OfflineIndicator />
      <StatusBar rssi={rssi} rate={rate} isConnected={isConnected} />
      <DataSection state={state} thrust={thrust} rate={rate} thrustHistory={thrustHistory} />
      <CameraFeed className="basis-0 box-border content-stretch flex grow items-center justify-center min-h-px min-w-px pl-0 pr-px py-0 relative shrink-0 w-full" />
      <PWAInstallPrompt />
    </div>
  );
}

// Import React for useState
import * as React from 'react';
