"use client";

import { motion } from "framer-motion";

interface SkeletonLoaderProps {
  variant?: "card" | "text" | "circle" | "rect";
  count?: number;
  className?: string;
}

export function SkeletonLoader({ 
  variant = "card", 
  count = 1,
  className = "" 
}: SkeletonLoaderProps) {
  const baseClasses = "bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse";
  
  const variants = {
    card: "h-48 rounded-2xl",
    text: "h-4 rounded",
    circle: "w-12 h-12 rounded-full",
    rect: "h-32 rounded-xl",
  };

  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: i * 0.1 }}
          className={`${baseClasses} ${variants[variant]} ${className}`}
        />
      ))}
    </>
  );
}
