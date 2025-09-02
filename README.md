# StrayDog Syndications Portfolio - Professional Showcase

**From Kitchen to Code** - Professional portfolio showcasing Eric "Hunter" Petross's transition from 20 years in fine dining to software development and AI/ML engineering.

🎯 **Status**: DEPLOYMENT READY - TypeScript Clean, Build Optimized, GitHub Actions Fixed

## 🚀 Live Demo

- **GitHub Pages**: [https://straydogsyn.github.io/Learner-Files-v3.5/](https://straydogsyn.github.io/Learner-Files-v3.5/)
- **Main Website**: [https://straydog-syndications-llc.com](https://straydog-syndications-llc.com)

## 📋 Overview

This portfolio represents a clean, optimized, and deployment-ready showcase of professional work and skills. It features:

- **Modern Design**: Clean, responsive layout with smooth animations
- **Performance Optimized**: Lightweight HTML/CSS/JS with no build dependencies
- **SEO Ready**: Comprehensive meta tags and structured data
- **GitHub Pages Compatible**: Simplified deployment workflow
- **AI Performance Monitoring**: Integrated Lighthouse automation scripts

## 🛠️ Quick Setup

### Prerequisites

- Node.js 18+ and npm 8+
- Git
- PowerShell (for AI automation scripts)

### Installation

```bash
# Clone the repository
git clone https://github.com/StrayDogSyn/Learner-Files-v3.5.git
cd Learner-Files-v3.5

# Install dependencies (optional - for development server)
npm install

# Start development server
npm run dev
```

### Deployment to GitHub Pages

1. **Enable GitHub Pages**:
   - Go to your repository settings
   - Navigate to "Pages" section
   - Select "GitHub Actions" as source

2. **Push to main branch**:
   ```bash
   git add .
   git commit -m "Deploy optimized portfolio"
   git push origin main
   ```

3. **Automatic Deployment**:
   - GitHub Actions will automatically deploy your site
   - Check the "Actions" tab for deployment status
   - Site will be available at: `https://yourusername.github.io/repository-name/`

## 📁 Project Structure

```
├── index.html              # Main portfolio page (optimized)
├── assets/
│   └── brand/              # Logo and branding assets
├── scripts/                # AI automation scripts
│   ├── performance-ai-automation.ps1
│   ├── behavior-ai-automation.ps1
│   ├── conversion-ai-automation.ps1
│   └── technical-debt-ai-automation.ps1
├── .github/
│   └── workflows/
│       └── deploy.yml      # GitHub Pages deployment
├── package.json            # Simplified dependencies
└── README.md              # This file
```

## 🎯 Features

### Portfolio Sections

- **Hero Section**: Professional introduction with call-to-action
- **About**: Personal story and professional journey
- **Skills**: Technical expertise organized by category
- **Projects**: Featured work with live links and descriptions
- **Contact**: Multiple ways to connect

### Technical Features

- **Responsive Design**: Mobile-first approach
- **Smooth Scrolling**: Enhanced navigation experience
- **Intersection Observer**: Scroll-triggered animations
- **Fallback Images**: SVG placeholders for missing assets
- **Performance Optimized**: Minimal dependencies, fast loading

## 🤖 AI Performance Automation

Integrated AI-powered analysis scripts for continuous optimization:

```bash
# Run individual analyses
npm run ai:performance      # Lighthouse audit + AI recommendations
npm run ai:behavior         # User behavior analysis
npm run ai:conversion       # Conversion optimization
npm run ai:technical-debt   # Code quality assessment

# Run complete analysis suite
npm run ai:full-analysis
```

### Prerequisites for AI Scripts

```bash
# Install Lighthouse globally
npm install -g lighthouse

# Ensure PowerShell execution policy allows scripts
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

## 🎨 Customization

### Brand Colors

Update CSS custom properties in `index.html`:

```css
:root {
  --primary: #355E3B;        /* Forest Green */
  --secondary: #50C878;      /* Emerald Green */
  --accent: #C0C0C0;         /* Silver */
  /* ... */
}
```

### Content Updates

1. **Personal Information**: Update hero section and about content
2. **Skills**: Modify skill categories and tags
3. **Projects**: Add/remove project cards with your work
4. **Contact**: Update social links and contact information

### Assets

Replace brand assets in `assets/brand/`:
- `mainLogo.png` - Main profile/brand image
- `gearLogo.png` - Navigation logo
- `favicon.png` - Browser favicon

## 📊 Performance Monitoring

The portfolio includes automated performance monitoring:

- **Lighthouse Audits**: Performance, accessibility, SEO scores
- **Core Web Vitals**: LCP, FID, CLS measurements
- **Bundle Analysis**: Asset size optimization
- **AI Recommendations**: Intelligent optimization suggestions

Reports are generated in the root directory with timestamps.

## 🔧 Development

### Local Development

```bash
# Start live server (auto-reload)
npm run dev

# Preview production build
npm run preview
```

### Code Quality

- **HTML5 Semantic**: Proper document structure
- **CSS3 Modern**: Flexbox, Grid, Custom Properties
- **Vanilla JavaScript**: No framework dependencies
- **Progressive Enhancement**: Works without JavaScript

## 🚀 Deployment Options

### GitHub Pages (Recommended)
- Automatic deployment via GitHub Actions
- Free hosting for public repositories
- Custom domain support

### Alternative Platforms
- **Netlify**: Drag and drop deployment
- **Vercel**: Git-based deployment
- **Surge.sh**: Command-line deployment

## 📈 SEO Optimization

- **Meta Tags**: Complete Open Graph and Twitter Card support
- **Structured Data**: JSON-LD for search engines
- **Semantic HTML**: Proper heading hierarchy
- **Performance**: Fast loading times
- **Mobile-Friendly**: Responsive design

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Contact

**Eric "Hunter" Petross**
- Email: [hello@straydog-syndications-llc.com](mailto:hello@straydog-syndications-llc.com)
- GitHub: [@StrayDogSyn](https://github.com/StrayDogSyn)
- LinkedIn: [eric-petross](https://linkedin.com/in/eric-petross)
- Website: [straydog-syndications-llc.com](https://straydog-syndications-llc.com)

---

**StrayDog Syndications** - Transforming passion into innovation, one line of code at a time.
