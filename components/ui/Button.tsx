// 1-Definir componente de botón personalizado
// 2-Renderizar botón con estilos condicionales

//# 1-Definir componente de botón personalizado
'use client';

import React from 'react';
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

// El corte diagonal se dibuja con clip-path real (no con bandas de gradiente),
// así el borde queda en 1px exacto a cualquier tamaño en vez de escalar con el
// ancho del botón. cut = tamaño de la esquina recortada.
const sizeConfig: Record<Size, { padding: string; text: string; cut: number }> = {
  small: { padding: 'px-3.5 py-2', text: 'text-[0.6875rem] tracking-[0.14em]', cut: 6 },
  medium: { padding: 'px-5 py-2.5', text: 'text-[0.75rem] tracking-[0.12em]', cut: 8 },
  large: { padding: 'px-7 py-3.5', text: 'text-[0.8125rem] tracking-[0.1em]', cut: 10 },
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

const cutPath = (cut: number) =>
  `polygon(${cut}px 0, 100% 0, 100% calc(100% - ${cut}px), calc(100% - ${cut}px) 100%, 0 100%, 0 ${cut}px)`;

//# 2-Renderizar botón con estilos condicionales
// Misma identidad visual "tech frame" que components/ui/TechFrame.tsx: esquinas
// recortadas en diagonal (arriba-izquierda / abajo-derecha) sobre fondo con
// blur. El peso visual lo lleva la hairline, no el glow: en reposo el borde es
// de 1px sin sombra, y el glow aparece solo en hover o con `glow`.
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
    const hex = colorHex[color];
    const isContained = variant === 'contained';
    const { padding, text, cut } = sizeConfig[size];

    return (
      <button
        ref={ref}
        disabled={disabled}
        className={cn(
          'group relative inline-block p-px text-left',
          'transition-[filter,transform,background-color] duration-200',
          // El "borde" es este fondo asomando 1px por debajo del panel interno.
          isContained
            ? 'bg-[var(--btn-accent)]'
            : 'bg-[color-mix(in_srgb,var(--btn-accent)_34%,transparent)] enabled:hover:bg-[color-mix(in_srgb,var(--btn-accent)_75%,transparent)]',
          // El glow es una respuesta al hover, no un estado permanente.
          'enabled:hover:[filter:drop-shadow(0_0_7px_color-mix(in_srgb,var(--btn-accent)_45%,transparent))]',
          'enabled:hover:-translate-y-px',
          'focus-visible:outline-none focus-visible:[filter:drop-shadow(0_0_7px_color-mix(in_srgb,var(--btn-accent)_60%,transparent))]',
          'disabled:cursor-not-allowed disabled:opacity-40',
          'motion-reduce:transition-none motion-reduce:hover:translate-y-0',
          fullWidth && 'w-full',
          className
        )}
        style={
          {
            '--btn-accent': hex,
            clipPath: cutPath(cut),
            filter: glow
              ? `drop-shadow(0 0 6px color-mix(in srgb, ${hex} 45%, transparent))`
              : undefined,
            ...style,
          } as React.CSSProperties
        }
        {...props}
      >
        <div
          className={cn(
            'relative flex items-center justify-center gap-2 font-semibold uppercase leading-none',
            'transition-colors duration-200',
            isContained
              ? 'bg-[var(--btn-accent)] text-[#05050c]'
              : 'bg-[rgba(8,8,14,0.92)] text-[var(--btn-accent)] backdrop-blur-md',
            padding,
            text
          )}
          style={{ clipPath: cutPath(cut - 1) }}
        >
          {startIcon}
          {children}
          {endIcon}
        </div>
      </button>
    );
  }
);

Button.displayName = 'Button';
