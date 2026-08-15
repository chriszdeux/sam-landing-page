// 1-Nuevo layout modular del Home: 4 bloques diferenciados

'use client';

import React from 'react';
import { Typography } from '../components/ui/Typography';
import { Rocket, BarChart2, ShoppingCart, Blocks } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Background } from '../components/layout/Background';
import { Footer } from '../components/layout/Footer';
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
    <main className="relative min-h-screen bg-transparent">
      <Background />

      {/* ——— HERO ——— */}
      <div className="relative flex min-h-screen items-center overflow-hidden">
        {/* Glowing orbs */}
        <div className="absolute top-[20%] left-[10%] h-[400px] w-[400px] rounded-full bg-[#00f3ff]/[0.04] blur-[120px]" />
        <div className="absolute bottom-[20%] right-[10%] h-[300px] w-[300px] rounded-full bg-[#ff0055]/[0.04] blur-[100px]" />

        <div className="relative z-[2] mx-auto w-full max-w-[1536px] px-4 pt-24 pb-16 sm:px-6 lg:px-8">
          <div>
            <div className="mb-5 flex flex-row items-center gap-2">
              <div className="h-0.5 w-8 bg-[#00f3ff] shadow-[0_0_10px_#00f3ff]" />
              <Typography variant="overline" className="text-[0.65rem] font-bold tracking-[4px] text-[#00f3ff]">
                ESTADO: TRANSMISIÓN_ACTIVA
              </Typography>
            </div>

            <Typography
              variant="h1"
              className="mb-6 text-[3.5rem] md:text-[6.5rem] lg:text-[8rem] font-black leading-[0.95] uppercase bg-gradient-to-br from-white from-0% via-[#00f3ff] via-40% to-white to-80% bg-[length:200%_auto] bg-clip-text text-transparent [-webkit-text-fill-color:transparent] animate-[shine_5s_linear_infinite] [filter:drop-shadow(0_0_20px_rgba(0,243,255,0.2))]"
            >
              The Lyncore
            </Typography>

            <Typography variant="h4" className="mb-10 max-w-[640px] text-[1.2rem] md:text-[1.6rem] font-light leading-[1.5] text-white/80">
              Ledger de supervivencia y simulación blockchain en un yermo digital devastado. El{' '}
              <span className="font-bold text-[#00f3ff]">HASH</span>{' '}
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
              <div className="flex flex-col gap-5 sm:flex-row">
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
              </div>
            )}
          </div>
        </div>
      </div>

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
    </main>
  );
}
