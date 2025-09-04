# GitHub Actions Workflows

This directory contains the CI/CD pipeline configuration for the Learner Files monorepo. The workflows are designed to provide comprehensive automation for development, testing, and deployment processes.

## 🔄 Workflows Overview

### 1. CI/CD Pipeline (`ci.yml`)
**Triggers:** Push to `main`/`develop`, Pull Requests

Main workflow that handles:
- **Setup & Caching**: Installs dependencies with intelligent caching
- **Code Quality**: Runs ESLint and TypeScript type checking
- **Package Building**: Builds shared packages first
- **Application Testing**: Builds and tests all applications in parallel
- **Security Audit**: Checks for vulnerabilities
- **Deployment**: 
  - Staging deployment on `develop` branch
  - Production deployment on `main` branch

**Jobs Flow:**
```
setup → [lint-and-typecheck, build-packages, security-audit]
         ↓
      build-and-test-apps (matrix: business, education, portfolio)
         ↓
      [deploy-staging, deploy-production] → notify
```

### 2. Code Quality Check (`quality-check.yml`)
**Triggers:** Pull Requests, Push to `main`/`develop`

Focused on code quality:
- **ESLint Analysis**: With SARIF output for GitHub integration
- **Prettier Formatting**: Ensures consistent code style
- **TypeScript Strict Check**: Validates type safety
- **TODO/FIXME Detection**: Identifies pending work
- **Bundle Size Analysis**: Monitors application size
- **PR Comments**: Automatically comments on PRs with quality reports

### 3. Dependency Updates (`dependency-update.yml`)
**Triggers:** Weekly schedule (Mondays 9 AM UTC), Manual dispatch

Automated maintenance:
- **Dependency Updates**: Updates all packages to latest versions
- **Compatibility Testing**: Runs type checking and linting
- **Automated PRs**: Creates pull requests for dependency updates
- **Security Monitoring**: Generates security audit reports

### 4. Release Management (`release.yml`)
**Triggers:** Git tags (`v*.*.*`), Manual dispatch

Release automation:
- **Changelog Generation**: Automatically generates release notes
- **Asset Creation**: Creates source and build archives
- **GitHub Releases**: Creates releases with proper versioning
- **Production Deployment**: Deploys stable releases
- **Release Notifications**: Provides deployment status updates

## 🔧 Setup Requirements

### Required Secrets
Configure these secrets in your GitHub repository:

```bash
# Vercel Deployment
VERCEL_TOKEN=your_vercel_token
VERCEL_ORG_ID=your_vercel_org_id
VERCEL_PROJECT_ID=your_vercel_project_id

# GitHub Token (usually auto-provided)
GITHUB_TOKEN=github_token
```

### Environment Setup
- **Node.js**: Version 22 (LTS)
- **Package Manager**: pnpm v9
- **Deployment**: Vercel

## 📋 Workflow Features

### Caching Strategy
- **pnpm Store**: Caches package installations
- **Build Artifacts**: Caches compiled packages and applications
- **Dependency Lock**: Uses `pnpm-lock.yaml` for cache keys

### Parallel Execution
- Applications build in parallel using matrix strategy
- Independent job execution where possible
- Optimized dependency chains

### Error Handling
- Graceful failure handling with `continue-on-error`
- Comprehensive error reporting
- Artifact uploads for debugging

### Security
- Regular dependency audits
- Automated vulnerability scanning
- SARIF integration for security findings

## 🚀 Usage

### Development Workflow
1. **Feature Development**: Work on feature branches
2. **Pull Request**: Create PR to `develop`
3. **Quality Checks**: Automated quality and security checks run
4. **Review & Merge**: Code review and merge to `develop`
5. **Staging Deployment**: Automatic deployment to staging

### Release Workflow
1. **Merge to Main**: Merge `develop` to `main`
2. **Production Deployment**: Automatic deployment to production
3. **Tag Release**: Create version tag for formal release
4. **Release Creation**: Automated release with changelog

### Manual Operations
- **Dependency Updates**: Can be triggered manually
- **Release Creation**: Can be triggered with custom version
- **Quality Checks**: Run on every PR automatically

## 📊 Monitoring & Reports

### Artifacts Generated
- **Security Audit Reports**: Weekly security assessments
- **Code Quality Reports**: Per-PR quality analysis
- **Bundle Analysis**: Application size monitoring
- **Release Assets**: Source and build archives

### GitHub Integration
- **Status Checks**: Required checks for PR merging
- **SARIF Upload**: Security findings in GitHub Security tab
- **PR Comments**: Automated quality feedback
- **Release Notes**: Generated changelogs

## 🔍 Troubleshooting

### Common Issues

**Build Failures:**
- Check TypeScript errors in logs
- Verify dependency compatibility
- Review environment variable setup

**Deployment Issues:**
- Verify Vercel secrets are configured
- Check build output exists
- Review deployment logs

**Cache Issues:**
- Clear workflow caches if needed
- Check `pnpm-lock.yaml` changes
- Verify cache key generation

### Debug Steps
1. Check workflow logs in GitHub Actions tab
2. Review artifact uploads for detailed reports
3. Verify secrets and environment configuration
4. Test locally with same Node.js/pnpm versions

## 📝 Customization

### Adding New Applications
1. Update matrix strategy in `ci.yml`
2. Add new build tasks in `tasks.json`
3. Update deployment configuration

### Modifying Quality Checks
1. Edit ESLint rules in project configuration
2. Update Prettier settings
3. Adjust TypeScript strict mode settings

### Changing Deployment Targets
1. Update deployment actions
2. Configure new secrets
3. Modify environment configurations

For more information, see the individual workflow files and their inline comments.