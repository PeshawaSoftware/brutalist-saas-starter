import { useEffect, useRef, useState } from 'react';
import type { UseIntersectionReturn } from '@/types';

export const useIntersection = (
  threshold: number = 0.15,
  rootMargin: string = '0px 0px -100px 0px'
): UseIntersectionReturn => {
  const ref = useRef<HTMLElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hasBeenVisible, setHasBeenVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          setHasBeenVisible(true);
        } else {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [threshold, rootMargin]);

  return { ref: ref as React.RefObject<HTMLElement>, isVisible, hasBeenVisible };
};
