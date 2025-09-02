import { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  SearchQuery, 
  SearchResult, 
  SearchSuggestion, 
  SearchHistory, 
  SearchAnalytics,
  SearchableItem,
  SearchFilter,
  SearchSort,
  SearchFacet,
  AISearchFeatures
} from '../types/search';
import { SearchEngine } from '../lib/search-engine';
import { AnalyticsTracker } from '../lib/analytics-tracker';
import { ClaudeIntegration } from '../lib/claude-integration';
import searchIndexData from '../data/search-index.json';

interface UseSearchOptions {
  enableAnalytics?: boolean;
  enableAI?: boolean;
  enableHistory?: boolean;
  enableSuggestions?: boolean;
  debounceMs?: number;
  maxHistoryItems?: number;
  maxSuggestions?: number;
}

interface UseSearchReturn {
  // Search state
  query: string;
  results: SearchResult | null;
  suggestions: SearchSuggestion[];
  history: SearchHistory[];
  loading: boolean;
  error: string | null;
  
  // Search configuration
  filters: SearchFilter;
  sort: SearchSort;
  facets: SearchFacet[];
  
  // AI features
  aiFeatures: AISearchFeatures;
  semanticResults: SearchableItem[];
  intentDetection: string | null;
  queryExpansion: string[];
  
  // Actions
  setQuery: (query: string) => void;
  search: (query: string, options?: Partial<SearchQuery>) => Promise<void>;
  clearSearch: () => void;
  setFilters: (filters: Partial<SearchFilter>) => void;
  setSort: (sort: SearchSort) => void;
  
  // History management
  clearHistory: () => void;
  removeFromHistory: (id: string) => void;
  
  // Suggestions
  getSuggestions: (query: string) => Promise<SearchSuggestion[]>;
  getPopularQueries: () => string[];
  getTrendingQueries: () => string[];
  
  // AI-powered features
  askQuestion: (question: string) => Promise<string>;
  explainResults: (resultId: string) => Promise<string>;
  getRecommendations: (based?: 'history' | 'current' | 'popular') => Promise<SearchableItem[]>;
  
  // Analytics
  analytics: SearchAnalytics;
  trackInteraction: (type: string, data: any) => void;
  
  // Utilities
  highlightText: (text: string, query: string) => string;
  getResultById: (id: string) => SearchableItem | undefined;
  exportSearchData: () => any;
  importSearchData: (data: any) => void;
}

const defaultFilters: SearchFilter = {
  types: [],
  categories: [],
  tags: [],
  dateRange: undefined,
  qualityRange: undefined,
  featured: undefined
};

const defaultSort: SearchSort = {
  field: 'relevance',
  direction: 'desc'
};

const defaultAIFeatures: AISearchFeatures = {
  semanticSearch: true,
  intentDetection: true,
  queryExpansion: true,
  resultReranking: true,
  conversationalSearch: false,
  visualSearch: false
};

