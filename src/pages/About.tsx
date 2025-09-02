import React from 'react';
import { MapPin, Calendar, Award, Users, Target, Lightbulb } from 'lucide-react';
import { developerProfile } from '../data/portfolioData';

const InfoCard: React.FC<{ icon: React.ReactNode; title: string; content: string }> = ({ icon, title, content }) => (
  <div className="glass-card p-6 hover:glass-medium transition-all duration-300">
    <div className="flex items-center mb-4">
      <div className="text-emerald-400 mr-3">{icon}</div>
      <h3 className="text-xl font-semibold text-white">{title}</h3>
    </div>
    <p className="text-hunter-200 leading-relaxed">{content}</p>
  </div>
);

const DifferentiatorCard: React.FC<{ title: string; description: string; index: number }> = ({ title, description, index }) => (
  <div className="glass-card p-6 hover:glass-medium transition-all duration-300 group">
    <div className="flex items-center mb-4">
      <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-hunter-500 rounded-full flex items-center justify-center text-white font-bold text-sm mr-3">
        {index + 1}
      </div>
      <h3 className="text-xl font-semibold text-emerald-400 group-hover:text-emerald-300 transition-colors">
        {title}
      </h3>
    </div>
    <p className="text-hunter-200 leading-relaxed">{description}</p>
  </div>
);

export const About: React.FC = () => {
  const differentiatorDescriptions = {
    "AI/LLM Integration Specialist": "Deep expertise in integrating cutting-edge AI and Large Language Models into business applications, creating intelligent solutions that drive efficiency and innovation.",
    "Full-Stack Development Expert": "Comprehensive mastery of both frontend and backend technologies, enabling end-to-end solution development with seamless user experiences.",
    "Business Leadership & Strategy": "Proven track record in leading technical teams and driving strategic initiatives that align technology solutions with business objectives.",
    "Cloud Architecture & DevOps": "Extensive experience in designing scalable cloud infrastructures and implementing robust DevOps practices for enterprise-level applications.",
    "Data Science & Analytics": "Advanced skills in data analysis, machine learning, and statistical modeling to extract actionable insights from complex datasets.",
    "Cybersecurity & Compliance": "Strong foundation in security best practices and regulatory compliance, ensuring robust and secure application development."
  };

  return (
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            About Eric Hunter Petross
          </h1>
          <p className="text-xl text-hunter-200 max-w-3xl mx-auto leading-relaxed">
            A seasoned technology leader with over a decade of experience in software development, 
            AI integration, and business strategy. Passionate about creating innovative solutions 
            that bridge the gap between cutting-edge technology and real-world business needs.
          </p>
        </div>

        {/* Professional Overview */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            Professional Overview
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <InfoCard
              icon={<MapPin size={24} />}
              title="Location & Availability"
              content={`Based in ${developerProfile.location}, available for remote collaboration worldwide. Open to both contract and full-time opportunities with forward-thinking organizations.`}
            />
            <InfoCard
              icon={<Calendar size={24} />}
              title="Experience Timeline"
              content="Over 10 years of progressive experience in software development, from junior developer to technical leadership roles, with a focus on emerging technologies and AI integration."
            />
            <InfoCard
              icon={<Award size={24} />}
              title="Certifications & Education"
              content="Continuously expanding expertise through professional certifications in cloud platforms, AI/ML technologies, and modern development frameworks. Committed to lifelong learning."
            />
            <InfoCard
              icon={<Users size={24} />}
              title="Leadership Philosophy"
              content="Believes in empowering teams through mentorship, fostering innovation through collaboration, and delivering value through strategic technology implementation."
            />
          </div>
        </section>

        {/* Key Differentiators */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            What Sets Me Apart
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {developerProfile.keyDifferentiators.map((differentiator, index) => (
              <DifferentiatorCard
                key={index}
                title={differentiator}
                description={differentiatorDescriptions[differentiator as keyof typeof differentiatorDescriptions] || "Specialized expertise with proven results."}
                index={index}
              />
            ))}
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="mb-16">
          <div className="glass-card p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <div className="flex items-center mb-4">
                  <Target className="text-emerald-400 mr-3" size={28} />
                  <h3 className="text-2xl font-bold text-white">Mission</h3>
                </div>
                <p className="text-hunter-200 leading-relaxed">
                  To leverage cutting-edge technology, particularly AI and machine learning, 
                  to solve complex business challenges and create meaningful impact. I strive 
                  to build solutions that are not only technically excellent but also 
                  strategically aligned with business objectives.
                </p>
              </div>
              <div>
                <div className="flex items-center mb-4">
                  <Lightbulb className="text-emerald-400 mr-3" size={28} />
                  <h3 className="text-2xl font-bold text-white">Vision</h3>
                </div>
                <p className="text-hunter-200 leading-relaxed">
                  To be at the forefront of technological innovation, helping organizations 
                  navigate the rapidly evolving digital landscape. I envision a future where 
                  AI and human creativity work in harmony to unlock unprecedented possibilities 
                  for business growth and societal benefit.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Personal Approach */}
        <section>
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            My Approach
          </h2>
          <div className="glass-card p-8">
            <div className="prose prose-lg max-w-none">
              <p className="text-hunter-200 leading-relaxed mb-6">
                I believe that the best technology solutions emerge from a deep understanding 
                of both technical possibilities and business realities. My approach combines 
                rigorous technical expertise with strategic thinking, ensuring that every 
                solution I develop is not just technically sound, but also delivers measurable 
                business value.
              </p>
              <p className="text-hunter-200 leading-relaxed mb-6">
                Whether I'm architecting a complex AI system, leading a development team, 
                or consulting on technology strategy, I focus on three core principles: 
                innovation, reliability, and scalability. These principles guide every 
                decision I make and every solution I deliver.
              </p>
              <p className="text-hunter-200 leading-relaxed">
                I'm passionate about staying at the cutting edge of technology while 
                maintaining a practical focus on real-world applications. This balance 
                allows me to bring both visionary thinking and pragmatic execution to 
                every project I undertake.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};