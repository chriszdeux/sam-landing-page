"use client";

import React from "react";
import { ShoppingCart, ArrowLeftRight, BarChart3 } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Typography } from "../../components/ui/Typography";

export default function GalacticMarketPage() {
  return (
    <div className="min-h-screen bg-[#05050c] pt-[120px] pb-20">
      <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Typography variant="h2" className="mb-4 text-center font-bold text-white">
            MERCADO <span style={{ color: '#00f3ff' }}>GALÁCTICO</span>
          </Typography>
          <Typography variant="h6" className="mb-16 text-center text-white/60">
            Central de intercambio de módulos y recursos para sistemas CORE_MODULES-8.
          </Typography>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
            <div className="md:col-span-4">
              <Link href="/galactic-market/comprar" className="no-underline">
                <MarketCard
                  icon={<ShoppingCart size={40} color="#00f3ff" />}
                  title="COMPRAR MÓDULOS"
                  description="Adquiere planos y estructuras para expandir tu estación."
                />
              </Link>
            </div>
            <div className="md:col-span-4">
              <Link href="/galactic-market/exchange" className="no-underline">
                <MarketCard
                  icon={<ArrowLeftRight size={40} color="#ffd700" />}
                  title="EXCHANGE"
                  description="Intercambia recursos y módulos con otros usuarios."
                />
              </Link>
            </div>
            <div className="md:col-span-4">
              <Link href="/galactic-market/stats" className="no-underline">
                <MarketCard
                  icon={<BarChart3 size={40} color="#ff0055" />}
                  title="ESTADÍSTICAS"
                  description="Analiza las tendencias del mercado y el valor de tus activos."
                />
              </Link>
            </div>
          </div>

          <div className="mt-16 rounded-2xl border border-dashed border-[rgba(0,243,255,0.3)] bg-[rgba(0,243,255,0.05)] p-8 text-center">
            <Typography variant="h5" className="font-bold text-[#00f3ff]">
              MODO CONSTRUCCIÓN CENTRALIZADO
            </Typography>
            <Typography className="mt-2 text-white">
              Los procesos de compra (Phase 1 & Phase 2) han sido trasladados aquí para optimizar el rendimiento del simulador.
            </Typography>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function MarketCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="flex h-full cursor-pointer flex-col items-center rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-center transition-all duration-300 hover:-translate-y-1 hover:border-[rgba(0,243,255,0.3)] hover:bg-white/5 hover:shadow-[0_0_20px_rgba(0,243,255,0.1)]">
      <div className="mb-4">{icon}</div>
      <Typography variant="h6" className="mb-2 font-bold text-white">{title}</Typography>
      <Typography variant="body2" className="text-white/60">{description}</Typography>
    </div>
  );
}
