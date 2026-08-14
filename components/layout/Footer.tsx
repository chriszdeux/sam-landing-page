'use client';

import React from 'react';
import { Box, Container, Typography, IconButton, Stack, Grid } from '@mui/material';
import { Twitter, GitHub, LinkedIn } from '@mui/icons-material';
import Link from 'next/link';
import { EnvVariables } from '@/lib/constants/variables';

export const Footer = () => {
  return (
    <Box 
      component="footer" 
      sx={{ 
        bgcolor: '#04040a', 
        py: 8, 
        borderTop: '1px solid rgba(0, 243, 255, 0.1)',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '2px',
          background: 'linear-gradient(90deg, transparent, #00f3ff, transparent)',
          opacity: 0.5,
        }
      }}
    >
      <Container maxWidth="xl">
        <Grid container spacing={5}>
          {/* Logo & Description */}
          <Grid size={{ xs: 12, md: 5 }}>
            <Typography 
              variant="h5" 
              color="primary" 
              gutterBottom 
              sx={{ 
                fontWeight: '900', 
                letterSpacing: 2,
                color: '#00f3ff',
                textShadow: '0 0 15px rgba(0, 243, 255, 0.3)'
              }}
            >
              {EnvVariables.project.toUpperCase()}
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)', pr: { md: 5 }, lineHeight: 1.8 }}>
              Soberanía criptográfica e infraestructura de supervivencia en el yermo galáctico. 
              El ledger de sedimento inmutable para una civilización descentralizada y libre del control fiat.
            </Typography>
          </Grid>

          {/* Quick Links */}
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Typography variant="subtitle1" sx={{ color: 'white', fontWeight: 'bold', mb: 2, letterSpacing: 1 }}>
              Protocolos Rápidos
            </Typography>
            <Stack spacing={1.5}>
              {[
                { name: 'Inicio', path: '/' },
                { name: '¿Qué es Lyncore?', path: '/que-es-lyncore' },
                { name: 'Historia', path: '/history' },
                { name: 'Operaciones', path: '/operaciones' }
              ].map((link) => (
                <Link key={link.name} href={link.path} style={{ textDecoration: 'none' }}>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: 'rgba(255,255,255,0.5)', 
                      cursor: 'pointer', 
                      transition: 'color 0.2s',
                      '&:hover': { color: '#00f3ff' } 
                    }}
                  >
                    {link.name}
                  </Typography>
                </Link>
              ))}
            </Stack>
          </Grid>

          {/* Status & Socials */}
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Typography variant="subtitle1" sx={{ color: 'white', fontWeight: 'bold', mb: 2, letterSpacing: 1 }}>
              Soporte de Flota
            </Typography>
            <Stack spacing={2}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#00ff88', boxShadow: '0 0 10px #00ff88' }} />
                <Typography variant="caption" sx={{ color: '#00ff88', fontWeight: 'bold', letterSpacing: 1.5 }}>
                  LEDGER: CONECTADO
                </Typography>
              </Box>
              <Stack direction="row" spacing={1.5}>
                {[
                  { icon: <Twitter />, label: 'Twitter', color: '#00f3ff' },
                  { icon: <GitHub />, label: 'GitHub', color: '#ffffff' },
                  { icon: <LinkedIn />, label: 'LinkedIn', color: '#0a66c2' }
                ].map((social, index) => (
                  <IconButton 
                    key={index}
                    aria-label={social.label}
                    sx={{ 
                      color: 'rgba(255,255,255,0.6)', 
                      border: '1px solid rgba(255,255,255,0.1)',
                      '&:hover': { 
                        color: social.color, 
                        borderColor: social.color,
                        bgcolor: 'rgba(255,255,255,0.02)',
                        transform: 'translateY(-2px)'
                      },
                      transition: 'all 0.2s'
                    }}
                  >
                    {social.icon}
                  </IconButton>
                ))}
              </Stack>
            </Stack>
          </Grid>
        </Grid>

        {/* Bottom copyright */}
        <Box 
          sx={{ 
            mt: 6, 
            pt: 4, 
            borderTop: '1px solid rgba(255,255,255,0.05)', 
            textAlign: 'center', 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            flexWrap: 'wrap',
            gap: 2
          }}
        >
          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.4)' }}>
            © {new Date().getFullYear()} Lyncore Protocol. Todos los derechos reservados bajo la regla del ledger.
          </Typography>
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.2)', fontFamily: 'monospace' }}>
            v0.2.0-apocalypse
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};
