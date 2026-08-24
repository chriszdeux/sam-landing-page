// 1-Obtención del despachador para emitir acciones al store
// 2-Obtención del despachador para emitir acciones al store
// 3-Estructuración y renderizado visual del componente UI

import React, { useRef } from 'react';
import Link from 'next/link';
import { Rocket, Globe, Shield, Activity, Zap } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Button } from '../ui/Button';
import { TechFrame } from '../ui/TechFrame';
import { Section } from '../ui/Section';
import { Typography } from '../ui/Typography';
import { openModal } from '../../lib/features/uiSlice';

//# 1-Obtención del despachador para emitir acciones al store
import { useAppDispatch } from '../../lib/hooks';
import { EnvVariables } from '@/lib/constants/variables';
import { TaoIcon } from '../ui/TaoIcon';

gsap.registerPlugin(ScrollTrigger);

export const HeroSection = () => {
  
  //# 2-Obtención del despachador para emitir acciones al store
  const dispatch = useAppDispatch();
  const container = useRef<HTMLDivElement | null>(null);
  const { project } = EnvVariables;

  useGSAP(() => {
    gsap.from('.hero-content', {
      scrollTrigger: {
        trigger: '.hero-content',
        start: 'top 80%',
      },
      x: -50,
      opacity: 0,
      duration: 1.5,
      ease: 'power4.out'
    });

    gsap.from('.hero-grid-item', {
      scrollTrigger: {
        trigger: '.hero-grid-container',
        start: 'top 85%',
      },
      y: 30,
      opacity: 0,
      duration: 1,
      stagger: 0.2,
      ease: 'expo.out'
    });
  }, { scope: container });

  
  
  //# 3-Estructuración y renderizado visual del componente UI
  return (
    <Section id="home" className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background with radial gradient instead of video */}

      <div ref={container} className="relative z-[3] w-full">
        <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-12">
          <div className="md:col-span-7">
            <div className="hero-content">
              <div className="mb-4 flex flex-row items-center gap-2">
                <div className="h-0.5 w-10 bg-[#00f3ff] shadow-[0_0_10px_#00f3ff]" />
                <Typography variant="overline" className="flex items-center gap-2 text-[#00f3ff] font-bold tracking-[4px]">
                   <Activity size={14} /> ESTADO: TRANSMISIÓN_ACTIVA
                </Typography>
              </div>

              <Typography
                variant="h1"
                className="mb-1 text-[3rem] md:text-[5.5rem] font-black leading-none uppercase bg-gradient-to-r from-white via-[#00f3ff] to-white bg-[length:200%_auto] bg-clip-text text-transparent [-webkit-text-fill-color:transparent] [filter:drop-shadow(0_0_15px_rgba(0,243,255,0.3))] animate-[shine_4s_linear_infinite]"
              >
                {project}
              </Typography>

              <Typography variant="h4" className="mb-8 text-white/90 font-bold tracking-[-0.5px] [text-shadow:0_2px_10px_rgba(0,0,0,0.5)]">
                La soberanía ya no es planetaria; <span className="text-[#00f3ff] [text-shadow:0_0_10px_#00f3ff]">es galáctica.</span>
              </Typography>

              <Typography variant="body1" className="mb-12 max-w-[600px] text-white/70 text-[1.15rem] leading-[1.8] border-l-2 border-[#00f3ff]/30 pl-6">
                Vive la evolución de {project}: desde el subsuelo de Guadalajara hasta la colonización de Alfa Centauri.
                Una economía viva donde el valor (<TaoIcon size={20} />) y la energía
                 fluyen a través de una red interestelar soberana.
              </Typography>

              <div className="flex flex-col gap-6 sm:flex-row">
                <Button
                  variant="contained"
                  color="secondary"
                  size="large"
                  glow
                  onClick={() => dispatch(openModal('register'))}
                  startIcon={<Rocket />}
                  sx={{ 
                    px: 6, 
                    py: 2, 
                    fontSize: '1.1rem', 
                    fontWeight: 'bold',
                    bgcolor: '#00f3ff',
                    color: '#000',
                    '&:hover': { bgcolor: '#00d0db' }
                  }}
                >
                  Comenzar Misión
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => document.getElementById('mechanics')?.scrollIntoView({ behavior: 'smooth' })}
                  sx={{ 
                    px: 6, 
                    py: 2, 
                    fontSize: '1.1rem', 
                    color: '#fff', 
                    borderColor: 'rgba(255,255,255,0.3)',
                    '&:hover': { borderColor: '#00f3ff', color: '#00f3ff', bgcolor: 'rgba(0, 243, 255, 0.05)' }
                  }}
                >
                  Explorar Mecánicas
                </Button>
              </div>
            </div>
          </div>

          <div className="md:col-span-5">
            <div className="hero-grid-container ml-auto grid max-w-[400px] grid-cols-1 gap-6">
              {[
                { icon: Globe, label: 'Expansión Interestelar', color: '#00f3ff', href: '/exploracion-infinita', desc: 'Explora sistemas solares únicos y reclama tu territorio.' },
                { icon: Shield, label: `Protocolo ${project}`, color: '#ffb700', href: '/security', desc: 'Seguridad de grado militar en cada transacción galáctica.' },
              ].map((item, index) => (
                <div
                  key={index}
                  className="hero-grid-item"
                >
                  <Link href={item.href} className="no-underline">
                    <TechFrame color={item.color} className="h-full">
                      <div className="flex h-full items-center gap-6 p-6">
                        <div
                          className="flex items-center justify-center rounded-xl p-3"
                          style={{
                            backgroundColor: `${item.color}15`,
                            border: `1px solid ${item.color}30`,
                            boxShadow: `0 0 15px ${item.color}20`,
                          }}
                        >
                          <item.icon size={32} color={item.color} />
                        </div>
                        <div>
                          <Typography
                            variant="h6"
                            className="mb-1 uppercase tracking-[1px] text-[0.9rem] font-bold text-white"
                          >
                            {item.label}
                          </Typography>
                          <Typography variant="caption" className="block text-[0.75rem] leading-[1.4] text-white/50">
                            {item.desc}
                          </Typography>
                        </div>
                        <Zap size={16} color={item.color} style={{ marginLeft: 'auto', opacity: 0.5 }} />
                      </div>
                    </TechFrame>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
};
