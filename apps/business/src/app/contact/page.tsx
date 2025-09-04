'use client';

import { useState } from 'react';
import { Button } from '@straydog/ui-components';
import { useAIOrchestrator } from '@straydog/ai-orchestrator';
import { ArrowLeft, Mail, Phone, MapPin, Clock, Send, MessageSquare, Calendar } from 'lucide-react';
import Link from 'next/link';

interface ContactForm {
  name: string;
  email: string;
  company: string;
  service: string;
  message: string;
}

const services = [
  'Legal Document Analysis',
  'Business Intelligence Suite',
  'Compliance Monitoring',
  'Stakeholder Management',
  'Custom AI Solution',
  'Enterprise Consultation'
];

export default function ContactPage() {
  const [formData, setFormData] = useState<ContactForm>({
    name: '',
    email: '',
    company: '',
    service: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const { processRequest } = useAIOrchestrator();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Simulate form submission with AI processing
      await processRequest(
        `Process contact form submission for ${formData.name} from ${formData.company} interested in ${formData.service}. Message: ${formData.message}`,
        'business'
      );
      
      setSubmitStatus('success');
      setFormData({ name: '', email: '', company: '', service: '', message: '' });
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
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
            <Link href="/services" className="text-hunter-green-300 hover:text-white transition-colors">
              Services
            </Link>
            <Link href="/analytics" className="text-hunter-green-300 hover:text-white transition-colors">
              Analytics
            </Link>
            <Button variant="outline" size="sm">
              Schedule Call
            </Button>
          </div>
        </div>
      </nav>

      {/* Header */}
      <section className="px-6 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Get in <span className="gradient-text">Touch</span>
          </h1>
          <p className="text-xl text-hunter-green-200 mb-8 max-w-2xl mx-auto">
            Ready to transform your business with AI? Let's discuss your needs and create a custom solution.
          </p>
        </div>
      </section>

      <div className="px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="glass-card p-8">
              <h2 className="text-2xl font-semibold mb-6 flex items-center">
                <MessageSquare className="h-6 w-6 mr-2 text-tech-accent-400" />
                Send us a Message
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-hunter-green-200 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-hunter-green-800/50 border border-hunter-green-600 rounded-lg focus:ring-2 focus:ring-tech-accent-400 focus:border-transparent text-white placeholder-hunter-green-400"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-hunter-green-200 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-hunter-green-800/50 border border-hunter-green-600 rounded-lg focus:ring-2 focus:ring-tech-accent-400 focus:border-transparent text-white placeholder-hunter-green-400"
                      placeholder="john@company.com"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-hunter-green-200 mb-2">
                    Company Name
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-hunter-green-800/50 border border-hunter-green-600 rounded-lg focus:ring-2 focus:ring-tech-accent-400 focus:border-transparent text-white placeholder-hunter-green-400"
                    placeholder="Your Company"
                  />
                </div>
                
                <div>
                  <label htmlFor="service" className="block text-sm font-medium text-hunter-green-200 mb-2">
                    Service of Interest
                  </label>
                  <select
                    id="service"
                    name="service"
                    value={formData.service}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-hunter-green-800/50 border border-hunter-green-600 rounded-lg focus:ring-2 focus:ring-tech-accent-400 focus:border-transparent text-white"
                  >
                    <option value="">Select a service</option>
                    {services.map((service, index) => (
                      <option key={index} value={service}>{service}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-hunter-green-200 mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={5}
                    className="w-full px-4 py-3 bg-hunter-green-800/50 border border-hunter-green-600 rounded-lg focus:ring-2 focus:ring-tech-accent-400 focus:border-transparent text-white placeholder-hunter-green-400 resize-none"
                    placeholder="Tell us about your business needs and how we can help..."
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="glass-button w-full" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    'Sending...'
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Send Message
                    </>
                  )}
                </Button>
                
                {submitStatus === 'success' && (
                  <div className="p-4 bg-green-500/20 border border-green-400/30 rounded-lg">
                    <p className="text-green-300 text-sm">
                      Thank you! Your message has been sent successfully. We'll get back to you within 24 hours.
                    </p>
                  </div>
                )}
                
                {submitStatus === 'error' && (
                  <div className="p-4 bg-red-500/20 border border-red-400/30 rounded-lg">
                    <p className="text-red-300 text-sm">
                      Sorry, there was an error sending your message. Please try again or contact us directly.
                    </p>
                  </div>
                )}
              </form>
            </div>

            {/* Contact Information */}
            <div className="space-y-8">
              {/* Contact Details */}
              <div className="glass-card p-8">
                <h2 className="text-2xl font-semibold mb-6 gradient-text">
                  Contact Information
                </h2>
                
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-hunter-green-600/30 rounded-lg">
                      <Mail className="h-6 w-6 text-tech-accent-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Email</h3>
                      <p className="text-hunter-green-200">business@straydogsyndicate.com</p>
                      <p className="text-sm text-hunter-green-300">We respond within 24 hours</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-hunter-green-600/30 rounded-lg">
                      <Phone className="h-6 w-6 text-tech-accent-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Phone</h3>
                      <p className="text-hunter-green-200">+1 (555) 123-4567</p>
                      <p className="text-sm text-hunter-green-300">Mon-Fri, 9AM-6PM EST</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-hunter-green-600/30 rounded-lg">
                      <MapPin className="h-6 w-6 text-tech-accent-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Office</h3>
                      <p className="text-hunter-green-200">123 Innovation Drive</p>
                      <p className="text-hunter-green-200">Tech City, TC 12345</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-hunter-green-600/30 rounded-lg">
                      <Clock className="h-6 w-6 text-tech-accent-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Business Hours</h3>
                      <p className="text-hunter-green-200">Monday - Friday: 9:00 AM - 6:00 PM</p>
                      <p className="text-hunter-green-200">Saturday: 10:00 AM - 4:00 PM</p>
                      <p className="text-hunter-green-200">Sunday: Closed</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="glass-card p-8">
                <h2 className="text-2xl font-semibold mb-6 gradient-text">
                  Quick Actions
                </h2>
                
                <div className="space-y-4">
                  <Button className="glass-button w-full justify-start">
                    <Calendar className="mr-3 h-5 w-5" />
                    Schedule a Demo
                  </Button>
                  
                  <Button variant="outline" className="w-full justify-start">
                    <MessageSquare className="mr-3 h-5 w-5" />
                    Live Chat Support
                  </Button>
                  
                  <Button variant="outline" className="w-full justify-start">
                    <Phone className="mr-3 h-5 w-5" />
                    Request Callback
                  </Button>
                </div>
                
                <div className="mt-6 p-4 bg-tech-accent-500/20 rounded-lg border border-tech-accent-400/30">
                  <p className="text-sm text-tech-accent-300">
                    <strong>Enterprise clients:</strong> Contact our dedicated enterprise team for priority support and custom solutions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}