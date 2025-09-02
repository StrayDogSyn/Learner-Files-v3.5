import { useEffect, useRef, useState } from 'react';

interface UseIntersectionObserverOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

export const useIntersectionObserver = (
  options: UseIntersectionObserverOptions = {}
) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  const {
    threshold = 0.1,
    rootMargin = '0px',
    triggerOnce = true
  } = options;

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isVisible = entry.isIntersecting;
        
        if (isVisible && !hasTriggered) {
          setIsIntersecting(true);
          if (triggerOnce) {
            setHasTriggered(true);
          }
        } else if (!triggerOnce) {
          setIsIntersecting(isVisible);
        }
      },
      {
        threshold,
        rootMargin
      }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [threshold, rootMargin, triggerOnce, hasTriggered]);

  return { elementRef, isIntersecting };
};

// Utility hook for multiple elements
export const useMultipleIntersectionObserver = (
  count: number,
  options: UseIntersectionObserverOptions = {}
) => {
  const [intersections, setIntersections] = useState<boolean[]>(
    new Array(count).fill(false)
  );
  const elementRefs = useRef<(HTMLDivElement | null)[]>(
    new Array(count).fill(null)
  );

  const {
    threshold = 0.1,
    rootMargin = '0px',
    triggerOnce = true
  } = options;

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    elementRefs.current.forEach((element, index) => {
      if (!element) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIntersections(prev => {
              const newState = [...prev];
              newState[index] = true;
              return newState;
            });
          } else if (!triggerOnce) {
            setIntersections(prev => {
              const newState = [...prev];
              newState[index] = false;
              return newState;
            });
          }
        },
        {
          threshold,
          rootMargin
        }
      );

      observer.observe(element);
      observers.push(observer);
    });

    return () => {
      observers.forEach(observer => observer.disconnect());
    };
  }, [threshold, rootMargin, triggerOnce]);

  const setElementRef = (index: number) => (element: HTMLDivElement | null) => {
    elementRefs.current[index] = element;
  };

  return { setElementRef, intersections };
};