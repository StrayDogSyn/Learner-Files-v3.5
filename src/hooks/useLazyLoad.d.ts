interface UseLazyLoadOptions {
    threshold?: number;
    rootMargin?: string;
    triggerOnce?: boolean;
}
/**
 * Custom hook for lazy loading components using Intersection Observer
 * @param options Configuration options for the intersection observer
 * @returns Object containing ref to attach to element and visibility state
 */
export declare const useLazyLoad: (options?: UseLazyLoadOptions) => {
    elementRef: import("react").RefObject<HTMLDivElement>;
    isVisible: boolean;
    hasTriggered: boolean;
};
/**
 * Hook for lazy loading images with placeholder support
 * @param src Image source URL
 * @param placeholder Optional placeholder image URL
 * @returns Object with image ref, loading state, and current src
 */
export declare const useLazyImage: (src: string, placeholder?: string) => {
    elementRef: import("react").RefObject<HTMLDivElement>;
    imageSrc: string;
    isLoaded: boolean;
    isError: boolean;
    isVisible: boolean;
};
export default useLazyLoad;
//# sourceMappingURL=useLazyLoad.d.ts.map