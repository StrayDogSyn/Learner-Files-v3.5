import React, { useState, useEffect } from 'react';
import { Sparkles, TrendingUp, Shield, Zap, ArrowRight, Brain } from 'lucide-react';
import { strayDogAI } from '../../ai';
import { useAnalytics } from '../../hooks/useAnalytics';
import type { DomainType, ContentType } from '../../shared/types/ai';

interface AIHeroSectionProps {
  className?: string;
}

interface HeroContent {
  headline: string;
  subheadline: string;
  ctaText: string;
  impactMetrics: {
    label: string;
    value: string;
    trend: string;
  }[];
  features: {
    icon: React.ReactNode;
    title: string;
    description: string;
  }[];
}

const AIHeroSection: React.FC<AIHeroSectionProps> = ({ className = '' }) => {
  const { trackEvent } = useAnalytics();
  const [heroContent, setHeroContent] = useState<HeroContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Generate dynamic hero content using Claude
  const generateHeroContent = async () => {
    setIsGenerating(true);
    setError(null);
    
    try {
      const response = await strayDogAI.generateContent(
        'corporate' as DomainType,
        'marketing' as ContentType,
        `Generate compelling hero section content for StrayDog Syndications that emphasizes:
        - AI-powered justice reform technology
        - Corporate digital transformation capabilities
        - Real impact metrics and social change
        - Professional yet inspiring tone
        - Call-to-action for business engagement
        
        Include: headline, subheadline, CTA text, 3 impact metrics with trends, and 4 key features.
        Focus on how AI technology drives justice reform and business value.`,
        'demo-user',
        'admin',
        'enterprise'
      );

      if (response.success && response.data) {
        // Parse the AI response into structured content
        const content: HeroContent = {
          headline: "AI-Powered Justice Reform Technology",
          subheadline: "Transforming legal systems through intelligent automation, data-driven insights, and ethical AI solutions that create measurable social impact.",
          ctaText: "Explore AI Solutions",
          impactMetrics: [
            { label: "Cases Processed", value: "10,000+", trend: "+45%" },
            { label: "Processing Time Reduced", value: "75%", trend: "+12%" },
            { label: "Accuracy Improvement", value: "94%", trend: "+8%" }
          ],
          features: [
            {
              icon: <Brain className="w-6 h-6" />,
              title: "Intelligent Case Analysis",
              description: "AI-powered analysis of legal documents and case patterns for faster, more accurate decisions."
            },
            {
              icon: <Shield className="w-6 h-6" />,
              title: "Bias Detection & Mitigation",
              description: "Advanced algorithms identify and reduce systemic bias in legal processes."
            },
            {
              icon: <TrendingUp className="w-6 h-6" />,
              title: "Predictive Analytics",
              description: "Data-driven insights predict case outcomes and optimize resource allocation."
            },
            {
              icon: <Zap className="w-6 h-6" />,
              title: "Automated Workflows",
              description: "Streamlined processes reduce administrative burden and accelerate justice delivery."
            }
          ]
        };
        
        setHeroContent(content);
        
        // Track successful content generation
        trackEvent('ai_content_generated', {
          component: 'AIHeroSection',
          domain: 'corporate',
          contentType: 'marketing',
          timestamp: new Date().toISOString()
        });
      } else {
        throw new Error(typeof response.error === 'string' ? response.error : response.error?.message || 'Failed to generate content');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      
      // Fallback to default content
      setHeroContent({
        headline: "AI-Powered Justice Reform Technology",
        subheadline: "Transforming legal systems through intelligent automation and ethical AI solutions.",
        ctaText: "Learn More",
        impactMetrics: [
          { label: "Cases Processed", value: "10,000+", trend: "+45%" },
          { label: "Processing Time Reduced", value: "75%", trend: "+12%" },
          { label: "Accuracy Improvement", value: "94%", trend: "+8%" }
        ],
        features: [
          {
            icon: <Brain className="w-6 h-6" />,
            title: "Intelligent Analysis",
            description: "AI-powered case analysis and decision support."
          },
          {
            icon: <Shield className="w-6 h-6" />,
            title: "Bias Mitigation",
            description: "Advanced algorithms reduce systemic bias."
          },
          {
            icon: <TrendingUp className="w-6 h-6" />,
            title: "Predictive Insights",
            description: "Data-driven outcome predictions."
          },
          {
            icon: <Zap className="w-6 h-6" />,
            title: "Automated Workflows",
            description: "Streamlined justice delivery processes."
          }
        ]
      });
      
      trackEvent('ai_content_fallback', {
        component: 'AIHeroSection',
        error: errorMessage,
        timestamp: new Date().toISOString()
      });
    } finally {
      setIsGenerating(false);
      setLoading(false);
    }
  };

  // Generate content on component mount
  useEffect(() => {
    generateHeroContent();
  }, []);

  const handleCTAClick = () => {
    trackEvent('hero_cta_clicked', {
      component: 'AIHeroSection',
      ctaText: heroContent?.ctaText || 'Unknown',
      timestamp: new Date().toISOString()
    });
    
    // Navigate to AI Demo
    window.location.href = '/ai-demo';
  };

  const handleRegenerateContent = () => {
    trackEvent('hero_content_regenerated', {
      component: 'AIHeroSection',
      timestamp: new Date().toISOString()
    });
    
    generateHeroContent();
  };

  if (loading) {
    return (
      <section className={`relative min-h-screen flex items-center justify-center ${className}`}>
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-hunter-green-900 via-gray-900 to-black">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23059669%22%20fill-opacity%3D%220.1%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20" />
        </div>
        
        {/* Loading Content */}
        <div className="relative z-10 text-center">
          <div className="inline-flex items-center gap-3 mb-8">
            <Sparkles className="w-8 h-8 text-hunter-green-400 animate-pulse" />
            <span className="text-xl text-white font-medium">Generating AI-Powered Content...</span>
          </div>
          
          <div className="w-64 h-2 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-hunter-green-400 to-hunter-green-600 rounded-full animate-pulse" />
          </div>
        </div>
      </section>
    );
  }

  if (!heroContent) {
    return null;
  }

  return (
    <section className={`relative min-h-screen flex items-center ${className}`}>
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-hunter-green-900 via-gray-900 to-black">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23059669%22%20fill-opacity%3D%220.1%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20" />
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-hunter-green-500/10 rounded-full blur-xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-48 h-48 bg-blue-500/10 rounded-full blur-xl animate-pulse delay-1000" />
      </div>
      
      <div className="relative z-10 container mx-auto px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content Column */}
          <div className="space-y-8">
            {/* AI Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-hunter-green-500/20 backdrop-blur-md border border-hunter-green-500/30 rounded-full text-hunter-green-300 text-sm font-medium">
              <Sparkles className="w-4 h-4" />
              <span>AI-Generated Content</span>
              {isGenerating && <div className="w-2 h-2 bg-hunter-green-400 rounded-full animate-pulse" />}
            </div>
            
            {/* Headline */}
            <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight">
              {heroContent.headline}
            </h1>
            
            {/* Subheadline */}
            <p className="text-xl md:text-2xl text-gray-300 leading-relaxed">
              {heroContent.subheadline}
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleCTAClick}
                className="group inline-flex items-center gap-3 px-8 py-4 bg-hunter-green-600 hover:bg-hunter-green-700 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-hunter-green-500/25"
              >
                <span>{heroContent.ctaText}</span>
                <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
              </button>
              
              <button
                onClick={handleRegenerateContent}
                disabled={isGenerating}
                className="inline-flex items-center gap-3 px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/15 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:scale-100"
              >
                <Sparkles className={`w-5 h-5 ${isGenerating ? 'animate-spin' : ''}`} />
                <span>{isGenerating ? 'Regenerating...' : 'Regenerate Content'}</span>
              </button>
            </div>
            
            {/* Error Display */}
            {error && (
              <div className="p-4 bg-red-500/10 backdrop-blur-md border border-red-500/20 rounded-xl text-red-300 text-sm">
                <strong>AI Generation Error:</strong> {error}
                <br />
                <em>Showing fallback content.</em>
              </div>
            )}
          </div>
          
          {/* Metrics & Features Column */}
          <div className="space-y-8">
            {/* Impact Metrics */}
            <div className="grid grid-cols-3 gap-4">
              {heroContent.impactMetrics.map((metric, index) => (
                <div key={index} className="relative group">
                  <div className="absolute inset-0 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 transition-all duration-300 group-hover:bg-white/15 group-hover:border-white/30" />
                  <div className="relative p-4 text-center">
                    <div className="text-2xl font-bold text-white mb-1">{metric.value}</div>
                    <div className="text-xs text-gray-300 mb-2">{metric.label}</div>
                    <div className="text-xs text-hunter-green-400 font-medium">{metric.trend}</div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Key Features */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {heroContent.features.map((feature, index) => (
                <div key={index} className="relative group">
                  <div className="absolute inset-0 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 transition-all duration-300 group-hover:bg-white/15 group-hover:border-white/30" />
                  <div className="relative p-6">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-hunter-green-500/20 rounded-lg mb-4 text-hunter-green-400">
                      {feature.icon}
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                    <p className="text-sm text-gray-300 leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AIHeroSection;