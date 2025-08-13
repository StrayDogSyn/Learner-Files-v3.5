import React from 'react';

interface GlassContainerProps {
  variant?: 'primary' | 'secondary' | 'premium' | 'hunter';
  blur?: 'subtle' | 'medium' | 'heavy';
  children?: React.ReactNode;
  className?: string;
  onClick?: () => void;
  as?: keyof JSX.IntrinsicElements;
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

  return (
    <Component
      className={combinedClassName}
      onClick={onClick}
      {...props}
    >
      {children}
    </Component>
  );
};

export default GlassContainer;