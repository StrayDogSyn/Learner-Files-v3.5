# Marvel Quiz Game - Deployment Guide

## Overview
This guide covers the deployment of the Marvel Quiz Game to GitHub Pages with full PWA functionality.

## Prerequisites
- Marvel API keys from [Marvel Developer Portal](https://developer.marvel.com/)
- GitHub repository with Pages enabled
- Node.js 18+ for local development

## Deployment Steps

### 1. Environment Configuration
1. Copy `.env.example` to `.env`
2. Fill in your Marvel API keys:
   ```bash
   VITE_MARVEL_PUBLIC_KEY=your_public_key
   MARVEL_PRIVATE_KEY=your_private_key
   ```

### 2. Local Testing
```bash
# Test the application locally
python -m http.server 8080
# Visit: http://localhost:8080
```

### 3. GitHub Pages Deployment
The deployment is automated via GitHub Actions:

1. Push changes to the `main` branch
2. GitHub Actions will:
   - Build the main portfolio
   - Copy Marvel Quiz Game files to `dist/marvel-quiz-game/`
   - Verify PWA files (sw.js, manifest.json, env-loader.js)
   - Deploy to GitHub Pages

### 4. Post-Deployment Verification
After deployment, verify:
- [ ] Game loads at `https://yourusername.github.io/Learner-Files-v3.5/marvel-quiz-game/`
- [ ] PWA features work (offline mode, install prompt)
- [ ] Marvel API integration functions
- [ ] Service Worker caches resources

## Security Notes

### API Key Security
- **Public Key**: Safe to expose in client-side code
- **Private Key**: Should be handled server-side in production
- Current implementation uses public key only for GitHub Pages compatibility

### Production Recommendations
For enhanced security in production:
1. Implement server-side API proxy
2. Use environment variables for sensitive data
3. Enable CORS restrictions
4. Implement rate limiting

## PWA Features

### Service Worker (sw.js)
- Caches static assets and API responses
- Enables offline functionality
- Implements cache strategies for performance

### Web App Manifest (manifest.json)
- Enables "Add to Home Screen" functionality
- Defines app appearance and behavior
- Configures splash screen and icons

### Environment Loader (env-loader.js)
- Loads configuration variables
- Provides fallback for GitHub Pages deployment
- Handles feature flags and performance settings

## Troubleshooting

### Common Issues
1. **404 for PWA files**: Ensure files are copied to dist during build
2. **API errors**: Verify Marvel API keys are correct
3. **Cache issues**: Clear browser cache or update service worker version

### Debug Mode
Enable debug mode by setting:
```javascript
VITE_DEBUG_MODE=true
VITE_LOG_LEVEL=debug
```

## Performance Optimization

### Enabled Features
- Image lazy loading
- API response caching
- Static asset caching
- Glassmorphic UI with optimized CSS
- Responsive design with mobile-first approach

### Monitoring
- Service Worker performance metrics
- API response times
- Cache hit rates
- User interaction analytics (if enabled)

## Support
For issues or questions:
1. Check browser console for errors
2. Verify network requests in DevTools
3. Test PWA functionality in supported browsers
4. Review GitHub Actions logs for deployment issues