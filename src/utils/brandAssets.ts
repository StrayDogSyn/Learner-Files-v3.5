// Brand Asset Management System
// Centralized management of all brand assets with fallbacks and error handling

export interface BrandAsset {
  src: string;
  fallbackSrc?: string;
  alt: string;
  width?: number;
  height?: number;
  priority?: boolean;
  lazy?: boolean;
}

export interface BrandConfig {
  name: string;
  domains: string[];
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
}

// Brand Configuration
export const BRAND_CONFIG: BrandConfig = {
  name: 'StrayDog Syndications',
  domains: [
    'straydog-syndications-llc.com',
    'straydogsyndicationsllc.biz', 
    'straydog-secondstory.org'
  ],
  primaryColor: '#355E3B', // Hunter Green
  secondaryColor: '#50C878', // Emerald
  accentColor: '#C0C0C0' // Metallic Silver
};

// Asset paths with fallbacks
const ASSET_PATHS = {
  // Primary paths
  FAVICON: '/assets/brand/favicon.png',
  MAIN_LOGO: '/assets/brand/mainLogo.png',
  GEAR_LOGO: '/assets/brand/gearLogo.png',
  BANNER: '/assets/brand/banner.png',
  CIRCA_2024: '/assets/brand/circa2024.png',
  
  // Fallback paths (if primary assets are missing)
  FAVICON_FALLBACK: '/assets/brand/favicon-fallback.png',
  MAIN_LOGO_FALLBACK: '/assets/brand/mainLogo-fallback.png',
  GEAR_LOGO_FALLBACK: '/assets/brand/gearLogo-fallback.png',
  BANNER_FALLBACK: '/assets/brand/banner-fallback.png',
  CIRCA_2024_FALLBACK: '/assets/brand/circa2024-fallback.png',
  
  // Placeholder paths (for development/testing)
  PLACEHOLDER_LOGO: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjMzU1RTNCIi8+Cjx0ZXh0IHg9IjEwMCIgeT0iMTAwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+U3RyYXlEb2c8L3RleHQ+Cjx0ZXh0IHg9IjEwMCIgeT0iMTIwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTIiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+U3luZGljYXRpb25zPC90ZXh0Pgo8L3N2Zz4K'
} as const;

// Brand Asset Definitions
export const BRAND_ASSETS: Record<string, BrandAsset> = {
  favicon: {
    src: ASSET_PATHS.FAVICON,
    fallbackSrc: ASSET_PATHS.PLACEHOLDER_LOGO,
    alt: 'StrayDog Syndications Favicon',
    width: 32,
    height: 32,
    priority: true,
    lazy: false
  },
  
  mainLogo: {
    src: ASSET_PATHS.MAIN_LOGO,
    fallbackSrc: ASSET_PATHS.MAIN_LOGO_FALLBACK,
    alt: 'StrayDog Syndications - Professional Development Services',
    width: 512,
    height: 512,
    priority: true,
    lazy: false
  },
  
  gearLogo: {
    src: ASSET_PATHS.GEAR_LOGO,
    fallbackSrc: ASSET_PATHS.GEAR_LOGO_FALLBACK,
    alt: 'StrayDog Syndications Gear Logo',
    width: 256,
    height: 256,
    priority: true,
    lazy: false
  },
  
  banner: {
    src: ASSET_PATHS.BANNER,
    fallbackSrc: ASSET_PATHS.BANNER_FALLBACK,
    alt: 'StrayDog Syndications Banner',
    width: 1200,
    height: 400,
    priority: false,
    lazy: true
  },
  
  circa2024: {
    src: ASSET_PATHS.CIRCA_2024,
    fallbackSrc: ASSET_PATHS.CIRCA_2024_FALLBACK,
    alt: 'StrayDog Syndications 2024',
    width: 128,
    height: 128,
    priority: false,
    lazy: true
  }
};

