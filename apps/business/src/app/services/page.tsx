'use client';

import { useState } from 'react';
import { Button } from '@straydog/ui-components';
import { useAIOrchestrator } from '@straydog/ai-orchestrator';
import { ArrowLeft, FileText, BarChart3, Shield, Users, CheckCircle, Star } from 'lucide-react';
import Link from 'next/link';

const serviceDetails = [
  {
    id: 'legal-analysis',
    icon: FileText,
    title: 'Legal Document Analysis',
    description: 'Comprehensive AI-powered analysis of legal documents with risk assessment and compliance checking.',
    features: [
      'Contract review and red-flag identification',
      'Regulatory compliance verification',
      'Risk assessment scoring',
      'Amendment and clause suggestions',
      'Multi-jurisdiction legal analysis'
    ],
    pricing: '$299/month',
    popular: false
  },
  {
    id: 'business-intelligence',
    icon: BarChart3,
    title: 'Business Intelligence Suite',
    description: 'Advanced analytics and insights platform for data-driven business decisions.',
    features: [
      'Real-time performance dashboards',
      'Predictive market analysis',
      'Customer behavior insights',
      'Financial forecasting',
      'Competitive intelligence reports'
    ],
    pricing: '$499/month',
    popular: true
  },
  {
    id: 'compliance-monitoring',
    icon: Shield,
    title: 'Compliance Monitoring',
    description: 'Automated compliance tracking with real-time regulatory updates and audit preparation.',
    features: [
      '24/7 regulatory monitoring',
      'Automated audit trail generation',
      'Policy update notifications',
      'Risk mitigation recommendations',
      'Compliance score tracking'
    ],
    pricing: '$399/month',
    popular: false
  },
  {
    id: 'stakeholder-management',
    icon: Users,
    title: 'Stakeholder Management',
    description: 'Streamlined communication and relationship management with AI-powered insights.',
    features: [
      'Client portal with secure access',
      'Communication tracking and analytics',
      'Engagement scoring and recommendations',
      'Automated follow-up scheduling',
      'Relationship health monitoring'
    ],
    pricing: '$199/month',
    popular: false
  }
];

export default function ServicesPage() {
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const { processRequest, isLoading } = useAIOrchestrator();

  const handleServiceDemo = async (serviceId: string, serviceName: string) => {
    setSelectedService(serviceId);
    try {
      await processRequest(
        `Provide detailed demonstration of ${serviceName} capabilities including sample analysis and recommendations`,
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
          <Link href="/" className="flex items-center space-x-2 text-hunter-green-300 hover:text-white transition-colors">
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Home</span>
          </Link>
          <div className="flex items-center space-x-4">
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

      {/* Header */}
      <section className="px-6 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Our <span className="gradient-text">AI Services</span>
          </h1>
          <p className="text-xl text-hunter-green-200 mb-8 max-w-2xl mx-auto">
            Comprehensive business solutions powered by advanced AI technology
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8">
            {serviceDetails.map((service) => {
              const Icon = service.icon;
              return (
                <div
                  key={service.id}
                  className={`glass-card p-8 relative transition-all duration-300 ${
                    selectedService === service.id
                      ? 'ring-2 ring-tech-accent-400 bg-white/10'
                      : 'hover:bg-white/5'
                  }`}
                >
                  {service.popular && (
                    <div className="absolute -top-3 left-6">
                      <div className="bg-tech-accent-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center">
                        <Star className="h-3 w-3 mr-1" />
                        Most Popular
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-hunter-green-600/30 rounded-lg">
                        <Icon className="h-8 w-8 text-tech-accent-400" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-semibold mb-2">{service.title}</h3>
                        <p className="text-3xl font-bold text-tech-accent-400">{service.pricing}</p>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-hunter-green-200 mb-6">{service.description}</p>
                  
                  <div className="space-y-3 mb-8">
                    {service.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center space-x-3">
                        <CheckCircle className="h-5 w-5 text-tech-accent-400 flex-shrink-0" />
                        <span className="text-hunter-green-100">{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button 
                      className="glass-button flex-1"
                      onClick={() => handleServiceDemo(service.id, service.title)}
                      disabled={isLoading && selectedService === service.id}
                    >
                      {isLoading && selectedService === service.id ? 'Loading Demo...' : 'Try Demo'}
                    </Button>
                    <Button variant="outline" className="flex-1">
                      Learn More
                    </Button>
                  </div>
                  
                  {selectedService === service.id && isLoading && (
                    <div className="mt-6 p-4 bg-tech-accent-500/20 rounded-lg border border-tech-accent-400/30">
                      <p className="text-sm text-tech-accent-300 mb-2">
                        Initializing AI demonstration for {service.title}...
                      </p>
                      <div className="w-full bg-hunter-green-800 rounded-full h-2">
                        <div className="bg-tech-accent-400 h-2 rounded-full animate-pulse" style={{width: '60%'}}></div>
                      </div>
                    </div>
                  )}
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
            Need a Custom Solution?
          </h2>
          <p className="text-hunter-green-200 mb-8 text-lg">
            Our AI experts can create tailored solutions for your specific business needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="glass-button">
              Schedule Consultation
            </Button>
            <Button variant="outline" size="lg">
              View Enterprise Plans
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}