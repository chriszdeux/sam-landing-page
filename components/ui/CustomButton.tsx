import React from 'react';
import { Button as MuiButton, ButtonProps as MuiButtonProps } from '@mui/material';

export type CustomButtonVariant = 'success' | 'info' | 'warning' | 'error' | 'neutral';

export interface CustomButtonProps extends Omit<MuiButtonProps, 'variant'> {
  variant?: CustomButtonVariant;
  glow?: boolean;
}

export const CustomButton = React.forwardRef<HTMLButtonElement, CustomButtonProps>(
  ({ variant = 'neutral', glow = false, sx, children, disabled, ...props }, ref) => {
    
    // Style configurations for each variant based on SAM brand colors
    const variantConfig = {
      success: {
        color: '#00ff88',
        border: '1px solid rgba(0, 255, 136, 0.3)',
        background: 'rgba(0, 255, 136, 0.04)',
        hoverBg: 'rgba(0, 255, 136, 0.12)',
        hoverBorder: '#00ff88',
        glowColor: 'rgba(0, 255, 136, 0.25)',
        hoverGlowColor: 'rgba(0, 255, 136, 0.45)',
      },
      info: {
        color: '#00f3ff',
        border: '1px solid rgba(0, 243, 255, 0.3)',
        background: 'rgba(0, 243, 255, 0.04)',
        hoverBg: 'rgba(0, 243, 255, 0.12)',
        hoverBorder: '#00f3ff',
        glowColor: 'rgba(0, 243, 255, 0.25)',
        hoverGlowColor: 'rgba(0, 243, 255, 0.45)',
      },
      warning: {
        color: '#E6C594',
        border: '1px solid rgba(212, 163, 115, 0.3)',
        background: 'rgba(212, 163, 115, 0.04)',
        hoverBg: 'rgba(212, 163, 115, 0.12)',
        hoverBorder: '#E6C594',
        glowColor: 'rgba(212, 163, 115, 0.25)',
        hoverGlowColor: 'rgba(212, 163, 115, 0.45)',
      },
      error: {
        color: '#ff1744',
        border: '1px solid rgba(255, 23, 68, 0.3)',
        background: 'rgba(255, 23, 68, 0.04)',
        hoverBg: 'rgba(255, 23, 68, 0.12)',
        hoverBorder: '#ff1744',
        glowColor: 'rgba(255, 23, 68, 0.25)',
        hoverGlowColor: 'rgba(255, 23, 68, 0.45)',
      },
      neutral: {
        color: 'rgba(255, 255, 255, 0.8)',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        background: 'rgba(255, 255, 255, 0.02)',
        hoverBg: 'rgba(255, 255, 255, 0.08)',
        hoverBorder: 'rgba(255, 255, 255, 0.4)',
        glowColor: 'rgba(255, 255, 255, 0.08)',
        hoverGlowColor: 'rgba(255, 255, 255, 0.15)',
      },
    };

    const config = variantConfig[variant];

    return (
      <MuiButton
        ref={ref}
        disabled={disabled}
        sx={{
          py: 0.75, // Compact, low visual height (approx. 6px padding)
          px: 2.5,
          color: config.color,
          border: config.border,
          bgcolor: config.background,
          fontWeight: 600, // semibold/bold
          fontSize: '0.75rem',
          letterSpacing: 1.2,
          fontFamily: 'monospace',
          textTransform: 'uppercase',
          borderRadius: '4px',
          minWidth: 'auto',
          transition: 'all 0.2s ease-in-out',
          
          ...(glow && {
            boxShadow: `0 0 10px ${config.glowColor}`,
          }),
          
          '&:hover': {
            bgcolor: config.hoverBg,
            borderColor: config.hoverBorder,
            ...(glow && {
              boxShadow: `0 0 18px ${config.hoverGlowColor}`,
            }),
          },
          
          '&:active': {
            transform: 'scale(0.98)',
          },
          
          '&:disabled': {
            opacity: 0.4,
            color: config.color,
            borderColor: config.border,
            bgcolor: config.background,
            cursor: 'not-allowed',
            pointerEvents: 'none',
          },
          
          ...sx,
        }}
        {...props}
      >
        {children}
      </MuiButton>
    );
  }
);

CustomButton.displayName = 'CustomButton';
