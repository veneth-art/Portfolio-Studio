import React, { useLayoutEffect, useRef, useCallback, useEffect } from 'react';
import type { ReactNode } from 'react';
import './ScrollStack.css';

export interface ScrollStackItemProps {
  itemClassName?: string;
  children: ReactNode;
}

export const ScrollStackItem: React.FC<ScrollStackItemProps> = ({ children, itemClassName = '' }) => (
  <div className={`scroll-stack-card ${itemClassName}`.trim()}>{children}</div>
);

interface ScrollStackProps {
  className?: string;
  children: ReactNode;
  itemDistance?: number;
  itemScale?: number;
  itemStackDistance?: number;
  stackPosition?: string;
  scaleEndPosition?: string;
  baseScale?: number;
  scaleDuration?: number;
  rotationAmount?: number;
  blurAmount?: number;
  useWindowScroll?: boolean;
  onStackComplete?: () => void;
  active?: boolean;
}

const ScrollStack: React.FC<ScrollStackProps> = ({
  children,
  className = '',
  itemDistance = 100,
  itemScale = 0.03,
  itemStackDistance = 30,
  stackPosition = '20%',
  scaleEndPosition = '10%',
  baseScale = 0.85,
  scaleDuration = 0.5,
  rotationAmount = 0,
  blurAmount = 0,
  useWindowScroll = false,
  onStackComplete,
  active = true
}) => {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const stackCompletedRef = useRef(false);
  const activeRef = useRef(active);
  const cardsRef = useRef<HTMLElement[]>([]);
  const offsetsRef = useRef<number[]>([]);
  const endOffsetRef = useRef(0);
  const lastScrollYRef = useRef(-1);
  const applyRef = useRef<() => void>(() => {});

  activeRef.current = active;

  const parsePercentage = useCallback((value: string | number, containerHeight: number) => {
    if (typeof value === 'string' && value.includes('%')) {
      return (parseFloat(value) / 100) * containerHeight;
    }
    return parseFloat(value as string);
  }, []);

  const apply = useCallback(() => {
    const cards = cardsRef.current;
    if (!cards.length) return;

    const scrollTop = useWindowScroll
      ? window.scrollY
      : scrollerRef.current!.scrollTop;

    if (scrollTop === lastScrollYRef.current) return;
    lastScrollYRef.current = scrollTop;

    const containerHeight = useWindowScroll
      ? document.documentElement.clientHeight
      : scrollerRef.current!.clientHeight;

    const stackPositionPx = parsePercentage(stackPosition, containerHeight);
    const scaleEndPositionPx = parsePercentage(scaleEndPosition, containerHeight);
    const pinEnd = endOffsetRef.current - containerHeight / 2;

    for (let i = 0; i < cards.length; i++) {
      const card = cards[i];
      if (!card) continue;

      const cardTop = offsetsRef.current[i];
      const triggerStart = cardTop - stackPositionPx - itemStackDistance * i;
      const triggerEnd = cardTop - scaleEndPositionPx;

      const progress = scrollTop < triggerStart ? 0 : scrollTop > triggerEnd ? 1 : (scrollTop - triggerStart) / (triggerEnd - triggerStart);
      const targetScale = baseScale + i * itemScale;
      const s = (1 - progress * (1 - targetScale)).toFixed(4);

      let y = 0;
      if (scrollTop > triggerStart) {
        y = scrollTop > pinEnd
          ? Math.round(pinEnd - cardTop + stackPositionPx + itemStackDistance * i)
          : Math.round(scrollTop - cardTop + stackPositionPx + itemStackDistance * i);
      }

      card.style.transform = `translate3d(0,${y}px,0) scale(${s})`;
    }
  }, [
    itemScale,
    itemStackDistance,
    stackPosition,
    scaleEndPosition,
    baseScale,
    rotationAmount,
    blurAmount,
    useWindowScroll,
    onStackComplete,
    parsePercentage
  ]);

  applyRef.current = apply;

  const recalc = useCallback(() => {
    const cards = cardsRef.current;
    if (!cards.length) return;

    // Reset transforms to get un-transformed positions
    cards.forEach(c => {
      c.style.transform = 'none';
    });

    offsetsRef.current = cards.map(c => {
      if (useWindowScroll) {
        const r = c.getBoundingClientRect();
        return r.top + window.scrollY;
      }
      return c.offsetTop;
    });

    if (useWindowScroll) {
      const e = document.querySelector('.scroll-stack-end');
      if (e) {
        const r = e.getBoundingClientRect();
        endOffsetRef.current = r.top + window.scrollY;
      }
    } else {
      const e = scrollerRef.current?.querySelector('.scroll-stack-end');
      if (e) {
        endOffsetRef.current = (e as HTMLElement).offsetTop;
      }
    }

    // Force apply immediately
    lastScrollYRef.current = -1;
    apply();
  }, [useWindowScroll, apply]);

  useLayoutEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const cards = Array.from(
      useWindowScroll
        ? document.querySelectorAll('.scroll-stack-card')
        : scroller.querySelectorAll('.scroll-stack-card')
    ) as HTMLElement[];

    cardsRef.current = cards;

    cards.forEach((card, i) => {
      if (i < cards.length - 1) card.style.marginBottom = `${itemDistance}px`;
      card.style.transformOrigin = 'top center';
      card.style.willChange = 'transform';
      card.style.zIndex = `${i}`;
    });

    recalc();

    if (useWindowScroll) {
      let rafId: number;
      const tick = () => {
        rafId = requestAnimationFrame(tick);
        if (activeRef.current && applyRef.current) {
          applyRef.current();
        }
      };
      rafId = requestAnimationFrame(tick);

      window.addEventListener('resize', recalc, { passive: true });

      return () => {
        cancelAnimationFrame(rafId);
        window.removeEventListener('resize', recalc);
        cardsRef.current = [];
        offsetsRef.current = [];
        endOffsetRef.current = 0;
        stackCompletedRef.current = false;
      };
    }

    return () => {
      cardsRef.current = [];
      offsetsRef.current = [];
      endOffsetRef.current = 0;
      stackCompletedRef.current = false;
    };
  }, [
    itemDistance,
    useWindowScroll,
    onStackComplete,
    recalc
  ]);

  useLayoutEffect(() => {
    lastScrollYRef.current = -1;
    apply();
  }, [active, apply]);

  return (
    <div className={`scroll-stack-scroller ${className}`.trim()} ref={scrollerRef}>
      <div className="scroll-stack-inner">
        {children}
        <div className="scroll-stack-end" />
      </div>
    </div>
  );
};

export default ScrollStack;
