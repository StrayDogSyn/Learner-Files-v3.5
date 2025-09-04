import React from 'react';
import { cn, domainColors, type DomainType } from './utils';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  domain?: DomainType;
  variant?: 'default' | 'glass' | 'outline';
  inputSize?: 'sm' | 'md' | 'lg';
  error?: string;
  label?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  showPasswordToggle?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({
    className,
    domain = 'corporate',
    variant = 'glass',
    inputSize = 'md',
    type = 'text',
    error,
    label,
    hint,
    leftIcon,
    rightIcon,
    showPasswordToggle = false,
    disabled,
    ...props
  }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const [isFocused, setIsFocused] = React.useState(false);
    const domainColor = domainColors[domain];
    const isPassword = type === 'password';
    const inputType = isPassword && showPassword ? 'text' : type;
    
    const sizeClasses = {
      sm: 'h-8 px-3 text-sm',
      md: 'h-10 px-4 text-sm',
      lg: 'h-12 px-4 text-base',
    };
    
    const variantClasses = {
      default: cn(
        'bg-white/5 border border-white/20',
        'focus:bg-white/10 focus:border-white/40'
      ),
      glass: cn(
        'bg-white/10 backdrop-blur-md border border-white/20',
        'focus:bg-white/15 focus:border-white/40',
        'shadow-[0_4px_16px_0_rgba(31,38,135,0.2)]'
      ),
      outline: cn(
        'bg-transparent border-2',
        `border-[${domainColor.primary}]/30`,
        `focus:border-[${domainColor.accent}]`
      ),
    };
    
    const baseClasses = cn(
      'w-full rounded-lg transition-all duration-300',
      'text-white placeholder:text-gray-400',
      'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent',
      `focus:ring-[${domainColor.accent}]/50`,
      error && 'border-red-400 focus:border-red-400 focus:ring-red-400/50',
      disabled && 'opacity-50 cursor-not-allowed',
      leftIcon && 'pl-10',
      (rightIcon || showPasswordToggle || isPassword) && 'pr-10'
    );
    
    const iconClasses = 'absolute top-1/2 transform -translate-y-1/2 text-gray-400 transition-colors duration-200';
    
    return (
      <div className="space-y-2">
        {label && (
          <label className="block text-sm font-medium text-gray-200">
            {label}
            {props.required && <span className="text-red-400 ml-1">*</span>}
          </label>
        )}
        
        <div className="relative">
          {leftIcon && (
            <div className={cn(iconClasses, 'left-3')}>
              {leftIcon}
            </div>
          )}
          
          <input
            type={inputType}
            className={cn(
              baseClasses,
              sizeClasses[inputSize],
              variantClasses[variant],
              className
            )}
            ref={ref}
            disabled={disabled}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            style={{
              boxShadow: isFocused ? `0 0 0 2px ${domainColor.accent}40` : undefined,
            }}
            {...props}
          />
          
          {(rightIcon || showPasswordToggle || isPassword) && (
            <div className={cn(iconClasses, 'right-3 flex items-center space-x-1')}>
              {rightIcon && !isPassword && rightIcon}
              {(showPasswordToggle || isPassword) && (
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-400 hover:text-gray-200 transition-colors duration-200 focus:outline-none"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff size={16} />
                  ) : (
                    <Eye size={16} />
                  )}
                </button>
              )}
              {error && (
                <AlertCircle size={16} className="text-red-400" />
              )}
            </div>
          )}
          
          {/* Focus glow effect */}
          {isFocused && (
            <div 
              className="absolute inset-0 rounded-lg pointer-events-none opacity-20"
              style={{
                boxShadow: `0 0 20px ${domainColor.accent}`,
              }}
            />
          )}
        </div>
        
        {(error || hint) && (
          <div className="flex items-start space-x-1">
            {error && (
              <>
                <AlertCircle size={14} className="text-red-400 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-red-400">{error}</p>
              </>
            )}
            {!error && hint && (
              <p className="text-sm text-gray-400">{hint}</p>
            )}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };