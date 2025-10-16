/**
 * Generates PWA icon as a data URL
 * This allows the PWA to work without needing separate PNG files
 */

export function generateIconDataUrl(size: 192 | 512): string {
  // Create a canvas element
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  
  if (!ctx) {
    console.error('Failed to get canvas context');
    return '';
  }

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

  // Convert to data URL
  return canvas.toDataURL('image/png');
}

/**
 * Generates icons and registers them with the manifest
 * Call this on app initialization to make the PWA installable
 */
export function initializePWAIcons() {
  if (typeof window === 'undefined') return;

  try {
    // Generate icons
    const icon192 = generateIconDataUrl(192);
    const icon512 = generateIconDataUrl(512);

    // Store in session storage so they persist during the session
    sessionStorage.setItem('pwa-icon-192', icon192);
    sessionStorage.setItem('pwa-icon-512', icon512);

    console.log('[PWA] Icons generated and cached');
  } catch (error) {
    console.error('[PWA] Failed to generate icons:', error);
  }
}

/**
 * Get cached icon data URL
 */
export function getCachedIconDataUrl(size: 192 | 512): string | null {
  if (typeof window === 'undefined') return null;
  return sessionStorage.getItem(`pwa-icon-${size}`);
}
