import React, { ReactNode, HTMLAttributes } from 'react';
import { MotionProps } from 'framer-motion';
/**
 * Advanced Glassmorphic Component System
 * Hunter Green theme with tech accent variations
 */
export declare const glassStyles: {
    base: {
        backdropFilter: string;
        WebkitBackdropFilter: string;
        background: string;
        border: string;
        borderRadius: string;
        boxShadow: string;
    };
    variants: {
        primary: {
            background: string;
            border: string;
            boxShadow: string;
        };
        tech: {
            background: string;
            border: string;
            boxShadow: string;
        };
        cyber: {
            background: string;
            border: string;
            boxShadow: string;
        };
        matrix: {
            background: string;
            border: string;
            boxShadow: string;
        };
    };
};
export declare const theme: {
    readonly colors: {
        readonly hunterGreen: "#355E3B";
        readonly jetBlack: "#0B0B0B";
        readonly techElectric: "#00D4AA";
        readonly techCyber: "#7C3AED";
        readonly techMatrix: "#00FF41";
        readonly softWhite: "#F5F5F5";
        readonly graphite: "#3F3F3F";
        readonly metallicSilver: "#C2C2C2";
    };
};
export interface GlassContainerProps extends HTMLAttributes<HTMLDivElement>, MotionProps {
    variant?: 'base' | 'primary' | 'tech' | 'cyber' | 'matrix';
    blur?: 'light' | 'medium' | 'heavy';
    glow?: boolean;
    children: ReactNode;
    className?: string;
}
export declare const GlassContainer: React.ForwardRefExoticComponent<GlassContainerProps & React.RefAttributes<HTMLDivElement>>;
export interface GlassCardProps extends GlassContainerProps {
    hoverable?: boolean;
    clickable?: boolean;
    loading?: boolean;
}
export declare const GlassCard: React.ForwardRefExoticComponent<GlassCardProps & React.RefAttributes<HTMLDivElement>>;
export interface GlassButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'tech' | 'cyber' | 'matrix' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    glow?: boolean;
    loading?: boolean;
    children: ReactNode;
}
export declare const GlassButton: React.ForwardRefExoticComponent<GlassButtonProps & React.RefAttributes<HTMLButtonElement>>;
export { glassStyles };
export type { GlassContainerProps, GlassCardProps, GlassButtonProps };
//# sourceMappingURL=glassmorphic-system.d.ts.map