import { DomainType } from '@straydog/ai-orchestrator';

export interface RouteConfig {
  path: string;
  domain: DomainType;
  title: string;
  description: string;
  icon: string;
  color: string;
  isActive?: boolean;
}

export interface DomainRoute {
  domain: DomainType;
  basePath: string;
  routes: RouteConfig[];
  metadata: {
    title: string;
    description: string;
    primaryColor: string;
    accentColor: string;
    icon: string;
  };
}

export interface NavigationState {
  currentDomain: DomainType | null;
  currentRoute: string;
  breadcrumbs: Array<{
    label: string;
    path: string;
    domain?: DomainType;
  }>;
}

export interface AIRequestContext {
  domain: DomainType;
  route: string;
  userContext?: Record<string, any>;
  sessionId: string;
}