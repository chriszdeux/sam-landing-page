"use client";

import React from 'react';
import { Typography } from '@/components/ui/Typography';
import { PageHeader } from '@/components/ui/PageHeader';
import { ParticleBackground } from '@/components/ui/ParticleBackground';
import { roadmapData } from '@/lib/data/roadmap';
import { RoadmapNode } from '@/components/ui/RoadmapNode';
import { Reveal } from '@/components/ui/TextReveal';

export default function RoadmapPage() {
  return (
    <div className="relative min-h-screen pt-24 pb-40">
      <ParticleBackground />

      <div className="relative z-10 mx-auto w-full max-w-[900px] px-4 sm:px-6 lg:px-8">
        <PageHeader
          title="Lyncore Roadmap"
          subtitle="Conoce el camino hacia la descentralización y la economía del futuro."
        />

        <div className="relative mt-24">
          {/* Vertical Riel (Timeline Line) */}
          <div
            className="absolute top-0 bottom-0 left-0 z-0 w-[2px] opacity-30"
            style={{ background: 'linear-gradient(to bottom, #00f3ff, rgba(255,255,255,0.1))' }}
          />

          {/* Roadmap Phases */}
          <div className="flex flex-col">
            {roadmapData.map((item, index) => (
              <RoadmapNode
                key={index}
                {...item}
                isActive={item.status === 'Activo'}
                isLast={index === roadmapData.length - 1}
              />
            ))}
          </div>
        </div>

        <Reveal className="mt-20 text-center">
            <Typography variant="body2" className="italic text-white/40">
                * El Roadmap está sujeto a cambios basados en el consenso de la red y avances tecnológicos.
            </Typography>
        </Reveal>
      </div>
    </div>
  );
}
