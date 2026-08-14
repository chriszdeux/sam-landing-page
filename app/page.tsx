// 1-Nuevo layout modular del Home: 4 bloques diferenciados

'use client';

import React from 'react';
import { Box, Container, Typography, Stack } from '@mui/material';
import { Rocket, BarChart2, ShoppingCart, Blocks } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Background } from '../components/layout/Background';
import { Footer } from '../components/layout/Footer';
import { Modal } from '../components/ui/Modal';
import { Button } from '../components/ui/Button';
import { openModal } from '../lib/features/uiSlice';
import { useAppDispatch, useAppSelector } from '../lib/hooks';
import { RootState } from '../lib/store';
import { HomeSection } from '../components/sections/HomeSection';
import {
  LyncoreFeaturesGrid,
  OperationsFeaturesGrid,
  MarketFeaturesGrid,
  LedgerFeaturesGrid
} from '../components/sections/HomeSectionGrids';

//# Página principal
export default function Home() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { userInfo } = useAppSelector((state: RootState) => state.auth);

  return (
    <main style={{ minHeight: '100vh', position: 'relative', background: 'transparent' }}>
      <Background />

      {/* ——— HERO ——— */}
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Glowing orbs */}
        <Box sx={{ position: 'absolute', top: '20%', left: '10%', width: 400, height: 400, borderRadius: '50%', bgcolor: '#00f3ff', filter: 'blur(120px)', opacity: 0.04 }} />
        <Box sx={{ position: 'absolute', bottom: '20%', right: '10%', width: 300, height: 300, borderRadius: '50%', bgcolor: '#ff0055', filter: 'blur(100px)', opacity: 0.04 }} />

        <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 2, pt: 12, pb: 8 }}>
          <Box>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2.5 }}>
              <Box sx={{ width: 32, height: 2, bgcolor: '#00f3ff', boxShadow: '0 0 10px #00f3ff' }} />
              <Typography variant="overline" sx={{ color: '#00f3ff', fontWeight: 'bold', letterSpacing: 4, fontSize: '0.65rem' }}>
                ESTADO: TRANSMISIÓN_ACTIVA
              </Typography>
            </Stack>

            <Typography variant="h1" sx={{
              fontSize: { xs: '3.5rem', md: '6.5rem', lg: '8rem' },
              fontWeight: 900,
              lineHeight: 0.95,
              textTransform: 'uppercase',
              mb: 3,
              background: 'linear-gradient(135deg, #fff 0%, #00f3ff 40%, #fff 80%)',
              backgroundSize: '200% auto',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              animation: 'textShine 5s linear infinite',
              '@keyframes textShine': { to: { backgroundPosition: '200% center' } },
              filter: 'drop-shadow(0 0 20px rgba(0,243,255,0.2))',
            }}>
              The Lyncore
            </Typography>

            <Typography variant="h4" sx={{
              color: 'rgba(255,255,255,0.8)',
              fontWeight: 300,
              mb: 5,
              maxWidth: 640,
              lineHeight: 1.5,
              fontSize: { xs: '1.2rem', md: '1.6rem' },
            }}>
              Ledger de supervivencia y simulación blockchain en un yermo digital devastado. El{' '}
              <Box component="span" sx={{ color: '#00f3ff', fontWeight: 700 }}>HASH</Box>{' '}
              es tu único recurso vital.
            </Typography>

            {userInfo ? (
              <Button
                id="hero-dashboard-btn"
                variant="contained"
                size="large"
                glow
                onClick={() => router.push('/operaciones')}
                startIcon={<Rocket size={20} />}
                sx={{
                  bgcolor: '#00f3ff', color: '#000', fontWeight: 'bold',
                  px: 6, py: 1.8, fontSize: '1rem', letterSpacing: 1.5,
                  boxShadow: '0 0 30px rgba(0,243,255,0.35)',
                  '&:hover': { boxShadow: '0 0 50px rgba(0,243,255,0.55)', transform: 'translateY(-2px)' },
                  transition: 'all 0.25s ease',
                }}
              >
                Ir a Operaciones
              </Button>
            ) : (
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2.5}>
                <Button
                  id="hero-register-btn"
                  variant="contained"
                  size="large"
                  glow
                  onClick={() => dispatch(openModal('register'))}
                  startIcon={<Rocket size={20} />}
                  sx={{
                    bgcolor: '#00f3ff', color: '#000', fontWeight: 'bold',
                    px: 6, py: 1.8, fontSize: '1rem', letterSpacing: 1.5,
                    boxShadow: '0 0 30px rgba(0,243,255,0.35)',
                    '&:hover': { boxShadow: '0 0 50px rgba(0,243,255,0.55)', transform: 'translateY(-2px)' },
                    transition: 'all 0.25s ease',
                  }}
                >
                  Comenzar
                </Button>
                <Button
                  id="hero-login-btn"
                  variant="outlined"
                  size="large"
                  onClick={() => dispatch(openModal('login'))}
                  sx={{
                    px: 6, py: 1.8, fontSize: '1rem', color: '#fff',
                    borderColor: 'rgba(255,255,255,0.2)',
                    '&:hover': { borderColor: '#00f3ff', color: '#00f3ff', bgcolor: 'rgba(0,243,255,0.04)' },
                    transition: 'all 0.25s ease',
                  }}
                >
                  Ya tengo cuenta
                </Button>
              </Stack>
            )}
          </Box>
        </Container>
      </Box>

      {/* ——— BLOQUE 1: The Lyncore (Concepto) ——— */}
      <HomeSection
        id="concepto"
        accentColor="#00f3ff"
        tag="01 · EL NÚCLEO"
        Icon={Rocket}
        title="Qué es"
        titleHighlight="The Lyncore"
        description="El último bastión del orden financiero tras el colapso fiat mundial. Un protocolo inmutable resurgido de los búnkeres geotérmicos de Guadalajara. Aquí, las transacciones se agrupan en bloques elásticos que se sellan en tiempo de crisis para preservar el ledger de sedimento. Expándelo un 25% por ciclo y asegura la soberanía de tu clan en este yermo digital."
        futureLine="Próximamente: colonización de mapas interestelares, creación de estructuras de hardware y optimización de simuladores respaldados por el motor de la plataforma."
        actionLabel="Saber más"
        actionHref="/que-es-lyncore"
        fullWidth={true}
      >
        <LyncoreFeaturesGrid />
      </HomeSection>

      {/* ——— BLOQUE 2: Operaciones ——— */}
      <HomeSection
        id="operaciones"
        accentColor="#00e676"
        tag="02 · INFRAESTRUCTURA"
        Icon={BarChart2}
        title="Centro de"
        titleHighlight="Operaciones"
        description="El Centro de Operaciones es una estación espacial pequeña que está en medio de la galaxia. Cada usuario comienza con una. Está diseñado para ser tu base de operaciones personal, un centro neurálgico donde podrás gestionar todos los aspectos de tu presencia en el universo de Lyncore. Desde aquí, podrás:"
        actionLabel="Centro de Operaciones"
        actionHref="/operaciones"
        fullWidth={true}
      >
        <OperationsFeaturesGrid />
      </HomeSection>

      {/* ——— BLOQUE 3: Mercado ——— */}
      <HomeSection
        id="mercado"
        accentColor="#ffab00"
        tag="03 · CRYPTO ASSETS"
        Icon={ShoppingCart}
        title="Mercado de"
        titleHighlight="Activos"
        description="La red de intercambio galáctico y mercado negro de activos. Adquiere recursos vitales y tokens energéticos con tus créditos de supervivencia, liquídalos bajo la ley de la oferta extrema o transfiérelos entre refugios seguros. Cada operación de comercio consume HASH de red, reflejando las crudas leyes del ledger."
        actionLabel="Mercado de Activos"
        actionHref="/market"
        fullWidth={true}
      >
        <MarketFeaturesGrid />
      </HomeSection>

      {/* ——— BLOQUE 4: Bloques y Transacciones ——— */}
      <HomeSection
        id="ledger"
        accentColor="#ff0055"
        tag="04 · CONSENSO DE RED"
        Icon={Blocks}
        title="Ledger de"
        titleHighlight="Bloques"
        description="El ledger de bloques sellados al vacío. Las operaciones del éxodo espacial se agrupan en bloques elásticos que se consolidan automáticamente bajo condiciones de radiación extrema. Cada nuevo bloque expande su capacidad un 25%, adaptándose a la demanda del yermo. Audita el registro histórico de supervivencia para evitar el hackeo del Dios Máquina."
        actionLabel="Ver Ledger de Bloques"
        actionHref="/operaciones/blocks"
        fullWidth={true}
      >
        <LedgerFeaturesGrid />
      </HomeSection>

      <Footer />
      <Modal />
    </main>
  );
}
