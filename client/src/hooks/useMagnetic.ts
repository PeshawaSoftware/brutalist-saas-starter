import { useEffect, useRef, useState } from 'react';
import { getElementCenter, distance, normalize, lerp } from '@/lib/utils';
import { MAGNETIC_CONFIG } from '@/lib/constants';
import type { UseMagneticReturn, Position } from '@/types';

export const useMagnetic = (
  strength: number = MAGNETIC_CONFIG.strength,
  maxDistance: number = MAGNETIC_CONFIG.maxDistance
): UseMagneticReturn => {
  const ref = useRef<HTMLElement>(null);
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
  const velocityRef = useRef<Position>({ x: 0, y: 0 });
  const targetRef = useRef<Position>({ x: 0, y: 0 });

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleMouseMove = (e: MouseEvent) => {
      const elementCenter = getElementCenter(element);
      const mousePos: Position = { x: e.clientX, y: e.clientY };
      const dist = distance(elementCenter, mousePos);

      if (dist < maxDistance) {
        const { x: nx, y: ny } = normalize(
          mousePos.x - elementCenter.x,
          mousePos.y - elementCenter.y
        );

        targetRef.current = {
          x: nx * (maxDistance - dist) * strength,
          y: ny * (maxDistance - dist) * strength,
        };
      } else {
        targetRef.current = { x: 0, y: 0 };
      }
    };

    const handleMouseLeave = () => {
      targetRef.current = { x: 0, y: 0 };
    };

    let animationFrameId: number;
    const animate = () => {
      velocityRef.current.x = lerp(
        velocityRef.current.x,
        targetRef.current.x,
        MAGNETIC_CONFIG.friction
      );
      velocityRef.current.y = lerp(
        velocityRef.current.y,
        targetRef.current.y,
        MAGNETIC_CONFIG.friction
      );

      setPosition({
        x: velocityRef.current.x,
        y: velocityRef.current.y,
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    element.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      element.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, [strength, maxDistance]);

  return { ref: ref as React.RefObject<HTMLElement>, position };
};
