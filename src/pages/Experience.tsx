import React, { useState } from 'react';
import { Calendar, MapPin, Award, GraduationCap, Briefcase, ExternalLink } from 'lucide-react';
import { experiences, certifications } from '../data/portfolioData';
import type { Experience as ExperienceType, Certification } from '../types/portfolio';

const TimelineItem: React.FC<{ experience: ExperienceType; isLast: boolean }> = ({ experience, isLast }) => (
  <div className="relative">
    {/* Timeline Line */}
    {!isLast && (
      <div className="absolute left-6 top-16 w-0.5 h-full bg-gradient-to-b from-emerald-400 to-hunter-600"></div>
    )}
    
    {/* Timeline Dot */}
    <div className="absolute left-4 top-8 w-4 h-4 bg-emerald-400 rounded-full border-4 border-hunter-800 z-10"></div>
    
    {/* Content */}
    <div className="ml-16 mb-12">
      <div className="glass-card p-6 hover:glass-medium transition-all duration-300">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
          <h3 className="text-xl font-bold text-emerald-400 mb-2 md:mb-0">
            {experience.position}
          </h3>
          <div className="flex items-center text-hunter-300 text-sm">
            <Calendar size={16} className="mr-1" />
            <span>{experience.startDate.toLocaleDateString()} - {experience.endDate ? experience.endDate.toLocaleDateString() : 'Present'}</span>
          </div>
        </div>
        
        <div className="flex items-center mb-4">
          <Briefcase size={18} className="text-emerald-400 mr-2" />
          <span className="text-white font-semibold">{experience.company}</span>
          {experience.location && (
            <>
              <MapPin size={16} className="text-hunter-300 ml-4 mr-1" />
              <span className="text-hunter-300">{experience.location}</span>
            </>
          )}
        </div>
        
        {experience.responsibilities && (
          <div className="mb-4">
            <h4 className="text-white font-semibold mb-2">Key Responsibilities:</h4>
            <ul className="list-disc list-inside text-hunter-200 space-y-1">
              {experience.responsibilities.map((responsibility, index) => (
                <li key={index}>{responsibility}</li>
              ))}
            </ul>
          </div>
        )}
        
        {experience.achievements && experience.achievements.length > 0 && (
          <div className="mb-4">
            <h4 className="text-white font-semibold mb-2">Key Achievements:</h4>
            <ul className="list-disc list-inside text-hunter-200 space-y-1">
              {experience.achievements.map((achievement, index) => (
                <li key={index}>{achievement}</li>
              ))}
            </ul>
          </div>
        )}
        
        {experience.technologies && experience.technologies.length > 0 && (
          <div>
            <h4 className="text-white font-semibold mb-2">Technologies Used:</h4>
            <div className="flex flex-wrap gap-2">
              {experience.technologies.map((tech, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-hunter-700/50 text-emerald-300 rounded-full text-sm border border-emerald-400/20"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  </div>
);

const CertificationCard: React.FC<{ certification: Certification }> = ({ certification }) => (
  <div className="glass-card p-6 hover:glass-medium transition-all duration-300">
    <div className="flex items-start justify-between mb-4">
      <div className="flex items-center">
        <Award className="text-emerald-400 mr-3" size={24} />
        <div>
          <h3 className="text-lg font-bold text-white">{certification.name}</h3>
          <p className="text-emerald-400 font-semibold">{certification.issuer}</p>
        </div>
      </div>
      {certification.badgeUrl && (
        <a
          href={certification.badgeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-hunter-300 hover:text-emerald-400 transition-colors"
        >
          <ExternalLink size={20} />
        </a>
      )}
    </div>
    
    <div className="flex items-center text-hunter-300 text-sm mb-3">
      <Calendar size={16} className="mr-1" />
      <span>Completed: {certification.completionDate.toLocaleDateString()}</span>
      <span className="ml-4 px-2 py-1 bg-emerald-500/20 text-emerald-300 rounded text-xs">
        {certification.status}
      </span>
    </div>
    
    <div className="text-hunter-300 text-sm">
      Category: {certification.category}
    </div>
  </div>
);

const EducationCard: React.FC = () => (
  <div className="glass-card p-6">
    <div className="flex items-center mb-4">
      <GraduationCap className="text-emerald-400 mr-3" size={24} />
      <div>
        <h3 className="text-lg font-bold text-white">Continuous Learning & Professional Development</h3>
        <p className="text-emerald-400 font-semibold">Self-Directed & Industry Programs</p>
      </div>
    </div>
    
    <p className="text-hunter-200 leading-relaxed mb-4">
      Committed to continuous learning through a combination of self-directed study, 
      professional certifications, online courses, and industry conferences. 
      Staying current with emerging technologies and best practices in software development, 
      AI/ML, and business strategy.
    </p>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <h4 className="text-white font-semibold mb-2">Learning Focus Areas:</h4>
        <ul className="text-hunter-200 space-y-1">
          <li>• Advanced AI/ML Technologies</li>
          <li>• Cloud Architecture & DevOps</li>
          <li>• Business Strategy & Leadership</li>
          <li>• Emerging Programming Languages</li>
        </ul>
      </div>
      <div>
        <h4 className="text-white font-semibold mb-2">Learning Platforms:</h4>
        <ul className="text-hunter-200 space-y-1">
          <li>• Professional Certification Programs</li>
          <li>• Industry Conferences & Workshops</li>
          <li>• Open Source Contributions</li>
          <li>• Technical Documentation & Research</li>
        </ul>
      </div>
    </div>
  </div>
);

export const Experience: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'experience' | 'certifications' | 'education'>('experience');

  return (
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Professional Experience
          </h1>
          <p className="text-xl text-hunter-200 max-w-3xl mx-auto leading-relaxed">
            A comprehensive overview of my professional journey, certifications, and continuous 
            learning initiatives that have shaped my expertise in technology and business leadership.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-12">
          <div className="glass-subtle rounded-lg p-1">
            {[
              { id: 'experience', label: 'Work Experience', icon: <Briefcase size={20} /> },
              { id: 'certifications', label: 'Certifications', icon: <Award size={20} /> },
              { id: 'education', label: 'Education', icon: <GraduationCap size={20} /> },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center px-6 py-3 rounded-md font-medium transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30'
                    : 'text-hunter-200 hover:text-emerald-300 hover:bg-hunter-600/30'
                }`}
              >
                {tab.icon}
                <span className="ml-2">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto">
          {activeTab === 'experience' && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-8 text-center">
                Professional Timeline
              </h2>
              <div className="relative">
                {experiences.map((experience, index) => (
                  <TimelineItem
                    key={index}
                    experience={experience}
                    isLast={index === experiences.length - 1}
                  />
                ))}
              </div>
            </div>
          )}

          {activeTab === 'certifications' && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-8 text-center">
                Professional Certifications
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {certifications.map((certification, index) => (
                  <CertificationCard key={index} certification={certification} />
                ))}
              </div>
              <div className="mt-8 text-center">
                <p className="text-hunter-300">
                  Continuously pursuing additional certifications in emerging technologies and industry best practices.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'education' && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-8 text-center">
                Education & Learning
              </h2>
              <EducationCard />
            </div>
          )}
        </div>

        {/* Summary Stats */}
        <div className="mt-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-card p-6 text-center">
              <div className="text-3xl font-bold text-emerald-400 mb-2">
                {experiences.length}+
              </div>
              <div className="text-hunter-200">Professional Roles</div>
            </div>
            <div className="glass-card p-6 text-center">
              <div className="text-3xl font-bold text-emerald-400 mb-2">
                {certifications.length}+
              </div>
              <div className="text-hunter-200">Certifications Earned</div>
            </div>
            <div className="glass-card p-6 text-center">
              <div className="text-3xl font-bold text-emerald-400 mb-2">10+</div>
              <div className="text-hunter-200">Years of Experience</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};