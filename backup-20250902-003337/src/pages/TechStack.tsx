import { skills } from '../data';
import { Code, Database, Brain, Server, Wrench } from 'lucide-react';

export const TechStack = () => {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'frontend':
        return <Code className='h-6 w-6' />;
      case 'backend':
        return <Server className='h-6 w-6' />;
      case 'ai-ml':
        return <Brain className='h-6 w-6' />;
      case 'devops':
        return <Wrench className='h-6 w-6' />;
      case 'tools':
        return <Wrench className='h-6 w-6' />;
      default:
        return <Code className='h-6 w-6' />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'frontend':
        return 'from-blue-500 to-blue-600';
      case 'backend':
        return 'from-green-500 to-green-600';
      case 'ai-ml':
        return 'from-purple-500 to-purple-600';
      case 'devops':
        return 'from-orange-500 to-orange-600';
      case 'tools':
        return 'from-gray-500 to-gray-600';
      default:
        return 'from-hunter-500 to-hunter-600';
    }
  };

  const categories = ['frontend', 'backend', 'ai-ml', 'devops', 'tools'];

  return (
    <div className='min-h-screen py-20 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-7xl mx-auto'>
        {/* Header */}
        <div className='text-center mb-16'>
          <h1 className='text-4xl sm:text-5xl font-bold text-white mb-6'>Technical Skills</h1>
          <p className='text-xl text-hunter-200 max-w-3xl mx-auto'>
            A comprehensive overview of my technical expertise, from frontend frameworks to AI/ML
            technologies
          </p>
        </div>

        {/* Skills by Category */}
        <div className='space-y-12'>
          {categories.map(category => {
            const categorySkills = skills.filter(skill => skill.category === category);
            if (categorySkills.length === 0) return null;

            return (
              <div
                key={category}
                className='bg-hunter-800/50 backdrop-blur-md border border-hunter-600/30 rounded-2xl p-8'
              >
                <div className='flex items-center mb-8'>
                  <div
                    className={`w-12 h-12 bg-gradient-to-r ${getCategoryColor(
                      category
                    )} rounded-full flex items-center justify-center mr-4`}
                  >
                    {getCategoryIcon(category)}
                  </div>
                  <div>
                    <h2 className='text-3xl font-bold text-white capitalize'>
                      {category === 'ai-ml' ? 'AI/ML' : category === 'devops' ? 'DevOps' : category}
                    </h2>
                    <p className='text-hunter-200'>
                      {category === 'frontend' && 'User interface and client-side technologies'}
                      {category === 'backend' && 'Server-side development and database systems'}
                      {category === 'ai-ml' &&
                        'Machine learning, neural networks, and AI frameworks'}
                      {category === 'devops' && 'Infrastructure, deployment, and automation'}
                      {category === 'tools' && 'Development tools and version control'}
                    </p>
                  </div>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                  {categorySkills.map(skill => (
                    <div
                      key={skill.name}
                      className='bg-hunter-700/50 border border-hunter-600/30 rounded-xl p-6 hover:transform hover:scale-105 transition-all duration-200'
                    >
                      <div className='flex items-center justify-between mb-4'>
                        <h3 className='text-lg font-semibold text-white'>{skill.name}</h3>
                        <span className='text-sm font-medium text-hunter-300'>{skill.level}%</span>
                      </div>

                      {/* Skill Level Bar */}
                      <div className='w-full bg-hunter-600/30 rounded-full h-2 mb-4'>
                        <div
                          className={`h-2 bg-gradient-to-r ${getCategoryColor(
                            category
                          )} rounded-full transition-all duration-500`}
                          style={{ width: `${skill.level}%` }}
                        />
                      </div>

                      {/* Skill Level Description */}
                      <p className='text-sm text-hunter-200'>
                        {skill.level >= 90 && 'Expert level proficiency'}
                        {skill.level >= 80 && skill.level < 90 && 'Advanced proficiency'}
                        {skill.level >= 70 && skill.level < 80 && 'Intermediate proficiency'}
                        {skill.level >= 60 && skill.level < 70 && 'Basic proficiency'}
                        {skill.level < 60 && 'Learning and growing'}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Additional Technologies */}
        <div className='mt-16 bg-gradient-to-r from-hunter-800/80 to-hunter-700/80 backdrop-blur-md border border-hunter-600/30 rounded-2xl p-8'>
          <h2 className='text-2xl font-bold text-white mb-6 text-center'>
            Additional Technologies & Tools
          </h2>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
            {[
              'Docker',
              'Kubernetes',
              'AWS',
              'Azure',
              'Git',
              'GitHub Actions',
              'Jenkins',
              'PostgreSQL',
              'MongoDB',
              'Redis',
              'Elasticsearch',
              'GraphQL',
              'REST APIs',
              'Microservices',
              'Serverless',
              'CI/CD',
              'Monitoring',
              'Logging',
              'Testing',
              'Security',
              'Performance',
            ].map(tech => (
              <div
                key={tech}
                className='bg-hunter-700/30 border border-hunter-600/20 rounded-lg p-3 text-center hover:bg-hunter-600/30 transition-colors'
              >
                <span className='text-sm text-hunter-200'>{tech}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Learning & Growth */}
        <div className='mt-16 text-center'>
          <div className='bg-gradient-to-r from-hunter-800/80 to-hunter-700/80 backdrop-blur-md border border-hunter-600/30 rounded-2xl p-8'>
            <h2 className='text-2xl font-bold text-white mb-4'>Continuous Learning</h2>
            <p className='text-hunter-200 mb-6 max-w-2xl mx-auto'>
              Technology evolves rapidly, and I'm committed to staying current with the latest
              developments. I'm currently exploring and expanding my knowledge in emerging areas.
            </p>
            <div className='flex flex-wrap justify-center gap-4'>
              <span className='px-4 py-2 bg-hunter-700/50 text-hunter-200 rounded-full border border-hunter-600/30'>
                Rust
              </span>
              <span className='px-4 py-2 bg-hunter-700/50 text-hunter-200 rounded-full border border-hunter-600/30'>
                WebAssembly
              </span>
              <span className='px-4 py-2 bg-hunter-700/50 text-hunter-200 rounded-full border border-hunter-600/30'>
                Edge Computing
              </span>
              <span className='px-4 py-2 bg-hunter-700/50 text-hunter-200 rounded-full border border-hunter-600/30'>
                Quantum Computing
              </span>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className='text-center mt-16'>
          <div className='bg-gradient-to-r from-hunter-800/80 to-hunter-700/80 backdrop-blur-md border border-hunter-600/30 rounded-2xl p-8'>
            <h3 className='text-2xl font-bold text-white mb-4'>Need a Specific Technology?</h3>
            <p className='text-hunter-200 mb-6 max-w-2xl mx-auto'>
              If you need expertise in a technology not listed here, let's discuss your
              requirements. I'm always eager to learn and adapt to new challenges.
            </p>
            <a
              href='/contact'
              className='inline-flex items-center px-8 py-3 bg-gradient-to-r from-hunter-500 to-hunter-600 text-white font-semibold rounded-lg hover:from-hunter-600 hover:to-hunter-700 transition-all duration-200 transform hover:scale-105'
            >
              Let's Discuss
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
