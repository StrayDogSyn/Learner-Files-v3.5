import { ChefHat, Code, Brain, Users, Award } from 'lucide-react';

export const About = () => {
  return (
    <div className='min-h-screen py-20 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-7xl mx-auto'>
        {/* Header */}
        <div className='text-center mb-16'>
          <h1 className='text-4xl sm:text-5xl font-bold text-white mb-6'>About Me</h1>
          <p className='text-xl text-hunter-200 max-w-3xl mx-auto'>
            The journey from culinary precision to software engineering excellence
          </p>
        </div>

        {/* Story Section */}
        <section className='mb-20'>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 items-center'>
            <div>
              <h2 className='text-3xl font-bold text-white mb-6'>From Kitchen to Code</h2>
              <p className='text-lg text-hunter-200 mb-6 leading-relaxed'>
                My professional journey began in the culinary world, where I learned the art of
                precision, creativity, and attention to detail. These foundational skills have
                proven invaluable in my transition to software engineering.
              </p>
              <p className='text-lg text-hunter-200 mb-6 leading-relaxed'>
                In the kitchen, every ingredient matters, every technique must be mastered, and
                every dish tells a story. Similarly, in software development, every line of code,
                every algorithm, and every user experience must be crafted with the same level of
                care and expertise.
              </p>
              <p className='text-lg text-hunter-200 leading-relaxed'>
                Today, I combine my culinary background with cutting-edge technology to create
                innovative solutions that are both technically sound and user-centric.
              </p>
            </div>
            <div className='bg-gradient-to-br from-hunter-800/80 to-hunter-700/80 backdrop-blur-md border border-hunter-600/30 rounded-2xl p-8'>
              <div className='text-center'>
                <div className='w-24 h-24 bg-gradient-to-br from-hunter-500 to-hunter-600 rounded-full flex items-center justify-center mx-auto mb-6'>
                  <ChefHat className='h-12 w-12 text-white' />
                </div>
                <h3 className='text-2xl font-bold text-white mb-4'>Culinary Foundation</h3>
                <p className='text-hunter-200'>
                  Precision, creativity, and attention to detail - skills that translate perfectly
                  to software engineering
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className='mb-20'>
          <div className='text-center mb-12'>
            <h2 className='text-3xl font-bold text-white mb-4'>Core Values</h2>
            <p className='text-xl text-hunter-200 max-w-2xl mx-auto'>
              The principles that guide my work and relationships
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
            <div className='bg-hunter-800/50 backdrop-blur-md border border-hunter-600/30 rounded-xl p-6 text-center'>
              <div className='w-16 h-16 bg-gradient-to-br from-hunter-500 to-hunter-600 rounded-full flex items-center justify-center mx-auto mb-4'>
                <Code className='h-8 w-8 text-white' />
              </div>
              <h3 className='text-xl font-semibold text-white mb-3'>Technical Excellence</h3>
              <p className='text-hunter-200'>
                Writing clean, maintainable code that solves real problems efficiently
              </p>
            </div>

            <div className='bg-hunter-800/50 backdrop-blur-md border border-hunter-600/30 rounded-xl p-6 text-center'>
              <div className='w-16 h-16 bg-gradient-to-br from-hunter-500 to-hunter-600 rounded-full flex items-center justify-center mx-auto mb-4'>
                <Brain className='h-8 w-8 text-white' />
              </div>
              <h3 className='text-xl font-semibold text-white mb-3'>Innovation</h3>
              <p className='text-hunter-200'>
                Embracing new technologies and approaches to create better solutions
              </p>
            </div>

            <div className='bg-hunter-800/50 backdrop-blur-md border border-hunter-600/30 rounded-xl p-6 text-center'>
              <div className='w-16 h-16 bg-gradient-to-br from-hunter-500 to-hunter-600 rounded-full flex items-center justify-center mx-auto mb-4'>
                <Users className='h-8 w-8 text-white' />
              </div>
              <h3 className='text-xl font-semibold text-white mb-3'>Collaboration</h3>
              <p className='text-hunter-200'>
                Working effectively with teams to achieve shared goals and deliver exceptional
                results
              </p>
            </div>
          </div>
        </section>

        {/* Experience Highlights */}
        <section className='mb-20'>
          <div className='text-center mb-12'>
            <h2 className='text-3xl font-bold text-white mb-4'>Professional Highlights</h2>
            <p className='text-xl text-hunter-200 max-w-2xl mx-auto'>
              Key achievements and milestones in my software engineering career
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
            <div className='bg-gradient-to-r from-hunter-800/80 to-hunter-700/80 backdrop-blur-md border border-hunter-600/30 rounded-2xl p-8'>
              <div className='flex items-center gap-4 mb-4'>
                <div className='w-12 h-12 bg-hunter-500/30 rounded-full flex items-center justify-center'>
                  <Award className='h-6 w-6 text-hunter-300' />
                </div>
                <h3 className='text-2xl font-bold text-white'>AI/ML Expertise</h3>
              </div>
              <p className='text-hunter-200 leading-relaxed'>
                Developed and deployed machine learning models for real-world applications,
                including recommendation systems, natural language processing, and computer vision
                solutions.
              </p>
            </div>

            <div className='bg-gradient-to-r from-hunter-800/80 to-hunter-700/80 backdrop-blur-md border border-hunter-600/30 rounded-2xl p-8'>
              <div className='flex items-center gap-4 mb-4'>
                <div className='w-12 h-12 bg-hunter-500/30 rounded-full flex items-center justify-center'>
                  <Code className='h-6 w-6 text-hunter-300' />
                </div>
                <h3 className='text-2xl font-bold text-white'>Full-Stack Development</h3>
              </div>
              <p className='text-hunter-200 leading-relaxed'>
                Built end-to-end web applications using modern frameworks, with expertise in React,
                Node.js, Python, and cloud deployment technologies.
              </p>
            </div>
          </div>
        </section>

        {/* Personal Interests */}
        <section className='mb-20'>
          <div className='text-center mb-12'>
            <h2 className='text-3xl font-bold text-white mb-4'>Beyond the Code</h2>
            <p className='text-xl text-hunter-200 max-w-2xl mx-auto'>
              What keeps me inspired and balanced outside of software development
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
            <div className='text-center'>
              <div className='w-20 h-20 bg-gradient-to-br from-hunter-500 to-hunter-600 rounded-full flex items-center justify-center mx-auto mb-4'>
                <span className='text-2xl'>🍳</span>
              </div>
              <h3 className='text-xl font-semibold text-white mb-2'>Culinary Arts</h3>
              <p className='text-hunter-200'>
                Exploring new cuisines and perfecting traditional techniques
              </p>
            </div>

            <div className='text-center'>
              <div className='w-20 h-20 bg-gradient-to-br from-hunter-500 to-hunter-600 rounded-full flex items-center justify-center mx-auto mb-4'>
                <span className='text-2xl'>📚</span>
              </div>
              <h3 className='text-xl font-semibold text-white mb-2'>Continuous Learning</h3>
              <p className='text-hunter-200'>
                Staying current with emerging technologies and industry trends
              </p>
            </div>

            <div className='text-center'>
              <div className='w-20 h-20 bg-gradient-to-br from-hunter-500 to-hunter-600 rounded-full flex items-center justify-center mx-auto mb-4'>
                <span className='text-2xl'>🌱</span>
              </div>
              <h3 className='text-xl font-semibold text-white mb-2'>Mentorship</h3>
              <p className='text-hunter-200'>
                Helping others grow and succeed in their technical journeys
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className='text-center'>
          <div className='bg-gradient-to-r from-hunter-800/80 to-hunter-700/80 backdrop-blur-md border border-hunter-600/30 rounded-2xl p-12'>
            <h2 className='text-3xl font-bold text-white mb-6'>Ready to Work Together?</h2>
            <p className='text-xl text-hunter-200 mb-8 max-w-2xl mx-auto'>
              Let's combine your vision with my technical expertise to create something
              extraordinary
            </p>
            <a
              href='/contact'
              className='inline-flex items-center px-10 py-4 bg-gradient-to-r from-hunter-500 to-hunter-600 text-white font-semibold rounded-lg hover:from-hunter-600 hover:to-hunter-700 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl text-lg'
            >
              Get In Touch
            </a>
          </div>
        </section>
      </div>
    </div>
  );
};
