import { Code, Database, Cloud, Cpu, Globe, Wrench } from 'lucide-react';

interface TechCategory {
  title: string;
  icon: React.ComponentType<any>;
  color: string;
  skills: {
    name: string;
    level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
    years?: number;
  }[];
}

const techStack: TechCategory[] = [
  {
    title: 'Frontend Development',
    icon: Globe,
    color: 'from-blue-500 to-cyan-500',
    skills: [
      { name: 'React', level: 'Expert', years: 3 },
      { name: 'TypeScript', level: 'Advanced', years: 2 },
      { name: 'JavaScript (ES6+)', level: 'Expert', years: 4 },
      { name: 'HTML5 & CSS3', level: 'Expert', years: 5 },
      { name: 'Tailwind CSS', level: 'Advanced', years: 2 },
      { name: 'Vue.js', level: 'Intermediate', years: 1 },
      { name: 'Framer Motion', level: 'Intermediate' },
      { name: 'Responsive Design', level: 'Expert', years: 4 }
    ]
  },
  {
    title: 'Backend Development',
    icon: Database,
    color: 'from-green-500 to-emerald-500',
    skills: [
      { name: 'Node.js', level: 'Advanced', years: 3 },
      { name: 'Express.js', level: 'Advanced', years: 3 },
      { name: 'Python', level: 'Expert', years: 4 },
      { name: 'FastAPI', level: 'Advanced', years: 2 },
      { name: 'RESTful APIs', level: 'Expert', years: 4 },
      { name: 'GraphQL', level: 'Intermediate', years: 1 },
      { name: 'Microservices', level: 'Intermediate', years: 2 },
      { name: 'WebSocket', level: 'Intermediate' }
    ]
  },
  {
    title: 'AI/ML & Data Science',
    icon: Cpu,
    color: 'from-purple-500 to-pink-500',
    skills: [
      { name: 'TensorFlow', level: 'Advanced', years: 2 },
      { name: 'PyTorch', level: 'Intermediate', years: 1 },
      { name: 'Scikit-learn', level: 'Advanced', years: 3 },
      { name: 'Pandas & NumPy', level: 'Expert', years: 4 },
      { name: 'Neural Networks', level: 'Advanced', years: 2 },
      { name: 'Computer Vision', level: 'Intermediate', years: 1 },
      { name: 'NLP', level: 'Intermediate', years: 1 },
      { name: 'Data Visualization', level: 'Advanced', years: 3 }
    ]
  },
  {
    title: 'Databases',
    icon: Database,
    color: 'from-orange-500 to-red-500',
    skills: [
      { name: 'PostgreSQL', level: 'Advanced', years: 3 },
      { name: 'MongoDB', level: 'Advanced', years: 2 },
      { name: 'Redis', level: 'Intermediate', years: 1 },
      { name: 'SQLite', level: 'Advanced', years: 3 },
      { name: 'Supabase', level: 'Intermediate', years: 1 },
      { name: 'Database Design', level: 'Advanced', years: 3 },
      { name: 'Query Optimization', level: 'Intermediate', years: 2 }
    ]
  },
  {
    title: 'Cloud & DevOps',
    icon: Cloud,
    color: 'from-indigo-500 to-blue-500',
    skills: [
      { name: 'AWS', level: 'Intermediate', years: 2 },
      { name: 'Docker', level: 'Advanced', years: 2 },
      { name: 'Kubernetes', level: 'Beginner', years: 1 },
      { name: 'CI/CD', level: 'Intermediate', years: 2 },
      { name: 'Vercel', level: 'Advanced', years: 2 },
      { name: 'Netlify', level: 'Intermediate', years: 1 },
      { name: 'Git & GitHub', level: 'Expert', years: 4 }
    ]
  },
  {
    title: 'Tools & Others',
    icon: Wrench,
    color: 'from-yellow-500 to-orange-500',
    skills: [
      { name: 'VS Code', level: 'Expert', years: 4 },
      { name: 'Figma', level: 'Intermediate', years: 2 },
      { name: 'Postman', level: 'Advanced', years: 3 },
      { name: 'Jest & Testing', level: 'Intermediate', years: 2 },
      { name: 'Webpack & Vite', level: 'Intermediate', years: 2 },
      { name: 'Linux/Unix', level: 'Intermediate', years: 3 },
      { name: 'Agile/Scrum', level: 'Advanced', years: 3 }
    ]
  }
];

