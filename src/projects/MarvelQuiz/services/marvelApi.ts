import CryptoJS from 'crypto-js';

interface MarvelCharacter {
  id: number;
  name: string;
  description: string;
  thumbnail: {
    path: string;
    extension: string;
  };
  comics: {
    available: number;
    items: Array<{
      resourceURI: string;
      name: string;
    }>;
  };
  series: {
    available: number;
    items: Array<{
      resourceURI: string;
      name: string;
    }>;
  };
  stories: {
    available: number;
    items: Array<{
      resourceURI: string;
      name: string;
      type: string;
    }>;
  };
  events: {
    available: number;
    items: Array<{
      resourceURI: string;
      name: string;
    }>;
  };
  urls: Array<{
    type: string;
    url: string;
  }>;
}

interface MarvelApiResponse {
  code: number;
  status: string;
  copyright: string;
  attributionText: string;
  attributionHTML: string;
  etag: string;
  data: {
    offset: number;
    limit: number;
    total: number;
    count: number;
    results: MarvelCharacter[];
  };
}

class MarvelApiService {
  private readonly baseUrl: string;
  private readonly publicKey: string;
  private readonly privateKey: string;

  constructor() {
    this.baseUrl = import.meta.env.VITE_MARVEL_BASE_URL || 'https://gateway.marvel.com/v1/public';
    this.publicKey = import.meta.env.VITE_MARVEL_PUBLIC_KEY || '';
    this.privateKey = import.meta.env.VITE_MARVEL_PRIVATE_KEY || '';

    if (!this.publicKey) {
      console.warn(
        'Marvel API public key not found. Please set VITE_MARVEL_PUBLIC_KEY in your .env file.'
      );
    }
  }

  private generateAuthParams(): { ts: string; apikey: string; hash: string } {
    const ts = Date.now().toString();
    const hash = CryptoJS.MD5(ts + this.privateKey + this.publicKey).toString();

    return {
      ts,
      apikey: this.publicKey,
      hash,
    };
  }

  private buildUrl(endpoint: string, params: Record<string, string | number> = {}): string {
    const authParams = this.generateAuthParams();
    const allParams = { ...params, ...authParams };

    const queryString = Object.entries(allParams)
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value.toString())}`)
      .join('&');

    return `${this.baseUrl}${endpoint}?${queryString}`;
  }

  async fetchCharacters(
    options: {
      limit?: number;
      offset?: number;
      nameStartsWith?: string;
      orderBy?: string;
    } = {}
  ): Promise<MarvelCharacter[]> {
    try {
      const { limit = 20, offset = 0, nameStartsWith, orderBy = 'name' } = options;

      const params: Record<string, string | number> = {
        limit,
        offset,
        orderBy,
      };

      if (nameStartsWith) {
        params.nameStartsWith = nameStartsWith;
      }

      const url = this.buildUrl('/characters', params);
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Marvel API error: ${response.status} ${response.statusText}`);
      }

      const data: MarvelApiResponse = await response.json();
      return data.data.results;
    } catch (error) {
      console.error('Error fetching Marvel characters:', error);
      throw error;
    }
  }

  async getComics(
    options: {
      limit?: number;
      offset?: number;
    } = {}
  ): Promise<any[]> {
    try {
      const { limit = 20, offset = 0 } = options;

      const params: Record<string, string | number> = {
        limit,
        offset,
      };

      const url = this.buildUrl('/comics', params);
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Marvel API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data.data.results;
    } catch (error) {
      console.error('Error fetching comics:', error);
      return [];
    }
  }

  async getSeries(
    options: {
      limit?: number;
      offset?: number;
    } = {}
  ): Promise<any[]> {
    try {
      const { limit = 20, offset = 0 } = options;

      const params: Record<string, string | number> = {
        limit,
        offset,
      };

      const url = this.buildUrl('/series', params);
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Marvel API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data.data.results;
    } catch (error) {
      console.error('Error fetching series:', error);
      return [];
    }
  }

  async fetchCharacterById(characterId: number): Promise<MarvelCharacter | null> {
    try {
      const url = this.buildUrl(`/characters/${characterId}`);
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Marvel API error: ${response.status} ${response.statusText}`);
      }

      const data: MarvelApiResponse = await response.json();
      return data.data.results[0] || null;
    } catch (error) {
      console.error(`Error fetching character ${characterId}:`, error);
      throw error;
    }
  }

  async searchCharacters(query: string, limit: number = 10): Promise<MarvelCharacter[]> {
    return this.fetchCharacters({
      nameStartsWith: query,
      limit,
      orderBy: 'name',
    });
  }

  async getRandomCharacters(count: number = 10): Promise<MarvelCharacter[]> {
    try {
      // Marvel API typically has around 1564 characters
      const totalCharacters = 1564;

      const characters: MarvelCharacter[] = [];
      const usedOffsets = new Set<number>();

      while (characters.length < count && usedOffsets.size < totalCharacters) {
        const randomOffset = Math.floor(Math.random() * (totalCharacters - 20));

        if (!usedOffsets.has(randomOffset)) {
          usedOffsets.add(randomOffset);

          try {
            const randomCharacters = await this.fetchCharacters({
              limit: Math.min(20, count - characters.length),
              offset: randomOffset,
            });

            // Filter out characters with no description or poor quality images
            const validCharacters = randomCharacters.filter(
              char =>
                char.description &&
                char.description.length > 10 &&
                !char.thumbnail.path.includes('image_not_available')
            );

            characters.push(...validCharacters.slice(0, count - characters.length));
          } catch (error) {
            console.warn(`Failed to fetch characters at offset ${randomOffset}:`, error);
          }
        }
      }

      return characters.slice(0, count);
    } catch (error) {
      console.error('Error fetching random characters:', error);
      // Fallback to popular characters
      return this.fetchCharacters({ limit: count, orderBy: 'name' });
    }
  }

  getCharacterImageUrl(
    character: MarvelCharacter,
    size:
      | 'portrait_small'
      | 'portrait_medium'
      | 'portrait_xlarge'
      | 'standard_medium'
      | 'standard_large'
      | 'standard_xlarge' = 'standard_xlarge'
  ): string {
    if (character.thumbnail.path.includes('image_not_available')) {
      return '/images/placeholder-character.jpg';
    }

    return `${character.thumbnail.path}/${size}.${character.thumbnail.extension}`;
  }

  // Popular Marvel characters for fallback scenarios
  async getPopularCharacters(): Promise<MarvelCharacter[]> {
    const popularNames = [
      'Spider-Man',
      'Iron Man',
      'Captain America',
      'Thor',
      'Hulk',
      'Black Widow',
      'Hawkeye',
      'Doctor Strange',
      'Scarlet Witch',
      'Vision',
      'Falcon',
      'Winter Soldier',
      'Ant-Man',
      'Wasp',
      'Captain Marvel',
      'Black Panther',
      'Groot',
      'Rocket Raccoon',
      'Star-Lord',
      'Gamora',
      'Drax',
      'Mantis',
      'Nebula',
    ];

    const characters: MarvelCharacter[] = [];

    for (const name of popularNames) {
      try {
        const results = await this.searchCharacters(name, 1);
        if (results.length > 0) {
          characters.push(results[0]);
        }
      } catch (error) {
        console.warn(`Failed to fetch character: ${name}`, error);
      }

      // Add small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    return characters;
  }
}

export const marvelApi = new MarvelApiService();
export type { MarvelCharacter };
