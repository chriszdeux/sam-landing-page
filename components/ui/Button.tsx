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
  small: 'px-3 py-1 text-sm',
  medium: 'px-4 py-2 text-base',
  large: 'px-6 py-3 text-lg',
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
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      glow,
      variant = 'text',
      color = 'primary',
      size = 'medium',
      fullWidth,
      startIcon,
      endIcon,
      className,
      children,
      sx: _sx,
      style,
      ...props
    },
    ref
  ) => {
    const uid = useId().replace(/[:]/g, '');
    const cls = `btn-${uid}`;
    const hex = colorHex[color];

    const variantClass =
      variant === 'contained'
        ? 'text-black'
        : variant === 'outlined'
          ? 'border bg-transparent'
          : 'bg-transparent';

    return (
      <button
        ref={ref}
        className={cn(
          cls,
          'inline-flex items-center justify-center gap-2 rounded font-semibold normal-case transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-40',
          sizeClasses[size],
          variantClass,
          fullWidth && 'w-full',
          className
        )}
        style={{
          ...(variant === 'contained' ? { backgroundColor: hex } : {}),
          ...(variant === 'outlined' ? { borderColor: hex, color: hex } : {}),
          ...(variant === 'text' ? { color: hex } : {}),
          ...(glow ? { boxShadow: `0 0 10px ${hex}` } : {}),
          ...style,
        }}
        {...props}
      >
        <style>{`
          .${cls}:hover:not(:disabled) {
            ${variant === 'contained' ? `filter: brightness(0.9); box-shadow: 0 0 10px ${hex};` : ''}
            ${variant === 'outlined' ? `background-color: ${hex}1a;` : ''}
            ${variant === 'text' ? `background-color: ${hex}1a;` : ''}
          }
        `}</style>
        {startIcon}
        {children}
        {endIcon}
      </button>
    );
  }
);

Button.displayName = 'Button';
