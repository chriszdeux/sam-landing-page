/**
 * Componente Tarjeta (Card) Estilizada
 * Efectos de borde y esquinas futuristas
 * Estilos de hover y backdrop filter
 */
import React from 'react';
import { Card as MuiCard, CardProps as MuiCardProps } from '@mui/material';

interface CardProps extends MuiCardProps {
  hoverEffect?: boolean;
  glowColor?: string;
}

export const Card = ({ hoverEffect = true, glowColor = '#00f3ff', sx, children, ...props }: CardProps) => {
  return (
    <MuiCard
      sx={{
        position: 'relative',
        transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        background: 'rgba(10, 10, 15, 0.6)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.05)',

        overflow: 'visible',
        
        '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '20px',
            height: '20px',
            borderTop: '2px solid rgba(255,255,255,0.1)',
            borderLeft: '2px solid rgba(255,255,255,0.1)',
            transition: 'all 0.3s ease',
            zIndex: 1,
            borderTopLeftRadius: '4px',
            pointerEvents: 'none',
        },
        '&::after': {
            content: '""',
            position: 'absolute',
            bottom: 0,
            right: 0,
            width: '20px',
            height: '20px',
            borderBottom: '2px solid rgba(255,255,255,0.1)',
            borderRight: '2px solid rgba(255,255,255,0.1)',
            transition: 'all 0.3s ease',
            zIndex: 1,
            borderBottomRightRadius: '4px',
            pointerEvents: 'none',
        },

        ...(hoverEffect && {
          '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: `0 0 30px ${glowColor}20, inset 0 0 20px ${glowColor}10`,
            borderColor: `${glowColor}60`,
            '&::before': {
                borderColor: glowColor,
                width: '100%',
                height: '100%'
            },
            '&::after': {
                borderColor: glowColor,
                width: '100%',
                height: '100%'
            }
          },
        }),
        ...sx,
      }}
      {...props}
    >
      {children}
    </MuiCard>
  );
};
