'use client';

import React from "react";
import { Thermometer } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { Typography } from "../ui/Typography";
import {
  SeverityBadge,
  SEVERITY_SPEC,
  temperatureSeverity,
  efficiencySeverity,
  worstSeverity,
  type Severity,
} from "../dashboard/SeverityMeter";

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
  const reduceMotion = useReducedMotion();

  // Use labData temperature or fallback
  const globalTemp = labData?.temperature || 0;
  const maxTemp = labData?.maxTemperature || 80;
  const tempPercent = Math.min((globalTemp / maxTemp) * 100, 100);
  const efficiency = labData?.efficiency !== undefined ? labData.efficiency : 78;
  const isPoweredOn = labData ? labData.operationStatus === 'ACTIVE' : true;

  // Misma convención de severidad que el resto de la telemetría (ver dashboard/SeverityMeter).
  const tempSeverity = temperatureSeverity(globalTemp, false, isPoweredOn);
  const effSeverity = efficiencySeverity(efficiency, isPoweredOn);
  const tempSpec = SEVERITY_SPEC[tempSeverity];
  const effSpec = SEVERITY_SPEC[effSeverity];
  const sectionSeverity: Severity = worstSeverity(tempSeverity, effSeverity);
  const isCritical = sectionSeverity === 'critical';

  // El pulso acelera con la gravedad; en normal la sección queda quieta.
  const pulseFor = (severity: Severity) =>
    !reduceMotion && SEVERITY_SPEC[severity].pulse !== null ? SEVERITY_SPEC[severity].pulse! : null;
  const tempPulse = pulseFor(tempSeverity);
  const effPulse = pulseFor(effSeverity);

  return (
    <motion.div
      animate={
        isWinner
          ? {
            scale: [1, 1.02, 1],
            boxShadow: ["0 0 0px #ffb70000", "0 0 30px #ffb70060", "0 0 0px #ffb70000"]
          }
          : isCritical && !reduceMotion
            // En crítico la sección late en rojo en vez de quedarse muda.
            ? { boxShadow: ["0 0 0px #ff174400", `0 0 34px ${tempSpec.color}55`, "0 0 0px #ff174400"] }
            : { scale: 1, boxShadow: isCritical ? `0 0 24px ${tempSpec.color}55` : "0 0 0px #00000000" }
      }
      transition={{
        duration: isWinner ? 0.8 : 0.7,
        repeat: isWinner || (isCritical && !reduceMotion) ? Infinity : 0,
        ease: 'easeInOut'
      }}
      className="relative w-full max-w-[1000px] rounded-2xl p-4 transition-all duration-500"
      style={{
        border: isWinner
          ? '1px solid #ffb700'
          : isCritical
            ? `1px solid ${tempSpec.color}`
            : '1px solid transparent',
        backgroundColor: isWinner
          ? 'rgba(255,183,0,0.05)'
          : isCritical
            ? `${tempSpec.color}0d`
            : 'transparent'
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
          <div className="mb-2 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Typography variant="caption" className="font-semibold uppercase tracking-wide text-white/50">Carga del Sistema</Typography>
              <SeverityBadge severity={effSeverity} />
            </div>
            <Typography
              variant="caption"
              className="font-semibold tabular-nums tracking-wide transition-colors duration-500"
              style={{ color: effSpec.color }}
            >
              {efficiency.toFixed(2)}% {effSeverity === 'normal' ? 'Estable' : effSpec.label}
            </Typography>
          </div>
          <motion.div
            className="flex gap-2 rounded-lg border bg-black/50 p-3"
            animate={effPulse
              ? { borderColor: [`${effSpec.color}33`, `${effSpec.color}cc`, `${effSpec.color}33`], boxShadow: [`0 0 0px ${effSpec.color}00`, `0 0 18px ${effSpec.color}55`, `0 0 0px ${effSpec.color}00`] }
              : { borderColor: `${effSpec.color}33`, boxShadow: `0 0 20px ${effSpec.color}0d` }}
            transition={effPulse ? { duration: effPulse, repeat: Infinity, ease: 'easeInOut' } : { duration: 0.4 }}
          >
            {Array.from({ length: 10 }).map((_, index) => {
              const items = Math.round(efficiency / 10);
              const isActive = index < items;
              return (
                <div
                  key={index}
                  className="h-3 flex-1 rounded-sm transition-all duration-300"
                  style={{ backgroundColor: isActive ? effSpec.color : `${effSpec.color}1a` }}
                />
              );
            })}
          </motion.div>
        </div>

        {/* Global Temperature Meter */}
        <div>
          <div className="mb-2 flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <Thermometer size={14} className="transition-colors duration-500" style={{ color: tempSeverity === 'normal' ? 'rgba(255,255,255,0.5)' : tempSpec.color }} />
              <Typography variant="caption" className="font-semibold uppercase tracking-wide text-white/50">
                Temp. Global Laboratorio
              </Typography>
              <SeverityBadge severity={tempSeverity} />
            </div>
            <Typography
              variant="caption"
              className="font-semibold tabular-nums tracking-wide transition-colors duration-500"
              style={{ color: tempSpec.color }}
            >
              {globalTemp.toFixed(1)}°C / {maxTemp}°C
            </Typography>
          </div>
          <motion.div
            className="h-3 w-full overflow-hidden rounded-full border bg-black/50"
            animate={tempPulse
              ? { borderColor: [`${tempSpec.color}33`, `${tempSpec.color}cc`, `${tempSpec.color}33`], boxShadow: [`0 0 0px ${tempSpec.color}00`, `0 0 18px ${tempSpec.color}66`, `0 0 0px ${tempSpec.color}00`] }
              : { borderColor: 'rgba(255,255,255,0.05)', boxShadow: `0 0 0px ${tempSpec.color}00` }}
            transition={tempPulse ? { duration: tempPulse, repeat: Infinity, ease: 'easeInOut' } : { duration: 0.4 }}
          >
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${tempPercent}%` }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              style={{
                height: '100%',
                background: tempSeverity === 'normal'
                  ? 'linear-gradient(90deg, #00f3ff, #0055ff)'
                  : `linear-gradient(90deg, ${tempSpec.color}, ${tempSpec.color}88)`,
                boxShadow: tempSeverity === 'normal' ? 'none' : `0 0 10px ${tempSpec.color}`
              }}
            />
          </motion.div>
          {tempSeverity !== 'normal' && tempSeverity !== 'offline' && (
            <Typography
              variant="caption"
              role="status"
              className="mt-1 block text-[0.65rem] font-bold uppercase tracking-[2px]"
              style={{ color: tempSpec.color }}
            >
              {tempSeverity === 'critical'
                ? '⚠ Crítico: sobrecalentamiento, detené la operación'
                : '⚠ Advertencia: temperatura por encima del rango seguro'}
            </Typography>
          )}
        </div>
      </div>
    </motion.div>
  );
}
