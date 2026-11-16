import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollChoreography } from '../three/HeroStoryCanvas';
import { useDeviceCapabilities } from '../../hooks/useDeviceCapabilities';

gsap.registerPlugin(ScrollTrigger);

interface StorySectionsProps {
  containerRef: React.RefObject<HTMLDivElement | null>;
  choreographyRef: React.MutableRefObject<ScrollChoreography>;
}

const CHAPTERS = [
  {
    index: '01',
    tag: 'Aerodynamic Chassis',
    title: 'Zero-Drag Heel Silhouette',
    body: 'Wind-tunnel sculpted heel geometry slices turbulent air wake, reducing rotational torque during high-cadence transitions.',
    align: 'right' as const,
    stat: '14% Less Drag',
  },
  {
    index: '02',
    tag: 'Bio-Dyneema Weave',
    title: 'Tensile Second Skin',
    body: 'Micro-perforated Dyneema threads lock the midfoot down with 15x the tensile strength of steel at a fraction of traditional mesh weight.',
    align: 'left' as const,
    stat: '218 g Total Mass',
  },
  {
    index: '03',
    tag: 'Propulsion Architecture',
    title: 'Split Carbon Cantilever',
    body: 'Dual-forked Toray T1100 carbon fiber plate suspended in nitrogen-infused Pebax returns up to 87% kinetic energy per stride.',
    align: 'center' as const,
    stat: '87% Energy Return',
  },
];

export const StorySections: React.FC<StorySectionsProps> = ({
  containerRef,
  choreographyRef,
}) => {
  const storyRef = useRef<HTMLDivElement>(null);
  const { prefersReducedMotion } = useDeviceCapabilities();

  useEffect(() => {
    if (!containerRef.current || !storyRef.current) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: true,
        onUpdate: (self) => {
          choreographyRef.current.progress = self.progress;
          choreographyRef.current.heroWeight = Math.max(0, 1 - self.progress * 5);
        },
      });

      if (prefersReducedMotion) return;

      const chapters = gsap.utils.toArray<HTMLElement>('.story-chapter');
      chapters.forEach((chapter) => {
        const card = chapter.querySelector('.story-card');

        ScrollTrigger.create({
          trigger: chapter,
          start: 'top top',
          end: '+=65%',
          pin: true,
          pinSpacing: true,
        });

        if (card) {
          gsap.fromTo(
            card,
            { opacity: 0, y: 36 },
            {
              opacity: 1,
              y: 0,
              duration: 0.75,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: chapter,
                start: 'top 65%',
                end: 'top 25%',
                scrub: true,
              },
            }
          );
        }
      });
    }, storyRef);

    return () => ctx.revert();
  }, [containerRef, choreographyRef, prefersReducedMotion]);

  return (
    <div id="story" ref={storyRef} className="relative">
      {CHAPTERS.map((ch) => (
        <section
          key={ch.index}
          className="story-chapter flex min-h-screen w-full items-center px-6 md:px-10"
        >
          <div
            className={`mx-auto flex w-full max-w-7xl ${
              ch.align === 'right'
                ? 'justify-end'
                : ch.align === 'center'
                  ? 'justify-start md:items-end'
                  : 'justify-start'
            }`}
          >
            <div className="story-card pointer-events-auto max-w-md rounded-2xl border border-zinc-800/90 bg-obsidian/92 p-7 md:p-9">
              <div className="flex items-center gap-2 font-mono text-xs text-titanium">
                <span className="text-volt">
                  {ch.index}. {ch.tag}
                </span>
                <span aria-hidden="true">·</span>
                <span className="tabular-nums text-bone">{ch.stat}</span>
              </div>

              <h2 className="mt-4 font-display text-3xl font-bold leading-tight tracking-tight text-bone md:text-4xl text-balance">
                {ch.title}
              </h2>

              <p className="mt-4 text-sm leading-relaxed text-titanium md:text-base">{ch.body}</p>
            </div>
          </div>
        </section>
      ))}
    </div>
  );
};
