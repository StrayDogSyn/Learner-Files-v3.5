import { useState } from 'react';
import { Mail, Phone, MapPin, Send, Github, Linkedin, Twitter, MessageCircle } from 'lucide-react';

interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const socialLinks = [
  {
    name: 'GitHub',
    icon: Github,
    url: 'https://github.com/yourusername',
    color: 'hover:text-gray-400'
  },
  {
    name: 'LinkedIn',
    icon: Linkedin,
    url: 'https://linkedin.com/in/yourprofile',
    color: 'hover:text-blue-400'
  },
  {
    name: 'Twitter',
    icon: Twitter,
    url: 'https://twitter.com/yourusername',
    color: 'hover:text-sky-400'
  }
];

const contactInfo = [
  {
    icon: Mail,
    label: 'Email',
    value: 'hello@yourname.com',
    href: 'mailto:hello@yourname.com'
  },
  {
    icon: Phone,
    label: 'Phone',
    value: '+1 (555) 123-4567',
    href: 'tel:+15551234567'
  },
  {
    icon: MapPin,
    label: 'Location',
    value: 'San Francisco, CA',
    href: null
  }
];

export const Contact = () => {
  const [formData, setFormData] = useState<ContactForm>({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSubmitStatus('idle'), 5000);
    }
  };

  return (
    <div className='min-h-screen py-20 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-6xl mx-auto'>
        {/* Header */}
        <div className='text-center mb-16'>
          <h1 className='text-4xl sm:text-5xl font-bold text-white mb-6'>Get In Touch</h1>
          <p className='text-xl text-hunter-200 max-w-3xl mx-auto'>
            Ready to start a conversation? Let's discuss your project and bring your ideas to life.
          </p>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-12'>
          {/* Contact Form */}
          <div className='glass-card p-8'>
            <div className='flex items-center mb-6'>
              <MessageCircle className='w-6 h-6 text-hunter-400 mr-3' />
              <h2 className='text-2xl font-bold text-white'>Send a Message</h2>
            </div>
            
            <form onSubmit={handleSubmit} className='space-y-6'>
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                <div>
                  <label htmlFor='name' className='block text-sm font-medium text-hunter-300 mb-2'>
                    Name *
                  </label>
                  <input
                    type='text'
                    id='name'
                    name='name'
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className='w-full px-4 py-3 bg-hunter-800/50 border border-hunter-700/50 rounded-lg text-white placeholder-hunter-400 focus:outline-none focus:ring-2 focus:ring-hunter-400 focus:border-transparent transition-all'
                    placeholder='Your name'
                  />
                </div>
                <div>
                  <label htmlFor='email' className='block text-sm font-medium text-hunter-300 mb-2'>
                    Email *
                  </label>
                  <input
                    type='email'
                    id='email'
                    name='email'
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className='w-full px-4 py-3 bg-hunter-800/50 border border-hunter-700/50 rounded-lg text-white placeholder-hunter-400 focus:outline-none focus:ring-2 focus:ring-hunter-400 focus:border-transparent transition-all'
                    placeholder='your@email.com'
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor='subject' className='block text-sm font-medium text-hunter-300 mb-2'>
                  Subject *
                </label>
                <input
                  type='text'
                  id='subject'
                  name='subject'
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  className='w-full px-4 py-3 bg-hunter-800/50 border border-hunter-700/50 rounded-lg text-white placeholder-hunter-400 focus:outline-none focus:ring-2 focus:ring-hunter-400 focus:border-transparent transition-all'
                  placeholder='Project discussion'
                />
              </div>
              
              <div>
                <label htmlFor='message' className='block text-sm font-medium text-hunter-300 mb-2'>
                  Message *
                </label>
                <textarea
                  id='message'
                  name='message'
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={6}
                  className='w-full px-4 py-3 bg-hunter-800/50 border border-hunter-700/50 rounded-lg text-white placeholder-hunter-400 focus:outline-none focus:ring-2 focus:ring-hunter-400 focus:border-transparent transition-all resize-none'
                  placeholder='Tell me about your project...'
                />
              </div>
              
              <button
                type='submit'
                disabled={isSubmitting}
                className='w-full glass-button-primary flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed'
              >
                {isSubmitting ? (
                  <>
                    <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <Send className='w-4 h-4' />
                    <span>Send Message</span>
                  </>
                )}
              </button>
              
              {submitStatus === 'success' && (
                <div className='p-4 bg-green-500/20 border border-green-500/50 rounded-lg text-green-400 text-center'>
                  Message sent successfully! I'll get back to you soon.
                </div>
              )}
              
              {submitStatus === 'error' && (
                <div className='p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-center'>
                  Failed to send message. Please try again or contact me directly.
                </div>
              )}
            </form>
          </div>

          {/* Contact Information */}
          <div className='space-y-8'>
            {/* Contact Details */}
            <div className='glass-card p-8'>
              <h2 className='text-2xl font-bold text-white mb-6'>Contact Information</h2>
              <div className='space-y-4'>
                {contactInfo.map((info, index) => {
                  const IconComponent = info.icon;
                  const content = (
                    <div className='flex items-center space-x-4 p-4 glass-subtle rounded-lg transition-all hover:bg-hunter-800/30'>
                      <div className='w-12 h-12 bg-gradient-to-br from-hunter-500 to-hunter-600 rounded-lg flex items-center justify-center'>
                        <IconComponent className='w-6 h-6 text-white' />
                      </div>
                      <div>
                        <h3 className='text-white font-semibold'>{info.label}</h3>
                        <p className='text-hunter-300'>{info.value}</p>
                      </div>
                    </div>
                  );
                  
                  return info.href ? (
                    <a key={index} href={info.href} className='block'>
                      {content}
                    </a>
                  ) : (
                    <div key={index}>
                      {content}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Social Links */}
            <div className='glass-card p-8'>
              <h2 className='text-2xl font-bold text-white mb-6'>Connect With Me</h2>
              <div className='flex space-x-4'>
                {socialLinks.map((social, index) => {
                  const IconComponent = social.icon;
                  return (
                    <a
                      key={index}
                      href={social.url}
                      target='_blank'
                      rel='noopener noreferrer'
                      className={`w-12 h-12 glass-subtle rounded-lg flex items-center justify-center text-hunter-400 transition-all hover:scale-110 ${social.color}`}
                    >
                      <IconComponent className='w-6 h-6' />
                    </a>
                  );
                })}
              </div>
              <p className='text-hunter-300 mt-4 text-sm'>
                Follow me on social media for updates on my latest projects and tech insights.
              </p>
            </div>

            {/* Availability */}
            <div className='glass-card p-8'>
              <h2 className='text-2xl font-bold text-white mb-4'>Availability</h2>
              <div className='space-y-3'>
                <div className='flex items-center justify-between'>
                  <span className='text-hunter-300'>Response Time</span>
                  <span className='text-white font-semibold'>Within 24 hours</span>
                </div>
                <div className='flex items-center justify-between'>
                  <span className='text-hunter-300'>Time Zone</span>
                  <span className='text-white font-semibold'>PST (UTC-8)</span>
                </div>
                <div className='flex items-center justify-between'>
                  <span className='text-hunter-300'>Preferred Contact</span>
                  <span className='text-white font-semibold'>Email</span>
                </div>
              </div>
              <div className='mt-4 p-3 bg-green-500/20 border border-green-500/50 rounded-lg'>
                <div className='flex items-center space-x-2'>
                  <div className='w-2 h-2 bg-green-500 rounded-full animate-pulse'></div>
                  <span className='text-green-400 text-sm font-semibold'>Available for new projects</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
