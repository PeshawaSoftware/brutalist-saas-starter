import React from 'react';
import { motion } from 'framer-motion';
import { ScrollReveal, MagneticButton, AccentDivider } from '@/components';

interface CTASectionProps {
  onCtaClick?: () => void;
}

export const CTASection: React.FC<CTASectionProps> = ({ onCtaClick }) => {
  return (
    <section id="contact" className="relative py-24 lg:py-32 overflow-hidden">
      <div className="container max-w-4xl">
        <ScrollReveal className="space-y-12 text-center">
          <div className="space-y-6">
            <AccentDivider className="w-12 mx-auto mb-6" animated={false} />

            <h2 className="text-5xl lg:text-6xl font-bold leading-tight">
              Ready to
              <br />
              <span className="text-accent">Transform</span> Your Experience?
            </h2>

            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Join thousands of designers and developers who have already embraced the brutalist
              approach to digital excellence.
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4"
          >
            <MagneticButton
              variant="primary"
              size="lg"
              onClick={onCtaClick}
              className="font-mono font-bold"
            >
              Start Free Trial
            </MagneticButton>

            <MagneticButton
              variant="outline"
              size="lg"
              className="font-mono font-bold"
            >
              Schedule Demo
            </MagneticButton>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-sm text-gray-600 dark:text-gray-400 pt-4"
          >
            No credit card required. 14-day free trial. Cancel anytime.
          </motion.p>
        </ScrollReveal>
      </div>

      <motion.div
        animate={{
          opacity: [0.1, 0.3, 0.1],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
        }}
        className="absolute inset-0 bg-gradient-to-b from-accent/5 to-transparent pointer-events-none"
      />
    </section>
  );
};
