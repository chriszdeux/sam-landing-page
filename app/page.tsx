'use client';


import { Footer } from "../components/layout/Footer";
import { Background } from "../components/layout/Background";
import { HeroSection } from "../components/sections/HeroSection";
import { HistorySection } from "../components/sections/HistorySection";
import { MechanicsSection } from "../components/sections/MechanicsSection";
import { ResourcesSection } from "../components/sections/ResourcesSection";
import { ArchitectureSection } from "../components/sections/ArchitectureSection";
import { Modal } from "../components/ui/Modal";
import { SectionNavigation } from "../components/ui/SectionNavigation";

export default function Home() {
  return (
    <main className="min-h-screen relative">
      <Background />
      <SectionNavigation />


      <div className="relative z-10">
        <HeroSection />
        <HistorySection />
        <MechanicsSection />
        <ResourcesSection />
        <ArchitectureSection />
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
