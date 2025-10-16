# PWA Setup Guide - Rocket Engine Thrust Monitor

## ✅ What's Already Done

Your app is configured as a Progressive Web App with:

- ✅ Service Worker for offline functionality (`/public/service-worker.js`)
- ✅ App Manifest with metadata (`/public/manifest.json`)
- ✅ PWA meta tags in HTML (`/public/index.html`)
- ✅ Service worker registration in App.tsx
- ✅ Fullscreen mode support
- ✅ Design system integration (Noto Sans, CSS variables)

## 🎯 What You Need to Do (5 minutes)

### Step 1: Generate App Icons

The app needs two icon files to be installable:

**Easy Method (Recommended):**

1. Open this file in your browser:
   ```
   http://localhost:5173/generate-icons.html
   ```
   (Replace port 5173 with your dev server port)

2. Click **"Download Both"**

3. You'll get two files:
   - `icon-192.png`
   - `icon-512.png`

4. **Important:** Save both files to the `/public/` folder in your project

**Alternative Method - Browser Console:**

1. Open your app
2. Press F12 → Console tab
3. Paste this code:

```javascript
['192', '512'].forEach(size => {
  const s = parseInt(size);
  const canvas = document.createElement('canvas');
  canvas.width = s;
  canvas.height = s;
  const ctx = canvas.getContext('2d');
  
  // Black background
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, s, s);
  
  // White rocket
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.moveTo(s*0.5, s*0.2);
  ctx.lineTo(s*0.6, s*0.35);
  ctx.lineTo(s*0.58, s*0.55);
  ctx.lineTo(s*0.6, s*0.65);
  ctx.lineTo(s*0.52, s*0.72);
  ctx.lineTo(s*0.48, s*0.72);
  ctx.lineTo(s*0.4, s*0.65);
  ctx.lineTo(s*0.42, s*0.55);
  ctx.lineTo(s*0.4, s*0.35);
  ctx.closePath();
  ctx.fill();
  
  // Orange flame
  ctx.fillStyle = '#ff6b00';
  ctx.beginPath();
  ctx.moveTo(s*0.42, s*0.72);
  ctx.lineTo(s*0.5, s*0.88);
  ctx.lineTo(s*0.58, s*0.72);
  ctx.closePath();
  ctx.fill();
  
  // Text
  ctx.fillStyle = '#ffffff';
  ctx.font = `bold ${s*0.09}px Arial`;
  ctx.textAlign = 'center';
  ctx.fillText('THRUST', s*0.5, s*0.94);
  
  // Download
  canvas.toBlob(blob => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `icon-${size}.png`;
    a.click();
    URL.revokeObjectURL(url);
  });
});
```

### Step 2: Verify Icons

After placing the icons in `/public/`, verify they're accessible:

Open your browser console and run:
```javascript
fetch('/icon-192.png').then(r => console.log('192x192:', r.ok));
fetch('/icon-512.png').then(r => console.log('512x512:', r.ok));
```

Both should return `true`.

### Step 3: Test Installation

#### On Android (Chrome/Edge):
1. Open the app
2. You should see an "Install" or "Add to Home Screen" prompt
3. Tap **Install**
4. App appears on home screen ✅

#### On iOS (Safari):
1. Open the app in Safari (must be Safari, not Chrome)
2. Tap the **Share** button (⬆️)
3. Scroll down and tap **"Add to Home Screen"**
4. Tap **Add**
5. App appears on home screen ✅

#### On Desktop (Chrome/Edge):
1. Open the app
2. Look for install icon in address bar
3. Click **Install**
4. App opens in its own window ✅

## 🔧 How It Works

### When Online (Connected to 192.168.4.1)
- ✅ Fetches data every 500ms from server
- ✅ Updates thrust values, graphs, status in real-time
- ✅ Caches all static assets (JS, CSS, images) for offline use

### When Offline (No Internet)
- ✅ App loads from cache
- ✅ UI remains fully functional
- ✅ Shows last known data
- ✅ Camera continues to work
- ✅ Status bar shows "No connection"

### Auto-Reconnection
- ✅ Automatically retries connection to 192.168.4.1
- ✅ Seamless transition when connection is restored
- ✅ No manual refresh needed

## 📁 File Structure

```
/public/
├── index.html              ✅ PWA meta tags configured
├── manifest.json           ✅ App manifest ready
├── service-worker.js       ✅ Offline caching configured
├── generate-icons.html     ✅ Icon generator tool
├── icon-192.png           ⚠️  YOU NEED TO CREATE THIS
└── icon-512.png           ⚠️  YOU NEED TO CREATE THIS
```

## 🧪 Testing

### Test Service Worker

