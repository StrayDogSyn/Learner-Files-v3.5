import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  SortAsc, 
  SortDesc, 
  Grid, 
  List, 
  Eye, 
  Heart, 
  Share2, 
  Bookmark, 
  ExternalLink, 
  Clock, 
  Star, 
  Tag, 
  FileText, 
  Image, 
  Code, 
  Zap, 
  TrendingUp, 
  Calendar, 
  User, 
  MapPin, 
  Download, 
  Play, 
  Pause, 
  MoreHorizontal, 
  ChevronLeft, 
  ChevronRight, 
  AlertCircle, 
  CheckCircle, 
  Info, 
  Loader2
} from 'lucide-react';

interface SearchResult {
  id: string;
  title: string;
  description: string;
  type: 'project' | 'artwork' | 'demo' | 'blog';
  category: string;
  tags: string[];
  thumbnail?: string;
  url: string;
  author: string;
  createdAt: Date;
  updatedAt: Date;
  stats: {
    views: number;
    likes: number;
    shares: number;
    downloads?: number;
  };
  relevanceScore: number;
  featured?: boolean;
  isLive?: boolean;
  metadata?: {
    duration?: number;
    fileSize?: string;
    dimensions?: string;
    technology?: string[];
    difficulty?: 'beginner' | 'intermediate' | 'advanced';
  };
}

interface SearchResultsProps {
  results: SearchResult[];
  query: string;
  isLoading?: boolean;
  totalResults?: number;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  onResultClick?: (result: SearchResult) => void;
  onLike?: (resultId: string) => void;
  onShare?: (result: SearchResult) => void;
  onBookmark?: (resultId: string) => void;
  className?: string;
}

type ViewMode = 'grid' | 'list';
type SortBy = 'relevance' | 'date' | 'popularity' | 'title';
type SortOrder = 'asc' | 'desc';

