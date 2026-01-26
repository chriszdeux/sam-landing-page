import React from 'react';
import { Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';

interface PageHeaderProps {
  title: string;
  subtitle: string;
  color?: string;
}

export const PageHeader = ({ title, subtitle, color = '#00f3ff' }: PageHeaderProps) => {
  
  return (
    <Box sx={{ mb: 8, position: 'relative', textAlign: 'center' }}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Decorative Top Line */}
        <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            mb: 2,
            gap: 2
        }}>
            <Box sx={{ width: 60, height: 2, background: `linear-gradient(90deg, transparent, ${color})` }} />
            <Box sx={{ width: 10, height: 10, bgcolor: color, transform: 'rotate(45deg)', boxShadow: `0 0 10px ${color}` }} />
            <Box sx={{ width: 60, height: 2, background: `linear-gradient(-90deg, transparent, ${color})` }} />
        </Box>

        {/* Title with Glow */}
        <Typography 
            variant="h2" 
            component="h1"
            sx={{ 
                fontWeight: '900', 
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                background: `linear-gradient(180deg, #fff 0%, ${color} 100%)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                filter: `drop-shadow(0 0 20px ${color}40)`,
                mb: 3,
                fontSize: { xs: '2.5rem', md: '3.5rem' }
            }}
        >
          {title}
        </Typography>

        {/* Subtitle Container */}
        <Box sx={{ 
            display: 'inline-block',
            position: 'relative',
            px: 4,
            py: 1,
        }}>
            {/* Brackets */}
            <Box sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: 20,
                height: '100%',
                borderLeft: `2px solid ${color}40`,
                borderTop: `2px solid ${color}40`,
                borderBottom: `2px solid ${color}40`,
            }} />
            <Box sx={{
                position: 'absolute',
                top: 0,
                right: 0,
                width: 20,
                height: '100%',
                borderRight: `2px solid ${color}40`,
                borderTop: `2px solid ${color}40`,
                borderBottom: `2px solid ${color}40`,
            }} />

            <Typography 
                variant="h6" 
                sx={{ 
                    color: 'text.secondary', 
                    maxWidth: 600, 
                    mx: 'auto',
                    fontSize: { xs: '0.9rem', md: '1.1rem' },
                    letterSpacing: '0.05em'
                }}
            >
              {subtitle}
            </Typography>
        </Box>
      </motion.div>
    </Box>
  );
};
