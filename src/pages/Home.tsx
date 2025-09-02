import React, { useState, useEffect } from 'react';
import { Github, Linkedin, Mail, ExternalLink, Code, Users, Award } from 'lucide-react';
import { developerProfile, heroTypingTexts } from '../data/portfolioData';
import type { TypingAnimationProps } from '../types/portfolio';

const TypingAnimation: React.FC<TypingAnimationProps> = ({ texts, speed = 100, delay = 2000 }) => {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const fullText = texts[currentTextIndex];
      
      if (isDeleting) {
        setCurrentText(fullText.substring(0, currentText.length - 1));
      } else {
        setCurrentText(fullText.substring(0, currentText.length + 1));
      }

      if (!isDeleting && currentText === fullText) {
        setTimeout(() => setIsDeleting(true), delay);
      } else if (isDeleting && currentText === '') {
        setIsDeleting(false);
        setCurrentTextIndex((prev) => (prev + 1) % texts.length);
      }
    }, isDeleting ? speed / 2 : speed);

    return () => clearTimeout(timeout);
  }, [currentText, isDeleting, currentTextIndex, texts, speed, delay]);

  return (
    <span className="text-emerald-400">
      {currentText}
      <span className="animate-pulse">|</span>
    </span>
  );
};

const StatCard: React.FC<{ icon: React.ReactNode; value: string; label: string }> = ({ icon, value, label }) => (
  <div className="glass-card p-6 text-center hover:glass-medium transition-all duration-300">
    <div className="flex justify-center mb-3 text-emerald-400">
      {icon}
    </div>
    <div className="text-2xl font-bold text-white mb-1">{value}</div>
    <div className="text-hunter-200 text-sm">{label}</div>
  </div>
);

export const Home: React.FC = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            {/* Profile Image */}
            <div className="mb-8">
              <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-hunter-400 to-emerald-500 p-1">
                <div className="w-full h-full rounded-full bg-hunter-800 flex items-center justify-center">
                  <span className="text-4xl font-bold text-white">EH</span>
                </div>
              </div>
            </div>

            {/* Name and Title */}
            <h1 className="text-4xl sm:text-6xl font-bold text-white mb-4">
              {developerProfile.name}
            </h1>
            <div className="text-xl sm:text-2xl text-hunter-200 mb-6">
              <span>I'm a </span>
              <TypingAnimation texts={heroTypingTexts} speed={100} delay={2000} />
            </div>

            {/* Bio */}
            <p className="text-lg text-hunter-300 max-w-3xl mx-auto mb-8 leading-relaxed">
              {developerProfile.bio}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <a
                href={`mailto:${developerProfile.contactMethods.find(c => c.type === 'email')?.value}`}
                className="glass-button-primary px-8 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105"
              >
                <Mail className="inline-block w-5 h-5 mr-2" />
                Get In Touch
              </a>
              <a
                href={developerProfile.digitalProperties.find(p => p.name === 'GitHub')?.url}
                target="_blank"
                rel="noopener noreferrer"
                className="glass-button px-8 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105"
              >
                <Github className="inline-block w-5 h-5 mr-2" />
                View Projects
              </a>
            </div>

            {/* Social Links */}
            <div className="flex justify-center space-x-6">
              {developerProfile.digitalProperties.map((property) => {
                const getIcon = () => {
                  switch (property.name) {
                    case 'GitHub':
                      return <Github size={24} />;
                    case 'LinkedIn':
                      return <Linkedin size={24} />;
                    default:
                      return <ExternalLink size={24} />;
                  }
                };

                return (
                  <a
                    key={property.name}
                    href={property.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-hunter-300 hover:text-emerald-400 transition-colors duration-300"
                  >
                    {getIcon()}
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Professional Highlights
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <StatCard
              icon={<Code size={32} />}
              value="15+"
              label="Programming Languages"
            />
            <StatCard
              icon={<Award size={32} />}
              value="25+"
              label="Certifications"
            />
            <StatCard
              icon={<Users size={32} />}
              value="10+"
              label="Years Experience"
            />
          </div>
        </div>
      </section>

      {/* Key Differentiators */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            What Sets Me Apart
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {developerProfile.professionalDifferentiators.map((differentiator, index) => (
              <div key={index} className="glass-card p-6 hover:glass-medium transition-all duration-300">
                <h3 className="text-xl font-semibold text-emerald-400 mb-3">
                  {differentiator}
                </h3>
                <p className="text-hunter-200">
                  Specialized expertise in {differentiator.toLowerCase()} with proven track record of delivering innovative solutions.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};