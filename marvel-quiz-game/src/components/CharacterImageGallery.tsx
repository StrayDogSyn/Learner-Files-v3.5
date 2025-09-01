import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { OptimizedImage, ImageGallery } from './ImageOptimization';
import { X, ZoomIn, Download, Share2, Heart, Info } from 'lucide-react';

interface CharacterImage {
  id: string;
  src: string;
  alt: string;
  type: 'portrait' | 'action' | 'comic-cover' | 'concept-art' | 'movie-still';
  title?: string;
  description?: string;
  source?: string;
  year?: number;
  artist?: string;
  highRes?: string;
}

interface CharacterImageGalleryProps {
  characterId: string;
  characterName: string;
  images?: CharacterImage[];
  className?: string;
  onClose?: () => void;
  showModal?: boolean;
}

interface ImageModalProps {
  image: CharacterImage;
  onClose: () => void;
  onNext?: () => void;
  onPrev?: () => void;
  showNavigation?: boolean;
}

// High-quality character images database
const characterImages: Record<string, CharacterImage[]> = {
  'spider-man': [
    {
      id: 'spiderman-1',
      src: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?w=800&h=600&fit=crop',
      alt: 'Spider-Man in action',
      type: 'action',
      title: 'Web-Slinging Hero',
      description: 'Spider-Man swinging through New York City',
      highRes: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?w=1920&h=1440&fit=crop'
    },
    {
      id: 'spiderman-2',
      src: 'https://images.unsplash.com/photo-1566492031773-4f4e44671d66?w=800&h=600&fit=crop',
      alt: 'Spider-Man portrait',
      type: 'portrait',
      title: 'The Amazing Spider-Man',
      description: 'Classic Spider-Man portrait',
      highRes: 'https://images.unsplash.com/photo-1566492031773-4f4e44671d66?w=1920&h=1440&fit=crop'
    },
    {
      id: 'spiderman-comic-1',
      src: 'https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=800&h=600&fit=crop',
      alt: 'Spider-Man comic cover',
      type: 'comic-cover',
      title: 'Amazing Fantasy #15',
      description: 'First appearance of Spider-Man',
      year: 1962
    }
  ],
  'iron-man': [
    {
      id: 'ironman-1',
      src: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?w=800&h=600&fit=crop',
      alt: 'Iron Man suit',
      type: 'action',
      title: 'Mark 85 Armor',
      description: 'Tony Stark in his advanced Iron Man suit'
    },
    {
      id: 'ironman-2',
      src: 'https://images.unsplash.com/photo-1566492031773-4f4e44671d66?w=800&h=600&fit=crop',
      alt: 'Tony Stark portrait',
      type: 'portrait',
      title: 'Tony Stark',
      description: 'Genius, billionaire, playboy, philanthropist'
    }
  ],
  'thor': [
    {
      id: 'thor-1',
      src: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
      alt: 'Thor with Mjolnir',
      type: 'action',
      title: 'God of Thunder',
      description: 'Thor wielding his mighty hammer Mjolnir'
    },
    {
      id: 'thor-2',
      src: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
      alt: 'Thor portrait',
      type: 'portrait',
      title: 'Prince of Asgard',
      description: 'Thor Odinson, heir to the throne of Asgard'
    }
  ],
  'hulk': [
    {
      id: 'hulk-1',
      src: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
      alt: 'Hulk smashing',
      type: 'action',
      title: 'Hulk Smash!',
      description: 'The incredible Hulk in action'
    },
    {
      id: 'hulk-2',
      src: 'https://images.unsplash.com/photo-1566492031773-4f4e44671d66?w=800&h=600&fit=crop',
      alt: 'Bruce Banner',
      type: 'portrait',
      title: 'Dr. Bruce Banner',
      description: 'Brilliant scientist with a gamma-powered alter ego'
    }
  ],
  'captain-america': [
    {
      id: 'cap-1',
      src: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?w=800&h=600&fit=crop',
      alt: 'Captain America with shield',
      type: 'action',
      title: 'First Avenger',
      description: 'Captain America with his vibranium shield'
    },
    {
      id: 'cap-2',
      src: 'https://images.unsplash.com/photo-1566492031773-4f4e44671d66?w=800&h=600&fit=crop',
      alt: 'Steve Rogers portrait',
      type: 'portrait',
      title: 'Steve Rogers',
      description: 'The man out of time, symbol of freedom'
    }
  ]
};

