'use client';

import React, { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils/cn';

interface ComboboxProps {
  options: string[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  maxSuggestions?: number;
}

// Combobox headless mínimo (equivalente a MUI Autocomplete freeSolo):
// input libre + lista de sugerencias filtradas, navegación por teclado.
// Solo hay 2 usos de Autocomplete en todo el proyecto, así que se
// construye a medida en vez de agregar una librería nueva.
export const Combobox = ({
  options,
  value,
  onChange,
  placeholder,
  disabled,
  className,
  maxSuggestions = 8,
}: ComboboxProps) => {
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);

  const filtered = value
    ? options.filter((o) => o.toLowerCase().includes(value.toLowerCase())).slice(0, maxSuggestions)
    : options.slice(0, maxSuggestions);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectOption = (option: string) => {
    onChange(option);
    setOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
      setOpen(true);
      return;
    }
    if (!open || filtered.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlighted((h) => (h + 1) % filtered.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlighted((h) => (h - 1 + filtered.length) % filtered.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      selectOption(filtered[highlighted]);
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  };

  return (
    <div ref={rootRef} className="relative">
      <input
        type="text"
        role="combobox"
        aria-expanded={open}
        aria-autocomplete="list"
        value={value}
        disabled={disabled}
        placeholder={placeholder}
        onChange={(e) => {
          onChange(e.target.value);
          setHighlighted(0);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={handleKeyDown}
        className={cn(
          'w-full rounded border border-white/10 bg-white/[0.03] px-3 py-2.5 font-mono text-base text-white transition-colors placeholder:text-white/30 hover:border-white/30 focus:outline-none disabled:opacity-50',
          className
        )}
      />
      {open && filtered.length > 0 && (
        <ul className="absolute z-20 mt-1 max-h-60 w-full overflow-y-auto rounded border border-white/10 bg-[#0a0a0f] py-1 font-mono text-sm shadow-[0_10px_30px_rgba(0,0,0,0.6)]">
          {filtered.map((option, index) => (
            <li key={option}>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => selectOption(option)}
                className={cn(
                  'block w-full truncate px-3 py-2 text-left text-white/80 hover:bg-white/5',
                  index === highlighted && 'bg-white/10 text-white'
                )}
              >
                {option}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
