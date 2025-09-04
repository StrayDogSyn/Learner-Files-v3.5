import { DomainRoute, RouteConfig } from '@/types/routing';
import { DomainType } from '@straydog/ai-orchestrator';

export const DOMAIN_ROUTES: Record<DomainType, DomainRoute> = {
  corporate: {
    domain: 'corporate',
    basePath: '/corporate',
    metadata: {
      title: 'Corporate Solutions',
      description: 'Business-focused AI solutions for justice reform impact',
      primaryColor: '#2D5016', // Hunter Green
      accentColor: '#4A7C59', // Tech Accent
      icon: 'Building2'
    },
    routes: [
      {
        path: '/corporate',
        domain: 'corporate',
        title: 'Dashboard',
        description: 'Corporate AI dashboard and analytics',
        icon: 'BarChart3',
        color: '#2D5016'
      },
      {
        path: '/corporate/roi-analysis',
        domain: 'corporate',
        title: 'ROI Analysis',
        description: 'AI-powered return on investment calculations',
        icon: 'TrendingUp',
        color: '#2D5016'
      },
      {
        path: '/corporate/client-engagement',
        domain: 'corporate',
        title: 'Client Engagement',
        description: 'Professional client communication tools',
        icon: 'Users',
        color: '#2D5016'
      },
      {
        path: '/corporate/impact-metrics',
        domain: 'corporate',
        title: 'Impact Metrics',
        description: 'Justice reform impact measurement',
        icon: 'Target',
        color: '#2D5016'
      }
    ]
  },
  technical: {
    domain: 'technical',
    basePath: '/technical',
    metadata: {
      title: 'Technical Excellence',
      description: 'Developer-focused AI tools and system architecture',
      primaryColor: '#2D5016',
      accentColor: '#4A7C59',
      icon: 'Code2'
    },
    routes: [
      {
        path: '/technical',
        domain: 'technical',
        title: 'Dev Dashboard',
        description: 'Technical AI dashboard and system metrics',
        icon: 'Monitor',
        color: '#4A7C59'
      },
      {
        path: '/technical/code-assistant',
        domain: 'technical',
        title: 'Code Assistant',
        description: 'AI-powered code generation and review',
        icon: 'Code',
        color: '#4A7C59'
      },
      {
        path: '/technical/architecture',
        domain: 'technical',
        title: 'System Architecture',
        description: 'AI system design and optimization',
        icon: 'Network',
        color: '#4A7C59'
      },
      {
        path: '/technical/performance',
        domain: 'technical',
        title: 'Performance',
        description: 'AI performance monitoring and optimization',
        icon: 'Zap',
        color: '#4A7C59'
      }
    ]
  },
  educational: {
    domain: 'educational',
    basePath: '/educational',
    metadata: {
      title: 'Educational Platform',
      description: 'Inclusive learning experiences for career transitions',
      primaryColor: '#2D5016',
      accentColor: '#6B8E23',
      icon: 'GraduationCap'
    },
    routes: [
      {
        path: '/educational',
        domain: 'educational',
        title: 'Learning Hub',
        description: 'Educational AI dashboard and progress tracking',
        icon: 'BookOpen',
        color: '#6B8E23'
      },
      {
        path: '/educational/curriculum',
        domain: 'educational',
        title: 'Curriculum',
        description: 'AI-powered curriculum development',
        icon: 'FileText',
        color: '#6B8E23'
      },
      {
        path: '/educational/assessment',
        domain: 'educational',
        title: 'Skill Assessment',
        description: 'Personalized skill evaluation and guidance',
        icon: 'CheckCircle',
        color: '#6B8E23'
      },
      {
        path: '/educational/career-guidance',
        domain: 'educational',
        title: 'Career Guidance',
        description: 'AI-driven career transition support',
        icon: 'Compass',
        color: '#6B8E23'
      }
    ]
  },
  'justice-reform': {
    domain: 'justice-reform',
    basePath: '/justice-reform',
    metadata: {
      title: 'Justice Reform',
      description: 'Empathetic AI tools for social impact and advocacy',
      primaryColor: '#2D5016',
      accentColor: '#8FBC8F',
      icon: 'Scale'
    },
    routes: [
      {
        path: '/justice-reform',
        domain: 'justice-reform',
        title: 'Impact Hub',
        description: 'Justice reform AI dashboard and impact tracking',
        icon: 'Heart',
        color: '#8FBC8F'
      },
      {
        path: '/justice-reform/advocacy',
        domain: 'justice-reform',
        title: 'Advocacy Tools',
        description: 'AI-powered advocacy strategy development',
        icon: 'Megaphone',
        color: '#8FBC8F'
      },
      {
        path: '/justice-reform/policy-analysis',
        domain: 'justice-reform',
        title: 'Policy Analysis',
        description: 'AI-driven policy impact analysis',
        icon: 'FileSearch',
        color: '#8FBC8F'
      },
      {
        path: '/justice-reform/community',
        domain: 'justice-reform',
        title: 'Community Engagement',
        description: 'Volunteer coordination and community outreach',
        icon: 'Users2',
        color: '#8FBC8F'
      }
    ]
  }
};

export const getAllRoutes = (): RouteConfig[] => {
  return Object.values(DOMAIN_ROUTES).flatMap(domain => domain.routes);
};

export const getRoutesByDomain = (domain: DomainType): RouteConfig[] => {
  return DOMAIN_ROUTES[domain]?.routes || [];
};

export const getDomainByPath = (path: string): DomainType | null => {
  for (const [domain, config] of Object.entries(DOMAIN_ROUTES)) {
    if (path.startsWith(config.basePath)) {
      return domain as DomainType;
    }
  }
  return null;
};

export const getRouteConfig = (path: string): RouteConfig | null => {
  const allRoutes = getAllRoutes();
  return allRoutes.find(route => route.path === path) || null;
};

export const getDomainMetadata = (domain: DomainType) => {
  return DOMAIN_ROUTES[domain]?.metadata || null;
};