const SearchResults: React.FC<SearchResultsProps> = ({
  results,
  query,
  isLoading = false,
  totalResults = 0,
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  onResultClick,
  onLike,
  onShare,
  onBookmark,
  className = ''
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortBy, setSortBy] = useState<SortBy>('relevance');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [likedResults, setLikedResults] = useState<Set<string>>(new Set());
  const [bookmarkedResults, setBookmarkedResults] = useState<Set<string>>(new Set());

  // Sort and filter results
  const processedResults = useMemo(() => {
    let filtered = results;
    
    // Filter by type
    if (selectedType !== 'all') {
      filtered = filtered.filter(result => result.type === selectedType);
    }
    
    // Sort results
    const sorted = [...filtered].sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'relevance':
          comparison = b.relevanceScore - a.relevanceScore;
          break;
        case 'date':
          comparison = b.updatedAt.getTime() - a.updatedAt.getTime();
          break;
        case 'popularity':
          comparison = (b.stats.views + b.stats.likes) - (a.stats.views + a.stats.likes);
          break;
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
      }
      
      return sortOrder === 'asc' ? -comparison : comparison;
    });
    
    return sorted;
  }, [results, selectedType, sortBy, sortOrder]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'project':
        return <Code className="w-4 h-4" />;
      case 'artwork':
        return <Image className="w-4 h-4" />;
      case 'demo':
        return <Zap className="w-4 h-4" />;
      case 'blog':
        return <FileText className="w-4 h-4" />;
      default:
        return <Search className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'project':
        return 'text-blue-400';
      case 'artwork':
        return 'text-purple-400';
      case 'demo':
        return 'text-yellow-400';
      case 'blog':
        return 'text-green-400';
      default:
        return 'text-gray-400';
    }
  };

  const handleLike = (resultId: string) => {
    const newLiked = new Set(likedResults);
    if (newLiked.has(resultId)) {
      newLiked.delete(resultId);
    } else {
      newLiked.add(resultId);
    }
    setLikedResults(newLiked);
    onLike?.(resultId);
  };

  const handleBookmark = (resultId: string) => {
    const newBookmarked = new Set(bookmarkedResults);
    if (newBookmarked.has(resultId)) {
      newBookmarked.delete(resultId);
    } else {
      newBookmarked.add(resultId);
    }
    setBookmarkedResults(newBookmarked);
    onBookmark?.(resultId);
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  const highlightQuery = (text: string, query: string) => {
    if (!query.trim()) return text;
    
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <mark key={index} className="bg-emerald-500/30 text-emerald-300 px-1 rounded">
          {part}
        </mark>
      ) : part
    );
  };

  if (isLoading) {
    return (
      <div className={`${className}`}>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Loader2 className="w-8 h-8 text-emerald-400 animate-spin mx-auto mb-4" />
            <p className="text-gray-400">Searching with AI intelligence...</p>
          </div>
        </div>
      </div>
    );
  }

  if (processedResults.length === 0 && !isLoading) {
    return (
      <div className={`${className}`}>
        <div className="text-center py-12">
          <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No results found</h3>
          <p className="text-gray-400 mb-4">
            {query ? `No results for "${query}"` : 'Try adjusting your search terms or filters'}
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            <span className="px-3 py-1 bg-white/10 rounded-full text-sm text-gray-300">Try: "React projects"</span>
            <span className="px-3 py-1 bg-white/10 rounded-full text-sm text-gray-300">Try: "AI art"</span>
            <span className="px-3 py-1 bg-white/10 rounded-full text-sm text-gray-300">Try: "Interactive demos"</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${className}`}>
      {/* Results Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <div>
            <h2 className="text-xl font-semibold text-white">
              {totalResults > 0 ? (
                <>
                  {formatNumber(totalResults)} result{totalResults !== 1 ? 's' : ''}
                  {query && (
                    <span className="text-gray-400 font-normal">
                      {' '}for "{query}"
                    </span>
                  )}
                </>
              ) : (
                'Search Results'
              )}
            </h2>
            {processedResults.length !== totalResults && (
              <p className="text-sm text-gray-400">
                Showing {processedResults.length} filtered results
              </p>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Type Filter */}
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500/50"
          >
            <option value="all">All Types</option>
            <option value="project">Projects</option>
            <option value="artwork">Artwork</option>
            <option value="demo">Demos</option>
            <option value="blog">Blog</option>
          </select>
          
          {/* Sort Controls */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortBy)}
            className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500/50"
          >
            <option value="relevance">Relevance</option>
            <option value="date">Date</option>
            <option value="popularity">Popularity</option>
            <option value="title">Title</option>
          </select>
          
          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="p-2 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 transition-colors"
            title={`Sort ${sortOrder === 'asc' ? 'Descending' : 'Ascending'}`}
          >
            {sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
          </button>
          
          {/* View Mode Toggle */}
          <div className="flex bg-white/10 border border-white/20 rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 transition-colors ${
                viewMode === 'grid' ? 'bg-emerald-500/20 text-emerald-300' : 'text-gray-400 hover:text-white'
              }`}
              title="Grid View"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 transition-colors ${
                viewMode === 'list' ? 'bg-emerald-500/20 text-emerald-300' : 'text-gray-400 hover:text-white'
              }`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Results Grid/List */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${viewMode}-${selectedType}-${sortBy}-${sortOrder}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className={viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
            : 'space-y-4'
          }
        >
          {processedResults.map((result, index) => (
            <motion.div
              key={result.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`group bg-white/10 backdrop-blur-md border border-white/20 rounded-xl overflow-hidden hover:border-emerald-500/50 transition-all duration-300 ${
                viewMode === 'list' ? 'flex' : ''
              }`}
            >
              {/* Thumbnail */}
              {result.thumbnail && (
                <div className={`relative overflow-hidden ${
                  viewMode === 'list' ? 'w-32 h-24 flex-shrink-0' : 'aspect-video'
                }`}>
                  <img
                    src={result.thumbnail}
                    alt={result.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  
                  {/* Type Badge */}
                  <div className={`absolute top-2 left-2 flex items-center gap-1 px-2 py-1 bg-black/50 backdrop-blur-sm rounded text-xs ${getTypeColor(result.type)}`}>
                    {getTypeIcon(result.type)}
                    <span className="capitalize">{result.type}</span>
                  </div>
                  
                  {/* Featured Badge */}
                  {result.featured && (
                    <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 bg-emerald-500/20 backdrop-blur-sm rounded text-xs text-emerald-300">
                      <Star className="w-3 h-3" />
                      <span>Featured</span>
                    </div>
                  )}
                  
                  {/* Live Indicator */}
                  {result.isLive && (
                    <div className="absolute bottom-2 left-2 flex items-center gap-1 px-2 py-1 bg-red-500/20 backdrop-blur-sm rounded text-xs text-red-300">
                      <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
                      <span>Live</span>
                    </div>
                  )}
                </div>
              )}
              
              {/* Content */}
              <div className="p-4 flex-1">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-semibold text-white group-hover:text-emerald-300 transition-colors line-clamp-2">
                    {highlightQuery(result.title, query)}
                  </h3>
                  
                  <div className="flex items-center gap-1">
                    <div className="w-12 bg-white/20 rounded-full h-1">
                      <div 
                        className="h-full bg-emerald-400 rounded-full transition-all"
                        style={{ width: `${result.relevanceScore * 100}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-400 ml-1">
                      {Math.round(result.relevanceScore * 100)}%
                    </span>
                  </div>
                </div>
                
                <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                  {highlightQuery(result.description, query)}
                </p>
                
                {/* Tags */}
                {result.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {result.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-white/10 rounded text-xs text-gray-300"
                      >
                        {tag}
                      </span>
                    ))}
                    {result.tags.length > 3 && (
                      <span className="px-2 py-1 bg-white/10 rounded text-xs text-gray-400">
                        +{result.tags.length - 3}
                      </span>
                    )}
                  </div>
                )}
                
                {/* Metadata */}
                <div className="flex items-center gap-4 text-xs text-gray-400 mb-3">
                  <div className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    <span>{result.author}</span>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{result.updatedAt.toLocaleDateString()}</span>
                  </div>
                  
                  {result.metadata?.difficulty && (
                    <div className="flex items-center gap-1">
                      <div className={`w-2 h-2 rounded-full ${
                        result.metadata.difficulty === 'beginner' ? 'bg-green-400' :
                        result.metadata.difficulty === 'intermediate' ? 'bg-yellow-400' :
                        'bg-red-400'
                      }`} />
                      <span className="capitalize">{result.metadata.difficulty}</span>
                    </div>
                  )}
                </div>
                
                {/* Stats */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-xs text-gray-400">
                    <div className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      <span>{formatNumber(result.stats.views)}</span>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <Heart className={`w-3 h-3 ${likedResults.has(result.id) ? 'text-red-400 fill-current' : ''}`} />
                      <span>{formatNumber(result.stats.likes)}</span>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <Share2 className="w-3 h-3" />
                      <span>{formatNumber(result.stats.shares)}</span>
                    </div>
                    
                    {result.stats.downloads && (
                      <div className="flex items-center gap-1">
                        <Download className="w-3 h-3" />
                        <span>{formatNumber(result.stats.downloads)}</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLike(result.id);
                      }}
                      className={`p-1 rounded transition-colors ${
                        likedResults.has(result.id)
                          ? 'text-red-400 hover:text-red-300'
                          : 'text-gray-400 hover:text-red-400'
                      }`}
                      title="Like"
                    >
                      <Heart className={`w-4 h-4 ${likedResults.has(result.id) ? 'fill-current' : ''}`} />
                    </button>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onShare?.(result);
                      }}
                      className="p-1 text-gray-400 hover:text-blue-400 rounded transition-colors"
                      title="Share"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleBookmark(result.id);
                      }}
                      className={`p-1 rounded transition-colors ${
                        bookmarkedResults.has(result.id)
                          ? 'text-yellow-400 hover:text-yellow-300'
                          : 'text-gray-400 hover:text-yellow-400'
                      }`}
                      title="Bookmark"
                    >
                      <Bookmark className={`w-4 h-4 ${bookmarkedResults.has(result.id) ? 'fill-current' : ''}`} />
                    </button>
                    
                    <button
                      onClick={() => onResultClick?.(result)}
                      className="p-1 text-gray-400 hover:text-emerald-400 rounded transition-colors"
                      title="View"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

      {/* Pagination */}
      {totalPages > 1 && onPageChange && (
        <div className="flex items-center justify-center gap-2 mt-8">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            className="p-2 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          
          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const page = i + 1;
              return (
                <button
                  key={page}
                  onClick={() => onPageChange(page)}
                  className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                    currentPage === page
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50'
                      : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
                  }`}
                >
                  {page}
                </button>
              );
            })}
            
            {totalPages > 5 && (
              <>
                <span className="px-2 text-gray-400">...</span>
                <button
                  onClick={() => onPageChange(totalPages)}
                  className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                    currentPage === totalPages
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50'
                      : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
                  }`}
                >
                  {totalPages}
                </button>
              </>
            )}
          </div>
          
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className="p-2 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default SearchResults;