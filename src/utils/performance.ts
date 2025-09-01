// Performance monitoring utilities

export const performanceMonitor = {
  // Measure component render time
  measureRender: (componentName: string, renderFn: () => void) => {
    if (process.env.NODE_ENV === 'development') {
      const start = performance.now();
      renderFn();
      const end = performance.now();
      console.log(`${componentName} render time: ${(end - start).toFixed(2)}ms`);
    } else {
      renderFn();
    }
  },

  // Measure async operation time
  measureAsync: async <T>(operationName: string, asyncFn: () => Promise<T>): Promise<T> => {
    if (process.env.NODE_ENV === 'development') {
      const start = performance.now();
      const result = await asyncFn();
      const end = performance.now();
      console.log(`${operationName} execution time: ${(end - start).toFixed(2)}ms`);
      return result;
    } else {
      return asyncFn();
    }
  },

  // Log memory usage (development only)
  logMemoryUsage: (context: string) => {
    if (process.env.NODE_ENV === 'development' && 'memory' in performance) {
      const memory = (performance as unknown as { memory: { usedJSHeapSize: number; totalJSHeapSize: number; jsHeapSizeLimit: number } }).memory;
      console.log(`Memory usage (${context}):`, {
        used: `${Math.round(memory.usedJSHeapSize / 1024 / 1024)} MB`,
        total: `${Math.round(memory.totalJSHeapSize / 1024 / 1024)} MB`,
        limit: `${Math.round(memory.jsHeapSizeLimit / 1024 / 1024)} MB`,
      });
    }
  },

  // Mark important user interactions
  markInteraction: (interactionName: string) => {
    if ('mark' in performance) {
      performance.mark(`interaction-${interactionName}`);
    }
  },
};

// Bundle size optimization utilities
export const bundleOptimization = {
  // Lazy import with error handling
  lazyImport: <T extends { default: React.ComponentType }>(importFn: () => Promise<T>) => {
    return React.lazy(async () => {
      try {
        return await importFn();
      } catch (error) {
        console.error('Lazy import failed:', error);
        // Return a fallback component
        return {
          default: () => React.createElement('div', 
            { className: 'p-4 text-red-600' },
            'Failed to load component'
          )
        };
      }
    });
  },

  // Preload critical resources
  preloadResource: (href: string, as: string) => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = href;
    link.as = as;
    document.head.appendChild(link);
  },

  // Preconnect to external domains
  preconnect: (href: string) => {
    const link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = href;
    document.head.appendChild(link);
  },
};

// Memory leak prevention
export const memoryManagement = {
  // Create abort controller for canceling requests
  createAbortController: () => new AbortController(),

  // Cleanup function generator
  createCleanup: (cleanupFns: (() => void)[]) => {
    return () => {
      cleanupFns.forEach(fn => {
        try {
          fn();
        } catch (error) {
          console.error('Cleanup function failed:', error);
        }
      });
    };
  },

  // Debounced cleanup for rapid updates
  debouncedCleanup: (cleanupFn: () => void, delay = 1000) => {
    let timeoutId: NodeJS.Timeout;
    
    return () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(cleanupFn, delay);
    };
  },
};

// Performance hooks (React-specific)
import React, { useEffect, useRef, useMemo, useCallback } from 'react';

// Hook to measure component mount time
export function useComponentPerformance(componentName: string) {
  const mountTime = useRef<number | undefined>(undefined);
  const renderCount = useRef(0);

  useEffect(() => {
    mountTime.current = performance.now();
    
    return () => {
      if (mountTime.current && process.env.NODE_ENV === 'development') {
        const lifeTime = performance.now() - mountTime.current;
        console.log(`${componentName} lifetime: ${lifeTime.toFixed(2)}ms, renders: ${renderCount.current}`);
      }
    };
  }, [componentName]);

  useEffect(() => {
    renderCount.current += 1;
  });
}

// Hook for expensive calculations with dependency tracking
export function useExpensiveCalculation<T>(
  calculationFn: () => T,
  deps: React.DependencyList,
  debugName?: string
): T {
  return useMemo(() => {
    if (process.env.NODE_ENV === 'development' && debugName) {
      const start = performance.now();
      const result = calculationFn();
      const end = performance.now();
      console.log(`${debugName} calculation time: ${(end - start).toFixed(2)}ms`);
      return result;
    }
    return calculationFn();
  }, [...(Array.isArray(deps) ? deps : []), calculationFn, debugName]);
}

// Hook for performance-optimized callbacks
export function useStableCallback<T extends (...args: unknown[]) => unknown>(
  callback: T,
  deps: React.DependencyList
): T {
  return useCallback(callback, deps) as T;
}

// Hook to detect slow renders
export function useRenderPerformance(componentName: string, threshold = 16) {
  const renderStart = useRef<number | undefined>(undefined);
  
  // Mark render start
  renderStart.current = performance.now();
  
  useEffect(() => {
    if (renderStart.current) {
      const renderTime = performance.now() - renderStart.current;
      if (renderTime > threshold && process.env.NODE_ENV === 'development') {
        console.warn(`Slow render detected in ${componentName}: ${renderTime.toFixed(2)}ms`);
      }
    }
  });
}

// Virtual scrolling utilities for large lists
export function useVirtualScrolling(
  items: unknown[],
  itemHeight: number,
  containerHeight: number,
  buffer = 5
) {
  const [scrollTop, setScrollTop] = React.useState(0);
  
  const visibleRange = useMemo(() => {
    const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - buffer);
    const endIndex = Math.min(
      items.length - 1,
      Math.ceil((scrollTop + containerHeight) / itemHeight) + buffer
    );
    
    return { startIndex, endIndex };
  }, [scrollTop, itemHeight, containerHeight, items.length, buffer]);
  
  const visibleItems = useMemo(() => {
    return items.slice(visibleRange.startIndex, visibleRange.endIndex + 1);
  }, [items, visibleRange.startIndex, visibleRange.endIndex]);
  
  return {
    visibleItems,
    visibleRange,
    totalHeight: items.length * itemHeight,
    onScroll: (e: React.UIEvent<HTMLDivElement>) => {
      setScrollTop(e.currentTarget.scrollTop);
    },
  };
}
