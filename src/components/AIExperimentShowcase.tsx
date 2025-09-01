import React, { useState, useEffect } from 'react';
import { Brain, Github, ExternalLink, Play, Code, Database, Zap, TrendingUp, Eye, Star, GitBranch } from 'lucide-react';
import { useAnalytics } from '../hooks/useAnalytics';
import BrandWatermark from './BrandWatermark';

interface Experiment {
  id: string;
  title: string;
  description: string;
  category: 'Machine Learning' | 'Deep Learning' | 'NLP' | 'Computer Vision' | 'Data Science' | 'AI Tools';
  technologies: string[];
  githubUrl: string;
  demoUrl?: string;
  imageUrl: string;
  status: 'Active' | 'Completed' | 'In Progress';
  metrics: {
    accuracy?: string;
    performance?: string;
    dataSize?: string;
    modelSize?: string;
  };
  highlights: string[];
  dateCreated: string;
  lastUpdated: string;
  stars: number;
  forks: number;
  featured: boolean;
}

const experiments: Experiment[] = [
  {
    id: 'sentiment-analysis-nlp',
    title: 'Real-time Sentiment Analysis Pipeline',
    description: 'A comprehensive NLP pipeline that analyzes sentiment in real-time social media streams using transformer models and custom preprocessing techniques.',
    category: 'NLP',
    technologies: ['Python', 'PyTorch', 'Transformers', 'FastAPI', 'Redis', 'Docker'],
    githubUrl: 'https://github.com/StrayDogSyn/sentiment-analysis-pipeline',
    // demoUrl: 'https://sentiment-demo.straydogsyn.dev', // Demo temporarily unavailable
    imageUrl: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=modern%20dashboard%20showing%20real-time%20sentiment%20analysis%20with%20colorful%20charts%20and%20social%20media%20feeds%2C%20dark%20theme%2C%20professional%20UI%2C%20data%20visualization&image_size=landscape_16_9',
    status: 'Active',
    metrics: {
      accuracy: '94.2%',
      performance: '1.2ms avg',
      dataSize: '2.3M tweets',
      modelSize: '110M params'
    },
    highlights: [
      'Custom BERT fine-tuning for domain-specific sentiment',
      'Real-time processing with sub-second latency',
      'Scalable microservices architecture',
      'Interactive dashboard with live updates'
    ],
    dateCreated: '2024-01-10',
    lastUpdated: '2024-01-25',
    stars: 127,
    forks: 23,
    featured: true
  },
  {
    id: 'computer-vision-food',
    title: 'Culinary Computer Vision: Food Recognition & Analysis',
    description: 'Advanced computer vision system that identifies dishes, estimates nutritional content, and provides cooking recommendations based on visual analysis.',
    category: 'Computer Vision',
    technologies: ['TensorFlow', 'OpenCV', 'React', 'Node.js', 'MongoDB', 'AWS S3'],
    githubUrl: 'https://github.com/StrayDogSyn/culinary-cv-system',
    // demoUrl: 'https://food-cv.straydogsyn.dev', // Demo temporarily unavailable
    imageUrl: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=sophisticated%20food%20recognition%20interface%20showing%20analyzed%20dishes%20with%20nutritional%20data%2C%20ingredient%20breakdown%2C%20modern%20culinary%20app%20design%2C%20professional%20photography&image_size=landscape_16_9',
    status: 'Completed',
    metrics: {
      accuracy: '91.7%',
      performance: '340ms avg',
      dataSize: '50K images',
      modelSize: '23M params'
    },
    highlights: [
      'Custom CNN architecture for food classification',
      'Nutritional analysis using computer vision',
      'Integration with culinary knowledge base',
      'Mobile-optimized progressive web app'
    ],
    dateCreated: '2023-11-15',
    lastUpdated: '2024-01-08',
    stars: 89,
    forks: 15,
    featured: true
  },
  {
    id: 'predictive-analytics-ml',
    title: 'Predictive Analytics for Restaurant Operations',
    description: 'Machine learning system that predicts customer demand, optimizes inventory, and forecasts revenue using historical data and external factors.',
    category: 'Machine Learning',
    technologies: ['Scikit-learn', 'Pandas', 'NumPy', 'Plotly', 'Flask', 'PostgreSQL'],
    githubUrl: 'https://github.com/StrayDogSyn/restaurant-predictive-analytics',
    imageUrl: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=advanced%20analytics%20dashboard%20for%20restaurant%20operations%20with%20predictive%20charts%2C%20inventory%20forecasting%2C%20revenue%20predictions%2C%20professional%20business%20intelligence%20interface&image_size=landscape_16_9',
    status: 'In Progress',
    metrics: {
      accuracy: '87.3%',
      performance: '2.1s avg',
      dataSize: '180K records',
      modelSize: '5.2M params'
    },
    highlights: [
      'Multi-variate time series forecasting',
      'Feature engineering with domain expertise',
      'Ensemble methods for robust predictions',
      'Real-time model retraining pipeline'
    ],
    dateCreated: '2023-12-01',
    lastUpdated: '2024-01-20',
    stars: 45,
    forks: 8,
    featured: false
  },
  {
    id: 'ai-code-assistant',
    title: 'AI-Powered Code Review Assistant',
    description: 'Intelligent code review system that analyzes pull requests, suggests improvements, and identifies potential bugs using large language models.',
    category: 'AI Tools',
    technologies: ['OpenAI API', 'TypeScript', 'Next.js', 'Prisma', 'GitHub API', 'Vercel'],
    githubUrl: 'https://github.com/StrayDogSyn/ai-code-reviewer',
    // demoUrl: 'https://code-review-ai.straydogsyn.dev', // Demo temporarily unavailable
    imageUrl: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=modern%20code%20review%20interface%20with%20AI%20suggestions%2C%20syntax%20highlighting%2C%20improvement%20recommendations%2C%20developer%20tools%20aesthetic%2C%20dark%20theme&image_size=landscape_16_9',
    status: 'Active',
    metrics: {
      accuracy: '89.1%',
      performance: '850ms avg',
      dataSize: '25K reviews',
      modelSize: 'GPT-4 API'
    },
    highlights: [
      'Context-aware code analysis',
      'Integration with GitHub workflows',
      'Custom prompting for code quality',
      'Learning from team coding standards'
    ],
    dateCreated: '2024-01-05',
    lastUpdated: '2024-01-24',
    stars: 203,
    forks: 34,
    featured: true
  }
];

