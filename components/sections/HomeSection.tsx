'use client';

import React from 'react';
import { Box, Container, Typography, Stack, Chip } from '@mui/material';
import Link from 'next/link';
import { Button } from '../ui/Button';

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
  <Box
    id={id}
    component="section"
    sx={{ position: 'relative', borderTop: `1px solid ${accentColor}12` }}
  >
    <Box sx={{
      minHeight: fullWidth ? 'auto' : { xs: 'auto', md: '85vh' },
      display: 'flex',
      alignItems: 'center',
      py: { xs: 10, md: 14 },
      position: 'relative',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        background: `radial-gradient(ellipse at ${reverse ? '80%' : '20%'} 50%, ${accentColor}08 0%, transparent 65%)`,
        pointerEvents: 'none',
      },
    }}>
    <Container maxWidth="xl">
      <Box sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: fullWidth ? 'column' : (reverse ? 'row-reverse' : 'row') },
        gap: { xs: 6, md: 10 },
        alignItems: 'center',
      }}>
        {/* Text content */}
        <Box sx={{ flex: 1, maxWidth: fullWidth ? 'none' : { md: 580 }, width: '100%' }}>
          <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2.5 }}>
            <Box sx={{
              p: 1, borderRadius: '10px',
              bgcolor: `${accentColor}12`,
              border: `1px solid ${accentColor}25`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Icon size={22} color={accentColor} />
            </Box>
            <Chip
              label={tag}
              size="small"
              sx={{
                bgcolor: `${accentColor}10`,
                color: accentColor,
                border: `1px solid ${accentColor}30`,
                fontWeight: 'bold',
                letterSpacing: 1.5,
                fontSize: '0.6rem',
              }}
            />
          </Stack>

          <Typography variant="h2" sx={{
            fontWeight: 900,
            lineHeight: 1.05,
            textTransform: 'uppercase',
            mb: 2,
            fontSize: { xs: '2.2rem', md: '3.5rem' },
            color: 'white',
          }}>
            {title}{' '}
            {titleHighlight && (
              <Box component="span" sx={{
                color: accentColor,
                textShadow: `0 0 20px ${accentColor}60`,
              }}>
                {titleHighlight}
              </Box>
            )}
          </Typography>

          <Typography variant="body1" sx={{
            color: 'rgba(255,255,255,0.65)',
            fontSize: { xs: '1rem', md: '1.1rem' },
            lineHeight: 1.85,
            mb: futureLine ? 2 : 4,
            borderLeft: `2px solid ${accentColor}30`,
            pl: 2.5,
          }}>
            {description}
          </Typography>

          {fullWidth && children && (
            <Box sx={{ mt: 3, mb: 4, width: '100%' }}>
              {children}
            </Box>
          )}

          {futureLine && (
            <Box sx={{
              mb: 4, p: 2, borderRadius: 2,
              bgcolor: `${accentColor}06`,
              border: `1px solid ${accentColor}20`,
            }}>
              <Typography variant="caption" sx={{
                color: `${accentColor}cc`,
                fontSize: '0.8rem',
                lineHeight: 1.7,
                display: 'block',
              }}>
                🛸 {futureLine}
              </Typography>
            </Box>
          )}

          {(actionLabel && (actionHref || onAction)) && (
            actionHref ? (
              <Link href={actionHref} style={{ textDecoration: 'none' }}>
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
        </Box>

        {/* Visual panel */}
        {!fullWidth && (
          <Box sx={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 260,
          }}>
            {children ?? (
              <Box sx={{
                width: { xs: 240, md: 340 },
                height: { xs: 240, md: 340 },
                borderRadius: '50%',
                border: `1px solid ${accentColor}20`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                boxShadow: `0 0 60px ${accentColor}08, inset 0 0 60px ${accentColor}04`,
              }}>
                <Box sx={{
                  position: 'absolute', inset: 16,
                  borderRadius: '50%',
                  border: `1px solid ${accentColor}12`,
                  animation: 'orbit 12s linear infinite',
                  '@keyframes orbit': {
                    from: { transform: 'rotate(0deg)' },
                    to: { transform: 'rotate(360deg)' },
                  },
                }}>
                  <Box sx={{
                    position: 'absolute',
                    top: -5, left: '50%', transform: 'translateX(-50%)',
                    width: 10, height: 10,
                    borderRadius: '50%',
                    bgcolor: accentColor,
                    boxShadow: `0 0 12px ${accentColor}`,
                  }} />
                </Box>
                <Box sx={{
                  p: 3,
                  borderRadius: '50%',
                  bgcolor: `${accentColor}10`,
                  border: `1px solid ${accentColor}25`,
                }}>
                  <Icon size={72} color={accentColor} />
                </Box>
              </Box>
            )}
          </Box>
        )}
      </Box>
    </Container>
    </Box>
  </Box>
);
