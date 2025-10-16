# 🚀 Quick Deploy to GitHub Pages

**3-step process to get your app live on GitHub Pages!**

---

## ⚡ **QUICK START**

### Step 1: Download Files from Figma Make

**Option A: Use Export (if available)**
- Click menu (⋮) in Figma Make
- Select "Export" or "Download"
- Save ZIP and unzip

**Option B: Manual copy**
- Create folder `thrust-monitor` on your computer
- Copy ALL files from Figma Make to this folder
  - All `.tsx` files
  - All folders (`components/`, `hooks/`, `utils/`, `config/`, `styles/`, `imports/`, `public/`)
  - All config files (the ones we just created)

**✅ Check:** You should have all these files locally now!

---

### Step 2: Update Configuration

**CRITICAL:** Open `/vite.config.ts` and change ONE line:

```typescript
base: '/thrust-monitor/', // ⚠️ Change to YOUR repo name!
```

**Examples:**
- Repo name: `rocket-app` → use `'/rocket-app/'`
- Repo name: `thrust-stand` → use `'/thrust-stand/'`
- Repo name: `my-pwa` → use `'/my-pwa/'`

**Save the file!**

---

### Step 3: Push to GitHub

**A. Create GitHub Repo**

1. Go to [github.com/new](https://github.com/new)
2. Repository name: `thrust-monitor` (or your choice)
3. Public or Private (both work)
4. **DON'T** check "Initialize with README"
5. Click **"Create repository"**

**B. Push Your Code**

Open terminal in your project folder:

```bash
# Install dependencies first
npm install

# Test build locally (optional but recommended)
npm run build

# Initialize git
git init
git add .
git commit -m "Initial commit"

# Add GitHub remote (replace YOUR_USERNAME and REPO_NAME)
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git

# Push to GitHub
git branch -M main
git push -u origin main
```

**Replace:**
- `YOUR_USERNAME` = your GitHub username
- `REPO_NAME` = your repository name (same as vite.config.ts!)

---

### Step 4: Enable GitHub Pages

**A. Go to Settings**

1. In your GitHub repo, click **"Settings"** tab
2. Click **"Pages"** in left sidebar

**B. Configure Source**

1. Under "Build and deployment"
2. **Source:** Select **"GitHub Actions"**
3. Click **"Save"** (if needed)

**C. Wait for Deployment**

1. Click **"Actions"** tab
2. Watch the workflow run (~2 minutes)
3. Wait for green checkmark ✅

**D. Visit Your App!**

Your app is live at:
```
https://YOUR_USERNAME.github.io/REPO_NAME/
```

**🎉 Done!** Your PWA is deployed!

---

## 📱 **Test on Phone**

1. Visit the URL on your phone
2. Chrome/Safari will offer to "Install app"
3. Tap **"Install"** or **"Add to Home Screen"**
4. App opens fullscreen like native app!
5. **Works offline!** ✅

---

## 🔄 **Updating Your App**

**After making changes:**

```bash
git add .
git commit -m "Your change description"
git push
```

**GitHub Actions automatically rebuilds and deploys!**  
**Updates live in ~2 minutes!** ⚡

---

## ✅ **What We Created**

These files make it work:

- ✅ `/package.json` - Dependencies
- ✅ `/vite.config.ts` - Build config (UPDATE THE BASE PATH!)
- ✅ `/tsconfig.json` - TypeScript config
- ✅ `/index.html` - Entry point
- ✅ `/main.tsx` - React entry
- ✅ `/.github/workflows/deploy.yml` - Auto-deploy
- ✅ `/.gitignore` - Git ignore rules

---

## 🐛 **Troubleshooting**

### Build Fails on GitHub Actions

**Check the Actions logs:**
1. Go to "Actions" tab
2. Click the failed workflow
3. Read the error message

**Common fixes:**
- Missing dependency in `package.json`
- TypeScript error
- Import path issue

**Test locally first:**
```bash
npm run build
```

### 404 Error When Visiting App

**Problem:** Base path mismatch

**Fix:** In `/vite.config.ts`:
```typescript
base: '/YOUR-EXACT-REPO-NAME/', // Must match!
```

**Then:**
```bash
git add vite.config.ts
git commit -m "Fix base path"
git push
```

### Service Worker Not Working

**Check manifest.json:** Should have base path too!

**Edit `/public/manifest.json`:**
```json
{
  "start_url": "/your-repo-name/",
  "scope": "/your-repo-name/"
}
```

### Assets Not Loading

**All assets load relative to base path.**

If images/icons don't load, update paths in code:
- ❌ `src="/icon.png"`
- ✅ `src="./icon.png"` or `src={import.meta.env.BASE_URL + 'icon.png'}`

---

## 🎯 **Files Checklist**

Before pushing, verify you have:

**Root Files:**
- [ ] `package.json`
- [ ] `vite.config.ts` (with CORRECT base path!)
- [ ] `tsconfig.json`
- [ ] `tsconfig.node.json`
- [ ] `index.html`
- [ ] `main.tsx`
- [ ] `App.tsx`
- [ ] `.gitignore`

**Folders:**
- [ ] `components/` (all component files)
- [ ] `hooks/` (all hook files)
- [ ] `utils/` (all utility files)
- [ ] `config/` (config files)
- [ ] `styles/` (globals.css)
- [ ] `imports/` (Figma imports if any)
- [ ] `public/` (manifest.json, sw.js)
- [ ] `.github/workflows/` (deploy.yml)

---

## 🚀 **READY?**

1. **Download** files from Figma Make ✅
2. **Update** `vite.config.ts` base path ✅
3. **Create** GitHub repo ✅
4. **Push** code ✅
5. **Enable** GitHub Pages ✅
6. **Visit** your live app! 🎉

**Your PWA will work perfectly on GitHub Pages - service workers and all!** ✨

---

## 💡 **Need Help?**

**Read the full guide:** `/GITHUB_PAGES_DEPLOYMENT.md`

**Or use the setup script:**
```bash
chmod +x setup-github.sh
./setup-github.sh
```

**Common issues:**
- Forgot to update `vite.config.ts` base path
- Wrong repo name in git remote
- Missing dependencies

**Test locally first:**
```bash
npm install
npm run dev    # Development server
npm run build  # Production build
```

---

**Deploy now and get a working PWA in minutes!** 🚀
