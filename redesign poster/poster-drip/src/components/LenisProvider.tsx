"use client";
import { useEffect } from "react";
import Lenis from "lenis";

export default function LenisProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const lenis = new Lenis({ autoRaf: true, lerp: 0.08 });
    return () => lenis.destroy();
  }, []);
  return <>{children}</>;
}
