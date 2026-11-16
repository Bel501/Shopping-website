import React from 'react';
import { motion } from 'motion/react';
import { ArrowDownRight } from 'lucide-react';
import { BRAND_CONFIG } from '../../config/brandConfig';
import { useLenisScroll } from '../../hooks/useLenisScroll';

export const HeroSection: React.FC = () => {
  const { scrollTo } = useLenisScroll();

  return (
    <section className="relative flex min-h-screen w-full items-center px-6 pt-24 md:px-10">
      <div className="mx-auto w-full max-w-7xl">
        <div className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            className="mb-5 flex items-center gap-2 text-xs font-medium text-titanium"
          >
            <span>{BRAND_CONFIG.tagline}</span>
            <span aria-hidden="true">·</span>
            <span className="text-volt">Drop 04</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-[clamp(2.75rem,5.5vw,5.25rem)] font-bold leading-[0.95] tracking-tight text-bone text-balance"
          >
            {BRAND_CONFIG.heroHeadline.map((line, idx) => (
              <span key={line} className={`block ${idx === 2 ? 'text-volt' : ''}`}>
                {line}
              </span>
            ))}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6 max-w-md text-base leading-relaxed text-titanium md:text-lg"
          >
            {BRAND_CONFIG.heroSubcopy}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <button
              type="button"
              onClick={() => scrollTo('#collection', -40)}
              className="group flex items-center gap-2.5 whitespace-nowrap shrink-0 rounded-lg bg-volt px-7 py-3.5 font-display text-sm font-bold text-obsidian transition-transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Shop Now</span>
              <ArrowDownRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:translate-y-0.5" />
            </button>

            <button
              type="button"
              onClick={() => scrollTo('#story')}
              className="whitespace-nowrap shrink-0 rounded-lg border border-zinc-700 bg-obsidian/88 px-6 py-3.5 text-sm font-medium text-bone transition-colors hover:border-bone"
            >
              Explore Anatomy
            </button>
          </motion.div>
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-8 left-6 flex items-center gap-3 text-xs text-zinc-400 md:left-10">
        <span className="h-5 w-[1px] bg-volt/80" />
        <span>Scroll to inspect chassis</span>
      </div>
    </section>
  );
};
