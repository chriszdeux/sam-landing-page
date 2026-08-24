"use client";

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';
import { Typography } from '../ui/Typography';

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
    success: <CheckCircle2 color={colors.success} />,
    error: <AlertCircle color={colors.error} />,
    info: <Info color={colors.info} />
  };

  return (
    <div className="pointer-events-none fixed bottom-10 right-10 z-[9999]">
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
          <div
            className="flex items-center justify-center rounded-full"
            style={{ width: 32, height: 32, backgroundColor: `${colors[type]}11` }}
          >
            {icons[type]}
          </div>
          <div>
            <Typography component="p" className="text-[0.9rem] font-semibold uppercase tracking-[0.5px] text-white">
              {type === 'success' ? 'SISTEMA STATION-8' : 'ALERTA DEL SISTEMA'}
            </Typography>
            <Typography component="p" className="text-[0.85rem] text-white/70">
              {message}
            </Typography>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
