import React from 'react';
import { useLenisScroll } from '../../hooks/useLenisScroll';

export const ScrollProgress: React.FC = () => {
  const { scrollProgress } = useLenisScroll();

  return (
    <div className="pointer-events-none fixed left-0 right-0 top-0 z-[60] h-[2px] bg-transparent">
      <div
        className="h-full bg-volt transition-[width] duration-75 ease-out"
        style={{ width: `${Math.min(100, Math.max(0, scrollProgress * 100))}%` }}
      />
    </div>
  );
};
