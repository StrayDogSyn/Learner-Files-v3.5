import React, { useState, useMemo } from 'react';
import { projects, personalInfo } from '@/data/projects';
import { Project, FilterState } from '@/types/core';

const Portfolio: React.FC = () => {
  const [filters, setFilters] = useState<FilterState>({
    category: 'all',
    technology: 'all',
    status: 'all'
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const filteredProjects = useMemo(() => {
    return projects.filter(project => {
      const matchesCategory = filters.category === 'all' || project.category === filters.category;
      const matchesStatus = filters.status === 'all' || project.status === filters.status;
      const matchesTechnology = filters.technology === 'all' || 
        project.technologies.some(tech => tech.toLowerCase().includes(filters.technology.toLowerCase()));
      const matchesSearch = searchQuery === '' || 
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchesCategory && matchesStatus && matchesTechnology && matchesSearch;
    });
  }, [filters, searchQuery]);

  const featuredProjects = projects.filter(project => project.featured);

  const categories = ['all', ...Array.from(new Set(projects.map(p => p.category)))];
  const statuses = ['all', ...Array.from(new Set(projects.map(p => p.status)))];
  const technologies = ['all', ...Array.from(new Set(projects.flatMap(p => p.technologies)))];

  const handleFilterChange = (filterType: keyof FilterState, value: string) => {
    setFilters(prev => ({ ...prev, [filterType]: value }));
  };

  const ProjectCard: React.FC<{ project: Project }> = ({ project }) => (
    <div 
      className="project-card glass-card p-6 rounded-xl cursor-pointer transition-all duration-300 hover:scale-105"
      onClick={() => setSelectedProject(project)}
    >
      {project.imageUrl && (
        <div className="project-image mb-4 rounded-lg overflow-hidden">
          <img 
            src={project.imageUrl} 
            alt={project.title}
            className="w-full h-48 object-cover transition-transform duration-300 hover:scale-110"
          />
        </div>
      )}
      
      <div className="project-content">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xl font-semibold text-hunter-green">{project.title}</h3>
          <span className={`status-badge ${project.status}`}>
            {project.status}
          </span>
        </div>
        
        <p className="text-gray-600 mb-4 line-clamp-3">{project.description}</p>
        
        <div className="technologies mb-4">
          <div className="flex flex-wrap gap-2">
            {project.technologies.slice(0, 4).map((tech, index) => (
              <span key={index} className="tech-tag">
                {tech}
              </span>
            ))}
            {project.technologies.length > 4 && (
              <span className="tech-tag opacity-60">
                +{project.technologies.length - 4} more
              </span>
            )}
          </div>
        </div>
        
        <div className="project-links flex gap-3">
          {project.liveUrl && (
            <a 
              href={project.liveUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn btn-primary"
              onClick={(e) => e.stopPropagation()}
            >
              Live Demo
            </a>
          )}
          {project.githubUrl && (
            <a 
              href={project.githubUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn btn-secondary"
              onClick={(e) => e.stopPropagation()}
            >
              GitHub
            </a>
          )}
        </div>
      </div>
    </div>
  );

  const ProjectModal: React.FC<{ project: Project; onClose: () => void }> = ({ project, onClose }) => (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content glass-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="text-2xl font-bold text-hunter-green">{project.title}</h2>
          <button 
            onClick={onClose}
            className="close-button text-2xl text-gray-500 hover:text-hunter-green"
          >
            ×
          </button>
        </div>
        
        {project.imageUrl && (
          <div className="modal-image mb-6">
            <img 
              src={project.imageUrl} 
              alt={project.title}
              className="w-full h-64 object-cover rounded-lg"
            />
          </div>
        )}
        
        <div className="modal-body">
          <p className="text-gray-700 mb-6">{project.description}</p>
          
          <div className="project-details grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-hunter-green mb-2">Technologies</h4>
              <div className="flex flex-wrap gap-2 mb-4">
                {project.technologies.map((tech, index) => (
                  <span key={index} className="tech-tag">{tech}</span>
                ))}
              </div>
            </div>
            
            {project.highlights && (
              <div>
                <h4 className="font-semibold text-hunter-green mb-2">Key Highlights</h4>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  {project.highlights.map((highlight, index) => (
                    <li key={index}>{highlight}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {project.challenges && (
              <div>
                <h4 className="font-semibold text-hunter-green mb-2">Challenges</h4>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  {project.challenges.map((challenge, index) => (
                    <li key={index}>{challenge}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {project.learnings && (
              <div>
                <h4 className="font-semibold text-hunter-green mb-2">Key Learnings</h4>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  {project.learnings.map((learning, index) => (
                    <li key={index}>{learning}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          
          <div className="modal-actions mt-6 flex gap-4">
            {project.liveUrl && (
              <a 
                href={project.liveUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn btn-primary"
              >
                View Live Demo
              </a>
            )}
            {project.githubUrl && (
              <a 
                href={project.githubUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn btn-secondary"
              >
                View Code
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="portfolio-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">{personalInfo.name}</h1>
          <h2 className="hero-subtitle">{personalInfo.title}</h2>
          <p className="hero-tagline">{personalInfo.tagline}</p>
          <p className="hero-bio">{personalInfo.bio}</p>
          
          <div className="hero-actions">
            <a href={`mailto:${personalInfo.email}`} className="btn btn-primary">
              Get In Touch
            </a>
            <a href={personalInfo.social.github} target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
              View GitHub
            </a>
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="featured-section">
        <h2 className="section-title">Featured Projects</h2>
        <div className="projects-grid featured-grid">
          {featuredProjects.map(project => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </section>

      {/* All Projects */}
      <section className="projects-section">
        <div className="section-header">
          <h2 className="section-title">All Projects</h2>
          
          {/* Search and Filters */}
          <div className="filters-container">
            <div className="search-box">
              <input
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>
            
            <div className="filters">
              <select 
                value={filters.category} 
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="filter-select"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
              
              <select 
                value={filters.status} 
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="filter-select"
              >
                {statuses.map(status => (
                  <option key={status} value={status}>
                    {status === 'all' ? 'All Status' : status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>
              
              <select 
                value={filters.technology} 
                onChange={(e) => handleFilterChange('technology', e.target.value)}
                className="filter-select"
              >
                {technologies.slice(0, 10).map(tech => (
                  <option key={tech} value={tech}>
                    {tech === 'all' ? 'All Technologies' : tech}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        
        <div className="projects-grid">
          {filteredProjects.map(project => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
        
        {filteredProjects.length === 0 && (
          <div className="no-results">
            <p>No projects found matching your criteria.</p>
          </div>
        )}
      </section>

      {/* Skills Section */}
      <section className="skills-section">
        <h2 className="section-title">Skills & Technologies</h2>
        <div className="skills-grid">
          {personalInfo.skills.map((skillGroup, index) => (
            <div key={index} className="skill-group glass-card">
              <h3 className="skill-category">{skillGroup.category}</h3>
              <div className="skill-items">
                {skillGroup.items.map((skill, skillIndex) => (
                  <span key={skillIndex} className="skill-tag">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section className="contact-section">
        <h2 className="section-title">Let's Connect</h2>
        <div className="contact-content">
          <p className="contact-description">
            I'm always interested in new opportunities and collaborations. 
            Let's discuss how we can work together!
          </p>
          
          <div className="contact-links">
            <a href={`mailto:${personalInfo.email}`} className="contact-link">
              Email
            </a>
            <a href={personalInfo.social.linkedin} target="_blank" rel="noopener noreferrer" className="contact-link">
              LinkedIn
            </a>
            <a href={personalInfo.social.github} target="_blank" rel="noopener noreferrer" className="contact-link">
              GitHub
            </a>
          </div>
        </div>
      </section>

      {/* Project Modal */}
      {selectedProject && (
        <ProjectModal 
          project={selectedProject} 
          onClose={() => setSelectedProject(null)} 
        />
      )}
    </div>
  );
};

export default Portfolio;