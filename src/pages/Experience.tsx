import { Calendar, MapPin, ExternalLink, Award, Users, TrendingUp, Briefcase, Star } from 'lucide-react';

interface Experience {
  title: string;
  company: string;
  location: string;
  period: string;
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Freelance';
  description: string;
  achievements: string[];
  technologies?: string[];
  website?: string;
}

const experiences: Experience[] = [
  {
    title: 'AI Content Writer',
    company: 'Outlier AI',
    location: 'Remote',
    period: 'October 2024 - Present',
    type: 'Contract',
    description: 'Developing and fine-tuning AI-driven content solutions with a focus on quality and client satisfaction.',
    achievements: [
      'Rewriting the Future: Revised and fine-tuned written content to perfectly align with client visions and publisher needs',
      'Predictive Prowess: Tested, validated, and optimized models to ensure accurate predictions',
      'Innovative Application Development: Developed new functions and applications to drive insightful analyses',
      'Customer Champion: Provided high-quality, friendly support that left clients smiling and satisfied',
      'Team Dynamo: Collaborated closely with team members to hit deadlines and achieve ambitious project targets'
    ],
    technologies: ['AI/ML', 'Content Development', 'Model Optimization', 'Predictive Analytics'],
    website: 'https://outlier.ai'
  },
  {
    title: 'Community Engagement Freelance Instructor',
    company: 'The Moth',
    location: 'Remote',
    period: 'November 2024 - Present',
    type: 'Freelance',
    description: 'Leading storytelling workshops and community engagement sessions, combining traditional narrative techniques with modern technology.',
    achievements: [
      'Public Speaking Excellence: Facilitated storytelling workshops and community engagement sessions',
      'Educational Content Development: Created comprehensive curriculum for digital storytelling and narrative techniques',
      'Cross-Cultural Communication: Delivered training programs to diverse audiences across multiple demographics',
      'Digital Storytelling Expertise: Integrated modern technology with traditional storytelling methods',
      'Community Building: Fostered inclusive environments that encouraged authentic personal expression',
      'Workshop Leadership: Led interactive sessions combining public speaking skills with creative writing techniques'
    ],
    technologies: ['Public Speaking', 'Content Development', 'Community Engagement', 'Digital Storytelling'],
    website: 'https://themoth.org'
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
    <div className='min-h-screen bg-charcoal-black pt-20'>
      <div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Header */}
        <section className='py-16'>
          <div className='text-center mb-16'>
            <h1 className='text-4xl sm:text-6xl font-bold text-hunter-300 mb-6'>Professional Experience</h1>
            <p className='text-xl text-hunter-200 max-w-4xl mx-auto leading-relaxed'>
              Applied AI Solutions Engineer with 20+ years of customer excellence, now transforming industries through cutting-edge technical solutions
            </p>
          </div>
        </section>

        {/* Career Transformation Story */}
        <section className='py-16'>
          <div className='bg-charcoal-slate/50 backdrop-blur-md border border-hunter-600/30 rounded-xl p-8 mb-16'>
            <div className='text-center mb-8'>
              <Briefcase className='h-12 w-12 text-hunter-400 mx-auto mb-4' />
              <h2 className='text-3xl font-bold text-hunter-300 mb-4'>Career Transformation Journey</h2>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
              <div className='bg-charcoal-slate/30 rounded-lg p-6'>
                <h3 className='text-xl font-semibold text-hunter-300 mb-4'>From Fine Dining to AI Solutions</h3>
                <p className='text-hunter-200 leading-relaxed'>
                  With over 20 years of excellence in fine dining and customer service, I've developed an unparalleled 
                  understanding of high-pressure performance, customer empathy, and quality delivery. This foundation 
                  now drives my approach to AI/ML engineering and technical architecture.
                </p>
              </div>
              <div className='bg-charcoal-slate/30 rounded-lg p-6'>
                <h3 className='text-xl font-semibold text-hunter-300 mb-4'>Applied AI Specialization</h3>
                <p className='text-hunter-200 leading-relaxed'>
                  Specializing in Claude 4.1 integration and intelligent automation, I bring a unique combination 
                  of customer empathy and technical capability to every project. My experience includes deploying 
                  3 AI Slack agents and managing 4 active digital properties.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Current Professional Experience */}
        <section className='py-16'>
          <div className='text-center mb-12'>
            <h2 className='text-3xl font-bold text-hunter-300 mb-4'>Current Professional Roles</h2>
            <p className='text-hunter-200'>Leading edge AI development and community engagement initiatives</p>
          </div>

          {/* Experience Timeline */}
          <div className='relative'>
            {/* Timeline Line */}
            <div className='absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-hunter-400 to-hunter-600'></div>

            {experiences.map((exp, index) => (
              <div key={index} className='relative mb-12 last:mb-0'>
                {/* Timeline Dot */}
                <div className='absolute left-6 w-4 h-4 bg-hunter-400 rounded-full border-4 border-charcoal-black'></div>
                
                {/* Experience Card */}
                <div className='ml-20'>
                  <div className='bg-charcoal-slate/50 backdrop-blur-md border border-hunter-600/30 rounded-xl p-6'>
                    {/* Header */}
                    <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4'>
                      <div>
                        <h3 className='text-xl font-bold text-hunter-300 mb-1'>{exp.title}</h3>
                        <div className='flex items-center space-x-4 text-hunter-200'>
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
                      <h4 className='text-hunter-300 font-semibold mb-2 flex items-center'>
                        <Award className='w-4 h-4 mr-2' />
                        Key Achievements
                      </h4>
                      <ul className='space-y-2'>
                        {exp.achievements.map((achievement, achIndex) => (
                          <li key={achIndex} className='text-hunter-200 text-sm flex items-start'>
                            <Star className='w-3 h-3 mr-2 mt-1 text-hunter-400 flex-shrink-0' />
                            {achievement}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Technologies */}
                    {exp.technologies && (
                      <div>
                        <h4 className='text-hunter-300 font-semibold mb-2'>Key Skills & Technologies</h4>
                        <div className='flex flex-wrap gap-2'>
                          {exp.technologies.map((tech, techIndex) => (
                            <span 
                              key={techIndex} 
                              className='px-3 py-1 bg-hunter-600/20 text-hunter-300 rounded-full text-xs border border-hunter-600/30'
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Professional Differentiators */}
        <section className='py-16'>
          <div className='text-center mb-12'>
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
        </section>

        {/* Career Stats */}
        <section className='py-16'>
          <div className='bg-charcoal-slate/50 backdrop-blur-md border border-hunter-600/30 rounded-xl p-8'>
            <h3 className='text-2xl font-bold text-hunter-300 mb-6 text-center'>Career Highlights</h3>
            <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
              <div className='text-center'>
                <div className='w-16 h-16 bg-hunter-600/20 rounded-lg flex items-center justify-center mx-auto mb-3'>
                  <Users className='w-8 h-8 text-hunter-400' />
                </div>
                <h4 className='text-2xl font-bold text-hunter-300 mb-1'>20+</h4>
                <p className='text-hunter-200'>Years Customer Excellence</p>
              </div>
              <div className='text-center'>
                <div className='w-16 h-16 bg-hunter-600/20 rounded-lg flex items-center justify-center mx-auto mb-3'>
                  <TrendingUp className='w-8 h-8 text-hunter-400' />
                </div>
                <h4 className='text-2xl font-bold text-hunter-300 mb-1'>4</h4>
                <p className='text-hunter-200'>Active Digital Properties</p>
              </div>
              <div className='text-center'>
                <div className='w-16 h-16 bg-hunter-600/20 rounded-lg flex items-center justify-center mx-auto mb-3'>
                  <Award className='w-8 h-8 text-hunter-400' />
                </div>
                <h4 className='text-2xl font-bold text-hunter-300 mb-1'>3</h4>
                <p className='text-hunter-200'>AI Slack Agents Deployed</p>
              </div>
              <div className='text-center'>
                <div className='w-16 h-16 bg-hunter-600/20 rounded-lg flex items-center justify-center mx-auto mb-3'>
                  <Briefcase className='w-8 h-8 text-hunter-400' />
                </div>
                <h4 className='text-2xl font-bold text-hunter-300 mb-1'>6</h4>
                <p className='text-hunter-200'>Specialized IDEs Mastered</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
