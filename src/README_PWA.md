# Rocket Engine Thrust Monitor - PWA Edition

## 🚀 What's a PWA?

A **Progressive Web App** combines the best of web and mobile apps:

- ✅ **Install like a native app** on any device (Android, iOS, Desktop)
- ✅ **Works offline** without internet connection
- ✅ **Fullscreen mode** for immersive experience
- ✅ **Auto-updates** when you publish new versions
- ✅ **Fast and reliable** with smart caching

## ✅ PWA Features Implemented

Your Rocket Engine Thrust Monitor now has:

### Core Features
- ✅ Service Worker for offline functionality
- ✅ App Manifest for installability
- ✅ Fullscreen mode on mobile devices
- ✅ Smart caching strategy (network-first)
- ✅ Auto-reconnection to 192.168.4.1
- ✅ Design system integration (Noto Sans font, CSS variables)

### What Works Offline
- ✅ Complete UI loads from cache
- ✅ Last known data displayed
- ✅ Camera feed continues to function
- ✅ Status indicators work
- ✅ Graph shows historical data

### What Requires Connection
- ⚠️ Live data from 192.168.4.1 server
- ⚠️ Real-time thrust measurements
- ⚠️ RSSI/signal strength updates

## 🎯 Quick Setup (5 minutes)

### You Only Need to Do One Thing:

**Generate 2 Icon Files**

1. Open in your browser:
   ```
   http://localhost:5173/generate-icons.html
   ```

2. Click **"Download Both"**

3. Save to `/public/` folder:
   - `icon-192.png`
   - `icon-512.png`

4. Done! Your app is now installable! 🎉

**That's it!** Everything else is already configured.

## 📱 How to Install

### On Android

1. Open the app in Chrome or Edge
2. Tap the "Install" or "Add to Home Screen" prompt
3. App appears on your home screen
4. Launch it like any native app

### On iOS

1. Open the app in Safari (must be Safari)
2. Tap the Share button (⬆️)
3. Select "Add to Home Screen"
4. Tap "Add"
5. App appears on your home screen

### On Desktop

1. Open the app in Chrome or Edge
2. Click the install icon in the address bar
3. Click "Install"
4. App opens in its own window

## 🔧 How It Works

### Connection States

**Connected to 192.168.4.1:**
```
┌─────────────────────────────────────────┐
│  ✅ Live data every 500ms               │
│  ✅ Real-time graphs                     │
│  ✅ WiFi signal shown                    │
│  ✅ Auto-caching static assets           │
└─────────────────────────────────────────┘
```

**Offline / No Connection:**
```
┌─────────────────────────────────────────┐
│  ✅ App loads from cache                 │
│  ✅ UI fully functional                  │
│  ✅ Shows "No connection" status         │
│  ✅ Camera still works                   │
│  ⚠️  Last known data displayed           │
└─────────────────────────────────────────┘
```

**Reconnecting:**
```
┌─────────────────────────────────────────┐
│  🔄 Auto-retries connection             │
│  🔄 Exponential backoff                 │
│  ✅ Seamless transition when restored   │
└─────────────────────────────────────────┘
```

## 📁 Project Structure

```
/
├── /public/
│   ├── index.html              ✅ PWA meta tags
│   ├── manifest.json           ✅ App manifest
│   ├── service-worker.js       ✅ Offline caching
│   ├── generate-icons.html     ✅ Icon generator
│   ├── icon-192.png           ⚠️  GENERATE THIS
│   └── icon-512.png           ⚠️  GENERATE THIS
│
├── /components/               ✅ React components
├── /hooks/                    ✅ Data fetching hooks
├── /config/                   ✅ App configuration
├── /styles/                   ✅ Design system (CSS variables)
│
├── App.tsx                    ✅ Main app component
├── PWA_SETUP_GUIDE.md        📚 Complete setup guide
└── README_PWA.md             📚 This file
```

## ⚙️ Configuration

All settings in `/config/app-config.ts`:

```typescript
// Server connection
server: {
  url: 'http://192.168.4.1/mesData',
  fetchInterval: 500,   // Poll every 500ms
  timeout: 15000,       // 15 second timeout
  useCors: true,
}

// PWA features
ui: {
  enableFullscreen: true,  // Auto-fullscreen on mobile
  enablePWA: true,        // Service worker enabled
}
```

