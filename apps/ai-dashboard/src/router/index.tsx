import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { DashboardLayout } from '../components/DashboardLayout';
import { HomePage } from '../pages/HomePage';
import { AnalyticsPage } from '../pages/AnalyticsPage';

// Domain-specific placeholder components
const CorporatePage: React.FC = () => (
  <div className="space-y-6">
    <h1 className="text-3xl font-bold text-white">Corporate Solutions</h1>
    <p className="text-gray-300">
      AI-powered business intelligence and automation tools for enterprise operations.
    </p>
    <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
      <p className="text-gray-400">Corporate domain features coming soon...</p>
    </div>
  </div>
);

const TechnicalPage: React.FC = () => (
  <div className="space-y-6">
    <h1 className="text-3xl font-bold text-white">Technical Infrastructure</h1>
    <p className="text-gray-300">
      Advanced AI systems for code analysis, system optimization, and technical support.
    </p>
    <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
      <p className="text-gray-400">Technical domain features coming soon...</p>
    </div>
  </div>
);

const EducationalPage: React.FC = () => (
  <div className="space-y-6">
    <h1 className="text-3xl font-bold text-white">Educational Platform</h1>
    <p className="text-gray-300">
      Personalized learning experiences and educational content generation.
    </p>
    <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
      <p className="text-gray-400">Educational domain features coming soon...</p>
    </div>
  </div>
);

const JusticeReformPage: React.FC = () => (
  <div className="space-y-6">
    <h1 className="text-3xl font-bold text-white">Justice Reform</h1>
    <p className="text-gray-300">
      AI-driven insights for criminal justice reform and policy analysis.
    </p>
    <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
      <p className="text-gray-400">Justice reform domain features coming soon...</p>
    </div>
  </div>
);

const router = createBrowserRouter([
  {
    path: '/',
    element: <DashboardLayout />,
    children: [
      {
        index: true,
        element: <HomePage />
      },
      {
        path: 'analytics',
        element: <AnalyticsPage />
      },
      {
        path: 'corporate',
        element: <CorporatePage />
      },
      {
        path: 'corporate/*',
        element: <CorporatePage />
      },
      {
        path: 'technical',
        element: <TechnicalPage />
      },
      {
        path: 'technical/*',
        element: <TechnicalPage />
      },
      {
        path: 'educational',
        element: <EducationalPage />
      },
      {
        path: 'educational/*',
        element: <EducationalPage />
      },
      {
        path: 'justice-reform',
        element: <JusticeReformPage />
      },
      {
        path: 'justice-reform/*',
        element: <JusticeReformPage />
      }
    ]
  }
]);

const AppRouter: React.FC = () => {
  return <RouterProvider router={router} />;
};

export { AppRouter };