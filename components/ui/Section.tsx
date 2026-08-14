import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils/cn';

interface SectionProps {
  id: string;
  children: React.ReactNode;
  className?: string;
}

export const Section = ({ id, children, className }: SectionProps) => {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.8 }}
      className={cn('flex min-h-[80vh] items-center py-8 md:py-12', className)}
    >
      <div className="mx-auto w-full max-w-[1536px] px-4 sm:px-6 lg:px-8">
        {children}
      </div>
    </motion.section>
  );
};
