import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { navigationItems } from '../data/portfolioData';

export const Navigation: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-hunter-400/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-hunter-400 to-emerald-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">EH</span>
            </div>
            <span className="text-white font-semibold text-lg hidden sm:block">
              Eric Hunter Petross
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navigationItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
                      isActive
                        ? 'bg-hunter-500/30 text-emerald-300 border border-emerald-400/30'
                        : 'text-hunter-100 hover:bg-hunter-600/30 hover:text-emerald-200'
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-hunter-100 hover:text-emerald-300 hover:bg-hunter-600/30 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 glass-subtle border-t border-hunter-400/20">
            {navigationItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`block px-3 py-2 rounded-md text-base font-medium transition-all duration-300 ${
                    isActive
                      ? 'bg-hunter-500/30 text-emerald-300 border border-emerald-400/30'
                      : 'text-hunter-100 hover:bg-hunter-600/30 hover:text-emerald-200'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
};