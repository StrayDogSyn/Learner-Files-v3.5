import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Sparkles, Clock, TrendingUp } from 'lucide-react';

interface ProjectSearchProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  isLoading?: boolean;
}

interface SearchSuggestion {
  id: string;
  text: string;
  type: 'recent' | 'popular' | 'ai';
  count?: number;
}

const ProjectSearch: React.FC<ProjectSearchProps> = ({
  searchQuery,
  onSearchChange,
  isLoading = false
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('projectSearchHistory');
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch (error) {
        console.error('Failed to parse search history:', error);
      }
    }
  }, []);

  // Save search to history
  const saveSearch = (query: string) => {
    if (query.trim().length < 2) return;
    
    const updated = [query, ...recentSearches.filter(s => s !== query)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('projectSearchHistory', JSON.stringify(updated));
  };

  // Generate AI-powered suggestions
  const generateSuggestions = (query: string) => {
    const suggestions: SearchSuggestion[] = [];
    
    // Recent searches
    if (query.length === 0) {
      recentSearches.forEach((search, index) => {
        suggestions.push({
          id: `recent-${index}`,
          text: search,
          type: 'recent'
        });
      });
    }
    
    // Popular searches (simulated)
    const popularTerms = [
      { term: 'React', count: 15 },
      { term: 'TypeScript', count: 12 },
      { term: 'AI', count: 8 },
      { term: 'Full Stack', count: 6 },
      { term: 'Machine Learning', count: 5 }
    ];
    
    if (query.length === 0) {
      popularTerms.forEach((item, index) => {
        suggestions.push({
          id: `popular-${index}`,
          text: item.term,
          type: 'popular',
          count: item.count
        });
      });
    }
    
    // AI-powered suggestions based on query
    if (query.length > 0) {
      const aiSuggestions = [
        `${query} projects`,
        `${query} with TypeScript`,
        `${query} full stack`,
        `${query} AI integration`,
        `${query} performance optimization`
      ].filter(suggestion => 
        suggestion.toLowerCase() !== query.toLowerCase()
      );
      
      aiSuggestions.forEach((suggestion, index) => {
        suggestions.push({
          id: `ai-${index}`,
          text: suggestion,
          type: 'ai'
        });
      });
    }
    
    return suggestions.slice(0, 8);
  };

  // Update suggestions when query or focus changes
  useEffect(() => {
    if (isFocused) {
      setSuggestions(generateSuggestions(searchQuery));
    }
  }, [searchQuery, isFocused, recentSearches]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    onSearchChange(value);
    
    // Debounce AI suggestions
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    searchTimeoutRef.current = setTimeout(() => {
      if (value.trim()) {
        // Here you could call an AI service for better suggestions
        setSuggestions(generateSuggestions(value));
      }
    }, 300);
  };

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    onSearchChange(suggestion.text);
    saveSearch(suggestion.text);
    setIsFocused(false);
    inputRef.current?.blur();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      saveSearch(searchQuery.trim());
      setIsFocused(false);
      inputRef.current?.blur();
    }
  };

  const clearSearch = () => {
    onSearchChange('');
    inputRef.current?.focus();
  };

  const getSuggestionIcon = (type: SearchSuggestion['type']) => {
    switch (type) {
      case 'recent':
        return <Clock className="w-4 h-4 text-gray-400" />;
      case 'popular':
        return <TrendingUp className="w-4 h-4 text-blue-400" />;
      case 'ai':
        return <Sparkles className="w-4 h-4 text-emerald-400" />;
      default:
        return <Search className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <div className="relative">
      {/* Search Input */}
      <form onSubmit={handleSubmit} className="relative">
        <div className={`relative flex items-center bg-white/10 backdrop-blur-md border border-white/20 rounded-lg transition-all duration-300 ${
          isFocused ? 'ring-2 ring-emerald-500/50 bg-white/15' : 'hover:bg-white/15'
        }`}>
          <Search className={`w-5 h-5 ml-4 transition-colors duration-200 ${
            isFocused ? 'text-emerald-400' : 'text-gray-400'
          }`} />
          
          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={handleInputChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 200)}
            placeholder="Search projects by name, technology, or description..."
            className="flex-1 px-4 py-3 bg-transparent text-white placeholder-gray-400 focus:outline-none"
          />
          
          {/* Loading Spinner */}
          {isLoading && (
            <div className="mr-4">
              <div className="w-5 h-5 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
            </div>
          )}
          
          {/* Clear Button */}
          {searchQuery && !isLoading && (
            <button
              type="button"
              onClick={clearSearch}
              className="mr-4 p-1 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </form>

      {/* Search Suggestions Dropdown */}
      <AnimatePresence>
        {isFocused && suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-2xl z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="p-3 border-b border-white/10">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-300">
                  {searchQuery ? 'Suggestions' : 'Recent & Popular'}
                </span>
                {searchQuery && (
                  <div className="flex items-center gap-1 text-xs text-emerald-400">
                    <Sparkles className="w-3 h-3" />
                    AI-Powered
                  </div>
                )}
              </div>
            </div>

            {/* Suggestions List */}
            <div className="max-h-64 overflow-y-auto">
              {suggestions.map((suggestion, index) => (
                <motion.button
                  key={suggestion.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-white/10 transition-colors group"
                >
                  {getSuggestionIcon(suggestion.type)}
                  
                  <div className="flex-1">
                    <div className="text-white group-hover:text-emerald-300 transition-colors">
                      {suggestion.text}
                    </div>
                    {suggestion.type === 'recent' && (
                      <div className="text-xs text-gray-400">Recent search</div>
                    )}
                    {suggestion.type === 'popular' && suggestion.count && (
                      <div className="text-xs text-gray-400">
                        {suggestion.count} projects match
                      </div>
                    )}
                    {suggestion.type === 'ai' && (
                      <div className="text-xs text-emerald-400">AI suggestion</div>
                    )}
                  </div>
                  
                  {suggestion.type === 'popular' && suggestion.count && (
                    <div className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded-full">
                      {suggestion.count}
                    </div>
                  )}
                </motion.button>
              ))}
            </div>

            {/* Footer */}
            <div className="p-3 border-t border-white/10 text-center">
              <div className="text-xs text-gray-400">
                Press <kbd className="px-1 py-0.5 bg-white/10 rounded text-xs">Enter</kbd> to search
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search Tips */}
      {isFocused && suggestions.length === 0 && searchQuery.length === 0 && recentSearches.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute top-full left-0 right-0 mt-2 p-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl z-50"
        >
          <div className="text-center">
            <Sparkles className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
            <h3 className="text-white font-medium mb-2">AI-Powered Search</h3>
            <p className="text-sm text-gray-300 mb-3">
              Search by project name, technology, description, or even ask questions like:
            </p>
            <div className="space-y-1 text-xs text-gray-400">
              <div>• "React projects with TypeScript"</div>
              <div>• "AI and machine learning"</div>
              <div>• "Full stack applications"</div>
              <div>• "High performance projects"</div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ProjectSearch;