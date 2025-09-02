import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Brain, 
  Sparkles, 
  Filter, 
  SortAsc, 
  SortDesc, 
  Clock, 
  TrendingUp, 
  Star, 
  Tag, 
  FileText, 
  Image, 
  Code, 
  MessageSquare,
  X,
  ArrowRight,
  Zap,
  Eye,
  Heart,
  Share2,
  Bookmark,
  MoreHorizontal,
  ChevronDown,
  ChevronUp,
  Loader2,
  AlertCircle,
  CheckCircle,
  Info
} from 'lucide-react';

interface SearchQuery {
  id: string;
  query: string;
  timestamp: Date;
  results: number;
  category?: string;
}

interface SearchFilter {
  category: 'all' | 'projects' | 'gallery' | 'demos' | 'blog';
  type: 'all' | 'text' | 'image' | 'code' | 'interactive';
  dateRange: 'all' | 'week' | 'month' | 'year';
  tags: string[];
}

interface SearchSuggestion {
  id: string;
  text: string;
  type: 'query' | 'filter' | 'category';
  confidence: number;
  icon?: React.ReactNode;
}

interface IntelligentSearchProps {
  onSearch: (query: string, filters: SearchFilter) => void;
  onSuggestionSelect: (suggestion: SearchSuggestion) => void;
  isLoading?: boolean;
  placeholder?: string;
  className?: string;
}

