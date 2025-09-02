import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/demo', label: 'Demo' },
    { path: '/tech-stack', label: 'Skills' },
    { path: '/portfolio', label: 'Portfolio' },
    { path: '/contact', label: 'Contact' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className='fixed top-0 left-0 right-0 z-50 bg-charcoal-black/90 backdrop-blur-xl border-b border-hunter-600/20 shadow-2xl'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between items-center h-16'>
          {/* Logo */}
          <Link to='/' className='flex items-center space-x-3 group'>
            <div className='w-10 h-10 bg-hunter-700 rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-hunter-500/25 transition-all duration-300 group-hover:scale-105'>
              <span className='text-white font-bold text-lg'>H</span>
            </div>
            <span className='text-hunter-200 font-bold text-xl'>Eric "Hunter" Petross</span>
          </Link>

          {/* Desktop Navigation */}
          <div className='hidden md:flex items-center space-x-1'>
            {navItems.map(item => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 relative overflow-hidden group ${
                  isActive(item.path)
                    ? 'text-white bg-hunter-700/30 border border-hunter-500/30'
                    : 'text-hunter-300 hover:text-white hover:bg-hunter-800/20'
                }`}
              >
                <span className='relative z-10'>{item.label}</span>
                {!isActive(item.path) && (
                  <div className='absolute inset-0 bg-hunter-700/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300' />
                )}
              </Link>
            ))}
          </div>

          {/* Mobile menu button */}
          <div className='md:hidden'>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className='text-hunter-300 hover:text-white p-2 rounded-lg hover:bg-hunter-800/20 transition-all duration-300 hover:scale-105'
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className='md:hidden'>
            <div className='px-2 pt-2 pb-3 space-y-2 bg-charcoal-black/80 backdrop-blur-xl rounded-2xl mt-3 border border-hunter-600/20 shadow-2xl'>
              {navItems.map(item => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`block px-4 py-3 rounded-lg text-base font-medium transition-all duration-300 ${
                    isActive(item.path)
                      ? 'text-white bg-hunter-700/30 border border-hunter-500/30'
                      : 'text-hunter-300 hover:text-white hover:bg-hunter-800/20'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};