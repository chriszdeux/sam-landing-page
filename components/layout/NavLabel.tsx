'use client';

import React from 'react';
import { cn } from '@/lib/utils/cn';

export type NavLabelState = 'rest' | 'active' | 'alert';

interface NavLabelProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'color'> {
  state?: NavLabelState;
  children: React.ReactNode;
}

// Etiqueta de navegación: texto fino en vez de botón enmarcado.
// El navbar mostraba hasta 9 botones con corte diagonal y glow, lo que
// competía por atención; aquí el peso visual lo lleva la tipografía
// (11px, semibold, tracking amplio) y el estado se comunica con una
// hairline de 1px, no con un recuadro.
const stateClasses: Record<NavLabelState, string> = {
  rest: 'text-white/55 hover:text-white',
  active: 'text-[#00f3ff]',
  alert: 'text-[#ffcc80] hover:text-[#ffdcab]',
};

export const NavLabel = React.forwardRef<HTMLButtonElement, NavLabelProps>(
  ({ state = 'rest', className, children, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        'group relative flex items-center gap-1.5 whitespace-nowrap px-3 py-2',
        'text-[0.6875rem] font-semibold uppercase leading-none tracking-[0.14em]',
        'transition-colors duration-200 focus-visible:outline-none',
        stateClasses[state],
        className
      )}
      style={
        state === 'active'
          ? { textShadow: '0 0 12px rgba(0,243,255,0.45)' }
          : state === 'alert'
            ? { textShadow: '0 0 12px rgba(255,204,128,0.45)' }
            : undefined
      }
      {...props}
    >
      {children}
      {/* Hairline de hover/foco: solo insinúa el estado, sin encerrar el texto */}
      <span
        aria-hidden="true"
        className={cn(
          'pointer-events-none absolute inset-x-2 bottom-0 h-px origin-center scale-x-0 bg-white/25',
          'transition-transform duration-200 group-hover:scale-x-100 group-focus-visible:scale-x-100',
          state !== 'rest' && 'hidden'
        )}
      />
    </button>
  )
);

NavLabel.displayName = 'NavLabel';
