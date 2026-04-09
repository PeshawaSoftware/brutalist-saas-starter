import React from 'react';
import { motion } from 'framer-motion';
import { MagneticButton, ScrollReveal, AccentDivider } from '@/components';
import { ANIMATIONS } from '@/lib/constants';

interface HeroProps {
  onCtaClick?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onCtaClick }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: ANIMATIONS.stagger.md / 1000,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: ANIMATIONS.duration.normal / 1000,
      },
    },
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      <div className="container max-w-6xl">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
        >
          <motion.div variants={itemVariants} className="space-y-8">
            <div className="space-y-4">
              <motion.div variants={itemVariants}>
                <AccentDivider className="w-12 mb-6" animated={false} />
              </motion.div>

              <motion.h1
                variants={itemVariants}
                className="text-6xl lg:text-7xl font-bold leading-tight tracking-tight"
              >
                Brutalist
                <br />
                <span className="text-accent">Luxury</span>
              </motion.h1>

              <motion.p
                variants={itemVariants}
                className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed max-w-md"
              >
                Experience the intersection of stark minimalism and ultra-smooth interactions. A
                SaaS platform built for those who demand both form and function.
              </motion.p>
            </div>

            <motion.div variants={itemVariants} className="flex gap-4 pt-4">
              <MagneticButton
                variant="primary"
                size="lg"
                onClick={onCtaClick}
                className="font-mono font-bold"
              >
                Get Started
              </MagneticButton>
              <MagneticButton
                variant="outline"
                size="lg"
                className="font-mono font-bold"
              >
                Learn More
              </MagneticButton>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="flex gap-8 pt-8 border-t border-gray-200 dark:border-gray-800"
            >
              <div>
                <p className="text-2xl font-bold">60fps</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Smooth Animations</p>
              </div>
              <div>
                <p className="text-2xl font-bold">0ms</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Layout Shift</p>
              </div>
              <div>
                <p className="text-2xl font-bold">100%</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Responsive</p>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="relative h-96 lg:h-full hidden lg:block"
          >
            <motion.div
              animate={{
                y: [0, -20, 0],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="absolute inset-0 bg-gradient-to-br from-accent/20 to-transparent rounded-lg border border-accent/30"
            />

            <motion.div
              animate={{
                rotate: [0, 360],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: 'linear',
              }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border border-accent/20 rounded-full"
            />

            <motion.div
              animate={{
                rotate: [360, 0],
              }}
              transition={{
                duration: 15,
                repeat: Infinity,
                ease: 'linear',
              }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 border border-accent/40 rounded-full"
            />
          </motion.div>
        </motion.div>
      </div>

      <motion.div
        animate={{
          y: [0, 10, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <div className="text-accent">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </div>
      </motion.div>
    </section>
  );
};
