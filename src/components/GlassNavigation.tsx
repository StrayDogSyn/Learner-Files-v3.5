import React from 'react';

interface NavigationItem {
  id: string;
  label: string;
  href?: string;
  onClick?: () => void;
}

interface GlassNavigationProps {
  items: NavigationItem[];
  activeItem?: string;
  className?: string;
  logo?: React.ReactNode;
}

const GlassNavigation: React.FC<GlassNavigationProps> = ({
  items,
  activeItem,
  className = '',
  logo,
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

          {/* Navigation Items */}
          <div className="hidden md:flex space-x-2">
            {items.map((item) => (
              <button
                key={item.id}
                onClick={() => handleItemClick(item)}
                className={`glass-nav-item ${
                  activeItem === item.id ? 'active' : ''
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button className="glass-nav-item p-2">
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