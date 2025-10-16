# 🚀 Deploy to GitHub Pages

This guide shows how to download your Figma Make app and deploy it to GitHub Pages, which will solve the service worker issues and make your PWA work perfectly!

---

## 📥 **STEP 1: Download Your Project**

### Method A: Download from Figma Make (Easiest)

1. **Click the menu** (three dots) in Figma Make
2. **Select "Download project"** or "Export"
3. **Save the ZIP file** to your computer
4. **Unzip** the file

### Method B: Copy Files Manually

If download isn't available:

1. **Create a new folder** on your computer (e.g., `thrust-monitor`)
2. **Copy all files** from Figma Make:
   - Right-click each file
   - Copy the content
   - Create the same file locally
   - Paste the content

**Files you MUST include:**
```
thrust-monitor/
├── App.tsx
├── package.json          ⚠️ You'll create this
├── vite.config.ts        ⚠️ You'll create this
├── tsconfig.json         ⚠️ You'll create this
├── index.html            ⚠️ From /public/index.html
├── components/           (all files)
├── hooks/                (all files)
├── utils/                (all files)
├── config/               (all files)
├── styles/               (all files)
├── imports/              (all files)
└── public/
    ├── manifest.json
    ├── sw.js
    └── generate-icons.html
```

---

## 📦 **STEP 2: Create Configuration Files**

Since Figma Make doesn't export these, you need to create them:

### 1. Create `package.json`

Create this file in the root folder:

```json
{
  "name": "thrust-monitor",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "lucide-react": "^0.344.0",
    "recharts": "^2.12.0",
    "date-fns": "^3.3.1",
    "sonner": "^1.4.3"
  },
  "devDependencies": {
    "@types/react": "^18.3.1",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react": "^4.2.1",
    "typescript": "^5.3.3",
    "vite": "^5.1.0",
    "tailwindcss": "^4.0.0",
    "autoprefixer": "^10.4.17",
    "postcss": "^8.4.33"
  }
}
```

