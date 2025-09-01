// GitHub API service for fetching repository metrics and information

export interface GitHubMetrics {
  stars: number;
  forks: number;
  watchers: number;
  openIssues: number;
  lastCommit: string;
  language: string;
  size: number;
  createdAt: string;
  updatedAt: string;
  description: string;
  topics: string[];
  license?: string;
  defaultBranch: string;
  hasPages: boolean;
  hasWiki: boolean;
  hasDownloads: boolean;
  archived: boolean;
  disabled: boolean;
}

export interface GitHubRepository {
  id: number;
  name: string;
  fullName: string;
  owner: {
    login: string;
    avatarUrl: string;
  };
  htmlUrl: string;
  description: string;
  fork: boolean;
  createdAt: string;
  updatedAt: string;
  pushedAt: string;
  gitUrl: string;
  sshUrl: string;
  cloneUrl: string;
  size: number;
  stargazersCount: number;
  watchersCount: number;
  language: string;
  forksCount: number;
  archived: boolean;
  disabled: boolean;
  openIssuesCount: number;
  license?: {
    key: string;
    name: string;
    spdxId: string;
  };
  topics: string[];
  defaultBranch: string;
  hasIssues: boolean;
  hasProjects: boolean;
  hasWiki: boolean;
  hasPages: boolean;
  hasDownloads: boolean;
}

export interface GitHubCommit {
  sha: string;
  commit: {
    author: {
      name: string;
      email: string;
      date: string;
    };
    committer: {
      name: string;
      email: string;
      date: string;
    };
    message: string;
  };
  author?: {
    login: string;
    avatarUrl: string;
  };
  committer?: {
    login: string;
    avatarUrl: string;
  };
}

class GitHubApiService {
  private baseUrl = 'https://api.github.com';
  private username = 'StrayDogSyndicate'; // Default username, can be configured
  private cache = new Map<string, { data: any; timestamp: number }>();
  private cacheTimeout = 5 * 60 * 1000; // 5 minutes

  constructor(username?: string) {
    if (username) {
      this.username = username;
    }
  }

  private async fetchWithCache<T>(url: string): Promise<T> {
    const cacheKey = url;
    const cached = this.cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }

    try {
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      this.cache.set(cacheKey, { data, timestamp: Date.now() });
      
      return data;
    } catch (error) {
      console.error('GitHub API fetch error:', error);
      // Return cached data if available, even if expired
      if (cached) {
        return cached.data;
      }
      throw error;
    }
  }

  async getRepository(repoName: string, owner?: string): Promise<GitHubRepository> {
    const repoOwner = owner || this.username;
    const url = `${this.baseUrl}/repos/${repoOwner}/${repoName}`;
    return this.fetchWithCache<GitHubRepository>(url);
  }

  async getProjectMetrics(repoName: string, owner?: string): Promise<GitHubMetrics> {
    try {
      const repo = await this.getRepository(repoName, owner);
      
      return {
        stars: repo.stargazersCount,
        forks: repo.forksCount,
        watchers: repo.watchersCount,
        openIssues: repo.openIssuesCount,
        lastCommit: repo.pushedAt,
        language: repo.language || 'Unknown',
        size: repo.size,
        createdAt: repo.createdAt,
        updatedAt: repo.updatedAt,
        description: repo.description || '',
        topics: repo.topics || [],
        license: repo.license?.name,
        defaultBranch: repo.defaultBranch,
        hasPages: repo.hasPages,
        hasWiki: repo.hasWiki,
        hasDownloads: repo.hasDownloads,
        archived: repo.archived,
        disabled: repo.disabled
      };
    } catch (error) {
      console.warn(`Failed to fetch metrics for ${repoName}:`, error);
      // Return default metrics if API fails
      return {
        stars: 0,
        forks: 0,
        watchers: 0,
        openIssues: 0,
        lastCommit: new Date().toISOString(),
        language: 'Unknown',
        size: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        description: '',
        topics: [],
        defaultBranch: 'main',
        hasPages: false,
        hasWiki: false,
        hasDownloads: false,
        archived: false,
        disabled: false
      };
    }
  }

  async getLatestCommit(repoName: string, owner?: string): Promise<GitHubCommit | null> {
    try {
      const repoOwner = owner || this.username;
      const url = `${this.baseUrl}/repos/${repoOwner}/${repoName}/commits?per_page=1`;
      const commits = await this.fetchWithCache<GitHubCommit[]>(url);
      
      return commits.length > 0 ? commits[0] : null;
    } catch (error) {
      console.warn(`Failed to fetch latest commit for ${repoName}:`, error);
      return null;
    }
  }

  async getUserRepositories(username?: string): Promise<GitHubRepository[]> {
    try {
      const user = username || this.username;
      const url = `${this.baseUrl}/users/${user}/repos?sort=updated&per_page=100`;
      return this.fetchWithCache<GitHubRepository[]>(url);
    } catch (error) {
      console.warn(`Failed to fetch repositories for ${username || this.username}:`, error);
      return [];
    }
  }

  async searchRepositories(query: string, sort: 'stars' | 'forks' | 'updated' = 'stars'): Promise<GitHubRepository[]> {
    try {
      const url = `${this.baseUrl}/search/repositories?q=${encodeURIComponent(query)}&sort=${sort}&order=desc&per_page=50`;
      const response = await this.fetchWithCache<{ items: GitHubRepository[] }>(url);
      return response.items || [];
    } catch (error) {
      console.warn(`Failed to search repositories with query "${query}":`, error);
      return [];
    }
  }

  // Utility methods
  setUsername(username: string): void {
    this.username = username;
  }

  getUsername(): string {
    return this.username;
  }

  clearCache(): void {
    this.cache.clear();
  }

  // Static helper methods
  static formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  static formatNumber(num: number): string {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  }

  static getLanguageColor(language: string): string {
    const colors: Record<string, string> = {
      'JavaScript': '#f1e05a',
      'TypeScript': '#2b7489',
      'Python': '#3572A5',
      'Java': '#b07219',
      'C++': '#f34b7d',
      'C#': '#239120',
      'PHP': '#4F5D95',
      'Ruby': '#701516',
      'Go': '#00ADD8',
      'Rust': '#dea584',
      'Swift': '#ffac45',
      'Kotlin': '#F18E33',
      'Dart': '#00B4AB',
      'HTML': '#e34c26',
      'CSS': '#1572B6',
      'Vue': '#2c3e50',
      'React': '#61DAFB',
      'Angular': '#DD0031',
      'Svelte': '#ff3e00'
    };
    return colors[language] || '#586069';
  }
}

// Export singleton instance
export const githubApi = new GitHubApiService();

// Export class for custom instances
export { GitHubApiService };

export default githubApi;