/**
 * Componente Botón Personalizado
 * Extiende MUI Button con props de brillo (glow)
 */
import React from 'react';
import { Button as MuiButton, ButtonProps as MuiButtonProps } from '@mui/material';

interface ButtonProps extends MuiButtonProps {
  glow?: boolean;
}

export const Button = ({ glow, sx, ...props }: ButtonProps) => {
  return (
    <MuiButton
      sx={{
        ...(glow && {
          boxShadow: (theme) => `0 0 10px ${theme.palette.primary.main}`,
        }),
        ...sx,
      }}
      {...props}
    />
  );
};
