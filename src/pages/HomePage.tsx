import React, { lazy, Suspense, useRef } from 'react';
import { PageTransition } from '../components/layout/PageTransition';
import { HeroSection } from '../components/sections/HeroSection';
import { StorySections } from '../components/sections/StorySections';
import { ProductGrid } from '../components/sections/ProductGrid';
import type { ScrollChoreography } from '../components/three/HeroStoryCanvas';

const HeroStoryCanvas = lazy(() =>
  import('../components/three/HeroStoryCanvas').then((m) => ({ default: m.HeroStoryCanvas }))
);

export const HomePage: React.FC = () => {
  const experienceRef = useRef<HTMLDivElement>(null);
  const choreographyRef = useRef<ScrollChoreography>({
    progress: 0,
    heroWeight: 1,
  });

  return (
    <PageTransition>
      {/* Unified Sticky 3D Stage + Pinned Storytelling Chapters */}
      <div ref={experienceRef} className="relative">
        <div className="pointer-events-none sticky top-0 z-10 h-screen w-full overflow-hidden">
          <Suspense fallback={null}>
            <HeroStoryCanvas choreographyRef={choreographyRef} />
          </Suspense>
        </div>

        <div className="relative z-20 -mt-[100vh]">
          <HeroSection />
          <StorySections containerRef={experienceRef} choreographyRef={choreographyRef} />
        </div>
      </div>

      <ProductGrid />
    </PageTransition>
  );
};
