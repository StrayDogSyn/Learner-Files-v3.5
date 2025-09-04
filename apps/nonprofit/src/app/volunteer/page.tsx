'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Scale, 
  Heart, 
  ArrowLeft, 
  Users,
  Clock,
  MapPin,
  Calendar,
  CheckCircle,
  Star,
  Mail,
  Phone,
  User,
  Building,
  MessageSquare
} from 'lucide-react';
import { useAIOrchestrator } from '@straydog/ai-orchestrator';
import Link from 'next/link';

export default function VolunteerPage() {
  const [selectedOpportunity, setSelectedOpportunity] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    organization: '',
    interests: [] as string[],
    availability: '',
    experience: '',
    motivation: ''
  });
  const { generateResponse, isLoading } = useAIOrchestrator();

  const handleOpportunityMatch = async (opportunity: string) => {
    setSelectedOpportunity(opportunity);
    try {
      await generateResponse(
        `Provide personalized guidance for volunteering in: ${opportunity}. Include skills needed, time commitment, and impact potential.`,
        'justice-reform'
      );
    } catch (error) {
      console.error('Matching error:', error);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await generateResponse(
        `Process volunteer application for ${formData.name} interested in ${formData.interests.join(', ')}. Provide next steps and personalized recommendations.`,
        'justice-reform'
      );
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        organization: '',
        interests: [],
        availability: '',
        experience: '',
        motivation: ''
      });
    } catch (error) {
      console.error('Submission error:', error);
    }
  };

  const opportunities = [
    {
      id: 'legal-aid',
      title: 'Legal Aid Support',
      category: 'Direct Service',
      commitment: '4-6 hours/week',
      location: 'Remote & On-site',
      urgency: 'High',
      description: 'Help individuals navigate legal processes, assist with paperwork, and provide basic legal information.',
      skills: ['Communication', 'Organization', 'Empathy', 'Basic Legal Knowledge'],
      impact: 'Directly help 15-20 individuals per month access justice',
      volunteers: 23,
      needed: 35
    },
    {
      id: 'community-outreach',
      title: 'Community Outreach Coordinator',
      category: 'Advocacy',
      commitment: '6-8 hours/week',
      location: 'Field Work',
      urgency: 'Medium',
      description: 'Organize community events, conduct educational workshops, and build relationships with local organizations.',
      skills: ['Public Speaking', 'Event Planning', 'Networking', 'Cultural Sensitivity'],
      impact: 'Reach 200+ community members monthly with reform education',
      volunteers: 12,
      needed: 20
    },
    {
      id: 'data-analysis',
      title: 'Justice Data Analyst',
      category: 'Research',
      commitment: '3-5 hours/week',
      location: 'Remote',
      urgency: 'Medium',
      description: 'Analyze criminal justice data, create reports, and support evidence-based advocacy efforts.',
      skills: ['Data Analysis', 'Excel/Google Sheets', 'Research', 'Critical Thinking'],
      impact: 'Support policy recommendations affecting thousands',
      volunteers: 8,
      needed: 15
    },
    {
      id: 'mentorship',
      title: 'Reentry Mentor',
      category: 'Support',
      commitment: '2-3 hours/week',
      location: 'Community Centers',
      urgency: 'High',
      description: 'Provide one-on-one mentorship to individuals reentering society after incarceration.',
      skills: ['Active Listening', 'Patience', 'Life Experience', 'Non-judgmental Attitude'],
      impact: 'Transform lives through personal guidance and support',
      volunteers: 15,
      needed: 30
    },
    {
      id: 'policy-research',
      title: 'Policy Research Assistant',
      category: 'Research',
      commitment: '5-7 hours/week',
      location: 'Remote',
      urgency: 'Low',
      description: 'Research criminal justice policies, track legislation, and prepare briefing materials for advocacy campaigns.',
      skills: ['Research', 'Writing', 'Policy Analysis', 'Attention to Detail'],
      impact: 'Inform advocacy strategies affecting state and local policy',
      volunteers: 6,
      needed: 12
    },
    {
      id: 'fundraising',
      title: 'Fundraising Coordinator',
      category: 'Operations',
      commitment: '4-6 hours/week',
      location: 'Remote & Events',
      urgency: 'Medium',
      description: 'Organize fundraising events, manage donor relationships, and develop grant proposals.',
      skills: ['Event Planning', 'Grant Writing', 'Relationship Building', 'Project Management'],
      impact: 'Secure funding to expand justice reform programs',
      volunteers: 4,
      needed: 10
    }
  ];

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'High': return 'text-red-400';
      case 'Medium': return 'text-yellow-400';
      case 'Low': return 'text-green-400';
      default: return 'text-white/60';
    }
  };

  const handleInterestToggle = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
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
            <a href="#opportunities" className="hover:text-justice-gold transition-colors">Opportunities</a>
            <a href="#application" className="hover:text-justice-gold transition-colors">Apply</a>
            <a href="#impact" className="hover:text-justice-gold transition-colors">Impact</a>
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
              Join the Movement
            </h1>
            <p className="text-xl text-white/80 max-w-3xl mx-auto mb-8">
              Make a real difference in criminal justice reform. Every volunteer 
              contributes to building a more equitable and just society.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="#opportunities" className="advocacy-button bg-justice-gold text-primary-900 hover:bg-justice-gold/90">
                <Heart className="w-5 h-5 mr-2" />
                Find Your Role
              </a>
              <a href="#application" className="advocacy-button">
                <Users className="w-5 h-5 mr-2" />
                Apply Now
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Impact Stats */}
      <section id="impact" className="px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { label: 'Active Volunteers', value: '156', icon: Users },
              { label: 'Lives Impacted', value: '2,847', icon: Heart },
              { label: 'Hours Contributed', value: '12,450', icon: Clock },
              { label: 'Communities Served', value: '23', icon: MapPin }
            ].map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="glass-card p-6 text-center"
                >
                  <IconComponent className="h-8 w-8 text-justice-gold mx-auto mb-3" />
                  <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
                  <div className="text-white/70">{stat.label}</div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Volunteer Opportunities */}
      <section id="opportunities" className="px-4 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 gradient-text">Volunteer Opportunities</h2>
            <p className="text-xl text-white/80">Find the perfect way to contribute your skills and passion</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {opportunities.map((opportunity, index) => (
              <motion.div
                key={opportunity.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="glass-card p-6 hover:bg-white/15 transition-all duration-300"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold mb-2">{opportunity.title}</h3>
                    <div className="flex items-center space-x-4 text-sm text-white/70">
                      <span className="bg-justice-gold/20 text-justice-gold px-2 py-1 rounded">
                        {opportunity.category}
                      </span>
                      <span className={getUrgencyColor(opportunity.urgency)}>
                        {opportunity.urgency} Priority
                      </span>
                    </div>
                  </div>
                  <div className="text-right text-sm text-white/60">
                    <div>{opportunity.volunteers}/{opportunity.needed}</div>
                    <div>volunteers</div>
                  </div>
                </div>

                <p className="text-white/80 mb-4">{opportunity.description}</p>

                {/* Details */}
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center space-x-2 text-sm text-white/70">
                    <Clock className="h-4 w-4" />
                    <span>{opportunity.commitment}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-white/70">
                    <MapPin className="h-4 w-4" />
                    <span>{opportunity.location}</span>
                  </div>
                </div>

                {/* Skills */}
                <div className="mb-4">
                  <div className="text-sm text-white/60 mb-2">Skills Needed:</div>
                  <div className="flex flex-wrap gap-2">
                    {opportunity.skills.map(skill => (
                      <span key={skill} className="text-xs bg-white/10 px-2 py-1 rounded">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Impact */}
                <div className="mb-4 p-3 bg-justice-gold/10 rounded-lg">
                  <div className="text-sm text-justice-gold font-medium mb-1">Your Impact:</div>
                  <div className="text-sm text-white/80">{opportunity.impact}</div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleOpportunityMatch(opportunity.title)}
                    disabled={isLoading && selectedOpportunity === opportunity.title}
                    className="advocacy-button flex-1"
                  >
                    {isLoading && selectedOpportunity === opportunity.title ? (
                      'Getting Info...'
                    ) : (
                      <>Learn More</>
                    )}
                  </button>
                  <a href="#application" className="advocacy-button bg-justice-gold text-primary-900 hover:bg-justice-gold/90">
                    Apply
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section id="application" className="px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 gradient-text">Volunteer Application</h2>
            <p className="text-xl text-white/80">Tell us about yourself and how you'd like to contribute</p>
          </div>

          <div className="glass-card p-8">
            <form onSubmit={handleFormSubmit} className="space-y-6">
              {/* Personal Information */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    <User className="inline h-4 w-4 mr-2" />
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-justice-gold"
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    <Mail className="inline h-4 w-4 mr-2" />
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-justice-gold"
                    placeholder="your.email@example.com"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    <Phone className="inline h-4 w-4 mr-2" />
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-justice-gold"
                    placeholder="(555) 123-4567"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    <Building className="inline h-4 w-4 mr-2" />
                    Organization (if applicable)
                  </label>
                  <input
                    type="text"
                    value={formData.organization}
                    onChange={(e) => setFormData(prev => ({ ...prev, organization: e.target.value }))}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-justice-gold"
                    placeholder="Your organization"
                  />
                </div>
              </div>

              {/* Interests */}
              <div>
                <label className="block text-sm font-medium text-white/80 mb-3">
                  Areas of Interest (select all that apply)
                </label>
                <div className="grid md:grid-cols-3 gap-3">
                  {['Legal Aid', 'Community Outreach', 'Data Analysis', 'Mentorship', 'Policy Research', 'Fundraising', 'Event Planning', 'Social Media', 'Translation'].map(interest => (
                    <label key={interest} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.interests.includes(interest)}
                        onChange={() => handleInterestToggle(interest)}
                        className="rounded border-white/20 bg-white/10 text-justice-gold focus:ring-justice-gold"
                      />
                      <span className="text-sm text-white/80">{interest}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Availability */}
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  <Calendar className="inline h-4 w-4 mr-2" />
                  Availability
                </label>
                <select
                  value={formData.availability}
                  onChange={(e) => setFormData(prev => ({ ...prev, availability: e.target.value }))}
                  title="Select your volunteer availability"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-justice-gold"
                >
                  <option value="" className="bg-primary-800">Select your availability</option>
                  <option value="1-2 hours/week" className="bg-primary-800">1-2 hours per week</option>
                  <option value="3-5 hours/week" className="bg-primary-800">3-5 hours per week</option>
                  <option value="6-10 hours/week" className="bg-primary-800">6-10 hours per week</option>
                  <option value="10+ hours/week" className="bg-primary-800">10+ hours per week</option>
                  <option value="Flexible" className="bg-primary-800">Flexible schedule</option>
                </select>
              </div>

              {/* Experience */}
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Relevant Experience
                </label>
                <textarea
                  value={formData.experience}
                  onChange={(e) => setFormData(prev => ({ ...prev, experience: e.target.value }))}
                  rows={3}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-justice-gold resize-none"
                  placeholder="Tell us about any relevant experience, skills, or background..."
                />
              </div>

              {/* Motivation */}
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  <MessageSquare className="inline h-4 w-4 mr-2" />
                  Why do you want to volunteer with us? *
                </label>
                <textarea
                  required
                  value={formData.motivation}
                  onChange={(e) => setFormData(prev => ({ ...prev, motivation: e.target.value }))}
                  rows={4}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-justice-gold resize-none"
                  placeholder="Share your motivation for joining our justice reform efforts..."
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full advocacy-button bg-justice-gold text-primary-900 hover:bg-justice-gold/90 disabled:opacity-50"
              >
                {isLoading ? (
                  'Submitting Application...'
                ) : (
                  <>Submit Application</>
                )}
              </button>
            </form>
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
            <h2 className="text-3xl font-bold mb-6 gradient-text">Ready to Make a Difference?</h2>
            <p className="text-xl text-white/80 mb-8">
              Join our community of dedicated volunteers working to transform 
              the criminal justice system and create lasting change.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/initiatives" className="advocacy-button">
                <Scale className="w-5 h-5 mr-2" />
                View Our Work
              </Link>
              <Link href="/resources" className="advocacy-button">
                <CheckCircle className="w-5 h-5 mr-2" />
                Get Resources
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}