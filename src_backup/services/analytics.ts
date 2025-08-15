// Analytics Service for StrayDog Syndications Portfolio
// Supports Google Analytics 4 and Plausible Analytics with privacy focus

interface AnalyticsEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
  custom_parameters?: Record<string, any>;
}

interface HeatmapEvent {
  element: string;
  x: number;
  y: number;
  timestamp: number;
  page: string;
  type: 'click' | 'hover';
}

// Extend Window interface for Google Analytics
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

class AnalyticsService {
  private isInitialized = false;
  private heatmapData: HeatmapEvent[] = [];

  constructor() {
    // Initialize analytics service
    this.initializeAnalytics();
  }



  private async initializeAnalytics() {
    try {
      // Initialize Google Analytics 4 if tracking ID is provided
      const ga4Id = import.meta.env.VITE_GA4_MEASUREMENT_ID;
      if (ga4Id) {
        await this.initializeGA4(ga4Id);
      }

      // Initialize Plausible if domain is provided
      const plausibleDomain = import.meta.env.VITE_PLAUSIBLE_DOMAIN;
      if (plausibleDomain) {
        await this.initializePlausible(plausibleDomain);
      }

      // Initialize heatmap tracking
      this.initializeHeatmapTracking();
      
      this.isInitialized = true;
      console.log('✅ Analytics initialized successfully');
    } catch (error) {
      console.warn('⚠️ Analytics initialization failed:', error);
    }
  }

  private async initializeGA4(measurementId: string) {
    // Load Google Analytics 4
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    document.head.appendChild(script);

    // Initialize gtag
    window.dataLayer = window.dataLayer || [];
    function gtag(...args: any[]) {
      window.dataLayer.push(args);
    }
    
    gtag('js', new Date());
    gtag('config', measurementId, {
      anonymize_ip: true,
      respect_dnt: true,
      allow_google_signals: false,
      allow_ad_personalization_signals: false
    });

    // Make gtag globally available
    (window as any).gtag = gtag;
  }

  private async initializePlausible(domain: string) {
    // Load Plausible Analytics
    const script = document.createElement('script');
    script.defer = true;
    script.setAttribute('data-domain', domain);
    script.src = 'https://plausible.io/js/script.js';
    document.head.appendChild(script);
  }

  private initializeHeatmapTracking() {
    // Track clicks and hovers for heatmap data
    document.addEventListener('click', (event) => {
      this.recordHeatmapEvent(event);
    });

    // Track mouse movements (throttled)
    let lastMoveTime = 0;
    document.addEventListener('mousemove', (event) => {
      const now = Date.now();
      if (now - lastMoveTime > 1000) { // Throttle to once per second
        this.recordHeatmapEvent(event);
        lastMoveTime = now;
      }
    });
  }

  private recordHeatmapEvent(event: MouseEvent) {
    try {
      const target = event.target as HTMLElement;
      if (!target || !target.tagName) {
        return; // Skip if target is invalid
      }
      
      const elementInfo = this.getElementInfo(target);
      const eventType = event.type === 'click' ? 'click' : 'hover';
      
      const heatmapEvent: HeatmapEvent = {
        element: elementInfo,
        x: event.clientX,
        y: event.clientY,
        timestamp: Date.now(),
        page: window.location.pathname,
        type: eventType as 'click' | 'hover'
      };

      this.heatmapData.push(heatmapEvent);
      
      // Keep only last 1000 events to prevent memory issues
      if (this.heatmapData.length > 1000) {
        this.heatmapData = this.heatmapData.slice(-1000);
      }

      // Store in localStorage for persistence
      try {
        localStorage.setItem('straydog_heatmap', JSON.stringify(this.heatmapData));
      } catch (error) {
        console.warn('Failed to store heatmap data:', error);
      }
    } catch (error) {
      console.warn('Error recording heatmap event:', error);
    }
  }

  private getElementInfo(element: HTMLElement): string {
    try {
      if (!element || !element.tagName) {
        return 'unknown-element';
      }
      
      const tagName = element.tagName.toLowerCase();
      const id = element.id ? `#${element.id}` : '';
      const className = element.className && typeof element.className === 'string' 
        ? `.${element.className.split(' ').filter(c => c.trim()).join('.')}` 
        : '';
      const textContent = element.textContent?.slice(0, 50) || '';
      
      return `${tagName}${id}${className} - ${textContent}`.trim();
    } catch (error) {
      console.warn('Error getting element info:', error);
      return 'error-element';
    }
  }

  // Public methods for tracking events
  trackEvent(event: AnalyticsEvent) {
    if (!this.isInitialized) {
      console.warn('Analytics not initialized yet');
      return;
    }

    // Track with Google Analytics 4
    if ((window as any).gtag) {
      (window as any).gtag('event', event.action, {
        event_category: event.category,
        event_label: event.label,
        value: event.value,
        ...event.custom_parameters
      });
    }

    // Track with Plausible
    if ((window as any).plausible) {
      (window as any).plausible(event.action, {
        props: {
          category: event.category,
          label: event.label,
          value: event.value,
          ...event.custom_parameters
        }
      });
    }

    console.log('📊 Analytics event tracked:', event);
  }

  trackPageView(path?: string) {
    const page = path || window.location.pathname;
    
    if ((window as any).gtag) {
      (window as any).gtag('config', import.meta.env.VITE_GA4_MEASUREMENT_ID, {
        page_path: page
      });
    }

    if ((window as any).plausible) {
      (window as any).plausible('pageview', { u: window.location.href });
    }

    console.log('📄 Page view tracked:', page);
  }

  // Portfolio-specific tracking methods
  trackProjectView(projectName: string) {
    this.trackEvent({
      action: 'project_view',
      category: 'portfolio',
      label: projectName
    });
  }

  trackSkillInteraction(skillName: string) {
    this.trackEvent({
      action: 'skill_interaction',
      category: 'engagement',
      label: skillName
    });
  }

  trackContactAttempt(method: string) {
    this.trackEvent({
      action: 'contact_attempt',
      category: 'conversion',
      label: method
    });
  }

  trackThemeToggle(theme: string) {
    this.trackEvent({
      action: 'theme_toggle',
      category: 'ui_interaction',
      label: theme
    });
  }

  trackDownload(fileName: string) {
    this.trackEvent({
      action: 'download',
      category: 'engagement',
      label: fileName
    });
  }

  // Heatmap data export
  exportHeatmapData(): HeatmapEvent[] {
    return [...this.heatmapData];
  }

  clearHeatmapData() {
    this.heatmapData = [];
    localStorage.removeItem('straydog_heatmap');
  }

  // Privacy compliance
  setConsentStatus(hasConsent: boolean) {
    if ((window as any).gtag) {
      (window as any).gtag('consent', 'update', {
        analytics_storage: hasConsent ? 'granted' : 'denied'
      });
    }
  }
}

// Create singleton instance
export const analytics = new AnalyticsService();

// Export types for use in components
export type { AnalyticsEvent, HeatmapEvent };