const AIExperimentShowcase: React.FC = () => {
  const [selectedExperiment, setSelectedExperiment] = useState<Experiment | null>(null);
  const [filter, setFilter] = useState<'all' | 'featured' | 'active' | 'completed'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const { trackContentView, trackContentInteraction } = useAnalytics();

  useEffect(() => {
    trackContentView('ai-experiments', 'showcase-section');
  }, [trackContentView]);

  const filteredExperiments = experiments.filter(experiment => {
    const statusMatch = filter === 'all' || 
      (filter === 'featured' && experiment.featured) ||
      (filter === 'active' && experiment.status === 'Active') ||
      (filter === 'completed' && experiment.status === 'Completed');
    
    const categoryMatch = categoryFilter === 'all' || experiment.category === categoryFilter;
    
    return statusMatch && categoryMatch;
  });

  const handleExperimentClick = (experiment: Experiment) => {
    setSelectedExperiment(experiment);
    trackContentInteraction('experiment-view', experiment.id);
  };

  const handleGitHubClick = (url: string, experimentId: string) => {
    trackContentInteraction('github-click', experimentId);
    window.open(url, '_blank');
  };

  const handleDemoClick = (url: string, experimentId: string) => {
    trackContentInteraction('demo-click', experimentId);
    window.open(url, '_blank');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'text-green-400 bg-green-400/10';
      case 'Completed': return 'text-blue-400 bg-blue-400/10';
      case 'In Progress': return 'text-yellow-400 bg-yellow-400/10';
      default: return 'text-gray-400 bg-gray-400/10';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Machine Learning': return Brain;
      case 'Deep Learning': return Zap;
      case 'NLP': return Code;
      case 'Computer Vision': return Eye;
      case 'Data Science': return Database;
      case 'AI Tools': return TrendingUp;
      default: return Brain;
    }
  };

  const categories = ['all', ...Array.from(new Set(experiments.map(exp => exp.category)))];

  return (
    <section id="ai-experiments" className="py-20 relative z-10">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Brain className="w-8 h-8 text-[var(--brand-primary)]" />
            <Code className="w-8 h-8 text-[var(--brand-secondary)]" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-6">
            AI & ML Experiments
          </h2>
          <p className="text-xl text-[var(--text-secondary)] max-w-3xl mx-auto leading-relaxed">
            Exploring the frontiers of artificial intelligence and machine learning. 
            From computer vision to natural language processing, these experiments showcase 
            practical applications and innovative approaches to real-world problems.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-col lg:flex-row gap-6 mb-12">
          {/* Status Filters */}
          <div className="flex flex-wrap gap-3">
            {[
              { key: 'all', label: 'All Projects', icon: Brain },
              { key: 'featured', label: 'Featured', icon: Star },
              { key: 'active', label: 'Active', icon: Play },
              { key: 'completed', label: 'Completed', icon: TrendingUp }
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
onClick={() => setFilter(key as 'all' | 'featured' | 'active' | 'completed')}
                className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 ${
                  filter === key
                    ? 'bg-[var(--brand-primary)] text-white shadow-lg'
                    : 'bg-[var(--glass-bg)] border border-[var(--glass-border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--brand-primary)]'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="font-medium">{label}</span>
              </button>
            ))}
          </div>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            aria-label="Filter experiments by category"
            className="bg-[var(--glass-bg)] border border-[var(--glass-border)] text-[var(--text-primary)] px-4 py-2 rounded-full focus:outline-none focus:border-[var(--brand-primary)] transition-colors"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category === 'all' ? 'All Categories' : category}
              </option>
            ))}
          </select>
        </div>

        {/* Experiments Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {filteredExperiments.map((experiment) => {
            const CategoryIcon = getCategoryIcon(experiment.category);
            
            return (
              <div
                key={experiment.id}
                onClick={() => handleExperimentClick(experiment)}
                className="group bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:border-[var(--brand-primary)] hover:shadow-xl hover:shadow-[var(--brand-primary)]/20 hover:-translate-y-2"
              >
                {/* Experiment Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={experiment.imageUrl}
                    alt={experiment.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  
                  {/* Status Badge */}
                  <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(experiment.status)}`}>
                    {experiment.status}
                  </div>
                  
                  {/* Featured Badge */}
                  {experiment.featured && (
                    <div className="absolute top-4 right-4 bg-[var(--brand-accent)] text-white px-2 py-1 rounded-full text-xs font-semibold">
                      Featured
                    </div>
                  )}
                  
                  {/* Category Icon */}
                  <div className="absolute bottom-4 left-4">
                    <CategoryIcon className="w-6 h-6 text-white" />
                  </div>
                </div>

                {/* Experiment Content */}
                <div className="p-6">
                  {/* Title and Category */}
                  <div className="mb-3">
                    <h3 className="text-xl font-bold text-[var(--text-primary)] mb-1 group-hover:text-[var(--brand-primary)] transition-colors">
                      {experiment.title}
                    </h3>
                    <span className="text-sm text-[var(--brand-secondary)] font-medium">
                      {experiment.category}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-[var(--text-secondary)] mb-4 line-clamp-3">
                    {experiment.description}
                  </p>

                  {/* Technologies */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {experiment.technologies.slice(0, 3).map((tech) => (
                      <span
                        key={tech}
                        className="bg-[var(--border-secondary)] text-[var(--text-muted)] text-xs px-2 py-1 rounded-full"
                      >
                        {tech}
                      </span>
                    ))}
                    {experiment.technologies.length > 3 && (
                      <span className="text-[var(--text-muted)] text-xs px-2 py-1">
                        +{experiment.technologies.length - 3} more
                      </span>
                    )}
                  </div>

                  {/* Metrics */}
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    {experiment.metrics.accuracy && (
                      <div className="text-center">
                        <div className="text-lg font-bold text-[var(--brand-success)]">
                          {experiment.metrics.accuracy}
                        </div>
                        <div className="text-xs text-[var(--text-muted)]">
                          Accuracy
                        </div>
                      </div>
                    )}
                    {experiment.metrics.performance && (
                      <div className="text-center">
                        <div className="text-lg font-bold text-[var(--brand-primary)]">
                          {experiment.metrics.performance}
                        </div>
                        <div className="text-xs text-[var(--text-muted)]">
                          Response
                        </div>
                      </div>
                    )}
                  </div>

                  {/* GitHub Stats */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-[var(--text-muted)]">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4" />
                        <span>{experiment.stars}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <GitBranch className="w-4 h-4" />
                        <span>{experiment.forks}</span>
                      </div>
                    </div>
                    <div className="text-xs text-[var(--text-muted)]">
                      Updated {new Date(experiment.lastUpdated).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-2xl p-8 max-w-2xl mx-auto">
            <Brain className="w-12 h-12 text-[var(--brand-primary)] mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-4">
              Continuous Innovation
            </h3>
            <p className="text-[var(--text-secondary)] mb-6">
              These experiments represent ongoing exploration in AI and machine learning. 
              Each project pushes boundaries and explores new possibilities in artificial intelligence.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button 
                onClick={() => window.open('https://github.com/StrayDogSyn', '_blank')}
                className="flex items-center gap-2 bg-[var(--brand-primary)] text-white px-6 py-3 rounded-full font-semibold hover:bg-[var(--brand-secondary)] transition-colors"
              >
                <Github className="w-5 h-5" />
                View All Projects
              </button>
              <button className="flex items-center gap-2 border border-[var(--brand-primary)] text-[var(--brand-primary)] px-6 py-3 rounded-full font-semibold hover:bg-[var(--brand-primary)] hover:text-white transition-colors">
                <Brain className="w-5 h-5" />
                Collaborate
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Experiment Detail Modal */}
      {selectedExperiment && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-2xl max-w-6xl max-h-[90vh] overflow-y-auto relative">
            <BrandWatermark variant="text" opacity={0.025} size="large" position="center" />
            {/* Modal Header */}
            <div className="sticky top-0 bg-[var(--glass-bg)] border-b border-[var(--glass-border)] p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(selectedExperiment.status)}`}>
                      {selectedExperiment.status}
                    </span>
                    <span className="text-sm text-[var(--brand-secondary)] font-medium">
                      {selectedExperiment.category}
                    </span>
                  </div>
                  <h2 className="text-3xl font-bold text-[var(--text-primary)] mb-2">
                    {selectedExperiment.title}
                  </h2>
                  <div className="flex items-center gap-4 text-sm text-[var(--text-muted)]">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4" />
                      <span>{selectedExperiment.stars} stars</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <GitBranch className="w-4 h-4" />
                      <span>{selectedExperiment.forks} forks</span>
                    </div>
                    <span>Updated {new Date(selectedExperiment.lastUpdated).toLocaleDateString()}</span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedExperiment(null)}
                  aria-label="Close experiment details"
                  className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors ml-4"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <div className="grid lg:grid-cols-2 gap-8">
                {/* Left Column */}
                <div className="space-y-6">
                  {/* Project Image */}
                  <div className="rounded-xl overflow-hidden">
                    <img
                      src={selectedExperiment.imageUrl}
                      alt={selectedExperiment.title}
                      className="w-full h-64 object-cover"
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <h3 className="text-xl font-bold text-[var(--text-primary)] mb-3">
                      Project Overview
                    </h3>
                    <p className="text-[var(--text-secondary)] leading-relaxed">
                      {selectedExperiment.description}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-4">
                    <button
                      onClick={() => handleGitHubClick(selectedExperiment.githubUrl, selectedExperiment.id)}
                      className="flex items-center gap-2 bg-[var(--brand-primary)] text-white px-6 py-3 rounded-full font-semibold hover:bg-[var(--brand-secondary)] transition-colors"
                    >
                      <Github className="w-5 h-5" />
                      View Code
                    </button>
                    {selectedExperiment.demoUrl && (
                      <button
                        onClick={() => handleDemoClick(selectedExperiment.demoUrl!, selectedExperiment.id)}
                        className="flex items-center gap-2 border border-[var(--brand-primary)] text-[var(--brand-primary)] px-6 py-3 rounded-full font-semibold hover:bg-[var(--brand-primary)] hover:text-white transition-colors"
                      >
                        <ExternalLink className="w-5 h-5" />
                        Live Demo
                      </button>
                    )}
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  {/* Performance Metrics */}
                  <div>
                    <h3 className="text-xl font-bold text-[var(--text-primary)] mb-3">
                      Performance Metrics
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      {Object.entries(selectedExperiment.metrics).map(([key, value]) => (
                        <div key={key} className="bg-[var(--border-secondary)] rounded-lg p-4 text-center">
                          <div className="text-2xl font-bold text-[var(--brand-primary)] mb-1">
                            {value}
                          </div>
                          <div className="text-sm text-[var(--text-muted)] capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Technologies */}
                  <div>
                    <h3 className="text-xl font-bold text-[var(--text-primary)] mb-3">
                      Technologies Used
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedExperiment.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] px-3 py-1 rounded-full text-sm font-medium"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Key Highlights */}
                  <div>
                    <h3 className="text-xl font-bold text-[var(--text-primary)] mb-3">
                      Key Highlights
                    </h3>
                    <ul className="space-y-2">
                      {selectedExperiment.highlights.map((highlight, index) => (
                        <li key={index} className="flex items-start gap-3 text-[var(--text-secondary)]">
                          <span className="w-2 h-2 bg-[var(--brand-primary)] rounded-full mt-2 flex-shrink-0" />
                          <span>{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default AIExperimentShowcase;