const getLevelColor = (level: string) => {
  switch (level) {
    case 'Expert':
      return 'bg-green-500';
    case 'Advanced':
      return 'bg-blue-500';
    case 'Intermediate':
      return 'bg-yellow-500';
    case 'Beginner':
      return 'bg-gray-500';
    default:
      return 'bg-gray-500';
  }
};

const getLevelWidth = (level: string) => {
  switch (level) {
    case 'Expert':
      return 'w-full';
    case 'Advanced':
      return 'w-4/5';
    case 'Intermediate':
      return 'w-3/5';
    case 'Beginner':
      return 'w-2/5';
    default:
      return 'w-2/5';
  }
};

export const TechStack = () => {
  return (
    <div className='min-h-screen py-20 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-7xl mx-auto'>
        {/* Header */}
        <div className='text-center mb-16'>
          <h1 className='text-4xl sm:text-5xl font-bold text-white mb-6'>Technical Skills</h1>
          <p className='text-xl text-hunter-200 max-w-3xl mx-auto'>
            Comprehensive overview of my technical expertise across frontend, backend, AI/ML, and cloud technologies.
          </p>
        </div>

        {/* Tech Categories */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
          {techStack.map((category, index) => {
            const IconComponent = category.icon;
            return (
              <div key={index} className='glass-card p-6'>
                {/* Category Header */}
                <div className='flex items-center mb-6'>
                  <div className={`w-12 h-12 bg-gradient-to-br ${category.color} rounded-lg flex items-center justify-center mr-4`}>
                    <IconComponent className='w-6 h-6 text-white' />
                  </div>
                  <h2 className='text-2xl font-bold text-white'>{category.title}</h2>
                </div>

                {/* Skills List */}
                <div className='space-y-4'>
                  {category.skills.map((skill, skillIndex) => (
                    <div key={skillIndex} className='space-y-2'>
                      <div className='flex items-center justify-between'>
                        <span className='text-white font-medium'>{skill.name}</span>
                        <div className='flex items-center space-x-2'>
                          <span className='text-hunter-300 text-sm'>{skill.level}</span>
                          {skill.years && (
                            <span className='text-hunter-400 text-xs'>({skill.years}y)</span>
                          )}
                        </div>
                      </div>
                      <div className='w-full bg-hunter-800/50 rounded-full h-2'>
                        <div className={`h-2 rounded-full ${getLevelColor(skill.level)} ${getLevelWidth(skill.level)} transition-all duration-500`}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Additional Info */}
        <div className='mt-16'>
          <div className='glass-card p-8 text-center'>
            <h3 className='text-2xl font-bold text-white mb-4'>Continuous Learning</h3>
            <p className='text-hunter-200 mb-6 max-w-3xl mx-auto'>
              Technology evolves rapidly, and I'm committed to staying current with the latest trends and best practices. 
              I regularly engage in professional development through online courses, technical documentation, and hands-on projects.
            </p>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
              <div className='glass-subtle p-4 rounded-lg'>
                <Code className='w-8 h-8 text-hunter-400 mx-auto mb-2' />
                <h4 className='text-white font-semibold mb-1'>Clean Code</h4>
                <p className='text-hunter-300 text-sm'>Writing maintainable, scalable, and well-documented code</p>
              </div>
              <div className='glass-subtle p-4 rounded-lg'>
                <Cpu className='w-8 h-8 text-hunter-400 mx-auto mb-2' />
                <h4 className='text-white font-semibold mb-1'>Performance</h4>
                <p className='text-hunter-300 text-sm'>Optimizing applications for speed and efficiency</p>
              </div>
              <div className='glass-subtle p-4 rounded-lg'>
                <Globe className='w-8 h-8 text-hunter-400 mx-auto mb-2' />
                <h4 className='text-white font-semibold mb-1'>User Experience</h4>
                <p className='text-hunter-300 text-sm'>Creating intuitive and accessible user interfaces</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
