// 1-Estructuración y renderizado visual del componente UI

'use client';

import React from 'react';
import { Typography } from '../../components/ui/Typography';
import Image from 'next/image';
import { Background } from '../../components/layout/Background';
import { TechFrame } from '../../components/ui/TechFrame';
import { PageHeader } from '../../components/ui/PageHeader';
import { architectureData } from '../../lib/data/architecture';
import { motion } from 'framer-motion';

export default function ArchitecturePage() {
  
  
  //# 1-Estructuración y renderizado visual del componente UI
  return (
    <div className="relative min-h-screen">
      <Background />

      <div className="relative z-[1] mx-auto w-full max-w-[1536px] px-4 pt-40 pb-20 sm:px-6 lg:px-8">
        <PageHeader
            title="Arquitectura Colonial"
            subtitle="Construye, gestiona y expande tu imperio con estructuras de última tecnología."
            color="#00f3ff"
        />

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-12">
          {architectureData.map((building, index) => (
            <div key={building.id} className="flex sm:col-span-6 md:col-span-3">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                style={{ height: '100%', width: '100%' }}
              >
                <TechFrame
                    color={building.color}
                    className="h-full w-full"
                    sx={{ height: '100%' }}
                >
                    <div className="relative flex h-full w-full flex-col items-center justify-between p-8 text-center">
                        <div className="relative mb-6 h-[200px] w-full overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
                            <Image
                                src={building.image}
                                alt={building.name}
                                fill
                                style={{
                                    objectFit: 'cover',
                                    opacity: 0.8
                                }}
                            />
                            <div className="absolute inset-0" style={{ background: `linear-gradient(to top, ${building.color}40, transparent)` }} />
                        </div>

                        <div className="flex grow flex-col items-center">
                            <Typography variant="h6" className="z-[2] mb-2 font-bold text-white">
                                {building.name}
                            </Typography>

                            <Typography
                                variant="caption"
                                className="z-[2] mb-4 rounded px-2 py-1 text-[0.65rem] uppercase"
                                style={{ color: building.color, border: `1px solid ${building.color}40` }}
                            >
                                NIVEL {building.level} | {building.type}
                            </Typography>

                            <Typography variant="body2" className="z-[2] mb-4 grow leading-[1.6] text-foreground-muted">
                                {building.description}
                            </Typography>
                        </div>
                    </div>
                </TechFrame>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
