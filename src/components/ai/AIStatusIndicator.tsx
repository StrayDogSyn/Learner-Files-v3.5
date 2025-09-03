// AI Status Indicator Component with Glassmorphic Design

import React, { useState, useEffect } from 'react';
import { Activity, AlertCircle, CheckCircle, Clock, Zap, Wifi, WifiOff } from 'lucide-react';
import { strayDogAI } from '../../ai';
import { DomainType } from '../../shared/types/ai';

interface ServiceStatus {
  name: string;
  status: 'online' | 'offline' | 'degraded' | 'maintenance';
  responseTime: number;
  lastCheck: Date;
  errorCount: number;
}

interface AIStatusIndicatorProps {
  className?: string;
  showDetails?: boolean;
  autoRefresh?: boolean;
  refreshInterval?: number;
  compact?: boolean;
}

const statusConfig = {
  online: {
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500/20',
    borderColor: 'border-emerald-500/30',
    icon: CheckCircle,
    label: 'Online'
  },
  offline: {
    color: 'text-red-400',
    bgColor: 'bg-red-500/20',
    borderColor: 'border-red-500/30',
    icon: WifiOff,
    label: 'Offline'
  },
  degraded: {
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-500/20',
    borderColor: 'border-yellow-500/30',
    icon: AlertCircle,
    label: 'Degraded'
  },
  maintenance: {
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/20',
    borderColor: 'border-blue-500/30',
    icon: Clock,
    label: 'Maintenance'
  }
};

export const AIStatusIndicator: React.FC<AIStatusIndicatorProps> = ({
  className = '',
  showDetails = true,
  autoRefresh = true,
  refreshInterval = 30000,
  compact = false
}) => {
  const [overallStatus, setOverallStatus] = useState<'online' | 'offline' | 'degraded' | 'maintenance'>('online');
  const [services, setServices] = useState<ServiceStatus[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const checkServiceHealth = async () => {
    try {
      setIsLoading(true);
      const startTime = Date.now();
      
      // Check overall system health
      const healthCheck = await strayDogAI.healthCheck();
      const responseTime = Date.now() - startTime;
      
      // Check rate limit status
      const rateLimitStatus = await strayDogAI.getRateLimitStatus('user123', 'free');
      
      // Simulate checking individual services
        const serviceChecks: ServiceStatus[] = [
          {
            name: 'Claude API',
            status: healthCheck.services.aiService ? 'online' : 'offline',
            responseTime: responseTime,
            lastCheck: new Date(),
            errorCount: 0
          },
          {
            name: 'Rate Limiter',
            status: healthCheck.services.rateLimiter ? 'online' : 'offline',
            responseTime: responseTime * 0.8,
            lastCheck: new Date(),
            errorCount: 0
          },
          {
            name: 'Analytics',
            status: healthCheck.services.analyticsService ? 'online' : 'offline',
            responseTime: responseTime * 0.6,
            lastCheck: new Date(),
            errorCount: 0
          },
          {
            name: 'Context Manager',
            status: healthCheck.services.contextManager ? 'online' : 'offline',
            responseTime: responseTime * 0.4,
            lastCheck: new Date(),
            errorCount: 0
          }
        ];
      
      setServices(serviceChecks);
      
      // Determine overall status
      const offlineServices = serviceChecks.filter(s => s.status === 'offline');
      const degradedServices = serviceChecks.filter(s => s.status === 'degraded');
      
      if (offlineServices.length > 0) {
        setOverallStatus('offline');
      } else if (degradedServices.length > 0) {
        setOverallStatus('degraded');
      } else {
        setOverallStatus('online');
      }
      
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Health check failed:', error);
      setOverallStatus('offline');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkServiceHealth();
    
    if (autoRefresh) {
      const interval = setInterval(checkServiceHealth, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [autoRefresh, refreshInterval]);

  const currentStatus = statusConfig[overallStatus];
  const StatusIcon = currentStatus.icon;

  if (compact) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${currentStatus.bgColor} border ${currentStatus.borderColor}`}>
          {isLoading ? (
            <Activity className="w-4 h-4 text-white animate-pulse" />
          ) : (
            <StatusIcon className={`w-4 h-4 ${currentStatus.color}`} />
          )}
          <span className={`text-sm font-medium ${currentStatus.color}`}>
            {currentStatus.label}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${currentStatus.bgColor} border ${currentStatus.borderColor}`}>
            {isLoading ? (
              <Activity className="w-5 h-5 text-white animate-pulse" />
            ) : (
              <StatusIcon className={`w-5 h-5 ${currentStatus.color}`} />
            )}
          </div>
          <div>
            <h3 className="font-semibold text-white">AI System Status</h3>
            <p className={`text-sm ${currentStatus.color}`}>
              {currentStatus.label} • Last updated {lastUpdate.toLocaleTimeString()}
            </p>
          </div>
        </div>
        
        <button
          onClick={checkServiceHealth}
          disabled={isLoading}
          className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors duration-200 disabled:opacity-50"
        >
          <Activity className={`w-4 h-4 text-white ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Service Details */}
      {showDetails && (
        <div className="space-y-3">
          {services.map((service, index) => {
            const serviceStatus = statusConfig[service.status];
            const ServiceIcon = serviceStatus.icon;
            
            return (
              <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                <div className="flex items-center gap-3">
                  <ServiceIcon className={`w-4 h-4 ${serviceStatus.color}`} />
                  <div>
                    <div className="text-white font-medium">{service.name}</div>
                    <div className="text-xs text-emerald-300/70">
                      {service.responseTime}ms • {service.lastCheck.toLocaleTimeString()}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {service.errorCount > 0 && (
                    <span className="text-xs text-red-400 bg-red-500/20 px-2 py-1 rounded">
                      {service.errorCount} errors
                    </span>
                  )}
                  <div className={`px-2 py-1 rounded text-xs font-medium ${serviceStatus.bgColor} ${serviceStatus.color}`}>
                    {serviceStatus.label}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Performance Metrics */}
      {showDetails && (
        <div className="mt-4 pt-4 border-t border-white/10">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-emerald-400">
                {services.length > 0 ? Math.round(services.reduce((acc, s) => acc + s.responseTime, 0) / services.length) : 0}ms
              </div>
              <div className="text-xs text-emerald-300/70">Avg Response</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-emerald-400">
                {services.filter(s => s.status === 'online').length}/{services.length}
              </div>
              <div className="text-xs text-emerald-300/70">Services Online</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-emerald-400">
                99.9%
              </div>
              <div className="text-xs text-emerald-300/70">Uptime</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIStatusIndicator;