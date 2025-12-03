import React from 'react';
import { Card as MuiCard, CardProps as MuiCardProps } from '@mui/material';

interface CardProps extends MuiCardProps {
  hoverEffect?: boolean;
}

export const Card = ({ hoverEffect = true, sx, ...props }: CardProps) => {
  return (
    <MuiCard
      sx={{
        transition: 'all 0.3s ease',
        ...(hoverEffect && {
          '&:hover': {
            transform: 'scale(1.02)',
            boxShadow: (theme) => `0 0 20px ${theme.palette.primary.main}33`, // 20% opacity
          },
        }),
        ...sx,
      }}
      {...props}
    />
  );
};
