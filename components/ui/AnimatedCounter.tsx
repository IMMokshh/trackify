"use client";

import { useEffect, useState } from "react";
import { motion, useSpring, useTransform } from "framer-motion";

interface AnimatedCounterProps {
  value: number | string;
  duration?: number;
}

export default function AnimatedCounter({ value, duration = 800 }: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState<number | string>(value);

  useEffect(() => {
    if (typeof value === "number") {
      let start = 0;
      const end = value;
      const increment = end / (duration / 16);
      let current = start;

      const timer = setInterval(() => {
        current += increment;
        if (current >= end) {
          setDisplayValue(end);
          clearInterval(timer);
        } else {
          setDisplayValue(Math.floor(current));
        }
      }, 16);

      return () => clearInterval(timer);
    } else {
      setDisplayValue(value);
    }
  }, [value, duration]);

  return <span>{displayValue}</span>;
}
