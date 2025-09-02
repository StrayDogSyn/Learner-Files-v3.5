import { useState, useEffect, useCallback, useMemo } from 'react';
import { AIArtwork, GalleryFilter, GallerySort, GallerySearchResult, GalleryView, Collection } from '../types/gallery';
import { AIArtProcessor } from '../lib/ai-art-processor';
import { SearchEngine } from '../lib/search-engine';
import { AnalyticsTracker } from '../lib/analytics-tracker';
import galleryData from '../data/ai-artwork-gallery.json';

interface UseAIArtOptions {
  enableAnalytics?: boolean;
  enableSearch?: boolean;
  autoOptimize?: boolean;
  preloadImages?: boolean;
  enableCollections?: boolean;
}

interface UseAIArtReturn {
  // Data
  artworks: AIArtwork[];
  filteredArtworks: AIArtwork[];
  collections: Collection[];
  currentCollection: Collection | null;
  totalArtworks: number;
  
  // Loading states
  loading: boolean;
  processing: boolean;
  error: string | null;
  
  // View and filters
  view: GalleryView;
  filters: GalleryFilter;
  searchQuery: string;
  sortBy: GallerySort;
  searchResults: GallerySearchResult | null;
  
  // Lightbox
  lightboxOpen: boolean;
  currentArtwork: AIArtwork | null;
  lightboxIndex: number;
  
  // Actions
  setView: (view: GalleryView) => void;
  setFilters: (filters: Partial<GalleryFilter>) => void;
  setSearchQuery: (query: string) => void;
  setSortBy: (sort: GallerySort) => void;
  clearFilters: () => void;
  refreshArtworks: () => Promise<void>;
  
  // Lightbox actions
  openLightbox: (artwork: AIArtwork, index?: number) => void;
  closeLightbox: () => void;
  nextArtwork: () => void;
  previousArtwork: () => void;
  
  // Collection actions
  setCurrentCollection: (collection: Collection | null) => void;
  createCollection: (name: string, artworkIds: string[]) => Promise<Collection>;
  addToCollection: (collectionId: string, artworkId: string) => Promise<void>;
  removeFromCollection: (collectionId: string, artworkId: string) => Promise<void>;
  
  // Artwork actions
  likeArtwork: (artworkId: string) => Promise<void>;
  downloadArtwork: (artworkId: string, format?: string) => Promise<void>;
  shareArtwork: (artworkId: string, platform?: string) => Promise<void>;
  reportArtwork: (artworkId: string, reason: string) => Promise<void>;
  
  // Utilities
  getArtworkById: (id: string) => AIArtwork | undefined;
  getArtworksByModel: (model: string) => AIArtwork[];
  getArtworksByStyle: (style: string) => AIArtwork[];
  getFeaturedArtworks: () => AIArtwork[];
  getRecentArtworks: (limit?: number) => AIArtwork[];
  getTopRatedArtworks: (limit?: number) => AIArtwork[];
  
  // Statistics
  stats: {
    totalArtworks: number;
    totalLikes: number;
    totalDownloads: number;
    totalViews: number;
    models: string[];
    styles: string[];
    categories: string[];
    averageRating: number;
    topTags: string[];
  };
}

const defaultFilters: GalleryFilter = {
  models: [],
  styles: [],
  categories: [],
  tags: [],
  qualityRange: undefined,
  dateRange: undefined,
  aspectRatio: [],
  resolution: [],
  featured: undefined,
  liked: undefined
};

const defaultSort: GallerySort = {
  field: 'createdAt',
  direction: 'desc'
};

