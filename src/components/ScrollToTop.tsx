"use client";

import { ChevronUp } from "lucide-react";
import { useEffect, useState } from "react";

export default function ScrollToTopProgress() {
  const [scroll, setScroll] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = Math.min((window.scrollY / totalHeight) * 100, 100);
      setScroll(scrolled);
      setIsVisible(window.scrollY > window.innerHeight / 2); // Show after half viewport height
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const perimeter = 160; // 4 * 40 (square side length)
  const strokeDashoffset = perimeter - (scroll / 100) * perimeter;

  return (
    <button
      onClick={scrollToTop}
      className={`group bg-secondary fixed right-4 bottom-17 z-30 grid size-10 place-items-center overflow-hidden rounded-[4px] shadow-[2px_3px_6px_0px_rgba(0,0,0,0.30)] ${
        isVisible ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
      aria-label="Scroll to top"
    >
      <svg className="stroke-foreground/75 absolute h-full w-full">
        <rect
          x="2"
          y="2"
          width="36"
          height="36"
          rx="2"
          strokeWidth="2"
          fill="none"
          strokeDasharray={perimeter}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
        />
      </svg>
      {/* Icon Animation Container */}
      <div className="relative size-6.5 overflow-hidden">
        <ChevronUp className="absolute top-0 left-0 size-6.5 transform p-1 transition-transform duration-300 group-hover:-translate-y-full" />
        <ChevronUp className="absolute top-full left-0 size-6.5 transform p-1 transition-transform duration-300 group-hover:translate-y-[-100%]" />
      </div>
    </button>
  );
}
