import { FileText, Mail, Linkedin, Github, Youtube, Instagram } from 'lucide-react';
import MarvelQuiz from '../components/MarvelQuiz';

export const Home = () => {
  return (
    <div className='min-h-screen'>
      {/* Hero Section */}
      <section className='relative py-20 px-4 sm:px-6 lg:px-8'>
        <div className='max-w-7xl mx-auto text-center'>
          <div className='mb-12'>
            <h1 className='text-4xl sm:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-hunter-300 to-hunter-100 mb-4'>
              AI/ML Engineer & Technical Architect
            </h1>
            <h2 className='text-2xl sm:text-3xl font-semibold text-hunter-200 mb-8'>
              Eric "Hunter" Petross
            </h2>
            <p className='text-lg text-hunter-300 max-w-4xl mx-auto leading-relaxed'>
              Transforming 20+ years of customer excellence into cutting-edge technical solutions
            </p>
          </div>
        </div>
      </section>

      {/* Metrics Cards Section */}
      <section className='py-16 px-4 sm:px-6 lg:px-8'>
        <div className='max-w-7xl mx-auto'>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
            <div className='bg-hunter-800/50 backdrop-blur-md border border-hunter-600/30 rounded-xl p-6 text-center hover:transform hover:scale-105 transition-all duration-200'>
              <h3 className='text-2xl font-bold text-hunter-300 mb-2'>20+</h3>
              <p className='text-hunter-200 text-sm'>Years Customer Service Excellence</p>
            </div>
            
            <div className='bg-hunter-800/50 backdrop-blur-md border border-hunter-600/30 rounded-xl p-6 text-center hover:transform hover:scale-105 transition-all duration-200'>
              <h3 className='text-2xl font-bold text-hunter-300 mb-2'>AI/ML</h3>
              <p className='text-hunter-200 text-sm'>Specialization</p>
            </div>
            
            <div className='bg-hunter-800/50 backdrop-blur-md border border-hunter-600/30 rounded-xl p-6 text-center hover:transform hover:scale-105 transition-all duration-200'>
              <h3 className='text-2xl font-bold text-hunter-300 mb-2'>Live</h3>
              <p className='text-hunter-200 text-sm'>Working Demos</p>
            </div>
            
            <div className='bg-hunter-800/50 backdrop-blur-md border border-hunter-600/30 rounded-xl p-6 text-center hover:transform hover:scale-105 transition-all duration-200'>
              <h3 className='text-2xl font-bold text-hunter-300 mb-2'>Full-Stack</h3>
              <p className='text-hunter-200 text-sm'>Development Expertise</p>
            </div>
          </div>
        </div>
      </section>

      {/* Professional Description Section */}
      <section className='py-16 px-4 sm:px-6 lg:px-8'>
        <div className='max-w-4xl mx-auto text-center'>
          <p className='text-lg text-hunter-200 leading-relaxed'>
            Unique combination of customer empathy, high-pressure performance experience, and 
            technical capability. Specialized in Claude 4.1 integration and intelligent automation with 
            proven live demonstrations.
          </p>
          <div className='flex flex-col sm:flex-row gap-4 justify-center items-center mt-8'>
            <button className='inline-flex items-center px-8 py-3 bg-gradient-to-r from-hunter-500 to-hunter-600 text-white font-semibold rounded-lg hover:from-hunter-600 hover:to-hunter-700 transition-all duration-200 transform hover:scale-105'>
              View Live Demo
            </button>
            <button className='inline-flex items-center px-8 py-3 border-2 border-hunter-400 text-hunter-300 font-semibold rounded-lg hover:bg-hunter-400 hover:text-white transition-all duration-200 transform hover:scale-105'>
              GitHub Profile
            </button>
          </div>
        </div>
      </section>

      {/* Technical Architecture Demonstration Section */}
      <section className='py-20 px-4 sm:px-6 lg:px-8'>
        <div className='max-w-7xl mx-auto'>
          <div className='text-center mb-12'>
            <h2 className='text-3xl sm:text-4xl font-bold text-hunter-300 mb-4'>
              Technical Architecture Demonstration
            </h2>
            <p className='text-lg text-hunter-200 mb-8'>
              Marvel Quiz Game - Complete Full-Stack Implementation
            </p>
          </div>
          
          <div className='bg-hunter-800/50 backdrop-blur-md border border-hunter-600/30 rounded-2xl p-8 mb-8'>
            <div className='text-center mb-6'>
              <h3 className='text-xl font-semibold text-hunter-300 mb-2'>🦸 Interactive Marvel Universe Quiz</h3>
            </div>
            <MarvelQuiz />
          </div>
        </div>
      </section>

      {/* Service Cards Section */}
      <section className='py-16 px-4 sm:px-6 lg:px-8'>
        <div className='max-w-7xl mx-auto'>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
            <div className='bg-hunter-800/50 backdrop-blur-md border border-hunter-600/30 rounded-xl p-8 text-center hover:transform hover:scale-105 transition-all duration-200'>
              <div className='w-16 h-16 bg-gradient-to-br from-hunter-500 to-hunter-600 rounded-full flex items-center justify-center mx-auto mb-6'>
                <FileText className='h-8 w-8 text-white' />
              </div>
              <h3 className='text-xl font-semibold text-hunter-300 mb-4'>Professional Resume</h3>
              <p className='text-hunter-200 mb-6'>
                Comprehensive career transformation story and technical qualifications documentation
              </p>
            </div>
            
            <div className='bg-hunter-800/50 backdrop-blur-md border border-hunter-600/30 rounded-xl p-8 text-center hover:transform hover:scale-105 transition-all duration-200'>
              <div className='w-16 h-16 bg-gradient-to-br from-hunter-500 to-hunter-600 rounded-full flex items-center justify-center mx-auto mb-6'>
                <Linkedin className='h-8 w-8 text-white' />
              </div>
              <h3 className='text-xl font-semibold text-hunter-300 mb-4'>LinkedIn Profile</h3>
              <p className='text-hunter-200 mb-6'>
                Professional networking and career transformation narrative with industry connections
              </p>
            </div>
            
            <div className='bg-hunter-800/50 backdrop-blur-md border border-hunter-600/30 rounded-xl p-8 text-center hover:transform hover:scale-105 transition-all duration-200'>
              <div className='w-16 h-16 bg-gradient-to-br from-hunter-500 to-hunter-600 rounded-full flex items-center justify-center mx-auto mb-6'>
                <Mail className='h-8 w-8 text-white' />
              </div>
              <h3 className='text-xl font-semibold text-hunter-300 mb-4'>Professional Contact</h3>
              <p className='text-hunter-200 mb-6'>
                Direct communication for technical opportunities, consulting, and professional collaboration
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className='py-20 px-4 sm:px-6 lg:px-8'>
        <div className='max-w-4xl mx-auto text-center'>
          <div className='bg-hunter-800/50 backdrop-blur-md border border-hunter-600/30 rounded-2xl p-12'>
            <h2 className='text-3xl sm:text-4xl font-bold text-hunter-300 mb-6'>
              Let's Build Something Amazing
            </h2>
            <p className='text-lg text-hunter-200 mb-8 max-w-2xl mx-auto'>
              Ready to bring unique customer empathy and technical capability to your next project.
            </p>
            
            {/* Social Icons */}
            <div className='flex justify-center gap-6 mb-8'>
              <a href='#' title='LinkedIn Profile' aria-label='Visit my LinkedIn profile' className='w-12 h-12 bg-hunter-700/50 backdrop-blur-md border border-hunter-600/30 rounded-full flex items-center justify-center hover:bg-hunter-600/50 transition-all duration-200'>
                <Linkedin className='h-6 w-6 text-hunter-300' />
              </a>
              <a href='#' title='GitHub Profile' aria-label='Visit my GitHub profile' className='w-12 h-12 bg-hunter-700/50 backdrop-blur-md border border-hunter-600/30 rounded-full flex items-center justify-center hover:bg-hunter-600/50 transition-all duration-200'>
                <Github className='h-6 w-6 text-hunter-300' />
              </a>
              <a href='#' title='YouTube Channel' aria-label='Visit my YouTube channel' className='w-12 h-12 bg-hunter-700/50 backdrop-blur-md border border-hunter-600/30 rounded-full flex items-center justify-center hover:bg-hunter-600/50 transition-all duration-200'>
                <Youtube className='h-6 w-6 text-hunter-300' />
              </a>
              <a href='#' title='Instagram Profile' aria-label='Visit my Instagram profile' className='w-12 h-12 bg-hunter-700/50 backdrop-blur-md border border-hunter-600/30 rounded-full flex items-center justify-center hover:bg-hunter-600/50 transition-all duration-200'>
                <Instagram className='h-6 w-6 text-hunter-300' />
              </a>
            </div>
            
            <div className='text-sm text-hunter-400 mb-4'>
              © 2025 Eric "Hunter" Petross, AI/ML Engineer & Technical Architect.
            </div>
            <div className='text-sm text-hunter-400'>
              Transforming customer excellence into technical innovation.
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
