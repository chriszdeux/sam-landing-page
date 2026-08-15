import React from "react";
import { Thermometer } from "lucide-react";
import { motion } from "framer-motion";
import { Typography } from "../ui/Typography";

export interface SlotMachine {
  id: string;
  name: string;
  hashRate: number; // Replaced powerMining
  maxTemperature: number;
  lifeLimit: number;
  currentUsage: number;
  temperature: number; // Individual component temperature
}

export interface LaboratoryInterface {
  id: string;
  type: "MINING";
  lifeLimit: number;
  currentLife: number;
  maxTemperature: number;
  slotsCapacity: number;
  hashRate: number; // Replaced powerBase
  energy: number;
  slots: SlotMachine[];
  createdAt: string | Date;

  // Client-side simulation properties
  temperature: number; // Global lab temperature
  efficiency: number;
  operationStatus: 'ACTIVE' | 'INACTIVE';
  pendingRewards: number;
}

interface Props {
  labData: LaboratoryInterface | null;
  currentEnergy?: number;
  isWinner?: boolean;
}

export function LaboratorioMetersSection({ labData, currentEnergy, isWinner }: Props) {
  // Use labData temperature or fallback
  const globalTemp = labData?.temperature || 0;
  const maxTemp = labData?.maxTemperature || 80;
  const tempPercent = (globalTemp / maxTemp) * 100;

  return (
    <motion.div
      animate={isWinner ? {
        scale: [1, 1.02, 1],
        boxShadow: ["0 0 0px #ffb70000", "0 0 30px #ffb70060", "0 0 0px #ffb70000"]
      } : {}}
      transition={{ duration: 0.8, repeat: isWinner ? Infinity : 0 }}
      className="relative w-full max-w-[1000px] rounded-2xl p-4 transition-all duration-500"
      style={{
        border: isWinner ? '1px solid #ffb700' : '1px solid transparent',
        backgroundColor: isWinner ? 'rgba(255,183,0,0.05)' : 'transparent'
      }}
    >
      {isWinner && (
        <Typography
          variant="caption"
          className="absolute left-1/2 z-10 -translate-x-1/2 rounded-full bg-[#ffb700] px-4 py-1 font-bold text-black shadow-[0_0_10px_#ffb700]"
          style={{ top: -15 }}
        >
          ¡COMISIÓN DE RED GANADA!
        </Typography>
      )}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* System Load Meter */}
        <div>
          <div className="mb-2 flex justify-between">
            <Typography variant="caption" className="font-semibold tracking-wide text-white/50">Carga del Sistema</Typography>
            <Typography variant="caption" className="font-semibold tracking-wide text-[#00f3ff]">{labData ? `${(labData.efficiency !== undefined ? labData.efficiency : 78).toFixed(2)}% Estable` : '78.00% Estable'}</Typography>
          </div>
          <div className="flex gap-2 rounded-lg border border-[#00f3ff]/20 bg-black/50 p-3 shadow-[0_0_20px_rgba(0,243,255,0.05)]">
            {Array.from({ length: 10 }).map((_, index) => {
              const items = Math.round((labData?.efficiency || 78) / 10);
              const isActive = index < items;
              return (
                <div
                  key={index}
                  className="h-3 flex-1 rounded-sm transition-all duration-300"
                  style={{ backgroundColor: isActive ? '#00f3ff' : 'rgba(0, 243, 255, 0.1)' }}
                />
              );
            })}
          </div>
        </div>

        {/* Global Temperature Meter */}
        <div>
          <div className="mb-2 flex justify-between">
            <div className="flex items-center gap-1">
              <Thermometer size={14} style={{ color: tempPercent > 80 ? '#ff0055' : 'rgba(255,255,255,0.5)' }} />
              <Typography variant="caption" className="font-semibold tracking-wide text-white/50">
                Temp. Global Laboratorio
              </Typography>
            </div>
            <Typography variant="caption" className="font-semibold tracking-wide" style={{ color: tempPercent > 80 ? '#ff0055' : '#00f3ff' }}>
              {globalTemp.toFixed(1)}°C / {maxTemp}°C
            </Typography>
          </div>
          <div className="h-3 w-full overflow-hidden rounded-full border border-white/5 bg-black/50">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${tempPercent}%` }}
              style={{
                height: '100%',
                background: tempPercent > 80
                  ? 'linear-gradient(90deg, #ff0055, #ff5500)'
                  : 'linear-gradient(90deg, #00f3ff, #0055ff)',
                boxShadow: tempPercent > 80 ? '0 0 10px #ff0055' : 'none'
              }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
