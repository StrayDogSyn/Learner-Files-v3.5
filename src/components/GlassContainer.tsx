import React from 'react';

interface GlassContainerProps {
  variant?: 'primary' | 'secondary' | 'premium' | 'hunter';
  blur?: 'subtle' | 'medium' | 'heavy';
  children?: React.ReactNode;
  className?: string;
  onClick?: () => void;
  as?: React.ElementType;
  [key: string]: any;
}

const GlassContainer: React.FC<GlassContainerProps> = ({
  variant = 'primary',
  blur = 'medium',
  children,
  className = '',
  onClick,
  as: Component = 'div',
  ...props
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'secondary':
        return 'glass-container-secondary';
      case 'premium':
        return 'glass-container-premium';
      case 'hunter':
        return 'glass-card-hunter';
      default:
        return 'glass-container';
    }
  };

  const combinedClassName = `${getVariantClasses()} ${className}`;

  return React.createElement(
    Component,
    {
      className: combinedClassName,
      onClick,
      ...props
    },
    children
  );
};

export default GlassContainer;