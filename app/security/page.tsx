// 1-Estructuración y renderizado visual del componente UI

'use client';

import React from 'react';
import { Typography } from '../../components/ui/Typography';
import { Background } from '../../components/layout/Background';
import { Shield, Lock, KeyRound, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '../../components/ui/Button';
import { PageHeader } from '../../components/ui/PageHeader';
import { motion } from 'framer-motion';
import { EnvVariables } from '@/lib/constants/variables';

export default function SecurityPage() {
    const { project } = EnvVariables;
    const router = useRouter();


  //# 1-Estructuración y renderizado visual del componente UI
  return (
    <div className="relative min-h-screen">
      <div className="fixed top-25 left-5 md:left-10 z-[100]">
        <Button
            variant="outlined"
            startIcon={<ArrowLeft size={18} />}
            onClick={() => router.back()}
            sx={{ backdropFilter: 'blur(5px)' }}
        >
            Atrás
        </Button>
      </div>
      <Background />

      <div className="relative z-[1] mx-auto w-full max-w-[1200px] px-4 pt-40 pb-20 text-white sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <PageHeader
                title="SEGURIDAD DE PROTOCOLO"
                subtitle="Infraestructura descentralizada protegida por leyes físicas y criptográficas."
                color="#00f3ff"
            />

            <div className="mb-16 text-center">
                 <Shield size={100} className="text-primary [filter:drop-shadow(0_0_20px_#00f3ff)]" />
            </div>

            <Typography variant="h5" component="p" className="mb-12 text-center leading-[1.8]">
                En 2036, desde servidores sumergidos en túneles geotérmicos de Guadalajara, nació {project}. Nos protegemos con algo más fuerte que la criptografía: la soberanía energética y la distribución interestelar.
            </Typography>

            <ul className="rounded border border-[#00f3ff]/20 bg-black/50 p-8">
                <li className="mb-4 flex items-center gap-4">
                    <Lock size={40} className="shrink-0 text-primary" />
                    <div>
                        <Typography variant="h5" className="text-white">Prueba de Propósito</Typography>
                        <Typography variant="body1" className="text-foreground-muted">El sistema no crece solo por minería, sino por utilidad real. La Capa de Sedimento en la Tierra es el ancla ética inmutable.</Typography>
                    </div>
                </li>
                <li className="mb-4 flex items-center gap-4">
                    <KeyRound size={40} className="shrink-0 text-primary" />
                    <div>
                        <Typography variant="h5" className="text-white">Red ${project}</Typography>
                        <Typography variant="body1" className="text-foreground-muted">Uso de entrelazamiento cuántico para sincronizar billeteras entre sistemas solares instantáneamente, eliminando la latencia luz.</Typography>
                    </div>
                </li>
                <li className="mb-4 flex items-center gap-4">
                    <Shield size={40} className="shrink-0 text-primary" />
                    <div>
                        <Typography variant="h5" className="text-white">Soberanía Energética</Typography>
                        <Typography variant="body1" className="text-foreground-muted">Gracias a Helios-Prime y las Forjas Solares, {project} genera su propio combustible de cómputo. Nadie puede apagarla.</Typography>
                    </div>
                </li>
            </ul>
        </motion.div>
      </div>
    </div>
  );
}
