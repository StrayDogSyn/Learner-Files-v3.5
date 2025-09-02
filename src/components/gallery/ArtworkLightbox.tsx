import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Heart, 
  Download, 
  Share2, 
  Copy, 
  Eye, 
  Calendar, 
  Settings, 
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  RotateCw
} from 'lucide-react';

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

interface ArtworkLightboxProps {
  artwork: AIArtwork;
  onClose: () => void;
  onLike: () => void;
  onShare: () => void;
  onDownload: () => void;
  onPrevious?: () => void;
  onNext?: () => void;
  hasPrevious?: boolean;
  hasNext?: boolean;
}

const ArtworkLightbox: React.FC<ArtworkLightboxProps> = ({
  artwork,
  onClose,
  onLike,
  onShare,
  onDownload,
  onPrevious,
  onNext,
  hasPrevious = false,
  hasNext = false
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showDetails, setShowDetails] = useState(true);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [copiedPrompt, setCopiedPrompt] = useState(false);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          if (hasPrevious && onPrevious) onPrevious();
          break;
        case 'ArrowRight':
          if (hasNext && onNext) onNext();
          break;
        case ' ':
          e.preventDefault();
          setShowDetails(!showDetails);
          break;
        case '+':
        case '=':
          e.preventDefault();
          setZoom(prev => Math.min(prev + 0.25, 3));
          break;
        case '-':
          e.preventDefault();
          setZoom(prev => Math.max(prev - 0.25, 0.5));
          break;
        case 'r':
        case 'R':
          e.preventDefault();
          setRotation(prev => (prev + 90) % 360);
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose, onPrevious, onNext, hasPrevious, hasNext, showDetails]);

  // Reset zoom and rotation when artwork changes
  useEffect(() => {
    setZoom(1);
    setRotation(0);
    setImageLoaded(false);
  }, [artwork.id]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const copyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(artwork.prompt);
      setCopiedPrompt(true);
      setTimeout(() => setCopiedPrompt(false), 2000);
    } catch (error) {
      console.error('Failed to copy prompt:', error);
    }
  };

  const getModelColor = (model: string) => {
    switch (model.toLowerCase()) {
      case 'sdxl':
      case 'stable diffusion':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      case 'midjourney':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'dall-e 3':
      case 'dalle':
        return 'bg-green-500/20 text-green-300 border-green-500/30';
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm"
        onClick={onClose}
      >
        {/* Navigation Arrows */}
        {hasPrevious && onPrevious && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPrevious();
            }}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 p-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white hover:bg-white/20 transition-all duration-200"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}

        {hasNext && onNext && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onNext();
            }}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 p-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white hover:bg-white/20 transition-all duration-200"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}

        {/* Top Controls */}
        <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Model Badge */}
            <div className={`px-3 py-1 border rounded-full text-sm font-medium ${getModelColor(artwork.model)}`}>
              {artwork.model}
            </div>
            
            {/* Style Badge */}
            <div className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full text-sm font-medium">
              {artwork.style}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Image Controls */}
            <div className="flex items-center gap-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setZoom(prev => Math.max(prev - 0.25, 0.5));
                }}
                className="p-2 text-white hover:bg-white/20 rounded transition-colors"
                disabled={zoom <= 0.5}
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              
              <span className="px-2 text-white text-sm font-mono">
                {Math.round(zoom * 100)}%
              </span>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setZoom(prev => Math.min(prev + 0.25, 3));
                }}
                className="p-2 text-white hover:bg-white/20 rounded transition-colors"
                disabled={zoom >= 3}
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              
              <div className="w-px h-6 bg-white/20" />
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setRotation(prev => (prev + 90) % 360);
                }}
                className="p-2 text-white hover:bg-white/20 rounded transition-colors"
              >
                <RotateCw className="w-4 h-4" />
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onLike();
                }}
                className={`p-2 rounded transition-all duration-200 ${
                  artwork.isLiked
                    ? 'bg-red-500/80 text-white'
                    : 'text-white hover:bg-red-500/80'
                }`}
              >
                <Heart className={`w-4 h-4 ${artwork.isLiked ? 'fill-current' : ''}`} />
              </button>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onShare();
                }}
                className="p-2 text-white hover:bg-emerald-500/80 rounded transition-all duration-200"
              >
                <Share2 className="w-4 h-4" />
              </button>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDownload();
                }}
                className="p-2 text-white hover:bg-blue-500/80 rounded transition-all duration-200"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg text-white hover:bg-white/20 transition-all duration-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex h-full pt-20 pb-4">
          {/* Image Container */}
          <div className="flex-1 flex items-center justify-center p-4" onClick={(e) => e.stopPropagation()}>
            <div className="relative max-w-full max-h-full">
              {!imageLoaded && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin" />
                </div>
              )}
              
              <motion.img
                src={artwork.imageUrl}
                alt={artwork.title}
                className="max-w-full max-h-full object-contain"
                style={{
                  transform: `scale(${zoom}) rotate(${rotation}deg)`,
                  transition: 'transform 0.3s ease'
                }}
                onLoad={() => setImageLoaded(true)}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: imageLoaded ? 1 : 0, scale: imageLoaded ? 1 : 0.9 }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          {/* Details Panel */}
          <AnimatePresence>
            {showDetails && (
              <motion.div
                initial={{ x: 400, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 400, opacity: 0 }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="w-96 bg-white/10 backdrop-blur-md border-l border-white/20 p-6 overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="mb-6">
                  <h1 className="text-2xl font-bold text-white mb-2">{artwork.title}</h1>
                  <p className="text-gray-300 leading-relaxed">{artwork.description}</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-white/5 rounded-lg p-3">
                    <div className="flex items-center gap-2 text-red-400 mb-1">
                      <Heart className="w-4 h-4" />
                      <span className="text-sm font-medium">Likes</span>
                    </div>
                    <div className="text-xl font-bold text-white">{artwork.likes}</div>
                  </div>
                  
                  <div className="bg-white/5 rounded-lg p-3">
                    <div className="flex items-center gap-2 text-blue-400 mb-1">
                      <Eye className="w-4 h-4" />
                      <span className="text-sm font-medium">Views</span>
                    </div>
                    <div className="text-xl font-bold text-white">{artwork.views}</div>
                  </div>
                </div>

                {/* Metadata */}
                <div className="space-y-4 mb-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-400 mb-2 flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Created
                    </h3>
                    <p className="text-white">{formatDate(artwork.createdAt)}</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-400 mb-2">Dimensions</h3>
                    <p className="text-white">{artwork.dimensions.width} × {artwork.dimensions.height} pixels</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-400 mb-2 flex items-center gap-2">
                      <Settings className="w-4 h-4" />
                      Generation Settings
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-300">Steps:</span>
                        <span className="text-white font-mono">{artwork.metadata.steps}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">Sampler:</span>
                        <span className="text-white font-mono">{artwork.metadata.sampler}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">CFG Scale:</span>
                        <span className="text-white font-mono">{artwork.metadata.cfgScale}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">Seed:</span>
                        <span className="text-white font-mono">{artwork.metadata.seed}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Prompt */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-gray-400 flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      Prompt
                    </h3>
                    <button
                      onClick={copyPrompt}
                      className={`flex items-center gap-1 px-2 py-1 rounded text-xs transition-all duration-200 ${
                        copiedPrompt
                          ? 'bg-green-500/20 text-green-300'
                          : 'bg-white/10 text-gray-300 hover:bg-white/20'
                      }`}
                    >
                      <Copy className="w-3 h-3" />
                      {copiedPrompt ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                  <div className="bg-white/5 rounded-lg p-3">
                    <p className="text-white text-sm leading-relaxed">{artwork.prompt}</p>
                  </div>
                </div>

                {/* Negative Prompt */}
                {artwork.negativePrompt && (
                  <div className="mb-6">
                    <h3 className="text-sm font-medium text-gray-400 mb-2">Negative Prompt</h3>
                    <div className="bg-white/5 rounded-lg p-3">
                      <p className="text-gray-300 text-sm leading-relaxed">{artwork.negativePrompt}</p>
                    </div>
                  </div>
                )}

                {/* Tags */}
                <div>
                  <h3 className="text-sm font-medium text-gray-400 mb-2">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {artwork.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-emerald-500/20 text-emerald-300 rounded text-sm"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Toggle Details Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowDetails(!showDetails);
          }}
          className="absolute bottom-4 right-4 p-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white hover:bg-white/20 transition-all duration-200"
        >
          <Settings className="w-5 h-5" />
        </button>

        {/* Keyboard Shortcuts Help */}
        <div className="absolute bottom-4 left-4 text-xs text-gray-400">
          <div>ESC: Close • ←→: Navigate • Space: Toggle details</div>
          <div>+/-: Zoom • R: Rotate</div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ArtworkLightbox;