import React, { useState } from 'react';
import { Mail, Phone, MapPin, Calendar, Send, CheckCircle, AlertCircle, ExternalLink, MessageSquare, Clock, User } from 'lucide-react';
import { developerProfile } from '../data/portfolioData';
import type { ContactFormData } from '../types/portfolio';

const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    company: '',
    subject: '',
    message: '',
    consultationType: 'other',
    projectType: '',
    budget: '',
    timeline: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const projectTypes = [
    'Web Application Development',
    'AI/ML Integration',
    'API Development',
    'Database Design',
    'Technical Consulting',
    'Code Review & Optimization',
    'Training & Mentorship',
    'Other'
  ];

  const budgetRanges = [
    'Under $5,000',
    '$5,000 - $15,000',
    '$15,000 - $50,000',
    '$50,000 - $100,000',
    '$100,000+',
    'Prefer to discuss'
  ];

  const timelineOptions = [
    'ASAP (Rush)',
    '1-2 weeks',
    '1 month',
    '2-3 months',
    '3-6 months',
    '6+ months',
    'Flexible'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSubmitStatus('success');
      setFormData({
        name: '',
        email: '',
        company: '',
        subject: '',
        message: '',
        consultationType: 'other',
        projectType: '',
        budget: '',
        timeline: ''
      });
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSubmitStatus('idle'), 5000);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-hunter-200 mb-2">
            Full Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-3 bg-hunter-800/50 border border-hunter-600/50 rounded-lg text-white placeholder-hunter-400 focus:outline-none focus:border-emerald-400/50 focus:ring-1 focus:ring-emerald-400/50 transition-colors"
            placeholder="Your full name"
          />
        </div>
        
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-hunter-200 mb-2">
            Email Address *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-3 bg-hunter-800/50 border border-hunter-600/50 rounded-lg text-white placeholder-hunter-400 focus:outline-none focus:border-emerald-400/50 focus:ring-1 focus:ring-emerald-400/50 transition-colors"
            placeholder="your.email@company.com"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="company" className="block text-sm font-medium text-hunter-200 mb-2">
            Company/Organization
          </label>
          <input
            type="text"
            id="company"
            name="company"
            value={formData.company}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-hunter-800/50 border border-hunter-600/50 rounded-lg text-white placeholder-hunter-400 focus:outline-none focus:border-emerald-400/50 focus:ring-1 focus:ring-emerald-400/50 transition-colors"
            placeholder="Your company name"
          />
        </div>
        
        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-hunter-200 mb-2">
            Subject *
          </label>
          <input
            type="text"
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-3 bg-hunter-800/50 border border-hunter-600/50 rounded-lg text-white placeholder-hunter-400 focus:outline-none focus:border-emerald-400/50 focus:ring-1 focus:ring-emerald-400/50 transition-colors"
            placeholder="Brief description of your inquiry"
          />
        </div>
      </div>

      {/* Project Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label htmlFor="projectType" className="block text-sm font-medium text-hunter-200 mb-2">
            Project Type
          </label>
          <select
            id="projectType"
            name="projectType"
            value={formData.projectType}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-hunter-800/50 border border-hunter-600/50 rounded-lg text-white focus:outline-none focus:border-emerald-400/50 focus:ring-1 focus:ring-emerald-400/50 transition-colors"
          >
            <option value="">Select project type</option>
            {projectTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label htmlFor="budget" className="block text-sm font-medium text-hunter-200 mb-2">
            Budget Range
          </label>
          <select
            id="budget"
            name="budget"
            value={formData.budget}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-hunter-800/50 border border-hunter-600/50 rounded-lg text-white focus:outline-none focus:border-emerald-400/50 focus:ring-1 focus:ring-emerald-400/50 transition-colors"
          >
            <option value="">Select budget range</option>
            {budgetRanges.map(range => (
              <option key={range} value={range}>{range}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label htmlFor="timeline" className="block text-sm font-medium text-hunter-200 mb-2">
            Timeline
          </label>
          <select
            id="timeline"
            name="timeline"
            value={formData.timeline}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-hunter-800/50 border border-hunter-600/50 rounded-lg text-white focus:outline-none focus:border-emerald-400/50 focus:ring-1 focus:ring-emerald-400/50 transition-colors"
          >
            <option value="">Select timeline</option>
            {timelineOptions.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Message */}
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-hunter-200 mb-2">
          Project Details *
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleInputChange}
          required
          rows={6}
          className="w-full px-4 py-3 bg-hunter-800/50 border border-hunter-600/50 rounded-lg text-white placeholder-hunter-400 focus:outline-none focus:border-emerald-400/50 focus:ring-1 focus:ring-emerald-400/50 transition-colors resize-vertical"
          placeholder="Please describe your project requirements, goals, and any specific technical needs..."
        />
      </div>

      {/* Submit Button */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-hunter-300">
          * Required fields
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="glass-button-primary px-8 py-3 rounded-lg font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-emerald-400 mr-2"></div>
              Sending...
            </>
          ) : (
            <>
              <Send size={16} className="mr-2" />
              Send Message
            </>
          )}
        </button>
      </div>

      {/* Status Messages */}
      {submitStatus === 'success' && (
        <div className="flex items-center p-4 bg-green-500/20 border border-green-400/30 rounded-lg text-green-400">
          <CheckCircle size={20} className="mr-3" />
          <div>
            <div className="font-medium">Message sent successfully!</div>
            <div className="text-sm text-green-300">I'll get back to you within 24 hours.</div>
          </div>
        </div>
      )}
      
      {submitStatus === 'error' && (
        <div className="flex items-center p-4 bg-red-500/20 border border-red-400/30 rounded-lg text-red-400">
          <AlertCircle size={20} className="mr-3" />
          <div>
            <div className="font-medium">Failed to send message</div>
            <div className="text-sm text-red-300">Please try again or contact me directly via email.</div>
          </div>
        </div>
      )}
    </form>
  );
};

