import { useState, useEffect, useCallback } from 'react';
import { getAnalyticsService, AnalyticsEvent, PerformanceMetrics, DomainMetrics } from '../analytics/AnalyticsService';

export interface UseAnalyticsReturn {
  // Metrics
  metrics: PerformanceMetrics | null;
  domainMetrics: DomainMetrics[];
  
  // Tracking functions
  trackAIRequest: (domain: string, prompt: string, userId?: string) => string;
  trackAIResponse: (requestId: string, domain: string, responseTime: number, success: boolean, userId?: string) => void;
  trackDomainSwitch: (fromDomain: string, toDomain: string, userId?: string) => void;
  trackError: (domain: string, error: Error, context?: Record<string, any>, userId?: string) => void;
  trackPerformance: (domain: string, metric: string, value: number, userId?: string) => void;
  
  // Data access
  getEvents: (filter?: {
    type?: AnalyticsEvent['type'];
    domain?: string;
    since?: number;
    limit?: number;
  }) => AnalyticsEvent[];
  
  // Utility
  exportData: () => any;
  clearData: () => void;
  
  // State
  isTracking: boolean;
}

export const useAnalytics = (): UseAnalyticsReturn => {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [domainMetrics, setDomainMetrics] = useState<DomainMetrics[]>([]);
  const [isTracking, setIsTracking] = useState(true);
  
  const analyticsService = getAnalyticsService();

  // Update metrics when they change
  useEffect(() => {
    const updateMetrics = () => {
      setMetrics(analyticsService.getMetrics());
      setDomainMetrics(analyticsService.getDomainMetrics());
    };

    // Initial load
    updateMetrics();

    // Listen for updates
    analyticsService.on('metrics_updated', updateMetrics);
    analyticsService.on('event_tracked', updateMetrics);

    return () => {
      analyticsService.off('metrics_updated', updateMetrics);
      analyticsService.off('event_tracked', updateMetrics);
    };
  }, [analyticsService]);

  // Tracking functions
  const trackAIRequest = useCallback((domain: string, prompt: string, userId?: string): string => {
    if (!isTracking) return '';
    return analyticsService.trackAIRequest(domain, prompt, userId);
  }, [analyticsService, isTracking]);

  const trackAIResponse = useCallback((requestId: string, domain: string, responseTime: number, success: boolean, userId?: string): void => {
    if (!isTracking) return;
    analyticsService.trackAIResponse(requestId, domain, responseTime, success, userId);
  }, [analyticsService, isTracking]);

  const trackDomainSwitch = useCallback((fromDomain: string, toDomain: string, userId?: string): void => {
    if (!isTracking) return;
    analyticsService.trackDomainSwitch(fromDomain, toDomain, userId);
  }, [analyticsService, isTracking]);

  const trackError = useCallback((domain: string, error: Error, context?: Record<string, any>, userId?: string): void => {
    if (!isTracking) return;
    analyticsService.trackError(domain, error, context, userId);
  }, [analyticsService, isTracking]);

  const trackPerformance = useCallback((domain: string, metric: string, value: number, userId?: string): void => {
    if (!isTracking) return;
    analyticsService.trackPerformance(domain, metric, value, userId);
  }, [analyticsService, isTracking]);

  // Data access functions
  const getEvents = useCallback((filter?: {
    type?: AnalyticsEvent['type'];
    domain?: string;
    since?: number;
    limit?: number;
  }): AnalyticsEvent[] => {
    return analyticsService.getEvents(filter);
  }, [analyticsService]);

  const exportData = useCallback(() => {
    return analyticsService.exportData();
  }, [analyticsService]);

  const clearData = useCallback(() => {
    analyticsService.clearData();
  }, [analyticsService]);

  return {
    metrics,
    domainMetrics,
    trackAIRequest,
    trackAIResponse,
    trackDomainSwitch,
    trackError,
    trackPerformance,
    getEvents,
    exportData,
    clearData,
    isTracking
  };
};

// Hook for domain-specific analytics
export const useDomainAnalytics = (domain: string): {
  domainMetrics: DomainMetrics | null;
  domainEvents: AnalyticsEvent[];
  trackRequest: (prompt: string, userId?: string) => string;
  trackResponse: (requestId: string, responseTime: number, success: boolean, userId?: string) => void;
  trackError: (error: Error, context?: Record<string, any>, userId?: string) => void;
} => {
  const { 
    domainMetrics: allDomainMetrics, 
    getEvents, 
    trackAIRequest, 
    trackAIResponse, 
    trackError 
  } = useAnalytics();
  
  const domainMetrics = allDomainMetrics.find(m => m.domain === domain) || null;
  const domainEvents = getEvents({ domain, limit: 100 });
  
  const trackRequest = useCallback((prompt: string, userId?: string): string => {
    return trackAIRequest(domain, prompt, userId);
  }, [domain, trackAIRequest]);
  
  const trackResponse = useCallback((requestId: string, responseTime: number, success: boolean, userId?: string): void => {
    trackAIResponse(requestId, domain, responseTime, success, userId);
  }, [domain, trackAIResponse]);
  
  const trackDomainError = useCallback((error: Error, context?: Record<string, any>, userId?: string): void => {
    trackError(domain, error, context, userId);
  }, [domain, trackError]);
  
  return {
    domainMetrics,
    domainEvents,
    trackRequest,
    trackResponse,
    trackError: trackDomainError
  };
};

// Hook for real-time metrics updates
export const useRealTimeMetrics = (updateInterval: number = 5000): {
  metrics: PerformanceMetrics | null;
  isLive: boolean;
  toggleLive: () => void;
} => {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [isLive, setIsLive] = useState(true);
  
  const analyticsService = getAnalyticsService();
  
  useEffect(() => {
    if (!isLive) return;
    
    const updateMetrics = () => {
      setMetrics(analyticsService.getMetrics());
    };
    
    // Initial update
    updateMetrics();
    
    // Set up interval
    const interval = setInterval(updateMetrics, updateInterval);
    
    return () => clearInterval(interval);
  }, [analyticsService, updateInterval, isLive]);
  
  const toggleLive = useCallback(() => {
    setIsLive(prev => !prev);
  }, []);
  
  return {
    metrics,
    isLive,
    toggleLive
  };
};