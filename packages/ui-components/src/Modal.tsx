import React from 'react';
import { cn, domainColors, type DomainType } from './utils';
import { X } from 'lucide-react';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  domain?: DomainType;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  showCloseButton?: boolean;
  children: React.ReactNode;
  className?: string;
}

export interface ModalHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export interface ModalContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export interface ModalFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  size = 'md',
  domain = 'corporate',
  closeOnOverlayClick = true,
  closeOnEscape = true,
  showCloseButton = true,
  children,
  className,
}) => {
  const domainColor = domainColors[domain];
  
  // Handle escape key
  React.useEffect(() => {
    if (!closeOnEscape) return;
    
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose, closeOnEscape]);
  
  // Prevent body scroll when modal is open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);
  
  if (!isOpen) return null;
  
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-[95vw] max-h-[95vh]',
  };
  
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && closeOnOverlayClick) {
      onClose();
    }
  };
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={handleOverlayClick}
        style={{
          background: `radial-gradient(circle at center, ${domainColor.primary}20, rgba(0,0,0,0.8))`
        }}
      />
      
      {/* Modal */}
      <div
        className={cn(
          'relative w-full bg-white/10 backdrop-blur-md border border-white/20',
          'rounded-xl shadow-[0_20px_60px_0_rgba(31,38,135,0.5)]',
          'transform transition-all duration-300',
          'animate-[modalSlideIn_0.3s_ease-out]',
          sizeClasses[size],
          size === 'full' ? 'h-full' : 'max-h-[90vh]',
          className
        )}
        style={{
          borderColor: `${domainColor.accent}40`,
        }}
      >
        {/* Header */}
        {(title || description || showCloseButton) && (
          <div className="flex items-start justify-between p-6 border-b border-white/10">
            <div className="flex-1">
              {title && (
                <h2 className="text-xl font-semibold text-white mb-1">
                  {title}
                </h2>
              )}
              {description && (
                <p className="text-gray-300 text-sm">
                  {description}
                </p>
              )}
            </div>
            
            {showCloseButton && (
              <button
                onClick={onClose}
                className={cn(
                  'ml-4 p-2 rounded-lg transition-all duration-200',
                  'text-gray-400 hover:text-white',
                  'hover:bg-white/10 focus:bg-white/10',
                  'focus:outline-none focus:ring-2 focus:ring-white/20'
                )}
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            )}
          </div>
        )}
        
        {/* Content */}
        <div className={cn(
          'overflow-y-auto',
          size === 'full' ? 'flex-1' : 'max-h-[60vh]'
        )}>
          {children}
        </div>
        
        {/* Subtle domain-colored gradient overlay */}
        <div 
          className="absolute inset-0 rounded-xl opacity-5 pointer-events-none"
          style={{
            background: `linear-gradient(135deg, ${domainColor.primary}, ${domainColor.accent})`
          }}
        />
      </div>
    </div>
  );
};

const ModalHeader = React.forwardRef<HTMLDivElement, ModalHeaderProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('px-6 py-4 border-b border-white/10', className)}
      {...props}
    >
      {children}
    </div>
  )
);

const ModalContent = React.forwardRef<HTMLDivElement, ModalContentProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('px-6 py-4 text-gray-200', className)}
      {...props}
    >
      {children}
    </div>
  )
);

const ModalFooter = React.forwardRef<HTMLDivElement, ModalFooterProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'flex items-center justify-end space-x-3 px-6 py-4',
        'border-t border-white/10',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
);

ModalHeader.displayName = 'ModalHeader';
ModalContent.displayName = 'ModalContent';
ModalFooter.displayName = 'ModalFooter';

export { Modal, ModalHeader, ModalContent, ModalFooter };

// Add keyframes for modal animation
const modalKeyframes = `
@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(-10px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}
`;

// Inject keyframes into document head
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = modalKeyframes;
  document.head.appendChild(style);
}