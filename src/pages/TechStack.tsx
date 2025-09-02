import React, { useState } from 'react';
import { Code, Database, Cloud, Brain, Shield, Smartphone } from 'lucide-react';
import { techSkills } from '../data/portfolioData';
import type { TechSkill } from '../types/portfolio';

const TechBadge: React.FC<{ skill: TechSkill }> = ({ skill }) => {
  const getProficiencyColor = (level: string) => {
    switch (level) {
      case 'expert':
        return 'from-emerald-500 to-green-600';
      case 'advanced':
        return 'from-blue-500 to-cyan-600';
      case 'intermediate':
        return 'from-yellow-500 to-orange-600';
      case 'beginner':
        return 'from-gray-500 to-slate-600';
      default:
        return 'from-hunter-500 to-hunter-600';
    }
  };

  const getProficiencyWidth = (level: string) => {
    switch (level) {
      case 'expert':
        return 'w-full';
      case 'advanced':
        return 'w-4/5';
      case 'intermediate':
        return 'w-3/5';
      case 'beginner':
        return 'w-2/5';
      default:
        return 'w-1/2';
    }
  };

  return (
    <div className="glass-card p-4 hover:glass-medium transition-all duration-300 group">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-white group-hover:text-emerald-300 transition-colors">
          {skill.name}
        </h3>
        <span className={`px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${getProficiencyColor(skill.proficiencyLevel)} text-white`}>
          {skill.proficiencyLevel}
        </span>
      </div>
      
      {/* Proficiency Bar */}
      <div className="w-full bg-hunter-700/50 rounded-full h-2 mb-3">
        <div className={`h-2 bg-gradient-to-r ${getProficiencyColor(skill.proficiencyLevel)} rounded-full ${getProficiencyWidth(skill.proficiencyLevel)} transition-all duration-500`}></div>
      </div>
      
      {/* Badge */}
      {skill.badgeUrl && (
        <div className="text-xs text-hunter-300 bg-hunter-800/50 px-2 py-1 rounded">
          <img src={skill.badgeUrl} alt={`${skill.name} badge`} className="w-4 h-4 inline mr-1" />
          Badge
        </div>
      )}
    </div>
  );
};

const CategorySection: React.FC<{ title: string; icon: React.ReactNode; skills: TechSkill[]; description: string }> = ({ title, icon, skills, description }) => (
  <div className="mb-12">
    <div className="flex items-center mb-6">
      <div className="text-emerald-400 mr-3">{icon}</div>
      <h2 className="text-2xl font-bold text-white">{title}</h2>
    </div>
    <p className="text-hunter-200 mb-6 leading-relaxed">{description}</p>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {skills.map((skill, index) => (
        <TechBadge key={index} skill={skill} />
      ))}
    </div>
  </div>
);

