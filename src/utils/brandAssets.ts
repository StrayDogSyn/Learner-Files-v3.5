// Brand asset paths and configurations
export interface BrandAsset {
  url: string;
  alt: string;
  category: string;
  preloaded?: boolean;
}

export const brandAssets = {
  logos: {
    main: '/assets/brands/mainLogo.png',
    secondary: '/assets/brands/secondaryLogo.png',
    icon: '/assets/brands/icon.png',
    watermark: '/assets/brands/watermark.png'
  },
  images: {
    hero: '/assets/images/hero-bg.jpg',
    profile: '/assets/images/profile.jpg',
    placeholder: '/assets/images/placeholder.jpg'
  },
  icons: {
    favicon: '/favicon.ico',
    apple: '/assets/icons/apple-touch-icon.png',
    manifest: '/assets/icons/manifest.json'
  }
};

export const getBrandAsset = (category: keyof typeof brandAssets, name: string) => {
  const categoryAssets = brandAssets[category] as Record<string, string>;
  return categoryAssets[name] || brandAssets.images.placeholder;
};

export const getLogoUrl = (type: 'main' | 'secondary' | 'icon' | 'watermark' = 'main') => {
  return brandAssets.logos[type];
};

export const getImageUrl = (name: string) => {
  return brandAssets.images[name as keyof typeof brandAssets.images] || brandAssets.images.placeholder;
};

// Brand Asset Manager for dynamic loading and caching
export const brandAssetManager = {
  cache: new Map<string, string>(),
  
  async preloadCriticalAssets(): Promise<void> {
    const criticalAssets = [
      brandAssets.logos.main,
      brandAssets.logos.icon,
      brandAssets.images.hero,
      brandAssets.images.profile
    ];
    
    await Promise.all(
      criticalAssets.map(async (url) => {
        try {
          const response = await fetch(url);
          if (response.ok) {
            this.cache.set(url, url);
          }
        } catch (error) {
          console.warn(`Failed to preload asset: ${url}`);
        }
      })
    );
  },
  
  async getAssetUrl(assetKey: string): Promise<string> {
    // Check cache first
    if (this.cache.has(assetKey)) {
      return this.cache.get(assetKey)!;
    }
    
    // Try to resolve asset path
    const parts = assetKey.split('.');
    if (parts.length === 2) {
      const [category, name] = parts;
      const asset = getBrandAsset(category as keyof typeof brandAssets, name);
      this.cache.set(assetKey, asset);
      return asset;
    }
    
    // Fallback to placeholder
    return brandAssets.images.placeholder;
  },
  
  clearCache(): void {
    this.cache.clear();
  }
};

export default brandAssets;