"use client";

import { ReactNode, Suspense } from "react";
import { SkeletonLoader } from "./SkeletonLoader";

interface LazyLoadProps {
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * Wrapper component for lazy loading with Suspense
 * Provides consistent loading states across the app
 */
export function LazyLoad({ children, fallback }: LazyLoadProps) {
  return (
    <Suspense fallback={fallback || <SkeletonLoader variant="card" count={3} />}>
      {children}
    </Suspense>
  );
}
