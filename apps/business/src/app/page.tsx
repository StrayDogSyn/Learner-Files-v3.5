'use client';

import { useState } from 'react';
import { Button } from '@straydog/ui-components';
import { useAIOrchestrator } from '@straydog/ai-orchestrator';
import { ArrowRight, Building2, Users, FileText, BarChart3, Shield, Zap } from 'lucide-react';
import Link from 'next/link';

const services = [
  {
    icon: FileText,
    title: 'Legal Document Analysis',
    description: 'AI-powered analysis of contracts, compliance documents, and legal filings',
    features: ['Contract review', 'Risk assessment', 'Compliance checking']
  },
  {
    icon: BarChart3,
    title: 'Business Intelligence',
    description: 'Data-driven insights for strategic decision making and performance optimization',
    features: ['Market analysis', 'Performance metrics', 'Predictive analytics']
  },
  {
    icon: Shield,
    title: 'Compliance Monitoring',
    description: 'Automated compliance tracking and regulatory requirement management',
    features: ['Regulatory updates', 'Audit preparation', 'Risk mitigation']
  },
  {
    icon: Users,
    title: 'Stakeholder Management',
    description: 'Streamlined communication and relationship management tools',
    features: ['Client portals', 'Communication tracking', 'Engagement analytics']
  }
];

export default function BusinessHomePage() {
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const { processRequest, isLoading } = useAIOrchestrator();

  const handleServiceDemo = async (serviceName: string) => {
    setSelectedService(serviceName);
    try {
      await processRequest(
        `Demonstrate ${serviceName} capabilities for business services`,
        'business'
      );
    } catch (error) {
      console.error('Service demo error:', error);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="glass-card m-6 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Building2 className="h-8 w-8 text-tech-accent-400" />
            <span className="text-xl font-bold gradient-text">StrayDog Business</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/services" className="text-hunter-green-300 hover:text-white transition-colors">
              Services
            </Link>
            <Link href="/analytics" className="text-hunter-green-300 hover:text-white transition-colors">
              Analytics
            </Link>
            <Link href="/contact" className="text-hunter-green-300 hover:text-white transition-colors">
              Contact
            </Link>
            <Button variant="outline" size="sm">
              Get Started
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="px-6 py-20 text-center">
        <div className="max-w-4xl mx-auto hero-glow">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            AI-Powered
            <span className="gradient-text block">Business Services</span>
          </h1>
          <p className="text-xl text-hunter-green-200 mb-8 max-w-2xl mx-auto text-balance">
            Transform your business operations with intelligent automation, 
            compliance monitoring, and data-driven insights powered by Claude AI.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="glass-button">
              <Zap className="mr-2 h-5 w-5" />
              Start Free Trial
            </Button>
            <Button variant="outline" size="lg">
              View Demo
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="px-6 py-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 gradient-text">
            Our AI-Enhanced Services
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <div
                  key={index}
                  className={`glass-card p-8 transition-all duration-300 cursor-pointer ${
                    selectedService === service.title
                      ? 'ring-2 ring-tech-accent-400 bg-white/10'
                      : 'hover:bg-white/10'
                  }`}
                  onClick={() => handleServiceDemo(service.title)}
                >
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-hunter-green-600/30 rounded-lg">
                      <Icon className="h-8 w-8 text-tech-accent-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                      <p className="text-hunter-green-200 mb-4">{service.description}</p>
                      <ul className="space-y-1">
                        {service.features.map((feature, idx) => (
                          <li key={idx} className="text-sm text-hunter-green-300 flex items-center">
                            <ArrowRight className="h-3 w-3 mr-2" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                      {selectedService === service.title && isLoading && (
                        <div className="mt-4 p-3 bg-tech-accent-500/20 rounded-lg">
                          <p className="text-sm text-tech-accent-300">
                            Initializing AI demonstration...
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-16">
        <div className="max-w-4xl mx-auto text-center glass-card p-12">
          <h2 className="text-3xl font-bold mb-4 gradient-text">
            Ready to Transform Your Business?
          </h2>
          <p className="text-hunter-green-200 mb-8 text-lg">
            Join forward-thinking businesses leveraging AI for competitive advantage.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="glass-button">
              Schedule Consultation
            </Button>
            <Button variant="outline" size="lg">
              View Pricing
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}