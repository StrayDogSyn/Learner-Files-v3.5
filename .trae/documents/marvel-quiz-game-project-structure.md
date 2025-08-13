# 📁 Marvel Quiz Game - Project Structure & Deployment Guide

## 1. Complete Project Structure

```
marvel-quiz-game/
├── public/
│   ├── icons/
│   │   ├── achievements/
│   │   │   ├── infinity-stones/
│   │   │   │   ├── space-stone.svg
│   │   │   │   ├── mind-stone.svg
│   │   │   │   ├── reality-stone.svg
│   │   │   │   ├── power-stone.svg
│   │   │   │   ├── time-stone.svg
│   │   │   │   └── soul-stone.svg
│   │   │   ├── character-badges/
│   │   │   └── milestone-badges/
│   │   ├── characters/
│   │   └── ui/
│   ├── sounds/
│   │   ├── correct-answer.mp3
│   │   ├── wrong-answer.mp3
│   │   ├── achievement-unlock.mp3
│   │   ├── game-start.mp3
│   │   └── background-ambient.mp3
│   ├── models/
│   │   ├── iron-man-helmet.glb
│   │   ├── captain-america-shield.glb
│   │   └── thor-hammer.glb
│   ├── manifest.json
│   ├── favicon.ico
│   └── index.html
├── src/
│   ├── components/
│   │   ├── ui/
│   │   │   ├── GlassPanel.tsx
│   │   │   ├── GlassButton.tsx
│   │   │   ├── LoadingSpinner.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Toast.tsx
│   │   │   └── index.ts
│   │   ├── game/
│   │   │   ├── GameArena.tsx
│   │   │   ├── QuestionDisplay.tsx
│   │   │   ├── AnswerOptions.tsx
│   │   │   ├── ScoreDisplay.tsx
│   │   │   ├── TimerComponent.tsx
│   │   │   ├── AnswerFeedback.tsx
│   │   │   ├── GameModeSelector.tsx
│   │   │   ├── DifficultySelector.tsx
│   │   │   ├── PowerUpDisplay.tsx
│   │   │   └── index.ts
│   │   ├── multiplayer/
│   │   │   ├── MultiplayerLobby.tsx
│   │   │   ├── RoomCreator.tsx
│   │   │   ├── PlayerList.tsx
│   │   │   ├── ChatSystem.tsx
│   │   │   ├── MatchmakingQueue.tsx
│   │   │   └── index.ts
│   │   ├── character/
│   │   │   ├── CharacterGallery.tsx
│   │   │   ├── CharacterCard.tsx
│   │   │   ├── CharacterModal.tsx
│   │   │   ├── CharacterSearch.tsx
│   │   │   └── index.ts
│   │   ├── leaderboard/
│   │   │   ├── GlobalLeaderboard.tsx
│   │   │   ├── CategoryLeaderboard.tsx
│   │   │   ├── FriendsLeaderboard.tsx
│   │   │   ├── PlayerStats.tsx
│   │   │   └── index.ts
│   │   ├── achievements/
│   │   │   ├── AchievementShowcase.tsx
│   │   │   ├── AchievementCard.tsx
│   │   │   ├── AchievementNotification.tsx
│   │   │   ├── ProgressTracker.tsx
│   │   │   └── index.ts
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Navigation.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── index.ts
│   │   ├── auth/
│   │   │   ├── LoginModal.tsx
│   │   │   ├── UserProfile.tsx
│   │   │   ├── AuthCallback.tsx
│   │   │   └── index.ts
│   │   ├── settings/
│   │   │   ├── GameSettings.tsx
│   │   │   ├── AccessibilitySettings.tsx
│   │   │   ├── AudioSettings.tsx
│   │   │   └── index.ts
│   │   └── three/
│   │       ├── ParticleSystem.tsx
│   │       ├── CharacterModel.tsx
│   │       ├── BackgroundScene.tsx
│   │       ├── ARViewer.tsx
│   │       └── index.ts
│   ├── hooks/
│   │   ├── useMarvelApi.ts
│   │   ├── useGameSession.ts
│   │   ├── useMultiplayer.ts
│   │   ├── useAchievements.ts
│   │   ├── useLocalStorage.ts
│   │   ├── useWebSocket.ts
│   │   ├── useVoiceCommands.ts
│   │   ├── useAR.ts
│   │   └── index.ts
│   ├── services/
│   │   ├── marvelApi.ts
│   │   ├── questionGenerator.ts
│   │   ├── achievementService.ts
│   │   ├── leaderboardService.ts
│   │   ├── multiplayerService.ts
│   │   ├── audioService.ts
│   │   ├── cacheService.ts
│   │   ├── analyticsService.ts
│   │   └── index.ts
│   ├── store/
│   │   ├── gameStore.ts
│   │   ├── userStore.ts
│   │   ├── multiplayerStore.ts
│   │   ├── achievementStore.ts
│   │   ├── settingsStore.ts
│   │   └── index.ts
│   ├── utils/
│   │   ├── cn.ts
│   │   ├── constants.ts
│   │   ├── helpers.ts
│   │   ├── validators.ts
│   │   ├── formatters.ts
│   │   ├── animations.ts
│   │   └── index.ts
│   ├── types/
│   │   ├── game.ts
│   │   ├── marvel.ts
│   │   ├── user.ts
│   │   ├── multiplayer.ts
│   │   ├── achievements.ts
│   │   └── index.ts
│   ├── styles/
│   │   ├── globals.css
│   │   ├── components.css
│   │   ├── animations.css
│   │   └── themes.css
│   ├── pages/
│   │   ├── HomePage.tsx
│   │   ├── GamePage.tsx
│   │   ├── MultiplayerPage.tsx
│   │   ├── CharacterGalleryPage.tsx
│   │   ├── LeaderboardPage.tsx
│   │   ├── AchievementsPage.tsx
│   │   ├── ProfilePage.tsx
│   │   ├── SettingsPage.tsx
│   │   └── index.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── vite-env.d.ts
├── tests/
│   ├── unit/
│   │   ├── components/
│   │   ├── services/
│   │   ├── utils/
│   │   └── store/
│   ├── integration/
│   │   ├── game-flow.test.ts
│   │   ├── multiplayer.test.ts
│   │   └── api-integration.test.ts
│   ├── e2e/
│   │   ├── game-complete-flow.spec.ts
│   │   ├── multiplayer-battle.spec.ts
│   │   ├── achievement-unlock.spec.ts
│   │   └── accessibility.spec.ts
│   └── setup.ts
├── docs/
│   ├── api/
│   │   ├── marvel-api.md
│   │   ├── game-api.md
│   │   └── websocket-events.md
│   ├── components/
│   │   ├── ui-components.md
│   │   ├── game-components.md
│   │   └── three-components.md
│   ├── deployment/
│   │   ├── vercel-setup.md
│   │   ├── railway-setup.md
│   │   └── environment-variables.md
│   └── development/
│       ├── getting-started.md
│       ├── coding-standards.md
│       └── testing-guide.md
├── .github/
│   ├── workflows/
│   │   ├── ci.yml
│   │   ├── deploy.yml
│   │   ├── test.yml
│   │   └── security.yml
│   ├── ISSUE_TEMPLATE/
│   │   ├── bug_report.md
│   │   ├── feature_request.md
│   │   └── performance_issue.md
│   └── pull_request_template.md
├── .env.example
├── .env.local
├── .gitignore
├── .eslintrc.json
├── .prettierrc
├── tailwind.config.js
├── vite.config.ts
├── tsconfig.json
├── tsconfig.node.json
├── vitest.config.ts
├── playwright.config.ts
├── package.json
├── package-lock.json
├── vercel.json
├── README.md
└── LICENSE
```

