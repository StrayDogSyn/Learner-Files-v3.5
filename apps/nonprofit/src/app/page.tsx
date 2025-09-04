'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Scale, 
  Users, 
  BookOpen, 
  Heart, 
  ArrowRight, 
  Gavel, 
  Shield, 
  Target,
  MessageSquare,
  FileText,
  TrendingUp
} from 'lucide-react';
import { useAIOrchestrator } from '@straydog/ai-orchestrator';

export default function NonprofitHome() {
  const [selectedInitiative, setSelectedInitiative] = useState<string | null>(null);
  const { generateResponse, isLoading } = useAIOrchestrator();

  const handleInitiativeDemo = async (initiative: string) => {
    setSelectedInitiative(initiative);
    try {
      await generateResponse(
        `Demonstrate AI assistance for ${initiative} in justice reform`,
        'justice-reform'
      );
    } catch (error) {
      console.error('Demo error:', error);
    }
  };

  const initiatives = [
    {
      icon: Scale,
      title: 'Legal Aid Access',
      description: 'AI-powered legal document analysis and guidance for underserved communities',
      features: ['Document Review', 'Legal Guidance', 'Resource Matching'],
      impact: '10,000+ cases assisted'
    },
    {
      icon: Shield,
      title: 'Criminal Justice Reform',
      description: 'Data-driven advocacy for fair sentencing and rehabilitation programs',
      features: ['Policy Analysis', 'Case Studies', 'Reform Tracking'],
      impact: '25 policy changes influenced'
    },
    {
      icon: Users,
      title: 'Community Empowerment',
      description: 'Educational programs and advocacy training for grassroots movements',
      features: ['Training Programs', 'Resource Libraries', 'Network Building'],
      impact: '5,000+ advocates trained'
    },
    {
      icon: Target,
      title: 'Systemic Change',
      description: 'Research and advocacy for comprehensive justice system transformation',
      features: ['Research Analysis', 'Policy Drafting', 'Coalition Building'],
      impact: '15 legislative victories'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="glass-card m-4 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Scale className="h-8 w-8 text-justice-gold" />
            <span className="text-xl font-bold gradient-text">StrayDog Justice Reform</span>
          </div>
          <div className="hidden md:flex space-x-6">
            <a href="#initiatives" className="hover:text-justice-gold transition-colors">Initiatives</a>
            <a href="#impact" className="hover:text-justice-gold transition-colors">Impact</a>
            <a href="#get-involved" className="hover:text-justice-gold transition-colors">Get Involved</a>
            <a href="#resources" className="hover:text-justice-gold transition-colors">Resources</a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="px-4 py-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            Justice Through
            <span className="gradient-text block">AI Innovation</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-white/80 max-w-3xl mx-auto">
            Empowering communities, reforming systems, and advancing justice through 
            cutting-edge AI technology and grassroots advocacy.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="advocacy-button bg-justice-gold text-primary-900 hover:bg-justice-gold/90">
              <Heart className="w-5 h-5 mr-2" />
              Support Our Mission
            </button>
            <button className="advocacy-button">
              <BookOpen className="w-5 h-5 mr-2" />
              Learn About Reform
            </button>
          </div>
        </motion.div>
      </section>

      {/* Justice Reform Initiatives */}
      <section id="initiatives" className="px-4 py-16">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4 gradient-text">Our Reform Initiatives</h2>
            <p className="text-xl text-white/70 max-w-3xl mx-auto">
              AI-powered programs addressing systemic issues in the justice system
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {initiatives.map((initiative, index) => {
              const IconComponent = initiative.icon;
              return (
                <motion.div
                  key={initiative.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="reform-card justice-glow"
                >
                  <div className="flex items-center mb-4">
                    <IconComponent className="h-8 w-8 text-justice-gold mr-3" />
                    <h3 className="text-xl font-semibold">{initiative.title}</h3>
                  </div>
                  <p className="text-white/80 mb-4">{initiative.description}</p>
                  
                  <div className="space-y-2 mb-4">
                    {initiative.features.map((feature) => (
                      <div key={feature} className="flex items-center text-sm text-white/70">
                        <ArrowRight className="h-4 w-4 mr-2 text-justice-gold" />
                        {feature}
                      </div>
                    ))}
                  </div>
                  
                  <div className="border-t border-white/20 pt-4">
                    <p className="text-sm font-semibold text-justice-gold mb-3">
                      {initiative.impact}
                    </p>
                    <button
                      onClick={() => handleInitiativeDemo(initiative.title)}
                      disabled={isLoading && selectedInitiative === initiative.title}
                      className="advocacy-button w-full text-sm"
                    >
                      {isLoading && selectedInitiative === initiative.title ? (
                        'Generating Demo...'
                      ) : (
                        <>Try AI Demo</>
                      )}
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Impact Metrics */}
      <section id="impact" className="px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4 gradient-text">Measuring Justice Impact</h2>
            <p className="text-xl text-white/70">
              Real results from AI-powered justice reform initiatives
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="glass-card p-8 text-center">
              <TrendingUp className="h-12 w-12 text-justice-gold mx-auto mb-4" />
              <h3 className="text-3xl font-bold mb-2">85%</h3>
              <p className="text-white/80">Reduction in case processing time</p>
            </div>
            <div className="glass-card p-8 text-center">
              <Users className="h-12 w-12 text-justice-liberty mx-auto mb-4" />
              <h3 className="text-3xl font-bold mb-2">15,000+</h3>
              <p className="text-white/80">People served through our programs</p>
            </div>
            <div className="glass-card p-8 text-center">
              <Gavel className="h-12 w-12 text-justice-scales mx-auto mb-4" />
              <h3 className="text-3xl font-bold mb-2">40</h3>
              <p className="text-white/80">Policy reforms influenced</p>
            </div>
          </div>
        </div>
      </section>

      {/* Get Involved */}
      <section id="get-involved" className="px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold mb-6 gradient-text">Join the Movement</h2>
            <p className="text-xl text-white/80 mb-8">
              Every voice matters in the fight for justice. Discover how you can contribute 
              to meaningful reform in your community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="advocacy-button bg-justice-gold text-primary-900 hover:bg-justice-gold/90">
                <MessageSquare className="w-5 h-5 mr-2" />
                Volunteer Today
              </button>
              <button className="advocacy-button">
                <FileText className="w-5 h-5 mr-2" />
                Download Resources
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}