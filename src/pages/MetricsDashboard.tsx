import React from 'react';
import { AIMetricsDashboard } from '../components/ai';

const MetricsDashboardPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <AIMetricsDashboard />
    </div>
  );
};

export default MetricsDashboardPage;