import React from 'react';
import { Link } from 'react-router-dom';

interface NavigationItem {
  id: string;
  label: string;
  href?: string;
  onClick?: () => void;
  isRoute?: boolean;
}

interface GlassNavigationProps {
  items: NavigationItem[];
  activeItem?: string;
  className?: string;
  logo?: React.ReactNode;
  actions?: React.ReactNode;
}

const GlassNavigation: React.FC<GlassNavigationProps> = ({
  items,
  activeItem,
  className = '',
  logo,
  actions,
}) => {
  const handleItemClick = (item: NavigationItem) => {
    if (item.onClick) {
      item.onClick();
    } else if (item.href) {
      const element = document.getElementById(item.href.replace('#', ''));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <nav className={`glass-nav ${className}`}>
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo Section */}
          <div className="flex items-center">
            {logo || (
              <h1 className="text-xl font-display font-bold text-metallic bg-gradient-to-r from-hunter-emerald to-metallic-silver bg-clip-text text-transparent">
                StrayDog Syndications
              </h1>
            )}
          </div>

          {/* Navigation Items & Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex space-x-2">
              {items.map((item) => {
                if (item.isRoute && item.href) {
                  return (
                    <Link
                      key={item.id}
                      to={item.href}
                      className={`glass-nav-item ${
                        activeItem === item.id ? 'active' : ''
                      }`}
                    >
                      {item.label}
                    </Link>
                  );
                }
                return (
                  <button
                    key={item.id}
                    onClick={() => handleItemClick(item)}
                    className={`glass-nav-item ${
                      activeItem === item.id ? 'active' : ''
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
            {actions && (
              <div className="flex items-center space-x-2">
                {actions}
              </div>
            )}
          </div>

          {/* Mobile Menu & Actions */}
          <div className="md:hidden flex items-center space-x-2">
            {actions && (
              <div className="flex items-center space-x-2">
                {actions}
              </div>
            )}
            <button 
              className="glass-nav-item p-2"
              title="Toggle mobile menu"
              aria-label="Toggle mobile menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default GlassNavigation;