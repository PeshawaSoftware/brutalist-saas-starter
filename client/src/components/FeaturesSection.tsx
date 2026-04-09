import React from 'react';
import { motion } from 'framer-motion';
import { ScrollReveal, StaggerContainer, AccentDivider } from '@/components';
import { FEATURES, ANIMATIONS } from '@/lib/constants';

export const FeaturesSection: React.FC = () => {
  return (
    <section id="features" className="relative py-24 lg:py-32 overflow-hidden">
      <div className="container max-w-6xl">
        <div className="space-y-16">
          <ScrollReveal className="space-y-4">
            <AccentDivider className="w-12 mb-6" animated={false} />
            <h2 className="text-5xl lg:text-6xl font-bold leading-tight">
              Crafted for
              <br />
              <span className="text-accent">Excellence</span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl">
              Every feature is designed with precision. No bloat, no compromise. Just pure
              functionality wrapped in brutalist elegance.
            </p>
          </ScrollReveal>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {FEATURES.map((feature, index) => (
              <motion.div
                key={feature.id}
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: {
                      duration: ANIMATIONS.duration.normal / 1000,
                    },
                  },
                }}
                className="group relative p-8 border border-gray-200 dark:border-gray-800 hover:border-accent transition-colors duration-300"
              >
                <div className="absolute inset-0 bg-accent opacity-0 group-hover:opacity-5 transition-opacity duration-300" />

                <div className="relative z-10 space-y-4">
                  <div className="text-3xl">{feature.icon}</div>

                  <h3 className="text-xl font-bold">{feature.name}</h3>

                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    {feature.description}
                  </p>

                  <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
                    <p className="text-xs font-mono text-accent uppercase tracking-wider">
                      Core Feature
                    </p>
                  </div>
                </div>

                <motion.div
                  className="absolute bottom-0 left-0 h-1 bg-accent"
                  initial={{ width: 0 }}
                  whileHover={{ width: '100%' }}
                  transition={{ duration: 0.3 }}
                />
              </motion.div>
            ))}
          </StaggerContainer>
        </div>
      </div>
    </section>
  );
};