const IntelligentSearch: React.FC<IntelligentSearchProps> = ({
  onSearch,
  onSuggestionSelect,
  isLoading = false,
  placeholder = 'Search projects, gallery, demos, and more...',
  className = ''
}) => {
  const [query, setQuery] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [searchHistory, setSearchHistory] = useState<SearchQuery[]>([]);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [filters, setFilters] = useState<SearchFilter>({
    category: 'all',
    type: 'all',
    dateRange: 'all',
    tags: []
  });
  const [sortBy, setSortBy] = useState<'relevance' | 'date' | 'popularity'>('relevance');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  
  const inputRef = useRef<HTMLInputElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  // Load search history from localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem('search-history');
    if (savedHistory) {
      try {
        const parsed = JSON.parse(savedHistory);
        setSearchHistory(parsed.map((item: any) => ({
          ...item,
          timestamp: new Date(item.timestamp)
        })));
      } catch (error) {
        console.error('Failed to parse search history:', error);
      }
    }
  }, []);

  // Save search history to localStorage
  const saveSearchHistory = useCallback((newQuery: SearchQuery) => {
    const updatedHistory = [newQuery, ...searchHistory.slice(0, 9)]; // Keep last 10
    setSearchHistory(updatedHistory);
    localStorage.setItem('search-history', JSON.stringify(updatedHistory));
  }, [searchHistory]);

  // Generate AI-powered suggestions
  const generateSuggestions = useCallback((searchQuery: string) => {
    if (!searchQuery.trim()) {
      // Show recent searches and popular queries when empty
      const recentSuggestions: SearchSuggestion[] = searchHistory.slice(0, 3).map(item => ({
        id: `recent-${item.id}`,
        text: item.query,
        type: 'query',
        confidence: 0.8,
        icon: <Clock className="w-4 h-4" />
      }));
      
      const popularSuggestions: SearchSuggestion[] = [
        {
          id: 'popular-1',
          text: 'AI art gallery',
          type: 'category',
          confidence: 0.9,
          icon: <Image className="w-4 h-4" />
        },
        {
          id: 'popular-2',
          text: 'React projects',
          type: 'filter',
          confidence: 0.85,
          icon: <Code className="w-4 h-4" />
        },
        {
          id: 'popular-3',
          text: 'Interactive demos',
          type: 'category',
          confidence: 0.8,
          icon: <Zap className="w-4 h-4" />
        }
      ];
      
      setSuggestions([...recentSuggestions, ...popularSuggestions]);
      return;
    }
    
    // AI-powered query suggestions based on input
    const aiSuggestions: SearchSuggestion[] = [];
    const lowerQuery = searchQuery.toLowerCase();
    
    // Project-related suggestions
    if (lowerQuery.includes('project') || lowerQuery.includes('code') || lowerQuery.includes('app')) {
      aiSuggestions.push({
        id: 'ai-project-1',
        text: `${searchQuery} with TypeScript`,
        type: 'query',
        confidence: 0.9,
        icon: <Code className="w-4 h-4" />
      });
      aiSuggestions.push({
        id: 'ai-project-2',
        text: `${searchQuery} React components`,
        type: 'query',
        confidence: 0.85,
        icon: <FileText className="w-4 h-4" />
      });
    }
    
    // AI art suggestions
    if (lowerQuery.includes('ai') || lowerQuery.includes('art') || lowerQuery.includes('image')) {
      aiSuggestions.push({
        id: 'ai-art-1',
        text: `${searchQuery} DALL-E generated`,
        type: 'query',
        confidence: 0.9,
        icon: <Image className="w-4 h-4" />
      });
      aiSuggestions.push({
        id: 'ai-art-2',
        text: `${searchQuery} Midjourney style`,
        type: 'query',
        confidence: 0.8,
        icon: <Sparkles className="w-4 h-4" />
      });
    }
    
    // Demo suggestions
    if (lowerQuery.includes('demo') || lowerQuery.includes('interactive') || lowerQuery.includes('live')) {
      aiSuggestions.push({
        id: 'ai-demo-1',
        text: `${searchQuery} playground`,
        type: 'query',
        confidence: 0.85,
        icon: <Zap className="w-4 h-4" />
      });
    }
    
    // Category suggestions
    const categories = ['projects', 'gallery', 'demos', 'blog'];
    categories.forEach(category => {
      if (category.includes(lowerQuery) || lowerQuery.includes(category)) {
        aiSuggestions.push({
          id: `category-${category}`,
          text: `Search in ${category}`,
          type: 'category',
          confidence: 0.95,
          icon: getCategoryIcon(category)
        });
      }
    });
    
    // Technology suggestions
    const technologies = ['React', 'TypeScript', 'Node.js', 'Python', 'AI/ML', 'WebGL', 'Three.js'];
    technologies.forEach(tech => {
      if (tech.toLowerCase().includes(lowerQuery) || lowerQuery.includes(tech.toLowerCase())) {
        aiSuggestions.push({
          id: `tech-${tech}`,
          text: `${tech} projects`,
          type: 'filter',
          confidence: 0.8,
          icon: <Tag className="w-4 h-4" />
        });
      }
    });
    
    setSuggestions(aiSuggestions.slice(0, 6)); // Limit to 6 suggestions
  }, [searchHistory]);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'projects':
        return <Code className="w-4 h-4" />;
      case 'gallery':
        return <Image className="w-4 h-4" />;
      case 'demos':
        return <Zap className="w-4 h-4" />;
      case 'blog':
        return <FileText className="w-4 h-4" />;
      default:
        return <Search className="w-4 h-4" />;
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      generateSuggestions(query);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [query, generateSuggestions]);

  const handleSearch = () => {
    if (!query.trim()) return;
    
    const searchQuery: SearchQuery = {
      id: Date.now().toString(),
      query: query.trim(),
      timestamp: new Date(),
      results: 0, // Will be updated by parent component
      category: filters.category !== 'all' ? filters.category : undefined
    };
    
    saveSearchHistory(searchQuery);
    onSearch(query.trim(), filters);
    setIsExpanded(false);
  };

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    if (suggestion.type === 'category') {
      setFilters(prev => ({ ...prev, category: suggestion.text.split(' ').pop() as any || 'all' }));
    } else if (suggestion.type === 'filter') {
      const tech = suggestion.text.split(' ')[0];
      setFilters(prev => ({ 
        ...prev, 
        tags: prev.tags.includes(tech) ? prev.tags : [...prev.tags, tech]
      }));
    } else {
      setQuery(suggestion.text);
    }
    
    onSuggestionSelect(suggestion);
    inputRef.current?.focus();
  };

  const clearFilters = () => {
    setFilters({
      category: 'all',
      type: 'all',
      dateRange: 'all',
      tags: []
    });
  };

  const removeTag = (tag: string) => {
    setFilters(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    } else if (e.key === 'Escape') {
      setIsExpanded(false);
      inputRef.current?.blur();
    }
  };

  const hasActiveFilters = filters.category !== 'all' || 
                          filters.type !== 'all' || 
                          filters.dateRange !== 'all' || 
                          filters.tags.length > 0;

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      {/* Main Search Input */}
      <div className="relative">
        <div className={`flex items-center bg-white/10 backdrop-blur-md border border-white/20 rounded-xl transition-all duration-300 ${
          isExpanded ? 'ring-2 ring-emerald-500/50' : 'hover:border-white/30'
        }`}>
          <div className="flex items-center flex-1">
            <div className="flex items-center pl-4">
              {isLoading ? (
                <Loader2 className="w-5 h-5 text-emerald-400 animate-spin" />
              ) : (
                <Search className="w-5 h-5 text-emerald-400" />
              )}
            </div>
            
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setIsExpanded(true)}
              onKeyPress={handleKeyPress}
              placeholder={placeholder}
              className="flex-1 bg-transparent text-white placeholder-gray-400 px-4 py-3 focus:outline-none"
            />
            
            {/* Active Filters Indicator */}
            {hasActiveFilters && (
              <div className="flex items-center gap-1 px-2">
                <div className="w-2 h-2 bg-emerald-400 rounded-full" />
                <span className="text-xs text-emerald-400">{filters.tags.length + (filters.category !== 'all' ? 1 : 0)}</span>
              </div>
            )}
            
            {/* Action Buttons */}
            <div className="flex items-center gap-1 pr-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`p-2 rounded-lg transition-colors ${
                  showFilters || hasActiveFilters
                    ? 'bg-emerald-500/20 text-emerald-300'
                    : 'text-gray-400 hover:text-white hover:bg-white/10'
                }`}
                title="Filters"
              >
                <Filter className="w-4 h-4" />
              </button>
              
              <button
                onClick={handleSearch}
                disabled={!query.trim() || isLoading}
                className="p-2 bg-emerald-500/20 text-emerald-300 rounded-lg hover:bg-emerald-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Search"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
        
        {/* Clear Query Button */}
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-20 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-white rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Expanded Search Panel */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl overflow-hidden z-50"
          >
            {/* Filters Panel */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: 'auto' }}
                  exit={{ height: 0 }}
                  className="border-b border-white/20 overflow-hidden"
                >
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Filter className="w-4 h-4 text-emerald-400" />
                        <span className="text-sm font-medium text-white">Search Filters</span>
                      </div>
                      
                      {hasActiveFilters && (
                        <button
                          onClick={clearFilters}
                          className="text-xs text-gray-400 hover:text-white transition-colors"
                        >
                          Clear all
                        </button>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Category Filter */}
                      <div>
                        <label className="block text-xs text-gray-400 mb-2">Category</label>
                        <select
                          value={filters.category}
                          onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value as any }))}
                          className="w-full bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500/50"
                        >
                          <option value="all">All Categories</option>
                          <option value="projects">Projects</option>
                          <option value="gallery">AI Gallery</option>
                          <option value="demos">Demos</option>
                          <option value="blog">Blog</option>
                        </select>
                      </div>
                      
                      {/* Type Filter */}
                      <div>
                        <label className="block text-xs text-gray-400 mb-2">Content Type</label>
                        <select
                          value={filters.type}
                          onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value as any }))}
                          className="w-full bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500/50"
                        >
                          <option value="all">All Types</option>
                          <option value="text">Text</option>
                          <option value="image">Images</option>
                          <option value="code">Code</option>
                          <option value="interactive">Interactive</option>
                        </select>
                      </div>
                      
                      {/* Date Range Filter */}
                      <div>
                        <label className="block text-xs text-gray-400 mb-2">Date Range</label>
                        <select
                          value={filters.dateRange}
                          onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value as any }))}
                          className="w-full bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500/50"
                        >
                          <option value="all">All Time</option>
                          <option value="week">Past Week</option>
                          <option value="month">Past Month</option>
                          <option value="year">Past Year</option>
                        </select>
                      </div>
                    </div>
                    
                    {/* Active Tags */}
                    {filters.tags.length > 0 && (
                      <div className="mt-4">
                        <label className="block text-xs text-gray-400 mb-2">Active Tags</label>
                        <div className="flex flex-wrap gap-2">
                          {filters.tags.map((tag) => (
                            <span
                              key={tag}
                              className="flex items-center gap-1 px-2 py-1 bg-emerald-500/20 text-emerald-300 rounded text-xs"
                            >
                              <Tag className="w-3 h-3" />
                              {tag}
                              <button
                                onClick={() => removeTag(tag)}
                                className="ml-1 hover:text-emerald-100"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Suggestions */}
            {suggestions.length > 0 && (
              <div className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Brain className="w-4 h-4 text-emerald-400" />
                  <span className="text-sm font-medium text-white">AI Suggestions</span>
                </div>
                
                <div className="space-y-1">
                  {suggestions.map((suggestion) => (
                    <button
                      key={suggestion.id}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="w-full flex items-center gap-3 p-2 text-left rounded-lg hover:bg-white/10 transition-colors group"
                    >
                      <div className="text-gray-400 group-hover:text-emerald-400 transition-colors">
                        {suggestion.icon}
                      </div>
                      
                      <div className="flex-1">
                        <span className="text-sm text-white group-hover:text-emerald-300 transition-colors">
                          {suggestion.text}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <div className="w-12 bg-white/10 rounded-full h-1">
                          <div 
                            className="h-full bg-emerald-400 rounded-full transition-all"
                            style={{ width: `${suggestion.confidence * 100}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-400">
                          {Math.round(suggestion.confidence * 100)}%
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {/* Search History */}
            {searchHistory.length > 0 && query === '' && (
              <div className="p-4 border-t border-white/20">
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-medium text-white">Recent Searches</span>
                </div>
                
                <div className="space-y-1">
                  {searchHistory.slice(0, 5).map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setQuery(item.query)}
                      className="w-full flex items-center gap-3 p-2 text-left rounded-lg hover:bg-white/10 transition-colors group"
                    >
                      <Clock className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
                      
                      <div className="flex-1">
                        <span className="text-sm text-white group-hover:text-emerald-300 transition-colors">
                          {item.query}
                        </span>
                      </div>
                      
                      <span className="text-xs text-gray-400">
                        {item.timestamp.toLocaleDateString()}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Backdrop */}
      {isExpanded && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsExpanded(false)}
        />
      )}
    </div>
  );
};

export default IntelligentSearch;