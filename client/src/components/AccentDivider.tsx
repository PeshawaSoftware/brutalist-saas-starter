import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface AccentDividerProps {
  orientation?: 'horizontal' | 'vertical';
  className?: string;
  animated?: boolean;
  delay?: number;
}

export const AccentDivider: React.FC<AccentDividerProps> = ({
  orientation = 'horizontal',
  className,
  animated = true,
  delay = 0,
}) => {
  const isHorizontal = orientation === 'horizontal';

  const baseStyles = cn(
    'bg-accent',
    isHorizontal ? 'h-px w-full' : 'w-px h-full',
    className
  );

  if (!animated) {
    return <div className={baseStyles} />;
  }

  return (
    <motion.div
      className={baseStyles}
      initial={{
        scaleX: isHorizontal ? 0 : 1,
        scaleY: isHorizontal ? 1 : 0,
        opacity: 0,
      }}
      whileInView={{
        scaleX: isHorizontal ? 1 : 1,
        scaleY: isHorizontal ? 1 : 1,
        opacity: 1,
      }}
      transition={{
        duration: 0.6,
        delay: delay / 1000,
      }}
      viewport={{ once: true }}
    />
  );
};
