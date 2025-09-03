// AI Domain Selector Component with Glassmorphic Design

import React, { useState } from 'react';
import { Brain, Sparkles, Zap, Scale, ChevronDown, Check } from 'lucide-react';
import { DomainType } from '../../shared/types/ai';

interface DomainInfo {
  domain: DomainType;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  features: string[];
}

interface AIDomainSelectorProps {
  selectedDomain: DomainType;
  onDomainChange: (domain: DomainType) => void;
  className?: string;
  variant?: 'dropdown' | 'grid' | 'tabs';
  showDescriptions?: boolean;
}

const domainInfo: Record<DomainType, DomainInfo> = {
  corporate: {
    domain: 'corporate',
    title: 'Corporate AI',
    description: 'Executive content, leadership profiles, and strategic communications',
    icon: <Sparkles className="w-5 h-5" />,
    color: 'from-emerald-500 to-green-600',
    features: ['Press Releases', 'Executive Summaries', 'Leadership Profiles', 'Strategic Plans']
  },
  technical: {
    domain: 'technical',
    title: 'Technical AI',
    description: 'Code generation, technical documentation, and architecture design',
    icon: <Brain className="w-5 h-5" />,
    color: 'from-blue-500 to-cyan-600',
    features: ['Code Generation', 'API Documentation', 'Technical Specs', 'Architecture Design']
  },
  business: {
    domain: 'business',
    title: 'Business AI',
    description: 'Lead qualification, ROI analysis, and business strategy development',
    icon: <Zap className="w-5 h-5" />,
    color: 'from-purple-500 to-violet-600',
    features: ['Lead Qualification', 'ROI Analysis', 'Market Research', 'Business Plans']
  },
  justice: {
    domain: 'justice',
    title: 'Justice AI',
    description: 'Impact metrics, policy analysis, and criminal justice reform strategies',
    icon: <Scale className="w-5 h-5" />,
    color: 'from-amber-500 to-orange-600',
    features: ['Impact Metrics', 'Policy Analysis', 'Legal Research', 'Reform Strategies']
  }
};

export const AIDomainSelector: React.FC<AIDomainSelectorProps> = ({
  selectedDomain,
  onDomainChange,
  className = '',
  variant = 'dropdown',
  showDescriptions = true
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedInfo = domainInfo[selectedDomain];

  const handleDomainSelect = (domain: DomainType) => {
    onDomainChange(domain);
    setIsOpen(false);
  };

  if (variant === 'dropdown') {
    return (
      <div className={`relative ${className}`}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between p-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white hover:bg-white/20 transition-all duration-200"
        >
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg bg-gradient-to-br ${selectedInfo.color}`}>
              {selectedInfo.icon}
            </div>
            <div className="text-left">
              <div className="font-semibold">{selectedInfo.title}</div>
              {showDescriptions && (
                <div className="text-sm text-emerald-300/70">{selectedInfo.description}</div>
              )}
            </div>
          </div>
          <ChevronDown className={`w-5 h-5 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`} />
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl overflow-hidden z-50">
            {Object.values(domainInfo).map((info) => (
              <button
                key={info.domain}
                onClick={() => handleDomainSelect(info.domain)}
                className="w-full flex items-center gap-3 p-4 text-white hover:bg-white/20 transition-all duration-200 border-b border-white/10 last:border-b-0"
              >
                <div className={`p-2 rounded-lg bg-gradient-to-br ${info.color}`}>
                  {info.icon}
                </div>
                <div className="flex-1 text-left">
                  <div className="font-semibold">{info.title}</div>
                  {showDescriptions && (
                    <div className="text-sm text-emerald-300/70">{info.description}</div>
                  )}
                </div>
                {selectedDomain === info.domain && (
                  <Check className="w-5 h-5 text-emerald-400" />
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (variant === 'grid') {
    return (
      <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${className}`}>
        {Object.values(domainInfo).map((info) => (
          <button
            key={info.domain}
            onClick={() => handleDomainSelect(info.domain)}
            className={`p-6 rounded-xl border-2 transition-all duration-200 text-left ${
              selectedDomain === info.domain
                ? 'border-emerald-500 bg-emerald-500/20'
                : 'border-white/20 bg-white/10 hover:bg-white/20'
            }`}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className={`p-3 rounded-lg bg-gradient-to-br ${info.color}`}>
                {info.icon}
              </div>
              <div>
                <h3 className="font-semibold text-white">{info.title}</h3>
                {selectedDomain === info.domain && (
                  <Check className="w-4 h-4 text-emerald-400 mt-1" />
                )}
              </div>
            </div>
            
            {showDescriptions && (
              <>
                <p className="text-emerald-300/70 text-sm mb-3">{info.description}</p>
                <div className="space-y-1">
                  {info.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-1 h-1 bg-emerald-400 rounded-full" />
                      <span className="text-xs text-white/70">{feature}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </button>
        ))}
      </div>
    );
  }

  if (variant === 'tabs') {
    return (
      <div className={`${className}`}>
        <div className="flex flex-wrap gap-2">
          {Object.values(domainInfo).map((info) => (
            <button
              key={info.domain}
              onClick={() => handleDomainSelect(info.domain)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                selectedDomain === info.domain
                  ? 'bg-gradient-to-r from-emerald-600 to-green-700 text-white'
                  : 'bg-white/10 text-emerald-300 hover:bg-white/20'
              }`}
            >
              <div className={`p-1 rounded ${selectedDomain === info.domain ? 'bg-white/20' : ''}`}>
                {React.cloneElement(info.icon as React.ReactElement, {
                  className: 'w-4 h-4'
                })}
              </div>
              <span>{info.title}</span>
              {selectedDomain === info.domain && (
                <Check className="w-4 h-4" />
              )}
            </button>
          ))}
        </div>
        
        {showDescriptions && (
          <div className="mt-4 p-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl">
            <div className="flex items-center gap-3 mb-2">
              <div className={`p-2 rounded-lg bg-gradient-to-br ${selectedInfo.color}`}>
                {selectedInfo.icon}
              </div>
              <h3 className="font-semibold text-white">{selectedInfo.title}</h3>
            </div>
            <p className="text-emerald-300/70 text-sm mb-3">{selectedInfo.description}</p>
            <div className="grid grid-cols-2 gap-2">
              {selectedInfo.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-emerald-400 rounded-full" />
                  <span className="text-xs text-white/70">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return null;
};

export default AIDomainSelector;