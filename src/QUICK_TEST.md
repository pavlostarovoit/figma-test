# ⚡ Quick Offline Test - Figma Make

## ⚠️ IMPORTANT: Hard Refresh First!

**Figma Make caches JavaScript bundles.** You MUST do a hard refresh to get the new code!

### Hard Refresh Instructions:

**Windows/Linux:**
- **Chrome/Edge:** Ctrl + Shift + R or Ctrl + F5
- **Firefox:** Ctrl + Shift + R or Ctrl + F5

**Mac:**
- **Chrome/Edge:** Cmd + Shift + R
- **Firefox:** Cmd + Shift + R
- **Safari:** Cmd + Option + R

**Alternative:**
1. Open DevTools (F12)
2. Right-click the reload button
3. Select "Empty Cache and Hard Reload"

---

## Step 1: Clear Everything

**Open console (F12), paste, press Enter:**

```javascript
offline.clearAll()
```

**Wait for automatic reload (takes 2 seconds)**

---

## Step 2: Check Console for NEW Code

After reload, **look for these EXACT messages:**

```
═══════════════════════════════════════
[PWA] 🚀 STARTING PWA INIT - INLINE SERVICE WORKER V7
═══════════════════════════════════════
[PWA] STEP 1/4: Generating PWA icons...
[PWA] Initializing icons...
[PWA] Icons initialized successfully
[PWA] ✅ STEP 1 COMPLETE: Icons ready
[PWA] STEP 2/4: Loading inline service worker module...
[PWA] STEP 2/4: Creating blob-based service worker...
[ServiceWorker] Inline worker starting (v7)...
[ServiceWorker] Installing v7 (inline)...
[ServiceWorker] Activating v7 (inline)...
[PWA] ✅ STEP 2 COMPLETE: Inline service worker registered!
[PWA] STEP 3/4: Waiting for service worker activation...
[PWA] ✅ STEP 3 COMPLETE: Service worker is controlling the page!
[PWA] ✅ App is now available OFFLINE!
═══════════════════════════════════════
[PWA] ✅ PWA INITIALIZATION COMPLETE!
═══════════════════════════════════════
```

### ✅ Good Signs (New Code Running)

**Look for:**
- `═══` Header lines
- `"STARTING PWA INIT - INLINE SERVICE WORKER V7"`
- `"STEP 1/4"`, `"STEP 2/4"`, etc.
- `"Inline worker starting (v7)"`

**If you see these** → New code is running! ✅ Continue to Step 3.

### ❌ Bad Signs (Old Code Still Running)

**If you see:**
```
[PWA] Initializing PWA icons...
[PWA] Registering service worker...
[PWA] Installation checklist:
  → Waiting for install prompt...
```

**This is OLD code!** You need to hard refresh.

**Fix:**
1. **Hard refresh** (Ctrl + Shift + R or Cmd + Shift + R)
2. **Or:** F12 → Network tab → Check "Disable cache"
3. **Then reload** (Ctrl + R)
4. **Run `offline.clearAll()` again**

---

## Step 3: Wait & Verify (10s)

Wait 10 seconds, then:

```javascript
offline.diagnostic()
```

**Should show:**
```
═══════════════════════════════════════
✅ PWA is ready for offline mode!

🧪 To test:
   1. F12 → Network → Offline
   2. Reload page (Ctrl+R)
   3. Should work! ✅
═══════════════════════════════════════
```

---

## Step 4: Test Offline (10s)

1. **F12 → Network tab**
2. **Dropdown → Select "Offline"**
3. **Reload page (Ctrl+R)**

**Expected:**

✅ Page loads successfully
✅ Orange banner: "📱 Running offline from cache"
✅ Console shows:
```
[ServiceWorker] ✅ Cache hit: index
[ServiceWorker] ✅ Cache hit: main.js
```

---

## 🔍 Debugging: Is New Code Running?

**Check version in console:**

```javascript
// Check if new inline service worker is registered
navigator.serviceWorker.getRegistrations().then(regs => {
  if (regs.length > 0) {
    console.log('SW URL:', regs[0].active?.scriptURL);
    // Should show: "blob:https://..."
    // If shows: "/service-worker.js" → OLD CODE!
  } else {
    console.log('No service worker registered');
  }
});
```

**If shows `/service-worker.js`:**
- Old code is running
- Hard refresh browser
- Clear cache (F12 → Application → Clear storage → Clear site data)
- Try again

**If shows `blob:https://...`:**
- New code is running! ✅
- Inline service worker is active

---

## 🆘 Still Not Working?

### Try Nuclear Option:

1. **F12 → Application tab**
2. **Storage → Clear site data** (button)
3. **Close all tabs** for this site
4. **Close DevTools**
5. **Reopen site in new tab**
6. **Hard refresh** (Ctrl + Shift + R)
7. **Run `offline.clearAll()`**
8. **Check console** for `"INLINE SERVICE WORKER V7"`

---

## 📋 Success Checklist

Before testing offline:

- [ ] Hard refreshed browser (Ctrl + Shift + R)
- [ ] Console shows `"═══"` header lines
- [ ] Console shows `"INLINE SERVICE WORKER V7"`
- [ ] Console shows `"STEP 1/4"` through `"STEP 4/4"`
- [ ] Console shows `"Inline worker starting (v7)"`
- [ ] Console shows `"PWA INITIALIZATION COMPLETE"`
- [ ] `offline.diagnostic()` says "ready"
- [ ] Service worker URL is `blob:` not `/service-worker.js`

---

## 💡 Why Hard Refresh Matters

**Figma Make caches JavaScript:**
- Normal refresh (F5) → Uses cached JS (old code)
- Hard refresh (Ctrl+Shift+R) → Fetches new JS ✅

**Always hard refresh after changes!**

---

## 🎯 Quick Commands

```javascript
// Check if new code is running
console.log('Looking for new code...');
// Should see "INLINE SERVICE WORKER V7" in recent messages

// Check service worker URL
navigator.serviceWorker.getRegistrations().then(r => 
  console.log('SW:', r[0]?.active?.scriptURL || 'None')
);

// Full diagnostic
offline.diagnostic()

// Clear and start over
offline.clearAll()
```

---

**START HERE:**
1. **Hard refresh** (Ctrl + Shift + R)
2. **Console:** `offline.clearAll()`
3. **Look for:** `"INLINE SERVICE WORKER V7"`

If you don't see the V7 message, **hard refresh** and try again!
