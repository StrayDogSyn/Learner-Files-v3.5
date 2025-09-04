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
declare class GitHubService {
    private readonly baseUrl;
    private readonly username;
    private cache;
    private readonly cacheTimeout;
    /**
     * Generic method to fetch data from GitHub API with caching
     */
    private fetchWithCache;
    /**
     * Fetch user profile information
     */
    getUserProfile(): Promise<GitHubUser>;
    /**
     * Fetch all public repositories
     */
    getRepositories(): Promise<GitHubRepository[]>;
    /**
     * Fetch featured repositories (top starred, recently updated)
     */
    getFeaturedRepositories(limit?: number): Promise<GitHubRepository[]>;
    /**
     * Calculate comprehensive GitHub statistics
     */
    getGitHubStats(): Promise<GitHubStats>;
    /**
     * Search repositories by topic or keyword
     */
    searchRepositories(query: string): Promise<GitHubRepository[]>;
    /**
     * Clear cache (useful for testing or manual refresh)
     */
    clearCache(): void;
    /**
     * Get cache status for debugging
     */
    getCacheStatus(): {
        size: number;
        keys: string[];
    };
}
export declare const githubService: GitHubService;
export default githubService;
//# sourceMappingURL=github.d.ts.map