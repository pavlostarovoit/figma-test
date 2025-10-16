# 🚀 Rocket Engine Thrust Monitor PWA

**Progressive Web App for controlling and monitoring a rocket engine thrust measurement stand.**

---

## ✨ Features

- 📊 **Live Data Monitoring** - Real-time thrust measurements and graphs
- 📱 **Mobile-First PWA** - Installable on any smartphone
- 🔌 **Offline Support** - Works without internet connection
- 📡 **Local Server Connection** - Connects to 192.168.4.1
- 🎥 **Camera Feed** - Live video monitoring
- 📈 **Data Visualization** - Thrust graphs and statistics
- 🎨 **Custom Design System** - Consistent UI with design tokens

---

## 🚀 Quick Start (GitHub Pages)

**Deploy this app to GitHub Pages in 4 steps:**

### 1. Download from Figma Make
- Export project or copy all files locally

### 2. Update Config
- Edit `/vite.config.ts`
- Change `base: '/thrust-monitor/'` to match your repo name

### 3. Push to GitHub
```bash
npm install
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

### 4. Enable GitHub Pages
- Go to repo Settings → Pages
- Source: "GitHub Actions"
- Wait ~2 minutes

**Your app is live!** 🎉

**📖 Full guide:** See `/DEPLOY_TO_GITHUB.md`

---

## 💻 Local Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## 📱 PWA Installation

**On Smartphone:**
1. Visit your deployed URL
2. Tap "Install" or "Add to Home Screen"
3. App opens fullscreen
4. Works offline!

**Features:**
- Fullscreen mode
- Offline functionality
- Native app feel
- Background sync ready

---

## 🛠️ Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS v4** - Styling with design tokens
- **Recharts** - Data visualization
- **Service Workers** - Offline support
- **PWA** - Native app experience

---

## 📁 Project Structure

```
thrust-monitor/
├── App.tsx                 # Main app component
├── main.tsx                # React entry point
├── index.html              # HTML entry
├── components/             # React components
│   ├── CameraFeed.tsx
│   ├── ThrustGraph.tsx
│   ├── ConnectionDebug.tsx
│   ├── OfflineIndicator.tsx
│   └── ui/                 # Shadcn UI components
├── hooks/                  # Custom React hooks
│   ├── useMeasurementData.ts
│   └── useMockData.ts
├── utils/                  # Utility functions
├── config/                 # App configuration
├── styles/                 # Global styles & design tokens
│   └── globals.css         # ⚠️ Design system variables
├── public/                 # Static assets
│   ├── manifest.json       # PWA manifest
│   └── sw.js              # Service worker
└── .github/workflows/      # GitHub Actions
    └── deploy.yml         # Auto-deployment
```

---

## 🎨 Design System

**All styling uses CSS variables from `/styles/globals.css`:**

- **Colors:** `--color-*` tokens
- **Typography:** Custom font faces
- **Spacing:** `--spacing-*` tokens
- **Borders:** `--border-*` tokens
- **Radius:** `--radius-*` tokens

**To customize:** Edit `/styles/globals.css`

---

## 🔌 API Configuration

**Server endpoint:** `http://192.168.4.1/mesData`

**Data format:**
```json
{
  "thrust": 1234.5,
  "rate": 50,
  "rssi": -45,
  "state": "measuring",
  "time": 1234567890,
  "samples": [...]
}
```

**Update in:** `/config/app-config.ts`

---

## 📝 Documentation

- **Quick Deploy:** `/DEPLOY_TO_GITHUB.md`
- **Full Deployment:** `/GITHUB_PAGES_DEPLOYMENT.md`
- **Setup Script:** `/setup-github.sh`
- **Guidelines:** `/guidelines/Guidelines.md`

---

## 🐛 Troubleshooting

### Service Worker Issues on Figma Make

**Problem:** Service workers don't work on Figma Make

**Solution:** Deploy to GitHub Pages instead!
- See `/DEPLOY_TO_GITHUB.md`
- GitHub Pages fully supports service workers
- PWA features work perfectly

### Build Errors

**Test locally:**
```bash
npm install
npm run build
```

**Check:**
- All dependencies installed
- No TypeScript errors
- Correct import paths

### 404 on Deployed App

**Fix:** Update `vite.config.ts` base path to match repo name:
```typescript
base: '/your-repo-name/',
```

---

## ✅ Requirements

- **Node.js** 18+ (for local development)
- **GitHub Account** (for deployment)
- **Modern Browser** (Chrome, Safari, Firefox, Edge)
- **HTTPS** (required for PWA features)

---

## 🚀 Deployment Options

### GitHub Pages (Recommended)
- ✅ Free hosting
- ✅ Auto-deployment
- ✅ Service workers work
- ✅ PWA support
- ✅ Custom domains

### Alternative: Netlify/Vercel
- Similar features
- Drag-and-drop deploy
- See `/GITHUB_PAGES_DEPLOYMENT.md` for setup

---

## 📄 License

This project is for rocket engine testing and monitoring purposes.

---

## 🎯 Next Steps

1. **Deploy to GitHub Pages** - Follow `/DEPLOY_TO_GITHUB.md`
2. **Test on phone** - Install as PWA
3. **Connect to stand** - Configure API endpoint
4. **Customize design** - Update `/styles/globals.css`
5. **Add features** - Build on the foundation!

---

## 💡 Tips

- **Offline first:** Service worker caches app for offline use
- **Mock data:** Built-in mock data for testing (see `/hooks/useMockData.ts`)
- **Debug mode:** Connection debug panel shows real-time status
- **Design tokens:** All styling uses CSS variables for easy theming

---

**Built with ❤️ for rocket science** 🚀

**Questions?** Check the docs in `/DEPLOY_TO_GITHUB.md`

**Ready to launch?** Deploy now! 🎉