export const Contact: React.FC = () => {
  return (
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Let's Work Together
          </h1>
          <p className="text-xl text-hunter-200 max-w-3xl mx-auto leading-relaxed">
            Ready to bring your vision to life? I'm here to help you build innovative 
            solutions that drive results. Let's discuss your project and explore how 
            we can achieve your goals together.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Information */}
          <div className="lg:col-span-1">
            <div className="glass-card p-8 h-fit">
              <h2 className="text-2xl font-bold text-white mb-6">Get In Touch</h2>
              
              {/* Contact Methods */}
              <div className="space-y-6">
                {developerProfile.contactMethods.map((method, index) => {
                  const IconComponent = method.type === 'email' ? Mail : 
                                      method.type === 'phone' ? Phone : 
                                      method.type === 'location' ? MapPin : MessageSquare;
                  
                  return (
                    <div key={index} className="flex items-start">
                      <div className="flex-shrink-0 w-12 h-12 bg-emerald-500/20 rounded-lg flex items-center justify-center mr-4">
                        <IconComponent className="text-emerald-400" size={20} />
                      </div>
                      <div>
                        <div className="font-medium text-white capitalize">{method.type}</div>
                        <div className="text-hunter-200">{method.value}</div>
                        {method.preferred && (
                          <div className="text-emerald-400 text-sm font-medium mt-1">Preferred</div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Availability */}
              <div className="mt-8 p-4 bg-hunter-700/30 rounded-lg border border-hunter-600/30">
                <div className="flex items-center mb-2">
                  <Clock className="text-emerald-400 mr-2" size={16} />
                  <span className="font-medium text-white">Availability</span>
                </div>
                <div className="text-hunter-200 text-sm">
                  <div>Monday - Friday: 9:00 AM - 6:00 PM EST</div>
                  <div>Response time: Within 24 hours</div>
                </div>
              </div>

              {/* Digital Properties */}
              <div className="mt-8">
                <h3 className="font-semibold text-white mb-4">Connect Online</h3>
                <div className="space-y-3">
                  {developerProfile.digitalProperties.map((property, index) => (
                    <a
                      key={index}
                      href={property.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center p-3 glass-subtle rounded-lg hover:glass-medium transition-all duration-300 group"
                    >
                      <div className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center mr-3 group-hover:bg-emerald-500/30 transition-colors">
                        <ExternalLink className="text-emerald-400" size={16} />
                      </div>
                      <div>
                        <div className="font-medium text-white group-hover:text-emerald-300 transition-colors">
                          {property.name}
                        </div>
                        <div className="text-hunter-300 text-sm">{property.description}</div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="glass-card p-8">
              <div className="flex items-center mb-6">
                <User className="text-emerald-400 mr-3" size={24} />
                <h2 className="text-2xl font-bold text-white">Start a Conversation</h2>
              </div>
              
              <p className="text-hunter-200 mb-8">
                Fill out the form below with details about your project. The more information 
                you provide, the better I can understand your needs and provide an accurate 
                proposal.
              </p>
              
              <ContactForm />
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <div className="glass-card p-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-hunter-200 mb-6 max-w-2xl mx-auto">
              Whether you need a quick consultation or a comprehensive development project, 
              I'm here to help. Let's schedule a call to discuss your requirements in detail.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:eric.petross@example.com?subject=Project Consultation Request"
                className="glass-button-primary px-6 py-3 rounded-lg font-medium transition-all duration-300 inline-flex items-center justify-center"
              >
                <Calendar size={16} className="mr-2" />
                Schedule Consultation
              </a>
              <a
                href="tel:+1234567890"
                className="glass-button px-6 py-3 rounded-lg font-medium transition-all duration-300 inline-flex items-center justify-center"
              >
                <Phone size={16} className="mr-2" />
                Call Now
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};