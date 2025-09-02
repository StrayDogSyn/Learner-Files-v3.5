import { Calendar, MapPin, ExternalLink, Award, Users, TrendingUp } from 'lucide-react';

interface Experience {
  title: string;
  company: string;
  location: string;
  period: string;
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Freelance';
  description: string;
  achievements: string[];
  technologies: string[];
  website?: string;
}

const experiences: Experience[] = [
  {
    title: 'Senior Full Stack Developer',
    company: 'TechCorp Solutions',
    location: 'San Francisco, CA',
    period: '2022 - Present',
    type: 'Full-time',
    description: 'Leading development of enterprise-scale web applications and mentoring junior developers.',
    achievements: [
      'Architected and developed a microservices-based e-commerce platform serving 100K+ users',
      'Improved application performance by 40% through code optimization and caching strategies',
      'Led a team of 5 developers in agile development practices',
      'Implemented CI/CD pipelines reducing deployment time by 60%'
    ],
    technologies: ['React', 'Node.js', 'PostgreSQL', 'AWS', 'Docker', 'TypeScript'],
    website: 'https://techcorp.com'
  },
  {
    title: 'Full Stack Developer',
    company: 'InnovateLab',
    location: 'Austin, TX',
    period: '2020 - 2022',
    type: 'Full-time',
    description: 'Developed and maintained multiple client projects using modern web technologies.',
    achievements: [
      'Built 15+ responsive web applications for various clients',
      'Integrated third-party APIs and payment systems (Stripe, PayPal)',
      'Collaborated with UX/UI designers to implement pixel-perfect designs',
      'Mentored 3 junior developers and conducted code reviews'
    ],
    technologies: ['Vue.js', 'Express.js', 'MongoDB', 'Firebase', 'Tailwind CSS'],
    website: 'https://innovatelab.io'
  },
  {
    title: 'Frontend Developer',
    company: 'StartupXYZ',
    location: 'Remote',
    period: '2019 - 2020',
    type: 'Contract',
    description: 'Focused on creating engaging user interfaces and improving user experience.',
    achievements: [
      'Redesigned company website resulting in 25% increase in user engagement',
      'Implemented responsive design principles across all platforms',
      'Optimized website loading speed by 50% through image optimization and lazy loading',
      'Collaborated with marketing team to implement A/B testing strategies'
    ],
    technologies: ['React', 'JavaScript', 'SCSS', 'Webpack', 'Jest'],
    website: 'https://startupxyz.com'
  },
  {
    title: 'Junior Web Developer',
    company: 'Digital Agency Pro',
    location: 'New York, NY',
    period: '2018 - 2019',
    type: 'Full-time',
    description: 'Started my professional journey building websites and learning industry best practices.',
    achievements: [
      'Developed 20+ client websites using WordPress and custom HTML/CSS',
      'Learned modern JavaScript frameworks and development workflows',
      'Participated in client meetings and requirement gathering sessions',
      'Maintained and updated existing client websites'
    ],
    technologies: ['HTML5', 'CSS3', 'JavaScript', 'WordPress', 'PHP', 'MySQL']
  }
];

const getTypeColor = (type: string) => {
  switch (type) {
    case 'Full-time':
      return 'bg-green-500';
    case 'Part-time':
      return 'bg-blue-500';
    case 'Contract':
      return 'bg-yellow-500';
    case 'Freelance':
      return 'bg-purple-500';
    default:
      return 'bg-gray-500';
  }
};

export const Experience = () => {
  return (
    <div className='min-h-screen py-20 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-4xl mx-auto'>
        {/* Header */}
        <div className='text-center mb-16'>
          <h1 className='text-4xl sm:text-5xl font-bold text-white mb-6'>Professional Experience</h1>
          <p className='text-xl text-hunter-200 max-w-3xl mx-auto'>
            A journey through my professional growth and achievements in software development.
          </p>
        </div>

        {/* Experience Timeline */}
        <div className='relative'>
          {/* Timeline Line */}
          <div className='absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-hunter-400 to-hunter-600'></div>

          {experiences.map((exp, index) => (
            <div key={index} className='relative mb-12 last:mb-0'>
              {/* Timeline Dot */}
              <div className='absolute left-6 w-4 h-4 bg-hunter-400 rounded-full border-4 border-hunter-900'></div>
              
              {/* Experience Card */}
              <div className='ml-20'>
                <div className='glass-card p-6'>
                  {/* Header */}
                  <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4'>
                    <div>
                      <h3 className='text-xl font-bold text-white mb-1'>{exp.title}</h3>
                      <div className='flex items-center space-x-4 text-hunter-300'>
                        <span className='font-semibold'>{exp.company}</span>
                        {exp.website && (
                          <a 
                            href={exp.website} 
                            target='_blank' 
                            rel='noopener noreferrer'
                            className='flex items-center space-x-1 text-hunter-400 hover:text-hunter-300 transition-colors'
                          >
                            <ExternalLink className='w-4 h-4' />
                            <span className='text-sm'>Visit</span>
                          </a>
                        )}
                      </div>
                    </div>
                    <div className='flex flex-col sm:items-end mt-2 sm:mt-0'>
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold text-white ${getTypeColor(exp.type)} mb-2`}>
                        {exp.type}
                      </span>
                      <div className='flex items-center text-hunter-400 text-sm'>
                        <Calendar className='w-4 h-4 mr-1' />
                        <span>{exp.period}</span>
                      </div>
                      <div className='flex items-center text-hunter-400 text-sm mt-1'>
                        <MapPin className='w-4 h-4 mr-1' />
                        <span>{exp.location}</span>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <p className='text-hunter-200 mb-4'>{exp.description}</p>

                  {/* Achievements */}
                  <div className='mb-4'>
                    <h4 className='text-white font-semibold mb-2 flex items-center'>
                      <Award className='w-4 h-4 mr-2' />
                      Key Achievements
                    </h4>
                    <ul className='space-y-1'>
                      {exp.achievements.map((achievement, achIndex) => (
                        <li key={achIndex} className='text-hunter-300 text-sm flex items-start'>
                          <TrendingUp className='w-3 h-3 mr-2 mt-1 text-hunter-400 flex-shrink-0' />
                          {achievement}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Technologies */}
                  <div>
                    <h4 className='text-white font-semibold mb-2'>Technologies Used</h4>
                    <div className='flex flex-wrap gap-2'>
                      {exp.technologies.map((tech, techIndex) => (
                        <span 
                          key={techIndex} 
                          className='px-3 py-1 bg-hunter-800/50 text-hunter-300 rounded-full text-xs border border-hunter-700/50'
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary Stats */}
        <div className='mt-16'>
          <div className='glass-card p-8'>
            <h3 className='text-2xl font-bold text-white mb-6 text-center'>Career Highlights</h3>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
              <div className='text-center'>
                <div className='w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-3'>
                  <Users className='w-8 h-8 text-white' />
                </div>
                <h4 className='text-2xl font-bold text-white mb-1'>50+</h4>
                <p className='text-hunter-300'>Projects Completed</p>
              </div>
              <div className='text-center'>
                <div className='w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-3'>
                  <TrendingUp className='w-8 h-8 text-white' />
                </div>
                <h4 className='text-2xl font-bold text-white mb-1'>5+</h4>
                <p className='text-hunter-300'>Years Experience</p>
              </div>
              <div className='text-center'>
                <div className='w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-3'>
                  <Award className='w-8 h-8 text-white' />
                </div>
                <h4 className='text-2xl font-bold text-white mb-1'>15+</h4>
                <p className='text-hunter-300'>Technologies Mastered</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
