import { useState } from 'react';
import { Mail, Phone, MapPin, Send, Github, Linkedin, ExternalLink } from 'lucide-react';

export const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log('Form submitted:', formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Get In Touch
          </h1>
          <p className="text-xl text-hunter-200 max-w-3xl mx-auto">
            Ready to start a conversation? Let's discuss how we can work together to bring your ideas to life.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-hunter-800/50 backdrop-blur-md border border-hunter-600/30 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Send a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-hunter-200 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-hunter-700/50 border border-hunter-600/30 rounded-lg text-white placeholder-hunter-300 focus:outline-none focus:ring-2 focus:ring-hunter-500 focus:border-transparent"
                  placeholder="Your full name"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-hunter-200 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-hunter-700/50 border border-hunter-600/30 rounded-lg text-white placeholder-hunter-300 focus:outline-none focus:ring-2 focus:ring-hunter-500 focus:border-transparent"
                  placeholder="your.email@example.com"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-hunter-200 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-hunter-700/50 border border-hunter-600/30 rounded-lg text-white placeholder-hunter-300 focus:outline-none focus:ring-2 focus:ring-hunter-500 focus:border-transparent"
                  placeholder="What's this about?"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-hunter-200 mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full px-4 py-3 bg-hunter-700/50 border border-hunter-600/30 rounded-lg text-white placeholder-hunter-300 focus:outline-none focus:ring-2 focus:ring-hunter-500 focus:border-transparent resize-none"
                  placeholder="Tell me about your project or how I can help..."
                />
              </div>

              <button
                type="submit"
                className="w-full inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-hunter-500 to-hunter-600 text-white font-semibold rounded-lg hover:from-hunter-600 hover:to-hunter-700 transition-all duration-200 transform hover:scale-105"
              >
                <Send className="mr-2 h-5 w-5" />
                Send Message
              </button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            {/* Direct Contact */}
            <div className="bg-hunter-800/50 backdrop-blur-md border border-hunter-600/30 rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Contact Information</h2>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-hunter-500/30 rounded-full flex items-center justify-center">
                    <Mail className="h-6 w-6 text-hunter-300" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Email</h3>
                    <a
                      href="mailto:hello@straydog-syndications-llc.com"
                      className="text-hunter-300 hover:text-hunter-200 transition-colors"
                    >
                      hello@straydog-syndications-llc.com
                    </a>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-hunter-500/30 rounded-full flex items-center justify-center">
                    <MapPin className="h-6 w-6 text-hunter-300" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Location</h3>
                    <p className="text-hunter-300">Available for remote collaboration worldwide</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="bg-hunter-800/50 backdrop-blur-md border border-hunter-600/30 rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Connect With Me</h2>
              <div className="space-y-4">
                <a
                  href="https://github.com/StrayDogSyn"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-4 p-4 bg-hunter-700/50 rounded-lg hover:bg-hunter-600/50 transition-all duration-200 group"
                >
                  <div className="w-12 h-12 bg-hunter-500/30 rounded-full flex items-center justify-center">
                    <Github className="h-6 w-6 text-hunter-300 group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white group-hover:text-hunter-200 transition-colors">
                      GitHub
                    </h3>
                    <p className="text-hunter-300">View my projects and contributions</p>
                  </div>
                  <ExternalLink className="h-5 w-5 text-hunter-400 ml-auto" />
                </a>

                <a
                  href="https://linkedin.com/in/eric-petross"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-4 p-4 bg-hunter-700/50 rounded-lg hover:bg-hunter-600/50 transition-all duration-200 group"
                >
                  <div className="w-12 h-12 bg-hunter-500/30 rounded-full flex items-center justify-center">
                    <Linkedin className="h-6 w-6 text-hunter-300 group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white group-hover:text-hunter-200 transition-colors">
                      LinkedIn
                    </h3>
                    <p className="text-hunter-300">Connect professionally</p>
                  </div>
                  <ExternalLink className="h-5 w-5 text-hunter-400 ml-auto" />
                </a>
              </div>
            </div>

            {/* Response Time */}
            <div className="bg-gradient-to-r from-hunter-800/80 to-hunter-700/80 backdrop-blur-md border border-hunter-600/30 rounded-2xl p-8">
              <h3 className="text-xl font-bold text-white mb-3">Response Time</h3>
              <p className="text-hunter-200">
                I typically respond to all inquiries within 24 hours. For urgent matters, 
                please include "URGENT" in your subject line.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-hunter-800/80 to-hunter-700/80 backdrop-blur-md border border-hunter-600/30 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              Ready to Start Your Project?
            </h2>
            <p className="text-hunter-200 mb-6 max-w-2xl mx-auto">
              Whether you have a specific project in mind or just want to explore possibilities, 
              I'm here to help bring your vision to life.
            </p>
            <a
              href="mailto:hello@straydog-syndications-llc.com"
              className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-hunter-500 to-hunter-600 text-white font-semibold rounded-lg hover:from-hunter-600 hover:to-hunter-700 transition-all duration-200 transform hover:scale-105"
            >
              <Mail className="mr-2 h-5 w-5" />
              Send Direct Email
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};