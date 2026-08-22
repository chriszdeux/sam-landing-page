// 1-Definir campo de dato con feedback de copiado
// 2-Renderizar etiqueta, valor y estado copiado

'use client';

import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Check, Copy } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface DataFieldProps {
  label: string;
  /** Texto ya formateado que se muestra al usuario. */
  display: string;
  /** Valor real; si está vacío el campo no es copiable. */
  value?: string;
  /** Se dispara al copiar. La lógica de copiado vive en la página. */
  onCopy?: () => void;
  mono?: boolean;
  valueClassName?: string;
}

//# 1-Definir campo de dato con feedback de copiado
// Antes cada campo copiable era un <div onClick> sin feedback propio: el único
// acuse era el toast global, lejos del dato tocado. Acá el icono muta a check y
// una hairline barre el campo, así la confirmación aparece donde está la acción.
export const DataField = ({ label, display, value, onCopy, mono, valueClassName }: DataFieldProps) => {
  const reduceMotion = useReducedMotion();
  const [copied, setCopied] = useState(false);
  const copyable = !!value && !!onCopy;

  useEffect(() => {
    if (!copied) return;
    const id = setTimeout(() => setCopied(false), 1600);
    return () => clearTimeout(id);
  }, [copied]);

  const handleCopy = () => {
    if (!copyable) return;
    onCopy?.();
    setCopied(true);
  };

  const valueNode = (
    <span
      className={cn(
        'truncate text-[0.9375rem] leading-tight transition-colors duration-200',
        mono && 'font-mono',
        valueClassName ?? 'text-white'
      )}
    >
      {display}
    </span>
  );

  const content = (
    <>
      <span className="text-[0.625rem] font-semibold uppercase leading-none tracking-[0.16em] text-white/40 transition-colors duration-200 group-hover/field:text-white/60">
        {label}
      </span>
      <span className="flex min-w-0 items-center gap-2">
        {valueNode}
        {copyable && (
          <span className="relative flex h-4 w-4 shrink-0 items-center justify-center">
            <AnimatePresence initial={false} mode="wait">
              {copied ? (
                <motion.span
                  key="ok"
                  initial={{ opacity: 0, scale: reduceMotion ? 1 : 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: reduceMotion ? 1 : 0.5 }}
                  transition={{ duration: reduceMotion ? 0 : 0.18 }}
                  className="absolute text-[#00f3ff]"
                >
                  <Check size={16} />
                </motion.span>
              ) : (
                <motion.span
                  key="copy"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: reduceMotion ? 0 : 0.18 }}
                  className="absolute text-white/35 transition-colors duration-200 group-hover/field:text-white/70"
                >
                  <Copy size={16} />
                </motion.span>
              )}
            </AnimatePresence>
          </span>
        )}
      </span>
    </>
  );

  //# 2-Renderizar etiqueta, valor y estado copiado
  const base =
    'group/field relative flex w-full min-w-0 flex-col gap-1.5 rounded-[3px] border border-white/[0.06] bg-white/[0.015] px-3.5 py-3 text-left transition-colors duration-200';

  if (!copyable) {
    return <div className={base}>{content}</div>;
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={`Copiar ${label}`}
      className={cn(
        base,
        'cursor-pointer overflow-hidden hover:border-white/[0.14] hover:bg-white/[0.04]',
        'focus-visible:border-[#00f3ff]/50 focus-visible:outline-none'
      )}
    >
      {content}
      {/* Barrido de confirmación: dura lo mismo que el estado copiado */}
      <motion.span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px origin-left bg-[#00f3ff]"
        initial={false}
        animate={{ scaleX: copied ? 1 : 0, opacity: copied ? 1 : 0 }}
        transition={{ duration: reduceMotion ? 0 : 0.35, ease: 'easeOut' }}
      />
    </button>
  );
};
