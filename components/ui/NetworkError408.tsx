'use client';

import React, { useEffect, useState } from 'react';
import { Box, Typography, Container, Button } from '@mui/material';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function NetworkError408() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(15);
  const [glitchActive, setGlitchActive] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          return 15; // Reset loop simulating attempts
        }
        return prev - 1;
      });
    }, 1000);

    const glitchTimer = setInterval(() => {
      setGlitchActive((prev) => !prev);
    }, 3000);

    return () => {
      clearInterval(timer);
      clearInterval(glitchTimer);
    };
  }, []);

  return (
    <Box sx={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      bgcolor: '#1c120c', // Sepia dark background
      backgroundImage: 'radial-gradient(circle, #2b1c12 0%, #0d0704 100%)',
      position: 'relative',
      overflow: 'hidden',
      color: '#e6ad7a', // Sepia text
      fontFamily: 'monospace',
    }}>
      {/* Inline styles for custom animations */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes glitch-text {
          0% { text-shadow: 2px -2px #ff8a00, -2px 2px #ff0055; }
          25% { text-shadow: -2px 2px #ff8a00, 2px -2px #ff0055; }
          50% { text-shadow: 1px -1px #ff8a00, -1px 1px #ff0055; }
          75% { text-shadow: -1px 1px #ff8a00, 1px -1px #ff0055; }
          100% { text-shadow: 2px -2px #ff8a00, -2px 2px #ff0055; }
        }
        @keyframes scanline-anim {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        @keyframes flicker-anim {
          0%, 100% { opacity: 0.96; }
          50% { opacity: 1; }
          90% { opacity: 0.94; }
        }
      `}} />

      {/* Interferencia / Noise Scanline Layer */}
      <Box sx={{
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        background: 'linear-gradient(rgba(28, 18, 12, 0) 50%, rgba(0, 0, 0, 0.4) 50%)',
        backgroundSize: '100% 4px',
        animation: 'flicker-anim 0.15s infinite',
        pointerEvents: 'none',
        zIndex: 5,
      }} />

      {/* Moving CRT Scanline */}
      <Box sx={{
        position: 'absolute',
        top: 0, left: 0, right: 0,
        height: '100%',
        background: 'linear-gradient(to bottom, transparent, rgba(230, 173, 122, 0.08), transparent)',
        animation: 'scanline-anim 6s linear infinite',
        pointerEvents: 'none',
        zIndex: 6,
      }} />

      <Container maxWidth="md" sx={{ position: 'relative', zIndex: 10, textAlign: 'center', px: 3 }}>
        {/* Animated Warning Icon */}
        <Box sx={{
          display: 'inline-flex',
          p: 3,
          borderRadius: '50%',
          bgcolor: 'rgba(230, 173, 122, 0.05)',
          border: '2px solid rgba(230, 173, 122, 0.25)',
          boxShadow: '0 0 30px rgba(230, 173, 122, 0.1)',
          mb: 4,
          animation: glitchActive ? 'glitch-text 0.2s infinite' : 'none',
        }}>
          <AlertTriangle size={48} color="#e6ad7a" />
        </Box>

        {/* HTTP Error Code Badge */}
        <Typography variant="overline" sx={{
          display: 'block',
          color: 'rgba(230, 173, 122, 0.6)',
          letterSpacing: 6,
          fontWeight: 'bold',
          mb: 1
        }}>
          ERROR_CODE: HTTP_408_REQUEST_TIMEOUT
        </Typography>

        {/* ALERTA DE SISTEMA: EFECTO GRIETA */}
        <Typography variant="h3" sx={{
          fontWeight: 900,
          letterSpacing: 2,
          textTransform: 'uppercase',
          mb: 3,
          color: '#ff8a00',
          textShadow: '0 0 15px rgba(255, 138, 0, 0.6)',
          animation: glitchActive ? 'glitch-text 0.1s infinite' : 'none',
        }}>
          ALERTA DE SISTEMA: EFECTO GRIETA
        </Typography>

        {/* Description box */}
        <Box sx={{
          bgcolor: 'rgba(28, 18, 12, 0.85)',
          border: '1px solid rgba(230, 173, 122, 0.2)',
          p: 4,
          borderRadius: 2,
          boxShadow: 'inset 0 0 20px rgba(0, 0, 0, 0.6)',
          mb: 4,
          textAlign: 'justify'
        }}>
          <Typography variant="body1" sx={{
            lineHeight: 1.8,
            fontSize: '1rem',
            color: 'rgba(230, 173, 122, 0.85)',
            letterSpacing: 0.5,
          }}>
            La distancia crítica con el enjambre de naves nómadas ha superado el umbral cuántico predecible. Al igual que en la huida de Arsia Mons, tu terminal ha entrado en modo de procesamiento aislado. Tus activos permanecen encriptados y seguros en los sistemas de soporte de vida. Restableciendo puente de datos con el confín del espacio...
          </Typography>
        </Box>

        {/* Actions & Auto-retry tracker */}
        <Typography variant="body2" sx={{ color: 'rgba(230, 173, 122, 0.5)', mb: 3, fontFamily: 'monospace' }}>
          Restableciendo enlace cuántico automáticamente en {countdown} segundos...
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            startIcon={<RefreshCw size={18} />}
            onClick={() => {
              setCountdown(15);
              router.refresh();
            }}
            sx={{
              bgcolor: '#ff8a00',
              color: '#000',
              fontWeight: 'bold',
              letterSpacing: 1.5,
              '&:hover': {
                bgcolor: '#e67e00',
                boxShadow: '0 0 25px rgba(255, 138, 0, 0.4)'
              },
              px: 4,
              py: 1.5,
            }}
          >
            REINTENTAR SINC
          </Button>

          <Button
            variant="outlined"
            onClick={() => router.push('/operaciones')}
            sx={{
              borderColor: 'rgba(230, 173, 122, 0.4)',
              color: '#e6ad7a',
              fontWeight: 'bold',
              letterSpacing: 1.5,
              '&:hover': {
                borderColor: '#e6ad7a',
                bgcolor: 'rgba(230, 173, 122, 0.05)'
              },
              px: 4,
              py: 1.5,
            }}
          >
            VOLVER AL PANEL
          </Button>
        </Box>
      </Container>
    </Box>
  );
}
