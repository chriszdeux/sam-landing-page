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
            'absolute top-full z-30 mt-2 min-w-[200px] overflow-hidden rounded-lg border border-white/10 bg-[#0a0a0f] py-1 shadow-[0_10px_30px_rgba(0,0,0,0.6)]',
            align === 'right' ? 'right-0' : 'left-0',
            panelClassName
          )}
        >
          {children}
        </div>
      )}
    </div>
  );
};
