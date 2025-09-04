import { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { DomainType } from '@straydog/ai-orchestrator';
import { NavigationState, RouteConfig } from '@/types/routing';
import { 
  getDomainByPath, 
  getRouteConfig, 
  getDomainMetadata,
  DOMAIN_ROUTES 
} from '@/utils/domain-routes';
import { AIRequestRouter } from '@/utils/ai-request-router';

export const useDomainRouting = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [navigationState, setNavigationState] = useState<NavigationState>({
    currentDomain: null,
    currentRoute: '/',
    breadcrumbs: []
  });

  const aiRouter = AIRequestRouter.getInstance();

  // Update navigation state when location changes
  useEffect(() => {
    const currentPath = location.pathname;
    const domain = getDomainByPath(currentPath);
    // const routeConfig = getRouteConfig(currentPath); // Removed unused variable
    
    // Generate breadcrumbs
    const breadcrumbs = generateBreadcrumbs(currentPath, domain);
    
    setNavigationState({
      currentDomain: domain,
      currentRoute: currentPath,
      breadcrumbs
    });
  }, [location.pathname]);

  // Generate breadcrumbs based on current path
  const generateBreadcrumbs = (path: string, domain: DomainType | null) => {
    const breadcrumbs = [{ label: 'Home', path: '/' }];
    
    if (domain) {
      const domainMetadata = getDomainMetadata(domain);
      if (domainMetadata) {
        breadcrumbs.push({
          label: domainMetadata.title,
          path: DOMAIN_ROUTES[domain].basePath
        });
      }
      
      // Add current route if it's not the domain root
      const routeConfig = getRouteConfig(path);
      if (routeConfig && path !== DOMAIN_ROUTES[domain].basePath) {
        breadcrumbs.push({
          label: routeConfig.title,
          path: routeConfig.path
        });
      }
    }
    
    return breadcrumbs;
  };

  // Navigate to a specific domain
  const navigateToDomain = useCallback((domain: DomainType) => {
    const domainConfig = DOMAIN_ROUTES[domain];
    if (domainConfig) {
      navigate(domainConfig.basePath);
    }
  }, [navigate]);

  // Navigate to a specific route within a domain
  const navigateToRoute = useCallback((path: string) => {
    navigate(path);
  }, [navigate]);

  // Get available routes for current domain
  const getCurrentDomainRoutes = useCallback((): RouteConfig[] => {
    if (!navigationState.currentDomain) return [];
    return DOMAIN_ROUTES[navigationState.currentDomain]?.routes || [];
  }, [navigationState.currentDomain]);

  // Get all available domains
  const getAllDomains = useCallback(() => {
    return Object.keys(DOMAIN_ROUTES) as DomainType[];
  }, []);

  // Check if a route is active
  const isRouteActive = useCallback((path: string): boolean => {
    return navigationState.currentRoute === path;
  }, [navigationState.currentRoute]);

  // Check if a domain is active
  const isDomainActive = useCallback((domain: DomainType): boolean => {
    return navigationState.currentDomain === domain;
  }, [navigationState.currentDomain]);

  // Get current domain metadata
  const getCurrentDomainMetadata = useCallback(() => {
    if (!navigationState.currentDomain) return null;
    return getDomainMetadata(navigationState.currentDomain);
  }, [navigationState.currentDomain]);

  // Create domain-aware AI request
  const createAIRequest = useCallback((message: string, userContext?: Record<string, any>) => {
    return aiRouter.createDomainAwareRequest(
      message,
      navigationState.currentRoute,
      userContext
    );
  }, [navigationState.currentRoute, aiRouter]);

  // Get navigation suggestions based on current context
  const getNavigationSuggestions = useCallback(() => {
    const suggestions: Array<{
      label: string;
      path: string;
      description: string;
      domain: DomainType;
    }> = [];

    // If not in a domain, suggest domain entry points
    if (!navigationState.currentDomain) {
      Object.entries(DOMAIN_ROUTES).forEach(([domain, config]) => {
        suggestions.push({
          label: config.metadata.title,
          path: config.basePath,
          description: config.metadata.description,
          domain: domain as DomainType
        });
      });
    } else {
      // If in a domain, suggest other routes in the same domain
      const currentDomainRoutes = getCurrentDomainRoutes();
      currentDomainRoutes
        .filter(route => route.path !== navigationState.currentRoute)
        .forEach(route => {
          suggestions.push({
            label: route.title,
            path: route.path,
            description: route.description,
            domain: route.domain
          });
        });

      // Also suggest other domains
      Object.entries(DOMAIN_ROUTES)
        .filter(([domain]) => domain !== navigationState.currentDomain)
        .forEach(([domain, config]) => {
          suggestions.push({
            label: `Switch to ${config.metadata.title}`,
            path: config.basePath,
            description: config.metadata.description,
            domain: domain as DomainType
          });
        });
    }

    return suggestions.slice(0, 6); // Limit to 6 suggestions
  }, [navigationState.currentDomain, navigationState.currentRoute, getCurrentDomainRoutes]);

  return {
    // State
    navigationState,
    currentDomain: navigationState.currentDomain,
    currentRoute: navigationState.currentRoute,
    breadcrumbs: navigationState.breadcrumbs,
    
    // Navigation functions
    navigateToDomain,
    navigateToRoute,
    
    // Query functions
    getCurrentDomainRoutes,
    getAllDomains,
    isRouteActive,
    isDomainActive,
    getCurrentDomainMetadata,
    getNavigationSuggestions,
    
    // AI integration
    createAIRequest
  };
};