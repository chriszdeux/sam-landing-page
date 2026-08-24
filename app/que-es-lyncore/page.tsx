'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Compass, Cpu, Wallet, Users, Orbit, ArrowLeft } from 'lucide-react';
import { Background } from '../../components/layout/Background';
import { PageHeader } from '../../components/ui/PageHeader';
import { TechFrame } from '../../components/ui/TechFrame';
import { Typography } from '../../components/ui/Typography';
import { TechButton } from '../../components/ui/TechButton';

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
    <div className="relative min-h-screen overflow-hidden">
      <Background />

      <div className="relative z-[1] mx-auto w-full max-w-[1200px] px-4 pt-32 pb-20 sm:px-6 lg:px-8">
        <TechButton
          color="#b3b3b3"
          size="small"
          startIcon={<ArrowLeft size={16} />}
          onClick={() => router.push('/')}
          className="mb-8"
        >
          Volver al Inicio
        </TechButton>

        <PageHeader
          title="¿Qué es"
          highlight="Lyncore?"
          subtitle="Conoce el protocolo de simulación y supervivencia galáctica inmutable."
          color="#00f3ff"
        />

        <div className="mt-4 grid grid-cols-1 gap-8 md:grid-cols-12">
          {features.map((feat, index) => {
            const Icon = feat.icon;
            return (
              <div
                className={feat.title === 'Cooperación Galáctica' ? 'md:col-span-12' : 'md:col-span-6'}
                key={index}
              >
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
                    <div className="flex h-full flex-col gap-4 p-8">
                      <div className="flex flex-row items-center gap-4">
                        <div
                          className="flex items-center justify-center rounded-xl p-3"
                          style={{
                            backgroundColor: `${feat.color}15`,
                            border: `1px solid ${feat.color}40`,
                            boxShadow: `0 0 15px ${feat.color}20`,
                          }}
                        >
                          <Icon size={28} color={feat.color} />
                        </div>
                        <Typography variant="h5" className="text-white font-bold tracking-[1px]">
                          {feat.title}
                        </Typography>
                      </div>
                      <Typography variant="body1" className="text-white/70 leading-[1.8]">
                        {feat.description}
                      </Typography>
                    </div>
                  </TechFrame>
                </motion.div>
              </div>
            );
          })}
        </div>

        <div className="mt-16 text-center">
          <TechButton color="#00f3ff" size="large" onClick={() => router.push('/')}>
            Comenzar Misión
          </TechButton>
        </div>
      </div>
    </div>
  );
}
