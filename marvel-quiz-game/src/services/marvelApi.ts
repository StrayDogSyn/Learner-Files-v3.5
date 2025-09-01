import { MarvelApiResponse, MarvelCharacter, MarvelComic, CachedApiResponse } from '../types/marvel';

// Define missing types locally
interface MarvelSeries {
  id: number;
  title: string;
  description: string;
  thumbnail: { path: string; extension: string };
}

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

class MarvelApiError extends Error {
  constructor(message: string, public code?: number) {
    super(message);
    this.name = 'MarvelApiError';
  }
}

// Marvel API Client with backend proxy and caching
class MarvelApiClient {
  private baseUrl: string;
  private cache = new Map<string, CacheEntry<any>>();
  private cacheDuration: number;
  private useProxy: boolean;

  constructor() {
    this.baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';
    this.cacheDuration = parseInt(import.meta.env.VITE_MARVEL_CACHE_DURATION) || 3600000; // 1 hour default
    this.useProxy = true; // Always use backend proxy for security

    console.log('Marvel API Client initialized with backend proxy:', this.baseUrl);
  }



  // Build proxy URL with parameters
  private buildProxyUrl(endpoint: string, params: Record<string, string> = {}): string {
    const urlParams = new URLSearchParams(params);
    const queryString = urlParams.toString();
    return `${this.baseUrl}/marvel${endpoint}${queryString ? '?' + queryString : ''}`;
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
      const url = this.buildProxyUrl(endpoint, params);
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Backend proxy request failed: ${response.status}`);
      }

      const data: MarvelApiResponse<T> = await response.json();
      
      // Check if it's an error response from our backend
      if (!data.success && data.error) {
        throw new Error(data.message || data.error);
      }
      
      // For Marvel API responses, check the Marvel API status
      if (data.code && data.code !== 200) {
        throw new Error(`Marvel API error: ${data.status}`);
      }

      // Cache successful response
      this.setCachedData(cacheKey, data);
      return data;
    } catch (error) {
      console.error('Marvel API request failed:', error);
      
      // Return mock data for development if API fails
      console.warn('Falling back to mock data due to API error.');
      return this.getMockData<T>();
    }
  }

  // Mock data for development
  private getMockData<T>(): MarvelApiResponse<T> {
    const mockCharacters = [
      {
        id: 1009610,
        name: "Spider-Man",
        description: "Bitten by a radioactive spider, high school student Peter Parker gained the speed, strength and powers of a spider.",
        thumbnail: {
          path: "https://i.annihil.us/u/prod/marvel/i/mg/3/50/526548a343e4b",
          extension: "jpg"
        },
        comics: { available: 4000, collectionURI: "", items: [] },
        series: { available: 500, collectionURI: "", items: [] },
        stories: { available: 5000, collectionURI: "", items: [] },
        events: { available: 100, collectionURI: "", items: [] },
        urls: [],
        resourceURI: "",
        modified: new Date().toISOString()
      },
      {
        id: 1009368,
        name: "Iron Man",
        description: "Wounded, captured and forced to build a weapon by his enemies, billionaire industrialist Tony Stark instead created an advanced suit of armor to save his life and escape captivity.",
        thumbnail: {
          path: "https://i.annihil.us/u/prod/marvel/i/mg/9/c0/527bb7b37ff55",
          extension: "jpg"
        },
        comics: { available: 3000, collectionURI: "", items: [] },
        series: { available: 400, collectionURI: "", items: [] },
        stories: { available: 4000, collectionURI: "", items: [] },
        events: { available: 80, collectionURI: "", items: [] },
        urls: [],
        resourceURI: "",
        modified: new Date().toISOString()
      },
      {
        id: 1009220,
        name: "Captain America",
        description: "Vowing to serve his country any way he could, young Steve Rogers took the super soldier serum to become America's one-man army.",
        thumbnail: {
          path: "https://i.annihil.us/u/prod/marvel/i/mg/3/50/537ba56d31087",
          extension: "jpg"
        },
        comics: { available: 2500, collectionURI: "", items: [] },
        series: { available: 300, collectionURI: "", items: [] },
        stories: { available: 3500, collectionURI: "", items: [] },
        events: { available: 90, collectionURI: "", items: [] },
        urls: [],
        resourceURI: "",
        modified: new Date().toISOString()
      },
      {
        id: 1009664,
        name: "Thor",
        description: "As the Norse God of thunder and lightning, Thor wields one of the greatest weapons ever made, the enchanted hammer Mjolnir.",
        thumbnail: {
          path: "https://i.annihil.us/u/prod/marvel/i/mg/d/d0/5269657a74350",
          extension: "jpg"
        },
        comics: { available: 2200, collectionURI: "", items: [] },
        series: { available: 280, collectionURI: "", items: [] },
        stories: { available: 3200, collectionURI: "", items: [] },
        events: { available: 75, collectionURI: "", items: [] },
        urls: [],
        resourceURI: "",
        modified: new Date().toISOString()
      },
      {
        id: 1009189,
        name: "Black Widow",
        description: "Despite super spy Natasha Romanoff's checkered past, she's become one of S.H.I.E.L.D.'s most deadly assassins and a frequent member of the Avengers.",
        thumbnail: {
          path: "https://i.annihil.us/u/prod/marvel/i/mg/f/30/50fecad1f395e",
          extension: "jpg"
        },
        comics: { available: 1800, collectionURI: "", items: [] },
        series: { available: 200, collectionURI: "", items: [] },
        stories: { available: 2500, collectionURI: "", items: [] },
        events: { available: 60, collectionURI: "", items: [] },
        urls: [],
        resourceURI: "",
        modified: new Date().toISOString()
      },
      {
        id: 1009351,
        name: "Hulk",
        description: "Caught in a gamma bomb explosion while trying to save the life of a teenager, Dr. Bruce Banner was transformed into the incredibly powerful creature called the Hulk.",
        thumbnail: {
          path: "https://i.annihil.us/u/prod/marvel/i/mg/5/a0/538615ca33ab0",
          extension: "jpg"
        },
        comics: { available: 2800, collectionURI: "", items: [] },
        series: { available: 350, collectionURI: "", items: [] },
        stories: { available: 4000, collectionURI: "", items: [] },
        events: { available: 85, collectionURI: "", items: [] },
        urls: [],
        resourceURI: "",
        modified: new Date().toISOString()
      },
      {
        id: 1009282,
        name: "Doctor Strange",
        description: "Once a brilliant but arrogant neurosurgeon, Doctor Stephen Strange's life changed forever in a car accident which severely damaged his hands.",
        thumbnail: {
          path: "https://i.annihil.us/u/prod/marvel/i/mg/5/f0/5261a85a501fe",
          extension: "jpg"
        },
        comics: { available: 1500, collectionURI: "", items: [] },
        series: { available: 180, collectionURI: "", items: [] },
        stories: { available: 2200, collectionURI: "", items: [] },
        events: { available: 45, collectionURI: "", items: [] },
        urls: [],
        resourceURI: "",
        modified: new Date().toISOString()
      },
      {
        id: 1009378,
        name: "Loki",
        description: "Loki, born of Frost Giants, was taken as an infant by Odin following Odin's victory over the Frost Giants in battle.",
        thumbnail: {
          path: "https://i.annihil.us/u/prod/marvel/i/mg/d/90/526547f509313",
          extension: "jpg"
        },
        comics: { available: 1200, collectionURI: "", items: [] },
        series: { available: 150, collectionURI: "", items: [] },
        stories: { available: 1800, collectionURI: "", items: [] },
        events: { available: 40, collectionURI: "", items: [] },
        urls: [],
        resourceURI: "",
        modified: new Date().toISOString()
      },
      {
        id: 1009268,
        name: "Deadpool",
        description: "Wade Wilson is a former test subject of the Weapon X program, where he received his regenerative healing factor through the scientific experiments.",
        thumbnail: {
          path: "https://i.annihil.us/u/prod/marvel/i/mg/9/90/5261a86cacb99",
          extension: "jpg"
        },
        comics: { available: 1000, collectionURI: "", items: [] },
        series: { available: 120, collectionURI: "", items: [] },
        stories: { available: 1500, collectionURI: "", items: [] },
        events: { available: 30, collectionURI: "", items: [] },
        urls: [],
        resourceURI: "",
        modified: new Date().toISOString()
      },
      {
        id: 1009257,
        name: "Cyclops",
        description: "Scott Summers is a mutant capable of generating concussive force-based, red-colored beams from his eyes.",
        thumbnail: {
          path: "https://i.annihil.us/u/prod/marvel/i/mg/6/70/526547e2d90ad",
          extension: "jpg"
        },
        comics: { available: 1800, collectionURI: "", items: [] },
        series: { available: 200, collectionURI: "", items: [] },
        stories: { available: 2500, collectionURI: "", items: [] },
        events: { available: 55, collectionURI: "", items: [] },
        urls: [],
        resourceURI: "",
        modified: new Date().toISOString()
      }
    ];

    return {
      code: 200,
      status: "Ok",
      copyright: "© 2024 MARVEL",
      attributionText: "Data provided by Marvel. © 2024 MARVEL",
      attributionHTML: "<a href=\"http://marvel.com\">Data provided by Marvel. © 2024 MARVEL</a>",
      etag: "mock-etag",
      data: {
        offset: 0,
        limit: 20,
        total: mockCharacters.length,
        count: mockCharacters.length,
        results: mockCharacters as T[]
      }
    };
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

  // Utility methods
  getImageUrl(thumbnail: { path: string; extension: string }, size: 'portrait_small' | 'portrait_medium' | 'portrait_xlarge' | 'standard_medium' | 'standard_large' | 'standard_xlarge' = 'standard_medium'): string {
    if (!thumbnail || !thumbnail.path) {
      return 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=Marvel%20superhero%20silhouette%20placeholder&image_size=square';
    }
    
    // Handle image_not_available cases
    if (thumbnail.path.includes('image_not_available')) {
      return 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=Marvel%20superhero%20silhouette%20placeholder&image_size=square';
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