### 2. Create `vite.config.ts`

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/thrust-monitor/',  // ⚠️ IMPORTANT: Change to your repo name!
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
  server: {
    port: 3000,
  },
});
```

**⚠️ CRITICAL:** Change `/thrust-monitor/` to match your GitHub repo name!

For example:
- Repo: `my-rocket-app` → `base: '/my-rocket-app/'`
- Repo: `thrust-monitor` → `base: '/thrust-monitor/'`

### 3. Create `tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["**/*.ts", "**/*.tsx"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

### 4. Create `tsconfig.node.json`

```json
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts"]
}
```

### 5. Move `index.html` to root

**Move** `/public/index.html` to the **root** of your project.

**Update the file** to include:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="theme-color" content="#000000" />
    
    <!-- PWA -->
    <link rel="manifest" href="/manifest.json" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
    <meta name="apple-mobile-web-app-title" content="Thrust Monitor" />
    
    <title>Thrust Monitor</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/App.tsx"></script>
  </body>
</html>
```

### 6. Create `main.tsx`

Create `/main.tsx` in the root:

```typescript
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles/globals.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

**Then update `index.html`** to use it:

```html
<script type="module" src="/main.tsx"></script>
```

### 7. Create `.gitignore`

```
# Dependencies
node_modules/

# Build
dist/
build/

# Logs
*.log
npm-debug.log*

# Editor
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Env
.env
.env.local
```

---

## 🐙 **STEP 3: Create GitHub Repository**

### 1. Go to GitHub

- Visit [github.com](https://github.com)
- Sign in or create account

### 2. Create New Repository

- Click **"New"** or **"+"** → **"New repository"**
- Name: `thrust-monitor` (or your preferred name)
- Description: "PWA for rocket engine thrust monitoring"
- **Public** or **Private** (both work with Pages)
- **Don't** check "Initialize with README"
- Click **"Create repository"**

### 3. Push Your Code

**Open terminal** in your project folder:

```bash
# Initialize git
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - Thrust Monitor PWA"

# Add GitHub as remote (replace YOUR_USERNAME and REPO_NAME)
git remote add origin https://github.com/YOUR_USERNAME/thrust-monitor.git

# Push to GitHub
git branch -M main
git push -u origin main
```

**Replace:**
- `YOUR_USERNAME` with your GitHub username
- `thrust-monitor` with your repo name

---

## 🌐 **STEP 4: Enable GitHub Pages**

### 1. Go to Repository Settings

- Click **"Settings"** tab
- Click **"Pages"** in left sidebar

### 2. Configure GitHub Actions

**Source:** Select **"GitHub Actions"**

### 3. Create Deployment Workflow

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
        
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build
        run: npm run build
        
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

**Commit and push:**

```bash
git add .github/workflows/deploy.yml
git commit -m "Add GitHub Pages deployment workflow"
git push
```

### 4. Wait for Deployment

- Go to **"Actions"** tab
- Watch the workflow run
- Wait for green checkmark ✅

### 5. Visit Your App!

**Your app will be live at:**
```
https://YOUR_USERNAME.github.io/thrust-monitor/
```

---

## ⚠️ **IMPORTANT: Update Service Worker Scope**

The service worker needs to know about the base path!

**Edit `/public/sw.js`:**

```javascript
// At the top, add:
const BASE_PATH = '/thrust-monitor/'; // ⚠️ Change to your repo name

// Update all cache URLs to include base path:
const urlsToCache = [
  BASE_PATH,
  BASE_PATH + 'index.html',
  // etc.
];
```

**Or simpler:** Update to use relative URLs:

```javascript
const urlsToCache = [
  './',
  './index.html',
];
```

---

## 🧪 **STEP 5: Test Your PWA**

### 1. Visit on Desktop

```
https://YOUR_USERNAME.github.io/thrust-monitor/
```

**Check:**
- ✅ App loads
- ✅ Console shows service worker registered
- ✅ Install prompt appears
- ✅ Works offline (F12 → Network → Offline)

### 2. Visit on Phone

**Open in Chrome/Safari:**
```
https://YOUR_USERNAME.github.io/thrust-monitor/
```

**Install as app:**
- **Android:** Menu → "Install app" or "Add to Home Screen"
- **iOS:** Share → "Add to Home Screen"

**Test:**
- ✅ Runs fullscreen
- ✅ Works offline
- ✅ Looks native

---

## 🎯 **Why GitHub Pages Works Better**

| Feature | Figma Make | GitHub Pages |
|---------|-----------|--------------|
| **Service Worker** | ❌ Files not served | ✅ Works perfectly |
| **Offline Mode** | ❌ Broken | ✅ Full support |
| **PWA Install** | ⚠️ Partial | ✅ Full support |
| **Custom Domain** | ❌ No | ✅ Yes |
| **HTTPS** | ✅ Yes | ✅ Yes |
| **Free** | ✅ Yes | ✅ Yes |

**GitHub Pages = Production-ready PWA!** ✅

---

## 🔄 **Updating Your App**

**After making changes:**

```bash
# Add changes
git add .

# Commit
git commit -m "Description of changes"

# Push
git push

# GitHub Actions will automatically rebuild and deploy!
```

**Your app updates in ~1-2 minutes!** 🚀

---

## 🐛 **Troubleshooting**

### Build Fails

**Check:**
- All dependencies in `package.json`
- Correct imports in files
- No syntax errors

**Run locally first:**
```bash
npm install
npm run build
```

### 404 on Assets

**Problem:** Files not found

**Solution:** Check `base` in `vite.config.ts` matches repo name!

```typescript
base: '/thrust-monitor/',  // Must match repo name
```

### Service Worker Not Registering

**Problem:** Wrong scope

**Solution:** Update service worker to use relative paths:

```javascript
const urlsToCache = [
  './',
  './index.html',
];
```

### White Screen

**Check:**
1. Browser console for errors
2. `base` path in `vite.config.ts`
3. GitHub Actions build log

---

## 📱 **Custom Domain (Optional)**

Want `thrust-monitor.com` instead of `username.github.io/thrust-monitor/`?

### 1. Buy Domain

- Namecheap, Google Domains, etc.

### 2. Configure DNS

**Add A records:**
```
185.199.108.153
185.199.109.153
185.199.110.153
185.199.111.153
```

**Add CNAME:**
```
www → YOUR_USERNAME.github.io
```

### 3. Update GitHub

- Settings → Pages
- Custom domain: `thrust-monitor.com`
- Save

### 4. Update `vite.config.ts`

```typescript
base: '/',  // Root domain now!
```

**Rebuild and push!**

---

## ✅ **Quick Checklist**

Before deploying:

- [ ] All files copied from Figma Make
- [ ] `package.json` created
- [ ] `vite.config.ts` created (with correct `base`)
- [ ] `tsconfig.json` created
- [ ] `main.tsx` created
- [ ] `index.html` moved to root
- [ ] `.gitignore` created
- [ ] GitHub repo created
- [ ] Code pushed to GitHub
- [ ] `.github/workflows/deploy.yml` created
- [ ] Service worker uses relative paths
- [ ] `manifest.json` in `/public`

---

## 🚀 **Ready to Deploy!**

**Follow the steps above and you'll have:**

✅ Working service worker  
✅ Full offline support  
✅ PWA installation  
✅ Production hosting  
✅ Auto-deployment  
✅ Free forever  

**Your thrust monitor will work perfectly on GitHub Pages!** 🎯

---

## 💡 **Next Steps**

After deploying:

1. **Test on phone** - Install as PWA
2. **Connect to rocket stand** - Update API URL
3. **Test offline mode** - Airplane mode
4. **Share the URL** - With your team!

**Questions? Issues? Check the GitHub Actions logs!** 🔍