export const useSearch = (options: UseSearchOptions = {}): UseSearchReturn => {
  const {
    enableAnalytics = true,
    enableAI = true,
    enableHistory = true,
    enableSuggestions = true,
    debounceMs = 300,
    maxHistoryItems = 50,
    maxSuggestions = 10
  } = options;

  // State
  const [query, setQueryState] = useState('');
  const [results, setResults] = useState<SearchResult | null>(null);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [history, setHistory] = useState<SearchHistory[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Configuration
  const [filters, setFiltersState] = useState<SearchFilter>(defaultFilters);
  const [sort, setSortState] = useState<SearchSort>(defaultSort);
  const [facets, setFacets] = useState<SearchFacet[]>([]);
  
  // AI features
  const [aiFeatures, setAIFeatures] = useState<AISearchFeatures>(defaultAIFeatures);
  const [semanticResults, setSemanticResults] = useState<SearchableItem[]>([]);
  const [intentDetection, setIntentDetection] = useState<string | null>(null);
  const [queryExpansion, setQueryExpansion] = useState<string[]>([]);
  
  // Analytics
  const [analytics, setAnalytics] = useState<SearchAnalytics>({
    totalSearches: 0,
    uniqueQueries: 0,
    averageResultsPerQuery: 0,
    clickThroughRate: 0,
    popularQueries: [],
    recentQueries: [],
    queryMetrics: {},
    userBehavior: {
      averageSessionDuration: 0,
      queriesPerSession: 0,
      bounceRate: 0,
      conversionRate: 0
    },
    contentMetrics: {
      mostViewedItems: [],
      leastViewedItems: [],
      averageRelevanceScore: 0,
      contentGaps: []
    },
    performanceMetrics: {
      averageSearchTime: 0,
      indexSize: 0,
      cacheHitRate: 0,
      errorRate: 0
    }
  });

  // Initialize services
  const searchEngine = useMemo(() => new SearchEngine(), []);
  const analyticsTracker = useMemo(() => enableAnalytics ? new AnalyticsTracker() : null, [enableAnalytics]);
  const claudeIntegration = useMemo(() => enableAI ? new ClaudeIntegration() : null, [enableAI]);

  // Load initial data
  useEffect(() => {
    loadSearchIndex();
    if (enableHistory) {
      loadSearchHistory();
    }
  }, [enableHistory]);

  // Load search index
  const loadSearchIndex = async () => {
    try {
      const indexData = searchIndexData as any;
      
      // Index all searchable items
      if (indexData.searchableItems) {
        await searchEngine.indexItems(indexData.searchableItems);
      }
      
      // Load facets
      if (indexData.facets) {
        setFacets(indexData.facets);
      }
      
      // Load suggestions
      if (indexData.suggestions && enableSuggestions) {
        setSuggestions(indexData.suggestions.slice(0, maxSuggestions));
      }
    } catch (err) {
      console.error('Failed to load search index:', err);
      setError('Failed to initialize search. Please refresh the page.');
    }
  };

  // Load search history from localStorage
  const loadSearchHistory = () => {
    try {
      const savedHistory = localStorage.getItem('searchHistory');
      if (savedHistory) {
        const parsedHistory = JSON.parse(savedHistory);
        setHistory(parsedHistory.slice(0, maxHistoryItems));
      }
    } catch (err) {
      console.error('Failed to load search history:', err);
    }
  };

  // Save search history to localStorage
  const saveSearchHistory = useCallback((newHistory: SearchHistory[]) => {
    try {
      localStorage.setItem('searchHistory', JSON.stringify(newHistory));
    } catch (err) {
      console.error('Failed to save search history:', err);
    }
  }, []);

  // Debounced search effect
  useEffect(() => {
    if (!query.trim()) {
      setResults(null);
      setSemanticResults([]);
      setIntentDetection(null);
      setQueryExpansion([]);
      return;
    }

    const debounceTimer = setTimeout(() => {
      performSearch(query);
    }, debounceMs);

    return () => clearTimeout(debounceTimer);
  }, [query, filters, sort, debounceMs]);

  // Perform search
  const performSearch = async (searchQuery: string, options: Partial<SearchQuery> = {}) => {
    if (!searchQuery.trim()) return;

    try {
      setLoading(true);
      setError(null);

      const searchOptions: SearchQuery = {
        query: searchQuery,
        filters: { ...filters, ...options.filters },
        sort: options.sort || sort,
        pagination: options.pagination || { page: 1, limit: 20 },
        facets: options.facets || facets.map(f => f.field),
        highlighting: options.highlighting !== false,
        ...options
      };

      // Perform main search
      const searchResults = await searchEngine.search(searchQuery, searchOptions);
      setResults(searchResults);

      // AI-powered enhancements
      if (enableAI && claudeIntegration) {
        await enhanceSearchWithAI(searchQuery, searchResults);
      }

      // Add to search history
      if (enableHistory) {
        addToHistory(searchQuery, searchResults);
      }

      // Track analytics
      if (analyticsTracker) {
        analyticsTracker.trackSearch({
          query: searchQuery,
          resultsCount: searchResults.total,
          filters: searchOptions.filters,
          timestamp: Date.now()
        });
      }

      // Update analytics state
      updateAnalytics(searchQuery, searchResults);

    } catch (err) {
      console.error('Search failed:', err);
      setError('Search failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Enhance search with AI features
  const enhanceSearchWithAI = async (searchQuery: string, searchResults: SearchResult) => {
    if (!claudeIntegration) return;

    try {
      // Intent detection
      if (aiFeatures.intentDetection) {
        const intent = await claudeIntegration.detectSearchIntent(searchQuery);
        setIntentDetection(intent);
      }

      // Query expansion
      if (aiFeatures.queryExpansion) {
        const expansions = await claudeIntegration.expandQuery(searchQuery);
        setQueryExpansion(expansions);
      }

      // Semantic search
      if (aiFeatures.semanticSearch) {
        const semanticItems = await claudeIntegration.semanticSearch(searchQuery, searchResults.items);
        setSemanticResults(semanticItems);
      }

      // Result reranking
      if (aiFeatures.resultReranking && searchResults.items.length > 0) {
        const rerankedItems = await claudeIntegration.rerankResults(searchQuery, searchResults.items);
        setResults(prev => prev ? { ...prev, items: rerankedItems } : null);
      }
    } catch (err) {
      console.error('AI enhancement failed:', err);
      // Don't show error to user for AI features
    }
  };

  // Add search to history
  const addToHistory = (searchQuery: string, searchResults: SearchResult) => {
    const historyItem: SearchHistory = {
      id: `search-${Date.now()}`,
      query: searchQuery,
      timestamp: Date.now(),
      resultsCount: searchResults.total,
      filters: { ...filters },
      clicked: false
    };

    setHistory(prev => {
      const newHistory = [historyItem, ...prev.filter(h => h.query !== searchQuery)]
        .slice(0, maxHistoryItems);
      saveSearchHistory(newHistory);
      return newHistory;
    });
  };

  // Update analytics
  const updateAnalytics = (searchQuery: string, searchResults: SearchResult) => {
    setAnalytics(prev => ({
      ...prev,
      totalSearches: prev.totalSearches + 1,
      uniqueQueries: prev.uniqueQueries + (prev.recentQueries.includes(searchQuery) ? 0 : 1),
      recentQueries: [searchQuery, ...prev.recentQueries.filter(q => q !== searchQuery)].slice(0, 10),
      averageResultsPerQuery: ((prev.averageResultsPerQuery * (prev.totalSearches - 1)) + searchResults.total) / prev.totalSearches
    }));
  };

  // Action handlers
  const setQuery = useCallback((newQuery: string) => {
    setQueryState(newQuery);
  }, []);

  const search = useCallback(async (searchQuery: string, options: Partial<SearchQuery> = {}) => {
    setQueryState(searchQuery);
    await performSearch(searchQuery, options);
  }, []);

  const clearSearch = useCallback(() => {
    setQueryState('');
    setResults(null);
    setSemanticResults([]);
    setIntentDetection(null);
    setQueryExpansion([]);
    setError(null);
  }, []);

  const setFilters = useCallback((newFilters: Partial<SearchFilter>) => {
    setFiltersState(prev => ({ ...prev, ...newFilters }));
  }, []);

  const setSort = useCallback((newSort: SearchSort) => {
    setSortState(newSort);
  }, []);

  // History management
  const clearHistory = useCallback(() => {
    setHistory([]);
    localStorage.removeItem('searchHistory');
  }, []);

  const removeFromHistory = useCallback((id: string) => {
    setHistory(prev => {
      const newHistory = prev.filter(h => h.id !== id);
      saveSearchHistory(newHistory);
      return newHistory;
    });
  }, [saveSearchHistory]);

  // Get suggestions
  const getSuggestions = useCallback(async (searchQuery: string): Promise<SearchSuggestion[]> => {
    if (!searchQuery.trim()) return [];

    try {
      const suggestions = await searchEngine.getSuggestions(searchQuery, {
        limit: maxSuggestions,
        includeHistory: enableHistory,
        includePopular: true
      });
      return suggestions;
    } catch (err) {
      console.error('Failed to get suggestions:', err);
      return [];
    }
  }, [searchEngine, maxSuggestions, enableHistory]);

  const getPopularQueries = useCallback(() => {
    return analytics.popularQueries.slice(0, 10);
  }, [analytics.popularQueries]);

  const getTrendingQueries = useCallback(() => {
    // Get recent queries that are appearing frequently
    const recentCounts = analytics.recentQueries.reduce((acc, query) => {
      acc[query] = (acc[query] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(recentCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([query]) => query);
  }, [analytics.recentQueries]);

  // AI-powered features
  const askQuestion = useCallback(async (question: string): Promise<string> => {
    if (!claudeIntegration) {
      throw new Error('AI features are not enabled');
    }

    try {
      const answer = await claudeIntegration.answerQuestion(question, results?.items || []);
      
      // Track AI interaction
      if (analyticsTracker) {
        analyticsTracker.trackEvent({
          type: 'ai_question_asked',
          data: { question, hasAnswer: !!answer },
          timestamp: Date.now()
        });
      }

      return answer;
    } catch (err) {
      console.error('AI question failed:', err);
      throw new Error('Failed to get AI response. Please try again.');
    }
  }, [claudeIntegration, results, analyticsTracker]);

  const explainResults = useCallback(async (resultId: string): Promise<string> => {
    if (!claudeIntegration || !results) {
      throw new Error('AI features are not available');
    }

    const item = results.items.find(item => item.id === resultId);
    if (!item) {
      throw new Error('Result not found');
    }

    try {
      const explanation = await claudeIntegration.explainSearchResult(query, item);
      return explanation;
    } catch (err) {
      console.error('AI explanation failed:', err);
      throw new Error('Failed to generate explanation. Please try again.');
    }
  }, [claudeIntegration, results, query]);

  const getRecommendations = useCallback(async (based: 'history' | 'current' | 'popular' = 'current'): Promise<SearchableItem[]> => {
    if (!claudeIntegration) {
      throw new Error('AI features are not enabled');
    }

    try {
      let context: any = {};
      
      switch (based) {
        case 'history':
          context = { searchHistory: history.slice(0, 10) };
          break;
        case 'current':
          context = { currentQuery: query, currentResults: results?.items || [] };
          break;
        case 'popular':
          context = { popularQueries: analytics.popularQueries };
          break;
      }

      const recommendations = await claudeIntegration.getRecommendations(context);
      return recommendations;
    } catch (err) {
      console.error('AI recommendations failed:', err);
      return [];
    }
  }, [claudeIntegration, history, query, results, analytics.popularQueries]);

  // Track interaction
  const trackInteraction = useCallback((type: string, data: any) => {
    if (analyticsTracker) {
      analyticsTracker.trackEvent({
        type: `search_${type}`,
        data,
        timestamp: Date.now()
      });
    }

    // Update specific analytics based on interaction type
    if (type === 'result_clicked') {
      setAnalytics(prev => ({
        ...prev,
        clickThroughRate: (prev.clickThroughRate * prev.totalSearches + 1) / (prev.totalSearches + 1)
      }));

      // Mark history item as clicked
      setHistory(prev => prev.map(h => 
        h.query === query ? { ...h, clicked: true } : h
      ));
    }
  }, [analyticsTracker, query]);

  // Utilities
  const highlightText = useCallback((text: string, searchQuery: string): string => {
    if (!searchQuery.trim()) return text;
    
    const regex = new RegExp(`(${searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
  }, []);

  const getResultById = useCallback((id: string): SearchableItem | undefined => {
    return results?.items.find(item => item.id === id);
  }, [results]);

  const exportSearchData = useCallback(() => {
    return {
      history,
      analytics,
      preferences: {
        filters,
        sort,
        aiFeatures
      }
    };
  }, [history, analytics, filters, sort, aiFeatures]);

  const importSearchData = useCallback((data: any) => {
    if (data.history) {
      setHistory(data.history.slice(0, maxHistoryItems));
      saveSearchHistory(data.history);
    }
    if (data.analytics) {
      setAnalytics(data.analytics);
    }
    if (data.preferences) {
      if (data.preferences.filters) setFiltersState(data.preferences.filters);
      if (data.preferences.sort) setSortState(data.preferences.sort);
      if (data.preferences.aiFeatures) setAIFeatures(data.preferences.aiFeatures);
    }
  }, [maxHistoryItems, saveSearchHistory]);

  return {
    // Search state
    query,
    results,
    suggestions,
    history,
    loading,
    error,
    
    // Search configuration
    filters,
    sort,
    facets,
    
    // AI features
    aiFeatures,
    semanticResults,
    intentDetection,
    queryExpansion,
    
    // Actions
    setQuery,
    search,
    clearSearch,
    setFilters,
    setSort,
    
    // History management
    clearHistory,
    removeFromHistory,
    
    // Suggestions
    getSuggestions,
    getPopularQueries,
    getTrendingQueries,
    
    // AI-powered features
    askQuestion,
    explainResults,
    getRecommendations,
    
    // Analytics
    analytics,
    trackInteraction,
    
    // Utilities
    highlightText,
    getResultById,
    exportSearchData,
    importSearchData
  };
};

export default useSearch;