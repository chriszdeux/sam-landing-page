// 1-Definir componente de encabezado de página
// 2-Renderizar encabezado con título animado

//# 1-Definir componente de encabezado de página
'use client';

import React from 'react';
import { Typography } from './Typography';
import { Reveal } from './TextReveal';

interface PageHeaderProps {
  title: string;
  highlight?: string;
  subtitle: string;
  color?: string;
}

export const PageHeader = ({ title, highlight, subtitle, color = '#00f3ff' }: PageHeaderProps) => {

  //# 2-Renderizar encabezado con título animado
  return (
    <div className="relative mb-16 text-center">
      {/* Reveal en vez del motion.div propio: así el título y el subtítulo
          entran escalonados en lugar de moverse como un solo bloque. */}
      <Reveal>
        <div className="mb-4 flex items-center justify-center gap-4">
            <div className="h-0.5 w-[60px]" style={{ background: `linear-gradient(90deg, transparent, ${color})` }} />
            <div className="h-2.5 w-2.5 rotate-45" style={{ backgroundColor: color, boxShadow: `0 0 10px ${color}` }} />
            <div className="h-0.5 w-[60px]" style={{ background: `linear-gradient(-90deg, transparent, ${color})` }} />
        </div>

        <Typography
            variant="h2"
            component="h1"
            className="mb-6 text-[2rem] font-black uppercase tracking-[0.1em] bg-clip-text text-transparent md:text-[3.5rem]"
            style={{
                background: `linear-gradient(180deg, #fff 0%, ${color} 100%)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                filter: `drop-shadow(0 0 20px ${color}40)`,
            }}
        >
          {title} {highlight && <span style={{ color, WebkitTextFillColor: 'initial' }}>{highlight}</span>}
        </Typography>

        <div className="relative inline-block px-8 py-2">

            <div
                className="absolute left-0 top-0 h-full w-5"
                style={{ borderLeft: `2px solid ${color}40`, borderTop: `2px solid ${color}40`, borderBottom: `2px solid ${color}40` }}
            />
            <div
                className="absolute right-0 top-0 h-full w-5"
                style={{ borderRight: `2px solid ${color}40`, borderTop: `2px solid ${color}40`, borderBottom: `2px solid ${color}40` }}
            />

            <Typography
                variant="h6"
                className="mx-auto max-w-[600px] text-[0.9rem] tracking-[0.05em] text-foreground-muted md:text-[1.1rem]"
            >
              {subtitle}
            </Typography>
        </div>
      </Reveal>
    </div>
  );
};
