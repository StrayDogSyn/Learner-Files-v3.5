// GitHub API service for fetching repository data and user statistics
// Optimized for GitHub Pages deployment with proper error handling
class GitHubService {
    constructor() {
        Object.defineProperty(this, "baseUrl", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'https://api.github.com'
        });
        Object.defineProperty(this, "username", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'StrayDogSyn'
        }); // Your GitHub username
        Object.defineProperty(this, "cache", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Map()
        });
        Object.defineProperty(this, "cacheTimeout", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 5 * 60 * 1000
        }); // 5 minutes
    }
    /**
     * Generic method to fetch data from GitHub API with caching
     */
    async fetchWithCache(endpoint) {
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
        }
        catch (error) {
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
    async getUserProfile() {
        return this.fetchWithCache(`/users/${this.username}`);
    }
    /**
     * Fetch all public repositories
     */
    async getRepositories() {
        const repos = await this.fetchWithCache(`/users/${this.username}/repos?type=public&sort=updated&per_page=100`);
        // Filter out archived and disabled repos, sort by stars
        return repos
            .filter(repo => !repo.archived && !repo.disabled)
            .sort((a, b) => b.stargazers_count - a.stargazers_count);
    }
    /**
     * Fetch featured repositories (top starred, recently updated)
     */
    async getFeaturedRepositories(limit = 6) {
        const repos = await this.getRepositories();
        // Prioritize repos with descriptions, stars, and recent activity
        const scored = repos.map(repo => {
            let score = 0;
            // Points for stars
            score += repo.stargazers_count * 10;
            // Points for having description
            if (repo.description)
                score += 50;
            // Points for having homepage
            if (repo.homepage)
                score += 30;
            // Points for recent activity (within last 6 months)
            const sixMonthsAgo = new Date();
            sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
            if (new Date(repo.pushed_at) > sixMonthsAgo)
                score += 25;
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
    async getGitHubStats() {
        try {
            const [user, repos] = await Promise.all([
                this.getUserProfile(),
                this.getRepositories()
            ]);
            const stats = {
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
        }
        catch (error) {
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
    async searchRepositories(query) {
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
    clearCache() {
        this.cache.clear();
    }
    /**
     * Get cache status for debugging
     */
    getCacheStatus() {
        return {
            size: this.cache.size,
            keys: Array.from(this.cache.keys())
        };
    }
}
// Export singleton instance
export const githubService = new GitHubService();
export default githubService;
//# sourceMappingURL=github.js.map