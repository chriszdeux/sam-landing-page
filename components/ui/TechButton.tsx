'use client';

import React, { useId } from 'react';
import { cn } from '@/lib/utils/cn';

type Size = 'small' | 'medium' | 'large';

interface TechButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'color'> {
  color?: string;
  size?: Size;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const sizeClasses: Record<Size, string> = {
  small: 'px-4 py-2 text-xs',
  medium: 'px-6 py-3 text-sm',
  large: 'px-8 py-4 text-base',
};

// Botón con la misma identidad visual que TechFrame: borde con corte
// diagonal, glow de color y fondo con blur - pero como <button> real
// (clickeable, focusable, soporta disabled) en vez de un contenedor.
export const TechButton = ({
  children,
  color = '#00f3ff',
  size = 'medium',
  startIcon,
  endIcon,
  fullWidth,
  className,
  disabled,
  ...props
}: TechButtonProps) => {
  const uid = useId().replace(/[:]/g, '');
  const cls = `techbtn-${uid}`;

  return (
    <button
      className={cn(
        cls,
        'relative inline-block p-1 text-left transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-40',
        fullWidth && 'w-full',
        className
      )}
      disabled={disabled}
      {...props}
    >
      <style>{`
        .${cls} {
          background: linear-gradient(45deg, transparent 5%, ${color} 5%, ${color} 10%, transparent 10%, transparent 90%, ${color} 90%, ${color} 95%, transparent 95%);
          filter: drop-shadow(0 0 5px ${color}80);
        }
        .${cls}:hover:not(:disabled) {
          filter: drop-shadow(0 0 10px ${color});
          transform: translateY(-3px);
        }
        .${cls}::before {
          content: '';
          position: absolute;
          inset: 0;
          border: 1px solid ${color}40;
          pointer-events: none;
          transition: all 0.3s ease;
        }
        .${cls}:hover:not(:disabled)::before {
          border-color: ${color}80;
          border-width: 2px;
        }
      `}</style>
      <div className={cn('relative flex items-center justify-center gap-2 overflow-hidden bg-[rgba(10,10,10,0.8)] backdrop-blur-md', sizeClasses[size])}>
        {startIcon}
        <span className="font-bold uppercase tracking-[1px]" style={{ color }}>
          {children}
        </span>
        {endIcon}

        <div
          className="pointer-events-none absolute inset-x-0 top-0 z-[2] h-full opacity-50 [background-size:100%_4px]"
          style={{ background: `linear-gradient(to bottom, transparent 50%, ${color}10 50%)` }}
        />
      </div>
    </button>
  );
};
