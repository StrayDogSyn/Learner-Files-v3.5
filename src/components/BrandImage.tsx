import React, { useState, useRef, useEffect } from 'react';
import { getBrandAsset, brandAssetManager, BrandAsset } from '../utils/brandAssets';

interface BrandImageProps {
  src?: string;
  assetKey?: string;
  alt?: string;
  className?: string;
  width?: number;
  height?: number;
  lazy?: boolean;
  watermark?: boolean;
  priority?: boolean;
  fallbackSrc?: string;
}

const BrandImage: React.FC<BrandImageProps> = ({
  src,
  assetKey,
  alt,
  className = '',
  width,
  height,
  lazy = true,
  watermark = false,
  priority = false,
  fallbackSrc
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(!lazy || priority);
  const [currentSrc, setCurrentSrc] = useState<string>('');
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // Determine the source URL
  useEffect(() => {
    const determineSrc = async () => {
      let finalSrc = '';
      
      if (assetKey) {
        // Use asset management system
        try {
          finalSrc = await brandAssetManager.getAssetUrl(assetKey);
        } catch (error) {
          console.warn(`Failed to load asset "${assetKey}":`, error);
          finalSrc = getBrandAsset('logos', 'main');
        }
      } else if (src) {
        // Use provided src
        finalSrc = src;
      } else {
        // Default fallback
        finalSrc = getBrandAsset('logos', 'main');
      }
      
      setCurrentSrc(finalSrc);
    };

    determineSrc();
  }, [src, assetKey]);

  // Intersection Observer for lazy loading
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
    setHasError(false);
  };

  const handleError = () => {
    setHasError(true);
    setIsLoaded(false);
    
    // Try fallback if available
    if (fallbackSrc && currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc);
    } else if (assetKey) {
      // Use placeholder from asset management
      const asset = getBrandAsset('images', 'placeholder');
      if (asset && currentSrc !== asset) {
        setCurrentSrc(asset);
      }
    }
  };

  // Get dimensions from asset if not provided
  const getDimensions = () => {
    if (width && height) return { width, height };
    
    if (assetKey) {
      // Default dimensions for brand assets
      return { width: 200, height: 200 };
    }
    
    return { width: 200, height: 200 };
  };

  const { width: finalWidth, height: finalHeight } = getDimensions();
  const finalAlt = alt || 'StrayDog Syndications';

  const containerStyle = {
    width: finalWidth ? `${finalWidth}px` : 'auto',
    height: finalHeight ? `${finalHeight}px` : 'auto',
    position: 'relative' as const,
    overflow: 'hidden' as const
  };

  return (
    <div style={containerStyle} className={`brand-image-container ${className}`}>
      {/* Loading placeholder */}
      {!isLoaded && !hasError && (
        <div 
          className="absolute inset-0 bg-gradient-to-br from-hunter-green/20 to-metallic-gold/10 animate-pulse rounded-lg flex items-center justify-center"
          style={{
            width: finalWidth ? `${finalWidth}px` : '100%',
            height: finalHeight ? `${finalHeight}px` : '100%'
          }}
        >
          <div className="text-hunter-green text-xs font-medium">Loading...</div>
        </div>
      )}
      
      {/* Error placeholder */}
      {hasError && (
        <div 
          className="absolute inset-0 bg-gradient-to-br from-red-500/20 to-red-700/10 rounded-lg flex items-center justify-center"
          style={{
            width: finalWidth ? `${finalWidth}px` : '100%',
            height: finalHeight ? `${finalHeight}px` : '100%'
          }}
        >
          <div className="text-red-500 text-xs font-medium">Image Error</div>
        </div>
      )}
      
      {/* Actual image */}
      {isInView && currentSrc && (
        <img
          ref={imgRef}
          src={currentSrc}
          alt={finalAlt}
          width={finalWidth}
          height={finalHeight}
          onLoad={handleLoad}
          onError={handleError}
          className={`transition-opacity duration-500 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          } ${className}`}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
        />
      )}
      
      {/* Watermark overlay */}
      {watermark && isLoaded && !hasError && (
        <div className="absolute bottom-2 right-2 opacity-30">
          <BrandImage
            assetKey="circa2024"
            alt="StrayDog Syndications 2024"
            width={32}
            height={32}
            className="filter brightness-0 invert"
            lazy={false}
          />
        </div>
      )}
    </div>
  );
};

export default BrandImage;

// Export brand asset constants for backward compatibility
export const BRAND_ASSETS = {
  MAIN_LOGO: '/assets/brand/mainLogo.png',
  GEAR_LOGO: '/assets/brand/gearLogo.png',
  BANNER: '/assets/brand/banner.png',
  FAVICON: '/assets/brand/favicon.png',
  CIRCA_2024: '/assets/brand/circa2024.png'
} as const;

// Predefined brand image configurations
export const BrandConfigs = {
  heroLogo: {
    assetKey: 'mainLogo',
    alt: 'StrayDog Syndications - Professional Development Services',
    width: 120,
    height: 120,
    priority: true,
    className: 'rounded-full shadow-lg'
  },
  
  navLogo: {
    assetKey: 'gearLogo',
    alt: 'StrayDog Syndications Logo',
    width: 40,
    height: 40,
    priority: true,
    className: 'rounded-lg'
  },
  
  projectWatermark: {
    assetKey: 'circa2024',
    alt: 'StrayDog Syndications 2024',
    watermark: true,
    className: 'absolute bottom-2 right-2 w-6 h-6 opacity-40'
  },
  
  footerLogo: {
    assetKey: 'mainLogo',
    alt: 'StrayDog Syndications',
    width: 60,
    height: 60,
    className: 'rounded-lg'
  }
};