export const TechStack: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All Technologies', icon: <Code size={20} /> },
    { id: 'Programming Languages', label: 'Languages', icon: <Code size={20} /> },
    { id: 'Frameworks & Libraries', label: 'Frameworks', icon: <Code size={20} /> },
    { id: 'Databases', label: 'Databases', icon: <Database size={20} /> },
    { id: 'Cloud & DevOps', label: 'Cloud & DevOps', icon: <Cloud size={20} /> },
    { id: 'AI/ML & Data Science', label: 'AI/ML', icon: <Brain size={20} /> },
    { id: 'Security & Compliance', label: 'Security', icon: <Shield size={20} /> },
    { id: 'Mobile Development', label: 'Mobile', icon: <Smartphone size={20} /> },
  ];

  const getFilteredSkills = () => {
    if (selectedCategory === 'all') {
      return techSkills;
    }
    return techSkills.filter(skill => skill.category === selectedCategory);
  };

  const getSkillsByCategory = () => {
    const skillsByCategory: { [key: string]: TechSkill[] } = {};
    techSkills.forEach(skill => {
      if (!skillsByCategory[skill.category]) {
        skillsByCategory[skill.category] = [];
      }
      skillsByCategory[skill.category].push(skill);
    });
    return skillsByCategory;
  };

  const getCategoryDescription = (category: string) => {
    const descriptions: { [key: string]: string } = {
      'Programming Languages': 'Core programming languages I use to build robust, scalable applications across different domains and platforms.',
      'Frameworks & Libraries': 'Modern frameworks and libraries that accelerate development while maintaining code quality and performance.',
      'Databases': 'Database technologies for efficient data storage, retrieval, and management in various application architectures.',
      'Cloud & DevOps': 'Cloud platforms and DevOps tools for scalable infrastructure, automated deployments, and reliable operations.',
      'AI/ML & Data Science': 'Artificial Intelligence and Machine Learning technologies for building intelligent, data-driven applications.',
      'Security & Compliance': 'Security frameworks and compliance tools to ensure robust protection and regulatory adherence.',
      'Mobile Development': 'Mobile development technologies for creating cross-platform and native mobile applications.',
    };
    return descriptions[category] || 'Specialized technologies and tools for modern software development.';
  };

  const getCategoryIcon = (category: string) => {
    const icons: { [key: string]: React.ReactNode } = {
      'Programming Languages': <Code size={24} />,
      'Frameworks & Libraries': <Code size={24} />,
      'Databases': <Database size={24} />,
      'Cloud & DevOps': <Cloud size={24} />,
      'AI/ML & Data Science': <Brain size={24} />,
      'Security & Compliance': <Shield size={24} />,
      'Mobile Development': <Smartphone size={24} />,
    };
    return icons[category] || <Code size={24} />;
  };

  return (
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Technology Stack
          </h1>
          <p className="text-xl text-hunter-200 max-w-3xl mx-auto leading-relaxed">
            A comprehensive overview of the technologies, frameworks, and tools I use to build 
            innovative solutions. From cutting-edge AI integration to robust cloud architectures.
          </p>
        </div>

        {/* Category Filter */}
        <div className="mb-12">
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  selectedCategory === category.id
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30'
                    : 'glass-subtle text-hunter-200 hover:text-emerald-300 hover:bg-hunter-600/30'
                }`}
              >
                {category.icon}
                <span className="ml-2">{category.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Skills Display */}
        {selectedCategory === 'all' ? (
          // Show all categories
          <div>
            {Object.entries(getSkillsByCategory()).map(([category, skills]) => (
              <CategorySection
                key={category}
                title={category}
                icon={getCategoryIcon(category)}
                skills={skills}
                description={getCategoryDescription(category)}
              />
            ))}
          </div>
        ) : (
          // Show filtered category
          <CategorySection
            title={categories.find(c => c.id === selectedCategory)?.label || selectedCategory}
            icon={getCategoryIcon(selectedCategory)}
            skills={getFilteredSkills()}
            description={getCategoryDescription(selectedCategory)}
          />
        )}

        {/* Proficiency Legend */}
        <div className="mt-16">
          <div className="glass-card p-6">
            <h3 className="text-xl font-bold text-white mb-4 text-center">Proficiency Levels</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { level: 'Expert', description: 'Deep expertise, can architect and lead', color: 'from-emerald-500 to-green-600' },
                { level: 'Advanced', description: 'Strong proficiency, production ready', color: 'from-blue-500 to-cyan-600' },
                { level: 'Intermediate', description: 'Solid understanding, can contribute', color: 'from-yellow-500 to-orange-600' },
                { level: 'Beginner', description: 'Learning and exploring', color: 'from-gray-500 to-slate-600' },
              ].map((item) => (
                <div key={item.level} className="text-center">
                  <div className={`w-full h-3 bg-gradient-to-r ${item.color} rounded-full mb-2`}></div>
                  <div className="text-white font-medium">{item.level}</div>
                  <div className="text-hunter-300 text-sm">{item.description}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};