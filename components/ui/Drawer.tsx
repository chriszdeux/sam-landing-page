'use client';

import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils/cn';

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  side?: 'left' | 'right';
  className?: string;
}

// Panel deslizante construido sobre <dialog> nativo (foco/ESC/backdrop
// gratis vía showModal()) + framer-motion para la animación de slide.
// Reemplaza a MUI Drawer sin agregar dependencias.
export const Drawer = ({ open, onClose, children, side = 'left', className }: DrawerProps) => {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;

    if (open) {
      if (!dialog.open) dialog.showModal();
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
      };
    }

    if (dialog.open) {
      const timeout = setTimeout(() => dialog.close(), 220);
      return () => clearTimeout(timeout);
    }
  }, [open]);

  const hiddenX = side === 'left' ? '-100%' : '100%';

  return (
    <dialog
      ref={ref}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        if (e.target === ref.current) onClose();
      }}
      className={cn(
        'm-0 h-full max-h-none w-full max-w-none bg-transparent p-0 open:fixed open:inset-0 open:flex backdrop:bg-black/60 backdrop:backdrop-blur-sm',
        side === 'left' ? 'open:justify-start' : 'open:justify-end'
      )}
    >
      <motion.div
        initial={false}
        animate={{ x: open ? 0 : hiddenX }}
        transition={{ type: 'tween', duration: 0.22, ease: 'easeOut' }}
        className={cn('h-full w-60 overflow-y-auto bg-background', className)}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </motion.div>
    </dialog>
  );
};
