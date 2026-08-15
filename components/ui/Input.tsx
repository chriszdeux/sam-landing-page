// 1-Definir estilos base para inputs personalizados
// 2-Definir componente Input con soporte para Select
// 3-Renderizar campo de entrada o selector

import React from 'react';
import { Select, SelectProps } from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';
import { cn } from '@/lib/utils/cn';

//# 1-Definir estilos base para inputs personalizados
const fieldClassName =
  'mt-0 w-full rounded border border-white/20 bg-white/5 px-3 py-2.5 text-base text-foreground transition-colors placeholder:text-foreground-muted/70 hover:border-white/40 focus:border-primary focus:shadow-[0_0_0_0.2rem_rgba(255,255,255,0.25)] focus:outline-none';

const errorFieldClassName =
  'border-error focus:border-error focus:shadow-[0_0_0_0.2rem_rgba(239,154,154,0.25)]';

//# 2-Definir componente Input con soporte para Select
interface CustomInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'children' | 'size'> {
  /** @deprecated MUI-era `size="small"|"medium"` variant, ignored by the
   * Tailwind field - kept for type-compat with not-yet-migrated consumers. */
  size?: 'small' | 'medium' | number;
  label?: string;
  id?: string;
  helperText?: string;
  error?: boolean;
  select?: boolean;
  children?: React.ReactNode;
  containerClassName?: string;
  startAdornment?: React.ReactNode;
  /** MUI-era prop still honored: extra native attributes (min/max/step/etc.)
   * forwarded straight onto the underlying <input>. */
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
  /** @deprecated MUI-era props kept only for type-compat with not-yet-migrated
   * consumers (market/economy/portfolio) - ignored by the Tailwind field. */
  fullWidth?: boolean;
  /** @deprecated see above */
  sx?: SxProps<Theme>;
  /** @deprecated see above */
  containerSx?: SxProps<Theme>;
}

export const Input = React.forwardRef<HTMLInputElement, CustomInputProps>(
  (
    {
      label,
      id,
      helperText,
      error,
      select,
      children,
      containerClassName,
      startAdornment,
      inputProps,
      fullWidth: _fullWidth,
      sx: _sx,
      containerSx: _containerSx,
      size: _size,
      className,
      ...props
    },
    ref
  ) => {
    //# 3-Renderizar campo de entrada o selector
    return (
      <div className={cn('mb-4 w-full', containerClassName)}>
        {label && (
          <label htmlFor={id} className="mb-2 block text-base font-bold text-foreground">
            {label}
          </label>
        )}

        {select ? (
          // Modo `select` todavía respaldado por MUI Select/MenuItem: algunos
          // consumidores (market/economy, tier posterior de la migración)
          // siguen pasando <MenuItem> - se convierte junto con ellos para no
          // romper esos call sites antes de tiempo.
          <Select
            id={id}
            fullWidth
            {...(props as unknown as SelectProps)}
          >
            {children}
          </Select>
        ) : (
          <div className="relative">
            {startAdornment && (
              <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                {startAdornment}
              </span>
            )}
            <input
              id={id}
              ref={ref}
              className={cn(fieldClassName, startAdornment && 'pl-10', error && errorFieldClassName, className)}
              {...props}
              {...inputProps}
            />
          </div>
        )}

        {helperText && (
          <p className={cn('mt-1 block text-xs', error ? 'text-error' : 'text-foreground-muted')}>
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
