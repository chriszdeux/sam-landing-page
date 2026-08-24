"use client";

import React, { useState } from 'react';
import { Pin } from "lucide-react";
import { motion } from "framer-motion";
import { Typography } from "../ui/Typography";
import { PowerChart, TemperatureChart, EnergyCostChart } from "./LaboratorioCharts";

export function LaboratorioChartsSection() {
  const [pinnedChart, setPinnedChart] = useState<string | null>(null);

  const handlePin = (chartId: string) => {
    setPinnedChart(prev => prev === chartId ? null : chartId);
  };

  const getGridClassName = (chartId: string) => {
    if (pinnedChart === chartId) return 'col-span-12';
    if (pinnedChart !== null) return 'col-span-12 lg:col-span-6'; // If another chart is pinned, the remaining two stack side-by-side underneath
    return 'col-span-12 lg:col-span-4'; // Default: 3 columns
  };

  const getChartHeight = (chartId: string) => {
    return pinnedChart === chartId ? 450 : 300;
  };

  return (
    <div className="mb-8 grid grid-cols-12 gap-8">
      {/* Power Chart */}
      <div className={`${getGridClassName('power')} transition-all duration-500 ease-in-out`}>
        <motion.div layout initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2 }} style={{ height: '100%' }}>
          <div
            className="relative h-full overflow-hidden rounded-2xl border p-6 transition-all duration-500 ease-in-out"
            style={{
              minHeight: getChartHeight('power'),
              backgroundColor: 'rgba(10, 15, 30, 0.8)',
              backdropFilter: 'blur(20px)',
              borderColor: 'rgba(0, 243, 255, 0.15)',
              boxShadow: 'inset 0 0 20px rgba(0,243,255,0.02), 0 8px 32px rgba(0,0,0,0.4)',
            }}
          >
            <div className="absolute left-0 top-0 h-full w-1 bg-[#00f3ff] opacity-80" />

            <div className="mb-4 flex items-start justify-between">
              <Typography variant="h6" className="text-[0.9rem] font-semibold uppercase tracking-wide text-[#00f3ff]">
                Poder Energético
              </Typography>
              <button
                onClick={() => handlePin('power')}
                className="rounded p-1 transition-colors hover:bg-[#00f3ff]/10 hover:text-[#00f3ff]"
                style={{ color: pinnedChart === 'power' ? '#00f3ff' : 'rgba(255,255,255,0.3)' }}
              >
                <Pin size={16} fill={pinnedChart === 'power' ? 'currentColor' : 'none'} />
              </button>
            </div>

            <div className="absolute bottom-6 left-6 right-6 top-[70px]">
              <PowerChart />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Temperature Chart */}
      <div className={`${getGridClassName('temp')} transition-all duration-500 ease-in-out`}>
        <motion.div layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }} style={{ height: '100%' }}>
          <div
            className="relative h-full overflow-hidden rounded-2xl border p-6 transition-all duration-500 ease-in-out"
            style={{
              minHeight: getChartHeight('temp'),
              backgroundColor: 'rgba(10, 15, 30, 0.8)',
              backdropFilter: 'blur(20px)',
              borderColor: 'rgba(255, 0, 85, 0.15)',
              boxShadow: 'inset 0 0 20px rgba(255,0,85,0.02), 0 8px 32px rgba(0,0,0,0.4)',
            }}
          >
            <div className="absolute left-0 top-0 h-full w-1 bg-[#ff0055] opacity-80" />

            <div className="mb-4 flex items-start justify-between">
              <Typography variant="h6" className="text-[0.9rem] font-semibold uppercase tracking-wide text-[#ff0055]">
                Temperatura Central
              </Typography>
              <button
                onClick={() => handlePin('temp')}
                className="rounded p-1 transition-colors hover:bg-[#ff0055]/10 hover:text-[#ff0055]"
                style={{ color: pinnedChart === 'temp' ? '#ff0055' : 'rgba(255,255,255,0.3)' }}
              >
                <Pin size={16} fill={pinnedChart === 'temp' ? 'currentColor' : 'none'} />
              </button>
            </div>

            <div className="absolute bottom-6 left-6 right-6 top-[70px]">
              <TemperatureChart />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Energy Cost Chart */}
      <div className={`${getGridClassName('cost')} transition-all duration-500 ease-in-out`}>
        <motion.div layout initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.4 }} style={{ height: '100%' }}>
          <div
            className="relative h-full overflow-hidden rounded-2xl border p-6 transition-all duration-500 ease-in-out"
            style={{
              minHeight: getChartHeight('cost'),
              backgroundColor: 'rgba(10, 15, 30, 0.8)',
              backdropFilter: 'blur(20px)',
              borderColor: 'rgba(0, 230, 118, 0.15)',
              boxShadow: 'inset 0 0 20px rgba(0,230,118,0.02), 0 8px 32px rgba(0,0,0,0.4)',
            }}
          >
            <div className="absolute left-0 top-0 h-full w-1 bg-[#00e676] opacity-80" />

            <div className="mb-4 flex items-start justify-between">
              <Typography variant="h6" className="text-[0.9rem] font-semibold uppercase tracking-wide text-[#00e676]">
                Costo Energético
              </Typography>
              <button
                onClick={() => handlePin('cost')}
                className="rounded p-1 transition-colors hover:bg-[#00e676]/10 hover:text-[#00e676]"
                style={{ color: pinnedChart === 'cost' ? '#00e676' : 'rgba(255,255,255,0.3)' }}
              >
                <Pin size={16} fill={pinnedChart === 'cost' ? 'currentColor' : 'none'} />
              </button>
            </div>

            <div className="absolute bottom-6 left-6 right-6 top-[70px]">
              <EnergyCostChart />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
