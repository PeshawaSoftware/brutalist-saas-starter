import React, { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { useMagnetic } from '@/hooks';
import { ANIMATIONS } from '@/lib/constants';
import { cn } from '@/lib/utils';
import type { ButtonProps } from '@/types';

interface MagneticButtonProps extends ButtonProps {
  isMagnetic?: boolean;
}

export const MagneticButton = forwardRef<HTMLButtonElement, MagneticButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isMagnetic = true,
      disabled = false,
      children,
      onClick,
      className,
      ...props
    },
    ref
  ) => {
    const { ref: magneticRef, position } = useMagnetic();

    const baseStyles =
      'relative inline-flex items-center justify-center font-mono font-bold transition-all duration-300 ease-out overflow-hidden';

    const sizeStyles = {
      sm: 'px-4 py-2 text-xs',
      md: 'px-6 py-3 text-sm',
      lg: 'px-8 py-4 text-base',
    };

    const variantStyles = {
      primary: 'bg-primary text-primary-foreground hover:bg-accent hover:text-accent-foreground',
      accent: 'bg-accent text-accent-foreground hover:bg-primary hover:text-primary-foreground',
      outline:
        'border-2 border-primary text-primary bg-transparent hover:bg-primary hover:text-primary-foreground',
      ghost: 'text-primary hover:bg-secondary',
    };

    const disabledStyles = disabled ? 'opacity-50 cursor-not-allowed' : '';

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (!disabled && onClick) {
        onClick(e);
      }
    };

    const buttonContent = (
      <button
        ref={ref}
        onClick={handleClick}
        disabled={disabled}
        className={cn(
          baseStyles,
          sizeStyles[size],
          variantStyles[variant],
          disabledStyles,
          className
        )}
        {...props}
      >
        <span className="relative z-10 flex items-center justify-center gap-2">
          {children}
        </span>

        {variant !== 'ghost' && (
          <div className="absolute inset-0 bg-accent opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
        )}
      </button>
    );

    if (!isMagnetic) {
      return buttonContent;
    }

    return (
      <motion.div
        ref={magneticRef as any}
        animate={{
          x: position.x,
          y: position.y,
        }}
        transition={{
          type: 'spring',
          stiffness: 150,
          damping: 15,
          mass: 1,
        }}
        className="group"
      >
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          transition={{
            type: 'spring',
            stiffness: 400,
            damping: 10,
          }}
        >
          {buttonContent}
        </motion.div>
      </motion.div>
    );
  }
);

MagneticButton.displayName = 'MagneticButton';
