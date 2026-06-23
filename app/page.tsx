// 1-Nuevo layout modular del Home: 4 bloques diferenciados con animaciones de scroll

'use client';

import React from 'react';
import { Box, Container, Typography, Stack, Chip } from '@mui/material';
import {
  Rocket, BarChart2, ShoppingCart, Blocks
} from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Background } from '../components/layout/Background';
import { Footer } from '../components/layout/Footer';
import { Modal } from '../components/ui/Modal';
import { Button } from '../components/ui/Button';
import { openModal } from '../lib/features/uiSlice';
import { useAppDispatch } from '../lib/hooks';

// ——— Secciones anteriores desactivadas temporalmente (sprint UI reingeniería) ———
// import { HeroSection } from '../components/sections/HeroSection';
// import { HistorySection } from '../components/sections/HistorySection';
// import { MechanicsSection } from '../components/sections/MechanicsSection';
// import { UniverseSection } from '../components/sections/UniverseSection';
// import { SectionNavigation } from '../components/ui/SectionNavigation';

//# Variantes de animación por sección
const sectionVariants = {
  hidden: { opacity: 0, y: 48 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.75, ease: 'easeOut' as const },
  },
};

//# Componente de sección individual
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
}

const HomeSection = ({
  id, accentColor, tag, Icon, title, titleHighlight, description, futureLine,
  actionLabel, actionHref, onAction, reverse = false, children
}: HomeSectionProps) => (
  <motion.section
    id={id}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: '-80px' }}
    variants={sectionVariants}
    style={{ position: 'relative', borderTop: `1px solid ${accentColor}12` }}
  >
    <Box sx={{
      minHeight: { xs: 'auto', md: '85vh' },
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
        flexDirection: { xs: 'column', md: reverse ? 'row-reverse' : 'row' },
        gap: { xs: 6, md: 10 },
        alignItems: 'center',
      }}>
        {/* Text content */}
        <Box sx={{ flex: 1, maxWidth: { md: 580 } }}>
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
      </Box>
    </Container>
    </Box>
  </motion.section>
);

//# Página principal
export default function Home() {
  const dispatch = useAppDispatch();

  return (
    <main style={{ minHeight: '100vh', position: 'relative', background: 'transparent' }}>
      <Background />

      {/* ——— HERO ——— */}
      <Box
        component={motion.div}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
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
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.2 }}>
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
              Simulador blockchain interactivo donde el{' '}
              <Box component="span" sx={{ color: '#00f3ff', fontWeight: 700 }}>HASH</Box>{' '}
              mueve la economía.
            </Typography>

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
          </motion.div>
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
        description="Un simulador blockchain interactivo donde compras y vendes activos criptográficos de forma gamificada. Las transacciones se agrupan en bloques elásticos que se sellan automáticamente al alcanzar su capacidad, expandiéndose un 25% por cada nuevo ciclo. Es un ledger real —no Web3—, diseñado para aprender las reglas de la economía descentralizada en un entorno controlado."
        futureLine="Próximamente: colonización de mapas interestelares, creación de estructuras de hardware y optimización de simuladores respaldados por el motor de la plataforma."
        actionLabel="Comenzar Misión"
        onAction={() => dispatch(openModal('register'))}
      />

      {/* ——— BLOQUE 2: Operaciones ——— */}
      <HomeSection
        id="operaciones"
        accentColor="#00e676"
        tag="02 · INFRAESTRUCTURA"
        Icon={BarChart2}
        title="Centro de"
        titleHighlight="Operaciones"
        description="El panel de control donde gestionas el HASH acumulado localmente por tu laboratorio para inyectarlo y confirmar transacciones en la red. Audita el balance de tu Wallet personal, monitorea la temperatura de tus componentes de minería y supervisa los ciclos de inyección en tiempo real."
        actionLabel="Ir a Operaciones"
        actionHref="/dashboard"
        reverse
      />

      {/* ——— BLOQUE 3: Mercado ——— */}
      <HomeSection
        id="mercado"
        accentColor="#ffab00"
        tag="03 · CRYPTO ASSETS"
        Icon={ShoppingCart}
        title="Mercado de"
        titleHighlight="Activos"
        description="Explora el catálogo de activos criptográficos simulados disponibles para el intercambio comercial: compra activos con tus créditos, véndelos para recuperar liquidez o transfiérelos entre wallets. Cada operación consume hash de la red para su confirmación, reflejando las mecánicas reales de una blockchain."
        actionLabel="Explorar Mercado"
        actionHref="/market"
      />

      {/* ——— BLOQUE 4: Bloques y Transacciones ——— */}
      <HomeSection
        id="ledger"
        accentColor="#ff0055"
        tag="04 · CONSENSO DE RED"
        Icon={Blocks}
        title="Ledger de"
        titleHighlight="Bloques"
        description="Las transacciones se emiten en tiempo real y se agrupan en bloques elásticos que se sellan automáticamente (minedAt) al saturarse. Cada nuevo bloque hereda un 25% más de capacidad que el anterior, visualizando en directo cómo la red escala su ancho de banda. El Explorador de Bloques te permite auditar el historial completo del ledger."
        actionLabel="Ver Ledger de Bloques"
        actionHref="/dashboard/blocks"
        reverse
      />

      <Footer />
      <Modal />
    </main>
  );
}
