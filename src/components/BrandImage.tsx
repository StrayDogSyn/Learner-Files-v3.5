import React, { useState, useRef, useEffect } from 'react';

interface BrandImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  lazy?: boolean;
  watermark?: boolean;
  priority?: boolean;
}

const BrandImage: React.FC<BrandImageProps> = ({
  src,
  alt,
  className = '',
  width,
  height,
  lazy = true,
  watermark = false,
  priority = false
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(!lazy || priority);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (!lazy || priority) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [lazy, priority]);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const containerStyle = {
    width: width ? `${width}px` : 'auto',
    height: height ? `${height}px` : 'auto',
    position: 'relative' as const,
    overflow: 'hidden' as const
  };

  return (
    <div style={containerStyle} className={`brand-image-container ${className}`}>
      {/* Placeholder while loading */}
      {!isLoaded && (
        <div 
          className="absolute inset-0 bg-gradient-to-br from-hunter-green/20 to-metallic-gold/10 animate-pulse rounded-lg"
          style={{
            width: width ? `${width}px` : '100%',
            height: height ? `${height}px` : '100%'
          }}
        />
      )}
      
      {/* Actual image */}
      {isInView && (
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          width={width}
          height={height}
          onLoad={handleLoad}
          className={`transition-opacity duration-500 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          } ${className}`}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
        />
      )}
      
      {/* Watermark overlay */}
      {watermark && isLoaded && (
        <div className="absolute bottom-2 right-2 opacity-30">
          <img
            src="/assets/brands/circa2024.png"
            alt="StrayDog Syndications 2024"
            className="w-8 h-8 filter brightness-0 invert"
            loading="lazy"
          />
        </div>
      )}
    </div>
  );
};

export default BrandImage;

// Brand asset constants for easy management
export const BRAND_ASSETS = {
  MAIN_LOGO: '/assets/brands/mainLogo.png',
  GEAR_LOGO: '/assets/brands/gearLogo.png',
  BANNER: '/assets/brands/banner.png',
  FAVICON: '/assets/brands/favicon.png',
  CIRCA_2024: '/assets/brands/circa2024.png'
} as const;

// Predefined brand image configurations
export const BrandConfigs = {
  heroLogo: {
    src: BRAND_ASSETS.MAIN_LOGO,
    alt: 'StrayDog Syndications - Professional Development Services',
    width: 120,
    height: 120,
    priority: true,
    className: 'rounded-full shadow-lg'
  },
  navLogo: {
    src: BRAND_ASSETS.GEAR_LOGO,
    alt: 'StrayDog Syndications Logo',
    width: 40,
    height: 40,
    priority: true,
    className: 'rounded-full'
  },
  projectWatermark: {
    src: BRAND_ASSETS.CIRCA_2024,
    alt: 'StrayDog Syndications 2024',
    watermark: true,
    className: 'absolute bottom-2 right-2 w-6 h-6 opacity-40'
  }
};