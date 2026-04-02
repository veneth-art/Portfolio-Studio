import { useEffect, useRef } from "react";
import Lenis from "lenis";

interface SmoothScrollProps {
  children: React.ReactNode;
  scrollLock?: boolean;
}

export default function SmoothScroll({ children, scrollLock }: SmoothScrollProps) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });
    lenisRef.current = lenis;

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    const rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  useEffect(() => {
    if (lenisRef.current) {
      if (scrollLock) {
        lenisRef.current.stop();
      } else {
        lenisRef.current.start();
      }
    }
  }, [scrollLock]);

  return <>{children}</>;
}
