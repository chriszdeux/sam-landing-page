'use client';

import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils/cn';

interface DialogProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}

// Modal genérico construido sobre <dialog> nativo (foco/ESC/backdrop
// gratis vía showModal()) + framer-motion solo para la transición de
// entrada/salida. Reemplaza a MUI Dialog/Modal sin agregar dependencias.
export const Dialog = ({ open, onClose, children, className }: DialogProps) => {
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
      const timeout = setTimeout(() => dialog.close(), 180);
      return () => clearTimeout(timeout);
    }
  }, [open]);

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
      // open:h-auto/open:w-auto son imprescindibles: la hoja del navegador da a
      // <dialog> width/height: fit-content, y una caja con tamaño especificado
      // más inset:0 queda sobre-restringida — el navegador ignora right/bottom y
      // la ancla arriba a la izquierda, así que el centrado flex se aplicaba
      // dentro de una caja del tamaño del contenido en la esquina.
      className="m-0 max-h-none max-w-none overscroll-contain bg-transparent p-0 open:fixed open:inset-0 open:h-auto open:w-auto open:flex open:items-center open:justify-center backdrop:bg-black/60 backdrop:backdrop-blur-sm"
    >
      <motion.div
        initial={false}
        animate={open ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.95, y: 10 }}
        transition={{ duration: 0.18 }}
        // max-h + scroll propio: sin esto un modal más alto que la pantalla se
        // recorta por arriba y por abajo por igual, y queda inalcanzable.
        className={cn('max-h-[90vh] w-full max-w-md overflow-y-auto', className)}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </motion.div>
    </dialog>
  );
};
