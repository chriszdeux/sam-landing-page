// 1-Estructuración y renderizado visual del componente UI

'use client';

import React from 'react';
import { Background } from '../../components/layout/Background';
import { motion } from 'framer-motion';
import { EnvVariables } from '@/lib/constants/variables';
import { Typography } from '../../components/ui/Typography';

export default function ConquestPage() {
    const { project } = EnvVariables;


  //# 1-Estructuración y renderizado visual del componente UI
  return (
    <div className="relative min-h-screen">
        <Background />

        <div className="relative z-[1] mx-auto w-full max-w-[1200px] px-4 pb-20 pt-40 text-white sm:px-6 lg:px-8">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1 }}>
                <Typography variant="h2" component="h2" className="mb-16 text-center uppercase text-[#ffb700] tracking-[2px] text-[2rem] md:tracking-[8px] md:text-[3.75rem]">
                    CONQUISTA DE SISTEMAS
                </Typography>

                <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2">
                    <div>
                        <Typography variant="h4" className="mb-2 text-secondary">Marte: La Primera Frontera (2042)</Typography>
                        <Typography variant="body1" className="mb-4 leading-[1.8]">
                            Todo cambió en Arsia Mons. Los colonos, hartos de los impuestos terrestres, adoptaron {project} como moneda nativa, probando por primera vez la soberanía financiera interplanetaria.
                        </Typography>
                        <Typography variant="h4" className="mb-2 mt-8 text-secondary">El Tratado de Sirio (2088)</Typography>
                        <Typography variant="body1" className="mb-4 leading-[1.8]">
                            Por primera vez en la historia, una IA ({project}) negoció la paz. Evitó una guerra civil galáctica entre corporaciones mineras y colonias soberanas mediante contratos inteligentes inmutables.
                        </Typography>
                    </div>
                    <div>
                        <div className="flex h-[300px] w-full items-center justify-center rounded-2xl border border-yellow-500/30 bg-white/5">
                            <Typography variant="h1" component="span">🪐</Typography>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    </div>
  );
}
