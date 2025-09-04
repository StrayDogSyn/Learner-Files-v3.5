// React hook for GitHub data management with caching and error handling
import { useState, useEffect, useCallback } from 'react';
import { githubService } from '../services/github';
import { categorizeRepository } from '../types/github';
const STORAGE_KEY = 'github_portfolio_data';
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes
// Convert GitHub repository to project card data
const convertToProjectCard = (repo) => {
    return {
        id: repo.id.toString(),
        title: repo.name.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        description: repo.description || 'No description available',
        technologies: repo.topics.length > 0 ? repo.topics : [repo.language].filter(Boolean),
        githubUrl: repo.html_url,
        liveUrl: repo.homepage || undefined,
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        language: repo.language || 'Unknown',
        lastUpdated: repo.updated_at,
        featured: repo.stargazers_count > 0 || repo.topics.length > 0,
        category: categorizeRepository(repo)
    };
};
// Load cached data from localStorage
const loadCachedData = () => {
    try {
        const cached = localStorage.getItem(STORAGE_KEY);
        if (!cached)
            return null;
        const data = JSON.parse(cached);
        const now = Date.now();
        // Check if cache is still valid
        if (data.timestamp && (now - data.timestamp) < CACHE_DURATION) {
            return {
                user: data.user,
                repositories: data.repositories,
                featuredRepos: data.featuredRepos,
                stats: data.stats,
                projectCards: data.projectCards,
                lastUpdated: data.lastUpdated
            };
        }
        return null;
    }
    catch (error) {
        console.warn('Failed to load cached GitHub data:', error);
        return null;
    }
};
// Save data to localStorage
const saveCachedData = (data) => {
    try {
        const cacheData = {
            ...data,
            timestamp: Date.now()
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(cacheData));
    }
    catch (error) {
        console.warn('Failed to cache GitHub data:', error);
    }
};
export const useGitHub = () => {
    const [state, setState] = useState(() => {
        const cached = loadCachedData();
        return {
            user: cached?.user || null,
            repositories: cached?.repositories || [],
            featuredRepos: cached?.featuredRepos || [],
            stats: cached?.stats || null,
            projectCards: cached?.projectCards || [],
            loading: !cached,
            error: null,
            lastUpdated: cached?.lastUpdated || null
        };
    });
    const setLoading = (loading) => {
        setState(prev => ({ ...prev, loading }));
    };
    const setError = (error) => {
        setState(prev => ({ ...prev, error, loading: false }));
    };
    const clearError = useCallback(() => {
        setState(prev => ({ ...prev, error: null }));
    }, []);
    const fetchGitHubData = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            // Fetch all data in parallel
            const [user, repositories, stats] = await Promise.all([
                githubService.getUserProfile(),
                githubService.getRepositories(),
                githubService.getGitHubStats()
            ]);
            // Get featured repositories
            const featuredRepos = await githubService.getFeaturedRepositories(6);
            // Convert repositories to project cards
            const projectCards = featuredRepos.map(convertToProjectCard);
            const newState = {
                user,
                repositories,
                featuredRepos,
                stats,
                projectCards,
                loading: false,
                error: null,
                lastUpdated: new Date().toISOString()
            };
            setState(newState);
            saveCachedData(newState);
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to fetch GitHub data';
            console.error('GitHub data fetch error:', error);
            setError(errorMessage);
        }
    }, []);
    const refreshData = useCallback(async () => {
        // Clear cache and fetch fresh data
        githubService.clearCache();
        localStorage.removeItem(STORAGE_KEY);
        await fetchGitHubData();
    }, [fetchGitHubData]);
    const searchRepositories = useCallback(async (query) => {
        try {
            return await githubService.searchRepositories(query);
        }
        catch (error) {
            console.error('Repository search error:', error);
            return [];
        }
    }, []);
    // Initial data fetch
    useEffect(() => {
        if (!state.user && !state.loading && !state.error) {
            fetchGitHubData();
        }
    }, [state.user, state.loading, state.error, fetchGitHubData]);
    // Auto-refresh data every 30 minutes if page is visible
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (!document.hidden && state.lastUpdated) {
                const lastUpdate = new Date(state.lastUpdated).getTime();
                const now = Date.now();
                const thirtyMinutes = 30 * 60 * 1000;
                if (now - lastUpdate > thirtyMinutes) {
                    fetchGitHubData();
                }
            }
        };
        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
    }, [state.lastUpdated, fetchGitHubData]);
    return {
        ...state,
        refreshData,
        searchRepositories,
        clearError
    };
};
export default useGitHub;
//# sourceMappingURL=useGitHub.js.map