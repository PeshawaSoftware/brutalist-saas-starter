import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useScrollPosition, useTheme } from '@/hooks';
import { MagneticButton } from '@/components';
import { NAVIGATION_ITEMS } from '@/lib/constants';

export const Navigation: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { scrollY, isAtTop } = useScrollPosition();
  const { isDarkMode, toggleTheme } = useTheme();

  const handleNavClick = (href: string) => {
    if (href.startsWith('#')) {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setIsOpen(false);
  };

  return (
    <>
      <motion.nav
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-sm"
        animate={{
          backgroundColor: isAtTop
            ? 'rgba(255, 255, 255, 0)'
            : 'rgba(255, 255, 255, 0.95)',
          borderBottomColor: isAtTop ? 'rgba(224, 224, 224, 0)' : 'rgba(224, 224, 224, 1)',
        }}
        transition={{ duration: 0.3 }}
        style={{
          borderBottom: '1px solid',
        }}
      >
        <div className="container max-w-6xl flex items-center justify-between py-4">
          <motion.div
            className="text-xl font-bold font-mono"
            whileHover={{ scale: 1.05 }}
          >
            BRUTALIST
          </motion.div>

          <div className="hidden md:flex items-center gap-8">
            {NAVIGATION_ITEMS.map((item) => (
              <motion.button
                key={item.href}
                onClick={() => handleNavClick(item.href)}
                className="text-sm font-mono uppercase tracking-wider hover:text-accent transition-colors"
                whileHover={{ scale: 1.05 }}
              >
                {item.label}
              </motion.button>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <motion.button
              onClick={toggleTheme}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-900 rounded transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Toggle theme"
            >
              {isDarkMode ? (
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              ) : (
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.536l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.707.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zm5.414 5.414a1 1 0 01-1.414 0l-.707-.707a1 1 0 011.414-1.414l.707.707zM5 8a1 1 0 100-2H4a1 1 0 100 2h1z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </motion.button>

            <div className="hidden md:block">
              <MagneticButton variant="accent" size="sm">
                Get Started
              </MagneticButton>
            </div>

            <motion.button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2"
              whileTap={{ scale: 0.95 }}
              aria-label="Toggle menu"
            >
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
                  d={isOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
                />
              </svg>
            </motion.button>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-16 left-0 right-0 z-40 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 md:hidden"
          >
            <div className="container space-y-4 py-4">
              {NAVIGATION_ITEMS.map((item) => (
                <motion.button
                  key={item.href}
                  onClick={() => handleNavClick(item.href)}
                  className="block w-full text-left text-sm font-mono uppercase tracking-wider hover:text-accent transition-colors py-2"
                  whileHover={{ x: 4 }}
                >
                  {item.label}
                </motion.button>
              ))}
              <MagneticButton variant="accent" size="md" className="w-full mt-4">
                Get Started
              </MagneticButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
