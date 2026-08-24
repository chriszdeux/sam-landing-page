// 1-Definir tarjeta de identidad del usuario
// 2-Renderizar avatar, nombre y estado de acceso

'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { BadgeCheck } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface IdentityCardProps {
  initial: string;
  fullName: string;
  username?: string;
  confirmedAccount?: boolean;
  isBanned?: boolean;
}

//# 1-Definir tarjeta de identidad del usuario
export const IdentityCard = ({ initial, fullName, username, confirmedAccount, isBanned }: IdentityCardProps) => {
  const reduceMotion = useReducedMotion();
  const statusColor = isBanned ? '#ef9a9a' : '#a5d6a7';

  //# 2-Renderizar avatar, nombre y estado de acceso
  return (
    <div className="flex flex-col items-center text-center">
      <div className="relative mb-5 h-[104px] w-[104px]">
        {/* Anillo punteado en rotación lenta: da vida al bloque sin animar texto */}
        <motion.svg
          aria-hidden="true"
          viewBox="0 0 104 104"
          className="absolute inset-0 h-full w-full"
          animate={reduceMotion ? undefined : { rotate: 360 }}
          transition={reduceMotion ? undefined : { duration: 26, ease: 'linear', repeat: Infinity }}
        >
          <circle
            cx="52"
            cy="52"
            r="50"
            fill="none"
            stroke="#00f3ff"
            strokeOpacity="0.35"
            strokeWidth="1"
            strokeDasharray="3 9"
          />
        </motion.svg>

        {/* La inicial iba en text-white sobre bg-primary (que es #ffffff): era
            invisible. Ahora el fondo es casi negro y la inicial lleva el acento. */}
        <div className="absolute inset-[9px] flex items-center justify-center rounded-full border border-[#00f3ff]/30 bg-[rgba(8,8,14,0.92)] text-[2.5rem] font-bold leading-none text-[#00f3ff] transition-shadow duration-300 hover:shadow-[0_0_24px_-6px_#00f3ff]">
          {initial}
        </div>

        <span
          aria-hidden="true"
          className="absolute bottom-1 right-1 h-3.5 w-3.5 rounded-full border-2 border-[#05050c]"
          style={{ backgroundColor: statusColor }}
        />
        {!reduceMotion && (
          <motion.span
            aria-hidden="true"
            className="absolute bottom-1 right-1 h-3.5 w-3.5 rounded-full"
            style={{ backgroundColor: statusColor }}
            animate={{ scale: [1, 2, 2], opacity: [0.5, 0, 0] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'easeOut' }}
          />
        )}
      </div>

      <p className="text-[1.125rem] font-bold leading-tight text-white">{fullName}</p>

      <p className="mt-1 flex items-center justify-center gap-1.5 text-[0.8125rem] text-white/50">
        @{username}
        {confirmedAccount && <BadgeCheck size={15} className="text-[#00f3ff]" />}
      </p>

      <div
        className={cn(
          'mt-5 flex w-full items-center justify-center gap-2 rounded-[3px] border px-3 py-2',
          'text-[0.625rem] font-semibold uppercase tracking-[0.16em]',
          isBanned ? 'border-[#ef9a9a]/30 text-[#ef9a9a]' : 'border-[#a5d6a7]/30 text-[#a5d6a7]'
        )}
      >
        <span aria-hidden="true" className="h-1 w-1 rotate-45" style={{ backgroundColor: statusColor }} />
        {isBanned ? 'Acceso denegado' : 'Acceso autorizado'}
      </div>
    </div>
  );
};
