// 1-Estructuración y renderizado visual del componente UI

import React, { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Typography } from '../ui/Typography';
import { Button } from '../ui/Button';
import { Section } from '../ui/Section';
import { TechFrame } from '../ui/TechFrame';
import { SectionTitle } from '../ui/SectionTitle';
import { ArrowRight } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { architectureData } from '../../lib/data/architecture';

gsap.registerPlugin(ScrollTrigger);

export const ArchitectureSection = () => {
  const container = useRef<HTMLDivElement | null>(null);
  const previewBuildings = architectureData.slice(0, 4);

  useGSAP(() => {
    gsap.from('.arch-title', {
      scrollTrigger: {
        trigger: '.arch-title',
        start: 'top 85%',
      },
      y: -30,
      opacity: 0,
      duration: 1,
      ease: 'power3.out'
    });

    gsap.from('.arch-card', {
      scrollTrigger: {
        trigger: '.arch-grid',
        start: 'top 80%',
      },
      y: 50,
      opacity: 0,
      duration: 0.8,
      stagger: 0.15,
      ease: 'power2.out'
    });

    gsap.from('.arch-btn', {
      scrollTrigger: {
        trigger: '.arch-btn',
        start: 'top 95%',
      },
      y: 20,
      opacity: 0,
      duration: 0.8,
      delay: 0.5,
      ease: 'power2.out'
    });

  }, { scope: container });

  
  
  //# 1-Estructuración y renderizado visual del componente UI
  return (
    <Section id="architecture">
      <div ref={container}>
        <div className="arch-title">
            <SectionTitle subtitle="// STRUCTURES" align="center">
                Arquitectura
            </SectionTitle>
        </div>

        <div className="arch-grid grid grid-cols-1 items-stretch justify-center gap-8 sm:grid-cols-12">
            {previewBuildings.map((building, index) => (
            <div key={index} className="arch-card flex sm:col-span-6 md:col-span-3">
                <TechFrame color={building.color} className="h-full w-full">
                    <div className="relative flex h-full w-full flex-col items-center justify-between p-8 text-center">
                        <div className="glitch-effect relative mb-6 h-[180px] w-full overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
                            <Image
                                src={building.image}
                                alt={building.name}
                                fill
                                className="holo-image"
                                style={{
                                    objectFit: 'cover',
                                    opacity: 0.8,
                                    animationDelay: `${(index * 1.2) % 5}s`
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

                            <Typography variant="body2" className="z-[2] mb-4 leading-[1.6] text-foreground-muted">
                                {building.description}
                            </Typography>
                        </div>
                    </div>
                </TechFrame>
            </div>
            ))}
        </div>

        <div className="arch-btn mt-16 flex justify-center">
            <Link href="/architecture" className="no-underline">
                <Button
                    variant="outlined"
                    endIcon={<ArrowRight />}
                    sx={{
                        color: 'white',
                        borderColor: 'rgba(255,255,255,0.2)',
                        px: 4,
                        py: 1.5,
                        '&:hover': {
                            borderColor: 'primary.main',
                            bgcolor: 'rgba(0,255,255,0.05)'
                        }
                    }}
                >
                    Ver más estructuras
                </Button>
            </Link>
        </div>
      </div>
    </Section>
  );
};
