// 1-Estructuración y renderizado visual del componente UI

'use client';

import { Footer } from "../components/layout/Footer";
import { Background } from "../components/layout/Background";
import { HeroSection } from "../components/sections/HeroSection";
import { HistorySection } from "../components/sections/HistorySection";
import { MechanicsSection } from "../components/sections/MechanicsSection";
import { Modal } from "../components/ui/Modal";
import { SectionNavigation } from "../components/ui/SectionNavigation";

export default function Home() {
  
  
  //# 1-Estructuración y renderizado visual del componente UI
  return (
    <main className="min-h-screen relative">
      <Background />
      <SectionNavigation />

      <div className="relative z-10">
        <HeroSection />
        <HistorySection />
        <MechanicsSection />
      </div>

      <Footer />
      <Modal>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[var(--neon-cyan)] mb-4">Próximamente</h2>
          <p className="text-gray-300">Esta funcionalidad estará disponible en la versión beta.</p>
        </div>
      </Modal>
    </main>
  );
}