## 2. Environment Configuration

### 2.1 Environment Variables Setup

```bash
# .env.example
# Marvel API Configuration
VITE_MARVEL_API_BASE_URL=https://gateway.marvel.com/v1/public
VITE_MARVEL_PUBLIC_KEY=your_marvel_public_key_here
VITE_MARVEL_PRIVATE_KEY=your_marvel_private_key_here

# Backend API Configuration
VITE_API_BASE_URL=http://localhost:3001/api
VITE_WEBSOCKET_URL=http://localhost:3001

# Authentication
VITE_GITHUB_CLIENT_ID=your_github_client_id
VITE_AUTH_REDIRECT_URI=http://localhost:5173/auth/callback

# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Analytics & Monitoring
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
VITE_SENTRY_DSN=your_sentry_dsn

# Feature Flags
VITE_ENABLE_AR_MODE=false
VITE_ENABLE_VOICE_COMMANDS=true
VITE_ENABLE_MULTIPLAYER=true
VITE_ENABLE_ANALYTICS=true

# Performance
VITE_ENABLE_PWA=true
VITE_ENABLE_SERVICE_WORKER=true

# Development
VITE_DEBUG_MODE=false
VITE_MOCK_API=false
```

### 2.2 Production Environment Variables

```bash
# .env.production
# Marvel API Configuration
VITE_MARVEL_API_BASE_URL=https://gateway.marvel.com/v1/public
VITE_MARVEL_PUBLIC_KEY=production_marvel_public_key
VITE_MARVEL_PRIVATE_KEY=production_marvel_private_key

# Backend API Configuration
VITE_API_BASE_URL=https://marvel-quiz-api.railway.app/api
VITE_WEBSOCKET_URL=https://marvel-quiz-api.railway.app

# Authentication
VITE_GITHUB_CLIENT_ID=production_github_client_id
VITE_AUTH_REDIRECT_URI=https://marvel-quiz-game.vercel.app/auth/callback

# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=production_supabase_anon_key

# Analytics & Monitoring
VITE_GA_MEASUREMENT_ID=G-PRODUCTION123
VITE_SENTRY_DSN=https://production-sentry-dsn

# Feature Flags
VITE_ENABLE_AR_MODE=true
VITE_ENABLE_VOICE_COMMANDS=true
VITE_ENABLE_MULTIPLAYER=true
VITE_ENABLE_ANALYTICS=true

# Performance
VITE_ENABLE_PWA=true
VITE_ENABLE_SERVICE_WORKER=true

# Production
VITE_DEBUG_MODE=false
VITE_MOCK_API=false
```

