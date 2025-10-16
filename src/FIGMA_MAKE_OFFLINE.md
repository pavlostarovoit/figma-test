# 🎯 Offline Mode for Figma Make - Complete Guide

## ⚠️ The Figma Make Challenge

**Problem:** Figma Make's preview environment **doesn't serve static files** from `/public` correctly.

**Traditional PWA approach:**
```
📁 /public/service-worker.js  →  ❌ 404 Not Found
```

**Our solution:**
```
💻 Inline Service Worker (blob URL)  →  ✅ Works!
```

---

## ✅ How It Works

### Inline Service Worker

Instead of loading a static file, we:

1. **Define service worker code as a JavaScript string**
2. **Create a Blob from the string**
3. **Generate a blob:// URL**
4. **Register the blob URL** as the service worker

**Result:** Service worker works in Figma Make! ✅

### Cache-First Strategy

Once registered, the service worker:

1. **Intercepts all network requests**
2. **Checks cache first** (instant if found)
3. **Falls back to network** if not cached
4. **Caches the response** for next time
5. **Updates cache in background** (stale-while-revalidate)

---

## 🚀 Testing Steps

### Step 1: Clear Everything (CRITICAL!)

Old service workers **will interfere**. Always clear first!

**Console:**
```javascript
offline.clearAll()
```

**Wait for automatic reload.**

---

### Step 2: Watch for Registration

After reload, **check console messages:**

**Good signs ✅:**
```
[PWA] 🚀 Initializing PWA (Figma Make compatible)...
[PWA] Step 1: Generating icons...
[PWA] ✅ Icons initialized successfully
[PWA] Step 2: Registering inline service worker...
[PWA] ℹ️ Using blob URL (static files not supported in preview)
[ServiceWorker] Inline worker starting (v7)...
[ServiceWorker] Installing v7 (inline)...
[ServiceWorker] Activating v7 (inline)...
[ServiceWorker] Activated and taking control
[PWA] ✅ Service worker registered successfully
[PWA] ✅ Service worker is controlling the page
[PWA] ✅ App is now available offline!
```

**Key messages:**
- ✅ "Inline worker starting (v7)" - Service worker created
- ✅ "Service worker is controlling the page" - Ready to cache

**Bad signs ❌:**
```
[PWA] ❌ Initialization failed: ...
```
**Fix:** Check error message, might need to reload

---

### Step 3: Let It Cache (10 seconds)

**Service worker caches assets as you browse.**

1. **Wait 10 seconds** after page loads
2. **Scroll the page** (triggers image loading)
3. **Watch console** for caching:

```
[ServiceWorker] ⬇️ Fetching and caching: index
[ServiceWorker] ✅ Cached: index
[ServiceWorker] ⬇️ Fetching and caching: main.js
[ServiceWorker] ✅ Cached: main.js
[ServiceWorker] ⬇️ Fetching and caching: styles.css
[ServiceWorker] ✅ Cached: styles.css
```

**If you don't see "✅ Cached" messages:**
- Caching is happening in background
- Wait 10 more seconds
- Continue to next step anyway

---

### Step 4: Verify Cache

**Console:**
```javascript
offline.diagnostic()
```

**Should show:**
```
═══════════════════════════════════════
🔍 PWA OFFLINE DIAGNOSTIC
═══════════════════════════════════════

1️⃣ NETWORK STATUS
   Online: ✅ Yes

2️⃣ SERVICE WORKER
📋 Registration 1:
   Scope: https://...
   Active: activated
   Script: blob:https://...

✅ Service worker is controlling this page

3️⃣ CACHE
📂 thrust-monitor-v7:
   Files: 12
   Contents:
   1. /
   2. /assets/index-abc123.js
   3. /assets/index-def456.css
   ...

═══════════════════════════════════════
📊 SUMMARY
═══════════════════════════════════════
✅ PWA is ready for offline mode!

🧪 To test:
   1. F12 → Network → Offline
   2. Reload page (Ctrl+R)
   3. Should work! ✅
═══════════════════════════════════════
```

**If NOT ready:**
- Check if service worker is registered
- Check if cache has files (need 5+ files)
- Wait 10 seconds and try again
- If still not working, go back to Step 1

---

### Step 5: Test Offline

**Easy way (DevTools):**

1. **Keep page open**
2. **Press F12** (open DevTools)
3. **Network tab**
4. **Dropdown → "Offline"**
5. **Reload (Ctrl+R)**

