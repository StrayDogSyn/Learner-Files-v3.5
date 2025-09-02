import { claudeIntegration } from './claude-integration';
import { AIArtwork } from '../types/gallery';
import { EnhancedProject } from '../types/projects';

interface SearchableItem {
  id: string;
  type: 'project' | 'artwork' | 'demo' | 'page';
  title: string;
  description: string;
  content: string;
  tags: string[];
  category?: string;
  metadata?: Record<string, any>;
  url: string;
  lastModified: Date;
  searchScore?: number;
}

interface SearchQuery {
  query: string;
  filters?: {
    type?: string[];
    category?: string[];
    tags?: string[];
    dateRange?: {
      start: Date;
      end: Date;
    };
  };
  sort?: {
    field: 'relevance' | 'date' | 'popularity' | 'title';
    order: 'asc' | 'desc';
  };
  limit?: number;
  offset?: number;
}

interface SearchResult {
  item: SearchableItem;
  score: number;
  highlights: string[];
  matchedFields: string[];
  snippet: string;
}

interface SearchResponse {
  results: SearchResult[];
  total: number;
  query: string;
  processingTime: number;
  suggestions?: string[];
  facets?: Record<string, Array<{ value: string; count: number }>>;
  aiInsights?: {
    summary: string;
    relatedTopics: string[];
    recommendations: string[];
  };
}

interface SearchIndex {
  items: SearchableItem[];
  invertedIndex: Map<string, Set<string>>;
  ngramIndex: Map<string, Set<string>>;
  lastUpdated: Date;
}

interface SearchConfig {
  enableFuzzySearch: boolean;
  enableAIEnhancement: boolean;
  enableAutoComplete: boolean;
  enableSuggestions: boolean;
  maxResults: number;
  highlightLength: number;
  ngramSize: number;
  stopWords: string[];
  synonyms: Record<string, string[]>;
}

interface AutoCompleteResult {
  suggestion: string;
  type: 'query' | 'tag' | 'category' | 'title';
  score: number;
  count?: number;
}

interface SearchAnalytics {
  query: string;
  timestamp: Date;
  resultsCount: number;
  clickedResults: string[];
  processingTime: number;
  userId?: string;
  sessionId: string;
}

class SearchEngine {
  private index: SearchIndex;
  private config: SearchConfig;
  private searchHistory: SearchAnalytics[] = [];
  private popularQueries: Map<string, number> = new Map();
  private queryCache: Map<string, SearchResponse> = new Map();
  private cacheTimeout = 5 * 60 * 1000; // 5 minutes

  constructor(config: Partial<SearchConfig> = {}) {
    this.config = {
      enableFuzzySearch: true,
      enableAIEnhancement: true,
      enableAutoComplete: true,
      enableSuggestions: true,
      maxResults: 50,
      highlightLength: 150,
      ngramSize: 3,
      stopWords: ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by'],
      synonyms: {
        'ai': ['artificial intelligence', 'machine learning', 'ml'],
        'react': ['reactjs', 'react.js'],
        'javascript': ['js', 'ecmascript'],
        'typescript': ['ts'],
        'css': ['styles', 'styling'],
        'ui': ['user interface', 'interface'],
        'ux': ['user experience', 'experience']
      },
      ...config
    };

    this.index = {
      items: [],
      invertedIndex: new Map(),
      ngramIndex: new Map(),
      lastUpdated: new Date()
    };

    this.loadSearchHistory();
  }

  /**
   * Add items to the search index
   */
  async indexItems(items: SearchableItem[]): Promise<void> {
    console.log(`Indexing ${items.length} items...`);
    const startTime = performance.now();

    // Clear existing index
    this.index.items = [];
    this.index.invertedIndex.clear();
    this.index.ngramIndex.clear();

    // Process each item
    for (const item of items) {
      await this.indexItem(item);
    }

    this.index.lastUpdated = new Date();
    const processingTime = performance.now() - startTime;
    
    console.log(`Indexed ${items.length} items in ${processingTime.toFixed(2)}ms`);
    
    // Clear cache when index is updated
    this.queryCache.clear();
  }