## 3. Deployment Configurations

### 3.1 Vercel Deployment

```json
// vercel.json
{
  "version": 2,
  "name": "marvel-quiz-game",
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "https://marvel-quiz-api.railway.app/api/$1"
    },
    {
      "src": "/(.*\\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot))",
      "headers": {
        "Cache-Control": "public, max-age=31536000, immutable"
      }
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        },
        {
          "key": "Permissions-Policy",
          "value": "camera=(), microphone=(), geolocation=()"
        }
      ]
    }
  ],
  "rewrites": [
    {
      "source": "/sitemap.xml",
      "destination": "/api/sitemap"
    }
  ]
}
```

### 3.2 GitHub Actions CI/CD

```yaml
# .github/workflows/ci.yml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

env:
  NODE_VERSION: '20'
  PNPM_VERSION: '8'

jobs:
  lint-and-type-check:
    name: Lint and Type Check
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}

      - name: Setup pnpm
        uses: pnpm/action-setup@v2
        with:
          version: ${{ env.PNPM_VERSION }}

      - name: Get pnpm store directory
        shell: bash
        run: |
          echo "STORE_PATH=$(pnpm store path --silent)" >> $GITHUB_ENV

      - name: Setup pnpm cache
        uses: actions/cache@v3
        with:
          path: ${{ env.STORE_PATH }}
          key: ${{ runner.os }}-pnpm-store-${{ hashFiles('**/pnpm-lock.yaml') }}
          restore-keys: |
            ${{ runner.os }}-pnpm-store-

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Run ESLint
        run: pnpm lint

      - name: Run TypeScript type check
        run: pnpm type-check

      - name: Check formatting
        run: pnpm format --check

  test:
    name: Unit Tests
    runs-on: ubuntu-latest
    needs: lint-and-type-check
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}

      - name: Setup pnpm
        uses: pnpm/action-setup@v2
        with:
          version: ${{ env.PNPM_VERSION }}

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Run unit tests
        run: pnpm test --coverage

      - name: Upload coverage reports
        uses: codecov/codecov-action@v3
        with:
          file: ./coverage/lcov.info
          flags: unittests
          name: codecov-umbrella

  e2e-tests:
    name: E2E Tests
    runs-on: ubuntu-latest
    needs: lint-and-type-check
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}

      - name: Setup pnpm
        uses: pnpm/action-setup@v2
        with:
          version: ${{ env.PNPM_VERSION }}

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Install Playwright browsers
        run: pnpm exec playwright install --with-deps

      - name: Build application
        run: pnpm build
        env:
          VITE_MARVEL_PUBLIC_KEY: ${{ secrets.MARVEL_PUBLIC_KEY }}
          VITE_MARVEL_PRIVATE_KEY: ${{ secrets.MARVEL_PRIVATE_KEY }}

      - name: Run E2E tests
        run: pnpm test:e2e
        env:
          VITE_MARVEL_PUBLIC_KEY: ${{ secrets.MARVEL_PUBLIC_KEY }}
          VITE_MARVEL_PRIVATE_KEY: ${{ secrets.MARVEL_PRIVATE_KEY }}

      - name: Upload E2E test results
        uses: actions/upload-artifact@v3
        if: failure()
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 30

  build:
    name: Build Application
    runs-on: ubuntu-latest
    needs: [test, e2e-tests]
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}

      - name: Setup pnpm
        uses: pnpm/action-setup@v2
        with:
          version: ${{ env.PNPM_VERSION }}

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Build application
        run: pnpm build
        env:
          VITE_MARVEL_PUBLIC_KEY: ${{ secrets.MARVEL_PUBLIC_KEY }}
          VITE_MARVEL_PRIVATE_KEY: ${{ secrets.MARVEL_PRIVATE_KEY }}

      - name: Upload build artifacts
        uses: actions/upload-artifact@v3
        with:
          name: dist
          path: dist/
          retention-days: 7

  deploy:
    name: Deploy to Vercel
    runs-on: ubuntu-latest
    needs: build
    if: github.ref == 'refs/heads/main'
    environment: production
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
          working-directory: ./

  lighthouse:
    name: Lighthouse Performance Audit
    runs-on: ubuntu-latest
    needs: deploy
    if: github.ref == 'refs/heads/main'
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Run Lighthouse CI
        uses: treosh/lighthouse-ci-action@v10
        with:
          urls: |
            https://marvel-quiz-game.vercel.app
            https://marvel-quiz-game.vercel.app/game
            https://marvel-quiz-game.vercel.app/characters
          uploadArtifacts: true
          temporaryPublicStorage: true
```