export const useAIArt = (options: UseAIArtOptions = {}): UseAIArtReturn => {
  const {
    enableAnalytics = true,
    enableSearch = true,
    autoOptimize = true,
    preloadImages = false,
    enableCollections = true
  } = options;

  // State
  const [artworks, setArtworks] = useState<AIArtwork[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [currentCollection, setCurrentCollectionState] = useState<Collection | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // View and filters
  const [view, setViewState] = useState<GalleryView>('grid');
  const [filters, setFiltersState] = useState<GalleryFilter>(defaultFilters);
  const [searchQuery, setSearchQueryState] = useState('');
  const [sortBy, setSortByState] = useState<GallerySort>(defaultSort);
  const [searchResults, setSearchResults] = useState<GallerySearchResult | null>(null);
  
  // Lightbox
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentArtwork, setCurrentArtwork] = useState<AIArtwork | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Initialize services
  const artProcessor = useMemo(() => new AIArtProcessor(), []);
  const searchEngine = useMemo(() => enableSearch ? new SearchEngine() : null, [enableSearch]);
  const analytics = useMemo(() => enableAnalytics ? new AnalyticsTracker() : null, [enableAnalytics]);

  // Load initial data
  useEffect(() => {
    loadArtworks();
    if (enableCollections) {
      loadCollections();
    }
  }, [enableCollections]);

  // Initialize search engine when artworks change
  useEffect(() => {
    if (searchEngine && artworks.length > 0) {
      searchEngine.indexArtworks(artworks);
    }
  }, [searchEngine, artworks]);

  // Perform search when query changes
  useEffect(() => {
    if (!searchEngine || !searchQuery.trim()) {
      setSearchResults(null);
      return;
    }

    const performSearch = async () => {
      try {
        const results = await searchEngine.search(searchQuery, {
          type: 'artwork',
          filters: {
            models: filters.models,
            styles: filters.styles,
            categories: filters.categories,
            tags: filters.tags
          },
          sort: sortBy,
          limit: 100
        });
        setSearchResults(results);

        // Track search analytics
        if (analytics) {
          analytics.trackSearch({
            query: searchQuery,
            resultsCount: results.total,
            filters: filters,
            timestamp: Date.now()
          });
        }
      } catch (err) {
        console.error('Search error:', err);
        setError('Search failed. Please try again.');
      }
    };

    const debounceTimer = setTimeout(performSearch, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery, filters, sortBy, searchEngine, analytics]);

  // Preload images if enabled
  useEffect(() => {
    if (!preloadImages || artworks.length === 0) return;

    const preloadArtworkImages = async () => {
      const imagePromises = artworks.slice(0, 20).map(artwork => {
        return new Promise((resolve) => {
          const img = new Image();
          img.onload = resolve;
          img.onerror = resolve;
          img.src = artwork.imageUrl;
        });
      });

      await Promise.all(imagePromises);
    };

    preloadArtworkImages();
  }, [artworks, preloadImages]);

  // Load artworks from gallery data
  const loadArtworks = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load from JSON gallery data
      const data = galleryData as any;
      const artworksData = data.artworks || [];

      // Convert to AIArtwork format
      const enhancedArtworks: AIArtwork[] = artworksData.map((artwork: any) => ({
        ...artwork,
        id: artwork.id || `artwork-${Date.now()}-${Math.random()}`,
        createdAt: artwork.createdAt || new Date().toISOString(),
        updatedAt: artwork.updatedAt || new Date().toISOString(),
        qualityMetrics: {
          technical: artwork.qualityMetrics?.technical || { score: 85, sharpness: 90, noise: 15, artifacts: 10 },
          artistic: artwork.qualityMetrics?.artistic || { score: 88, composition: 85, creativity: 90, aesthetics: 87 },
          overall: artwork.qualityMetrics?.overall || 86
        },
        engagement: {
          views: artwork.engagement?.views || Math.floor(Math.random() * 1000) + 100,
          likes: artwork.engagement?.likes || Math.floor(Math.random() * 100) + 10,
          downloads: artwork.engagement?.downloads || Math.floor(Math.random() * 50) + 5,
          shares: artwork.engagement?.shares || Math.floor(Math.random() * 20) + 2,
          comments: artwork.engagement?.comments || Math.floor(Math.random() * 30) + 3
        }
      }));

      setArtworks(enhancedArtworks);

      // Auto-optimize if enabled
      if (autoOptimize) {
        optimizeArtworks(enhancedArtworks);
      }

      // Track analytics
      if (analytics) {
        analytics.trackEvent({
          type: 'gallery_loaded',
          data: { count: enhancedArtworks.length },
          timestamp: Date.now()
        });
      }
    } catch (err) {
      console.error('Failed to load artworks:', err);
      setError('Failed to load artworks. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Load collections
  const loadCollections = async () => {
    try {
      const data = galleryData as any;
      const collectionsData = data.collections || [];
      setCollections(collectionsData);
    } catch (err) {
      console.error('Failed to load collections:', err);
    }
  };

  // Optimize artworks
  const optimizeArtworks = async (artworksToOptimize: AIArtwork[]) => {
    try {
      setProcessing(true);
      
      // Process artworks in batches
      const batchSize = 5;
      for (let i = 0; i < artworksToOptimize.length; i += batchSize) {
        const batch = artworksToOptimize.slice(i, i + batchSize);
        await artProcessor.processBatch(batch);
      }
    } catch (err) {
      console.error('Optimization failed:', err);
    } finally {
      setProcessing(false);
    }
  };

  // Filter and sort artworks
  const filteredArtworks = useMemo(() => {
    let filtered = [...artworks];

    // Apply collection filter
    if (currentCollection) {
      const collectionArtworkIds = new Set(currentCollection.artworkIds);
      filtered = filtered.filter(artwork => collectionArtworkIds.has(artwork.id));
    }

    // Apply search results if available
    if (searchResults && searchQuery.trim()) {
      const searchArtworkIds = new Set(searchResults.items.map(item => item.id));
      filtered = filtered.filter(artwork => searchArtworkIds.has(artwork.id));
    }

    // Apply filters
    if (filters.models.length > 0) {
      filtered = filtered.filter(artwork => 
        filters.models.includes(artwork.model)
      );
    }

    if (filters.styles.length > 0) {
      filtered = filtered.filter(artwork => 
        filters.styles.some(style => artwork.style.includes(style))
      );
    }

    if (filters.categories.length > 0) {
      filtered = filtered.filter(artwork => 
        filters.categories.includes(artwork.category)
      );
    }

    if (filters.tags.length > 0) {
      filtered = filtered.filter(artwork => 
        filters.tags.some(tag => artwork.tags.includes(tag))
      );
    }

    if (filters.qualityRange) {
      const { min, max } = filters.qualityRange;
      filtered = filtered.filter(artwork => {
        const quality = artwork.qualityMetrics.overall;
        return quality >= min && quality <= max;
      });
    }

    if (filters.dateRange) {
      const { start, end } = filters.dateRange;
      filtered = filtered.filter(artwork => {
        const artworkDate = new Date(artwork.createdAt);
        return artworkDate >= start && artworkDate <= end;
      });
    }

    if (filters.aspectRatio.length > 0) {
      filtered = filtered.filter(artwork => {
        const ratio = artwork.dimensions.width / artwork.dimensions.height;
        return filters.aspectRatio.some(ar => {
          switch (ar) {
            case 'square': return Math.abs(ratio - 1) < 0.1;
            case 'landscape': return ratio > 1.2;
            case 'portrait': return ratio < 0.8;
            default: return true;
          }
        });
      });
    }

    if (filters.featured !== undefined) {
      filtered = filtered.filter(artwork => artwork.featured === filters.featured);
    }

    if (filters.liked !== undefined) {
      // This would typically check user's liked artworks from localStorage or API
      // For now, we'll simulate it
      const likedArtworks = JSON.parse(localStorage.getItem('likedArtworks') || '[]');
      if (filters.liked) {
        filtered = filtered.filter(artwork => likedArtworks.includes(artwork.id));
      } else {
        filtered = filtered.filter(artwork => !likedArtworks.includes(artwork.id));
      }
    }

    // Apply sorting
    filtered.sort((a, b) => {
      const { field, direction } = sortBy;
      let aValue: any, bValue: any;

      switch (field) {
        case 'title':
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case 'createdAt':
          aValue = new Date(a.createdAt);
          bValue = new Date(b.createdAt);
          break;
        case 'quality':
          aValue = a.qualityMetrics.overall;
          bValue = b.qualityMetrics.overall;
          break;
        case 'likes':
          aValue = a.engagement.likes;
          bValue = b.engagement.likes;
          break;
        case 'views':
          aValue = a.engagement.views;
          bValue = b.engagement.views;
          break;
        case 'downloads':
          aValue = a.engagement.downloads;
          bValue = b.engagement.downloads;
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return direction === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [artworks, currentCollection, filters, sortBy, searchResults, searchQuery]);

  // Action handlers
  const setView = useCallback((newView: GalleryView) => {
    setViewState(newView);
    
    // Track view change analytics
    if (analytics) {
      analytics.trackEvent({
        type: 'gallery_view_changed',
        data: { view: newView },
        timestamp: Date.now()
      });
    }
  }, [analytics]);

  const setFilters = useCallback((newFilters: Partial<GalleryFilter>) => {
    setFiltersState(prev => ({ ...prev, ...newFilters }));
    
    // Track filter analytics
    if (analytics) {
      analytics.trackEvent({
        type: 'gallery_filtered',
        data: { filters: newFilters },
        timestamp: Date.now()
      });
    }
  }, [analytics]);

  const setSearchQuery = useCallback((query: string) => {
    setSearchQueryState(query);
  }, []);

  const setSortBy = useCallback((sort: GallerySort) => {
    setSortByState(sort);
    
    // Track sort analytics
    if (analytics) {
      analytics.trackEvent({
        type: 'gallery_sorted',
        data: { sortBy: sort },
        timestamp: Date.now()
      });
    }
  }, [analytics]);

  const clearFilters = useCallback(() => {
    setFiltersState(defaultFilters);
    setSearchQueryState('');
    setSortByState(defaultSort);
    setSearchResults(null);
    setCurrentCollectionState(null);
  }, []);

  const refreshArtworks = useCallback(async () => {
    await loadArtworks();
  }, []);

  // Lightbox actions
  const openLightbox = useCallback((artwork: AIArtwork, index: number = 0) => {
    setCurrentArtwork(artwork);
    setLightboxIndex(index);
    setLightboxOpen(true);
    
    // Track lightbox analytics
    if (analytics) {
      analytics.trackEvent({
        type: 'artwork_viewed',
        data: { artworkId: artwork.id, title: artwork.title },
        timestamp: Date.now()
      });
    }
  }, [analytics]);

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false);
    setCurrentArtwork(null);
    setLightboxIndex(0);
  }, []);

  const nextArtwork = useCallback(() => {
    if (lightboxIndex < filteredArtworks.length - 1) {
      const newIndex = lightboxIndex + 1;
      setLightboxIndex(newIndex);
      setCurrentArtwork(filteredArtworks[newIndex]);
    }
  }, [lightboxIndex, filteredArtworks]);

  const previousArtwork = useCallback(() => {
    if (lightboxIndex > 0) {
      const newIndex = lightboxIndex - 1;
      setLightboxIndex(newIndex);
      setCurrentArtwork(filteredArtworks[newIndex]);
    }
  }, [lightboxIndex, filteredArtworks]);

  // Collection actions
  const setCurrentCollection = useCallback((collection: Collection | null) => {
    setCurrentCollectionState(collection);
    
    // Track collection analytics
    if (analytics && collection) {
      analytics.trackEvent({
        type: 'collection_viewed',
        data: { collectionId: collection.id, name: collection.name },
        timestamp: Date.now()
      });
    }
  }, [analytics]);

  const createCollection = useCallback(async (name: string, artworkIds: string[]): Promise<Collection> => {
    const newCollection: Collection = {
      id: `collection-${Date.now()}`,
      name,
      description: '',
      artworkIds,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isPublic: false,
      tags: []
    };

    setCollections(prev => [...prev, newCollection]);
    
    // Track collection creation
    if (analytics) {
      analytics.trackEvent({
        type: 'collection_created',
        data: { collectionId: newCollection.id, name, artworkCount: artworkIds.length },
        timestamp: Date.now()
      });
    }

    return newCollection;
  }, [analytics]);

  const addToCollection = useCallback(async (collectionId: string, artworkId: string) => {
    setCollections(prev => prev.map(collection => 
      collection.id === collectionId
        ? { ...collection, artworkIds: [...collection.artworkIds, artworkId] }
        : collection
    ));
  }, []);

  const removeFromCollection = useCallback(async (collectionId: string, artworkId: string) => {
    setCollections(prev => prev.map(collection => 
      collection.id === collectionId
        ? { ...collection, artworkIds: collection.artworkIds.filter(id => id !== artworkId) }
        : collection
    ));
  }, []);

  // Artwork actions
  const likeArtwork = useCallback(async (artworkId: string) => {
    // Update local storage
    const likedArtworks = JSON.parse(localStorage.getItem('likedArtworks') || '[]');
    const isLiked = likedArtworks.includes(artworkId);
    
    if (isLiked) {
      const updated = likedArtworks.filter((id: string) => id !== artworkId);
      localStorage.setItem('likedArtworks', JSON.stringify(updated));
    } else {
      likedArtworks.push(artworkId);
      localStorage.setItem('likedArtworks', JSON.stringify(likedArtworks));
    }

    // Update artwork engagement
    setArtworks(prev => prev.map(artwork => 
      artwork.id === artworkId
        ? { 
            ...artwork, 
            engagement: { 
              ...artwork.engagement, 
              likes: artwork.engagement.likes + (isLiked ? -1 : 1) 
            } 
          }
        : artwork
    ));

    // Track analytics
    if (analytics) {
      analytics.trackEvent({
        type: isLiked ? 'artwork_unliked' : 'artwork_liked',
        data: { artworkId },
        timestamp: Date.now()
      });
    }
  }, [analytics]);

  const downloadArtwork = useCallback(async (artworkId: string, format: string = 'original') => {
    const artwork = artworks.find(a => a.id === artworkId);
    if (!artwork) return;

    try {
      // Create download link
      const link = document.createElement('a');
      link.href = artwork.imageUrl;
      link.download = `${artwork.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.${format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Update download count
      setArtworks(prev => prev.map(a => 
        a.id === artworkId
          ? { ...a, engagement: { ...a.engagement, downloads: a.engagement.downloads + 1 } }
          : a
      ));

      // Track analytics
      if (analytics) {
        analytics.trackEvent({
          type: 'artwork_downloaded',
          data: { artworkId, format },
          timestamp: Date.now()
        });
      }
    } catch (err) {
      console.error('Download failed:', err);
      setError('Download failed. Please try again.');
    }
  }, [artworks, analytics]);

  const shareArtwork = useCallback(async (artworkId: string, platform: string = 'copy') => {
    const artwork = artworks.find(a => a.id === artworkId);
    if (!artwork) return;

    try {
      const shareUrl = `${window.location.origin}/gallery/${artworkId}`;
      const shareText = `Check out this amazing AI artwork: "${artwork.title}"`;

      if (platform === 'copy') {
        await navigator.clipboard.writeText(shareUrl);
      } else {
        // Handle other platforms (Twitter, Facebook, etc.)
        const shareUrls = {
          twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
          facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
          linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`
        };

        const url = shareUrls[platform as keyof typeof shareUrls];
        if (url) {
          window.open(url, '_blank', 'width=600,height=400');
        }
      }

      // Update share count
      setArtworks(prev => prev.map(a => 
        a.id === artworkId
          ? { ...a, engagement: { ...a.engagement, shares: a.engagement.shares + 1 } }
          : a
      ));

      // Track analytics
      if (analytics) {
        analytics.trackEvent({
          type: 'artwork_shared',
          data: { artworkId, platform },
          timestamp: Date.now()
        });
      }
    } catch (err) {
      console.error('Share failed:', err);
      setError('Share failed. Please try again.');
    }
  }, [artworks, analytics]);

  const reportArtwork = useCallback(async (artworkId: string, reason: string) => {
    // In a real app, this would send to a moderation system
    console.log('Artwork reported:', { artworkId, reason });
    
    // Track analytics
    if (analytics) {
      analytics.trackEvent({
        type: 'artwork_reported',
        data: { artworkId, reason },
        timestamp: Date.now()
      });
    }
  }, [analytics]);

  // Utility functions
  const getArtworkById = useCallback((id: string) => {
    return artworks.find(artwork => artwork.id === id);
  }, [artworks]);

  const getArtworksByModel = useCallback((model: string) => {
    return artworks.filter(artwork => artwork.model === model);
  }, [artworks]);

  const getArtworksByStyle = useCallback((style: string) => {
    return artworks.filter(artwork => artwork.style.includes(style));
  }, [artworks]);

  const getFeaturedArtworks = useCallback(() => {
    return artworks.filter(artwork => artwork.featured);
  }, [artworks]);

  const getRecentArtworks = useCallback((limit: number = 12) => {
    return [...artworks]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
  }, [artworks]);

  const getTopRatedArtworks = useCallback((limit: number = 12) => {
    return [...artworks]
      .sort((a, b) => b.qualityMetrics.overall - a.qualityMetrics.overall)
      .slice(0, limit);
  }, [artworks]);

  // Statistics
  const stats = useMemo(() => {
    const models = [...new Set(artworks.map(a => a.model))];
    const styles = [...new Set(artworks.flatMap(a => a.style))];
    const categories = [...new Set(artworks.map(a => a.category))];
    const allTags = artworks.flatMap(a => a.tags);
    const tagCounts = allTags.reduce((acc, tag) => {
      acc[tag] = (acc[tag] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    const topTags = Object.entries(tagCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([tag]) => tag);

    const totalLikes = artworks.reduce((sum, a) => sum + a.engagement.likes, 0);
    const totalDownloads = artworks.reduce((sum, a) => sum + a.engagement.downloads, 0);
    const totalViews = artworks.reduce((sum, a) => sum + a.engagement.views, 0);
    const averageRating = artworks.length > 0 
      ? artworks.reduce((sum, a) => sum + a.qualityMetrics.overall, 0) / artworks.length 
      : 0;

    return {
      totalArtworks: artworks.length,
      totalLikes,
      totalDownloads,
      totalViews,
      models,
      styles,
      categories,
      averageRating: Math.round(averageRating * 10) / 10,
      topTags
    };
  }, [artworks]);

  return {
    // Data
    artworks,
    filteredArtworks,
    collections,
    currentCollection,
    totalArtworks: artworks.length,
    
    // Loading states
    loading,
    processing,
    error,
    
    // View and filters
    view,
    filters,
    searchQuery,
    sortBy,
    searchResults,
    
    // Lightbox
    lightboxOpen,
    currentArtwork,
    lightboxIndex,
    
    // Actions
    setView,
    setFilters,
    setSearchQuery,
    setSortBy,
    clearFilters,
    refreshArtworks,
    
    // Lightbox actions
    openLightbox,
    closeLightbox,
    nextArtwork,
    previousArtwork,
    
    // Collection actions
    setCurrentCollection,
    createCollection,
    addToCollection,
    removeFromCollection,
    
    // Artwork actions
    likeArtwork,
    downloadArtwork,
    shareArtwork,
    reportArtwork,
    
    // Utilities
    getArtworkById,
    getArtworksByModel,
    getArtworksByStyle,
    getFeaturedArtworks,
    getRecentArtworks,
    getTopRatedArtworks,
    
    // Statistics
    stats
  };
};

export default useAIArt;