```javascript
// Check if service worker is registered
navigator.serviceWorker.getRegistrations()
  .then(r => console.log('Service Workers:', r));

// Check cache
caches.keys().then(keys => console.log('Caches:', keys));
```

### Test Offline Mode

**Method 1: DevTools**
1. Open DevTools (F12)
2. Go to Network tab
3. Select "Offline" from throttling dropdown
4. Reload page
5. App should still load ✅

**Method 2: Real Offline**
1. Install the app
2. Turn off WiFi
3. Open installed app
4. Should work with cached content ✅

### Test with Mock Data (No Hardware Needed)

Edit `/App.tsx`:
```typescript
// Uncomment this line:
import { useMockData } from './hooks/useMockData';

// And change this line:
const { data, thrustHistory, isConnected } = useMockData();
```

## ⚙️ Configuration

### Server Settings

Edit `/config/app-config.ts`:

```typescript
server: {
  url: 'http://192.168.4.1/mesData',
  fetchInterval: 500,  // Polling rate (ms)
  timeout: 15000,      // Request timeout (ms)
  useCors: true,       // CORS enabled
}
```

### PWA Settings

```typescript
ui: {
  enableFullscreen: true,  // Auto-fullscreen on mobile
  enablePWA: true,        // Service worker enabled
}
```

### Manifest Customization

Edit `/public/manifest.json`:

```json
{
  "name": "Your App Name",
  "short_name": "Short Name",
  "theme_color": "#000000",      // Status bar color
  "background_color": "#ffffff"  // Splash screen
}
```

## 🐛 Troubleshooting

### "Install" button doesn't appear

**Cause:** Icons are missing

**Fix:** Generate and place `icon-192.png` and `icon-512.png` in `/public/`

### App doesn't work offline

**Check:**
1. Service worker registered? (see Testing section above)
2. PWA enabled in config? (`enablePWA: true`)
3. Try hard refresh: Ctrl+Shift+R

**Clear cache and retry:**
```javascript
caches.keys().then(keys => {
  keys.forEach(key => caches.delete(key));
  location.reload();
});
```

### CORS errors from server

**Fix:** Configure your server at 192.168.4.1

See `/server-example/SERVER_FIX.md` for details.

Server must send these headers:
```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, OPTIONS
Access-Control-Allow-Headers: Content-Type
```

**Important:** Do NOT send `Access-Control-Allow-Credentials: true` with wildcard origin.

### App shows old version after update

**Fix 1: Update cache version**

Edit `/public/service-worker.js`:
```javascript
const CACHE_NAME = 'thrust-monitor-v4'; // Increment version
```

**Fix 2: Force update**

In browser DevTools:
1. Application tab → Service Workers
2. Click "Unregister"
3. Click "Clear storage" → "Clear site data"
4. Reload page

## 📱 Browser Support

| Feature | Chrome | Safari | Firefox | Edge |
|---------|--------|--------|---------|------|
| Install | ✅ | ✅ | ⚠️ | ✅ |
| Offline | ✅ | ⚠️ | ✅ | ✅ |
| Fullscreen | ✅ | ⚠️ | ✅ | ✅ |
| Service Worker | ✅ | ✅ | ✅ | ✅ |

**Legend:**
- ✅ Full support
- ⚠️ Partial/limited support

## 🎨 Design System

All components use CSS variables from `/styles/globals.css`:

**Typography:**
- Font: `'Noto Sans'` (loaded from Google Fonts)
- Sizes: `var(--text-2xl)` → `var(--text-sm)`
- Weights: `var(--font-weight-medium)`, `var(--font-weight-normal)`, `var(--font-weight-light)`

**Colors:**
- Background: `var(--background)`
- Foreground: `var(--foreground)`
- Accent: `var(--accent)`
- Destructive: `var(--destructive)`

To customize, edit CSS variables in `/styles/globals.css`.

## 📚 Additional Resources

- [MDN: Progressive Web Apps](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)
- [web.dev: PWA Checklist](https://web.dev/pwa-checklist/)
- [Server Setup Guide](./server-example/README.md)
- [CORS Fixes](./server-example/SERVER_FIX.md)

## ✅ Checklist

- [ ] Generated `icon-192.png`
- [ ] Generated `icon-512.png`
- [ ] Placed both icons in `/public/` folder
- [ ] Verified icons are accessible (see Step 2)
- [ ] Tested installation on device
- [ ] Tested offline functionality
- [ ] Configured server CORS (if needed)
- [ ] Tested with real hardware

## 🚀 You're Done!

Once you generate and place the two icon files:

1. **App works offline** ✅
2. **Installable on all devices** ✅
3. **Fullscreen mode** ✅
4. **Production ready** ✅

**Total setup time:** ~5 minutes

---

**Next step:** Open `/public/generate-icons.html` and download the icons!