### 3.3 Security Configuration

```yaml
# .github/workflows/security.yml
name: Security Scan

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
  schedule:
    - cron: '0 2 * * 1' # Weekly on Monday at 2 AM

jobs:
  dependency-check:
    name: Dependency Vulnerability Scan
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Run npm audit
        run: npm audit --audit-level=high

      - name: Run Snyk to check for vulnerabilities
        uses: snyk/actions/node@master
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
        with:
          args: --severity-threshold=high

  codeql:
    name: CodeQL Security Analysis
    runs-on: ubuntu-latest
    permissions:
      actions: read
      contents: read
      security-events: write
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Initialize CodeQL
        uses: github/codeql-action/init@v2
        with:
          languages: javascript

      - name: Perform CodeQL Analysis
        uses: github/codeql-action/analyze@v2
```

## 4. Performance Optimization

### 4.1 Vite Configuration

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import { visualizer } from 'rollup-plugin-visualizer'
import path from 'path'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'Marvel Quiz Game',
        short_name: 'MarvelQuiz',
        description: 'Ultimate Marvel Universe Quiz Experience',
        theme_color: '#00D4FF',
        background_color: '#0A0A0A',
        display: 'standalone',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/gateway\.marvel\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'marvel-api-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 7 // 1 week
              },
              cacheKeyWillBeUsed: async ({ request }) => {
                return `${request.url}?${Date.now()}`
              }
            }
          }
        ]
      }
    }),
    visualizer({
      filename: 'dist/stats.html',
      open: true,
      gzipSize: true,
      brotliSize: true
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@services': path.resolve(__dirname, './src/services'),
      '@store': path.resolve(__dirname, './src/store'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@types': path.resolve(__dirname, './src/types')
    }
  },
  build: {
    target: 'esnext',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    },
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          animation: ['framer-motion'],
          three: ['three', '@react-three/fiber', '@react-three/drei'],
          ui: ['@heroicons/react', 'lucide-react'],
          store: ['zustand', '@tanstack/react-query'],
          utils: ['crypto-js', 'dexie']
        }
      }
    },
    chunkSizeWarningLimit: 1000
  },
  server: {
    port: 5173,
    host: true,
    cors: true
  },
  preview: {
    port: 4173,
    host: true
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'framer-motion',
      'three',
      '@react-three/fiber',
      '@react-three/drei'
    ]
  }
})
```

### 4.2 Bundle Analysis Script

```json
// package.json scripts addition
{
  "scripts": {
    "analyze": "npm run build && npx vite-bundle-analyzer dist/stats.html",
    "lighthouse": "lhci autorun",
    "perf:audit": "npm run build && npm run lighthouse"
  }
}
```

## 5. Monitoring & Analytics

### 5.1 Sentry Configuration

```typescript
// src/utils/monitoring.ts
import * as Sentry from '@sentry/react'
import { BrowserTracing } from '@sentry/tracing'

if (import.meta.env.PROD) {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    integrations: [
      new BrowserTracing({
        routingInstrumentation: Sentry.reactRouterV6Instrumentation(
          React.useEffect,
          useLocation,
          useNavigationType,
          createRoutesFromChildren,
          matchRoutes
        ),
      }),
    ],
    tracesSampleRate: 0.1,
    environment: import.meta.env.MODE,
    beforeSend(event) {
      // Filter out non-critical errors
      if (event.exception) {
        const error = event.exception.values?.[0]
        if (error?.type === 'ChunkLoadError') {
          return null // Don't send chunk load errors
        }
      }
      return event
    },
  })
}

