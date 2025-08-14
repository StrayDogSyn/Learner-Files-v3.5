import { GitHubRepository, GitHubCommit, GitHubLanguage, GitHubStats } from '../types/project';

class GitHubApiService {
  private readonly baseUrl = 'https://api.github.com';
  private readonly username = 'StrayDogSyn';
  private readonly token = import.meta.env.VITE_GITHUB_TOKEN;

  private async fetchWithAuth(endpoint: string): Promise<any> {
    const headers: Record<string, string> = {
      Accept: 'application/vnd.github.v3+json',
    };

    if (this.token) {
      headers['Authorization'] = `token ${this.token}`;
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, { headers });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async getRepository(repoName: string): Promise<GitHubRepository> {
    return this.fetchWithAuth(`/repos/${this.username}/${repoName}`);
  }

  async getRepositoryStats(repoName: string): Promise<GitHubStats> {
    try {
      const [repo, commits, languages] = await Promise.all([
        this.getRepository(repoName),
        this.getRecentCommits(repoName),
        this.getRepositoryLanguages(repoName),
      ]);

      return {
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        issues: repo.open_issues_count,
        pullRequests: 0, // Would need separate API call
        lastCommit: commits[0]?.commit.author.date || repo.updated_at,
        contributors: 1, // Would need separate API call
        languages,
        readme: repo.description || '',
      };
    } catch (error) {
      console.warn(`Failed to fetch GitHub stats for ${repoName}:`, error);
      return {
        stars: 0,
        forks: 0,
        issues: 0,
        pullRequests: 0,
        lastCommit: new Date().toISOString(),
        contributors: 1,
        languages: {},
        readme: '',
      };
    }
  }

  async getRecentCommits(repoName: string, limit: number = 5): Promise<GitHubCommit[]> {
    return this.fetchWithAuth(`/repos/${this.username}/${repoName}/commits?per_page=${limit}`);
  }

  async getRepositoryLanguages(repoName: string): Promise<GitHubLanguage> {
    return this.fetchWithAuth(`/repos/${this.username}/${repoName}/languages`);
  }

  async getUserRepositories(): Promise<GitHubRepository[]> {
    return this.fetchWithAuth(`/users/${this.username}/repos?sort=updated&per_page=100`);
  }

  async getRepositoryTopics(repoName: string): Promise<string[]> {
    try {
      const response = await this.fetchWithAuth(`/repos/${this.username}/${repoName}/topics`);
      return response.names || [];
    } catch (error) {
      console.warn(`Failed to fetch topics for ${repoName}:`, error);
      return [];
    }
  }

  async getRepositoryReadme(repoName: string): Promise<string> {
    try {
      const response = await this.fetchWithAuth(`/repos/${this.username}/${repoName}/readme`);
      return atob(response.content);
    } catch (error) {
      console.warn(`Failed to fetch README for ${repoName}:`, error);
      return '';
    }
  }

  // Enhanced methods for portfolio projects
  async getPortfolioProjects(): Promise<GitHubRepository[]> {
    const allRepos = await this.getUserRepositories();

    // Filter for portfolio-relevant repositories
    const portfolioRepos = allRepos.filter(
      repo =>
        !repo.archived &&
        !repo.disabled &&
        (repo.description?.toLowerCase().includes('portfolio') ||
          repo.description?.toLowerCase().includes('demo') ||
          repo.description?.toLowerCase().includes('project') ||
          repo.topics?.some(topic =>
            ['portfolio', 'demo', 'project', 'react', 'typescript', 'javascript'].includes(
              topic.toLowerCase()
            )
          ))
    );

    return portfolioRepos.sort(
      (a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
    );
  }

  async getProjectMetrics(repoName: string): Promise<{
    stars: number;
    forks: number;
    issues: number;
    lastCommit: string;
    languages: Record<string, number>;
    topics: string[];
  }> {
    try {
      const [repo, languages, topics] = await Promise.all([
        this.getRepository(repoName),
        this.getRepositoryLanguages(repoName),
        this.getRepositoryTopics(repoName),
      ]);

      return {
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        issues: repo.open_issues_count,
        lastCommit: repo.updated_at,
        languages,
        topics,
      };
    } catch (error) {
      console.warn(`Failed to fetch metrics for ${repoName}:`, error);
      return {
        stars: 0,
        forks: 0,
        issues: 0,
        lastCommit: new Date().toISOString(),
        languages: {},
        topics: [],
      };
    }
  }

  // Utility methods
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;
    return `${Math.floor(diffInDays / 365)} years ago`;
  }

  getPrimaryLanguage(languages: Record<string, number>): string {
    if (!languages || Object.keys(languages).length === 0) return 'Unknown';

    return Object.entries(languages).sort(([, a], [, b]) => b - a)[0][0];
  }

  getLanguageColor(language: string): string {
    const colors: Record<string, string> = {
      JavaScript: '#f1e05a',
      TypeScript: '#2b7489',
      Python: '#3572A5',
      React: '#61dafb',
      HTML: '#e34c26',
      CSS: '#563d7c',
      Java: '#b07219',
      'C++': '#f34b7d',
      'C#': '#178600',
      PHP: '#4F5D95',
      Ruby: '#701516',
      Go: '#00ADD8',
      Rust: '#dea584',
      Swift: '#ffac45',
      Kotlin: '#F18E33',
      Scala: '#c22d40',
      Dart: '#00B4AB',
      Vue: '#4fc08d',
      Angular: '#dd0031',
      'Node.js': '#339933',
    };

    return colors[language] || '#586069';
  }
}

export const githubApi = new GitHubApiService();
