import type { GitHubRepository, GitHubUser, GitHubStats, ProjectCardData } from '../types/github';
interface UseGitHubState {
    user: GitHubUser | null;
    repositories: GitHubRepository[];
    featuredRepos: GitHubRepository[];
    stats: GitHubStats | null;
    projectCards: ProjectCardData[];
    loading: boolean;
    error: string | null;
    lastUpdated: string | null;
}
interface UseGitHubActions {
    refreshData: () => Promise<void>;
    searchRepositories: (query: string) => Promise<GitHubRepository[]>;
    clearError: () => void;
}
type UseGitHubReturn = UseGitHubState & UseGitHubActions;
export declare const useGitHub: () => UseGitHubReturn;
export default useGitHub;
//# sourceMappingURL=useGitHub.d.ts.map