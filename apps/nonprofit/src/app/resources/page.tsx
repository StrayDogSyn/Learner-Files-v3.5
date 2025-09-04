'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Scale, 
  BookOpen, 
  Download, 
  ArrowLeft, 
  Search,
  Filter,
  FileText,
  Video,
  Headphones,
  Users,
  ExternalLink,
  Star
} from 'lucide-react';
import { useAIOrchestrator } from '@straydog/ai-orchestrator';
import Link from 'next/link';

export default function ResourcesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedResource, setSelectedResource] = useState<string | null>(null);
  const { generateResponse, isLoading } = useAIOrchestrator();

  const handleResourceAnalysis = async (resource: string) => {
    setSelectedResource(resource);
    try {
      await generateResponse(
        `Provide insights and summary for the justice reform resource: ${resource}`,
        'justice-reform'
      );
    } catch (error) {
      console.error('Analysis error:', error);
    }
  };

  const categories = [
    { id: 'all', name: 'All Resources', count: 24 },
    { id: 'guides', name: 'Legal Guides', count: 8 },
    { id: 'research', name: 'Research Reports', count: 6 },
    { id: 'training', name: 'Training Materials', count: 5 },
    { id: 'tools', name: 'Advocacy Tools', count: 3 },
    { id: 'multimedia', name: 'Videos & Audio', count: 2 }
  ];

  const resources = [
    {
      id: 'legal-aid-guide',
      title: 'Complete Guide to Legal Aid Access',
      category: 'guides',
      type: 'PDF Guide',
      icon: FileText,
      description: 'Comprehensive guide for accessing legal aid services, understanding eligibility, and navigating the application process.',
      downloadCount: 2847,
      rating: 4.8,
      size: '2.3 MB',
      pages: 45,
      lastUpdated: '2024-01-15'
    },
    {
      id: 'sentencing-disparities',
      title: 'Sentencing Disparities Research Report 2024',
      category: 'research',
      type: 'Research Report',
      icon: FileText,
      description: 'In-depth analysis of sentencing patterns across demographics, including AI-driven insights and policy recommendations.',
      downloadCount: 1923,
      rating: 4.9,
      size: '5.7 MB',
      pages: 128,
      lastUpdated: '2024-02-20'
    },
    {
      id: 'advocacy-toolkit',
      title: 'Community Advocacy Toolkit',
      category: 'tools',
      type: 'Interactive Toolkit',
      icon: Users,
      description: 'Complete toolkit for organizing community advocacy campaigns, including templates, strategies, and AI-assisted planning tools.',
      downloadCount: 3156,
      rating: 4.7,
      size: '8.2 MB',
      pages: 67,
      lastUpdated: '2024-01-30'
    },
    {
      id: 'know-your-rights',
      title: 'Know Your Rights: Criminal Justice Edition',
      category: 'guides',
      type: 'Legal Guide',
      icon: FileText,
      description: 'Essential rights information for interactions with law enforcement, court proceedings, and incarceration.',
      downloadCount: 4521,
      rating: 4.6,
      size: '1.8 MB',
      pages: 32,
      lastUpdated: '2024-02-10'
    },
    {
      id: 'reform-training',
      title: 'Justice Reform Training Program',
      category: 'training',
      type: 'Training Module',
      icon: Video,
      description: 'Multi-module training program for advocates, including video lessons, exercises, and certification materials.',
      downloadCount: 1687,
      rating: 4.8,
      size: '156 MB',
      pages: 89,
      lastUpdated: '2024-01-25'
    },
    {
      id: 'policy-analysis',
      title: 'AI-Powered Policy Impact Analysis',
      category: 'research',
      type: 'Research Tool',
      icon: FileText,
      description: 'Methodology and tools for analyzing the impact of justice reform policies using artificial intelligence.',
      downloadCount: 892,
      rating: 4.9,
      size: '3.4 MB',
      pages: 76,
      lastUpdated: '2024-02-05'
    },
    {
      id: 'reentry-support',
      title: 'Reentry Support Resource Directory',
      category: 'guides',
      type: 'Directory',
      icon: FileText,
      description: 'Comprehensive directory of reentry support services, job placement programs, and community resources.',
      downloadCount: 2134,
      rating: 4.5,
      size: '4.1 MB',
      pages: 156,
      lastUpdated: '2024-02-12'
    },
    {
      id: 'webinar-series',
      title: 'Justice Reform Webinar Series',
      category: 'multimedia',
      type: 'Video Series',
      icon: Video,
      description: 'Monthly webinar series featuring experts, advocates, and policymakers discussing current reform initiatives.',
      downloadCount: 756,
      rating: 4.7,
      size: '2.1 GB',
      pages: 12,
      lastUpdated: '2024-02-28'
    }
  ];

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || resource.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getTypeIcon = (type: string) => {
    if (type.includes('Video')) return Video;
    if (type.includes('Audio')) return Headphones;
    if (type.includes('Tool')) return Users;
    return FileText;
  };

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="glass-card m-4 p-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <ArrowLeft className="h-5 w-5" />
            <Scale className="h-8 w-8 text-justice-gold" />
            <span className="text-xl font-bold gradient-text">StrayDog Justice Reform</span>
          </Link>
          <div className="hidden md:flex space-x-6">
            <a href="#search" className="hover:text-justice-gold transition-colors">Search</a>
            <a href="#categories" className="hover:text-justice-gold transition-colors">Categories</a>
            <a href="#featured" className="hover:text-justice-gold transition-colors">Featured</a>
          </div>
        </div>
      </nav>

      {/* Header */}
      <section className="px-4 py-12">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6 gradient-text">
              Justice Reform Resources
            </h1>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Access comprehensive guides, research reports, training materials, and tools 
              to advance justice reform in your community.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Search and Filter */}
      <section id="search" className="px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="glass-card p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/50" />
                <input
                  type="text"
                  placeholder="Search resources..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-justice-gold"
                />
              </div>
              
              {/* Category Filter */}
              <div className="lg:w-64">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  title="Filter resources by category"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-justice-gold"
                >
                  {categories.map(category => (
                    <option key={category.id} value={category.id} className="bg-primary-800">
                      {category.name} ({category.count})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Resources Grid */}
      <section className="px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map((resource, index) => {
              const IconComponent = resource.icon;
              return (
                <motion.div
                  key={resource.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="glass-card p-6 hover:bg-white/15 transition-all duration-300 group"
                >
                  {/* Resource Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <IconComponent className="h-8 w-8 text-justice-gold" />
                      <div>
                        <span className="text-xs text-white/60 uppercase tracking-wide">
                          {resource.type}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-white/70">{resource.rating}</span>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold mb-3 group-hover:text-justice-gold transition-colors">
                    {resource.title}
                  </h3>
                  
                  <p className="text-white/80 mb-4 text-sm leading-relaxed">
                    {resource.description}
                  </p>

                  {/* Resource Stats */}
                  <div className="flex items-center justify-between text-xs text-white/60 mb-4">
                    <span>{resource.downloadCount.toLocaleString()} downloads</span>
                    <span>{resource.size}</span>
                    <span>{resource.pages} pages</span>
                  </div>

                  <div className="text-xs text-white/50 mb-4">
                    Updated: {new Date(resource.lastUpdated).toLocaleDateString()}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button className="advocacy-button flex-1 text-sm">
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </button>
                    <button
                      onClick={() => handleResourceAnalysis(resource.title)}
                      disabled={isLoading && selectedResource === resource.title}
                      className="advocacy-button px-3 text-sm"
                    >
                      {isLoading && selectedResource === resource.title ? (
                        'Analyzing...'
                      ) : (
                        <ExternalLink className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {filteredResources.length === 0 && (
            <div className="text-center py-12">
              <BookOpen className="h-16 w-16 text-white/30 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white/70 mb-2">No resources found</h3>
              <p className="text-white/50">Try adjusting your search terms or category filter.</p>
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold mb-6 gradient-text">Need More Support?</h2>
            <p className="text-xl text-white/80 mb-8">
              Can't find what you're looking for? Our team is here to help you access 
              the resources you need for effective justice reform advocacy.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/volunteer" className="advocacy-button bg-justice-gold text-primary-900 hover:bg-justice-gold/90">
                <Users className="w-5 h-5 mr-2" />
                Get Personal Support
              </Link>
              <Link href="/initiatives" className="advocacy-button">
                <Scale className="w-5 h-5 mr-2" />
                View Our Programs
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}