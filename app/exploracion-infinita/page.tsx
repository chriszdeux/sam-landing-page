// 1-Estructuración y renderizado visual del componente UI

'use client';

import React from 'react';
import { ParticleBackground } from '../../components/ui/ParticleBackground';

import GalacticExplorer from '../../components/space/GalacticExplorer';

export default function InfiniteExplorationPage() {
  return (
    <div className="relative h-screen w-screen overflow-hidden bg-[#050514]">
      {/* Background Particles */}
      <ParticleBackground />

      {/* Full Screen Map Container */}
      <div className="h-full w-full">
        <GalacticExplorer />
      </div>
    </div>
  );
}
