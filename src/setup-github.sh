#!/bin/bash

# 🚀 GitHub Pages Setup Script
# This script helps you set up the project for GitHub Pages deployment

echo "════════════════════════════════════════════"
echo "🚀 Thrust Monitor - GitHub Pages Setup"
echo "════════════════════════════════════════════"
echo ""

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo "❌ Git is not installed. Please install git first."
    exit 1
fi

# Get repository name
echo "📝 What is your GitHub repository name?"
echo "   (e.g., 'thrust-monitor' or 'rocket-app')"
read -p "Repository name: " REPO_NAME

if [ -z "$REPO_NAME" ]; then
    echo "❌ Repository name cannot be empty"
    exit 1
fi

# Get GitHub username
echo ""
echo "📝 What is your GitHub username?"
read -p "GitHub username: " GITHUB_USER

if [ -z "$GITHUB_USER" ]; then
    echo "❌ GitHub username cannot be empty"
    exit 1
fi

echo ""
echo "════════════════════════════════════════════"
echo "📋 Configuration Summary"
echo "════════════════════════════════════════════"
echo "Repository: $REPO_NAME"
echo "GitHub User: $GITHUB_USER"
echo "URL: https://${GITHUB_USER}.github.io/${REPO_NAME}/"
echo ""
read -p "Is this correct? (y/n) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Setup cancelled"
    exit 1
fi

echo ""
echo "════════════════════════════════════════════"
echo "⚙️  Updating Configuration Files"
echo "════════════════════════════════════════════"

# Update vite.config.ts
echo "📝 Updating vite.config.ts with base path..."
cat > vite.config.ts << EOF
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/${REPO_NAME}/',
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
  server: {
    port: 3000,
  },
});
EOF
echo "✅ vite.config.ts updated"

# Update manifest.json
echo "📝 Updating manifest.json..."
if [ -f "public/manifest.json" ]; then
    sed -i.bak "s|\"start_url\": \"/\"|\"start_url\": \"/${REPO_NAME}/\"|g" public/manifest.json
    sed -i.bak "s|\"scope\": \"/\"|\"scope\": \"/${REPO_NAME}/\"|g" public/manifest.json
    rm public/manifest.json.bak 2>/dev/null
    echo "✅ manifest.json updated"
else
    echo "⚠️  manifest.json not found, skipping"
fi

# Create GitHub Actions workflow
echo "📝 Creating GitHub Actions deployment workflow..."
mkdir -p .github/workflows
cat > .github/workflows/deploy.yml << 'EOF'
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
EOF
echo "✅ GitHub Actions workflow created"

# Initialize git if not already
if [ ! -d ".git" ]; then
    echo ""
    echo "════════════════════════════════════════════"
    echo "🔧 Initializing Git Repository"
    echo "════════════════════════════════════════════"
    
    git init
    git branch -M main
    echo "✅ Git repository initialized"
else
    echo ""
    echo "✅ Git repository already exists"
fi

# Add remote
echo ""
echo "════════════════════════════════════════════"
echo "🔗 Adding GitHub Remote"
echo "════════════════════════════════════════════"

REMOTE_URL="https://github.com/${GITHUB_USER}/${REPO_NAME}.git"

# Remove existing origin if it exists
git remote remove origin 2>/dev/null

git remote add origin "$REMOTE_URL"
echo "✅ Remote added: $REMOTE_URL"

# Stage all files
echo ""
echo "════════════════════════════════════════════"
echo "📦 Staging Files"
echo "════════════════════════════════════════════"

git add .
echo "✅ All files staged"

# Commit
echo ""
read -p "📝 Enter commit message (default: 'Initial commit'): " COMMIT_MSG
COMMIT_MSG=${COMMIT_MSG:-"Initial commit - Thrust Monitor PWA"}

git commit -m "$COMMIT_MSG"
echo "✅ Files committed"

# Push
echo ""
echo "════════════════════════════════════════════"
echo "🚀 Pushing to GitHub"
echo "════════════════════════════════════════════"
echo ""
echo "⚠️  You may be prompted for GitHub credentials"
echo ""

if git push -u origin main; then
    echo ""
    echo "════════════════════════════════════════════"
    echo "✅ SUCCESS! Setup Complete!"
    echo "════════════════════════════════════════════"
    echo ""
    echo "📋 Next Steps:"
    echo ""
    echo "1. Go to: https://github.com/${GITHUB_USER}/${REPO_NAME}"
    echo ""
    echo "2. Click 'Settings' → 'Pages'"
    echo ""
    echo "3. Under 'Source', select 'GitHub Actions'"
    echo ""
    echo "4. Click 'Actions' tab to watch deployment"
    echo ""
    echo "5. Your app will be live at:"
    echo "   https://${GITHUB_USER}.github.io/${REPO_NAME}/"
    echo ""
    echo "⏱️  Deployment takes ~2 minutes"
    echo ""
    echo "════════════════════════════════════════════"
else
    echo ""
    echo "════════════════════════════════════════════"
    echo "❌ Push Failed"
    echo "════════════════════════════════════════════"
    echo ""
    echo "Possible reasons:"
    echo "• Repository doesn't exist on GitHub yet"
    echo "• Authentication failed"
    echo "• Network issues"
    echo ""
    echo "To fix:"
    echo ""
    echo "1. Create repository on GitHub:"
    echo "   https://github.com/new"
    echo "   Name: $REPO_NAME"
    echo ""
    echo "2. Then run:"
    echo "   git push -u origin main"
    echo ""
    echo "════════════════════════════════════════════"
    exit 1
fi
