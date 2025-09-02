import { useState } from 'react';
import { projects } from '../data';
import { ExternalLink, Github, Filter } from 'lucide-react';

export const Portfolio = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = [
    { id: 'all', label: 'All Projects' },
    { id: 'ai-ml', label: 'AI/ML' },
    { id: 'web-dev', label: 'Web Development' },
    { id: 'data-science', label: 'Data Science' },
    { id: 'automation', label: 'Automation' },
  ];

  const filteredProjects = projects.filter(project => {
    const matchesCategory = selectedCategory === 'all' || project.category === selectedCategory;
    const matchesSearch =
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className='min-h-screen py-20 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-7xl mx-auto'>
        {/* Header */}
        <div className='text-center mb-16'>
          <h1 className='text-4xl sm:text-5xl font-bold text-white mb-6'>My Portfolio</h1>
          <p className='text-xl text-hunter-200 max-w-3xl mx-auto'>
            A collection of projects showcasing my journey from culinary arts to software
            engineering, with a focus on AI/ML, full-stack development, and innovative solutions.
          </p>
        </div>

        {/* Filters and Search */}
        <div className='mb-12'>
          <div className='flex flex-col lg:flex-row gap-6 items-center justify-between'>
            {/* Category Filter */}
            <div className='flex flex-wrap gap-3'>
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    selectedCategory === category.id
                      ? 'bg-hunter-500 text-white border border-hunter-400'
                      : 'bg-hunter-800/50 text-hunter-200 border border-hunter-600/30 hover:bg-hunter-700/50 hover:text-hunter-100'
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className='relative'>
              <input
                type='text'
                placeholder='Search projects...'
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className='pl-10 pr-4 py-2 bg-hunter-800/50 border border-hunter-600/30 rounded-lg text-white placeholder-hunter-300 focus:outline-none focus:ring-2 focus:ring-hunter-500 focus:border-transparent'
              />
              <Filter className='absolute left-3 top-2.5 h-5 w-5 text-hunter-400' />
            </div>
          </div>
        </div>

        {/* Projects Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
          {filteredProjects.map(project => (
            <div
              key={project.id}
              className='bg-hunter-800/50 backdrop-blur-md border border-hunter-600/30 rounded-xl overflow-hidden hover:transform hover:scale-105 transition-all duration-200 group'
            >
              {/* Project Image */}
              <div className='h-48 bg-gradient-to-br from-hunter-700 to-hunter-600 flex items-center justify-center'>
                <div className='text-center text-white'>
                  <div className='w-16 h-16 bg-hunter-500/30 rounded-full flex items-center justify-center mx-auto mb-3'>
                    <span className='text-2xl font-bold'>{project.title.charAt(0)}</span>
                  </div>
                  <p className='text-sm text-hunter-200'>{project.category}</p>
                </div>
              </div>

              {/* Project Content */}
              <div className='p-6'>
                <h3 className='text-xl font-semibold text-white mb-3 group-hover:text-hunter-300 transition-colors'>
                  {project.title}
                </h3>
                <p className='text-hunter-200 mb-4 leading-relaxed'>{project.description}</p>

                {/* Technologies */}
                <div className='flex flex-wrap gap-2 mb-6'>
                  {project.technologies.map((tech, index) => (
                    <span
                      key={index}
                      className='px-3 py-1 bg-hunter-700/50 text-hunter-200 text-sm rounded-full border border-hunter-600/30'
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Project Links */}
                <div className='flex gap-3'>
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='flex items-center gap-2 px-4 py-2 bg-hunter-700/50 text-hunter-200 rounded-lg hover:bg-hunter-600 hover:text-white transition-all duration-200 border border-hunter-600/30'
                    >
                      <Github className='h-4 w-4' />
                      Code
                    </a>
                  )}
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-hunter-500 to-hunter-600 text-white rounded-lg hover:from-hunter-600 hover:to-hunter-700 transition-all duration-200'
                    >
                      <ExternalLink className='h-4 w-4' />
                      Live Demo
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredProjects.length === 0 && (
          <div className='text-center py-16'>
            <div className='text-6xl mb-4'>🔍</div>
            <h3 className='text-2xl font-semibold text-white mb-2'>No projects found</h3>
            <p className='text-hunter-200'>Try adjusting your search terms or category filter</p>
          </div>
        )}

        {/* CTA */}
        <div className='text-center mt-16'>
          <div className='bg-gradient-to-r from-hunter-800/80 to-hunter-700/80 backdrop-blur-md border border-hunter-600/30 rounded-2xl p-8'>
            <h3 className='text-2xl font-bold text-white mb-4'>Have a project in mind?</h3>
            <p className='text-hunter-200 mb-6'>
              Let's collaborate to bring your ideas to life with cutting-edge technology
            </p>
            <a
              href='/contact'
              className='inline-flex items-center px-8 py-3 bg-gradient-to-r from-hunter-500 to-hunter-600 text-white font-semibold rounded-lg hover:from-hunter-600 hover:to-hunter-700 transition-all duration-200 transform hover:scale-105'
            >
              Let's Talk
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
