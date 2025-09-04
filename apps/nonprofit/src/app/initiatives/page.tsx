'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Scale, 
  Users, 
  BookOpen, 
  ArrowLeft, 
  CheckCircle, 
  Clock, 
  MapPin,
  Target,
  TrendingUp,
  FileText,
  MessageSquare
} from 'lucide-react';
import { useAIOrchestrator } from '@straydog/ai-orchestrator';
import Link from 'next/link';

export default function InitiativesPage() {
  const [selectedProgram, setSelectedProgram] = useState<string | null>(null);
  const { generateResponse, isLoading } = useAIOrchestrator();

  const handleProgramAnalysis = async (program: string) => {
    setSelectedProgram(program);
    try {
      await generateResponse(
        `Analyze the impact and effectiveness of ${program} in justice reform`,
        'justice-reform'
      );
    } catch (error) {
      console.error('Analysis error:', error);
    }
  };

  const programs = [
    {
      id: 'legal-aid',
      title: 'AI-Powered Legal Aid',
      status: 'Active',
      location: 'Nationwide',
      duration: '2023 - Ongoing',
      description: 'Providing accessible legal assistance through AI-driven document analysis and guidance systems.',
      objectives: [
        'Reduce legal aid wait times by 70%',
        'Serve 10,000+ underserved individuals annually',
        'Provide 24/7 legal guidance access',
        'Create multilingual legal resources'
      ],
      achievements: [
        '8,500 cases processed in 2024',
        '65% reduction in processing time',
        'Available in 12 languages',
        '95% user satisfaction rate'
      ],
      nextSteps: [
        'Expand to rural communities',
        'Integrate with court systems',
        'Develop mobile app platform',
        'Partner with law schools'
      ]
    },
    {
      id: 'sentencing-reform',
      title: 'Sentencing Equity Initiative',
      status: 'Active',
      location: '15 States',
      duration: '2022 - 2025',
      description: 'Using data analytics to identify and address sentencing disparities across demographic groups.',
      objectives: [
        'Analyze 100,000+ sentencing records',
        'Identify bias patterns in judicial decisions',
        'Advocate for policy reforms',
        'Train judicial staff on equity'
      ],
      achievements: [
        '75,000 cases analyzed',
        '12 policy recommendations adopted',
        '8 states implementing reforms',
        '25% reduction in sentencing gaps'
      ],
      nextSteps: [
        'Expand to federal courts',
        'Develop real-time monitoring',
        'Create judicial training programs',
        'Publish annual equity reports'
      ]
    },
    {
      id: 'community-advocacy',
      title: 'Community Advocacy Network',
      status: 'Expanding',
      location: '50 Cities',
      duration: '2021 - Ongoing',
      description: 'Building grassroots advocacy capacity through training, resources, and AI-assisted campaign tools.',
      objectives: [
        'Train 5,000 community advocates',
        'Support 200 local campaigns',
        'Develop advocacy toolkits',
        'Create coalition networks'
      ],
      achievements: [
        '3,200 advocates trained',
        '145 successful campaigns',
        '30 policy victories',
        '85 active coalitions'
      ],
      nextSteps: [
        'Launch youth advocacy program',
        'Develop digital organizing tools',
        'Create mentorship networks',
        'Expand to rural areas'
      ]
    },
    {
      id: 'reentry-support',
      title: 'AI-Enhanced Reentry Program',
      status: 'Pilot',
      location: '5 States',
      duration: '2024 - 2026',
      description: 'Supporting successful reintegration through personalized AI-driven resource matching and support.',
      objectives: [
        'Reduce recidivism by 40%',
        'Connect 1,000 individuals to services',
        'Provide job placement assistance',
        'Offer mental health support'
      ],
      achievements: [
        '250 participants enrolled',
        '78% job placement rate',
        '15% recidivism reduction',
        '90% program completion rate'
      ],
      nextSteps: [
        'Scale to 15 additional states',
        'Partner with employers',
        'Develop family support services',
        'Create peer mentorship program'
      ]
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'text-green-400';
      case 'Expanding': return 'text-blue-400';
      case 'Pilot': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
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
            <a href="#programs" className="hover:text-justice-gold transition-colors">Programs</a>
            <a href="#impact" className="hover:text-justice-gold transition-colors">Impact</a>
            <a href="#timeline" className="hover:text-justice-gold transition-colors">Timeline</a>
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
              Justice Reform Initiatives
            </h1>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Comprehensive programs addressing systemic issues in the justice system 
              through AI innovation and community empowerment.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Programs Grid */}
      <section id="programs" className="px-4 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8">
            {programs.map((program, index) => (
              <motion.div
                key={program.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="glass-card p-6 hover:bg-white/15 transition-all duration-300"
              >
                {/* Program Header */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-bold mb-2">{program.title}</h3>
                    <div className="flex items-center space-x-4 text-sm text-white/70">
                      <span className={`flex items-center ${getStatusColor(program.status)}`}>
                        <CheckCircle className="h-4 w-4 mr-1" />
                        {program.status}
                      </span>
                      <span className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {program.location}
                      </span>
                      <span className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {program.duration}
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-white/80 mb-6">{program.description}</p>

                {/* Objectives */}
                <div className="mb-6">
                  <h4 className="text-lg font-semibold mb-3 flex items-center">
                    <Target className="h-5 w-5 mr-2 text-justice-gold" />
                    Objectives
                  </h4>
                  <ul className="space-y-2">
                    {program.objectives.map((objective, idx) => (
                      <li key={idx} className="flex items-start text-sm text-white/70">
                        <CheckCircle className="h-4 w-4 mr-2 mt-0.5 text-justice-gold flex-shrink-0" />
                        {objective}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Achievements */}
                <div className="mb-6">
                  <h4 className="text-lg font-semibold mb-3 flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2 text-green-400" />
                    Key Achievements
                  </h4>
                  <ul className="space-y-2">
                    {program.achievements.map((achievement, idx) => (
                      <li key={idx} className="flex items-start text-sm text-white/70">
                        <CheckCircle className="h-4 w-4 mr-2 mt-0.5 text-green-400 flex-shrink-0" />
                        {achievement}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Next Steps */}
                <div className="mb-6">
                  <h4 className="text-lg font-semibold mb-3 flex items-center">
                    <FileText className="h-5 w-5 mr-2 text-blue-400" />
                    Next Steps
                  </h4>
                  <ul className="space-y-2">
                    {program.nextSteps.map((step, idx) => (
                      <li key={idx} className="flex items-start text-sm text-white/70">
                        <CheckCircle className="h-4 w-4 mr-2 mt-0.5 text-blue-400 flex-shrink-0" />
                        {step}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Action Button */}
                <button
                  onClick={() => handleProgramAnalysis(program.title)}
                  disabled={isLoading && selectedProgram === program.title}
                  className="advocacy-button w-full"
                >
                  {isLoading && selectedProgram === program.title ? (
                    'Analyzing Impact...'
                  ) : (
                    <>Get AI Analysis</>
                  )}
                </button>
              </motion.div>
            ))}
          </div>
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
            <h2 className="text-3xl font-bold mb-6 gradient-text">Get Involved in Reform</h2>
            <p className="text-xl text-white/80 mb-8">
              Join our initiatives and help create lasting change in the justice system.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/volunteer" className="advocacy-button bg-justice-gold text-primary-900 hover:bg-justice-gold/90">
                <Users className="w-5 h-5 mr-2" />
                Volunteer Now
              </Link>
              <Link href="/resources" className="advocacy-button">
                <BookOpen className="w-5 h-5 mr-2" />
                Access Resources
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}