"use client";

import React from 'react';
import { ArrowLeft, TrendingUp, Users, LayoutGrid } from "lucide-react";
import Link from "next/link";
import { Typography } from "../../../components/ui/Typography";

export default function StatsPage() {
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
            MARKET <span style={{ color: '#ff0055' }}>ANALYTICS</span>
          </Typography>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
           <StatItem icon={<TrendingUp />} title="Volumen 24h" value="1.2M THAO" color="#00f3ff" />
           <StatItem icon={<Users />} title="Traders Activos" value="2,450" color="#ffd700" />
           <StatItem icon={<LayoutGrid />} title="Módulos en Circulación" value="12,800" color="#ff0055" />
        </div>

        <div className="mt-12">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-12">
             <Typography variant="h6" className="mb-8 text-white">Tendencia de Precios</Typography>
             <div className="flex h-[300px] items-center justify-center border border-dashed border-white/10">
                <Typography className="text-white/30">[ GRÁFICO EN TIEMPO REAL - PRÓXIMAMENTE ]</Typography>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatItem({ icon, title, value, color }: { icon: React.ReactElement<{ size?: number; color?: string }>, title: string, value: string, color: string }) {
  return (
    <div className="md:col-span-4">
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
        <div className="mb-2 flex items-center gap-2">
          {React.cloneElement(icon, { size: 20, color })}
          <Typography variant="body2" className="text-white/60">{title}</Typography>
        </div>
        <Typography variant="h4" className="font-bold text-white">{value}</Typography>
      </div>
    </div>
  );
}
