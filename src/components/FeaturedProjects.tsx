import React from 'react';
import { FaGithub, FaExternalLinkAlt, FaPlay, FaCode, FaRocket } from 'react-icons/fa';
import { getFeaturedProjects } from '../data/projects';
import GlassCard from './GlassCard';
import BrandImage from './BrandImage';

const FeaturedProjects: React.FC = () => {
  const featuredProjects = getFeaturedProjects();

  return (
    <section id='featured-projects' className='py-20 relative z-10 w-full'>
      <div className='w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='text-center mb-16'>
          <h2 className='font-display text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-hunter-emerald to-metallic-silver bg-clip-text text-transparent'>
            Featured Projects
          </h2>
          <p className='text-xl text-metallic-silver/80 max-w-3xl mx-auto leading-relaxed'>
            Real projects built with real experience. Each one represents a unique challenge and
            demonstrates my commitment to creating exceptional digital experiences.
          </p>
        </div>

        <div className='space-y-16'>
          {featuredProjects.map((project, index) => (
            <div key={project.id} className='relative'>
              {/* Project Showcase */}
              <GlassCard variant='premium' className='overflow-hidden'>
                <div className='grid lg:grid-cols-2 gap-8 items-center'>
                  {/* Project Image */}
                  <div className='relative group'>
                    <div className='relative overflow-hidden rounded-lg'>
                      <img
                        src={project.image}
                        alt={project.title}
                        className='w-full h-64 lg:h-80 object-cover transition-transform duration-500 group-hover:scale-105'
                      />
                      <div className='absolute inset-0 bg-gradient-to-t from-charcoal-dark/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300' />

                      {/* Overlay with CTA */}
                      <div className='absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                        <div className='flex space-x-4'>
                          {project.liveUrl && (
                            <a
                              href={project.liveUrl}
                              target='_blank'
                              rel='noopener noreferrer'
                              className='flex items-center px-6 py-3 bg-gradient-to-r from-hunter-emerald to-metallic-silver text-charcoal-dark font-semibold rounded-lg hover:shadow-lg hover:shadow-hunter-emerald/25 transition-all duration-300 transform hover:scale-105'
                            >
                              <FaPlay className='mr-2' />
                              Live Demo
                            </a>
                          )}
                          {project.githubUrl && (
                            <a
                              href={project.githubUrl}
                              target='_blank'
                              rel='noopener noreferrer'
                              className='flex items-center px-6 py-3 bg-glass-subtle border border-glass-border text-metallic-silver font-semibold rounded-lg hover:bg-hunter-emerald hover:text-charcoal-dark transition-all duration-300 transform hover:scale-105'
                            >
                              <FaGithub className='mr-2' />
                              View Code
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Project Details */}
                  <div className='space-y-6'>
                    <div>
                      <h3 className='font-display text-3xl font-bold mb-4 text-glass-light'>
                        {project.title}
                      </h3>
                      <p className='text-lg text-hunter-sage leading-relaxed mb-4'>
                        {project.longDescription || project.description}
                      </p>
                    </div>

                    {/* Tech Stack */}
                    <div>
                      <h4 className='text-lg font-semibold text-metallic-silver mb-3 flex items-center'>
                        <FaCode className='mr-2' />
                        Tech Stack
                      </h4>
                      <div className='flex flex-wrap gap-2'>
                        {project.techStack.map((tech, techIndex) => (
                          <span
                            key={techIndex}
                            className='px-3 py-1 text-sm font-medium bg-glass-subtle border border-glass-border rounded-full text-hunter-emerald hover:bg-hunter-emerald hover:text-charcoal-dark transition-all duration-300'
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Key Features */}
                    <div>
                      <h4 className='text-lg font-semibold text-metallic-silver mb-3 flex items-center'>
                        <FaRocket className='mr-2' />
                        Key Features
                      </h4>
                      <ul className='space-y-2'>
                        {project.features.slice(0, 4).map((feature, featureIndex) => (
                          <li key={featureIndex} className='flex items-start'>
                            <span className='w-2 h-2 bg-hunter-emerald rounded-full mt-2 mr-3 flex-shrink-0' />
                            <span className='text-hunter-sage'>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Action Buttons */}
                    <div className='flex flex-col sm:flex-row gap-4 pt-4'>
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target='_blank'
                          rel='noopener noreferrer'
                          className='flex items-center justify-center px-8 py-4 bg-gradient-to-r from-hunter-emerald to-metallic-silver text-charcoal-dark font-semibold rounded-lg hover:shadow-lg hover:shadow-hunter-emerald/25 transition-all duration-300 transform hover:scale-105'
                        >
                          <FaPlay className='mr-2' />
                          Try Live Demo
                        </a>
                      )}
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target='_blank'
                          rel='noopener noreferrer'
                          className='flex items-center justify-center px-8 py-4 border-2 border-hunter-emerald text-hunter-emerald rounded-lg hover:bg-hunter-emerald hover:text-charcoal-dark transition-all duration-300 transform hover:scale-105'
                        >
                          <FaGithub className='mr-2' />
                          View Source Code
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                {/* Brand Watermark */}
                <div className='absolute top-4 right-4 opacity-20'>
                  <BrandImage
                    assetKey='circa2024'
                    alt='StrayDog Syndications 2024'
                    width={32}
                    height={32}
                    className='filter brightness-0 invert'
                    lazy={false}
                  />
                </div>
              </GlassCard>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className='text-center mt-16'>
          <GlassCard variant='hunter' className='max-w-2xl mx-auto'>
            <h3 className='font-display text-2xl font-bold mb-4 text-glass-light'>
              Ready to Build Something Amazing?
            </h3>
            <p className='text-hunter-sage mb-6'>
              Let's collaborate on your next project. Whether it's a web application, AI
              integration, or something completely unique, I bring the same precision and attention
              to detail that defined my culinary career.
            </p>
            <div className='flex flex-col sm:flex-row gap-4 justify-center'>
              <a
                href='#contact'
                className='flex items-center justify-center px-8 py-4 bg-gradient-to-r from-hunter-emerald to-metallic-silver text-charcoal-dark font-semibold rounded-lg hover:shadow-lg hover:shadow-hunter-emerald/25 transition-all duration-300 transform hover:scale-105'
              >
                <FaExternalLinkAlt className='mr-2' />
                Start Your Project
              </a>
              <a
                href='https://github.com/StrayDogSyn'
                target='_blank'
                rel='noopener noreferrer'
                className='flex items-center justify-center px-8 py-4 border-2 border-hunter-emerald text-hunter-emerald rounded-lg hover:bg-hunter-emerald hover:text-charcoal-dark transition-all duration-300 transform hover:scale-105'
              >
                <FaGithub className='mr-2' />
                View All Projects
              </a>
            </div>
          </GlassCard>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProjects;
