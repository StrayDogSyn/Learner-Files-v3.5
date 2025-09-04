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
    score?: number;
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
export interface ProjectCardData {
    id: string;
    title: string;
    description: string;
    image?: string;
    technologies: string[];
    githubUrl: string;
    liveUrl?: string;
    stars: number;
    forks: number;
    language: string;
    lastUpdated: string;
    featured: boolean;
    category: 'web' | 'mobile' | 'desktop' | 'library' | 'tool' | 'game' | 'other';
}
export interface AnalyticsEvent {
    id: string;
    type: 'page_view' | 'project_click' | 'github_link_click' | 'demo_interaction' | 'contact_form' | 'page_hidden' | 'page_visible' | 'scroll_depth' | 'time_on_page' | 'ai_content_generated' | 'ai_content_error' | 'ai_hero_content_generated' | 'ai_hero_content_error' | 'roi_calculation_started' | 'roi_calculation_completed' | 'roi_calculation_error' | 'metrics_dashboard_loaded' | 'metrics_category_changed' | 'metrics_dashboard_updated' | 'chatbot_bot_response' | 'chatbot_user_message' | 'case_study_generation_started' | 'case_study_generation_completed' | 'case_study_generation_error' | 'hero_content_regenerated' | 'roi_analysis_generated' | 'ai_content_fallback' | 'hero_cta_clicked' | 'case_study_generated' | 'case_study_downloaded';
    timestamp: string;
    data?: Record<string, any>;
    sessionId: string;
    userAgent: string;
}
export interface PerformanceMetrics {
    loadTime: number;
    firstContentfulPaint: number;
    largestContentfulPaint: number;
    cumulativeLayoutShift: number;
    firstInputDelay: number;
    timestamp: string;
}
export interface CacheEntry<T> {
    data: T;
    timestamp: number;
    expiry: number;
}
export declare const LANGUAGE_COLORS: Record<string, string>;
export declare const CATEGORY_ICONS: Record<ProjectCardData['category'], string>;
export declare const isValidRepository: (repo: any) => repo is GitHubRepository;
export declare const isValidGitHubUser: (user: any) => user is GitHubUser;
export declare const getLanguageColor: (language: string | null) => string;
export declare const formatNumber: (num: number) => string;
export declare const formatDate: (dateString: string) => string;
export declare const categorizeRepository: (repo: GitHubRepository) => ProjectCardData["category"];
//# sourceMappingURL=github.d.ts.map