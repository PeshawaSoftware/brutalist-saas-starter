import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ScrollReveal, AccentDivider } from '@/components';
import { TESTIMONIALS } from '@/lib/constants';

export const TestimonialsSection: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS.length);;
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      zIndex: 0,
      x: dir > 0 ? -1000 : 1000,
      opacity: 0,
    }),
  };

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    setCurrentIndex((prev) => (prev + newDirection + TESTIMONIALS.length) % TESTIMONIALS.length);
  };

  return (
    <section id="testimonials" className="relative py-24 lg:py-32 overflow-hidden">
      <div className="container max-w-4xl">
        <div className="space-y-16">
          <ScrollReveal className="space-y-4 text-center">
            <AccentDivider className="w-12 mx-auto mb-6" animated={false} />
            <h2 className="text-5xl lg:text-6xl font-bold leading-tight">
              Loved by
              <br />
              <span className="text-accent">Designers & Developers</span>
            </h2>
          </ScrollReveal>

          <div className="relative h-80 flex items-center justify-center">
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: 'spring', stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 },
                }}
                className="absolute w-full"
              >
                <div className="space-y-6 text-center px-4">
                  <blockquote className="text-2xl lg:text-3xl font-light leading-relaxed">
                    "{TESTIMONIALS[currentIndex].quote}"
                  </blockquote>

                  <div className="space-y-2">
                    <p className="font-bold text-lg">{TESTIMONIALS[currentIndex].author}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {TESTIMONIALS[currentIndex].role} at{' '}
                      <span className="font-semibold">{TESTIMONIALS[currentIndex].company}</span>
                    </p>
                  </div>

                  <div className="flex justify-center gap-1">
                    {Array.from({ length: TESTIMONIALS[currentIndex].rating }).map((_, i) => (
                      <span key={i} className="text-accent text-xl">
                        ★
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex justify-center gap-4">
            <button
              onClick={() => paginate(-1)}
              className="p-3 border border-gray-200 dark:border-gray-800 hover:border-accent transition-colors"
              aria-label="Previous testimonial"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            <div className="flex gap-2 items-center">
              {TESTIMONIALS.map((_, index) => (
                <motion.button
                  key={index}
                  onClick={() => {
                    setDirection(index > currentIndex ? 1 : -1);
                    setCurrentIndex(index);
                  }}
                  className={`h-2 transition-all ${
                    index === currentIndex
                      ? 'bg-accent w-8'
                      : 'bg-gray-300 dark:bg-gray-700 w-2'
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>

            <button
              onClick={() => paginate(1)}
              className="p-3 border border-gray-200 dark:border-gray-800 hover:border-accent transition-colors"
              aria-label="Next testimonial"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
