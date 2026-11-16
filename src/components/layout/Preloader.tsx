import React, { useEffect, useState } from 'react';
import { useProgress } from '@react-three/drei';
import { AnimatePresence, motion } from 'motion/react';
import { BRAND_CONFIG } from '../../config/brandConfig';

export const Preloader: React.FC = () => {
  const { progress, active } = useProgress();
  const [visible, setVisible] = useState(true);
  const [displayProgress, setDisplayProgress] = useState(0);

  useEffect(() => {
    setDisplayProgress((prev) => Math.max(prev, Math.round(progress)));
  }, [progress]);

  useEffect(() => {
    if (!active && progress >= 100) {
      const t = setTimeout(() => setVisible(false), 380);
      return () => clearTimeout(t);
    }
    const safety = setTimeout(() => {
      setDisplayProgress(100);
      setVisible(false);
    }, 1800);
    return () => clearTimeout(safety);
  }, [active, progress]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } }}
          className="fixed inset-0 z-[100] flex flex-col justify-between bg-obsidian p-8 md:p-14"
        >
          <div className="flex items-center justify-between font-mono text-xs text-titanium">
            <span>{BRAND_CONFIG.name}</span>
            <span>{BRAND_CONFIG.tagline}</span>
          </div>

          <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
            <div className="flex items-baseline justify-between">
              <h1 className="font-display text-4xl font-bold tracking-tight text-bone md:text-6xl">
                {BRAND_CONFIG.name}
              </h1>
              <span className="font-mono text-2xl font-medium tabular-nums text-volt md:text-4xl">
                {String(displayProgress).padStart(3, '0')}%
              </span>
            </div>

            <div className="h-[2px] w-full overflow-hidden bg-zinc-800">
              <motion.div
                className="h-full bg-volt"
                initial={{ width: '0%' }}
                animate={{ width: `${displayProgress}%` }}
                transition={{ ease: 'easeOut', duration: 0.25 }}
              />
            </div>
          </div>

          <div className="font-mono text-xs text-zinc-500">
            Preparing 3D geometry &amp; studio materials
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
