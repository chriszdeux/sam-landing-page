// 1-Definir componente de tarjeta personalizada
// 2-Renderizar tarjeta con efectos de bordes y brillo

//# 1-Definir componente de tarjeta personalizada
'use client';

import React, { useId } from 'react';
import { cn } from '@/lib/utils/cn';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverEffect?: boolean;
  glowColor?: string;
  /** @deprecated MUI-era prop, ignored - kept for type-compat with
   * not-yet-touched callers across the app. */
  sx?: unknown;
}

export const Card = ({ hoverEffect = true, glowColor = '#00f3ff', className, children, sx: _sx, ...props }: CardProps) => {
  const uid = useId().replace(/[:]/g, '');
  const cls = `card-${uid}`;

  //# 2-Renderizar tarjeta con efectos de bordes y brillo
  return (
    <div
      className={cn(
        cls,
        'relative overflow-visible rounded-2xl border border-white/5 bg-[rgba(10,10,15,0.6)] backdrop-blur-md transition-all duration-[400ms] ease-[cubic-bezier(0.175,0.885,0.32,1.275)]',
        className
      )}
      {...props}
    >
      <style>{`
        .${cls}::before, .${cls}::after {
          content: '';
          position: absolute;
          width: 20px;
          height: 20px;
          transition: all 0.3s ease;
          z-index: 1;
          pointer-events: none;
          border-color: rgba(255, 255, 255, 0.1);
          border-style: solid;
        }
        .${cls}::before { top: 0; left: 0; border-width: 2px 0 0 2px; border-top-left-radius: 4px; }
        .${cls}::after { bottom: 0; right: 0; border-width: 0 2px 2px 0; border-bottom-right-radius: 4px; }
        ${
          hoverEffect
            ? `
        .${cls}:hover {
          transform: translateY(-5px);
          box-shadow: 0 0 30px ${glowColor}20, inset 0 0 20px ${glowColor}10;
          border-color: ${glowColor}60;
        }
        .${cls}:hover::before, .${cls}:hover::after {
          border-color: ${glowColor};
          width: 100%;
          height: 100%;
        }`
            : ''
        }
      `}</style>
      {children}
    </div>
  );
};
