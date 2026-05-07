"use client";

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Box, Typography } from '@mui/material';
import { CheckCircleOutline, ErrorOutline, InfoOutlined } from '@mui/icons-material';

interface StationToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  onClose: () => void;
  duration?: number;
}

export const StationToast: React.FC<StationToastProps> = ({ 
  message, 
  type = 'success', 
  onClose, 
  duration = 4000 
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const colors = {
    success: '#00f3ff',
    error: '#ff0055',
    info: '#ffd700'
  };

  const icons = {
    success: <CheckCircleOutline sx={{ color: colors.success }} />,
    error: <ErrorOutline sx={{ color: colors.error }} />,
    info: <InfoOutlined sx={{ color: colors.info }} />
  };

  return (
    <Box sx={{ 
      position: 'fixed', 
      bottom: 40, 
      right: 40, 
      zIndex: 9999,
      pointerEvents: 'none'
    }}>
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, x: 100, scale: 0.8 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5, x: 50 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          style={{
            pointerEvents: 'auto',
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(15px) saturate(180%)',
            WebkitBackdropFilter: 'blur(15px) saturate(180%)',
            border: `1px solid ${colors[type]}33`,
            borderRadius: '16px',
            padding: '16px 24px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            boxShadow: `0 8px 32px 0 rgba(0, 0, 0, 0.37), 0 0 15px ${colors[type]}22`,
            minWidth: '300px'
          }}
        >
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            width: 32,
            height: 32,
            borderRadius: '50%',
            bgcolor: `${colors[type]}11`
          }}>
            {icons[type]}
          </Box>
          <Box>
            <Typography sx={{ 
              color: 'white', 
              fontSize: '0.9rem', 
              fontWeight: 600, 
              letterSpacing: '0.5px',
              textTransform: 'uppercase'
            }}>
              {type === 'success' ? 'SISTEMA STATION-8' : 'ALERTA DEL SISTEMA'}
            </Typography>
            <Typography sx={{ 
              color: 'rgba(255, 255, 255, 0.7)', 
              fontSize: '0.85rem' 
            }}>
              {message}
            </Typography>
          </Box>
        </motion.div>
      </AnimatePresence>
    </Box>
  );
};
