'use client';

import React, { createContext, useContext } from 'react';
import { motion, type Variants } from 'framer-motion';

/**
 * Revelado de texto al entrar en pantalla.
 *
 * La propagación de variantes de framer-motion viaja por contexto de React, no
 * por el DOM, así que un único `Reveal` con un solo IntersectionObserver puede
 * escalonar todos los títulos y párrafos que tenga debajo, por profundo que
 * estén y sin tocar cada llamada a Typography. Typography detecta el scope por
 * contexto y se renderiza como componente motion cuando está dentro.
 *
 * Por eso acá no hay `whileInView` por elemento: serían decenas de observers
 * y el escalonado se perdería.
 */

// El contexto lleva las variantes en vez de un booleano para que Typography no
// tenga que saber nada del revelado más allá de "aplicá esto".
//
// reduced-motion NO se decide acá: se resuelve con una media query CSS en
// app/layout.tsx. El servidor no puede leer la media query, así que su HTML
// siempre sale con los estilos inline del estado "hidden" de framer-motion, y
// el texto queda oculto antes de que corra un solo byte de JS. Ningún hook de
// React llega antes que eso; el CSS sí.
const RevealScopeCtx = createContext<Variants | null>(null);

export const useRevealVariants = () => useContext(RevealScopeCtx);

export const revealContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.075, delayChildren: 0.04 } },
};

export const revealItem: Variants = {
  hidden: { opacity: 0, y: 14 },
  // easeOutQuint: arranca rápido y asienta, se siente más "fluido" que un linear
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  /** Margen del viewport: negativo dispara un poco antes de entrar del todo. */
  margin?: string;
  /** Repetir cada vez que entra, en vez de una sola vez. */
  repeat?: boolean;
}

export const Reveal = ({ children, className, style, margin = '-80px', repeat = false }: RevealProps) => {
  return (
    <RevealScopeCtx.Provider value={revealItem}>
      <motion.div
        data-reveal
        initial="hidden"
        whileInView="show"
        viewport={{ once: !repeat, margin }}
        variants={revealContainer}
        className={className}
        style={style}
      >
        {children}
      </motion.div>
    </RevealScopeCtx.Provider>
  );
};
