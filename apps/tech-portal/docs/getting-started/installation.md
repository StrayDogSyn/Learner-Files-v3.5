---
sidebar_position: 1
---

# Installation

Get started with the StrayDog AI Justice Reform Ecosystem by setting up your development environment.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** or **pnpm** (recommended)
- **Git**
- **VS Code** (recommended IDE)

## Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/straydog-syndicate/ai-justice-ecosystem.git
cd ai-justice-ecosystem
```

### 2. Install Dependencies

Using npm:
```bash
npm install
```

Using pnpm (recommended):
```bash
pnpm install
```

### 3. Environment Setup

Copy the environment template:
```bash
cp .env.example .env.local
```

Edit `.env.local` with your API keys:
```env
# Claude AI Configuration
CLAUDE_API_KEY=sk-ant-your-api-key-here

# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Application URLs
NEXT_PUBLIC_CORPORATE_URL=http://localhost:3000
NEXT_PUBLIC_TECH_PORTAL_URL=http://localhost:3001
NEXT_PUBLIC_BUSINESS_URL=http://localhost:3002
NEXT_PUBLIC_NONPROFIT_URL=http://localhost:3003
NEXT_PUBLIC_EDUCATION_URL=http://localhost:3004
NEXT_PUBLIC_AI_DASHBOARD_URL=http://localhost:3005
```

### 4. Start Development Servers

Start all applications:
```bash
npm run dev
```

Or start individual applications:
```bash
# Corporate site
npm run dev:corporate

# Tech portal
npm run dev:tech-portal

# Business platform
npm run dev:business

# Nonprofit initiative
npm run dev:nonprofit

# Education platform
npm run dev:education

# AI dashboard
npm run dev:ai-dashboard
```

## Project Structure

```
ai-justice-ecosystem/
├── apps/
│   ├── corporate/          # Main business site (Next.js)
│   ├── tech-portal/        # Developer docs (Docusaurus)
│   ├── business/           # Services platform (Next.js)
│   ├── nonprofit/          # Justice reform (Next.js)
│   ├── education/          # Learning platform (Next.js)
│   └── ai-dashboard/       # Analytics dashboard (React)
├── packages/
│   ├── ai-orchestrator/    # Claude AI integration
│   ├── ui-components/      # Shared UI components
│   └── database/           # Supabase client & types
├── .env.example           # Environment template
├── package.json           # Root package configuration
├── turbo.json            # Turborepo configuration
└── README.md             # Project overview
```

## Development Tools

### VS Code Setup

Install recommended extensions:
- **TypeScript and JavaScript Language Features**
- **Tailwind CSS IntelliSense**
- **ES7+ React/Redux/React-Native snippets**
- **Prettier - Code formatter**
- **ESLint**

### Multi-root Workspace

Open the provided VS Code workspace:
```bash
code straydog-ecosystem.code-workspace
```

This provides:
- Individual folder views for each app
- Shared settings and extensions
- Integrated terminal management
- Unified debugging configuration

## Verification

Verify your installation by checking that all services are running:

1. **Corporate Site**: http://localhost:3000
2. **Tech Portal**: http://localhost:3001
3. **Business Platform**: http://localhost:3002
4. **Nonprofit Initiative**: http://localhost:3003
5. **Education Platform**: http://localhost:3004
6. **AI Dashboard**: http://localhost:3005

## Troubleshooting

### Common Issues

**Port conflicts:**
```bash
# Kill processes on specific ports
npx kill-port 3000 3001 3002 3003 3004 3005
```

**Dependency issues:**
```bash
# Clear node_modules and reinstall
rm -rf node_modules apps/*/node_modules packages/*/node_modules
npm install
```

**Environment variables not loading:**
- Ensure `.env.local` is in the root directory
- Restart development servers after changes
- Check for typos in variable names

**Build errors:**
```bash
# Clean and rebuild
npm run clean
npm run build
```

### Getting Help

If you encounter issues:

1. Check the [troubleshooting guide](../guides/troubleshooting)
2. Search existing [GitHub issues](https://github.com/straydog-syndicate/ai-justice-ecosystem/issues)
3. Join our [developer community](https://discord.gg/straydog-dev)
4. Contact support at dev-support@straydog.ai

## Next Steps

Once installation is complete:

1. **[Configuration](./configuration)** - Set up API keys and services
2. **[First Project](./first-project)** - Build your first AI feature
3. **[AI Integration](../ai-integration/overview)** - Learn about Claude integration

---

*Ready to build the future of justice reform with AI? Let