// Image Modal Component
const ImageModal: React.FC<ImageModalProps> = ({
  image,
  onClose,
  onNext,
  onPrev,
  showNavigation = false
}) => {
  const [isLiked, setIsLiked] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft' && onPrev) onPrev();
      if (e.key === 'ArrowRight' && onNext) onNext();
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose, onNext, onPrev]);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = image.highRes || image.src;
    link.download = `${image.title || image.alt}.jpg`;
    link.click();
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: image.title || image.alt,
          text: image.description,
          url: image.src
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(image.src);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="relative max-w-6xl max-h-full" onClick={e => e.stopPropagation()}>
        {/* Main Image */}
        <OptimizedImage
          src={image.highRes || image.src}
          alt={image.alt}
          className="max-w-full max-h-[80vh] object-contain rounded-lg"
          preload={true}
        />
        
        {/* Controls */}
        <div className="absolute top-4 right-4 flex gap-2">
          <button
            onClick={() => setIsLiked(!isLiked)}
            className={`p-2 rounded-full transition-colors ${
              isLiked ? 'bg-red-500 text-white' : 'bg-white/20 text-white hover:bg-white/30'
            }`}
          >
            <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
          </button>
          <button
            onClick={() => setShowInfo(!showInfo)}
            className="p-2 bg-white/20 text-white rounded-full hover:bg-white/30 transition-colors"
          >
            <Info className="w-5 h-5" />
          </button>
          <button
            onClick={handleShare}
            className="p-2 bg-white/20 text-white rounded-full hover:bg-white/30 transition-colors"
          >
            <Share2 className="w-5 h-5" />
          </button>
          <button
            onClick={handleDownload}
            className="p-2 bg-white/20 text-white rounded-full hover:bg-white/30 transition-colors"
          >
            <Download className="w-5 h-5" />
          </button>
          <button
            onClick={onClose}
            className="p-2 bg-white/20 text-white rounded-full hover:bg-white/30 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Navigation */}
        {showNavigation && (
          <>
            {onPrev && (
              <button
                onClick={onPrev}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 p-3 bg-white/20 text-white rounded-full hover:bg-white/30 transition-colors"
              >
                ←
              </button>
            )}
            {onNext && (
              <button
                onClick={onNext}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 p-3 bg-white/20 text-white rounded-full hover:bg-white/30 transition-colors"
              >
                →
              </button>
            )}
          </>
        )}
        
        {/* Image Info */}
        <AnimatePresence>
          {showInfo && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="absolute bottom-4 left-4 right-4 bg-black/70 text-white p-4 rounded-lg"
            >
              <h3 className="text-lg font-bold mb-2">{image.title || image.alt}</h3>
              {image.description && (
                <p className="text-sm mb-2">{image.description}</p>
              )}
              <div className="flex gap-4 text-xs text-gray-300">
                {image.type && <span>Type: {image.type.replace('-', ' ')}</span>}
                {image.year && <span>Year: {image.year}</span>}
                {image.artist && <span>Artist: {image.artist}</span>}
                {image.source && <span>Source: {image.source}</span>}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

// Main Character Image Gallery Component
export const CharacterImageGallery: React.FC<CharacterImageGalleryProps> = ({
  characterId,
  characterName,
  images: customImages,
  className = '',
  onClose,
  showModal = false
}) => {
  const [selectedImage, setSelectedImage] = useState<CharacterImage | null>(null);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const images = customImages || characterImages[characterId] || [];
  
  const filteredImages = selectedType === 'all' 
    ? images 
    : images.filter(img => img.type === selectedType);

  const imageTypes = ['all', ...Array.from(new Set(images.map(img => img.type)))];

  const openImageModal = (image: CharacterImage, index: number) => {
    setSelectedImage(image);
    setCurrentImageIndex(index);
  };

  const closeImageModal = () => {
    setSelectedImage(null);
  };

  const nextImage = () => {
    const nextIndex = (currentImageIndex + 1) % filteredImages.length;
    setCurrentImageIndex(nextIndex);
    setSelectedImage(filteredImages[nextIndex]);
  };

  const prevImage = () => {
    const prevIndex = (currentImageIndex - 1 + filteredImages.length) % filteredImages.length;
    setCurrentImageIndex(prevIndex);
    setSelectedImage(filteredImages[prevIndex]);
  };

  if (images.length === 0) {
    return (
      <div className={`bg-gray-100 rounded-lg p-8 text-center ${className}`}>
        <div className="text-gray-500 mb-4">
          <ZoomIn className="w-12 h-12 mx-auto mb-2" />
          <p>No images available for {characterName}</p>
        </div>
      </div>
    );
  }

  const content = (
    <div className={`${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          {characterName} Gallery
        </h2>
        {onClose && (
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-200 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        )}
      </div>
      
      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto">
        {imageTypes.map(type => (
          <button
            key={type}
            onClick={() => setSelectedType(type)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
              selectedType === type
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {type === 'all' ? 'All Images' : type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </button>
        ))}
      </div>
      
      {/* Image Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredImages.map((image, index) => (
          <motion.div
            key={image.id}
            className="relative aspect-square bg-gray-200 rounded-lg overflow-hidden cursor-pointer group"
            onClick={() => openImageModal(image, index)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <OptimizedImage
              src={image.src}
              alt={image.alt}
              className="w-full h-full"
              lazy={true}
            />
            
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
              <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            
            {/* Image Type Badge */}
            <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
              {image.type.replace('-', ' ')}
            </div>
            
            {/* Title */}
            {image.title && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                <p className="text-white text-xs font-medium truncate">{image.title}</p>
              </div>
            )}
          </motion.div>
        ))}
      </div>
      
      {filteredImages.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No images found for the selected type.
        </div>
      )}
    </div>
  );

  return (
    <>
      {showModal ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-white z-40 overflow-y-auto p-6"
        >
          {content}
        </motion.div>
      ) : (
        content
      )}
      
      {/* Image Modal */}
      <AnimatePresence>
        {selectedImage && (
          <ImageModal
            image={selectedImage}
            onClose={closeImageModal}
            onNext={filteredImages.length > 1 ? nextImage : undefined}
            onPrev={filteredImages.length > 1 ? prevImage : undefined}
            showNavigation={filteredImages.length > 1}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default CharacterImageGallery;