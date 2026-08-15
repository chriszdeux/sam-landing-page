'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '../ui/Button';
import { Typography } from '../ui/Typography';
import { cn } from '@/lib/utils/cn';

interface HomeSectionProps {
  id: string;
  accentColor: string;
  tag: string;
  Icon: React.FC<{ size?: number; color?: string }>;
  title: string;
  titleHighlight?: string;
  description: string;
  futureLine?: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
  reverse?: boolean;
  children?: React.ReactNode;
  fullWidth?: boolean;
}

export const HomeSection = ({
  id, accentColor, tag, Icon, title, titleHighlight, description, futureLine,
  actionLabel, actionHref, onAction, reverse = false, children, fullWidth = false
}: HomeSectionProps) => (
  <section id={id} className="relative" style={{ borderTop: `1px solid ${accentColor}12` }}>
    <div
      className={cn(
        'relative flex items-center py-20 md:py-28',
        !fullWidth && 'md:min-h-[85vh]'
      )}
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(ellipse at ${reverse ? '80%' : '20%'} 50%, ${accentColor}08 0%, transparent 65%)`,
        }}
      />
      <div className="relative mx-auto w-full max-w-[1536px] px-4 sm:px-6 lg:px-8">
        <div
          className={cn(
            'flex flex-col items-center gap-12 md:gap-20',
            fullWidth ? 'md:flex-col' : reverse ? 'md:flex-row-reverse' : 'md:flex-row'
          )}
        >
          {/* Text content */}
          <div className={cn('w-full flex-1', !fullWidth && 'md:max-w-[580px]')}>
            <div className="mb-5 flex flex-row items-center gap-3">
              <div
                className="flex items-center justify-center rounded-[10px] p-2"
                style={{ backgroundColor: `${accentColor}12`, border: `1px solid ${accentColor}25` }}
              >
                <Icon size={22} color={accentColor} />
              </div>
              <span
                className="inline-flex h-6 items-center rounded-full px-2.5 text-[0.6rem] font-bold tracking-[1.5px]"
                style={{
                  backgroundColor: `${accentColor}10`,
                  color: accentColor,
                  border: `1px solid ${accentColor}30`,
                }}
              >
                {tag}
              </span>
            </div>

            <Typography
              variant="h2"
              className="mb-4 text-[2.2rem] md:text-[3.5rem] font-black leading-[1.05] uppercase text-white"
            >
              {title}{' '}
              {titleHighlight && (
                <span style={{ color: accentColor, textShadow: `0 0 20px ${accentColor}60` }}>
                  {titleHighlight}
                </span>
              )}
            </Typography>

            <Typography
              variant="body1"
              className={cn(
                'text-[1rem] md:text-[1.1rem] leading-[1.85] text-white/65 pl-5 border-l-2',
                futureLine ? 'mb-4' : 'mb-8'
              )}
              style={{ borderColor: `${accentColor}30` }}
            >
              {description}
            </Typography>

            {fullWidth && children && (
              <div className="mt-6 mb-8 w-full">
                {children}
              </div>
            )}

            {futureLine && (
              <div
                className="mb-8 rounded-lg p-4"
                style={{ backgroundColor: `${accentColor}06`, border: `1px solid ${accentColor}20` }}
              >
                <Typography
                  variant="caption"
                  className="block text-[0.8rem] leading-[1.7]"
                  style={{ color: `${accentColor}cc` }}
                >
                  🛸 {futureLine}
                </Typography>
              </div>
            )}

            {(actionLabel && (actionHref || onAction)) && (
              actionHref ? (
                <Link href={actionHref} className="no-underline">
                  <Button
                    variant="contained"
                    size="large"
                    glow
                    sx={{
                      bgcolor: accentColor,
                      color: accentColor === '#00f3ff' || accentColor === '#00e676' ? '#000' : '#fff',
                      fontWeight: 'bold',
                      px: 5,
                      py: 1.5,
                      fontSize: '0.9rem',
                      letterSpacing: 1.5,
                      boxShadow: `0 0 24px ${accentColor}40`,
                      '&:hover': {
                        boxShadow: `0 0 40px ${accentColor}60`,
                        transform: 'translateY(-2px)',
                      },
                      transition: 'all 0.25s ease',
                    }}
                  >
                    {actionLabel}
                  </Button>
                </Link>
              ) : (
                <Button
                  variant="contained"
                  size="large"
                  glow
                  onClick={onAction}
                  sx={{
                    bgcolor: accentColor,
                    color: '#000',
                    fontWeight: 'bold',
                    px: 5,
                    py: 1.5,
                    fontSize: '0.9rem',
                    letterSpacing: 1.5,
                    boxShadow: `0 0 24px ${accentColor}40`,
                    '&:hover': {
                      boxShadow: `0 0 40px ${accentColor}60`,
                      transform: 'translateY(-2px)',
                    },
                    transition: 'all 0.25s ease',
                  }}
                >
                  {actionLabel}
                </Button>
              )
            )}
          </div>

          {/* Visual panel */}
          {!fullWidth && (
            <div className="flex min-h-[260px] flex-1 items-center justify-center">
              {children ?? (
                <div
                  className="relative flex h-[240px] w-[240px] items-center justify-center rounded-full md:h-[340px] md:w-[340px]"
                  style={{
                    border: `1px solid ${accentColor}20`,
                    boxShadow: `0 0 60px ${accentColor}08, inset 0 0 60px ${accentColor}04`,
                  }}
                >
                  <div
                    className="absolute inset-4 animate-[orbit_12s_linear_infinite] rounded-full"
                    style={{ border: `1px solid ${accentColor}12` }}
                  >
                    <div
                      className="absolute -top-[5px] left-1/2 h-2.5 w-2.5 -translate-x-1/2 rounded-full"
                      style={{ backgroundColor: accentColor, boxShadow: `0 0 12px ${accentColor}` }}
                    />
                  </div>
                  <div
                    className="rounded-full p-6"
                    style={{ backgroundColor: `${accentColor}10`, border: `1px solid ${accentColor}25` }}
                  >
                    <Icon size={72} color={accentColor} />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  </section>
);
