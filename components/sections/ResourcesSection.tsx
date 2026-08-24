// 1-Estructuración y renderizado visual del componente UI

import React, { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { Section } from '../ui/Section';
import { TechFrame } from '../ui/TechFrame';
import { SectionTitle } from '../ui/SectionTitle';
import { Typography } from '../ui/Typography';
import { Button } from '../ui/Button';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { resourcesData } from '../../lib/data/resources';

gsap.registerPlugin(ScrollTrigger);

export const ResourcesSection = () => {
  const container = useRef<HTMLDivElement | null>(null);
  const previewResources = resourcesData.slice(0, 4);

  useGSAP(() => {
    gsap.from('.resources-title', {
      scrollTrigger: {
        trigger: '.resources-title',
        start: 'top 85%',
      },
      y: -30,
      opacity: 0,
      duration: 1,
      ease: 'power3.out'
    });

    gsap.from('.resource-card', {
      scrollTrigger: {
        trigger: '.resources-grid',
        start: 'top 80%',
      },
      y: 50,
      opacity: 0,
      duration: 0.8,
      stagger: 0.15,
      ease: 'power2.out'
    });

    gsap.from('.view-more-btn', {
      scrollTrigger: {
        trigger: '.view-more-btn',
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
    <Section id="resources">
      <div ref={container}>
        <div className="resources-title">
            <SectionTitle subtitle="// DATABASE" align="center">
                Recursos Galácticos
            </SectionTitle>
        </div>

        <div className="resources-grid grid grid-cols-1 items-stretch justify-center gap-8 sm:grid-cols-2 md:grid-cols-4">
            {previewResources.map((resource, index) => (
            <div key={index} className="resource-card flex">
                <TechFrame color={resource.color} className="h-full w-full">
                    <div className="relative flex h-full w-full flex-col items-center justify-between p-8 text-center">
                        <div className="glitch-effect relative mb-6 h-[120px] w-[120px] overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
                            <Image
                                src={resource.image}
                                alt={resource.name}
                                fill
                                className="holo-image"
                                style={{
                                    objectFit: 'cover',
                                    opacity: 0.8,
                                    animationDelay: `${(index * 0.8) % 5}s`
                                }}
                            />
                            <div className="absolute inset-0" style={{ background: `linear-gradient(to top, ${resource.color}40, transparent)` }} />
                        </div>

                        <div className="flex grow flex-col items-center">
                            <Typography variant="h6" className="z-[2] mb-2 font-bold text-white">
                                {resource.name}
                            </Typography>

                            <Typography
                                variant="caption"
                                className="z-[2] mb-4 rounded border px-2 py-1 text-[0.65rem] uppercase"
                                style={{ color: resource.color, borderColor: `${resource.color}40` }}
                            >
                                {resource.type}
                            </Typography>

                            <Typography variant="body2" className="z-[2] mb-4 leading-[1.6] text-foreground-muted">
                                {resource.description}
                            </Typography>
                        </div>
                    </div>
                </TechFrame>
            </div>
            ))}
        </div>

        <div className="view-more-btn mt-16 flex justify-center">
            <Link href="/resources" className="no-underline">
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
                    Ver más recursos
                </Button>
            </Link>
        </div>
      </div>
    </Section>
  );
};
