import React from 'react';
import { motion } from 'framer-motion';
import { ScrollReveal, StaggerContainer, AccentDivider, MagneticButton } from '@/components';
import { PRICING_TIERS, ANIMATIONS } from '@/lib/constants';

export const PricingSection: React.FC = () => {
  return (
    <section id="pricing" className="relative py-24 lg:py-32 overflow-hidden">
      <div className="container max-w-6xl">
        <div className="space-y-16">
          <ScrollReveal className="space-y-4">
            <AccentDivider className="w-12 mb-6" animated={false} />
            <h2 className="text-5xl lg:text-6xl font-bold leading-tight">
              Simple,
              <br />
              <span className="text-accent">Transparent</span> Pricing
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl">
              Choose the plan that fits your needs. Scale up anytime without surprises.
            </p>
          </ScrollReveal>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {PRICING_TIERS.map((tier, index) => (
              <motion.div
                key={tier.id}
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
                className={`relative p-8 border transition-all duration-300 ${
                  tier.isPopular
                    ? 'border-accent bg-accent/5 scale-105'
                    : 'border-gray-200 dark:border-gray-800 hover:border-accent'
                }`}
              >
                {tier.isPopular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="px-4 py-1 bg-accent text-accent-foreground text-xs font-mono font-bold uppercase">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="space-y-6">
                  <div>
                    <h3 className="text-2xl font-bold mb-2">{tier.name}</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      {tier.description}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-bold">${tier.price}</span>
                      <span className="text-gray-600 dark:text-gray-400">/month</span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                      Billed monthly or annually
                    </p>
                  </div>

                  <MagneticButton
                    variant={tier.isPopular ? 'accent' : 'outline'}
                    size="lg"
                    className="w-full"
                  >
                    Get Started
                  </MagneticButton>

                  <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
                    <ul className="space-y-3">
                      {tier.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex gap-3 text-sm">
                          <span className="text-accent font-bold">✓</span>
                          <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {tier.isPopular && (
                  <motion.div
                    className="absolute inset-0 border-2 border-accent pointer-events-none"
                    animate={{
                      opacity: [0.5, 1, 0.5],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                    }}
                  />
                )}
              </motion.div>
            ))}
          </StaggerContainer>
        </div>
      </div>
    </section>
  );
};
