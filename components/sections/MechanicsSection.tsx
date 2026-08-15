// 1-Estructuración y renderizado visual del componente UI

import React, { useRef } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Section } from '../ui/Section';
import { TechFrame } from '../ui/TechFrame';
import { SectionTitle } from '../ui/SectionTitle';
import { Typography } from '../ui/Typography';
import { mechanicsData } from '../../lib/data/mechanics';
import { EnvVariables } from '@/lib/constants/variables';

gsap.registerPlugin(ScrollTrigger);

export const MechanicsSection = () => {
  const container = useRef<HTMLDivElement | null>(null);
  const { coin1, coin2, coin3 } = EnvVariables
  useGSAP(() => {
    gsap.from('.mechanics-title', {
      scrollTrigger: {
        trigger: '.mechanics-title',
        start: 'top 85%',
      },
      y: -30,
      opacity: 0,
      duration: 1,
      ease: 'power3.out'
    });

    gsap.from('.mechanic-card-item', {
      scrollTrigger: {
        trigger: '.mechanics-grid',
        start: 'top 80%',
      },
      y: 50,
      opacity: 0,
      duration: 0.8,
      stagger: 0.15,
      ease: 'power2.out'
    });
  }, { scope: container });



  //# 1-Estructuración y renderizado visual del componente UI
  return (
    <Section id="mechanics">
      <div ref={container}>
        <div className="mechanics-title">
            <SectionTitle subtitle="// CORE SYSTEMS" align="center">
                Mecánicas de Juego
            </SectionTitle>

        </div>

        <div className="mechanics-grid grid grid-cols-1 items-stretch gap-8 sm:grid-cols-2 md:grid-cols-3">
            {mechanicsData.map((mechanic, index) => (
            <div key={index} className="mechanic-card-item flex">
                <TechFrame color={mechanic.color} className="h-full w-full">
                    <div className="relative flex h-full flex-col items-center justify-between p-8 text-center">
                        <Link href={`/mechanics/${mechanic.slug}`} className="no-underline">
                            <div
                                className="icon-box mb-6 inline-flex rounded-3xl border border-white/10 bg-white/[0.03] p-6 transition-all duration-[400ms] hover:rotate-[5deg] hover:scale-110 hover:border-[var(--mc)] hover:[background-color:color-mix(in_srgb,var(--mc)_12%,transparent)]"
                                style={{ '--mc': mechanic.color } as React.CSSProperties}
                            >
                                <mechanic.icon size={40} color={mechanic.color} />
                            </div>
                        </Link>

                        <Link href={`/mechanics/${mechanic.slug}`} className="text-inherit no-underline">
                        <Typography variant="h5" className="mb-4 font-bold text-white">
                            {mechanic.title}
                        </Typography>
                        </Link>

                        <Typography variant="body2" className="mb-8 flex-1 leading-[1.6] text-foreground-muted">
                        {mechanic.description.split(/(\${coin1}|\${coin2}|\${coin3})/g).map((part, index) => {
                            if (part === coin1) return <Link key={index} href="/mechanics/economy" className="font-bold text-[#ff0055] no-underline">{coin1}</Link>;
                            if (part === coin2) return <Link key={index} href="/mechanics/economy" className="font-bold text-[#ffb700] no-underline">{coin2}</Link>;
                            if (part === coin3) return <Link key={index} href="/mechanics/economy" className="font-bold text-[#00ff9d] no-underline">{coin3}</Link>;
                            return part;
                        })}
                        </Typography>

                        <Link href={`/mechanics/${mechanic.slug}`} className="text-inherit no-underline">
                        <div
                            className="learn-more flex items-center gap-2 text-[0.9rem] font-bold opacity-80 transition-all duration-300 hover:translate-y-0.5 hover:opacity-100"
                            style={{ color: mechanic.color }}
                        >
                            EXPLORAR <ArrowRight size={20} />
                        </div>
                        </Link>
                    </div>
                </TechFrame>
            </div>
            ))}
        </div>
      </div>
    </Section>
  );
};
