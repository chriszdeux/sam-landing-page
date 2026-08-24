'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ChevronUp, ChevronDown, ArrowUpToLine } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

/**
 * Controlador de navegación por módulos, abajo a la derecha.
 *
 * Descubre las secciones por `[data-scroll-section]` en vez de recibir una
 * lista: así agregar un módulo a la página no obliga a actualizar este
 * componente. El valor del atributo es la etiqueta que se muestra.
 */

// El header es fixed y mide 64px: sin restarlo, cada salto deja el título
// de la sección tapado detrás de la barra.
const HEADER_OFFSET = 64;

export const SectionScroller = () => {
  const reduced = useReducedMotion();
  const [sections, setSections] = useState<HTMLElement[]>([]);
  const [active, setActive] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const frame = useRef(0);

  // Las secciones se montan después que este componente, así que se leen del
  // DOM tras el primer paint.
  //
  // Deliberadamente sin MutationObserver: observar todo el body reasignaba el
  // array en cada cambio del DOM, y como framer-motion monta y desmonta nodos
  // sin parar, eso disparaba un bucle de re-render que dejaba el índice activo
  // congelado. Dos pasadas alcanzan para esperar el contenido diferido.
  useEffect(() => {
    const collect = () => {
      const found = Array.from(document.querySelectorAll<HTMLElement>('[data-scroll-section]'));
      setSections((prev) =>
        prev.length === found.length && prev.every((el, i) => el === found[i]) ? prev : found
      );
    };
    collect();
    const t = setTimeout(collect, 400);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!sections.length) return;

    const onScroll = () => {
      // rAF: el scroll dispara muchísimo más seguido que los frames.
      if (frame.current) return;
      frame.current = requestAnimationFrame(() => {
        frame.current = 0;
        const y = window.scrollY;
        setScrolled(y > 240);

        // Sección activa: la última cuyo borde superior ya pasó la barra.
        const probe = y + HEADER_OFFSET + 8;
        let idx = 0;
        for (let i = 0; i < sections.length; i++) {
          if (sections[i].offsetTop <= probe) idx = i;
        }
        // Al llegar al fondo, la última sección puede ser más corta que el
        // viewport y nunca alcanzar el umbral: se fuerza.
        if (window.innerHeight + y >= document.body.scrollHeight - 2) {
          idx = sections.length - 1;
        }
        setActive(idx);
      });
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame.current) cancelAnimationFrame(frame.current);
    };
  }, [sections]);

  const goTo = useCallback(
    (index: number) => {
      const el = sections[index];
      if (!el) return;
      window.scrollTo({
        top: Math.max(el.offsetTop - HEADER_OFFSET, 0),
        behavior: reduced ? 'auto' : 'smooth',
      });
    },
    [sections, reduced]
  );

  const toTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
  }, [reduced]);

  if (sections.length < 2) return null;

  const atFirst = active === 0;
  const atLast = active === sections.length - 1;

  return (
    // El ToastStack ya ocupa bottom-6 right-6 con z-[9999]; este control queda
    // en la misma esquina pero corrido a la izquierda para no quedar debajo de
    // los toasts cuando aparecen.
    <div className="fixed bottom-6 right-[5.5rem] z-40 hidden flex-col items-end gap-2 md:flex">
      {/* Etiqueta de la sección actual: el contador solo no dice dónde estás */}
      <motion.div
        key={active}
        initial={{ opacity: 0, x: 6 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.18 }}
        className="rounded-[3px] border border-white/[0.07] bg-[rgba(8,8,14,0.92)] px-2.5 py-1 backdrop-blur-md"
      >
          <span className="text-[0.6rem] font-semibold uppercase tracking-[0.14em] text-[#00f3ff]">
            {sections[active]?.dataset.scrollSection}
          </span>
          <span className="ml-2 text-[0.6rem] tabular-nums text-white/30">
            {active + 1}/{sections.length}
          </span>
      </motion.div>

      <div className="flex flex-col overflow-hidden rounded-[3px] border border-white/[0.07] bg-[rgba(8,8,14,0.92)] backdrop-blur-md">
        <ScrollBtn
          label="Módulo anterior"
          onClick={() => goTo(active - 1)}
          disabled={atFirst}
          icon={<ChevronUp size={16} />}
        />
        <div className="h-px bg-white/[0.07]" />
        <ScrollBtn
          label="Módulo siguiente"
          onClick={() => goTo(active + 1)}
          disabled={atLast}
          icon={<ChevronDown size={16} />}
        />

        {/* Volver al inicio: solo útil con scroll, pero se mantiene montado con
            alto fijo y se atenúa.

            No animar `height: 'auto'` acá es deliberado: eso obliga a
            framer-motion a medir layout, y para medir resetea el scroll de la
            ventana a 0 y lo restaura — lo que CANCELA cualquier scroll suave en
            curso. Como este botón aparecía justo al cruzar el umbral, abortaba
            el propio salto entre módulos a mitad de camino. */}
        <div
          aria-hidden={!scrolled}
          className={cn(
            'transition-opacity duration-200',
            scrolled ? 'opacity-100' : 'pointer-events-none opacity-0'
          )}
        >
          <div className="h-px bg-white/[0.07]" />
          <ScrollBtn
            label="Volver al inicio"
            onClick={toTop}
            icon={<ArrowUpToLine size={15} />}
            disabled={!scrolled}
          />
        </div>
      </div>
    </div>
  );
};

const ScrollBtn = ({
  label,
  onClick,
  icon,
  disabled,
}: {
  label: string;
  onClick: () => void;
  icon: React.ReactNode;
  disabled?: boolean;
}) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    aria-label={label}
    title={label}
    className={cn(
      'flex h-9 w-9 items-center justify-center transition-colors duration-200',
      'focus-visible:outline-none focus-visible:text-[#00f3ff]',
      disabled
        ? 'cursor-not-allowed text-white/15'
        : 'text-white/55 hover:bg-[#00f3ff]/10 hover:text-[#00f3ff]'
    )}
  >
    {icon}
  </button>
);
