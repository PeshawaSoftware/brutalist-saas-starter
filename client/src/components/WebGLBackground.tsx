import React, { useEffect, useRef } from 'react';
import { WEBGL_CONFIG } from '@/lib/constants';
import { animationLoop, distance } from '@/lib/utils';
import type { Particle } from '@/types';

interface WebGLBackgroundProps {
  className?: string;
}

export const WebGLBackground: React.FC<WebGLBackgroundProps> = ({ className }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const pixelRatio = window.devicePixelRatio || 1;
    const width = window.innerWidth;
    const height = window.innerHeight;

    canvas.width = width * pixelRatio;
    canvas.height = height * pixelRatio;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    ctx.scale(pixelRatio, pixelRatio);

    const particles: Particle[] = [];
    for (let i = 0; i < WEBGL_CONFIG.particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * WEBGL_CONFIG.particleSpeed,
        vy: (Math.random() - 0.5) * WEBGL_CONFIG.particleSpeed,
        size: Math.random() * WEBGL_CONFIG.particleSize + 1,
        opacity: Math.random() * 0.5 + 0.3,
      });
    }
    particlesRef.current = particles;

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleResize = () => {
      const newWidth = window.innerWidth;
      const newHeight = window.innerHeight;

      canvas.width = newWidth * pixelRatio;
      canvas.height = newHeight * pixelRatio;
      canvas.style.width = `${newWidth}px`;
      canvas.style.height = `${newHeight}px`;

      ctx.scale(pixelRatio, pixelRatio);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);

    const cleanup = animationLoop(() => {
      ctx.fillStyle = WEBGL_CONFIG.backgroundColor;
      ctx.fillRect(0, 0, width, height);

      particles.forEach((particle) => {
        const dx = mouseRef.current.x - particle.x;
        const dy = mouseRef.current.y - particle.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 200) {
          const force = (200 - dist) / 200;
          particle.vx += (dx / dist) * force * 0.1;
          particle.vy += (dy / dist) * force * 0.1;
        }

        particle.vx *= 0.98;
        particle.vy *= 0.98;

        particle.x += particle.vx;
        particle.y += particle.vy;

        if (particle.x < 0) particle.x = width;
        if (particle.x > width) particle.x = 0;
        if (particle.y < 0) particle.y = height;
        if (particle.y > height) particle.y = 0;

        ctx.fillStyle = `rgba(0, 217, 255, ${particle.opacity})`;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.strokeStyle = `rgba(0, 217, 255, ${WEBGL_CONFIG.connectionOpacity})`;
      ctx.lineWidth = WEBGL_CONFIG.lineWidth;

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dist = distance(
            { x: particles[i].x, y: particles[i].y },
            { x: particles[j].x, y: particles[j].y }
          );

          if (dist < WEBGL_CONFIG.connectionDistance) {
            const opacity =
              WEBGL_CONFIG.connectionOpacity * (1 - dist / WEBGL_CONFIG.connectionDistance);
            ctx.strokeStyle = `rgba(0, 217, 255, ${opacity})`;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
    });

    return () => {
      cleanup();
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 -z-10 ${className}`}
      style={{ background: WEBGL_CONFIG.backgroundColor }}
    />
  );
};