**Expected results:**

✅ **Page loads successfully**
✅ **Orange banner:** "📱 Running offline from cache"
✅ **Console shows:**
```
[ServiceWorker] ✅ Cache hit: index
[ServiceWorker] ✅ Cache hit: main.js
[ServiceWorker] ✅ Cache hit: styles.css
[PWA] Network connection lost - running from cache
```

**If page doesn't load:**
- Check Step 4 - make sure cache has files
- Look for errors in console
- Service worker might not be active - reload page
- Go back to Step 1 and start over

---

### Step 6: Test Real Offline (Optional)

**Only after Step 5 works!**

1. **Set DevTools back to "Online"**
2. **Reload page**
3. **Close browser completely**
4. **Turn off WiFi**
5. **Reopen browser**
6. **Navigate to app URL**

**Should load just like DevTools test!** ✅

---

## 🔍 Console Commands

### Available Commands

```javascript
// Quick start
offline.clearAll()          // Clear everything, reload
offline.diagnostic()        // Full status check
offline.help()              // Show all commands

// Detailed checks
offline.checkCache()        // View cached files
offline.checkServiceWorker()// Check SW registration
offline.forceUpdate()       // Force SW update
```

### Command Examples

**Clear and start fresh:**
```javascript
offline.clearAll()
// Automatically reloads after 2 seconds
```

**Full diagnostic:**
```javascript
offline.diagnostic()
// Shows network, service worker, cache status
// Tells you if ready for offline
```

**Check what's cached:**
```javascript
offline.checkCache()
// Lists all cached files
// Shows cache names and file counts
```

**Check service worker:**
```javascript
offline.checkServiceWorker()
// Shows registration status
// Shows if controlling page
```

---

## 🐛 Troubleshooting

### Issue: "No service worker registered"

**Symptoms:**
```
❌ No service worker registered
💡 Reload the page to register
```

**Causes:**
1. Service worker didn't register
2. JavaScript error prevented registration
3. PWA config is disabled

**Fixes:**

**Check console for errors:**
- Look for red error messages
- Service worker might have failed to create

**Reload page:**
```javascript
location.reload()
```

**Check PWA is enabled:**
```javascript
// In browser console
console.log('PWA enabled?', APP_CONFIG?.ui?.enablePWA)
```

**Clear and try again:**
```javascript
offline.clearAll()
```

---

### Issue: "No caches found"

**Symptoms:**
```
❌ No caches found
💡 Visit the app online first to build cache
```

**Causes:**
1. Service worker registered but hasn't cached anything yet
2. Not online when trying to cache
3. Service worker not active yet

**Fixes:**

**Wait longer:**
- Service worker caches assets as they load
- Wait 10 seconds after page loads
- Check again: `offline.diagnostic()`

**Make sure you're online:**
```javascript
console.log('Online?', navigator.onLine)
```

**Reload page:**
- Service worker might need a reload to activate
- Ctrl+R to reload
- Check again: `offline.diagnostic()`

---

### Issue: "Service worker not controlling page"

**Symptoms:**
```
⚠️ Service worker not controlling page yet
💡 Reload the page to activate
```

**Cause:**
Service worker registered but not active yet. **This is normal on first registration!**

**Fix:**
Just reload the page:
```javascript
location.reload()
```

After reload:
```javascript
offline.diagnostic()
// Should now show "✅ Service worker is controlling this page"
```

---

### Issue: "Page won't load offline"

**Symptoms:**
- DevTools Offline mode enabled
- Reload page
- Page doesn't load / shows error

**Causes:**
1. Cache is empty (no files cached)
2. Service worker not active
3. Service worker not controlling page

**Diagnosis:**

**Check cache:**
```javascript
offline.checkCache()
// Need at least 5-10 files cached
```

**Check service worker:**
```javascript
navigator.serviceWorker.controller
  ? console.log('✅ SW active')
  : console.log('❌ SW not active - reload!')
```

**Fixes:**

**If cache empty:**
- Go back online
- Wait 10 seconds
- Let assets cache
- Try offline again

**If SW not active:**
- Reload page
- Service worker needs reload to take control

**If still not working:**
```javascript
offline.clearAll()
// Start completely fresh
```

---

## 📊 Understanding the System

### Service Worker Lifecycle

