import React from 'react';
import { motion } from 'framer-motion';
import { AccentDivider } from '@/components';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    { label: 'Privacy', href: '#' },
    { label: 'Terms', href: '#' },
    { label: 'Contact', href: '#' },
    { label: 'GitHub', href: '#' },
    { label: 'Twitter', href: '#' },
  ];

  return (
    <footer className="relative border-t border-gray-200 dark:border-gray-800">
      <div className="container max-w-6xl py-16 lg:py-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <h3 className="text-lg font-bold font-mono">BRUTALIST</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Luxury meets minimalism. Crafted for those who demand excellence.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="space-y-4"
          >
            <h4 className="font-bold text-sm uppercase tracking-wider">Product</h4>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>
                <a href="#features" className="hover:text-accent transition-colors">
                  Features
                </a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-accent transition-colors">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-accent transition-colors">
                  Documentation
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-accent transition-colors">
                  API Reference
                </a>
              </li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            <h4 className="font-bold text-sm uppercase tracking-wider">Company</h4>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>
                <a href="#" className="hover:text-accent transition-colors">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-accent transition-colors">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-accent transition-colors">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-accent transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </motion.div>
        </div>

        <AccentDivider className="mb-8" animated={false} />

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row items-center justify-between gap-4"
        >
          <p className="text-sm text-gray-600 dark:text-gray-400">
            &copy; {currentYear} Brutalist Luxury. All rights reserved.
          </p>

          <div className="flex gap-6">
            {footerLinks.map((link) => (
              <motion.a
                key={link.label}
                href={link.href}
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-accent transition-colors"
                whileHover={{ scale: 1.05 }}
              >
                {link.label}
              </motion.a>
            ))}
          </div>
        </motion.div>
      </div>
    </footer>
  );
};
