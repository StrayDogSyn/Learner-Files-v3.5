import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Eye, Download, Share2, Sparkles, Clock, Settings } from 'lucide-react';

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

interface ArtworkCardProps {
  artwork: AIArtwork;
  onClick: () => void;
  onLike: () => void;
  onShare: () => void;
  onDownload: () => void;
  className?: string;
}

const ArtworkCard: React.FC<ArtworkCardProps> = ({
  artwork,
  onClick,
  onLike,
  onShare,
  onDownload,
  className = ''
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getModelIcon = (model: string) => {
    switch (model.toLowerCase()) {
      case 'sdxl':
      case 'stable diffusion':
        return '🎨';
      case 'midjourney':
        return '🌟';
      case 'dall-e 3':
      case 'dalle':
        return '🤖';
      default:
        return '✨';
    }
  };

  const handleActionClick = (e: React.MouseEvent, action: () => void) => {
    e.stopPropagation();
    action();
  };

  return (
    <motion.div
      className={`group relative bg-white/10 backdrop-blur-md border border-white/20 rounded-xl overflow-hidden hover:bg-white/15 transition-all duration-300 cursor-pointer ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden">
        {/* Loading Placeholder */}
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-blue-500/20 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* Error Placeholder */}
        {imageError && (
          <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 to-orange-500/20 flex items-center justify-center">
            <div className="text-center">
              <Sparkles className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-400">Image unavailable</p>
            </div>
          </div>
        )}

        {/* Artwork Image */}
        <img
          src={artwork.thumbnailUrl || artwork.imageUrl}
          alt={artwork.title}
          className={`w-full h-full object-cover transition-all duration-500 ${
            imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-110'
          } group-hover:scale-105`}
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageError(true)}
        />

        {/* Overlay */}
        <div className={`absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent transition-opacity duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`} />

        {/* Model Badge */}
        <div className="absolute top-3 left-3">
          <div className="flex items-center gap-1 px-2 py-1 bg-black/50 backdrop-blur-sm rounded-full text-xs text-white">
            <span>{getModelIcon(artwork.model)}</span>
            <span className="font-medium">{artwork.model}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 10 }}
          transition={{ duration: 0.2 }}
          className="absolute top-3 right-3 flex flex-col gap-2"
        >
          <button
            onClick={(e) => handleActionClick(e, onLike)}
            className={`p-2 rounded-full backdrop-blur-sm transition-all duration-200 ${
              artwork.isLiked
                ? 'bg-red-500/80 text-white'
                : 'bg-black/50 text-white hover:bg-red-500/80'
            }`}
          >
            <Heart className={`w-4 h-4 ${artwork.isLiked ? 'fill-current' : ''}`} />
          </button>
          
          <button
            onClick={(e) => handleActionClick(e, onShare)}
            className="p-2 bg-black/50 backdrop-blur-sm rounded-full text-white hover:bg-emerald-500/80 transition-all duration-200"
          >
            <Share2 className="w-4 h-4" />
          </button>
          
          <button
            onClick={(e) => handleActionClick(e, onDownload)}
            className="p-2 bg-black/50 backdrop-blur-sm rounded-full text-white hover:bg-blue-500/80 transition-all duration-200"
          >
            <Download className="w-4 h-4" />
          </button>
        </motion.div>

        {/* Stats Overlay */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 10 }}
          transition={{ duration: 0.2, delay: 0.1 }}
          className="absolute bottom-3 left-3 right-3"
        >
          <div className="flex items-center justify-between text-white text-sm">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <Heart className="w-4 h-4" />
                <span>{artwork.likes}</span>
              </div>
              <div className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                <span>{artwork.views}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-1 px-2 py-1 bg-black/50 backdrop-blur-sm rounded-full">
              <Settings className="w-3 h-3" />
              <span className="text-xs">{artwork.metadata.steps} steps</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Title and Style */}
        <div className="mb-2">
          <h3 className="font-semibold text-white text-lg mb-1 line-clamp-1 group-hover:text-emerald-300 transition-colors">
            {artwork.title}
          </h3>
          <div className="flex items-center gap-2 text-sm">
            <span className="px-2 py-1 bg-emerald-500/20 text-emerald-300 rounded-full text-xs font-medium">
              {artwork.style}
            </span>
            <div className="flex items-center gap-1 text-gray-400">
              <Clock className="w-3 h-3" />
              <span className="text-xs">{formatDate(artwork.createdAt)}</span>
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-300 text-sm mb-3 line-clamp-2">
          {artwork.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-3">
          {artwork.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-white/10 text-gray-300 rounded text-xs"
            >
              #{tag}
            </span>
          ))}
          {artwork.tags.length > 3 && (
            <span className="px-2 py-1 bg-white/10 text-gray-400 rounded text-xs">
              +{artwork.tags.length - 3}
            </span>
          )}
        </div>

        {/* Dimensions */}
        <div className="flex items-center justify-between text-xs text-gray-400">
          <span>
            {artwork.dimensions.width} × {artwork.dimensions.height}
          </span>
          <span className="font-mono">
            Seed: {artwork.metadata.seed.toString().slice(0, 6)}...
          </span>
        </div>
      </div>

      {/* Hover Glow Effect */}
      <div className={`absolute inset-0 rounded-xl transition-all duration-300 pointer-events-none ${
        isHovered
          ? 'ring-2 ring-emerald-500/50 shadow-lg shadow-emerald-500/25'
          : ''
      }`} />
    </motion.div>
  );
};

export default ArtworkCard;