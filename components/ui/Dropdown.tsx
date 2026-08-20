'use client';

import React, { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils/cn';

interface DropdownProps {
  trigger: (state: { open: boolean }) => React.ReactNode;
  children: React.ReactNode;
  align?: 'left' | 'right';
  className?: string;
  panelClassName?: string;
}

// Dropdown headless mínimo: trigger + panel flotante, se cierra al
// hacer click afuera, con Escape, o al hacer click en cualquier item
// dentro del panel (patrón estándar de menú).
export const Dropdown = ({ trigger, children, align = 'right', className, panelClassName }: DropdownProps) => {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [open]);

  return (
    <div ref={rootRef} className={cn('relative', className)}>
      <div onClick={() => setOpen((o) => !o)}>{trigger({ open })}</div>
      {open && (
        <div
          onClick={() => setOpen(false)}
          className={cn(
            'absolute top-full z-30 mt-2 min-w-[210px] overflow-hidden rounded-[3px] py-1.5',
            'border border-white/[0.07] bg-[rgba(8,8,14,0.96)] backdrop-blur-xl',
            'shadow-[0_18px_50px_-12px_rgba(0,0,0,0.9)]',
            align === 'right' ? 'right-0' : 'left-0',
            panelClassName
          )}
        >
          {/* Hairline superior: mismo recurso de identidad que la línea del header */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#00f3ff]/40 to-transparent"
          />
          {children}
        </div>
      )}
    </div>
  );
};
