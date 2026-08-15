import React from 'react';
import { cn } from '@/lib/utils/cn';
import { Typography } from './Typography';

interface SectionTitleProps {
  children: React.ReactNode;
  subtitle?: string;
  align?: 'left' | 'center' | 'right';
  color?: string;
}

const alignClasses = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
} as const;

export const SectionTitle = ({ children, subtitle, align = 'center', color = '#00f3ff' }: SectionTitleProps) => {
  return (
    <div className={cn('mb-16', alignClasses[align])}>
      {subtitle && (
        <Typography variant="overline" className="mb-1 block tracking-[3px]" style={{ color }}>
          {subtitle}
        </Typography>
      )}
      <Typography
        variant="h2"
        className="mb-1 text-[2rem] md:text-[3rem] font-black uppercase text-white"
        style={{ textShadow: `0 0 20px ${color}80` }}
      >
        {children}
      </Typography>
      <hr
        className={cn('my-4 border-t opacity-30', align === 'center' ? 'mx-auto max-w-[200px]' : 'max-w-[100px]')}
        style={{ borderColor: color }}
      />
    </div>
  );
};
