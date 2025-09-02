import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, X, ChevronDown, Sparkles, Palette, Tag } from 'lucide-react';

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

interface FilterOptions {
  models: string[];
  styles: string[];
  tags: string[];
}

interface GalleryFiltersProps {
  artworks: AIArtwork[];
  selectedFilters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  className?: string;
}

const GalleryFilters: React.FC<GalleryFiltersProps> = ({
  artworks,
  selectedFilters,
  onFiltersChange,
  className = ''
}) => {
  const [activeTab, setActiveTab] = useState<'models' | 'styles' | 'tags'>('models');
  const [expandedSections, setExpandedSections] = useState({
    models: true,
    styles: true,
    tags: true
  });

  // Extract unique values from artworks
  const availableOptions = useMemo(() => {
    const models = new Map<string, number>();
    const styles = new Map<string, number>();
    const tags = new Map<string, number>();

    artworks.forEach(artwork => {
      // Count models
      models.set(artwork.model, (models.get(artwork.model) || 0) + 1);
      
      // Count styles
      styles.set(artwork.style, (styles.get(artwork.style) || 0) + 1);
      
      // Count tags
      artwork.tags.forEach(tag => {
        tags.set(tag, (tags.get(tag) || 0) + 1);
      });
    });

    return {
      models: Array.from(models.entries())
        .sort((a, b) => b[1] - a[1])
        .map(([name, count]) => ({ name, count })),
      styles: Array.from(styles.entries())
        .sort((a, b) => b[1] - a[1])
        .map(([name, count]) => ({ name, count })),
      tags: Array.from(tags.entries())
        .sort((a, b) => b[1] - a[1])
        .map(([name, count]) => ({ name, count }))
    };
  }, [artworks]);

  const handleFilterToggle = (type: keyof FilterOptions, value: string) => {
    const currentFilters = selectedFilters[type];
    const newFilters = currentFilters.includes(value)
      ? currentFilters.filter(item => item !== value)
      : [...currentFilters, value];

    onFiltersChange({
      ...selectedFilters,
      [type]: newFilters
    });
  };

  const clearFilters = () => {
    onFiltersChange({
      models: [],
      styles: [],
      tags: []
    });
  };

  const clearFilterType = (type: keyof FilterOptions) => {
    onFiltersChange({
      ...selectedFilters,
      [type]: []
    });
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const getFilterIcon = (type: keyof FilterOptions) => {
    switch (type) {
      case 'models':
        return <Sparkles className="w-4 h-4" />;
      case 'styles':
        return <Palette className="w-4 h-4" />;
      case 'tags':
        return <Tag className="w-4 h-4" />;
      default:
        return <Filter className="w-4 h-4" />;
    }
  };

  const getModelColor = (model: string) => {
    switch (model.toLowerCase()) {
      case 'sdxl':
      case 'stable diffusion':
        return 'border-purple-500/30 bg-purple-500/10 text-purple-300 hover:bg-purple-500/20';
      case 'midjourney':
        return 'border-blue-500/30 bg-blue-500/10 text-blue-300 hover:bg-blue-500/20';
      case 'dall-e 3':
      case 'dalle':
        return 'border-green-500/30 bg-green-500/10 text-green-300 hover:bg-green-500/20';
      default:
        return 'border-gray-500/30 bg-gray-500/10 text-gray-300 hover:bg-gray-500/20';
    }
  };

  const totalActiveFilters = selectedFilters.models.length + selectedFilters.styles.length + selectedFilters.tags.length;

  return (
    <div className={`bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Filter className="w-5 h-5 text-emerald-400" />
          <h3 className="text-lg font-semibold text-white">Filters</h3>
          {totalActiveFilters > 0 && (
            <span className="px-2 py-1 bg-emerald-500/20 text-emerald-300 rounded-full text-sm font-medium">
              {totalActiveFilters} active
            </span>
          )}
        </div>
        
        {totalActiveFilters > 0 && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-2 px-3 py-1 text-sm text-gray-300 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
            Clear all
          </button>
        )}
      </div>

      {/* Mobile Tabs */}
      <div className="md:hidden mb-6">
        <div className="flex bg-white/5 rounded-lg p-1">
          {(['models', 'styles', 'tags'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded transition-colors ${
                activeTab === tab
                  ? 'bg-emerald-500/20 text-emerald-300'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {getFilterIcon(tab)}
              <span className="capitalize text-sm">{tab}</span>
              {selectedFilters[tab].length > 0 && (
                <span className="w-2 h-2 bg-emerald-400 rounded-full" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Filter Sections */}
      <div className="space-y-6">
        {/* Models Section */}
        <div className={`${activeTab !== 'models' ? 'hidden md:block' : ''}`}>
          <div className="flex items-center justify-between mb-3">
            <button
              onClick={() => toggleSection('models')}
              className="flex items-center gap-2 text-white hover:text-emerald-300 transition-colors"
            >
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span className="font-medium">AI Models</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${
                expandedSections.models ? 'rotate-180' : ''
              }`} />
            </button>
            
            {selectedFilters.models.length > 0 && (
              <button
                onClick={() => clearFilterType('models')}
                className="text-xs text-gray-400 hover:text-white transition-colors"
              >
                Clear
              </button>
            )}
          </div>
          
          <AnimatePresence>
            {expandedSections.models && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="space-y-2"
              >
                {availableOptions.models.map(({ name, count }) => (
                  <motion.button
                    key={name}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    onClick={() => handleFilterToggle('models', name)}
                    className={`w-full flex items-center justify-between p-3 border rounded-lg transition-all duration-200 ${
                      selectedFilters.models.includes(name)
                        ? `${getModelColor(name)} ring-1 ring-current`
                        : 'border-white/20 bg-white/5 text-gray-300 hover:bg-white/10'
                    }`}
                  >
                    <span className="font-medium">{name}</span>
                    <span className="text-sm opacity-75">{count}</span>
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Styles Section */}
        <div className={`${activeTab !== 'styles' ? 'hidden md:block' : ''}`}>
          <div className="flex items-center justify-between mb-3">
            <button
              onClick={() => toggleSection('styles')}
              className="flex items-center gap-2 text-white hover:text-emerald-300 transition-colors"
            >
              <Palette className="w-4 h-4 text-emerald-400" />
              <span className="font-medium">Art Styles</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${
                expandedSections.styles ? 'rotate-180' : ''
              }`} />
            </button>
            
            {selectedFilters.styles.length > 0 && (
              <button
                onClick={() => clearFilterType('styles')}
                className="text-xs text-gray-400 hover:text-white transition-colors"
              >
                Clear
              </button>
            )}
          </div>
          
          <AnimatePresence>
            {expandedSections.styles && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="grid grid-cols-2 gap-2"
              >
                {availableOptions.styles.map(({ name, count }) => (
                  <motion.button
                    key={name}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    onClick={() => handleFilterToggle('styles', name)}
                    className={`flex items-center justify-between p-3 border rounded-lg transition-all duration-200 ${
                      selectedFilters.styles.includes(name)
                        ? 'border-emerald-500/50 bg-emerald-500/20 text-emerald-300 ring-1 ring-emerald-500/30'
                        : 'border-white/20 bg-white/5 text-gray-300 hover:bg-white/10'
                    }`}
                  >
                    <span className="font-medium text-sm">{name}</span>
                    <span className="text-xs opacity-75">{count}</span>
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Tags Section */}
        <div className={`${activeTab !== 'tags' ? 'hidden md:block' : ''}`}>
          <div className="flex items-center justify-between mb-3">
            <button
              onClick={() => toggleSection('tags')}
              className="flex items-center gap-2 text-white hover:text-emerald-300 transition-colors"
            >
              <Tag className="w-4 h-4 text-emerald-400" />
              <span className="font-medium">Tags</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${
                expandedSections.tags ? 'rotate-180' : ''
              }`} />
            </button>
            
            {selectedFilters.tags.length > 0 && (
              <button
                onClick={() => clearFilterType('tags')}
                className="text-xs text-gray-400 hover:text-white transition-colors"
              >
                Clear
              </button>
            )}
          </div>
          
          <AnimatePresence>
            {expandedSections.tags && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="flex flex-wrap gap-2"
              >
                {availableOptions.tags.slice(0, 20).map(({ name, count }) => (
                  <motion.button
                    key={name}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    onClick={() => handleFilterToggle('tags', name)}
                    className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm transition-all duration-200 ${
                      selectedFilters.tags.includes(name)
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-white/10 text-gray-300 border border-white/20 hover:bg-white/20'
                    }`}
                  >
                    <span>#{name}</span>
                    <span className="text-xs opacity-75">({count})</span>
                  </motion.button>
                ))}
                
                {availableOptions.tags.length > 20 && (
                  <div className="w-full text-center mt-2">
                    <span className="text-xs text-gray-400">
                      +{availableOptions.tags.length - 20} more tags available
                    </span>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Active Filters Summary */}
      {totalActiveFilters > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 pt-6 border-t border-white/20"
        >
          <h4 className="text-sm font-medium text-gray-400 mb-3">Active Filters:</h4>
          <div className="space-y-2">
            {selectedFilters.models.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {selectedFilters.models.map(model => (
                  <span
                    key={model}
                    className="flex items-center gap-1 px-2 py-1 bg-purple-500/20 text-purple-300 rounded text-xs"
                  >
                    {model}
                    <button
                      onClick={() => handleFilterToggle('models', model)}
                      className="hover:text-white transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
            
            {selectedFilters.styles.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {selectedFilters.styles.map(style => (
                  <span
                    key={style}
                    className="flex items-center gap-1 px-2 py-1 bg-emerald-500/20 text-emerald-300 rounded text-xs"
                  >
                    {style}
                    <button
                      onClick={() => handleFilterToggle('styles', style)}
                      className="hover:text-white transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
            
            {selectedFilters.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {selectedFilters.tags.map(tag => (
                  <span
                    key={tag}
                    className="flex items-center gap-1 px-2 py-1 bg-blue-500/20 text-blue-300 rounded text-xs"
                  >
                    #{tag}
                    <button
                      onClick={() => handleFilterToggle('tags', tag)}
                      className="hover:text-white transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default GalleryFilters;