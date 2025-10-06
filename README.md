<div align="center">

# 🎯 Learner Files v3.5
## StrayDog Syndications Monorepo

<div align="center">

![Status](https://img.shields.io/badge/Status-Active%20Development-brightgreen?style=for-the-badge)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue?style=for-the-badge&logo=typescript)
![React](https://img.shields.io/badge/React-18+-61DAFB?style=for-the-badge&logo=react)
![Vite](https://img.shields.io/badge/Vite-5.0+-646CFF?style=for-the-badge&logo=vite)

</div>

**A comprehensive monorepo containing three specialized applications and shared packages for the StrayDog Syndications ecosystem.**

</div>

---

## 📚 Documentation

### Development Resources
- **[Architecture Guide](./docs/architecture.md)** - System design and structure
- **[Development Setup](./docs/development.md)** - Local environment configuration
- **[API Documentation](./docs/api.md)** - Backend services and endpoints
- **[Component Library](./docs/components.md)** - Shared UI components

## 🚀 Live Applications

<div align="center">

### 🌐 Production Deployments

| Application | URL | Status |
|-------------|-----|--------|
| **🏢 Business** | [business.straydogsyndicationsllc.biz](https://business.straydogsyndicationsllc.biz) | 🚧 Development |
| **🎓 Education** | [education.straydogsyndicationsllc.biz](https://education.straydogsyndicationsllc.biz) | 🚧 Development |
| **💼 Portfolio** | [portfolio.straydogsyndicationsllc.biz](https://portfolio.straydogsyndicationsllc.biz) | 🚧 Development |

</div>

---

## 🏗️ Architecture Overview

This monorepo follows a domain-driven architecture with shared packages and independent applications:

```
learner-files-v3.5/
├── apps/
│   ├── business/          # Business & Professional Development
│   ├── education/         # Academic Learning & Research
│   └── portfolio/         # Personal Projects & Showcase
├── packages/
│   ├── database/          # Supabase client & utilities
│   └── ui/               # Shared UI components
├── .github/workflows/     # CI/CD automation
└── .vscode/              # Development environment
```

## Applications

### 🏢 Business Application
- 🎯 **Purpose**: Professional services and client management
- 💼 **Features**: Client portal, project management, service offerings
- 🔧 **Tech Stack**: React 18, TypeScript, Supabase, Tailwind CSS
- **Port**: 3001
- **URL**: [Business Dashboard](http://localhost:3001)

### 🎓 Education Application  
- 🎯 **Purpose**: Learning management and educational resources
- 📚 **Features**: Course management, progress tracking, interactive learning
- 🔧 **Tech Stack**: React 18, TypeScript, Supabase, Tailwind CSS
- **Port**: 3002
- **URL**: [Education Portal](http://localhost:3002)

### 💼 Portfolio Application
- 🎯 **Purpose**: Personal portfolio and professional showcase
- 🌟 **Features**: Project showcase, skills demonstration, contact management
- 🔧 **Tech Stack**: React 18, TypeScript, Supabase, Tailwind CSS
- **Port**: 3003
- **URL**: [Portfolio Showcase](http://localhost:3003)

## 📦 Shared Packages

### Database Package
- **Supabase Integration**: Type-safe database client
- **CRUD Utilities**: Reusable database operations
- **Error Handling**: Comprehensive error management
- **Type Safety**: Full TypeScript support

### UI Package
- **Component Library**: Shared React components
- **Design System**: Consistent styling and theming
- **Accessibility**: WCAG compliant components
- **Storybook**: Component documentation

## Technology Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development
- **Styling**: Tailwind CSS for utility-first design
- **State Management**: Zustand for lightweight state
- **Routing**: React Router for navigation

### Backend & Database
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Real-time**: Supabase Realtime subscriptions
- **Storage**: Supabase Storage for file management

### AI Integration
- **Provider**: Anthropic Claude API
- **Features**: Content generation, analysis, assistance
- **Error Handling**: Robust fallback mechanisms

### Development Tools
- **Package Manager**: pnpm for efficient dependency management
- **Linting**: ESLint with TypeScript support
- **Formatting**: Prettier for consistent code style
- **Type Checking**: TypeScript strict mode
- **Testing**: Vitest for unit testing

## Quick Start

### Prerequisites
- **Node.js**: Version 22 or higher
- **pnpm**: Version 9 or higher
- **Git**: For version control

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd learner-files-v3.5

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env
# Edit .env with your actual API keys
```

### Environment Setup

Create a `.env` file in the root directory:

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# AI Integration
ANTHROPIC_API_KEY=your_anthropic_api_key

# Development
NODE_ENV=development
```

### Development

```bash
# Start all applications in development mode
pnpm dev

# Or start individual applications
pnpm dev:business    # Business app on :3001
pnpm dev:education   # Education app on :3002
pnpm dev:portfolio   # Portfolio app on :3003

# Build shared packages
pnpm build:packages

# Run type checking
pnpm type-check

# Run linting
pnpm lint
```

## Development Workflow

### VS Code Setup
This project includes comprehensive VS Code configuration:

```bash
# Open the multi-root workspace
code learner-files.code-workspace
```

**Features**:
- Multi-root workspace for monorepo development
- Integrated debugging for all applications
- TypeScript IntelliSense across packages
- ESLint and Prettier integration
- Recommended extensions

### Available Scripts

```bash
# Development
pnpm dev                 # Start all apps
pnpm dev:business        # Start business app
pnpm dev:education       # Start education app
pnpm dev:portfolio       # Start portfolio app

# Building
pnpm build              # Build all projects
pnpm build:packages     # Build shared packages
pnpm build:business     # Build business app
pnpm build:education    # Build education app
pnpm build:portfolio    # Build portfolio app

# Quality Assurance
pnpm type-check         # TypeScript checking
pnpm lint               # ESLint checking
pnpm lint:fix           # Fix ESLint issues
pnpm format             # Prettier formatting

# Testing
pnpm test               # Run all tests
pnpm test:business      # Test business app
pnpm test:education     # Test education app
pnpm test:portfolio     # Test portfolio app

# Utilities
pnpm clean              # Clean build artifacts
pnpm reset              # Reset node_modules
```

## Configuration

### Database Setup

1. **Create Supabase Project**: Set up a new project at [supabase.com](https://supabase.com)
2. **Configure Tables**: Use the provided migration files
3. **Set Environment Variables**: Add Supabase URL and keys to `.env`
4. **Test Connection**: Run `pnpm test:db` to verify setup

### AI Integration Setup

1. **Get Anthropic API Key**: Sign up at [console.anthropic.com](https://console.anthropic.com)
2. **Add to Environment**: Set `ANTHROPIC_API_KEY` in `.env`
3. **Test Integration**: Run `pnpm test:ai` to verify setup

## 🚀 Deployment

### Vercel Deployment (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy all applications
vercel --prod
```

### Manual Deployment

```bash
# Build for production
pnpm build

# Deploy build artifacts from:
# - apps/business/dist
# - apps/education/dist
# - apps/portfolio/dist
```

### CI/CD Pipeline

The project includes comprehensive GitHub Actions workflows:

- **Continuous Integration**: Automated testing and quality checks
- **Deployment**: Automatic deployment to staging and production
- **Dependency Updates**: Weekly automated dependency updates
- **Security Audits**: Regular security vulnerability scanning
- **Release Management**: Automated release creation and changelog generation

See [.github/workflows/README.md](.github/workflows/README.md) for detailed information.

## 📁 Project Structure

```
learner-files-v3.5/
├── apps/
│   ├── business/
│   │   ├── src/
│   │   │   ├── components/     # React components
│   │   │   ├── pages/         # Application pages
│   │   │   ├── hooks/         # Custom React hooks
│   │   │   ├── utils/         # Utility functions
│   │   │   └── types/         # TypeScript types
│   │   ├── public/            # Static assets
│   │   └── package.json       # App dependencies
│   ├── education/             # Same structure as business
│   └── portfolio/             # Same structure as business
├── packages/
│   ├── database/
│   │   ├── src/
│   │   │   ├── client.ts      # Supabase client
│   │   │   ├── types.ts       # Database types
│   │   │   ├── utils.ts       # CRUD utilities
│   │   │   ├── services.ts    # Service layer
│   │   │   └── error-handler.ts # Error handling
│   │   └── package.json
│   └── ui/
│       ├── src/
│       │   ├── components/    # Shared components
│       │   ├── hooks/         # Shared hooks
│       │   └── utils/         # Shared utilities
│       └── package.json
├── .github/
│   └── workflows/             # CI/CD pipelines
├── .vscode/                   # VS Code configuration
├── package.json               # Root dependencies
├── pnpm-workspace.yaml        # Workspace configuration
├── tsconfig.json              # TypeScript configuration
└── README.md                  # This file
```

## 🤝 Contributing

### Development Guidelines

1. **Code Style**: Follow ESLint and Prettier configurations
2. **Type Safety**: Use TypeScript strictly, avoid `any` types
3. **Component Design**: Keep components small and focused
4. **Testing**: Write tests for new features and bug fixes
5. **Documentation**: Update documentation for significant changes

### Git Workflow

```bash
# Create feature branch
git checkout -b feature/your-feature-name

# Make changes and commit
git add .
git commit -m "feat: add your feature description"

# Push and create PR
git push origin feature/your-feature-name
```

### Commit Convention

Use conventional commits for automated changelog generation:

- `feat:` New features
- `fix:` Bug fixes
- `docs:` Documentation changes
- `style:` Code style changes
- `refactor:` Code refactoring
- `test:` Test additions or changes
- `chore:` Maintenance tasks

## 🐛 Troubleshooting

### Common Issues

**Build Failures**:
```bash
# Clear cache and reinstall
pnpm clean
pnpm install
```

**Type Errors**:
```bash
# Run type checking
pnpm type-check
```

**Database Connection Issues**:
```bash
# Verify environment variables
echo $VITE_SUPABASE_URL
echo $VITE_SUPABASE_ANON_KEY
```

**Port Conflicts**:
```bash
# Kill processes on ports
npx kill-port 3001 3002 3003
```

### Getting Help

1. Check the [troubleshooting guide](.github/workflows/README.md#troubleshooting)
2. Review GitHub Issues for similar problems
3. Check the development logs for error details
4. Verify environment variable configuration

## 📄 License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.

## 🙏 Acknowledgments

- **React Team**: For the amazing React framework
- **Vercel**: For Vite and deployment platform
- **Supabase**: For the backend-as-a-service platform
- **Anthropic**: For Claude AI integration
- **Tailwind CSS**: For the utility-first CSS framework

---

**Happy Learning! 🎓✨**

For more information, see the individual application READMEs and package documentation.