import React from 'react';
import { AIROICalculator } from '../components/ai';

const ROICalculatorPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <AIROICalculator />
    </div>
  );
};

export default ROICalculatorPage;