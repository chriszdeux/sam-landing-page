// 1-Definir componente de título de sección
// 2-Renderizar título con subtítulo y divisor

//# 1-Definir componente de título de sección
import React from 'react';
import { Typography, Divider, Box } from '@mui/material';

interface SectionTitleProps {
  children: React.ReactNode;
  subtitle?: string;
  align?: 'left' | 'center' | 'right';
  color?: string;
}

export const SectionTitle = ({ children, subtitle, align = 'center', color = '#00f3ff' }: SectionTitleProps) => {
  
  //# 2-Renderizar título con subtítulo y divisor
  return (
    <Box sx={{ mb: 8, textAlign: align }}>
      {subtitle && (
        <Typography variant="overline" sx={{ color: color, letterSpacing: 3, display: 'block', mb: 1 }}>
          {subtitle}
        </Typography>
      )}
      <Typography variant="h2" gutterBottom sx={{ 
          color: 'white', 
          textTransform: 'uppercase', 
          fontWeight: 900,
          textShadow: `0 0 20px ${color}80`,
          fontSize: { xs: '2rem', md: '3rem' }
      }}>
        {children}
      </Typography>
      <Divider sx={{ 
        my: 2, 
        borderColor: color, 
        opacity: 0.3, 
        maxWidth: align === 'center' ? '200px' : '100px', 
        mx: align === 'center' ? 'auto' : 0 
      }} />
    </Box>
  );
};
