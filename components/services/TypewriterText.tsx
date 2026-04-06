"use client";

import { useState, useEffect, memo } from "react";

interface TypewriterTextProps {
  text: string;
  speed?: number;
}

export const TypewriterText = memo(function TypewriterText({ text, speed = 18 }: TypewriterTextProps) {
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    setDisplayed("");
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) clearInterval(interval);
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed]);

  return <span>{displayed}</span>;
});
