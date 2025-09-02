import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Grid, List, Filter, Search, Sparkles, Eye, Download, Heart, Share2 } from 'lucide-react';
import ArtworkCard from './ArtworkCard';
import ArtworkLightbox from './ArtworkLightbox';
import GalleryFilters from './GalleryFilters';

interface AIArtwork {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  thumbnailUrl?: string;
  model: string;
  style: string;
  prompt: string;
  negativePrompt?: string;
  dimensions: {
    width: number;
    height: number;
  };
  createdAt: string;
  tags: string[];
  likes: number;
  views: number;
  isLiked?: boolean;
  metadata: {
    steps: number;
    sampler: string;
    cfgScale: number;
    seed: number;
  };
}

interface AIArtGalleryProps {
  className?: string;
}

const AIArtGallery: React.FC<AIArtGalleryProps> = ({ className = '' }) => {
  const [artworks, setArtworks] = useState<AIArtwork[]>([]);
  const [filteredArtworks, setFilteredArtworks] = useState<AIArtwork[]>([]);
  const [selectedArtwork, setSelectedArtwork] = useState<AIArtwork | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'masonry'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState({
    models: [] as string[],
    styles: [] as string[],
    tags: [] as string[]
  });
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'popular' | 'liked'>('newest');
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  // Mock data - replace with actual API call
  useEffect(() => {
    const mockArtworks: AIArtwork[] = [
      {
        id: '1',
        title: 'Cyberpunk Cityscape',
        description: 'A futuristic neon-lit cityscape with flying cars and holographic advertisements',
        imageUrl: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=cyberpunk%20cityscape%20neon%20lights%20flying%20cars%20holographic%20advertisements%20futuristic%20architecture&image_size=landscape_16_9',
        model: 'SDXL',
        style: 'Cyberpunk',
        prompt: 'cyberpunk cityscape, neon lights, flying cars, holographic advertisements, futuristic architecture, detailed, 8k',
        negativePrompt: 'blurry, low quality, distorted',
        dimensions: { width: 1024, height: 576 },
        createdAt: '2024-01-15',
        tags: ['cyberpunk', 'cityscape', 'neon', 'futuristic'],
        likes: 42,
        views: 156,
        isLiked: false,
        metadata: {
          steps: 30,
          sampler: 'DPM++ 2M Karras',
          cfgScale: 7.5,
          seed: 123456789
        }
      },
      {
        id: '2',
        title: 'Abstract Digital Art',
        description: 'Flowing digital patterns with vibrant colors and geometric shapes',
        imageUrl: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=abstract%20digital%20art%20flowing%20patterns%20vibrant%20colors%20geometric%20shapes%20modern%20artistic&image_size=square_hd',
        model: 'Midjourney',
        style: 'Abstract',
        prompt: 'abstract digital art, flowing patterns, vibrant colors, geometric shapes, modern, artistic',
        dimensions: { width: 1024, height: 1024 },
        createdAt: '2024-01-14',
        tags: ['abstract', 'digital', 'colorful', 'geometric'],
        likes: 28,
        views: 89,
        isLiked: true,
        metadata: {
          steps: 25,
          sampler: 'Euler a',
          cfgScale: 8.0,
          seed: 987654321
        }
      },
      {
        id: '3',
        title: 'Fantasy Landscape',
        description: 'Mystical forest with magical creatures and ethereal lighting',
        imageUrl: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=fantasy%20mystical%20forest%20magical%20creatures%20ethereal%20lighting%20enchanted%20woodland&image_size=landscape_4_3',
        model: 'DALL-E 3',
        style: 'Fantasy',
        prompt: 'fantasy mystical forest, magical creatures, ethereal lighting, enchanted woodland, detailed',
        dimensions: { width: 1024, height: 768 },
        createdAt: '2024-01-13',
        tags: ['fantasy', 'forest', 'magical', 'mystical'],
        likes: 67,
        views: 234,
        isLiked: false,
        metadata: {
          steps: 20,
          sampler: 'DDIM',
          cfgScale: 6.0,
          seed: 456789123
        }
      }
    ];

    setTimeout(() => {
      setArtworks(mockArtworks);
      setFilteredArtworks(mockArtworks);
      setIsLoading(false);
    }, 1000);
  }, []);

  // Filter and search artworks
  useEffect(() => {
    let filtered = [...artworks];

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(artwork =>
        artwork.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        artwork.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        artwork.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
        artwork.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
        artwork.style.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply model filter
    if (selectedFilters.models.length > 0) {
      filtered = filtered.filter(artwork =>
        selectedFilters.models.includes(artwork.model)
      );
    }

    // Apply style filter
    if (selectedFilters.styles.length > 0) {
      filtered = filtered.filter(artwork =>
        selectedFilters.styles.includes(artwork.style)
      );
    }

    // Apply tag filter
    if (selectedFilters.tags.length > 0) {
      filtered = filtered.filter(artwork =>
        selectedFilters.tags.some(tag => artwork.tags.includes(tag))
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'popular':
          return b.views - a.views;
        case 'liked':
          return b.likes - a.likes;
        default:
          return 0;
      }
    });

    setFilteredArtworks(filtered);
  }, [artworks, searchQuery, selectedFilters, sortBy]);

  const handleLike = (artworkId: string) => {
    setArtworks(prev => prev.map(artwork => {
      if (artwork.id === artworkId) {
        return {
          ...artwork,
          isLiked: !artwork.isLiked,
          likes: artwork.isLiked ? artwork.likes - 1 : artwork.likes + 1
        };
      }
      return artwork;
    }));
  };

  const handleShare = async (artwork: AIArtwork) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: artwork.title,
          text: artwork.description,
          url: window.location.href
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const handleDownload = (artwork: AIArtwork) => {
    // Create a temporary link to download the image
    const link = document.createElement('a');
    link.href = artwork.imageUrl;
    link.download = `${artwork.title.replace(/\s+/g, '_')}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading) {
    return (
      <div className={`min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900/20 to-slate-900 ${className}`}>
        <div className="container mx-auto px-6 py-12">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-gray-300">Loading AI artwork gallery...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900/20 to-slate-900 ${className}`}>
      <div className="container mx-auto px-6 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="w-8 h-8 text-emerald-400" />
            <h1 className="text-4xl md:text-5xl font-bold text-white">
              AI Art Gallery
            </h1>
          </div>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Explore a curated collection of AI-generated artwork showcasing the intersection of technology and creativity
          </p>
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search artworks..."
                className="w-full pl-10 pr-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              />
            </div>

            {/* Controls */}
            <div className="flex items-center gap-4">
              {/* Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  showFilters
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'bg-white/10 text-gray-300 border border-white/20 hover:bg-white/20'
                }`}
              >
                <Filter className="w-4 h-4" />
                Filters
              </button>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              >
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="popular">Most Viewed</option>
                <option value="liked">Most Liked</option>
              </select>

              {/* View Mode */}
              <div className="flex bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded transition-colors ${
                    viewMode === 'grid'
                      ? 'bg-emerald-500/20 text-emerald-300'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('masonry')}
                  className={`p-2 rounded transition-colors ${
                    viewMode === 'masonry'
                      ? 'bg-emerald-500/20 text-emerald-300'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-4 text-sm text-gray-400">
            Showing {filteredArtworks.length} of {artworks.length} artworks
          </div>
        </motion.div>

        {/* Filters Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-8"
            >
              <GalleryFilters
                artworks={artworks}
                selectedFilters={selectedFilters}
                onFiltersChange={setSelectedFilters}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Gallery Grid */}
        {filteredArtworks.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className={`grid gap-6 ${
              viewMode === 'grid'
                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
            }`}
          >
            {filteredArtworks.map((artwork, index) => (
              <motion.div
                key={artwork.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <ArtworkCard
                  artwork={artwork}
                  onClick={() => setSelectedArtwork(artwork)}
                  onLike={() => handleLike(artwork.id)}
                  onShare={() => handleShare(artwork)}
                  onDownload={() => handleDownload(artwork)}
                />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Sparkles className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-300 mb-2">
              No artworks found
            </h3>
            <p className="text-gray-400">
              Try adjusting your search or filters to find more artworks.
            </p>
          </motion.div>
        )}

        {/* Lightbox */}
        <AnimatePresence>
          {selectedArtwork && (
            <ArtworkLightbox
              artwork={selectedArtwork}
              onClose={() => setSelectedArtwork(null)}
              onLike={() => handleLike(selectedArtwork.id)}
              onShare={() => handleShare(selectedArtwork)}
              onDownload={() => handleDownload(selectedArtwork)}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AIArtGallery;