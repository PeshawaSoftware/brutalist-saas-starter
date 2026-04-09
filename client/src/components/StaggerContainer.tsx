import React from 'react';
import { motion } from 'framer-motion';
import { ANIMATIONS } from '@/lib/constants';

interface StaggerContainerProps {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
  delayChildren?: number;
}

export const StaggerContainer: React.FC<StaggerContainerProps> = ({
  children,
  className,
  staggerDelay = ANIMATIONS.stagger.md,
  delayChildren = 0,
}) => {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '0px 0px -100px 0px' }}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: staggerDelay / 1000,
            delayChildren: delayChildren / 1000,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
};
