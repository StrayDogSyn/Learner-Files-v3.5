import { User, Code, Brain, Award } from 'lucide-react';

export const About = () => {
  return (
    <div className='min-h-screen py-20 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-7xl mx-auto'>
        {/* Hero Section */}
        <div className='text-center mb-16'>
          <h1 className='text-4xl sm:text-5xl font-bold text-white mb-6'>About Me</h1>
          <p className='text-xl text-hunter-200 max-w-3xl mx-auto'>
            From Kitchen to Code - Professional AI/ML engineer and full-stack developer transforming culinary creativity into innovative software solutions.
          </p>
        </div>

        {/* Main Content */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16'>
          {/* Story Section */}
          <div className='glass-card p-8'>
            <div className='flex items-center mb-6'>
              <User className='w-8 h-8 text-hunter-400 mr-3' />
              <h2 className='text-2xl font-bold text-white'>My Journey</h2>
            </div>
            <div className='space-y-4 text-hunter-200'>
              <p className='leading-relaxed'>
                With over 20 years in the culinary industry, I've developed a unique perspective on precision, creativity, and problem-solving. My transition from kitchen management to software development wasn't just a career change—it was a natural evolution of my passion for creating exceptional experiences.
              </p>
              <p className='leading-relaxed'>
                Today, I combine my culinary background with cutting-edge technology to create innovative solutions that are both technically sound and user-centric. Every line of code I write is infused with the same attention to detail and care that I brought to every dish I prepared.
              </p>
            </div>
          </div>

          {/* Skills Highlight */}
          <div className='glass-card p-8'>
            <div className='flex items-center mb-6'>
              <Brain className='w-8 h-8 text-hunter-400 mr-3' />
              <h2 className='text-2xl font-bold text-white'>Core Expertise</h2>
            </div>
            <div className='space-y-4'>
              <div className='flex items-start'>
                <Code className='w-6 h-6 text-hunter-400 mr-3 mt-1' />
                <div>
                  <h3 className='text-white font-semibold mb-1'>AI/ML Engineering</h3>
                  <p className='text-hunter-200 text-sm'>Advanced machine learning models, neural networks, and AI-driven solutions for real-world applications.</p>
                </div>
              </div>
              <div className='flex items-start'>
                <Award className='w-6 h-6 text-hunter-400 mr-3 mt-1' />
                <div>
                  <h3 className='text-white font-semibold mb-1'>Full-Stack Development</h3>
                  <p className='text-hunter-200 text-sm'>End-to-end web applications using modern frameworks, databases, and cloud technologies.</p>
                </div>
              </div>
              <div className='flex items-start'>
                <Brain className='w-6 h-6 text-hunter-400 mr-3 mt-1' />
                <div>
                  <h3 className='text-white font-semibold mb-1'>Problem Solving</h3>
                  <p className='text-hunter-200 text-sm'>Analytical thinking and creative solutions honed through years of high-pressure kitchen environments.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className='glass-card p-8 text-center'>
          <h2 className='text-3xl font-bold text-white mb-6'>What Drives Me</h2>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
            <div>
              <div className='w-16 h-16 bg-gradient-to-br from-hunter-500 to-hunter-600 rounded-full flex items-center justify-center mx-auto mb-4'>
                <Code className='w-8 h-8 text-white' />
              </div>
              <h3 className='text-xl font-semibold text-white mb-2'>Innovation</h3>
              <p className='text-hunter-200'>Constantly exploring new technologies and methodologies to create cutting-edge solutions.</p>
            </div>
            <div>
              <div className='w-16 h-16 bg-gradient-to-br from-hunter-500 to-hunter-600 rounded-full flex items-center justify-center mx-auto mb-4'>
                <User className='w-8 h-8 text-white' />
              </div>
              <h3 className='text-xl font-semibold text-white mb-2'>Excellence</h3>
              <p className='text-hunter-200'>Delivering high-quality work with attention to detail and commitment to best practices.</p>
            </div>
            <div>
              <div className='w-16 h-16 bg-gradient-to-br from-hunter-500 to-hunter-600 rounded-full flex items-center justify-center mx-auto mb-4'>
                <Brain className='w-8 h-8 text-white' />
              </div>
              <h3 className='text-xl font-semibold text-white mb-2'>Growth</h3>
              <p className='text-hunter-200'>Continuous learning and adaptation in the ever-evolving landscape of technology.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
