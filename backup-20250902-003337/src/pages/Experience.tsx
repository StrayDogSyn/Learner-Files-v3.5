import { Briefcase, Calendar, MapPin, Award, Users, TrendingUp } from 'lucide-react';

export const Experience = () => {
  const experiences = [
    {
      id: '1',
      title: 'Senior AI/ML Engineer',
      company: 'Tech Innovations Inc.',
      period: '2022 - Present',
      location: 'Remote',
      description:
        'Leading machine learning initiatives and developing AI-powered solutions for enterprise clients.',
      achievements: [
        'Developed and deployed ML models that improved prediction accuracy by 35%',
        'Led a team of 5 engineers in building a recommendation system',
        'Implemented automated ML pipelines reducing deployment time by 60%',
      ],
      technologies: ['Python', 'TensorFlow', 'PyTorch', 'AWS', 'Docker', 'Kubernetes'],
    },
    {
      id: '2',
      title: 'Full-Stack Developer',
      company: 'Digital Solutions Corp.',
      period: '2020 - 2022',
      location: 'San Francisco, CA',
      description: 'Built end-to-end web applications and APIs for various client projects.',
      achievements: [
        'Developed 10+ web applications using React and Node.js',
        'Optimized database queries improving performance by 40%',
        'Implemented CI/CD pipelines reducing deployment time by 50%',
      ],
      technologies: ['React', 'Node.js', 'PostgreSQL', 'MongoDB', 'Docker', 'GitHub Actions'],
    },
    {
      id: '3',
      title: 'Software Engineer',
      company: 'Startup Ventures',
      period: '2018 - 2020',
      location: 'Austin, TX',
      description: 'Contributed to early-stage product development and rapid prototyping.',
      achievements: [
        'Built MVP applications for 3 different startup products',
        'Collaborated with product teams to define technical requirements',
        'Mentored junior developers and conducted code reviews',
      ],
      technologies: ['JavaScript', 'Python', 'React', 'FastAPI', 'PostgreSQL', 'Redis'],
    },
  ];

  const education = [
    {
      id: '1',
      degree: 'Master of Science in Computer Science',
      institution: 'Tech University',
      period: '2016 - 2018',
      description:
        'Specialized in Machine Learning and Artificial Intelligence with focus on practical applications.',
    },
    {
      id: '2',
      degree: 'Bachelor of Science in Software Engineering',
      institution: 'State University',
      period: '2012 - 2016',
      description: 'Comprehensive foundation in software development principles and practices.',
    },
  ];

  const certifications = [
    {
      id: '1',
      name: 'AWS Certified Solutions Architect',
      issuer: 'Amazon Web Services',
      date: '2023',
      description: 'Expert-level certification in designing distributed systems on AWS.',
    },
    {
      id: '2',
      name: 'Google Cloud Professional Data Engineer',
      issuer: 'Google Cloud',
      date: '2022',
      description: 'Advanced certification in data engineering and machine learning on GCP.',
    },
    {
      id: '3',
      name: 'Microsoft Certified: Azure Developer Associate',
      issuer: 'Microsoft',
      date: '2021',
      description: 'Professional certification in developing applications for Microsoft Azure.',
    },
  ];

  return (
    <div className='min-h-screen py-20 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-7xl mx-auto'>
        {/* Header */}
        <div className='text-center mb-16'>
          <h1 className='text-4xl sm:text-5xl font-bold text-white mb-6'>
            Professional Experience
          </h1>
          <p className='text-xl text-hunter-200 max-w-3xl mx-auto'>
            A journey through my professional growth, from early software development to leading
            AI/ML initiatives
          </p>
        </div>

        {/* Work Experience */}
        <section className='mb-20'>
          <div className='text-center mb-12'>
            <h2 className='text-3xl font-bold text-white mb-4'>Work Experience</h2>
            <p className='text-xl text-hunter-200 max-w-2xl mx-auto'>
              Progressive roles demonstrating growth in technical expertise and leadership
            </p>
          </div>

          <div className='space-y-8'>
            {experiences.map(experience => (
              <div
                key={experience.id}
                className='bg-hunter-800/50 backdrop-blur-md border border-hunter-600/30 rounded-2xl p-8 hover:transform hover:scale-105 transition-all duration-200'
              >
                <div className='flex flex-col lg:flex-row lg:items-start lg:justify-between mb-6'>
                  <div className='flex-1'>
                    <div className='flex items-center mb-2'>
                      <div className='w-10 h-10 bg-gradient-to-br from-hunter-500 to-hunter-600 rounded-full flex items-center justify-center mr-4'>
                        <Briefcase className='h-5 w-5 text-white' />
                      </div>
                      <div>
                        <h3 className='text-2xl font-bold text-white'>{experience.title}</h3>
                        <p className='text-xl text-hunter-300'>{experience.company}</p>
                      </div>
                    </div>
                  </div>

                  <div className='lg:text-right mt-4 lg:mt-0'>
                    <div className='flex items-center justify-center lg:justify-end mb-2'>
                      <Calendar className='h-4 w-4 text-hunter-400 mr-2' />
                      <span className='text-hunter-200'>{experience.period}</span>
                    </div>
                    <div className='flex items-center justify-center lg:justify-end'>
                      <MapPin className='h-4 w-4 text-hunter-400 mr-2' />
                      <span className='text-hunter-200'>{experience.location}</span>
                    </div>
                  </div>
                </div>

                <p className='text-hunter-200 mb-6 leading-relaxed'>{experience.description}</p>

                <div className='mb-6'>
                  <h4 className='text-lg font-semibold text-white mb-3 flex items-center'>
                    <Award className='h-5 w-5 text-hunter-400 mr-2' />
                    Key Achievements
                  </h4>
                  <ul className='space-y-2'>
                    {experience.achievements.map((achievement, index) => (
                      <li key={index} className='flex items-start'>
                        <span className='w-2 h-2 bg-hunter-400 rounded-full mt-2 mr-3 flex-shrink-0'></span>
                        <span className='text-hunter-200'>{achievement}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className='text-lg font-semibold text-white mb-3 flex items-center'>
                    <TrendingUp className='h-5 w-5 text-hunter-400 mr-2' />
                    Technologies Used
                  </h4>
                  <div className='flex flex-wrap gap-2'>
                    {experience.technologies.map((tech, index) => (
                      <span
                        key={index}
                        className='px-3 py-1 bg-hunter-700/50 text-hunter-200 text-sm rounded-full border border-hunter-600/30'
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Education */}
        <section className='mb-20'>
          <div className='text-center mb-12'>
            <h2 className='text-3xl font-bold text-white mb-4'>Education</h2>
            <p className='text-xl text-hunter-200 max-w-2xl mx-auto'>
              Academic foundation that supports my technical expertise
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
            {education.map(edu => (
              <div
                key={edu.id}
                className='bg-hunter-800/50 backdrop-blur-md border border-hunter-600/30 rounded-2xl p-8 hover:transform hover:scale-105 transition-all duration-200'
              >
                <div className='flex items-center mb-4'>
                  <div className='w-12 h-12 bg-gradient-to-br from-hunter-500 to-hunter-600 rounded-full flex items-center justify-center mr-4'>
                    <Award className='h-6 w-6 text-white' />
                  </div>
                  <div>
                    <h3 className='text-xl font-bold text-white'>{edu.degree}</h3>
                    <p className='text-hunter-300'>{edu.institution}</p>
                  </div>
                </div>

                <div className='mb-4'>
                  <div className='flex items-center text-hunter-200 mb-2'>
                    <Calendar className='h-4 w-4 mr-2' />
                    {edu.period}
                  </div>
                </div>

                <p className='text-hunter-200 leading-relaxed'>{edu.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Certifications */}
        <section className='mb-20'>
          <div className='text-center mb-12'>
            <h2 className='text-3xl font-bold text-white mb-4'>Professional Certifications</h2>
            <p className='text-xl text-hunter-200 max-w-2xl mx-auto'>
              Industry-recognized credentials validating my expertise
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
            {certifications.map(cert => (
              <div
                key={cert.id}
                className='bg-hunter-800/50 backdrop-blur-md border border-hunter-600/30 rounded-2xl p-6 hover:transform hover:scale-105 transition-all duration-200 text-center'
              >
                <div className='w-16 h-16 bg-gradient-to-br from-hunter-500 to-hunter-600 rounded-full flex items-center justify-center mx-auto mb-4'>
                  <Award className='h-8 w-8 text-white' />
                </div>

                <h3 className='text-lg font-bold text-white mb-2'>{cert.name}</h3>
                <p className='text-hunter-300 mb-2'>{cert.issuer}</p>
                <p className='text-hunter-400 text-sm mb-3'>{cert.date}</p>
                <p className='text-hunter-200 text-sm leading-relaxed'>{cert.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Professional Growth */}
        <section className='mb-20'>
          <div className='text-center mb-12'>
            <h2 className='text-3xl font-bold text-white mb-4'>Professional Growth</h2>
            <p className='text-xl text-hunter-200 max-w-2xl mx-auto'>
              Continuous learning and skill development throughout my career
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
            <div className='bg-hunter-800/50 backdrop-blur-md border border-hunter-600/30 rounded-xl p-6 text-center'>
              <div className='w-16 h-16 bg-gradient-to-br from-hunter-500 to-hunter-600 rounded-full flex items-center justify-center mx-auto mb-4'>
                <Users className='h-8 w-8 text-white' />
              </div>
              <h3 className='text-xl font-bold text-white mb-2'>Team Leadership</h3>
              <p className='text-hunter-200 text-sm'>
                Leading development teams and mentoring junior engineers
              </p>
            </div>

            <div className='bg-hunter-800/50 backdrop-blur-md border border-hunter-600/30 rounded-xl p-6 text-center'>
              <div className='w-16 h-16 bg-gradient-to-br from-hunter-500 to-hunter-600 rounded-full flex items-center justify-center mx-auto mb-4'>
                <TrendingUp className='h-8 w-8 text-white' />
              </div>
              <h3 className='text-xl font-bold text-white mb-2'>Technical Growth</h3>
              <p className='text-hunter-200 text-sm'>
                Expanding expertise from web development to AI/ML engineering
              </p>
            </div>

            <div className='bg-hunter-800/50 backdrop-blur-md border border-hunter-600/30 rounded-xl p-6 text-center'>
              <div className='w-16 h-16 bg-gradient-to-br from-hunter-500 to-hunter-600 rounded-full flex items-center justify-center mx-auto mb-4'>
                <Award className='h-8 w-8 text-white' />
              </div>
              <h3 className='text-xl font-bold text-white mb-2'>Certifications</h3>
              <p className='text-hunter-200 text-sm'>
                Earning industry-recognized credentials in cloud and AI technologies
              </p>
            </div>

            <div className='bg-hunter-800/50 backdrop-blur-md border border-hunter-600/30 rounded-xl p-6 text-center'>
              <div className='w-16 h-16 bg-gradient-to-br from-hunter-500 to-hunter-600 rounded-full flex items-center justify-center mx-auto mb-4'>
                <Briefcase className='h-8 w-8 text-white' />
              </div>
              <h3 className='text-xl font-bold text-white mb-2'>Project Success</h3>
              <p className='text-hunter-200 text-sm'>
                Delivering successful projects across various domains and technologies
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className='text-center'>
          <div className='bg-gradient-to-r from-hunter-800/80 to-hunter-700/80 backdrop-blur-md border border-hunter-600/30 rounded-2xl p-12'>
            <h2 className='text-3xl font-bold text-white mb-6'>Ready to Work Together?</h2>
            <p className='text-xl text-hunter-200 mb-8 max-w-2xl mx-auto'>
              My experience spans from early-stage startups to enterprise solutions. Let's discuss
              how my background can benefit your project.
            </p>
            <a
              href='/contact'
              className='inline-flex items-center px-10 py-4 bg-gradient-to-r from-hunter-500 to-hunter-600 text-white font-semibold rounded-lg hover:from-hunter-600 hover:to-hunter-700 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl text-lg'
            >
              Start a Conversation
            </a>
          </div>
        </section>
      </div>
    </div>
  );
};
