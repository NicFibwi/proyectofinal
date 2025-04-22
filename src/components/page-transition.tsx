"use client";

import type React from "react";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const [isTransitioning, setIsTransitioning] = useState(true); // Start with transitioning
  const [displayChildren, setDisplayChildren] = useState(children);

  useEffect(() => {
    // After a short delay, stop the transition
    const timeout = setTimeout(() => {
      setIsTransitioning(false);
    }, 300);

    return () => clearTimeout(timeout);
  }, []); // Only run on mount

  useEffect(() => {
    // Update displayed children when the pathname changes
    setDisplayChildren(children);
  }, [children]);

  return (
    <div
      className={`transition-all duration-300 ${
        isTransitioning ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"
      }`}
    >
      {displayChildren}
    </div>
  );
}