import { useState, useEffect } from 'react';
import { addScrollListener } from '@/lib/utils';
import type { UseScrollPositionReturn } from '@/types';

export const useScrollPosition = (): UseScrollPositionReturn => {
  const [scrollY, setScrollY] = useState(0);
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down' | 'idle'>('idle');
  const [isAtTop, setIsAtTop] = useState(true);
  const [isAtBottom, setIsAtBottom] = useState(false);

  useEffect(() => {
    let lastScrollY = 0;

    const unsubscribe = addScrollListener((currentScrollY) => {
      setScrollY(currentScrollY);
      setIsAtTop(currentScrollY < 50);

      const documentHeight = document.documentElement.scrollHeight;
      const windowHeight = window.innerHeight;
      setIsAtBottom(currentScrollY + windowHeight >= documentHeight - 50);

      if (currentScrollY > lastScrollY) {
        setScrollDirection('down');
      } else if (currentScrollY < lastScrollY) {
        setScrollDirection('up');
      }

      lastScrollY = currentScrollY;
    });

    return unsubscribe;
  }, []);

  return { scrollY, scrollDirection, isAtTop, isAtBottom };
};
