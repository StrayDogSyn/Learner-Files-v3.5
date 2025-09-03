import React from 'react';
import { AICaseStudyGenerator } from '../components/ai';

const CaseStudyGeneratorPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <AICaseStudyGenerator />
    </div>
  );
};

export default CaseStudyGeneratorPage;