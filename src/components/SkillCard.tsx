import React from 'react';
import { FaCode, FaServer, FaDatabase, FaTools } from 'react-icons/fa';
import GlassCard from './GlassCard';

interface SkillCardProps {
  name: string;
  level: number;
  category: 'frontend' | 'backend' | 'database' | 'tools';
  icon?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const SkillCard: React.FC<SkillCardProps> = ({
  name,
  level,
  category,
  icon,
  className = '',
  style,
}) => {
  const getCategoryIcon = () => {
    if (icon) return icon;
    
    switch (category) {
      case 'frontend':
        return <FaCode className="text-hunter-emerald" />;
      case 'backend':
        return <FaServer className="text-metallic-silver" />;
      case 'database':
        return <FaDatabase className="text-hunter-core" />;
      case 'tools':
        return <FaTools className="text-metallic-platinum" />;
      default:
        return <FaCode className="text-hunter-emerald" />;
    }
  };

  const getCategoryColor = () => {
    switch (category) {
      case 'frontend':
        return 'from-hunter-emerald to-metallic-silver';
      case 'backend':
        return 'from-metallic-silver to-hunter-core';
      case 'database':
        return 'from-hunter-core to-hunter-forest';
      case 'tools':
        return 'from-metallic-platinum to-metallic-gunmetal';
      default:
        return 'from-hunter-emerald to-metallic-silver';
    }
  };

  return (
    <GlassCard 
      variant="hunter" 
      className={`skill-card ${className}`}
      padding="md"
      style={style}
    >
      <div className="flex items-center mb-4">
        <div className="text-2xl mr-3">
          {getCategoryIcon()}
        </div>
        <div>
          <h3 className="font-display font-semibold text-glass-light text-lg">
            {name}
          </h3>
          <p className="text-hunter-sage text-sm capitalize">
            {category}
          </p>
        </div>
      </div>
      
      <div className="mb-2">
        <div className="flex justify-between items-center mb-2">
          <span className="text-glass-light font-medium">
            Proficiency
          </span>
          <span className="text-hunter-emerald font-display font-semibold">
            {level}%
          </span>
        </div>
        
        <div className="skill-progress-container">
          <div
            className="skill-progress-bar"
            data-skill-level={level}
            style={{
              background: `linear-gradient(90deg, var(--hunter-green-core), var(--emerald-accent), var(--silver-steel))`
            }}
          ></div>
        </div>
      </div>
      
      <div className="mt-4">
        <div className={`h-1 bg-gradient-to-r ${getCategoryColor()} rounded-full opacity-60`}></div>
      </div>
    </GlassCard>
  );
};

export default SkillCard;