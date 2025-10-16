import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// ⚠️ IMPORTANT: Change 'thrust-monitor' to match your GitHub repository name!
// For example: if your repo is 'rocket-app', change to '/rocket-app/'
// If deploying to root domain (custom domain), use '/'

export default defineConfig({
  plugins: [react()],
  base: '/thrust-monitor/', // ⚠️ UPDATE THIS to your repo name!
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
  server: {
    port: 3000,
    open: true,
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
