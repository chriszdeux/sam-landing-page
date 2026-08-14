import React from 'react';
import { cn } from '@/lib/utils/cn';

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

interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
  variant?: Variant;
  component?: React.ElementType;
  className?: string;
  children?: React.ReactNode;
}

export const Typography = ({
  variant = 'body1',
  component,
  className,
  children,
  ...props
}: TypographyProps) => {
  const Tag = component || variantTag[variant];
  return (
    <Tag className={cn(variantClasses[variant], className)} {...props}>
      {children}
    </Tag>
  );
};
