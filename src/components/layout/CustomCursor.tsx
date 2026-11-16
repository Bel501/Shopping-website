import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';
import { useDeviceCapabilities } from '../../hooks/useDeviceCapabilities';

export const CustomCursor: React.FC = () => {
  const { prefersReducedMotion } = useDeviceCapabilities();
  const [cursorVariant, setCursorVariant] = useState<'default' | 'pointer' | 'drag'>('default');
  const [visible, setVisible] = useState(false);

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  const springConfig = { damping: 28, stiffness: 420, mass: 0.4 };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);

  useEffect(() => {
    const isFinePointer = window.matchMedia('(pointer: fine)').matches;
    if (!isFinePointer || prefersReducedMotion) return;

    document.body.classList.add('custom-cursor-enabled');

    const handleMove = (e: MouseEvent) => {
      setVisible(true);
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);

      const target = e.target as HTMLElement | null;
      if (!target) return;

      if (target.closest('[data-cursor="drag"]')) {
        setCursorVariant('drag');
      } else if (
        target.closest('a, button, input, select, [role="button"], [data-cursor="pointer"]')
      ) {
        setCursorVariant('pointer');
      } else {
        setCursorVariant('default');
      }
    };

    const handleLeave = () => setVisible(false);

    window.addEventListener('mousemove', handleMove, { passive: true });
    document.addEventListener('mouseleave', handleLeave);

    return () => {
      document.body.classList.remove('custom-cursor-enabled');
      window.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseleave', handleLeave);
    };
  }, [mouseX, mouseY, prefersReducedMotion]);

  if (prefersReducedMotion || !visible) return null;

  const size = cursorVariant === 'default' ? 14 : cursorVariant === 'pointer' ? 44 : 68;

  return (
    <motion.div
      style={{ x, y, translateX: '-50%', translateY: '-50%' }}
      animate={{
        width: size,
        height: size,
        backgroundColor:
          cursorVariant === 'pointer'
            ? 'rgba(212, 255, 0, 0.14)'
            : cursorVariant === 'drag'
              ? 'rgba(244, 244, 245, 0.12)'
              : '#D4FF00',
        borderWidth: cursorVariant === 'default' ? 0 : 1,
        borderColor: cursorVariant === 'drag' ? '#F4F4F5' : '#D4FF00',
      }}
      transition={{ type: 'spring', stiffness: 450, damping: 30 }}
      className="pointer-events-none fixed left-0 top-0 z-[999] flex items-center justify-center rounded-full mix-blend-difference"
    >
      {cursorVariant === 'drag' && (
        <span className="font-mono text-[10px] font-semibold tracking-wider text-bone">
          Orbit
        </span>
      )}
    </motion.div>
  );
};
