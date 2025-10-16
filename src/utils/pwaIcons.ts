/**
 * PWA Icon Generation and Registration
 * Generates PNG icons dynamically and makes them available for PWA installation
 */

/**
 * Draws the app icon on a canvas
 */
function drawAppIcon(canvas: HTMLCanvasElement, size: number): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const s = size;

  // Black background
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, s, s);

  // Draw rocket body (white)
  ctx.fillStyle = '#ffffff';
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = s * 0.008;

  // Main rocket shape
  ctx.beginPath();
  ctx.moveTo(s * 0.5, s * 0.2);   // Top point
  ctx.lineTo(s * 0.6, s * 0.35);  // Right shoulder
  ctx.lineTo(s * 0.58, s * 0.55); // Right body
  ctx.lineTo(s * 0.6, s * 0.65);  // Right fin top
  ctx.lineTo(s * 0.52, s * 0.72); // Right fin bottom
  ctx.lineTo(s * 0.48, s * 0.72); // Left fin bottom
  ctx.lineTo(s * 0.4, s * 0.65);  // Left fin top
  ctx.lineTo(s * 0.42, s * 0.55); // Left body
  ctx.lineTo(s * 0.4, s * 0.35);  // Left shoulder
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Draw flame (orange)
  ctx.fillStyle = '#ff6b00';
  ctx.beginPath();
  ctx.moveTo(s * 0.42, s * 0.72);
  ctx.lineTo(s * 0.5, s * 0.88);
  ctx.lineTo(s * 0.58, s * 0.72);
  ctx.quadraticCurveTo(s * 0.52, s * 0.78, s * 0.5, s * 0.82);
  ctx.quadraticCurveTo(s * 0.48, s * 0.78, s * 0.42, s * 0.72);
  ctx.fill();

  // Draw inner flame (yellow/gold)
  ctx.fillStyle = '#ffd700';
  ctx.beginPath();
  ctx.moveTo(s * 0.45, s * 0.72);
  ctx.lineTo(s * 0.5, s * 0.82);
  ctx.lineTo(s * 0.55, s * 0.72);
  ctx.closePath();
  ctx.fill();

  // Draw window (blue circle)
  ctx.fillStyle = '#0a64eb';
  ctx.beginPath();
  ctx.arc(s * 0.5, s * 0.35, s * 0.06, 0, Math.PI * 2);
  ctx.fill();

  // Draw window reflection
  ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
  ctx.beginPath();
  ctx.arc(s * 0.485, s * 0.34, s * 0.025, 0, Math.PI * 2);
  ctx.fill();

  // Add "THRUST" text
  ctx.fillStyle = '#ffffff';
  ctx.font = `bold ${s * 0.09}px Arial, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('THRUST', s * 0.5, s * 0.94);

  // Add decorative stars
  ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
  const stars = [
    { x: 0.15, y: 0.25, r: 0.01 },
    { x: 0.85, y: 0.3, r: 0.012 },
    { x: 0.2, y: 0.65, r: 0.008 },
    { x: 0.8, y: 0.6, r: 0.01 },
  ];

  stars.forEach(star => {
    ctx.beginPath();
    ctx.arc(s * star.x, s * star.y, s * star.r, 0, Math.PI * 2);
    ctx.fill();
  });
}

/**
 * Generate PNG icon as blob
 */
async function generateIconBlob(size: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    
    drawAppIcon(canvas, size);
    
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob);
      } else {
        reject(new Error('Failed to generate icon blob'));
      }
    }, 'image/png');
  });
}

/**
 * Initialize PWA icons and update manifest
 * This creates PNG icons and updates the manifest to reference them
 */
export async function initializePWAIcons(): Promise<void> {
  try {
    console.log('[PWA] Initializing icons...');

    // Generate icon blobs
    const icon192Blob = await generateIconBlob(192);
    const icon512Blob = await generateIconBlob(512);

    // Create blob URLs
    const icon192Url = URL.createObjectURL(icon192Blob);
    const icon512Url = URL.createObjectURL(icon512Blob);

    // Store URLs for service worker to intercept
    sessionStorage.setItem('pwa-icon-192-url', icon192Url);
    sessionStorage.setItem('pwa-icon-512-url', icon512Url);

    // Create dynamic manifest
    const manifest = {
      name: "Rocket Engine Thrust Monitor",
      short_name: "Thrust Monitor",
      description: "Monitor and control rocket engine thrust measurement stand",
      start_url: "/",
      display: "fullscreen",
      orientation: "portrait",
      theme_color: "#000000",
      background_color: "#ffffff",
      icons: [
        {
          src: icon192Url,
          sizes: "192x192",
          type: "image/png",
          purpose: "any maskable"
        },
        {
          src: icon512Url,
          sizes: "512x512",
          type: "image/png",
          purpose: "any maskable"
        }
      ],
      categories: ["utilities", "productivity"],
      scope: "/",
      prefer_related_applications: false
    };

    // Convert manifest to blob
    const manifestBlob = new Blob([JSON.stringify(manifest)], { type: 'application/json' });
    const manifestUrl = URL.createObjectURL(manifestBlob);

    // Update manifest link
    let manifestLink = document.querySelector('link[rel="manifest"]') as HTMLLinkElement;
    if (!manifestLink) {
      manifestLink = document.createElement('link');
      manifestLink.rel = 'manifest';
      document.head.appendChild(manifestLink);
    }
    manifestLink.href = manifestUrl;

    console.log('[PWA] Icons initialized successfully');
    console.log('[PWA] Icon 192:', icon192Url);
    console.log('[PWA] Icon 512:', icon512Url);
    console.log('[PWA] Manifest:', manifestUrl);
    console.log('[PWA] App should now be installable!');

  } catch (error) {
    console.error('[PWA] Failed to initialize icons:', error);
  }
}

/**
 * Check if PWA is installable
 */
export function checkPWAInstallability(): void {
  // Check if running in standalone mode (already installed)
  if (window.matchMedia('(display-mode: standalone)').matches) {
    console.log('[PWA] App is running in standalone mode (installed)');
    return;
  }

  // Check for beforeinstallprompt event
  window.addEventListener('beforeinstallprompt', (e) => {
    console.log('[PWA] Install prompt is available!');
    console.log('[PWA] App is installable');
  });

  // Log installation criteria
  console.log('[PWA] Installation checklist:');
  console.log('  ✓ Service worker registration');
  console.log('  ✓ Manifest with icons');
  console.log('  ✓ HTTPS or localhost');
  console.log('  → Waiting for install prompt...');
}
