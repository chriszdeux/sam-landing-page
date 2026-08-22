'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils/cn';
import { useRevealVariants } from './TextReveal';

type Variant =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'subtitle1'
  | 'subtitle2'
  | 'body1'
  | 'body2'
  | 'caption'
  | 'overline'
  | 'button';

// Escala tipográfica equivalente a los defaults de MUI (Roboto), para
// mantener paridad visual mientras se migra de sx a className.
const variantClasses: Record<Variant, string> = {
  h1: 'text-glow text-[3rem] md:text-[6rem] font-light leading-[1.167] tracking-[-0.01562em]',
  h2: 'text-glow-secondary text-[2.5rem] md:text-[3.75rem] font-light leading-[1.2] tracking-[-0.00833em]',
  h3: 'text-[2rem] md:text-[3rem] font-normal leading-[1.167] tracking-normal',
  h4: 'text-[1.75rem] md:text-[2.125rem] font-normal leading-[1.235] tracking-[0.00735em]',
  h5: 'text-[1.25rem] md:text-[1.5rem] font-normal leading-[1.334] tracking-normal',
  h6: 'text-[1.1rem] md:text-[1.25rem] font-medium leading-[1.6] tracking-[0.0075em]',
  subtitle1: 'text-base font-normal leading-[1.75] tracking-[0.00938em]',
  subtitle2: 'text-sm font-medium leading-[1.57] tracking-[0.00714em]',
  body1: 'text-base font-normal leading-[1.5] tracking-[0.00938em]',
  body2: 'text-sm font-normal leading-[1.43] tracking-[0.01071em]',
  caption: 'text-xs font-normal leading-[1.66] tracking-[0.03333em]',
  overline: 'text-xs font-normal uppercase leading-[2.66] tracking-[0.08333em]',
  button: 'text-sm font-medium uppercase leading-[1.75] tracking-[0.02857em]',
};

const variantTag: Record<Variant, React.ElementType> = {
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  h5: 'h5',
  h6: 'h6',
  subtitle1: 'h6',
  subtitle2: 'h6',
  body1: 'p',
  body2: 'p',
  caption: 'span',
  overline: 'span',
  button: 'span',
};

// Creadas a nivel de módulo a propósito: generar el componente motion dentro
// del render lo recrearía en cada pasada y remontaría el nodo.
const MOTION_TAGS = {
  h1: motion.h1, h2: motion.h2, h3: motion.h3, h4: motion.h4, h5: motion.h5, h6: motion.h6,
  p: motion.p, span: motion.span, div: motion.div, li: motion.li, strong: motion.strong,
} as const;

// Solo títulos y texto corrido entran en el revelado. `caption` y `button`
// quedan fuera: son etiquetas de UI y celdas de tabla, y escalonarlas haría
// aparecer los datos de a uno.
const REVEALABLE: ReadonlySet<Variant> = new Set([
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'subtitle1', 'subtitle2', 'body1', 'body2', 'overline',
]);

interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
  variant?: Variant;
  component?: React.ElementType;
  className?: string;
  children?: React.ReactNode;
  /** Deja este texto fuera del revelado aunque esté dentro de un Reveal. */
  noReveal?: boolean;
}

export const Typography = ({
  variant = 'body1',
  component,
  className,
  children,
  noReveal,
  ...props
}: TypographyProps) => {
  const Tag = component || variantTag[variant];
  const revealVariants = useRevealVariants();
  const classes = cn(variantClasses[variant], className);

  const MotionTag =
    revealVariants && !noReveal && REVEALABLE.has(variant) && typeof Tag === 'string'
      ? MOTION_TAGS[Tag as keyof typeof MOTION_TAGS]
      : undefined;

  // Hereda las variantes del Reveal por contexto; no lleva whileInView propio.
  if (MotionTag) {
    // framer-motion redefine estos handlers con otra firma que los del DOM, así
    // que no pueden pasar por el spread. Se descartan en vez de castear: un
    // cast escondería el desajuste en lugar de resolverlo.
    const {
      onAnimationStart: _as, onAnimationEnd: _ae, onAnimationIteration: _ai,
      onDrag: _d, onDragStart: _ds, onDragEnd: _de, onDragEnter: _den,
      onDragExit: _dx, onDragLeave: _dl, onDragOver: _do, onDrop: _dr,
      ...motionSafe
    } = props;
    return (
      <MotionTag variants={revealVariants!} className={classes} {...motionSafe}>
        {children}
      </MotionTag>
    );
  }

  return (
    <Tag className={classes} {...props}>
      {children}
    </Tag>
  );
};
