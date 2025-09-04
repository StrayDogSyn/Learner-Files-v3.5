// Utility functions and types
export * from './utils';

// Components
export * from './Button';
export * from './Card';
export * from './Input';
export * from './Badge';
export * from './Modal';

// Re-export commonly used types
export type {
  DomainType,
  GlassVariant,
  AnimationType,
} from './utils';

// Component prop types for external use
export type {
  ButtonProps,
} from './Button';

export type {
  CardProps,
  CardHeaderProps,
  CardContentProps,
  CardFooterProps,
} from './Card';

export type {
  InputProps,
} from './Input';

export type {
  BadgeProps,
} from './Badge';

export type {
  ModalProps,
  ModalHeaderProps,
  ModalContentProps,
  ModalFooterProps,
} from './Modal';

// Constants for external use
export {
  colors,
  glassVariants,
  domainColors,
  animations,
  shadows,
  breakpoints,
  formatters,
  validators,
  a11y,
} from './utils';