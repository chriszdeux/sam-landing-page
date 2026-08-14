'use client';

import React from 'react';
import { Box, Container, Typography, Grid, Button, Stack } from '@mui/material';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Compass, Cpu, Wallet, Users, Orbit, ArrowLeft } from 'lucide-react';
import { Background } from '../../components/layout/Background';
import { PageHeader } from '../../components/ui/PageHeader';
import { TechFrame } from '../../components/ui/TechFrame';

export default function QueEsLyncorePage() {
  const router = useRouter();

  const features = [
    {
      title: 'Simulación Blockchain',
      icon: Orbit,
      color: '#00f3ff',
      description: 'Lyncore es un juego web interactivo donde se simula el uso completo de una red blockchain en un ambiente yermo y galáctico, donde el consenso y el hash guían las operaciones.'
    },
    {
      title: 'Exploración y Recursos',
      icon: Compass,
      color: '#00e676',
      description: 'Los usuarios pueden explorar planetas hostiles y recolectar valiosos recursos espaciales para construir sus naves generacionales, expandir sus bases de operaciones y sobrevivir.'
    },
    {
      title: 'Estructuras y Energía',
      icon: Cpu,
      color: '#ffab00',
      description: 'Crea infraestructuras que afecten a otros colonos. Si necesitas energía y otro usuario posee una planta eléctrica, pueden sellar un contrato inteligente inmutable para el suministro.'
    },
    {
      title: 'Wallet Personal y Activos',
      icon: Wallet,
      color: '#ff0055',
      description: 'Gestiona tus criptoactivos simulados, audita tus transacciones firmadas en el ledger y realiza transferencias seguras con otros supervivientes de la red.'
    },
    {
      title: 'Cooperación Galáctica',
      icon: Users,
      color: '#b000ff',
      description: 'En el yermo de Lyncore, la diplomacia y la cooperación mutua son fundamentales si el objetivo de tu clan es erigir una civilización avanzada bajo el ledger de Sirio.'
    }
  ];

  return (
    <Box sx={{ minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
      <Background />

      <Container maxWidth="lg" sx={{ pt: 16, pb: 10, position: 'relative', zIndex: 1 }}>
        <Button
          startIcon={<ArrowLeft />}
          onClick={() => router.push('/')}
          sx={{
            color: 'text.secondary',
            mb: 4,
            '&:hover': { color: '#00f3ff', bgcolor: 'rgba(0, 243, 255, 0.05)' }
          }}
        >
          Volver al Inicio
        </Button>

        <PageHeader
          title="¿Qué es"
          highlight="Lyncore?"
          subtitle="Conoce el protocolo de simulación y supervivencia galáctica inmutable."
          color="#00f3ff"
        />

        <Grid container spacing={4} sx={{ mt: 2 }}>
          {features.map((feat, index) => {
            const Icon = feat.icon;
            return (
              <Grid size={{ xs: 12, md: feat.title === 'Cooperación Galáctica' ? 12 : 6 }} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 25 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  style={{ height: '100%' }}
                >
                  <TechFrame
                    color={feat.color}
                    sx={{ height: '100%', cursor: 'default' }}
                  >
                    <Box sx={{ p: 4, height: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Box sx={{
                          p: 1.5,
                          borderRadius: '12px',
                          bgcolor: `${feat.color}15`,
                          border: `1px solid ${feat.color}40`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: `0 0 15px ${feat.color}20`
                        }}>
                          <Icon size={28} color={feat.color} />
                        </Box>
                        <Typography variant="h5" sx={{ color: 'white', fontWeight: 'bold', letterSpacing: 1 }}>
                          {feat.title}
                        </Typography>
                      </Stack>
                      <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.8 }}>
                        {feat.description}
                      </Typography>
                    </Box>
                  </TechFrame>
                </motion.div>
              </Grid>
            );
          })}
        </Grid>

        <Box sx={{ mt: 8, textAlign: 'center' }}>
          <Button
            variant="contained"
            onClick={() => router.push('/')}
            sx={{
              bgcolor: '#00f3ff',
              color: '#000',
              fontWeight: 'bold',
              px: 6,
              py: 1.8,
              fontSize: '1rem',
              letterSpacing: 1.5,
              boxShadow: '0 0 30px rgba(0,243,255,0.3)',
              '&:hover': {
                bgcolor: '#00dbe6',
                boxShadow: '0 0 50px rgba(0,243,255,0.5)',
                transform: 'translateY(-2px)'
              },
              transition: 'all 0.25s ease'
            }}
          >
            Comenzar Misión
          </Button>
        </Box>
      </Container>
    </Box>
  );
}
