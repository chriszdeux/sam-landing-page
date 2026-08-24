import React from 'react';
import { cn } from '@/lib/utils/cn';

export type CustomButtonVariant = 'success' | 'info' | 'warning' | 'error' | 'neutral';

export interface CustomButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'color'> {
  variant?: CustomButtonVariant;
  glow?: boolean;
  fullWidth?: boolean;
  startIcon?: React.ReactNode;
  /** @deprecated MUI-era prop kept only for type-compat with not-yet-migrated
   * consumers - ignored by the Tailwind button. */
  sx?: unknown;
}

const variantConfig: Record<CustomButtonVariant, {
  color: string;
  border: string;
  background: string;
  hoverBg: string;
  hoverBorder: string;
  glowColor: string;
  hoverGlowColor: string;
}> = {
  success: {
    color: '#00ff88',
    border: 'rgba(0, 255, 136, 0.3)',
    background: 'rgba(0, 255, 136, 0.04)',
    hoverBg: 'rgba(0, 255, 136, 0.12)',
    hoverBorder: '#00ff88',
    glowColor: 'rgba(0, 255, 136, 0.25)',
    hoverGlowColor: 'rgba(0, 255, 136, 0.45)',
  },
  info: {
    color: '#00f3ff',
    border: 'rgba(0, 243, 255, 0.3)',
    background: 'rgba(0, 243, 255, 0.04)',
    hoverBg: 'rgba(0, 243, 255, 0.12)',
    hoverBorder: '#00f3ff',
    glowColor: 'rgba(0, 243, 255, 0.25)',
    hoverGlowColor: 'rgba(0, 243, 255, 0.45)',
  },
  warning: {
    color: '#E6C594',
    border: 'rgba(212, 163, 115, 0.3)',
    background: 'rgba(212, 163, 115, 0.04)',
    hoverBg: 'rgba(212, 163, 115, 0.12)',
    hoverBorder: '#E6C594',
    glowColor: 'rgba(212, 163, 115, 0.25)',
    hoverGlowColor: 'rgba(212, 163, 115, 0.45)',
  },
  error: {
    color: '#ff1744',
    border: 'rgba(255, 23, 68, 0.3)',
    background: 'rgba(255, 23, 68, 0.04)',
    hoverBg: 'rgba(255, 23, 68, 0.12)',
    hoverBorder: '#ff1744',
    glowColor: 'rgba(255, 23, 68, 0.25)',
    hoverGlowColor: 'rgba(255, 23, 68, 0.45)',
  },
  neutral: {
    color: 'rgba(255, 255, 255, 0.8)',
    border: 'rgba(255, 255, 255, 0.15)',
    background: 'rgba(255, 255, 255, 0.02)',
    hoverBg: 'rgba(255, 255, 255, 0.08)',
    hoverBorder: 'rgba(255, 255, 255, 0.4)',
    glowColor: 'rgba(255, 255, 255, 0.08)',
    hoverGlowColor: 'rgba(255, 255, 255, 0.15)',
  },
};

export const CustomButton = React.forwardRef<HTMLButtonElement, CustomButtonProps>(
  ({ variant = 'neutral', glow = false, fullWidth, startIcon, className, children, disabled, style, sx: _sx, ...props }, ref) => {
    const config = variantConfig[variant];

    return (
      <button
        ref={ref}
        disabled={disabled}
        className={cn(
          'inline-flex min-w-0 items-center justify-center gap-1.5 rounded py-1.5 px-5 font-mono text-xs font-semibold uppercase tracking-[1.2px] transition-all duration-200 ease-in-out active:scale-[0.98] disabled:pointer-events-none disabled:opacity-40',
          fullWidth && 'w-full',
          className
        )}
        style={{
          color: config.color,
          border: `1px solid ${config.border}`,
          backgroundColor: config.background,
          boxShadow: glow ? `0 0 10px ${config.glowColor}` : undefined,
          ...style,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = config.hoverBg;
          e.currentTarget.style.borderColor = config.hoverBorder;
          if (glow) e.currentTarget.style.boxShadow = `0 0 18px ${config.hoverGlowColor}`;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = config.background;
          e.currentTarget.style.borderColor = config.border;
          if (glow) e.currentTarget.style.boxShadow = `0 0 10px ${config.glowColor}`;
        }}
        {...props}
      >
        {startIcon}
        {children}
      </button>
    );
  }
);

CustomButton.displayName = 'CustomButton';
