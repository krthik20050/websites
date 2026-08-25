"use client";
import { useTheme } from "./ThemeProvider";
import { motion } from "framer-motion";
import { useRef } from "react";

// Skipper UI-inspired theme toggle - circle reveal via View Transition API + framer-motion icons
// Reference: https://skiper-ui.com/v1/skiper26 (variants: circle, start: center)
// Uses View Transition API if available, falls back to instant toggle
export default function SkiperToggle({ variant = "circle", start = "center" }: { variant?: "circle" | "circle-blur" | "rectangle"; start?: "center" | "top-left" | "top-right" | "bottom-left" | "bottom-right" }) {
  const { theme, toggle } = useTheme();
  const isDark = theme === "dark";
  const btnRef = useRef<HTMLButtonElement>(null);

  const handleToggle = () => {
    const el = btnRef.current;
    if (!el) return toggle();

    // Skipper-style: use View Transition for circle reveal when available
    // @ts-ignore View Transition API is experimental
    const vt = (document as any).startViewTransition;
    if (!vt) {
      toggle();
      return;
    }

    const rect = el.getBoundingClientRect();
    const x = start === "center" ? rect.left + rect.width / 2 : start.includes("left") ? 0 : window.innerWidth;
    const y = start === "center" ? rect.top + rect.height / 2 : start.includes("top") ? 0 : window.innerHeight;
    const endRadius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));

    // @ts-ignore
    const transition = document.startViewTransition(() => {
      toggle();
    });
    transition.ready.then(() => {
      const clip = [
        `circle(0px at ${x}px ${y}px)`,
        `circle(${endRadius}px at ${x}px ${y}px)`,
      ];
      document.documentElement.animate(
        {
          clipPath: isDark ? [...clip].reverse() : clip,
        },
        {
          duration: 500,
          easing: "ease-in-out",
          pseudoElement: isDark ? "::view-transition-old(root)" : "::view-transition-new(root)",
        }
      );
    });
  };

  return (
    <button
      ref={btnRef}
      onClick={handleToggle}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      aria-pressed={isDark}
      title={`Switch to ${isDark ? "light" : "dark"} mode`}
      className="relative inline-flex items-center justify-center w-9 h-9 rounded-full bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-zinc-900 dark:focus-visible:ring-white transition-colors"
    >
      {/* Accessible label for screen readers - visible tooltip on hover */}
      <span className="sr-only">Toggle theme - currently {isDark ? "dark" : "light"}</span>
      <motion.div
        key={isDark ? "dark" : "light"}
        initial={{ rotate: -30, scale: 0.8, opacity: 0 }}
        animate={{ rotate: 0, scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="text-zinc-700 dark:text-zinc-200"
        aria-hidden
      >
        {isDark ? (
          // Moon for dark mode indicating switch to light
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24" aria-hidden>
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </svg>
        ) : (
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24" aria-hidden>
            <circle cx="12" cy="12" r="5" />
            <path d="M12 1v1M12 22v1M4.2 4.2l.7.7M18.4 18.4l.7.7M1 12h1M22 12h1M4.2 19.8l.7-.7M18.4 5.6l.7-.7" />
          </svg>
        )}
      </motion.div>
    </button>
  );
}
