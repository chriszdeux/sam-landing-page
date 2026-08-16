// 1-Definir componente de botón personalizado
// 2-Renderizar botón con estilos condicionales

//# 1-Definir componente de botón personalizado
'use client';

import React, { useId } from 'react';
import { cn } from '@/lib/utils/cn';

type Variant = 'contained' | 'outlined' | 'text';
type Color = 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success' | 'inherit';
type Size = 'small' | 'medium' | 'large';

interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'color'> {
  glow?: boolean;
  variant?: Variant;
  color?: Color;
  size?: Size;
  fullWidth?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  /** @deprecated MUI-era prop, ignored by the Tailwind button - kept for
   * type-compat with not-yet-touched callers across the app. */
  sx?: unknown;
}

const sizeClasses: Record<Size, string> = {
  small: 'px-3 py-1.5 text-xs',
  medium: 'px-5 py-2.5 text-sm',
  large: 'px-7 py-3.5 text-base',
};

const colorHex: Record<Color, string> = {
  primary: '#ffffff',
  secondary: '#00efcb',
  error: '#ef9a9a',
  warning: '#ffcc80',
  info: '#90caf9',
  success: '#a5d6a7',
  inherit: 'currentColor',
};

//# 2-Renderizar botón con estilos condicionales
// Misma identidad visual "tech frame" que components/ui/TechFrame.tsx /
// TechButton.tsx: borde con corte diagonal + glow de color + fondo con
// blur. Se aplica a TODOS los botones de la app vía este componente
// compartido. Color por defecto: "info" (azulado, #90caf9).
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      glow,
      variant = 'text',
      color = 'info',
      size = 'medium',
      fullWidth,
      startIcon,
      endIcon,
      className,
      children,
      sx: _sx,
      disabled,
      style,
      ...props
    },
    ref
  ) => {
    const uid = useId().replace(/[:]/g, '');
    const cls = `btn-${uid}`;
    const hex = colorHex[color];
    const isContained = variant === 'contained';

    return (
      <button
        ref={ref}
        disabled={disabled}
        className={cn(
          cls,
          'relative inline-block p-1 text-left transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-40',
          fullWidth && 'w-full',
          className
        )}
        style={style}
        {...props}
      >
        <style>{`
          .${cls} {
            background: linear-gradient(45deg, transparent 5%, ${hex} 5%, ${hex} 10%, transparent 10%, transparent 90%, ${hex} 90%, ${hex} 95%, transparent 95%);
            filter: drop-shadow(0 0 5px ${hex}80);
          }
          .${cls}:hover:not(:disabled) {
            filter: drop-shadow(0 0 10px ${hex});
            transform: translateY(-2px);
          }
          .${cls}::before {
            content: '';
            position: absolute;
            inset: 0;
            border: 1px solid ${hex}40;
            pointer-events: none;
            transition: all 0.3s ease;
          }
          .${cls}:hover:not(:disabled)::before {
            border-color: ${hex}80;
            border-width: 2px;
          }
        `}</style>
        <div
          className={cn(
            'relative flex items-center justify-center gap-2 overflow-hidden font-bold uppercase tracking-wide backdrop-blur-md',
            sizeClasses[size]
          )}
          style={{
            backgroundColor: isContained ? hex : 'rgba(10,10,10,0.8)',
            color: isContained ? '#000' : hex,
            boxShadow: glow ? `0 0 10px ${hex}` : undefined,
          }}
        >
          {startIcon}
          {children}
          {endIcon}
          <div
            className="pointer-events-none absolute inset-x-0 top-0 z-[2] h-full opacity-50 [background-size:100%_4px]"
            style={{ background: `linear-gradient(to bottom, transparent 50%, ${hex}${isContained ? '00' : '10'} 50%)` }}
          />
        </div>
      </button>
    );
  }
);

Button.displayName = 'Button';
