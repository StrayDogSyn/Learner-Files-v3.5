import { useCallback, useEffect, useRef } from 'react';

export interface AnalyticsEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
}

export const useAnalytics = () => {
  const trackEvent = useCallback((event: AnalyticsEvent) => {
    // Analytics tracking implementation
    console.log('Analytics Event:', event);
    
    // In a real implementation, you would send this to your analytics service
    // Example: gtag('event', event.action, { ... })
  }, []);

  const trackPageView = useCallback((page: string) => {
    console.log('Page View:', page);
    // Track page views
  }, []);

  const trackUserInteraction = useCallback((element: string, action: string) => {
    trackEvent({
      action,
      category: 'User Interaction',
      label: element
    });
  }, [trackEvent]);

  const trackProjectView = useCallback((projectId: string, projectName?: string) => {
    trackEvent({
      action: 'project_view',
      category: 'Project',
      label: projectName || projectId
    });
  }, [trackEvent]);

  const trackThemeToggle = useCallback((theme: string) => {
    trackEvent({
      action: 'theme_toggle',
      category: 'UI',
      label: theme
    });
  }, [trackEvent]);

  const trackNavigation = useCallback((destination: string, source?: string) => {
    trackEvent({
      action: 'navigation',
      category: 'Navigation',
      label: `${source || 'unknown'} -> ${destination}`
    });
  }, [trackEvent]);

  const trackContentView = useCallback((contentId: string, contentType?: string) => {
    trackEvent({
      action: 'content_view',
      category: 'Content',
      label: `${contentType || 'unknown'}: ${contentId}`
    });
  }, [trackEvent]);

  const trackContentInteraction = useCallback((contentId: string, action: string) => {
    trackEvent({
      action: 'content_interaction',
      category: 'Content',
      label: `${action}: ${contentId}`
    });
  }, [trackEvent]);

  const trackExperiment = useCallback((experimentId: string, variant?: string) => {
    trackEvent({
      action: 'experiment_view',
      category: 'Experiment',
      label: `${experimentId}${variant ? ` (${variant})` : ''}`
    });
  }, [trackEvent]);

  const trackDemo = useCallback((demoId: string, action: string) => {
    trackEvent({
      action: 'demo_interaction',
      category: 'Demo',
      label: `${action}: ${demoId}`
    });
  }, [trackEvent]);

  const trackFilter = useCallback((filterType: string, filterValue: string) => {
    trackEvent({
      action: 'filter_applied',
      category: 'Filter',
      label: `${filterType}: ${filterValue}`
    });
  }, [trackEvent]);

  const trackSort = useCallback((sortField: string, sortDirection: string) => {
    trackEvent({
      action: 'sort_applied',
      category: 'Sort',
      label: `${sortField}: ${sortDirection}`
    });
  }, [trackEvent]);

  return {
    trackEvent,
    trackPageView,
    trackUserInteraction,
    trackProjectView,
    trackThemeToggle,
    trackNavigation,
    trackContentView,
    trackContentInteraction,
    trackExperiment,
    trackDemo,
    trackFilter,
    trackSort
  };
};

export const useScrollTracking = () => {
  const scrollDepth = useRef(0);
  const maxScrollDepth = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = Math.round((scrollTop / docHeight) * 100);
      
      scrollDepth.current = scrollPercent;
      if (scrollPercent > maxScrollDepth.current) {
        maxScrollDepth.current = scrollPercent;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getScrollMetrics = useCallback(() => {
    return {
      currentDepth: scrollDepth.current,
      maxDepth: maxScrollDepth.current
    };
  }, []);

  return {
    getScrollMetrics,
    currentScrollDepth: scrollDepth.current,
    maxScrollDepth: maxScrollDepth.current
  };
};

export const usePerformanceTracking = () => {
  const performanceMetrics = useRef({
    loadTime: 0,
    renderTime: 0,
    interactionTime: 0
  });

  useEffect(() => {
    // Track page load performance
    const measurePerformance = () => {
      if (typeof window !== 'undefined' && 'performance' in window) {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        if (navigation) {
          performanceMetrics.current.loadTime = navigation.loadEventEnd - navigation.loadEventStart;
          performanceMetrics.current.renderTime = navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart;
        }
      }
    };

    // Measure after page load
    if (document.readyState === 'complete') {
      measurePerformance();
    } else {
      window.addEventListener('load', measurePerformance);
    }

    return () => {
      window.removeEventListener('load', measurePerformance);
    };
  }, []);

  const trackInteraction = useCallback((interactionType: string) => {
    const startTime = performance.now();
    return () => {
      const endTime = performance.now();
      performanceMetrics.current.interactionTime = endTime - startTime;
      console.log(`${interactionType} took ${endTime - startTime} milliseconds`);
    };
  }, []);

  const getPerformanceMetrics = useCallback(() => {
    return { ...performanceMetrics.current };
  }, []);

  return {
    trackInteraction,
    getPerformanceMetrics,
    metrics: performanceMetrics.current
  };
};

export default useAnalytics;