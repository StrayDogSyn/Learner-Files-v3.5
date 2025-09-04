import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Card, Button } from '@straydog/ui-components';
import { useDomainRouting } from '../hooks/useDomainRouting';
import { 
  Home, 
  Building2, 
  Code, 
  GraduationCap, 
  Scale,
  Menu,
  X
} from 'lucide-react';

const DashboardLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const location = useLocation();
  const { 
    currentDomain, 
    breadcrumbs, 
    navigateToDomain, 
    // getDomainMetadata - removed as not available 
  } = useDomainRouting();

  const domains = [
    { key: 'corporate', icon: Building2, label: 'Corporate' },
    { key: 'technical', icon: Code, label: 'Technical' },
    { key: 'educational', icon: GraduationCap, label: 'Educational' },
    { key: 'justice-reform', icon: Scale, label: 'Justice Reform' },
  ] as const;

  // const navigationItems = [
  //   { path: '/', label: 'Dashboard', icon: Home },
  //   { path: '/analytics', label: 'Analytics', icon: BarChart3 },
  //   { path: '/corporate', label: 'Corporate', icon: Building2 },
  //   { path: '/technical', label: 'Technical', icon: Code },
  //   { path: '/educational', label: 'Educational', icon: GraduationCap },
  //   { path: '/justice-reform', label: 'Justice Reform', icon: Scale }
  // ];

  // const currentDomainMeta = currentDomain ? getDomainMetadata(currentDomain) : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1A3009] via-[#2D5016] to-[#4A7C59]">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out lg:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <Card 
          variant="dark" 
          className="h-full rounded-none border-r border-white/20 bg-white/5 backdrop-blur-xl"
        >
          <div className="flex h-full flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/20">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#8FBC8F] to-[#6B8E23] flex items-center justify-center">
                  <Scale className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-xl font-bold text-white">StrayDog AI</h1>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2">
              <Button
                variant={location.pathname === '/' ? 'primary' : 'ghost'}
                className="w-full justify-start"
                onClick={() => {
                  navigateToDomain('corporate');
                  setSidebarOpen(false);
                }}
              >
                <Home className="w-5 h-5 mr-3" />
                Dashboard Home
              </Button>

              <div className="pt-4">
                <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-3">
                  Domains
                </h3>
                <div className="space-y-1">
                  {domains.map(({ key, icon: Icon, label }) => {
                    const isActive = currentDomain === key;
                    // const domainMeta = getDomainMetadata(key); - removed as not available
                    
                    return (
                      <Button
                        key={key}
                        variant={isActive ? 'primary' : 'ghost'}
                        domain={key}
                        className="w-full justify-start"
                        onClick={() => {
                          navigateToDomain(key as any);
                          setSidebarOpen(false);
                        }}
                      >
                        <Icon className="w-5 h-5 mr-3" />
                        {label}
                      </Button>
                    );
                  })}
                </div>
              </div>
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-white/20">
              <div className="text-xs text-gray-400 text-center">
                AI-Powered Justice Reform Ecosystem
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <header className="sticky top-0 z-30">
          <Card 
            variant="dark" 
            className="rounded-none border-b border-white/20 bg-white/5 backdrop-blur-xl"
          >
            <div className="flex items-center justify-between px-6 py-4">
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden"
                >
                  <Menu className="w-5 h-5" />
                </Button>
                
                {/* Breadcrumbs */}
                <nav className="flex items-center space-x-2 text-sm">
                  {breadcrumbs.map((crumb, index) => (
                    <React.Fragment key={crumb.path}>
                      {index > 0 && (
                        <span className="text-gray-400">/</span>
                      )}
                      <button
                        onClick={() => navigateToDomain(crumb.path as any)}
                        className="text-gray-300 hover:text-white transition-colors duration-200"
                      >
                        {crumb.label}
                      </button>
                    </React.Fragment>
                  ))}
                </nav>
              </div>

              {/* Domain indicator - commented out */}
            </div>
          </Card>
        </header>

        {/* Page content */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export { DashboardLayout };