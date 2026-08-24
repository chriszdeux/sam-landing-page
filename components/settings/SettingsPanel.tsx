// 1-Definir panel de configuración con entrada animada
// 2-Renderizar cabecera con etiqueta y contenido

'use client';

import React from 'react';
import { motion, useReducedMotion, type Variants } from 'framer-motion';
import { cn } from '@/lib/utils/cn';

interface SettingsPanelProps {
  /** Etiqueta de sección: se muestra en microtipografía uppercase. */
  label: string;
  /** Color de acento del hairline superior y del marcador de la etiqueta. */
  accent?: string;
  className?: string;
  children: React.ReactNode;
}

//# 1-Definir panel de configuración con entrada animada
// Reemplaza al TechFrame en esta página: el marco tenía glow permanente y un
// relleno de color que competía con los datos, y en una pantalla que se opera
// (no se contempla) el peso visual tiene que estar en el contenido. Acá el
// borde es una hairline de 1px y el glow aparece solo en hover.
export const SettingsPanel = ({ label, accent = '#00f3ff', className, children }: SettingsPanelProps) => {
  const reduceMotion = useReducedMotion();

  // El padre define el stagger; cada panel solo declara su variante.
  const variants: Variants = {
    hidden: { opacity: 0, y: reduceMotion ? 0 : 14 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: reduceMotion ? 0 : 0.4, ease: [0.22, 1, 0.36, 1] },
    },
  };

  //# 2-Renderizar cabecera con etiqueta y contenido
  return (
    <motion.section
      data-qa="settings-panel"
      variants={variants}
      style={{ '--accent': accent } as React.CSSProperties}
      className={cn(
        'group relative rounded-[3px] border border-white/[0.07] bg-[rgba(8,8,14,0.92)] backdrop-blur-md',
        'transition-[border-color,box-shadow] duration-300',
        'hover:border-white/[0.14] hover:shadow-[0_0_30px_-12px_var(--accent)]',
        className
      )}
    >
      {/* Hairline superior: única marca de color en reposo, se afirma en hover */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px opacity-50 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: 'linear-gradient(90deg, transparent, var(--accent), transparent)' }}
      />

      <header className="flex items-center gap-2.5 border-b border-white/[0.06] px-5 py-3.5 sm:px-6">
        <span
          aria-hidden="true"
          className="h-1.5 w-1.5 rotate-45 transition-shadow duration-300 group-hover:shadow-[0_0_8px_var(--accent)]"
          style={{ backgroundColor: accent }}
        />
        <h2 className="text-[0.6875rem] font-semibold uppercase leading-none tracking-[0.14em] text-white/70">
          {label}
        </h2>
      </header>

      <div className="p-5 sm:p-6">{children}</div>
    </motion.section>
  );
};
