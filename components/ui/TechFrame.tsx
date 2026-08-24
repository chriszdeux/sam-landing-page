// 1-Definir componente de marco tecnológico
// 2-Renderizar contenedor con bordes animados y efectos

//# 1-Definir componente de marco tecnológico
'use client';

import React, { useId } from 'react';
import { cn } from '@/lib/utils/cn';

interface TechFrameProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  color?: string;
  className?: string;
  /** @deprecated MUI-era prop, ignored - kept for type-compat with
   * not-yet-touched callers across the app. */
  sx?: unknown;
}

export const TechFrame = ({ children, color = '#ff0055', className, sx: _sx, onClick, ...props }: TechFrameProps) => {
  const uid = useId().replace(/[:]/g, '');
  const cls = `techframe-${uid}`;

  //# 2-Renderizar contenedor con bordes animados y efectos
  return (
    <div
      className={cn(cls, 'relative p-1 transition-all duration-300', className)}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
      {...props}
    >
      <style>{`
        .${cls} {
          background: linear-gradient(45deg, transparent 5%, ${color} 5%, ${color} 10%, transparent 10%, transparent 90%, ${color} 90%, ${color} 95%, transparent 95%);
          filter: drop-shadow(0 0 5px ${color}80);
        }
        .${cls}:hover {
          filter: drop-shadow(0 0 10px ${color});
          transform: translateY(-5px);
        }
        .${cls}::before {
          content: '';
          position: absolute;
          inset: 0;
          border: 1px solid ${color}40;
          pointer-events: none;
          transition: all 0.3s ease;
        }
        .${cls}:hover::before {
          border-color: ${color}80;
          border-width: 2px;
        }
      `}</style>
      <div className="relative h-full bg-[rgba(10,10,10,0.8)] backdrop-blur-md">
        {children}

        <div
          className="pointer-events-none absolute inset-x-0 top-0 z-[2] h-full opacity-50 [background-size:100%_4px]"
          style={{ background: `linear-gradient(to bottom, transparent 50%, ${color}10 50%)` }}
        />
      </div>
    </div>
  );
};
