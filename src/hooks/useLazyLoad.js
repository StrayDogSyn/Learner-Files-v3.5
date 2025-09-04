// Custom hook for lazy loading components with Intersection Observer
import { useEffect, useRef, useState } from 'react';
/**
 * Custom hook for lazy loading components using Intersection Observer
 * @param options Configuration options for the intersection observer
 * @returns Object containing ref to attach to element and visibility state
 */
export const useLazyLoad = (options = {}) => {
    const { threshold = 0.1, rootMargin = '50px', triggerOnce = true } = options;
    const [isVisible, setIsVisible] = useState(false);
    const [hasTriggered, setHasTriggered] = useState(false);
    const elementRef = useRef(null);
    useEffect(() => {
        const element = elementRef.current;
        if (!element || (triggerOnce && hasTriggered)) {
            return;
        }
        // Check if IntersectionObserver is supported
        if (!('IntersectionObserver' in window)) {
            // Fallback: immediately set as visible
            setIsVisible(true);
            setHasTriggered(true);
            return;
        }
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    setHasTriggered(true);
                    if (triggerOnce) {
                        observer.unobserve(element);
                    }
                }
                else if (!triggerOnce) {
                    setIsVisible(false);
                }
            });
        }, {
            threshold,
            rootMargin
        });
        observer.observe(element);
        return () => {
            observer.unobserve(element);
        };
    }, [threshold, rootMargin, triggerOnce, hasTriggered]);
    return {
        elementRef,
        isVisible,
        hasTriggered
    };
};
/**
 * Hook for lazy loading images with placeholder support
 * @param src Image source URL
 * @param placeholder Optional placeholder image URL
 * @returns Object with image ref, loading state, and current src
 */
export const useLazyImage = (src, placeholder) => {
    const [imageSrc, setImageSrc] = useState(placeholder || '');
    const [isLoaded, setIsLoaded] = useState(false);
    const [isError, setIsError] = useState(false);
    const { elementRef, isVisible } = useLazyLoad({ threshold: 0.1 });
    useEffect(() => {
        if (!isVisible || !src)
            return;
        const img = new Image();
        img.onload = () => {
            setImageSrc(src);
            setIsLoaded(true);
            setIsError(false);
        };
        img.onerror = () => {
            setIsError(true);
            setIsLoaded(false);
        };
        img.src = src;
    }, [isVisible, src]);
    return {
        elementRef,
        imageSrc,
        isLoaded,
        isError,
        isVisible
    };
};
export default useLazyLoad;
//# sourceMappingURL=useLazyLoad.js.map