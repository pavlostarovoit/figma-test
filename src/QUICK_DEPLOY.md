# ⚡ QUICK DEPLOY REFERENCE

**Copy-paste commands to deploy to GitHub Pages**

---

## 📋 **BEFORE YOU START**

### 1. Update vite.config.ts

```typescript
base: '/YOUR-REPO-NAME/', // ⚠️ CHANGE THIS!
```

### 2. Create GitHub repo at:
```
https://github.com/new
```

Name it exactly as you set in `base` above!

---

## 💻 **COPY-PASTE COMMANDS**

**Open terminal in your project folder and run:**

```bash
# Install dependencies
npm install

# Test build (optional but recommended)
npm run build

# Initialize git
git init
git add .
git commit -m "Initial commit - Thrust Monitor PWA"

# Add GitHub remote
# ⚠️ REPLACE YOUR_USERNAME and YOUR_REPO_NAME!
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# Push to GitHub
git branch -M main
git push -u origin main
```

---

## ⚙️ **ENABLE GITHUB PAGES**

1. Go to: `https://github.com/YOUR_USERNAME/YOUR_REPO_NAME/settings/pages`

2. Under **"Build and deployment"**:
   - Source: **GitHub Actions**
   - Click Save

3. Go to **Actions** tab and wait for ✅

4. **DONE!** Visit:
   ```
   https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/
   ```

---

## 🔄 **UPDATE APP**

```bash
git add .
git commit -m "Your changes"
git push
```

**Auto-deploys in ~2 minutes!**

---

## ✅ **CHECKLIST**

Before pushing:

- [ ] Updated `vite.config.ts` with repo name
- [ ] Created GitHub repo with same name
- [ ] Installed dependencies (`npm install`)
- [ ] Tested build (`npm run build`)
- [ ] All files copied from Figma Make

---

## 🐛 **QUICK FIXES**

### 404 Error
→ Check `vite.config.ts` base path matches repo name exactly

### Build Fails
→ Run `npm run build` locally to see errors

### Service Worker Not Working
→ Update `/public/manifest.json` start_url and scope

---

## 📱 **TEST ON PHONE**

1. Visit URL on phone
2. Chrome/Safari: "Install app"
3. Tap Install
4. Works offline! ✅

---

**That's it! 🚀**

**Full guide:** `/DEPLOY_TO_GITHUB.md`
