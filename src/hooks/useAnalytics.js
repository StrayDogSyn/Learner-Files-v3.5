// React hook for analytics functionality
import { useEffect, useCallback, useState } from 'react';
import { analyticsService } from '../services/analytics';
export function useAnalytics() {
    const [summary, setSummary] = useState(null);
    const [recentEvents, setRecentEvents] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    /**
     * Track an analytics event
     */
    const trackEvent = useCallback((type, data) => {
        analyticsService.trackEvent(type, data);
    }, []);
    /**
     * Track project interactions
     */
    const trackProjectClick = useCallback((projectId, projectName, action) => {
        analyticsService.trackProjectClick(projectId, projectName, action);
    }, []);
    /**
     * Track GitHub link clicks
     */
    const trackGitHubClick = useCallback((url, context) => {
        analyticsService.trackGitHubClick(url, context);
    }, []);
    /**
     * Track demo interactions
     */
    const trackDemoInteraction = useCallback((demoType, action, data) => {
        analyticsService.trackDemoInteraction(demoType, action, data);
    }, []);
    /**
     * Track contact form interactions
     */
    const trackContactForm = useCallback((action, data) => {
        analyticsService.trackContactForm(action, data);
    }, []);
    /**
     * Load analytics summary
     */
    const loadSummary = useCallback(async () => {
        setIsLoading(true);
        try {
            const summaryData = analyticsService.getAnalyticsSummary();
            const events = analyticsService.getRecentEvents(10);
            setSummary(summaryData);
            setRecentEvents(events);
        }
        catch (error) {
            console.error('Failed to load analytics summary:', error);
        }
        finally {
            setIsLoading(false);
        }
    }, []);
    /**
     * Clear analytics data
     */
    const clearData = useCallback(() => {
        analyticsService.clearData();
        setSummary(null);
        setRecentEvents([]);
    }, []);
    /**
     * Export analytics data
     */
    const exportData = useCallback(() => {
        return analyticsService.exportData();
    }, []);
    /**
     * Track page view on mount
     */
    useEffect(() => {
        trackEvent('page_view', {
            path: window.location.pathname,
            referrer: document.referrer,
            userAgent: navigator.userAgent,
            timestamp: new Date().toISOString()
        });
    }, [trackEvent]);
    /**
     * Track page visibility changes
     */
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.hidden) {
                trackEvent('page_hidden', {
                    timestamp: new Date().toISOString()
                });
            }
            else {
                trackEvent('page_visible', {
                    timestamp: new Date().toISOString()
                });
            }
        };
        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [trackEvent]);
    /**
     * Track scroll depth
     */
    useEffect(() => {
        let maxScrollDepth = 0;
        let scrollTimeout;
        const handleScroll = () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollDepth = Math.round((scrollTop / documentHeight) * 100);
            if (scrollDepth > maxScrollDepth) {
                maxScrollDepth = scrollDepth;
            }
            // Debounce scroll tracking
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                if (scrollDepth > 0 && scrollDepth % 25 === 0) {
                    trackEvent('scroll_depth', {
                        depth: scrollDepth,
                        maxDepth: maxScrollDepth,
                        timestamp: new Date().toISOString()
                    });
                }
            }, 1000);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => {
            window.removeEventListener('scroll', handleScroll);
            clearTimeout(scrollTimeout);
        };
    }, [trackEvent]);
    /**
     * Track time on page
     */
    useEffect(() => {
        const startTime = Date.now();
        const trackTimeOnPage = () => {
            const timeSpent = Date.now() - startTime;
            trackEvent('time_on_page', {
                timeSpent: Math.round(timeSpent / 1000), // in seconds
                timestamp: new Date().toISOString()
            });
        };
        // Track time on page when user leaves
        const handleBeforeUnload = () => {
            trackTimeOnPage();
        };
        // Track time on page periodically (every 30 seconds)
        const timeInterval = setInterval(() => {
            trackTimeOnPage();
        }, 30000);
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
            clearInterval(timeInterval);
            trackTimeOnPage(); // Final tracking
        };
    }, [trackEvent]);
    return {
        // Data
        summary,
        recentEvents,
        isLoading,
        // Actions
        trackEvent,
        trackProjectClick,
        trackGitHubClick,
        trackDemoInteraction,
        trackContactForm,
        loadSummary,
        clearData,
        exportData
    };
}
export default useAnalytics;
//# sourceMappingURL=useAnalytics.js.map