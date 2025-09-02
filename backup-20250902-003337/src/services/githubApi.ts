import React from 'react';
import { GitHubUser, GitHubRepo, GitHubStatsResponse, GitHubReposResponse } from '../types/portfolio';

const GITHUB_API_BASE = 'https://api.github.com';
const GITHUB_USERNAME = 'hunterpetross'; // Eric's GitHub username

// GitHub API service class
export class GitHubApiService {
  private static async fetchWithErrorHandling<T>(url: string): Promise<T | null> {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        console.warn(`GitHub API request failed: ${response.status} ${response.statusText}`);
        return null;
      }
      return await response.json();
    } catch (error) {
      console.error('GitHub API error:', error);
      return null;
    }
  }

  // Fetch user profile data
  static async getUserProfile(): Promise<GitHubUser | null> {
    return this.fetchWithErrorHandling<GitHubUser>(
      `${GITHUB_API_BASE}/users/${GITHUB_USERNAME}`
    );
  }

  // Fetch user repositories
  static async getUserRepos(page = 1, perPage = 30): Promise<GitHubRepo[] | null> {
    const repos = await this.fetchWithErrorHandling<GitHubRepo[]>(
      `${GITHUB_API_BASE}/users/${GITHUB_USERNAME}/repos?page=${page}&per_page=${perPage}&sort=updated`
    );
    return repos;
  }

  // Fetch repository statistics
  static async getRepoStats(repoName: string): Promise<any | null> {
    return this.fetchWithErrorHandling(
      `${GITHUB_API_BASE}/repos/${GITHUB_USERNAME}/${repoName}`
    );
  }

  // Get comprehensive GitHub statistics
  static async getGitHubStats(): Promise<GitHubStatsResponse> {
    const [user, repos] = await Promise.all([
      this.getUserProfile(),
      this.getUserRepos(1, 100) // Get more repos for better stats
    ]);

    if (!user || !repos) {
      // Return fallback data if API fails
      return {
        success: false,
        data: {
          totalRepos: 25,
          totalStars: 150,
          totalForks: 45,
          totalCommits: 1200,
          languageStats: {
            'TypeScript': 35,
            'JavaScript': 25,
            'Python': 20,
            'React': 15,
            'Other': 5
          },
          recentActivity: [
            { date: '2024-01-15', type: 'commit', repo: 'ai-portfolio-generator' },
            { date: '2024-01-14', type: 'star', repo: 'react-components-library' },
            { date: '2024-01-13', type: 'fork', repo: 'machine-learning-toolkit' }
          ]
        }
      };
    }

    // Calculate statistics from real data
    const totalStars = repos.reduce((sum, repo) => sum + (repo.stargazers_count || 0), 0);
    const totalForks = repos.reduce((sum, repo) => sum + (repo.forks_count || 0), 0);
    
    // Calculate language statistics
    const languageStats: Record<string, number> = {};
    repos.forEach(repo => {
      if (repo.language) {
        languageStats[repo.language] = (languageStats[repo.language] || 0) + 1;
      }
    });

    // Convert to percentages
    const totalReposWithLanguage = Object.values(languageStats).reduce((sum, count) => sum + count, 0);
    const languagePercentages: Record<string, number> = {};
    Object.entries(languageStats).forEach(([lang, count]) => {
      languagePercentages[lang] = Math.round((count / totalReposWithLanguage) * 100);
    });

    // Get recent activity (simplified)
    const recentActivity = repos
      .filter(repo => repo.updated_at)
      .sort((a, b) => new Date(b.updated_at!).getTime() - new Date(a.updated_at!).getTime())
      .slice(0, 5)
      .map(repo => ({
        date: repo.updated_at!.split('T')[0],
        type: 'update' as const,
        repo: repo.name
      }));

    return {
      success: true,
      data: {
        totalRepos: user.public_repos || 0,
        totalStars,
        totalForks,
        totalCommits: 1200, // This would require additional API calls to get accurate count
        languageStats: languagePercentages,
        recentActivity
      }
    };
  }

  // Get featured repositories
  static async getFeaturedRepos(): Promise<GitHubReposResponse> {
    const repos = await this.getUserRepos(1, 50);
    
    if (!repos) {
      return {
        success: false,
        data: []
      };
    }

    // Filter and sort featured repositories
    const featuredRepos = repos
      .filter(repo => !repo.fork && repo.stargazers_count! > 0) // Non-forked repos with stars
      .sort((a, b) => (b.stargazers_count || 0) - (a.stargazers_count || 0))
      .slice(0, 6); // Top 6 repositories

    return {
      success: true,
      data: featuredRepos
    };
  }

  // Check if GitHub API is available
  static async checkApiStatus(): Promise<boolean> {
    try {
      const response = await fetch(`${GITHUB_API_BASE}/rate_limit`);
      return response.ok;
    } catch {
      return false;
    }
  }
}

// Hook for using GitHub data in React components
export const useGitHubData = () => {
  const [loading, setLoading] = React.useState(true);
  const [stats, setStats] = React.useState<GitHubStatsResponse | null>(null);
  const [repos, setRepos] = React.useState<GitHubReposResponse | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [statsData, reposData] = await Promise.all([
          GitHubApiService.getGitHubStats(),
          GitHubApiService.getFeaturedRepos()
        ]);
        
        setStats(statsData);
        setRepos(reposData);
      } catch (err) {
        setError('Failed to fetch GitHub data');
        console.error('GitHub data fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { loading, stats, repos, error };
};