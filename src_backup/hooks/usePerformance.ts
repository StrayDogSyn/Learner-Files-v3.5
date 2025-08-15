import { useEffect, useState, useRef } from 'react';

interface PerformanceMetrics {
  fps: number;
  frameTime: number;
  isLowPerformance: boolean;
}

interface UsePerformanceMonitorOptions {
  threshold?: number; // FPS threshold below which is considered low performance
  sampleSize?: number; // Number of frames to average over
  enabled?: boolean;
}

export function usePerformanceMonitor({
  threshold = 30,
  sampleSize = 60,
  enabled = true
}: UsePerformanceMonitorOptions = {}): PerformanceMetrics {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 60,
    frameTime: 16.67,
    isLowPerformance: false
  });

  const frameTimesRef = useRef<number[]>([]);
  const lastFrameTimeRef = useRef<number>(performance.now());
  const animationFrameRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (!enabled) return;

    const measurePerformance = () => {
      const now = performance.now();
      const frameTime = now - lastFrameTimeRef.current;
      lastFrameTimeRef.current = now;

      // Add frame time to rolling average
      frameTimesRef.current.push(frameTime);
      if (frameTimesRef.current.length > sampleSize) {
        frameTimesRef.current.shift();
      }

      // Calculate metrics every few frames to avoid excessive updates
      if (frameTimesRef.current.length >= 10 && frameTimesRef.current.length % 10 === 0) {
        const avgFrameTime = frameTimesRef.current.reduce((sum, time) => sum + time, 0) / frameTimesRef.current.length;
        const fps = Math.round(1000 / avgFrameTime);
        const isLowPerformance = fps < threshold;

        setMetrics({
          fps,
          frameTime: avgFrameTime,
          isLowPerformance
        });

        // Log performance warnings
        if (isLowPerformance && fps < threshold * 0.5) {
          console.warn(`Low performance detected: ${fps}fps (threshold: ${threshold}fps)`);
        }
      }

      animationFrameRef.current = requestAnimationFrame(measurePerformance);
    };

    animationFrameRef.current = requestAnimationFrame(measurePerformance);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [enabled, threshold, sampleSize]);

  return metrics;
}

// Hook specifically for Three.js performance monitoring
export function useThreePerformance() {
  const performance = usePerformanceMonitor({
    threshold: 24, // Lower threshold for 3D content
    sampleSize: 30,
    enabled: true
  });

  // Return performance-based settings
  return {
    ...performance,
    shouldReduceQuality: performance.isLowPerformance,
    particleCount: performance.isLowPerformance ? 250 : 1000,
    animationSpeed: performance.isLowPerformance ? 0.5 : 1,
    enableAnimations: performance.fps > 15, // Disable animations if too slow
    renderQuality: performance.isLowPerformance ? 0.5 : 1
  };
}
