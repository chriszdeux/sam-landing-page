'use client';

import { useEffect, useRef } from 'react';
import { animate, useInView } from 'framer-motion';

interface CountUpProps {
  to: number;
  from?: number;
  duration?: number;
  className?: string;
}

export const CountUp = ({ to, from = 0, duration = 2, className }: CountUpProps) => {
  const nodeRef = useRef<HTMLSpanElement>(null);
  const isInView = useInView(nodeRef, { once: true });

  useEffect(() => {
    const node = nodeRef.current;
    if (!node || !isInView) return;

    const controls = animate(from, to, {
      duration: duration,
      onUpdate(value) {
        node.textContent = value.toString();
      },
      ease: 'easeOut',
    });

    return () => controls.stop();
  }, [to, from, duration, isInView]);

  return <span ref={nodeRef} className={className}>{from}</span>;
};
