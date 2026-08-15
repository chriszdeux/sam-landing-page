'use client';

import React from 'react';
import * as RadixTooltip from '@radix-ui/react-tooltip';
import { cn } from '@/lib/utils/cn';

interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  side?: 'top' | 'right' | 'bottom' | 'left';
  className?: string;
}

export const Tooltip = ({ content, children, side = 'top', className }: TooltipProps) => (
  <RadixTooltip.Provider delayDuration={200}>
    <RadixTooltip.Root>
      <RadixTooltip.Trigger asChild>{children}</RadixTooltip.Trigger>
      <RadixTooltip.Portal>
        <RadixTooltip.Content
          side={side}
          sideOffset={6}
          className={cn(
            'z-50 max-w-xs rounded-md border border-white/10 bg-[rgba(10,10,10,0.95)] px-3 py-1.5 text-sm font-bold text-white shadow-[0_4px_20px_rgba(0,0,0,0.8)]',
            className
          )}
        >
          {content}
          <RadixTooltip.Arrow className="fill-[rgba(10,10,10,0.95)]" />
        </RadixTooltip.Content>
      </RadixTooltip.Portal>
    </RadixTooltip.Root>
  </RadixTooltip.Provider>
);
