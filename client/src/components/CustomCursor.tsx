import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import type { Position } from '@/types';

interface CustomCursorProps {
  enabled?: boolean;
}

export const CustomCursor: React.FC<CustomCursorProps> = ({ enabled = true }) => {
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!enabled) return;

    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      setIsVisible(true);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      const isInteractive =
        target.tagName === 'BUTTON' ||
        target.tagName === 'A' ||
        target.classList.contains('interactive') ||
        target.closest('button') ||
        target.closest('a');

      setIsHovering(!!isInteractive);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseenter', handleMouseEnter);
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseenter', handleMouseEnter);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      <motion.div
        ref={cursorRef}
        className="pointer-events-none fixed z-[9999] mix-blend-multiply"
        animate={{
          x: position.x - 12,
          y: position.y - 12,
          opacity: isVisible ? 1 : 0,
          scale: isHovering ? 1.5 : 1,
        }}
        transition={{
          type: 'spring',
          stiffness: 500,
          damping: 28,
          mass: 0.5,
        }}
      >
        <div className="w-6 h-6 border-2 border-accent rounded-full" />
      </motion.div>

      <motion.div
        className="pointer-events-none fixed z-[9998] mix-blend-multiply"
        animate={{
          x: position.x - 4,
          y: position.y - 4,
          opacity: isVisible ? 0.5 : 0,
          scale: isHovering ? 2 : 1,
        }}
        transition={{
          type: 'spring',
          stiffness: 200,
          damping: 20,
          mass: 0.8,
        }}
      >
        <div className="w-2 h-2 bg-accent rounded-full" />
      </motion.div>

      <style>{`
        * {
          cursor: none !important;
        }
      `}</style>
    </>
  );
};
