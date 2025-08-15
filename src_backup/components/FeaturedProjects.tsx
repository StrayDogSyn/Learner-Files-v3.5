import React from 'react';
import { FaGithub, FaExternalLinkAlt, FaPlay, FaCode, FaRocket } from 'react-icons/fa';
import { getFeaturedProjects } from '../data/enhancedProjects';
import GlassCard from './GlassCard';
import BrandImage from './BrandImage';
import AdvancedProjectShowcase from './AdvancedProjectShowcase';

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

        {/* Advanced Project Showcase */}
        <AdvancedProjectShowcase
          initialViewMode='grid'
          showFilters={true}
          showSearch={true}
          maxProjects={6}
        />

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
