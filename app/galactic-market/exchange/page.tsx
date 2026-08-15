"use client";

import { ArrowLeft, ArrowLeftRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Typography } from "../../../components/ui/Typography";

export default function ExchangePage() {
  return (
    <div className="min-h-screen bg-[#05050c] pt-[120px] pb-20">
      <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <div className="mb-12 flex items-center gap-4">
          <Link href="/galactic-market">
            <button className="rounded p-2 text-white">
              <ArrowLeft />
            </button>
          </Link>
          <Typography variant="h3" className="font-bold text-white">
            RESOURCE <span style={{ color: '#ffd700' }}>EXCHANGE</span>
          </Typography>
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="rounded-2xl border border-dashed border-[rgba(255,215,0,0.3)] bg-[rgba(255,215,0,0.05)] p-20 text-center">
            <ArrowLeftRight size={100} className="mb-8 text-[#ffd700] opacity-50" />
            <Typography variant="h4" className="mb-4 text-white">Módulo de Intercambio P2P</Typography>
            <Typography className="text-white/60">
              Esta sección estará disponible en la Fase 3 del despliegue del Mercado Galáctico.
            </Typography>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
