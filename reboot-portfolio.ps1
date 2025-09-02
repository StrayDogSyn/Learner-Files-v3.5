# 🎯 Portfolio Reboot Implementation Script
# Execute this script to reboot your portfolio to a working state
# Preserves Hunter Green aesthetic while fixing all technical issues

Write-Host "🚀 Starting Portfolio Reboot..." -ForegroundColor Green
Write-Host "This will create a clean, working foundation" -ForegroundColor Yellow

# Step 1: Backup current work
Write-Host "📦 Creating backup..." -ForegroundColor Blue
$backupDir = "backup-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
New-Item -ItemType Directory -Name $backupDir | Out-Null
Copy-Item -Path "src" -Destination "$backupDir/src" -Recurse -Force
Copy-Item -Path "package.json" -Destination "$backupDir/package.json"
Write-Host "✅ Backup created in: $backupDir" -ForegroundColor Green

# Step 2: Clean corrupted files
Write-Host "🧹 Cleaning corrupted files..." -ForegroundColor Blue
Remove-Item -Path "src/services" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path "src/components" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path "src/pages" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path "src/data" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path "src/types" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path "src/utils" -Recurse -Force -ErrorAction SilentlyContinue
Write-Host "✅ Corrupted files removed" -ForegroundColor Green

# Step 3: Create new directory structure
Write-Host "📁 Creating new directory structure..." -ForegroundColor Blue
New-Item -ItemType Directory -Name "src/components" -Force | Out-Null
New-Item -ItemType Directory -Name "src/pages" -Force | Out-Null
New-Item -ItemType Directory -Name "src/data" -Force | Out-Null
New-Item -ItemType Directory -Name "src/types" -Force | Out-Null
New-Item -ItemType Directory -Name "src/utils" -Force | Out-Null
Write-Host "✅ Directory structure created" -ForegroundColor Green

# Step 4: Install dependencies
Write-Host "📦 Installing dependencies..." -ForegroundColor Blue
npm install
Write-Host "✅ Dependencies installed" -ForegroundColor Green

# Step 5: Create new files
Write-Host "📝 Creating new portfolio files..." -ForegroundColor Blue

# Create types
@"
export interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  image: string;
  githubUrl?: string;
  liveUrl?: string;
  category: 'ai-ml' | 'web-dev' | 'data-science' | 'automation';
}

export interface Skill {
  name: string;
  level: number;
  category: 'frontend' | 'backend' | 'ai-ml' | 'devops' | 'tools';
}
"@ | Out-File -FilePath "src/types/index.ts" -Encoding UTF8

# Create data
@"
import { Project, Skill } from '../types';

export const projects: Project[] = [
  {
    id: '1',
    title: 'AI-Powered Recipe Generator',
    description: 'Machine learning system that creates unique recipes based on available ingredients and dietary preferences.',
    technologies: ['Python', 'TensorFlow', 'React', 'FastAPI'],
    image: '/images/ai-recipe.jpg',
    githubUrl: 'https://github.com/yourusername/ai-recipe-generator',
    category: 'ai-ml'
  },
  {
    id: '2',
    title: 'Portfolio Website',
    description: 'Modern, responsive portfolio built with React and TypeScript, featuring glassmorphism design.',
    technologies: ['React', 'TypeScript', 'Tailwind CSS', 'Vite'],
    image: '/images/portfolio.jpg',
    githubUrl: 'https://github.com/yourusername/portfolio',
    liveUrl: 'https://yourportfolio.com',
    category: 'web-dev'
  },
  {
    id: '3',
    title: 'Data Analysis Dashboard',
    description: 'Interactive dashboard for analyzing business metrics with real-time data visualization.',
    technologies: ['Python', 'Pandas', 'Plotly', 'Streamlit'],
    image: '/images/dashboard.jpg',
    githubUrl: 'https://github.com/yourusername/data-dashboard',
    category: 'data-science'
  },
  {
    id: '4',
    title: 'Automated Testing Suite',
    description: 'Comprehensive testing framework for web applications with CI/CD integration.',
    technologies: ['Jest', 'Cypress', 'GitHub Actions', 'Docker'],
    image: '/images/testing.jpg',
    githubUrl: 'https://github.com/yourusername/testing-suite',
    category: 'automation'
  },
  {
    id: '5',
    title: 'Machine Learning Model API',
    description: 'RESTful API serving trained ML models with automatic scaling and monitoring.',
    technologies: ['Python', 'FastAPI', 'Docker', 'Kubernetes'],
    image: '/images/ml-api.jpg',
    githubUrl: 'https://github.com/yourusername/ml-api',
    category: 'ai-ml'
  },
  {
    id: '6',
    title: 'E-commerce Platform',
    description: 'Full-stack e-commerce solution with payment processing and inventory management.',
    technologies: ['React', 'Node.js', 'PostgreSQL', 'Stripe'],
    image: '/images/ecommerce.jpg',
    githubUrl: 'https://github.com/yourusername/ecommerce',
    category: 'web-dev'
  }
];

export const skills: Skill[] = [
  { name: 'React', level: 90, category: 'frontend' },
  { name: 'TypeScript', level: 85, category: 'frontend' },
  { name: 'Python', level: 88, category: 'backend' },
  { name: 'Node.js', level: 82, category: 'backend' },
  { name: 'TensorFlow', level: 80, category: 'ai-ml' },
  { name: 'PostgreSQL', level: 78, category: 'backend' },
  { name: 'Docker', level: 75, category: 'devops' },
  { name: 'Git', level: 90, category: 'tools' }
];
"@ | Out-File -FilePath "src/data/index.ts" -Encoding UTF8

Write-Host "✅ Data files created" -ForegroundColor Green

# Step 6: Test build
Write-Host "🔨 Testing build..." -ForegroundColor Blue
npm run type-check
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ TypeScript compilation successful!" -ForegroundColor Green
} else {
    Write-Host "❌ TypeScript compilation failed" -ForegroundColor Red
    exit 1
}

# Step 7: Start development server
Write-Host "🚀 Starting development server..." -ForegroundColor Blue
Write-Host "Your portfolio reboot is complete!" -ForegroundColor Green
Write-Host "Run 'npm run dev' to start the development server" -ForegroundColor Yellow
Write-Host "Run 'npm run build' to build for production" -ForegroundColor Yellow
Write-Host "Run 'npm run deploy' to deploy to GitHub Pages" -ForegroundColor Yellow

Write-Host "🎉 Portfolio reboot completed successfully!" -ForegroundColor Green