  /**
   * Add projects to search index
   */
  async indexProjects(projects: EnhancedProject[]): Promise<void> {
    const searchableItems: SearchableItem[] = projects.map(project => ({
      id: project.id,
      type: 'project' as const,
      title: project.title,
      description: project.description,
      content: `${project.title} ${project.description} ${project.technologies.join(' ')} ${project.features?.join(' ') || ''}`,
      tags: [...project.technologies, ...(project.tags || [])],
      category: project.category,
      metadata: {
        technologies: project.technologies,
        complexity: project.analysis?.complexity,
        performance: project.analysis?.performance,
        github: project.github,
        demo: project.demo
      },
      url: `/projects/${project.id}`,
      lastModified: new Date(project.lastUpdated || Date.now())
    }));

    await this.indexItems(searchableItems);
  }

  /**
   * Add artworks to search index
   */
  async indexArtworks(artworks: AIArtwork[]): Promise<void> {
    const searchableItems: SearchableItem[] = artworks.map(artwork => ({
      id: artwork.id,
      type: 'artwork' as const,
      title: artwork.title,
      description: artwork.description,
      content: `${artwork.title} ${artwork.description} ${artwork.tags.join(' ')} ${artwork.style} ${artwork.model}`,
      tags: [...artwork.tags, artwork.style, artwork.model],
      category: artwork.style,
      metadata: {
        model: artwork.model,
        style: artwork.style,
        dimensions: artwork.dimensions,
        generationSettings: artwork.generationSettings
      },
      url: `/gallery/${artwork.id}`,
      lastModified: new Date(artwork.createdAt)
    }));

    const existingItems = this.index.items.filter(item => item.type !== 'artwork');
    await this.indexItems([...existingItems, ...searchableItems]);
  }

  /**
   * Perform a search
   */
  async search(query: SearchQuery): Promise<SearchResponse> {
    const startTime = performance.now();
    const cacheKey = JSON.stringify(query);

    // Check cache first
    const cached = this.queryCache.get(cacheKey);
    if (cached && Date.now() - cached.processingTime < this.cacheTimeout) {
      return cached;
    }

    try {
      // Normalize and expand query
      const expandedQuery = this.expandQuery(query.query);
      
      // Get base results
      let results = await this.performSearch(expandedQuery, query.filters);
      
      // Apply sorting
      results = this.sortResults(results, query.sort);
      
      // Apply pagination
      const total = results.length;
      const offset = query.offset || 0;
      const limit = Math.min(query.limit || this.config.maxResults, this.config.maxResults);
      results = results.slice(offset, offset + limit);
      
      // Generate suggestions and facets
      const suggestions = this.config.enableSuggestions ? await this.generateSuggestions(query.query) : [];
      const facets = this.generateFacets(this.index.items, query.filters);
      
      // Get AI insights if enabled
      let aiInsights;
      if (this.config.enableAIEnhancement && results.length > 0) {
        aiInsights = await this.generateAIInsights(query.query, results);
      }
      
      const processingTime = performance.now() - startTime;
      
      const response: SearchResponse = {
        results,
        total,
        query: query.query,
        processingTime,
        suggestions,
        facets,
        aiInsights
      };
      
      // Cache the response
      this.queryCache.set(cacheKey, response);
      
      // Track search analytics
      this.trackSearch({
        query: query.query,
        timestamp: new Date(),
        resultsCount: total,
        clickedResults: [],
        processingTime,
        sessionId: this.generateSessionId()
      });
      
      return response;
    } catch (error) {
      console.error('Search error:', error);
      return {
        results: [],
        total: 0,
        query: query.query,
        processingTime: performance.now() - startTime
      };
    }
  }