## 🧪 Testing

### Test Offline Mode

**DevTools Method:**
1. F12 → Network tab
2. Select "Offline"
3. Reload page
4. App should load ✅

**Real World Method:**
1. Install the app
2. Turn off WiFi
3. Open installed app
4. Should work with cached UI ✅

### Test Service Worker

```javascript
// In browser console
navigator.serviceWorker.getRegistrations()
  .then(r => console.log('Registered:', r.length > 0));

caches.keys()
  .then(k => console.log('Caches:', k));
```

### Test with Mock Data

No hardware needed! Edit `/App.tsx`:

```typescript
// Uncomment:
import { useMockData } from './hooks/useMockData';

// Change to:
const { data, thrustHistory, isConnected } = useMockData();
```

## 🎨 Design System

All UI uses CSS variables from `/styles/globals.css`:

**Typography:**
```css
font-family: 'Noto Sans', sans-serif;
font-size: var(--text-lg);        /* Dynamic sizing */
font-weight: var(--font-weight-medium);
```

**Colors:**
```css
background: var(--background);
color: var(--foreground);
accent: var(--accent);
destructive: var(--destructive);
```

**Spacing:**
```css
border-radius: var(--radius);
box-shadow: var(--elevation-sm);
```

To customize the design system, edit the CSS variables in `/styles/globals.css`.

## 📊 Browser Support

| Feature | Chrome | Safari | Firefox | Edge |
|---------|--------|--------|---------|------|
| Install | ✅ | ✅ | ⚠️ | ✅ |
| Offline | ✅ | ⚠️ | ✅ | ✅ |
| Fullscreen | ✅ | ⚠️ | ✅ | ✅ |
| Service Worker | ✅ | ✅ | ✅ | ✅ |

## 🐛 Troubleshooting

### "Install" button doesn't appear

**Cause:** Icons are missing

**Fix:** 
1. Generate icons (see Quick Setup above)
2. Place them in `/public/` folder
3. Reload app

### App doesn't work offline

**Check:**
1. Service worker registered?
   ```javascript
   navigator.serviceWorker.getRegistrations()
   ```
2. Icons present in `/public/`?
3. PWA enabled in config?

**Fix:**
- Hard refresh (Ctrl+Shift+R)
- Clear cache and retry

### CORS errors from 192.168.4.1

**Fix:** Configure server to send CORS headers

See `/server-example/SERVER_FIX.md` for details.

Required headers:
```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, OPTIONS
Access-Control-Allow-Headers: Content-Type
```

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| `README_PWA.md` | This file - Quick overview |
| `PWA_SETUP_GUIDE.md` | Complete setup instructions |
| `/public/README.md` | Icon generation guide |
| `/server-example/README.md` | Server implementation |
| `/server-example/SERVER_FIX.md` | CORS troubleshooting |

## ✅ Checklist

- [ ] Generated `icon-192.png`
- [ ] Generated `icon-512.png`
- [ ] Placed both in `/public/` folder
- [ ] Verified icons load (check console)
- [ ] Tested installation on device
- [ ] Tested offline functionality
- [ ] Configured server CORS (if needed)

## 🎯 Next Steps

1. **Generate icons** (5 minutes)
   - Open `/public/generate-icons.html`
   - Download both icons
   - Place in `/public/` folder

2. **Test installation**
   - Open on mobile device
   - Install to home screen
   - Test offline mode

3. **Deploy** (when ready)
   - Build production version
   - Test with real server at 192.168.4.1
   - Train users on installation

## 🚀 Summary

Your Rocket Engine Thrust Monitor is now a **production-ready PWA** that:

- ✅ Works offline without internet
- ✅ Installable on any device
- ✅ Runs in fullscreen mode
- ✅ Auto-reconnects to 192.168.4.1
- ✅ Uses your design system
- ✅ Updates automatically

**Total setup time:** ~5 minutes (just generate the icons)

**You're ready to launch!** 🚀

---

**Need help?** See `/PWA_SETUP_GUIDE.md` for detailed instructions.
