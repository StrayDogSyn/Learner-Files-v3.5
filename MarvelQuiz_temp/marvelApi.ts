import { MarvelApiResponse, MarvelCharacter, MarvelComic, MarvelSeries, CacheEntry, MarvelApiError } from '../types/marvel';

// Marvel API Client with authentication and caching
class MarvelApiClient {
  private baseUrl = 'https://gateway.marvel.com/v1/public';
  private publicKey: string;
  private privateKey: string;
  private cache = new Map<string, CacheEntry<any>>();
  private cacheDuration: number;

  constructor() {
    this.publicKey = import.meta.env.VITE_MARVEL_PUBLIC_KEY || '';
    this.privateKey = import.meta.env.MARVEL_PRIVATE_KEY || '';
    this.cacheDuration = parseInt(import.meta.env.VITE_MARVEL_CACHE_DURATION) || 3600000; // 1 hour default

    if (!this.publicKey) {
      console.warn('Marvel API public key not found. Please set VITE_MARVEL_PUBLIC_KEY in your environment variables.');
    }
  }

  // Generate MD5 hash for Marvel API authentication
  private async generateHash(timestamp: string): Promise<string> {
    const message = timestamp + this.privateKey + this.publicKey;
    const encoder = new TextEncoder();
    const data = encoder.encode(message);
    const hashBuffer = await crypto.subtle.digest('MD5', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  // Build authenticated URL with required parameters
  private async buildAuthenticatedUrl(endpoint: string, params: Record<string, string> = {}): Promise<string> {
    const timestamp = Date.now().toString();
    const hash = await this.generateHash(timestamp);
    
    const urlParams = new URLSearchParams({
      ts: timestamp,
      apikey: this.publicKey,
      hash,
      ...params
    });

    return `${this.baseUrl}${endpoint}?${urlParams.toString()}`;
  }

  // Cache management
  private getCachedData<T>(key: string): T | null {
    const cached = this.cache.get(key);
    if (cached && Date.now() < cached.expiresAt) {
      return cached.data;
    }
    this.cache.delete(key);
    return null;
  }

  private setCachedData<T>(key: string, data: T): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      expiresAt: Date.now() + this.cacheDuration
    });
  }

  // Generic API request method
  private async makeRequest<T>(endpoint: string, params: Record<string, string> = {}): Promise<MarvelApiResponse<T>> {
    const cacheKey = `${endpoint}_${JSON.stringify(params)}`;
    
    // Check cache first
    const cachedData = this.getCachedData<MarvelApiResponse<T>>(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    try {
      const url = await this.buildAuthenticatedUrl(endpoint, params);
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Marvel API request failed: ${response.status} ${response.statusText}`);
      }

      const data: MarvelApiResponse<T> = await response.json();
      
      if (data.code !== 200) {
        throw new Error(`Marvel API error: ${data.status}`);
      }

      // Cache successful response
      this.setCachedData(cacheKey, data);
      return data;
    } catch (error) {
      console.error('Marvel API request failed:', error);
      throw error;
    }
  }

  // Character methods
  async getCharacters(params: {
    limit?: number;
    offset?: number;
    name?: string;
    nameStartsWith?: string;
    orderBy?: string;
  } = {}): Promise<MarvelApiResponse<MarvelCharacter>> {
    const queryParams = {
      limit: (params.limit || 20).toString(),
      offset: (params.offset || 0).toString(),
      ...(params.name && { name: params.name }),
      ...(params.nameStartsWith && { nameStartsWith: params.nameStartsWith }),
      ...(params.orderBy && { orderBy: params.orderBy })
    };

    return this.makeRequest<MarvelCharacter>('/characters', queryParams);
  }

  async getCharacterById(id: number): Promise<MarvelApiResponse<MarvelCharacter>> {
    return this.makeRequest<MarvelCharacter>(`/characters/${id}`);
  }

  async getRandomCharacters(count: number = 10): Promise<MarvelCharacter[]> {
    try {
      // Get total character count first
      const initialResponse = await this.getCharacters({ limit: 1 });
      const totalCharacters = initialResponse.data.total;
      
      const characters: MarvelCharacter[] = [];
      const usedOffsets = new Set<number>();
      
      while (characters.length < count && usedOffsets.size < Math.min(count * 3, totalCharacters)) {
        const randomOffset = Math.floor(Math.random() * (totalCharacters - 20));
        
        if (!usedOffsets.has(randomOffset)) {
          usedOffsets.add(randomOffset);
          
          try {
            const response = await this.getCharacters({ 
              limit: 20, 
              offset: randomOffset,
              orderBy: 'name'
            });
            
            // Filter characters with good data quality
            const validCharacters = response.data.results.filter(char => 
              char.thumbnail && 
              char.thumbnail.path && 
              !char.thumbnail.path.includes('image_not_available') &&
              char.description &&
              char.description.length > 10
            );
            
            characters.push(...validCharacters.slice(0, count - characters.length));
          } catch (error) {
            console.warn(`Failed to fetch characters at offset ${randomOffset}:`, error);
          }
        }
      }
      
      return characters.slice(0, count);
    } catch (error) {
      console.error('Failed to get random characters:', error);
      return [];
    }
  }

  // Comic methods
  async getComics(params: {
    limit?: number;
    offset?: number;
    title?: string;
    titleStartsWith?: string;
    orderBy?: string;
    characters?: number[];
  } = {}): Promise<MarvelApiResponse<MarvelComic>> {
    const queryParams = {
      limit: (params.limit || 20).toString(),
      offset: (params.offset || 0).toString(),
      ...(params.title && { title: params.title }),
      ...(params.titleStartsWith && { titleStartsWith: params.titleStartsWith }),
      ...(params.orderBy && { orderBy: params.orderBy }),
      ...(params.characters && { characters: params.characters.join(',') })
    };

    return this.makeRequest<MarvelComic>('/comics', queryParams);
  }

  async getComicById(id: number): Promise<MarvelApiResponse<MarvelComic>> {
    return this.makeRequest<MarvelComic>(`/comics/${id}`);
  }

  // Series methods
  async getSeries(params: {
    limit?: number;
    offset?: number;
    title?: string;
    titleStartsWith?: string;
    orderBy?: string;
  } = {}): Promise<MarvelApiResponse<MarvelSeries>> {
    const queryParams = {
      limit: (params.limit || 20).toString(),
      offset: (params.offset || 0).toString(),
      ...(params.title && { title: params.title }),
      ...(params.titleStartsWith && { titleStartsWith: params.titleStartsWith }),
      ...(params.orderBy && { orderBy: params.orderBy })
    };

    return this.makeRequest<MarvelSeries>('/series', queryParams);
  }

  // Search methods
  async searchCharacters(query: string, limit: number = 10): Promise<MarvelCharacter[]> {
    try {
      const response = await this.getCharacters({
        nameStartsWith: query,
        limit,
        orderBy: 'name'
      });
      return response.data.results;
    } catch (error) {
      console.error('Character search failed:', error);
      return [];
    }
  }

  async searchComics(query: string, limit: number = 10): Promise<MarvelComic[]> {
    try {
      const response = await this.getComics({
        titleStartsWith: query,
        limit,
        orderBy: 'title'
      });
      return response.data.results;
    } catch (error) {
      console.error('Comic search failed:', error);
      return [];
    }
  }

  // Utility methods
  getImageUrl(thumbnail: { path: string; extension: string }, size: 'portrait_small' | 'portrait_medium' | 'portrait_xlarge' | 'standard_medium' | 'standard_large' | 'standard_xlarge' = 'standard_medium'): string {
    if (!thumbnail || !thumbnail.path) {
      return './placeholder-character.jpg';
    }
    
    // Handle image_not_available cases
    if (thumbnail.path.includes('image_not_available')) {
      return './placeholder-character.jpg';
    }
    
    return `${thumbnail.path}/${size}.${thumbnail.extension}`;
  }

  // Health check
  async testConnection(): Promise<boolean> {
    try {
      const response = await this.getCharacters({ limit: 1 });
      return response.code === 200;
    } catch (error) {
      console.error('Marvel API connection test failed:', error);
      return false;
    }
  }

  // Clear cache
  clearCache(): void {
    this.cache.clear();
  }

  // Get cache stats
  getCacheStats(): { size: number; entries: string[] } {
    return {
      size: this.cache.size,
      entries: Array.from(this.cache.keys())
    };
  }
}

// Export singleton instance
export const marvelApi = new MarvelApiClient();
export default marvelApi;

// Export error types for better error handling
export { MarvelApiError };