// GitHub API service for fetching repository data and user statistics
// Optimized for GitHub Pages deployment with proper error handling

export interface GitHubRepository {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  watchers_count: number;
  size: number;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  topics: string[];
  visibility: 'public' | 'private';
  archived: boolean;
  disabled: boolean;
}

export interface GitHubUser {
  login: string;
  id: number;
  avatar_url: string;
  html_url: string;
  name: string | null;
  company: string | null;
  blog: string | null;
  location: string | null;
  email: string | null;
  bio: string | null;
  public_repos: number;
  public_gists: number;
  followers: number;
  following: number;
  created_at: string;
  updated_at: string;
}

export interface GitHubStats {
  totalRepos: number;
  totalStars: number;
  totalForks: number;
  totalCommits: number;
  languages: Record<string, number>;
  lastUpdated: string;
}

class GitHubService {
  private readonly baseUrl = 'https://api.github.com';
  private readonly username = 'StrayDogSyn'; // Your GitHub username
  private cache = new Map<string, { data: any; timestamp: number }>();
  private readonly cacheTimeout = 5 * 60 * 1000; // 5 minutes

  /**
   * Generic method to fetch data from GitHub API with caching
   */
  private async fetchWithCache<T>(endpoint: string): Promise<T> {
    const cacheKey = endpoint;
    const cached = this.cache.get(cacheKey);
    
    // Return cached data if still valid
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'StrayDogSyndicate-Portfolio'
        }
      });

      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      // Cache the result
      this.cache.set(cacheKey, {
        data,
        timestamp: Date.now()
      });

      return data;
    } catch (error) {
      console.error(`Failed to fetch ${endpoint}:`, error);
      
      // Return cached data if available, even if expired
      if (cached) {
        console.warn('Using expired cache data due to API error');
        return cached.data;
      }
      
      throw error;
    }
  }

  /**
   * Fetch user profile information
   */
  async getUserProfile(): Promise<GitHubUser> {
    return this.fetchWithCache<GitHubUser>(`/users/${this.username}`);
  }

  /**
   * Fetch all public repositories
   */
  async getRepositories(): Promise<GitHubRepository[]> {
    const repos = await this.fetchWithCache<GitHubRepository[]>(
      `/users/${this.username}/repos?type=public&sort=updated&per_page=100`
    );
    
    // Filter out archived and disabled repos, sort by stars
    return repos
      .filter(repo => !repo.archived && !repo.disabled)
      .sort((a, b) => b.stargazers_count - a.stargazers_count);
  }

  /**
   * Fetch featured repositories (top starred, recently updated)
   */
  async getFeaturedRepositories(limit: number = 6): Promise<GitHubRepository[]> {
    const repos = await this.getRepositories();
    
    // Prioritize repos with descriptions, stars, and recent activity
    const scored = repos.map(repo => {
      let score = 0;
      
      // Points for stars
      score += repo.stargazers_count * 10;
      
      // Points for having description
      if (repo.description) score += 50;
      
      // Points for having homepage
      if (repo.homepage) score += 30;
      
      // Points for recent activity (within last 6 months)
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
      if (new Date(repo.pushed_at) > sixMonthsAgo) score += 25;
      
      // Points for having topics
      score += repo.topics.length * 5;
      
      return { ...repo, score };
    });
    
    return scored
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }

  /**
   * Calculate comprehensive GitHub statistics
   */
  async getGitHubStats(): Promise<GitHubStats> {
    try {
      const [user, repos] = await Promise.all([
        this.getUserProfile(),
        this.getRepositories()
      ]);

      const stats: GitHubStats = {
        totalRepos: user.public_repos,
        totalStars: repos.reduce((sum, repo) => sum + repo.stargazers_count, 0),
        totalForks: repos.reduce((sum, repo) => sum + repo.forks_count, 0),
        totalCommits: 0, // This would require additional API calls per repo
        languages: {},
        lastUpdated: new Date().toISOString()
      };

      // Calculate language distribution
      repos.forEach(repo => {
        if (repo.language) {
          stats.languages[repo.language] = (stats.languages[repo.language] || 0) + 1;
        }
      });

      return stats;
    } catch (error) {
      console.error('Failed to calculate GitHub stats:', error);
      
      // Return default stats on error
      return {
        totalRepos: 0,
        totalStars: 0,
        totalForks: 0,
        totalCommits: 0,
        languages: {},
        lastUpdated: new Date().toISOString()
      };
    }
  }

  /**
   * Search repositories by topic or keyword
   */
  async searchRepositories(query: string): Promise<GitHubRepository[]> {
    const repos = await this.getRepositories();
    
    const searchTerm = query.toLowerCase();
    
    return repos.filter(repo => {
      const matchesName = repo.name.toLowerCase().includes(searchTerm);
      const matchesDescription = repo.description?.toLowerCase().includes(searchTerm) || false;
      const matchesTopics = repo.topics.some(topic => topic.toLowerCase().includes(searchTerm));
      const matchesLanguage = repo.language?.toLowerCase().includes(searchTerm) || false;
      
      return matchesName || matchesDescription || matchesTopics || matchesLanguage;
    });
  }

  /**
   * Clear cache (useful for testing or manual refresh)
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Get cache status for debugging
   */
  getCacheStatus(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }
}

// Export singleton instance
export const githubService = new GitHubService();
export default githubService;