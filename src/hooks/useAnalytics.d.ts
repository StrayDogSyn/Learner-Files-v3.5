import type { AnalyticsEvent } from '../types/github';
interface AnalyticsSummary {
    totalEvents: number;
    totalSessions: number;
    eventsByType: Record<string, number>;
    averageLoadTime: number;
    lastActivity: string | null;
}
export declare function useAnalytics(): {
    summary: AnalyticsSummary | null;
    recentEvents: AnalyticsEvent[];
    isLoading: boolean;
    trackEvent: (type: AnalyticsEvent["type"], data?: Record<string, any>) => void;
    trackProjectClick: (projectId: string, projectName: string, action: "github" | "demo") => void;
    trackGitHubClick: (url: string, context: string) => void;
    trackDemoInteraction: (demoType: string, action: string, data?: Record<string, any>) => void;
    trackContactForm: (action: "open" | "submit" | "error", data?: Record<string, any>) => void;
    loadSummary: () => Promise<void>;
    clearData: () => void;
    exportData: () => string;
};
export default useAnalytics;
//# sourceMappingURL=useAnalytics.d.ts.map