// Predefined configurations for common use cases
export const BRAND_CONFIGS = {
  heroLogo: {
    ...BRAND_ASSETS.mainLogo,
    width: 120,
    height: 120,
    className: 'rounded-full shadow-lg'
  },
  
  navLogo: {
    ...BRAND_ASSETS.gearLogo,
    width: 40,
    height: 40,
    className: 'rounded-lg'
  },
  
  projectWatermark: {
    ...BRAND_ASSETS.circa2024,
    width: 48,
    height: 48,
    className: 'opacity-20'
  },
  
  footerLogo: {
    ...BRAND_ASSETS.mainLogo,
    width: 60,
    height: 60,
    className: 'rounded-lg'
  }
};

// Asset validation and error handling
export class BrandAssetManager {
  private static instance: BrandAssetManager;
  private loadedAssets: Set<string> = new Set();
  private failedAssets: Set<string> = new Set();

  static getInstance(): BrandAssetManager {
    if (!BrandAssetManager.instance) {
      BrandAssetManager.instance = new BrandAssetManager();
    }
    return BrandAssetManager.instance;
  }

  // Check if an asset exists
  async checkAssetExists(src: string): Promise<boolean> {
    try {
      const response = await fetch(src, { method: 'HEAD' });
      return response.ok;
    } catch {
      return false;
    }
  }

  // Get the best available asset URL
  async getAssetUrl(assetKey: string): Promise<string> {
    const asset = BRAND_ASSETS[assetKey];
    if (!asset) {
      console.warn(`Asset key "${assetKey}" not found`);
      return ASSET_PATHS.PLACEHOLDER_LOGO;
    }

    // Check if primary asset exists
    const primaryExists = await this.checkAssetExists(asset.src);
    if (primaryExists) {
      this.loadedAssets.add(assetKey);
      return asset.src;
    }

    // Check fallback asset
    if (asset.fallbackSrc) {
      const fallbackExists = await this.checkAssetExists(asset.fallbackSrc);
      if (fallbackExists) {
        this.loadedAssets.add(assetKey);
        return asset.fallbackSrc;
      }
    }

    // Use placeholder if both primary and fallback fail
    this.failedAssets.add(assetKey);
    console.warn(`Asset "${assetKey}" not found, using placeholder`);
    return ASSET_PATHS.PLACEHOLDER_LOGO;
  }

  // Preload critical assets
  async preloadCriticalAssets(): Promise<void> {
    const criticalAssets = ['favicon', 'mainLogo', 'gearLogo'];
    
    for (const assetKey of criticalAssets) {
      await this.getAssetUrl(assetKey);
    }
  }

  // Get asset status
  getAssetStatus(assetKey: string): 'loaded' | 'failed' | 'unknown' {
    if (this.loadedAssets.has(assetKey)) return 'loaded';
    if (this.failedAssets.has(assetKey)) return 'failed';
    return 'unknown';
  }

  // Get all asset statuses
  getAllAssetStatuses(): Record<string, 'loaded' | 'failed' | 'unknown'> {
    const statuses: Record<string, 'loaded' | 'failed' | 'unknown'> = {};
    
    Object.keys(BRAND_ASSETS).forEach(assetKey => {
      statuses[assetKey] = this.getAssetStatus(assetKey);
    });
    
    return statuses;
  }
}

// Utility functions
export const getBrandAsset = (key: string): BrandAsset => {
  return BRAND_ASSETS[key] || {
    src: ASSET_PATHS.PLACEHOLDER_LOGO,
    alt: 'StrayDog Syndications',
    width: 200,
    height: 200
  };
};

export const getBrandConfig = (key: string) => {
  return (BRAND_CONFIGS as any)[key] || (BRAND_ASSETS as any)[key];
};

// Domain utilities
export const getPrimaryDomain = (): string => {
  return BRAND_CONFIG.domains[0];
};

export const getAllDomains = (): string[] => {
  return BRAND_CONFIG.domains;
};

// Export singleton instance
export const brandAssetManager = BrandAssetManager.getInstance();
