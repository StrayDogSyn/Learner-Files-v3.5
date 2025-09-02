import { Link } from 'react-router-dom';
import { ArrowRight, Code, Brain, Database, Zap, Shield } from 'lucide-react';
import MarvelQuiz from '../components/MarvelQuiz';

export const Home = () => {
  return (
    <div className='min-h-screen'>
      {/* Hero Section */}
      <section className='relative py-20 px-4 sm:px-6 lg:px-8'>
        <div className='max-w-7xl mx-auto text-center'>
          <div className='mb-8'>
            <h1 className='text-4xl sm:text-6xl font-bold text-white mb-6'>
              From Kitchen to{' '}
              <span className='text-transparent bg-clip-text bg-gradient-to-r from-hunter-300 to-hunter-100'>
                Code
              </span>
            </h1>
            <p className='text-xl sm:text-2xl text-hunter-200 max-w-3xl mx-auto leading-relaxed'>
              Professional AI/ML engineer and full-stack developer, transforming culinary creativity
              into innovative software solutions.
            </p>
          </div>

          <div className='flex flex-col sm:flex-row gap-4 justify-center items-center'>
            <Link
              to='/portfolio'
              className='inline-flex items-center px-8 py-4 bg-gradient-to-r from-hunter-500 to-hunter-600 text-white font-semibold rounded-lg hover:from-hunter-600 hover:to-hunter-700 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl'
            >
              View My Work
              <ArrowRight className='ml-2 h-5 w-5' />
            </Link>
            <Link
              to='/contact'
              className='inline-flex items-center px-8 py-4 border-2 border-hunter-400 text-hunter-300 font-semibold rounded-lg hover:bg-hunter-400 hover:text-white transition-all duration-200 transform hover:scale-105'
            >
              Get In Touch
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className='py-20 px-4 sm:px-6 lg:px-8'>
        <div className='max-w-7xl mx-auto'>
          <div className='text-center mb-16'>
            <h2 className='text-3xl sm:text-4xl font-bold text-white mb-4'>
              What I Bring to the Table
            </h2>
            <p className='text-xl text-hunter-200 max-w-2xl mx-auto'>
              Combining culinary precision with technical expertise to deliver exceptional results
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
            <div className='bg-hunter-800/50 backdrop-blur-md border border-hunter-600/30 rounded-xl p-6 text-center hover:transform hover:scale-105 transition-all duration-200'>
              <div className='w-16 h-16 bg-gradient-to-br from-hunter-500 to-hunter-600 rounded-full flex items-center justify-center mx-auto mb-4'>
                <Brain className='h-8 w-8 text-white' />
              </div>
              <h3 className='text-xl font-semibold text-white mb-2'>AI/ML Expertise</h3>
              <p className='text-hunter-200'>
                Advanced machine learning models and neural networks for real-world applications
              </p>
            </div>

            <div className='bg-hunter-800/50 backdrop-blur-md border border-hunter-600/30 rounded-xl p-6 text-center hover:transform hover:scale-105 transition-all duration-200'>
              <div className='w-16 h-16 bg-gradient-to-br from-hunter-500 to-hunter-600 rounded-full flex items-center justify-center mx-auto mb-4'>
                <Code className='h-8 w-8 text-white' />
              </div>
              <h3 className='text-xl font-semibold text-white mb-2'>Full-Stack Development</h3>
              <p className='text-hunter-200'>
                End-to-end web applications with modern frameworks and best practices
              </p>
            </div>

            <div className='bg-hunter-800/50 backdrop-blur-md border border-hunter-600/30 rounded-xl p-6 text-center hover:transform hover:scale-105 transition-all duration-200'>
              <div className='w-16 h-16 bg-gradient-to-br from-hunter-500 to-hunter-600 rounded-full flex items-center justify-center mx-auto mb-4'>
                <Database className='h-8 w-8 text-white' />
              </div>
              <h3 className='text-xl font-semibold text-white mb-2'>Data Science</h3>
              <p className='text-hunter-200'>
                Comprehensive data analysis and visualization for business insights
              </p>
            </div>

            <div className='bg-hunter-800/50 backdrop-blur-md border border-hunter-600/30 rounded-xl p-6 text-center hover:transform hover:scale-105 transition-all duration-200'>
              <div className='w-16 h-16 bg-gradient-to-br from-hunter-500 to-hunter-600 rounded-full flex items-center justify-center mx-auto mb-4'>
                <Zap className='h-8 w-8 text-white' />
              </div>
              <h3 className='text-xl font-semibold text-white mb-2'>Automation</h3>
              <p className='text-hunter-200'>
                Streamlined workflows and CI/CD pipelines for efficient development
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Marvel Quiz Section */}
      <section className='py-20 px-4 sm:px-6 lg:px-8'>
        <div className='max-w-7xl mx-auto'>
          <div className='text-center mb-16'>
            <div className='w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-6'>
              <Shield className='h-8 w-8 text-white' />
            </div>
            <h2 className='text-3xl sm:text-4xl font-bold text-white mb-4'>
              Test Your Marvel Knowledge
            </h2>
            <p className='text-xl text-hunter-200 max-w-2xl mx-auto'>
              Challenge yourself with our interactive Marvel quiz and see how well you know the Marvel Universe!
            </p>
          </div>
          
          <div className='bg-gradient-to-r from-hunter-800/80 to-hunter-700/80 backdrop-blur-md border border-hunter-600/30 rounded-2xl p-8'>
            <MarvelQuiz />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className='py-20 px-4 sm:px-6 lg:px-8'>
        <div className='max-w-4xl mx-auto text-center'>
          <div className='bg-gradient-to-r from-hunter-800/80 to-hunter-700/80 backdrop-blur-md border border-hunter-600/30 rounded-2xl p-12'>
            <h2 className='text-3xl sm:text-4xl font-bold text-white mb-6'>
              Ready to Build Something Amazing?
            </h2>
            <p className='text-xl text-hunter-200 mb-8 max-w-2xl mx-auto'>
              Let's combine your vision with my technical expertise to create innovative solutions
              that make a difference.
            </p>
            <Link
              to='/contact'
              className='inline-flex items-center px-10 py-4 bg-gradient-to-r from-hunter-500 to-hunter-600 text-white font-semibold rounded-lg hover:from-hunter-600 hover:to-hunter-700 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl text-lg'
            >
              Start a Conversation
              <ArrowRight className='ml-2 h-6 w-6' />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
