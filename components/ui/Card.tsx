"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";
import { cardHover } from "@/lib/animations";

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  gradient?: string;
  onClick?: () => void;
}

export function Card({ 
  children, 
  className = "", 
  hover = true,
  gradient,
  onClick 
}: CardProps) {
  const baseClasses = "bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-100";
  const hoverClasses = hover ? "hover:border-indigo-200 cursor-pointer" : "";
  const gradientClasses = gradient ? `bg-gradient-to-br ${gradient} text-white border-0` : "";

  if (hover && onClick) {
    return (
      <motion.div
        {...cardHover}
        onClick={onClick}
        className={`${baseClasses} ${hoverClasses} ${gradientClasses} ${className}`}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div className={`${baseClasses} ${gradientClasses} ${className}`}>
      {children}
    </div>
  );
}
