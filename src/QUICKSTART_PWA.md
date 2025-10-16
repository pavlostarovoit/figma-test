# 🚀 PWA Quick Start - 5 Minutes

## What You Need to Do

Your app is **already configured** as a PWA. You just need to generate 2 icon files.

## Step 1: Generate Icons (2 minutes)

### Easy Way:

1. Start your dev server:
   ```bash
   npm run dev
   ```

2. Open this URL in your browser:
   ```
   http://localhost:5173/generate-icons.html
   ```

3. Click the big **"Download Both"** button

4. Two files will download:
   - `icon-192.png`
   - `icon-512.png`

5. **Save both files to the `/public/` folder** in your project

### Alternative - Browser Console:

If the above doesn't work, try this:

1. Open your app in a browser
2. Press **F12** to open console
3. Paste this code:

```javascript
['192', '512'].forEach(size => {
  const s = parseInt(size);
  const c = document.createElement('canvas');
  c.width = s; c.height = s;
  const x = c.getContext('2d');
  x.fillStyle = '#000'; x.fillRect(0,0,s,s);
  x.fillStyle = '#fff';
  x.beginPath();
  x.moveTo(s*0.5,s*0.2); x.lineTo(s*0.6,s*0.35); x.lineTo(s*0.58,s*0.55);
  x.lineTo(s*0.6,s*0.65); x.lineTo(s*0.52,s*0.72); x.lineTo(s*0.48,s*0.72);
  x.lineTo(s*0.4,s*0.65); x.lineTo(s*0.42,s*0.55); x.lineTo(s*0.4,s*0.35);
  x.closePath(); x.fill();
  x.fillStyle = '#ff6b00';
  x.beginPath(); x.moveTo(s*0.42,s*0.72); x.lineTo(s*0.5,s*0.88);
  x.lineTo(s*0.58,s*0.72); x.closePath(); x.fill();
  x.fillStyle = '#fff'; x.font = `bold ${s*0.09}px Arial`;
  x.textAlign = 'center'; x.fillText('THRUST', s*0.5, s*0.94);
  c.toBlob(b => {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(b);
    a.download = `icon-${size}.png`;
    a.click();
  });
});
```

4. Files will download
5. Save to `/public/` folder

## Step 2: Verify (30 seconds)

In browser console, run:

```javascript
fetch('/icon-192.png').then(r => console.log('192:', r.ok));
fetch('/icon-512.png').then(r => console.log('512:', r.ok));
```

Both should show `true`.

## Step 3: Test Installation (1 minute)

### Android:
1. Open app in Chrome
2. Tap "Install" prompt
3. Done! ✅

### iOS:
1. Open in Safari
2. Share (⬆️) → Add to Home Screen
3. Done! ✅

### Desktop:
1. Open in Chrome
2. Click install icon in address bar
3. Done! ✅

## Step 4: Test Offline (1 minute)

1. Install the app (Step 3)
2. Turn off WiFi
3. Open installed app
4. Should work! ✅

## Done! 🎉

Your app now:
- ✅ Works offline
- ✅ Is installable on all devices
- ✅ Runs in fullscreen
- ✅ Auto-reconnects to 192.168.4.1

## Troubleshooting

### "Install" button doesn't appear
- Check icons exist in `/public/` folder
- Run verification step above

### App doesn't work offline
- Check console for service worker errors
- Try hard refresh (Ctrl+Shift+R)

### Need more help?
See `/PWA_SETUP_GUIDE.md` for detailed instructions.

---

**Total time: 5 minutes**

**Next:** Generate those icons and you're done!
