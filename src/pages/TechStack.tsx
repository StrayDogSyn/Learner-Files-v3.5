import { Code, Database, Globe, Brain, Wrench, Shield, Award, GraduationCap } from 'lucide-react';

export const TechStack = () => {
  return (
    <div className='min-h-screen bg-charcoal-black pt-20'>
      {/* Hero Section */}
      <section className='py-16 px-4 sm:px-6 lg:px-8'>
        <div className='max-w-7xl mx-auto text-center'>
          <h1 className='text-4xl sm:text-6xl font-bold text-hunter-300 mb-6'>
            Tech Stack & Professional Skills
          </h1>
          <p className='text-xl text-hunter-200 max-w-4xl mx-auto leading-relaxed'>
            Applied AI Solutions Engineer with comprehensive full-stack expertise and specialized LLM integration capabilities
          </p>
        </div>
      </section>

      {/* Programming Languages */}
      <section className='py-16 px-4 sm:px-6 lg:px-8'>
        <div className='max-w-7xl mx-auto'>
          <div className='text-center mb-12'>
            <Code className='h-12 w-12 text-hunter-400 mx-auto mb-4' />
            <h2 className='text-3xl font-bold text-hunter-300 mb-4'>Programming Languages</h2>
          </div>
          <div className='grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4'>
            {[
              { name: 'Python', color: 'bg-blue-500/20 border-blue-400/30 text-blue-300' },
              { name: 'TypeScript', color: 'bg-blue-400/20 border-blue-300/30 text-blue-200' },
              { name: 'JavaScript', color: 'bg-yellow-500/20 border-yellow-400/30 text-yellow-300' },
              { name: 'HTML5', color: 'bg-orange-500/20 border-orange-400/30 text-orange-300' },
              { name: 'CSS3', color: 'bg-cyan-500/20 border-cyan-400/30 text-cyan-300' },
              { name: 'SQL', color: 'bg-green-500/20 border-green-400/30 text-green-300' },
              { name: 'VBA', color: 'bg-purple-500/20 border-purple-400/30 text-purple-300' },
              { name: 'Markdown', color: 'bg-gray-500/20 border-gray-400/30 text-gray-300' }
            ].map((lang) => (
              <div key={lang.name} className={`${lang.color} backdrop-blur-md border rounded-lg p-4 text-center hover:scale-105 transition-all duration-200`}>
                <span className='font-semibold text-sm'>{lang.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Frontend Development */}
      <section className='py-16 px-4 sm:px-6 lg:px-8'>
        <div className='max-w-7xl mx-auto'>
          <div className='text-center mb-12'>
            <Globe className='h-12 w-12 text-hunter-400 mx-auto mb-4' />
            <h2 className='text-3xl font-bold text-hunter-300 mb-4'>Frontend Development</h2>
          </div>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6'>
            {[
              { name: 'Tailwind CSS', desc: 'Utility-first CSS framework' },
              { name: 'Vite', desc: 'Next-gen build tool' },
              { name: 'React', desc: 'Component-based UI library' },
              { name: 'Next.js', desc: 'Full-stack React framework' },
              { name: 'React Router', desc: 'Client-side routing' }
            ].map((tech) => (
              <div key={tech.name} className='bg-charcoal-slate/50 backdrop-blur-md border border-hunter-600/30 rounded-xl p-6 text-center hover:scale-105 transition-all duration-200'>
                <h3 className='text-lg font-semibold text-hunter-300 mb-2'>{tech.name}</h3>
                <p className='text-hunter-200 text-sm'>{tech.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Backend Development */}
      <section className='py-16 px-4 sm:px-6 lg:px-8'>
        <div className='max-w-7xl mx-auto'>
          <div className='text-center mb-12'>
            <Database className='h-12 w-12 text-hunter-400 mx-auto mb-4' />
            <h2 className='text-3xl font-bold text-hunter-300 mb-4'>Backend & Database</h2>
          </div>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6'>
            {[
              { name: 'Node.js', desc: 'JavaScript runtime' },
              { name: 'Express.js', desc: 'Web framework' },
              { name: 'MongoDB', desc: 'NoSQL database' },
              { name: 'MongoDB Atlas', desc: 'Cloud database' },
              { name: 'MongoDB Compass', desc: 'Database GUI' },
              { name: 'Supabase', desc: 'Backend-as-a-Service' }
            ].map((tech) => (
              <div key={tech.name} className='bg-charcoal-slate/50 backdrop-blur-md border border-hunter-600/30 rounded-xl p-6 text-center hover:scale-105 transition-all duration-200'>
                <h3 className='text-lg font-semibold text-hunter-300 mb-2'>{tech.name}</h3>
                <p className='text-hunter-200 text-sm'>{tech.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI & LLM Tools */}
      <section className='py-16 px-4 sm:px-6 lg:px-8'>
        <div className='max-w-7xl mx-auto'>
          <div className='text-center mb-12'>
            <Brain className='h-12 w-12 text-hunter-400 mx-auto mb-4' />
            <h2 className='text-3xl font-bold text-hunter-300 mb-4'>AI & LLM Specialization</h2>
          </div>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6'>
            {[
              { name: 'LangChain', desc: 'LLM application framework' },
              { name: 'Hugging Face', desc: 'ML model hub' },
              { name: 'AI Slack Agents', desc: 'Business automation' },
              { name: 'Claude', desc: 'AI assistant integration' },
              { name: 'Gemini', desc: 'Google AI platform' },
              { name: 'Perplexity Pro', desc: 'AI search & research' }
            ].map((tech) => (
              <div key={tech.name} className='bg-charcoal-slate/50 backdrop-blur-md border border-hunter-600/30 rounded-xl p-6 text-center hover:scale-105 transition-all duration-200'>
                <h3 className='text-lg font-semibold text-hunter-300 mb-2'>{tech.name}</h3>
                <p className='text-hunter-200 text-sm'>{tech.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Development Tools & IDEs */}
      <section className='py-16 px-4 sm:px-6 lg:px-8'>
        <div className='max-w-7xl mx-auto'>
          <div className='text-center mb-12'>
            <Wrench className='h-12 w-12 text-hunter-400 mx-auto mb-4' />
            <h2 className='text-3xl font-bold text-hunter-300 mb-4'>Development Tools & IDEs</h2>
            <p className='text-hunter-200 mb-8'>Parallel development across 6 specialized IDEs for maximum efficiency</p>
          </div>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
            {[
              { name: 'VS Code + Copilot', desc: 'Primary development environment' },
              { name: 'Cursor Composer', desc: 'AI-powered code editor' },
              { name: 'Xojo', desc: 'Cross-platform development' },
              { name: 'WindSurf', desc: 'Advanced code analysis' },
              { name: 'Trae 2.0 + SOLO', desc: 'AI development assistant' },
              { name: 'StackBlitz', desc: 'Online IDE' },
              { name: 'GitKraken', desc: 'Git client & workflow' },
              { name: 'PolyPane', desc: 'Multi-browser testing' }
            ].map((tool) => (
              <div key={tool.name} className='bg-charcoal-slate/50 backdrop-blur-md border border-hunter-600/30 rounded-xl p-6 text-center hover:scale-105 transition-all duration-200'>
                <h3 className='text-lg font-semibold text-hunter-300 mb-2'>{tool.name}</h3>
                <p className='text-hunter-200 text-sm'>{tool.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Professional Differentiators */}
      <section className='py-16 px-4 sm:px-6 lg:px-8'>
        <div className='max-w-7xl mx-auto'>
          <div className='text-center mb-12'>
            <Award className='h-12 w-12 text-hunter-400 mx-auto mb-4' />
            <h2 className='text-3xl font-bold text-hunter-300 mb-4'>Professional Differentiators</h2>
          </div>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
            <div className='bg-charcoal-slate/50 backdrop-blur-md border border-hunter-600/30 rounded-xl p-8'>
              <h3 className='text-2xl font-semibold text-hunter-300 mb-4'>Multi-Platform Development Orchestration</h3>
              <ul className='text-hunter-200 space-y-2'>
                <li>• Parallel development across 6 specialized IDEs for maximum efficiency</li>
                <li>• 3 deployed AI Slack agents serving business automation needs</li>
                <li>• Integrated AI workflow combining Claude, Perplexity, and specialized tools</li>
              </ul>
            </div>
            <div className='bg-charcoal-slate/50 backdrop-blur-md border border-hunter-600/30 rounded-xl p-8'>
              <h3 className='text-2xl font-semibold text-hunter-300 mb-4'>Business Leadership</h3>
              <ul className='text-hunter-200 space-y-2'>
                <li>• Owner/operator of 4 active digital properties</li>
                <li>• Community engagement instructor at The Moth</li>
                <li>• Applied AI solutions for enterprise clients</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className='py-16 px-4 sm:px-6 lg:px-8'>
        <div className='max-w-7xl mx-auto'>
          <div className='text-center mb-12'>
            <GraduationCap className='h-12 w-12 text-hunter-400 mx-auto mb-4' />
            <h2 className='text-3xl font-bold text-hunter-300 mb-4'>Certifications & Credentials</h2>
          </div>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {[
              { title: 'Applied AI Solutions Engineer', org: 'Justice Through Code', status: 'Pending 2026', category: 'AI Specialization' },
              { title: 'AI Edge Certification', org: 'Industry Standard', status: 'Aug 2025', category: 'AI Specialization' },
              { title: 'Building AI Agents with MongoDB', org: 'MongoDB University', status: 'Aug 2025', category: 'Database & AI' },
              { title: 'Introduction to MongoDB', org: 'MongoDB University', status: 'Feb 2025', category: 'Database' },
              { title: 'FullStack development with Cursor Copilot', org: 'Udemy', status: 'Mar 2025', category: 'Development' },
              { title: 'JavaScript: Understanding ES6 and Beyond', org: 'Udemy', status: 'Dec 2024', category: 'Programming' }
            ].map((cert) => (
              <div key={cert.title} className='bg-charcoal-slate/50 backdrop-blur-md border border-hunter-600/30 rounded-xl p-6 hover:scale-105 transition-all duration-200'>
                <div className='mb-3'>
                  <span className='inline-block px-3 py-1 bg-hunter-600/20 text-hunter-300 text-xs font-medium rounded-full'>
                    {cert.category}
                  </span>
                </div>
                <h3 className='text-lg font-semibold text-hunter-300 mb-2'>{cert.title}</h3>
                <p className='text-hunter-200 text-sm mb-2'>{cert.org}</p>
                <p className='text-hunter-400 text-sm'>{cert.status}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Education */}
      <section className='py-16 px-4 sm:px-6 lg:px-8'>
        <div className='max-w-7xl mx-auto'>
          <div className='text-center mb-12'>
            <h2 className='text-3xl font-bold text-hunter-300 mb-4'>Education & Professional Development</h2>
          </div>
          <div className='bg-charcoal-slate/50 backdrop-blur-md border border-hunter-600/30 rounded-xl p-8'>
            <div className='mb-6'>
              <h3 className='text-2xl font-semibold text-hunter-300 mb-2'>Associate in Applied Science - Computer & Networking Technology</h3>
              <p className='text-hunter-200 mb-4'>Community College of Rhode Island | 2020 - Present</p>
              <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-6'>
                <div className='text-center'>
                  <div className='text-2xl font-bold text-hunter-300'>60%</div>
                  <div className='text-hunter-200 text-sm'>Credits Complete</div>
                </div>
                <div className='text-center'>
                  <div className='text-2xl font-bold text-hunter-300'>3.40</div>
                  <div className='text-hunter-200 text-sm'>Current GPA</div>
                </div>
                <div className='text-center'>
                  <div className='text-2xl font-bold text-hunter-300'>STEM</div>
                  <div className='text-hunter-200 text-sm'>Pathway Scholar</div>
                </div>
              </div>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div>
                <h4 className='text-lg font-semibold text-hunter-300 mb-3'>Core Coursework</h4>
                <ul className='text-hunter-200 space-y-1 text-sm'>
                  <li>• Network Infrastructure & Protocols</li>
                  <li>• Hardware Systems & Architecture</li>
                  <li>• Operating Systems Administration</li>
                  <li>• Security Fundamentals</li>
                  <li>• Database Management</li>
                  <li>• Programming Foundations</li>
                </ul>
              </div>
              <div>
                <h4 className='text-lg font-semibold text-hunter-300 mb-3'>Academic Achievements</h4>
                <ul className='text-hunter-200 space-y-1 text-sm'>
                  <li>• Dean's List Recognition - Multiple semesters</li>
                  <li>• STEM Pathway Scholar specialization</li>
                  <li>• Consistent 3.40+ GPA maintenance</li>
                  <li>• Hands-on laboratory excellence</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