```
1. INSTALLING
   ↓ Creating blob URL
   ↓ Registering worker
   
2. INSTALLED
   ↓ Worker ready
   ↓ Waiting to activate
   
3. ACTIVATING
   ↓ Taking control
   ↓ Cleaning old caches
   
4. ACTIVATED ✅
   ✅ Controlling page
   ✅ Intercepting requests
   ✅ Serving from cache
```

### Cache-First Flow

**First visit (online):**
```
User → Request page
  ↓
Service Worker intercepts
  ↓
Check cache → NOT FOUND
  ↓
Fetch from network
  ↓
Cache response + Return to browser
  ↓
✅ Page loads (from network)
```

**Next visit (online/offline):**
```
User → Request page
  ↓
Service Worker intercepts
  ↓
Check cache → ✅ FOUND!
  ↓
Return from cache (INSTANT!)
  ↓
✅ Page loads (from cache)
  ↓
(Update cache in background)
```

### What Gets Cached

**Automatically cached:**
- ✅ HTML pages (`/`, `/index.html`)
- ✅ JavaScript bundles (`main.js`, etc.)
- ✅ CSS stylesheets (`styles.css`, etc.)
- ✅ Fonts (Noto Sans)
- ✅ Images (PNG, JPG, SVG, WebP)
- ✅ Icons (manifest icons as blobs)

**Never cached:**
- ❌ API requests to `192.168.4.1`
- ❌ Development files (`/@vite`, `?t=`)
- ❌ Blob URLs
- ❌ Data URLs

---

## 🎓 Technical Deep Dive

### Why Inline Service Worker?

**Standard approach (doesn't work in Figma Make):**
```javascript
// Register static file
navigator.serviceWorker.register('/service-worker.js')
// ❌ 404 - Figma Make doesn't serve /public files
```

**Inline approach (works!):**
```javascript
// 1. Define service worker code
const SW_CODE = `
  self.addEventListener('fetch', (event) => {
    // ... service worker logic
  });
`;

// 2. Create blob
const blob = new Blob([SW_CODE], { type: 'application/javascript' });
const blobURL = URL.createObjectURL(blob);

// 3. Register blob URL
navigator.serviceWorker.register(blobURL, { scope: '/' })
// ✅ Works! Service worker from blob URL
```

### Blob URL Advantages

1. **No static file needed** - Works in any environment
2. **Immediate updates** - Change code, regenerate blob
3. **Version control** - Code is in your repo
4. **Figma Make compatible** - No dependencies on file serving

### Cache Strategy Comparison

**Network First (old approach):**
```
Request → Try Network → Fallback to Cache
- Slow when online (waits for network)
- Unreliable offline (might not have cached)
```

**Cache First (current approach):**
```
Request → Try Cache → Fallback to Network
- Instant when cached
- Reliable offline
- Updates in background
```

---

## ✅ Success Checklist

Before claiming offline works:

- [ ] Cleared old service workers (`offline.clearAll()`)
- [ ] Console shows "Inline worker starting (v7)"
- [ ] Console shows "Service worker is controlling the page"
- [ ] Console shows "✅ Cached" messages for assets
- [ ] `offline.diagnostic()` shows "ready for offline mode"
- [ ] Cache has 5+ files
- [ ] DevTools offline test loads successfully
- [ ] Orange banner appears when offline
- [ ] All UI functional offline

---

## 🚀 Quick Reference

**First time setup:**
```javascript
// 1. Clear everything
offline.clearAll()

// 2. Wait for reload + 10 seconds

// 3. Check status
offline.diagnostic()

// 4. Test offline
// F12 → Network → Offline → Reload
```

**Subsequent tests:**
```javascript
// Quick check
offline.diagnostic()

// If not ready, wait 10 seconds and check again
// If still not ready, clear and start over
offline.clearAll()
```

---

## 📚 Related Files

- `/utils/inlineServiceWorker.ts` - Inline SW implementation
- `/utils/offlineDebug.ts` - Console testing tools
- `/components/OfflineIndicator.tsx` - Offline banner
- `/App.tsx` - PWA initialization

---

## 💡 Pro Tips

1. **Always clear first** - Old service workers interfere
2. **Watch console messages** - They tell you everything  
3. **Wait for caching** - Takes 10 seconds after load
4. **Test in DevTools** - Easier than WiFi toggle
5. **Reload if stuck** - Service worker needs reload
6. **Use diagnostic command** - `offline.diagnostic()`

---

**Start testing!** Open console and run: `offline.clearAll()` 🚀
