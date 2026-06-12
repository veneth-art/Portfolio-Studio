import { useLayoutEffect, useRef } from "react";
import Lenis from "lenis";

interface SmoothScrollProps {
  children: React.ReactNode;
  scrollLock?: boolean;
}

export default function SmoothScroll({ children, scrollLock }: SmoothScrollProps) {
  const lenisRef = useRef<Lenis | null>(null);

  useLayoutEffect(() => {
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

  useLayoutEffect(() => {
    const lenis = lenisRef.current;
    if (!lenis) return;
    if (scrollLock) {
      lenis.stop();
    } else {
      lenis.scrollTo(window.scrollY, { immediate: true });
      lenis.start();
    }
  }, [scrollLock]);

  return <>{children}</>;
}