  /**
   * Get autocomplete suggestions
   */
  async getAutoComplete(partial: string, limit = 10): Promise<AutoCompleteResult[]> {
    if (!this.config.enableAutoComplete || partial.length < 2) {
      return [];
    }

    const suggestions: AutoCompleteResult[] = [];
    const normalizedPartial = this.normalizeText(partial);

    // Query suggestions from search history
    const queryMatches = Array.from(this.popularQueries.entries())
      .filter(([query]) => this.normalizeText(query).includes(normalizedPartial))
      .map(([query, count]) => ({
        suggestion: query,
        type: 'query' as const,
        score: count,
        count
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);

    suggestions.push(...queryMatches);

    // Title suggestions
    const titleMatches = this.index.items
      .filter(item => this.normalizeText(item.title).includes(normalizedPartial))
      .map(item => ({
        suggestion: item.title,
        type: 'title' as const,
        score: this.calculateRelevanceScore(normalizedPartial, item.title)
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);

    suggestions.push(...titleMatches);

    // Tag suggestions
    const allTags = new Set<string>();
    this.index.items.forEach(item => {
      item.tags.forEach(tag => allTags.add(tag));
    });

    const tagMatches = Array.from(allTags)
      .filter(tag => this.normalizeText(tag).includes(normalizedPartial))
      .map(tag => ({
        suggestion: tag,
        type: 'tag' as const,
        score: this.calculateRelevanceScore(normalizedPartial, tag)
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 2);

    suggestions.push(...tagMatches);

    return suggestions
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }

  /**
   * Get search suggestions based on current query
   */
  async getSearchSuggestions(query: string): Promise<string[]> {
    if (!query.trim()) {
      return this.getPopularQueries();
    }

    const suggestions: string[] = [];
    
    // Add related queries from history
    const relatedQueries = this.findRelatedQueries(query);
    suggestions.push(...relatedQueries);
    
    // Add AI-powered suggestions if enabled
    if (this.config.enableAIEnhancement) {
      try {
        const aiSuggestions = await claudeIntegration.generateSearchSuggestions({
          query,
          context: 'portfolio',
          maxSuggestions: 5
        });
        suggestions.push(...aiSuggestions);
      } catch (error) {
        console.warn('Failed to get AI suggestions:', error);
      }
    }
    
    // Remove duplicates and limit
    return [...new Set(suggestions)].slice(0, 8);
  }

  /**
   * Track search result click
   */
  trackResultClick(query: string, resultId: string): void {
    const recentSearch = this.searchHistory
      .reverse()
      .find(search => search.query === query);
    
    if (recentSearch) {
      recentSearch.clickedResults.push(resultId);
    }
  }

  /**
   * Get search analytics
   */
  getSearchAnalytics(): {
    totalSearches: number;
    popularQueries: Array<{ query: string; count: number }>;
    averageResultsPerQuery: number;
    clickThroughRate: number;
    recentSearches: SearchAnalytics[];
  } {
    const totalSearches = this.searchHistory.length;
    const popularQueries = Array.from(this.popularQueries.entries())
      .map(([query, count]) => ({ query, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
    
    const averageResultsPerQuery = totalSearches > 0 
      ? this.searchHistory.reduce((sum, search) => sum + search.resultsCount, 0) / totalSearches
      : 0;
    
    const totalClicks = this.searchHistory.reduce((sum, search) => sum + search.clickedResults.length, 0);
    const clickThroughRate = totalSearches > 0 ? totalClicks / totalSearches : 0;
    
    return {
      totalSearches,
      popularQueries,
      averageResultsPerQuery,
      clickThroughRate,
      recentSearches: this.searchHistory.slice(-20)
    };
  }

  // Private methods

  private async indexItem(item: SearchableItem): Promise<void> {
    this.index.items.push(item);
    
    // Create inverted index
    const tokens = this.tokenize(item.content);
    tokens.forEach(token => {
      if (!this.index.invertedIndex.has(token)) {
        this.index.invertedIndex.set(token, new Set());
      }
      this.index.invertedIndex.get(token)!.add(item.id);
    });
    
    // Create n-gram index for fuzzy search
    if (this.config.enableFuzzySearch) {
      const ngrams = this.generateNgrams(item.content, this.config.ngramSize);
      ngrams.forEach(ngram => {
        if (!this.index.ngramIndex.has(ngram)) {
          this.index.ngramIndex.set(ngram, new Set());
        }
        this.index.ngramIndex.get(ngram)!.add(item.id);
      });
    }
  }

  private async performSearch(query: string, filters?: SearchQuery['filters']): Promise<SearchResult[]> {
    const tokens = this.tokenize(query);
    const candidateIds = new Set<string>();
    
    // Find candidates using inverted index
    tokens.forEach(token => {
      const ids = this.index.invertedIndex.get(token);
      if (ids) {
        ids.forEach(id => candidateIds.add(id));
      }
    });
    
    // Add fuzzy matches if enabled
    if (this.config.enableFuzzySearch && candidateIds.size < 10) {
      const fuzzyIds = this.findFuzzyMatches(query);
      fuzzyIds.forEach(id => candidateIds.add(id));
    }
    
    // Filter candidates
    const candidates = this.index.items.filter(item => candidateIds.has(item.id));
    const filteredCandidates = this.applyFilters(candidates, filters);
    
    // Score and rank results
    const results: SearchResult[] = [];
    
    for (const item of filteredCandidates) {
      const score = this.calculateRelevanceScore(query, item.content);
      if (score > 0) {
        const highlights = this.generateHighlights(query, item.content);
        const matchedFields = this.findMatchedFields(query, item);
        const snippet = this.generateSnippet(item.content, query);
        
        results.push({
          item: { ...item, searchScore: score },
          score,
          highlights,
          matchedFields,
          snippet
        });
      }
    }
    
    return results.sort((a, b) => b.score - a.score);
  }

  private expandQuery(query: string): string {
    let expanded = query.toLowerCase();
    
    // Apply synonyms
    Object.entries(this.config.synonyms).forEach(([term, synonyms]) => {
      if (expanded.includes(term)) {
        expanded += ' ' + synonyms.join(' ');
      }
    });
    
    return expanded;
  }

  private tokenize(text: string): string[] {
    return this.normalizeText(text)
      .split(/\s+/)
      .filter(token => token.length > 1 && !this.config.stopWords.includes(token));
  }

  private normalizeText(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  private generateNgrams(text: string, n: number): string[] {
    const normalized = this.normalizeText(text);
    const ngrams: string[] = [];
    
    for (let i = 0; i <= normalized.length - n; i++) {
      ngrams.push(normalized.substr(i, n));
    }
    
    return ngrams;
  }

  private findFuzzyMatches(query: string): string[] {
    const queryNgrams = this.generateNgrams(query, this.config.ngramSize);
    const candidateScores = new Map<string, number>();
    
    queryNgrams.forEach(ngram => {
      const ids = this.index.ngramIndex.get(ngram);
      if (ids) {
        ids.forEach(id => {
          candidateScores.set(id, (candidateScores.get(id) || 0) + 1);
        });
      }
    });
    
    // Return candidates with sufficient n-gram overlap
    const threshold = Math.max(1, Math.floor(queryNgrams.length * 0.3));
    return Array.from(candidateScores.entries())
      .filter(([, score]) => score >= threshold)
      .map(([id]) => id);
  }

  private applyFilters(items: SearchableItem[], filters?: SearchQuery['filters']): SearchableItem[] {
    if (!filters) return items;
    
    return items.filter(item => {
      if (filters.type && !filters.type.includes(item.type)) return false;
      if (filters.category && item.category && !filters.category.includes(item.category)) return false;
      if (filters.tags && !filters.tags.some(tag => item.tags.includes(tag))) return false;
      if (filters.dateRange) {
        const itemDate = item.lastModified;
        if (itemDate < filters.dateRange.start || itemDate > filters.dateRange.end) return false;
      }
      return true;
    });
  }

  private calculateRelevanceScore(query: string, content: string): number {
    const queryTokens = this.tokenize(query);
    const contentTokens = this.tokenize(content);
    
    if (queryTokens.length === 0 || contentTokens.length === 0) return 0;
    
    let score = 0;
    const contentSet = new Set(contentTokens);
    
    // Exact matches
    queryTokens.forEach(token => {
      if (contentSet.has(token)) {
        score += 2;
      }
    });
    
    // Partial matches
    queryTokens.forEach(queryToken => {
      contentTokens.forEach(contentToken => {
        if (contentToken.includes(queryToken) || queryToken.includes(contentToken)) {
          score += 0.5;
        }
      });
    });
    
    // Normalize by content length
    return score / Math.log(contentTokens.length + 1);
  }

  private generateHighlights(query: string, content: string): string[] {
    const queryTokens = this.tokenize(query);
    const highlights: string[] = [];
    
    queryTokens.forEach(token => {
      const regex = new RegExp(`\\b${token}\\b`, 'gi');
      const matches = content.match(regex);
      if (matches) {
        highlights.push(...matches);
      }
    });
    
    return [...new Set(highlights)];
  }

  private findMatchedFields(query: string, item: SearchableItem): string[] {
    const queryTokens = this.tokenize(query);
    const matchedFields: string[] = [];
    
    const fields = {
      title: item.title,
      description: item.description,
      tags: item.tags.join(' '),
      category: item.category || ''
    };
    
    Object.entries(fields).forEach(([field, value]) => {
      const fieldTokens = this.tokenize(value);
      if (queryTokens.some(token => fieldTokens.includes(token))) {
        matchedFields.push(field);
      }
    });
    
    return matchedFields;
  }

  private generateSnippet(content: string, query: string): string {
    const queryTokens = this.tokenize(query);
    const sentences = content.split(/[.!?]+/);
    
    // Find sentence with most query matches
    let bestSentence = sentences[0] || '';
    let maxMatches = 0;
    
    sentences.forEach(sentence => {
      const sentenceTokens = this.tokenize(sentence);
      const matches = queryTokens.filter(token => sentenceTokens.includes(token)).length;
      if (matches > maxMatches) {
        maxMatches = matches;
        bestSentence = sentence;
      }
    });
    
    // Truncate if too long
    if (bestSentence.length > this.config.highlightLength) {
      bestSentence = bestSentence.substr(0, this.config.highlightLength) + '...';
    }
    
    return bestSentence.trim();
  }

  private sortResults(results: SearchResult[], sort?: SearchQuery['sort']): SearchResult[] {
    if (!sort) return results;
    
    const { field, order } = sort;
    const multiplier = order === 'desc' ? -1 : 1;
    
    return results.sort((a, b) => {
      let comparison = 0;
      
      switch (field) {
        case 'relevance':
          comparison = a.score - b.score;
          break;
        case 'date':
          comparison = a.item.lastModified.getTime() - b.item.lastModified.getTime();
          break;
        case 'title':
          comparison = a.item.title.localeCompare(b.item.title);
          break;
        case 'popularity':
          // Could be based on view count, likes, etc.
          comparison = 0;
          break;
      }
      
      return comparison * multiplier;
    });
  }

  private async generateSuggestions(query: string): Promise<string[]> {
    const suggestions: string[] = [];
    
    // Add popular related queries
    const related = this.findRelatedQueries(query);
    suggestions.push(...related.slice(0, 3));
    
    // Add tag-based suggestions
    const queryTokens = this.tokenize(query);
    const relatedTags = new Set<string>();
    
    this.index.items.forEach(item => {
      const itemTokens = this.tokenize(item.content);
      if (queryTokens.some(token => itemTokens.includes(token))) {
        item.tags.forEach(tag => relatedTags.add(tag));
      }
    });
    
    suggestions.push(...Array.from(relatedTags).slice(0, 2));
    
    return [...new Set(suggestions)];
  }

  private generateFacets(items: SearchableItem[], filters?: SearchQuery['filters']): Record<string, Array<{ value: string; count: number }>> {
    const facets: Record<string, Array<{ value: string; count: number }>> = {};
    
    // Type facets
    const typeCounts = new Map<string, number>();
    items.forEach(item => {
      typeCounts.set(item.type, (typeCounts.get(item.type) || 0) + 1);
    });
    facets.type = Array.from(typeCounts.entries()).map(([value, count]) => ({ value, count }));
    
    // Category facets
    const categoryCounts = new Map<string, number>();
    items.forEach(item => {
      if (item.category) {
        categoryCounts.set(item.category, (categoryCounts.get(item.category) || 0) + 1);
      }
    });
    facets.category = Array.from(categoryCounts.entries()).map(([value, count]) => ({ value, count }));
    
    // Tag facets (top 10)
    const tagCounts = new Map<string, number>();
    items.forEach(item => {
      item.tags.forEach(tag => {
        tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
      });
    });
    facets.tags = Array.from(tagCounts.entries())
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([value, count]) => ({ value, count }));
    
    return facets;
  }

  private async generateAIInsights(query: string, results: SearchResult[]): Promise<{
    summary: string;
    relatedTopics: string[];
    recommendations: string[];
  }> {
    try {
      const resultTitles = results.slice(0, 5).map(r => r.item.title);
      const insights = await claudeIntegration.analyzeSearchResults(query, resultTitles);
      
      return {
        summary: insights.summary || `Found ${results.length} results related to "${query}".`,
        relatedTopics: insights.relatedTopics || [],
        recommendations: insights.recommendations || []
      };
    } catch (error) {
      console.warn('Failed to generate AI insights:', error);
      return {
        summary: `Found ${results.length} results for "${query}".`,
        relatedTopics: [],
        recommendations: []
      };
    }
  }

  private findRelatedQueries(query: string): string[] {
    const queryTokens = this.tokenize(query);
    const related: Array<{ query: string; score: number }> = [];
    
    this.popularQueries.forEach((count, historicalQuery) => {
      if (historicalQuery === query) return;
      
      const historicalTokens = this.tokenize(historicalQuery);
      const commonTokens = queryTokens.filter(token => historicalTokens.includes(token));
      
      if (commonTokens.length > 0) {
        const score = (commonTokens.length / Math.max(queryTokens.length, historicalTokens.length)) * count;
        related.push({ query: historicalQuery, score });
      }
    });
    
    return related
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
      .map(r => r.query);
  }

  private getPopularQueries(): string[] {
    return Array.from(this.popularQueries.entries())
      .sort(([, a], [, b]) => b - a)
      .slice(0, 8)
      .map(([query]) => query);
  }

  private trackSearch(analytics: SearchAnalytics): void {
    this.searchHistory.push(analytics);
    
    // Update popular queries
    const currentCount = this.popularQueries.get(analytics.query) || 0;
    this.popularQueries.set(analytics.query, currentCount + 1);
    
    // Limit history size
    if (this.searchHistory.length > 1000) {
      this.searchHistory = this.searchHistory.slice(-500);
    }
    
    // Save to localStorage
    this.saveSearchHistory();
  }

  private loadSearchHistory(): void {
    try {
      const stored = localStorage.getItem('search_history');
      if (stored) {
        const data = JSON.parse(stored);
        this.searchHistory = data.history || [];
        this.popularQueries = new Map(data.popularQueries || []);
      }
    } catch (error) {
      console.warn('Failed to load search history:', error);
    }
  }

  private saveSearchHistory(): void {
    try {
      const data = {
        history: this.searchHistory.slice(-100), // Keep last 100 searches
        popularQueries: Array.from(this.popularQueries.entries())
      };
      localStorage.setItem('search_history', JSON.stringify(data));
    } catch (error) {
      console.warn('Failed to save search history:', error);
    }
  }

  private generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

// Export singleton instance
export const searchEngine = new SearchEngine();

// Export class for custom instances
export { SearchEngine };

// Export types
export type {
  SearchableItem,
  SearchQuery,
  SearchResult,
  SearchResponse,
  SearchIndex,
  SearchConfig,
  AutoCompleteResult,
  SearchAnalytics
};