export { Sentry }
```

### 5.2 Google Analytics Setup

```typescript
// src/utils/analytics.ts
import { gtag } from 'ga-gtag'

const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID

export const initGA = () => {
  if (GA_MEASUREMENT_ID && import.meta.env.PROD) {
    gtag('config', GA_MEASUREMENT_ID, {
      page_title: document.title,
      page_location: window.location.href,
    })
  }
}

export const trackEvent = (action: string, category: string, label?: string, value?: number) => {
  if (GA_MEASUREMENT_ID && import.meta.env.PROD) {
    gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    })
  }
}

export const trackGameEvent = (event: string, data: Record<string, any>) => {
  trackEvent(event, 'game', JSON.stringify(data))
}

export const trackPerformance = (metric: string, value: number) => {
  trackEvent('performance', 'timing', metric, value)
}
```

## 6. Development Scripts

### 6.1 Setup Script

```bash
#!/bin/bash
# scripts/setup.sh

echo "🚀 Setting up Marvel Quiz Game development environment..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Copy environment file
if [ ! -f .env.local ]; then
    echo "📝 Creating environment file..."
    cp .env.example .env.local
    echo "⚠️  Please update .env.local with your API keys"
fi

# Install Playwright browsers
echo "🎭 Installing Playwright browsers..."
npx playwright install

# Run initial build to check everything works
echo "🔨 Running initial build..."
npm run build

echo "✅ Setup complete! Run 'npm run dev' to start development."
echo "📚 Don't forget to:"
echo "   1. Get Marvel API keys from https://developer.marvel.com"
echo "   2. Set up Supabase project"
echo "   3. Configure GitHub OAuth app"
```

### 6.2 Pre-commit Hook

```bash
#!/bin/bash
# .husky/pre-commit

echo "🔍 Running pre-commit checks..."

# Run linting
echo "📝 Checking code style..."
npm run lint
if [ $? -ne 0 ]; then
    echo "❌ Linting failed. Please fix the issues and try again."
    exit 1
fi

# Run type checking
echo "🔍 Checking TypeScript types..."
npm run type-check
if [ $? -ne 0 ]; then
    echo "❌ Type checking failed. Please fix the issues and try again."
    exit 1
fi

# Run tests
echo "🧪 Running tests..."
npm run test
if [ $? -ne 0 ]; then
    echo "❌ Tests failed. Please fix the issues and try again."
    exit 1
fi

echo "✅ All checks passed!"
```

## 7. Documentation Generation

### 7.1 API Documentation

```typescript
// scripts/generate-docs.ts
import fs from 'fs'
import path from 'path'

interface APIEndpoint {
  method: string
  path: string
  description: string
  parameters?: Record<string, any>
  response?: Record<string, any>
}

const endpoints: APIEndpoint[] = [
  {
    method: 'GET',
    path: '/api/characters',
    description: 'Fetch Marvel characters with pagination',
    parameters: {
      limit: 'number - Number of characters to fetch (max 100)',
      offset: 'number - Pagination offset',
      nameStartsWith: 'string - Filter by character name prefix'
    },
    response: {
      data: {
        results: 'Array<Character> - Array of character objects',
        total: 'number - Total number of characters',
        count: 'number - Number of characters in this response'
      }
    }
  },
  // Add more endpoints...
]

const generateAPIDoc = () => {
  let markdown = '# Marvel Quiz Game API Documentation\n\n'
  
  endpoints.forEach(endpoint => {
    markdown += `## ${endpoint.method} ${endpoint.path}\n\n`
    markdown += `${endpoint.description}\n\n`
    
    if (endpoint.parameters) {
      markdown += '### Parameters\n\n'
      Object.entries(endpoint.parameters).forEach(([key, value]) => {
        markdown += `- **${key}**: ${value}\n`
      })
      markdown += '\n'
    }
    
    if (endpoint.response) {
      markdown += '### Response\n\n'
      markdown += '```json\n'
      markdown += JSON.stringify(endpoint.response, null, 2)
      markdown += '\n```\n\n'
    }
  })
  
  fs.writeFileSync(path.join(__dirname, '../docs/api/endpoints.md'), markdown)
  console.log('✅ API documentation generated!')
}

generateAPIDoc()
```

This comprehensive project structure and deployment guide provides everything needed to build, test, and deploy the Marvel Quiz Game successfully. The structure is scalable, maintainable, and follows modern web development best practices.