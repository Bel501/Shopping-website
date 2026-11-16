import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useDeviceCapabilities } from './useDeviceCapabilities';

gsap.registerPlugin(ScrollTrigger);

interface LenisContextValue {
  scrollTo: (target: string | number | HTMLElement, offset?: number) => void;
  scrollProgress: number;
}

const LenisContext = createContext<LenisContextValue>({
  scrollTo: () => {},
  scrollProgress: 0,
});

export const useLenisScroll = () => useContext(LenisContext);

export const SmoothScrollProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const lenisRef = useRef<Lenis | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const { prefersReducedMotion } = useDeviceCapabilities();

  useEffect(() => {
    if (prefersReducedMotion) {
      const handleNativeScroll = () => {
        const doc = document.documentElement;
        const max = doc.scrollHeight - window.innerHeight;
        setScrollProgress(max > 0 ? window.scrollY / max : 0);
      };
      window.addEventListener('scroll', handleNativeScroll, { passive: true });
      return () => window.removeEventListener('scroll', handleNativeScroll);
    }

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.95,
      touchMultiplier: 1.5,
    });

    lenisRef.current = lenis;

    lenis.on('scroll', (e: Lenis) => {
      ScrollTrigger.update();
      setScrollProgress(e.progress || 0);
    });

    const updateTicker = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateTicker);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(updateTicker);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [prefersReducedMotion]);

  const scrollTo = (target: string | number | HTMLElement, offset = 0) => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(target, { offset, duration: 1.35 });
    } else if (typeof target === 'string') {
      document.querySelector(target)?.scrollIntoView({ behavior: 'auto' });
    } else if (typeof target === 'number') {
      window.scrollTo({ top: target });
    }
  };

  return (
    <LenisContext.Provider value={{ scrollTo, scrollProgress }}>
      {children}
    </LenisContext.Provider>
  );
};
