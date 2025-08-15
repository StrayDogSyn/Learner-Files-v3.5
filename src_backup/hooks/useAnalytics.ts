import { useCallback, useEffect } from 'react';
import { analytics, type AnalyticsEvent } from '../services/analytics';

/**
 * Custom hook for analytics tracking in React components
 * Provides easy-to-use methods for tracking user interactions
 */
export const useAnalytics = () => {
  // Track page views on component mount
  useEffect(() => {
    analytics.trackPageView();
  }, []);

  // Generic event tracking
  const trackEvent = useCallback((event: AnalyticsEvent) => {
    analytics.trackEvent(event);
  }, []);

  // Specific tracking methods for common portfolio interactions
  const trackProjectView = useCallback((projectName: string) => {
    analytics.trackProjectView(projectName);
  }, []);

  const trackSkillInteraction = useCallback((skillName: string) => {
    analytics.trackSkillInteraction(skillName);
  }, []);

  const trackContactAttempt = useCallback((method: string) => {
    analytics.trackContactAttempt(method);
  }, []);

  const trackThemeToggle = useCallback((theme: string) => {
    analytics.trackThemeToggle(theme);
  }, []);

  const trackDownload = useCallback((fileName: string) => {
    analytics.trackDownload(fileName);
  }, []);

  const trackNavigation = useCallback((section: string) => {
    analytics.trackEvent({
      action: 'navigation',
      category: 'user_flow',
      label: section,
    });
  }, []);

  const trackSocialClick = useCallback((platform: string) => {
    analytics.trackEvent({
      action: 'social_click',
      category: 'external_link',
      label: platform,
    });
  }, []);

  const trackGitHubActivity = useCallback((action: string) => {
    analytics.trackEvent({
      action: 'github_activity',
      category: 'engagement',
      label: action,
    });
  }, []);

  const trackSearchQuery = useCallback((query: string, resultsCount: number) => {
    analytics.trackEvent({
      action: 'search',
      category: 'site_search',
      label: query,
      value: resultsCount,
    });
  }, []);

  const trackTimeOnSection = useCallback((section: string, timeSpent: number) => {
    analytics.trackEvent({
      action: 'time_on_section',
      category: 'engagement',
      label: section,
      value: Math.round(timeSpent / 1000), // Convert to seconds
    });
  }, []);

  const trackScrollDepth = useCallback((percentage: number) => {
    analytics.trackEvent({
      action: 'scroll_depth',
      category: 'engagement',
      label: `${percentage}%`,
      value: percentage,
    });
  }, []);

  const trackError = useCallback((errorType: string, errorMessage: string) => {
    analytics.trackEvent({
      action: 'error',
      category: 'technical',
      label: errorType,
      custom_parameters: {
        error_message: errorMessage,
        user_agent: navigator.userAgent,
        url: window.location.href,
      },
    });
  }, []);

  const trackPerformance = useCallback((metric: string, value: number) => {
    analytics.trackEvent({
      action: 'performance_metric',
      category: 'performance',
      label: metric,
      value: Math.round(value),
    });
  }, []);

  const trackContentView = useCallback((contentType: string, contentId: string) => {
    analytics.trackEvent({
      action: 'content_view',
      category: 'content',
      label: `${contentType}:${contentId}`,
    });
  }, []);

  const trackContentInteraction = useCallback((action: string, contentId: string) => {
    analytics.trackEvent({
      action: 'content_interaction',
      category: 'engagement',
      label: `${action}:${contentId}`,
    });
  }, []);

  return {
    trackEvent,
    trackProjectView,
    trackSkillInteraction,
    trackContactAttempt,
    trackThemeToggle,
    trackDownload,
    trackNavigation,
    trackSocialClick,
    trackGitHubActivity,
    trackSearchQuery,
    trackTimeOnSection,
    trackScrollDepth,
    trackError,
    trackPerformance,
    trackContentView,
    trackContentInteraction,
  };
};

/**
 * Hook for tracking time spent on a component/section
 * Automatically tracks when component mounts and unmounts
 */
export const useTimeTracking = (sectionName: string) => {
  const { trackTimeOnSection } = useAnalytics();

  useEffect(() => {
    const startTime = Date.now();

    return () => {
      const timeSpent = Date.now() - startTime;
      trackTimeOnSection(sectionName, timeSpent);
    };
  }, [sectionName, trackTimeOnSection]);
};

/**
 * Hook for tracking scroll depth
 * Tracks when user scrolls past certain thresholds (25%, 50%, 75%, 100%)
 */
export const useScrollTracking = () => {
  const { trackScrollDepth } = useAnalytics();

  useEffect(() => {
    const thresholds = [25, 50, 75, 100];
    const trackedThresholds = new Set<number>();

    const handleScroll = () => {
      const scrollTop = window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = Math.round((scrollTop / docHeight) * 100);

      thresholds.forEach(threshold => {
        if (scrollPercent >= threshold && !trackedThresholds.has(threshold)) {
          trackedThresholds.add(threshold);
          trackScrollDepth(threshold);
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [trackScrollDepth]);
};

/**
 * Hook for tracking performance metrics
 * Tracks Core Web Vitals and other performance indicators
 */
export const usePerformanceTracking = () => {
  const { trackPerformance } = useAnalytics();

  useEffect(() => {
    // Track page load time
    window.addEventListener('load', () => {
      const loadTime = performance.now();
      trackPerformance('page_load_time', loadTime);
    });

    // Track Core Web Vitals if available
    // Web Vitals tracking disabled for now (module not installed)
    // To enable, install web-vitals: npm install web-vitals
    console.log('Web Vitals tracking disabled - install web-vitals package to enable');
  }, [trackPerformance]);
};
