'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Compass } from 'lucide-react';
import { Section } from '../ui/Section';
import { Typography } from '../ui/Typography';
import { Button } from '../ui/Button';
import { cn } from '@/lib/utils/cn';
import { EnvVariables } from '@/lib/constants/variables';

const TechFrame = ({ children, color = '#00f3ff' }: { children: React.ReactNode; color?: string }) => (
  <div
    className="relative p-1"
    style={{
      background: `linear-gradient(45deg, transparent 5%, ${color} 5%, ${color} 10%, transparent 10%, transparent 90%, ${color} 90%, ${color} 95%, transparent 95%)`,
    }}
  >
    <div
      className="pointer-events-none absolute inset-0"
      style={{
        border: `1px solid ${color}40`,
        clipPath: 'polygon(0 0, 100% 0, 100% 90%, 90% 100%, 0 100%)',
      }}
    />
    <div className="relative bg-black/50" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 90%, 90% 100%, 0 100%)' }}>
      {children}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 z-[2] h-full"
        style={{
          background: `linear-gradient(to bottom, transparent 50%, ${color}10 50%)`,
          backgroundSize: '100% 4px',
        }}
      />
    </div>
  </div>
);

const DataLog = ({
  title,
  date,
  children,
  align = 'left',
}: {
  title: string;
  date?: string;
  children: React.ReactNode;
  align?: 'left' | 'right';
}) => (
  <div
    className={cn(
      'relative p-8 backdrop-blur-[5px] bg-gradient-to-r from-[#00f3ff]/[0.05] to-transparent',
      align === 'left' ? 'text-left border-l-2 border-[#00f3ff]' : 'text-right border-r-2 border-[#ffb700]',
    )}
  >
    <Typography variant="overline" className="mb-1 block font-mono tracking-[2px] text-foreground-muted">
      {'// LOG DATA: '}
      {date || 'UNKNOWN'}
    </Typography>
    <Typography
      variant="h3"
      className="mb-6 text-[1.8rem] md:text-[2.5rem] font-bold uppercase text-white [text-shadow:0_0_10px_rgba(0,243,255,0.5)]"
    >
      {title}
    </Typography>
    <Typography component="div" variant="body1" className="font-mono text-[1.1rem] leading-[1.8] text-[gray]">
      {children}
    </Typography>
  </div>
);

export const UniverseSection = () => {
  const { project } = EnvVariables;
  const router = useRouter();

  return (
    <Section id="universo">
      <div className="relative z-[1]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="mb-32 text-center">
            <Typography variant="overline" className="mb-4 block text-[1.2rem] tracking-[8px] text-[#ffb700]">
              CONOCIMIENTO GALÁCTICO
            </Typography>
            <Typography
              variant="h2"
              className="font-black uppercase tracking-[-1px] text-white [text-shadow:0_0_20px_rgba(0,243,255,0.8)]"
            >
              UNIVERSO EN <span style={{ color: '#00f3ff' }}>EXPANSIÓN</span>
            </Typography>
            <hr className="my-8 mx-auto max-w-[200px] border-t border-[#00f3ff] opacity-30" />

            <Button
              variant="contained"
              size="large"
              startIcon={<Compass />}
              onClick={() => router.push('/exploracion-infinita')}
              sx={{
                mt: 4,
                px: 6,
                py: 2,
                fontSize: '1.2rem',
                background: 'linear-gradient(45deg, #00f3ff, #0066ff)',
                boxShadow: '0 0 30px rgba(0, 243, 255, 0.4)',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 0 50px rgba(0, 243, 255, 0.6)',
                },
              }}
            >
              Abrir Mapa Estelar
            </Button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 items-center gap-16 md:grid-cols-12">
          <div className="md:col-span-6">
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <DataLog title="Más allá de la Heliosfera" date="2065.04.12">
                Lo que comenzó en Marte no pudo ser contenido. En 2065, la humanidad lanzó la primera sonda tripulada
                hacia Próxima Centauri. El reto no era solo la supervivencia física, sino la viabilidad económica a 4
                años luz de distancia. El{' '}
                <strong style={{ color: '#00f3ff' }}>Protocolo {project}</strong> respondió replicando su
                arquitectura, creando una red donde el valor viaja más rápido que la materia.
              </DataLog>
            </motion.div>
          </div>
          <div className="md:col-span-6">
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <TechFrame color="#00f3ff">
                <Image
                  src="/assets/images/universe_expansion/beyond.jpg"
                  alt="Beyond the Heliosphere"
                  width={1200}
                  height={800}
                  style={{ width: '100%', height: 'auto', display: 'block' }}
                />
              </TechFrame>
            </motion.div>
          </div>

          <div className="order-2 md:order-1 md:col-span-6">
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <TechFrame color="#ffb700">
                <Image
                  src="/assets/images/universe_expansion/energy_supply.jpg"
                  alt="Helios-Prime Solar Forge"
                  width={1200}
                  height={800}
                  style={{ width: '100%', height: 'auto', display: 'block' }}
                />
              </TechFrame>
            </motion.div>
          </div>
          <div className="order-1 md:order-2 md:col-span-6">
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <DataLog title="Los Grandes Aceleradores de Sistemas" date="2072.11.08" align="right">
                Para sostener la economía galáctica, {project} desplegó estructuras masivas:
                <ul style={{ listStyleType: 'none', padding: 0, marginTop: '20px' }}>
                  <li style={{ marginBottom: '15px' }}>
                    <span style={{ color: '#ffb700', fontWeight: 'bold' }}>[NODOS]</span> Forja Solar: Captadores de
                    energía pura.
                  </li>
                  <li style={{ marginBottom: '15px' }}>
                    <span style={{ color: '#ffb700', fontWeight: 'bold' }}>[PUENTES]</span> Aceleradores {project}:
                    Entrelazamiento cuántico.
                  </li>
                  <li>
                    <span style={{ color: '#ffb700', fontWeight: 'bold' }}>[SYNC]</span> Valor instantáneo.
                  </li>
                </ul>
              </DataLog>
            </motion.div>
          </div>

          <div className="md:col-span-6">
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <DataLog title="La Soberanía Estelar" date="2088.01.01">
                La expansión no es solo territorial, es <strong style={{ color: '#00f3ff' }}>existencial</strong>. Con
                la Capa de Tránsito conectando sistemas y las Forjas alimentando la independencia energética de cada
                colonia, {project} ha asegurado que la humanidad no dependa de un solo punto de fallo.
                <br />
                <br />
                <span style={{ color: 'white', backgroundColor: '#00f3ff33', padding: '4px 8px', borderRadius: '4px' }}>
                  ESTADO: INDEPENDIENTE
                </span>
              </DataLog>
            </motion.div>
          </div>
          <div className="md:col-span-6">
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <TechFrame color="#ff0055">
                <Image
                  src="/assets/images/universe_expansion/acelerator.jpg"
                  alt="Interstellar Particle Accelerator"
                  width={1200}
                  height={800}
                  style={{ width: '100%', height: 'auto', display: 'block' }}
                />
              </TechFrame>
            </motion.div>
          </div>
        </div>
      </div>
    </Section>
  );
};
