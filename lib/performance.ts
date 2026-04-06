/**
 * Performance monitoring utilities
 * Helps track and optimize app performance
 */

// Measure component render time
export function measureRender(componentName: string, callback: () => void) {
  if (typeof window === "undefined") return callback();
  
  const start = performance.now();
  callback();
  const end = performance.now();
  
  const duration = end - start;
  if (duration > 16) { // More than one frame at 60fps
    console.warn(`⚠️ Slow render: ${componentName} took ${duration.toFixed(2)}ms`);
  }
}

// Log performance metrics
export function logPerformanceMetrics() {
  if (typeof window === "undefined") return;

  // Get navigation timing
  const perfData = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming;
  
  if (perfData) {
    const metrics = {
      "DNS Lookup": perfData.domainLookupEnd - perfData.domainLookupStart,
      "TCP Connection": perfData.connectEnd - perfData.connectStart,
      "Request Time": perfData.responseStart - perfData.requestStart,
      "Response Time": perfData.responseEnd - perfData.responseStart,
      "DOM Processing": perfData.domComplete - perfData.domInteractive,
      "Load Complete": perfData.loadEventEnd - perfData.loadEventStart,
      "Total Load Time": perfData.loadEventEnd - perfData.fetchStart,
    };

    console.table(metrics);
  }

  // Get paint timing
  const paintEntries = performance.getEntriesByType("paint");
  paintEntries.forEach((entry) => {
    console.log(`${entry.name}: ${entry.startTime.toFixed(2)}ms`);
  });
}

// Detect slow network
export function isSlowNetwork(): boolean {
  if (typeof navigator === "undefined" || !("connection" in navigator)) {
    return false;
  }

  const connection = (navigator as any).connection;
  return connection?.effectiveType === "slow-2g" || connection?.effectiveType === "2g";
}

// Prefetch resources
export function prefetchResource(url: string) {
  if (typeof document === "undefined") return;

  const link = document.createElement("link");
  link.rel = "prefetch";
  link.href = url;
  document.head.appendChild(link);
}

// Lazy load images
export function lazyLoadImage(img: HTMLImageElement) {
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const image = entry.target as HTMLImageElement;
          if (image.dataset.src) {
            image.src = image.dataset.src;
            observer.unobserve(image);
          }
        }
      });
    });

    observer.observe(img);
  } else {
    // Fallback for browsers without IntersectionObserver
    if (img.dataset.src) {
      img.src = img.dataset.src;
    }
  }
}

// Report Web Vitals
export function reportWebVitals(metric: any) {
  // Log to console in development
  if (process.env.NODE_ENV === "development") {
    console.log(metric);
  }

  // Send to analytics in production
  if (process.env.NODE_ENV === "production") {
    // Example: Send to Google Analytics
    // window.gtag?.('event', metric.name, {
    //   value: Math.round(metric.value),
    //   event_label: metric.id,
    //   non_interaction: true,
    // });
  }
}

// Check if device has good performance
export function hasGoodPerformance(): boolean {
  if (typeof navigator === "undefined") return true;

  // Check device memory (if available)
  const memory = (navigator as any).deviceMemory;
  if (memory && memory < 4) return false;

  // Check hardware concurrency
  const cores = navigator.hardwareConcurrency;
  if (cores && cores < 4) return false;

  return true;
}
