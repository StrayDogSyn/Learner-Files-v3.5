# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Core Development
- `pnpm dev` - Start all applications in development mode
- `pnpm dev:main` - Start main application only (Vite dev server)
- `pnpm build:main` - Build main application (tsc + vite build)
- `pnpm preview:main` - Preview built application locally

### Monorepo Management (Turbo-powered)
- `turbo run dev` - Start all workspace apps in development
- `turbo run build` - Build all workspace packages and apps
- `turbo run type-check` - Run TypeScript checking across workspace
- `turbo run lint` - Run ESLint across all packages
- `turbo run test` - Run tests across all packages
- `turbo run clean` - Clean build artifacts

### Deployment
- `npm run build:gh-pages` - Build for GitHub Pages deployment
- `npm run deploy` - Build and deploy to GitHub Pages
- `npm run type-check && vite build` - Production build with type checking

### AI Automation Scripts
- `npm run ai:performance` - Performance analysis automation
- `npm run ai:behavior` - Behavior analysis automation  
- `npm run ai:conversion` - Conversion optimization automation
- `npm run ai:technical-debt` - Technical debt analysis
- `npm run ai:full-analysis` - Run all AI analysis scripts

### Package Management
- `pnpm install` - Install dependencies (preferred package manager)
- `npm install --legacy-peer-deps` - Alternative installation method for compatibility

## Architecture Overview

### Project Structure
This is a hybrid monorepo with both single-app and multi-app configurations:

**Current Structure (Single App)**:
- `src/` - Main React application
- `src/App.tsx` - Main application component with view routing
- `src/main.tsx` - React DOM initialization for component injection

**Planned Structure (Monorepo)**:
- `apps/` - Individual applications (business, education, portfolio)
- `packages/` - Shared packages (database, ui)

### AI Integration Architecture

**Core AI System**:
- `src/ai/orchestration/ClaudeOrchestrator.ts` - Main AI orchestration engine using Anthropic Claude SDK
- `src/ai/orchestration/DomainCoordinator.ts` - Cross-domain coordination and workflow management
- `src/ai/services/` - Supporting services (RateLimiter, ContextManager, AnalyticsService)

**Domain-Specific Services**:
- `src/domains/corporate/CorporateAIService.ts` - Corporate content generation
- `src/domains/technical/TechnicalAIService.ts` - Technical documentation and code generation
- `src/domains/business/BusinessAIService.ts` - Business intelligence and ROI analysis
- `src/domains/justice/JusticeAIService.ts` - Justice reform impact analysis

**Key AI Features**:
- Claude 3.5 Sonnet integration for content generation
- Domain-specific prompt templates and routing
- Rate limiting with tier-based access (free, corporate, enterprise, admin)
- Context management for conversation continuity
- Cross-domain analytics and performance tracking

### Application Views
The main app uses client-side routing with these views:
- Portfolio (default) - Project showcase and GitHub stats
- AI Demo - Interactive AI capabilities demonstration
- ROI Calculator - Business intelligence and ROI analysis
- Metrics Dashboard - Performance and analytics visualization
- Case Studies - AI-generated case study content
- Glassmorphic Demo - Design system showcase

### State Management
- **Analytics**: `src/hooks/useAnalytics.tsx` - Event tracking and metrics
- **GitHub Integration**: `src/hooks/useGitHub.tsx` - Repository data fetching
- **Lazy Loading**: `src/hooks/useLazyLoad.tsx` - Performance optimization

### Environment Variables
Required environment variables:
```
ANTHROPIC_API_KEY=your_anthropic_api_key
VITE_SUPABASE_URL=your_supabase_url  
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NODE_ENV=development
```

## Technical Specifications

### TypeScript Configuration
- Target: ES2020 with strict mode temporarily disabled for deployment
- Module resolution: bundler mode for Vite compatibility
- Path mapping: `@/*` maps to `./src/*`
- JSX: react-jsx transform

### Build System
- **Bundler**: Vite with React plugin
- **Package Manager**: pnpm (workspace support)
- **Monorepo**: Turbo for task orchestration and caching
- **Deployment**: GitHub Pages via gh-pages package

### Key Dependencies
- **React**: v18.3.1 with TypeScript
- **AI Integration**: @anthropic-ai/sdk v0.61.0
- **Styling**: Tailwind CSS v4.1.12 with glassmorphic design system
- **State**: Zustand v4.5.7 for lightweight state management
- **Animation**: Framer Motion v12.23.12
- **Charts**: Recharts v2.12.2
- **Icons**: Lucide React v0.363.0

### AI Service Integration Patterns
When working with AI services:
1. Use `ClaudeOrchestrator` for content generation with proper rate limiting
2. Route domain-specific requests through `DomainCoordinator`
3. Track all AI interactions with `AnalyticsService`
4. Maintain context continuity with `ContextManager`
5. Handle errors with domain-aware error handling

### Component Patterns
- AI components follow domain-driven organization in `src/components/ai/`
- Shared hooks in `src/hooks/` for cross-component functionality
- Page components in `src/pages/` for top-level views
- Type definitions in `src/shared/types/` and `src/types/`

## Important Notes

### Deployment Context
- Currently configured for GitHub Pages deployment on `gh-pages` branch
- TypeScript strict mode temporarily relaxed for deployment compatibility
- Uses Vite's base path configuration for GitHub Pages

### AI Rate Limiting
The system implements sophisticated rate limiting:
- **Free tier**: Basic usage limits
- **Corporate tier**: Enhanced limits for business use
- **Enterprise tier**: Premium access levels
- **Admin tier**: Unrestricted access for development

### Security Considerations
- API keys must be properly configured in environment variables
- Never commit sensitive information to the repository
- AI requests include user identification and role-based access control