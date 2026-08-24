import React from "react";
import { Typography } from "../ui/Typography";
import { motion } from "framer-motion";
import { Cpu, PlusCircle, Thermometer } from "lucide-react";
import { LaboratoryInterface, SlotMachine } from "./LaboratorioMetersSection";
import { getCBUnit, getCBDivisor } from "../../lib/constants/blockchainFrequencies";

interface LaboratorioSlotsGridProps {
  labData: LaboratoryInterface | null;
  selectedSlot: number | string | null;
  onOpenMarket: (index: number) => void;
  onOpenDetail: (index: number) => void;
  onSelectSlot: (id: string | number) => void;
}

export function LaboratorioSlotsGrid({ labData, selectedSlot, onOpenMarket, onOpenDetail, onSelectSlot }: LaboratorioSlotsGridProps) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-6 rounded-2xl border border-white/5 bg-black/20 p-8">
      {Array.from({ length: labData?.slotsCapacity || 6 }).map((_, index) => {
        const currentSlots = labData?.slots || [];
        // Backend can return null for empty slots
        const rawSlot = index < currentSlots.length ? currentSlots[index] : null;
        const slot = rawSlot as SlotMachine | null;
        const slotId = slot?.id || `slot-${index}`;
        const isSelected = selectedSlot === slotId;
        const hasData = !!slot;
        const slotColor = '#00f3ff';
        const displayPerf = slot?.hashRate ? `${(slot.hashRate / getCBDivisor(slot.hashRate)).toFixed(1)} ${getCBUnit(slot.hashRate)}` : '';
        const lifePercent = slot?.currentUsage ? (1 - slot.currentUsage / slot.lifeLimit) * 100 : 100;
        const isLowLife = hasData && lifePercent < 20;

        return (
          <div key={slotId} className="flex min-w-[100px] flex-1 flex-col items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isLowLife ? {
                opacity: 1,
                scale: [1, 1.02, 1],
                boxShadow: ["0 0 0px #ff005500", "0 0 15px #ff005540", "0 0 0px #ff005500"],
                y: 0
              } : { opacity: 1, y: 0 }}
              transition={isLowLife ? {
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              } : { duration: 0.4, delay: 0.6 + index * 0.1 }}
              style={{ width: '100%', borderRadius: 12 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div
                onClick={() => {
                  if (!hasData) {
                    onOpenMarket(index);
                  } else {
                    onSelectSlot(slotId);
                    onOpenDetail(index);
                  }
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = isSelected ? slotColor : (hasData ? 'rgba(255,255,255,0.3)' : '#00f3ff');
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = isSelected ? slotColor : 'rgba(255,255,255,0.1)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
                className="relative flex aspect-square w-full cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl backdrop-blur-md transition-all duration-300"
                style={{
                  backgroundColor: isSelected ? `${slotColor}15` : 'rgba(10,12,16,0.8)',
                  borderWidth: isSelected ? 2 : 1,
                  borderStyle: 'solid',
                  borderColor: isSelected ? slotColor : 'rgba(255,255,255,0.1)',
                  boxShadow: isSelected ? `0 0 15px ${slotColor}30` : 'none',
                }}
              >
                {!hasData ? (
                  <PlusCircle size={40} className="text-white/10" />
                ) : (
                  <Cpu size={40} className="text-[#00f3ff]" />
                )}

                <Typography variant="caption" className="mt-2 font-semibold" style={{ color: isSelected ? '#fff' : 'rgba(255,255,255,0.5)' }}>
                  {slot?.name || 'SLOT VACÍO'}
                </Typography>

                <Typography
                  variant="h6"
                  className="mt-1 font-bold"
                  style={{
                    color: isSelected ? '#fff' : '#b3b3b3',
                    textShadow: isSelected ? '0 2px 4px rgba(0,0,0,0.5)' : 'none'
                  }}
                >
                  {displayPerf || '-'}
                </Typography>

                {hasData && slot.temperature !== undefined && (
                  <div className="mt-1 flex items-center gap-1">
                    <Thermometer size={12} style={{ color: slot.temperature > 70 ? '#ff0055' : '#00f3ff' }} />
                    <Typography variant="caption" className="font-bold" style={{ color: slot.temperature > 70 ? '#ff0055' : '#00f3ff' }}>
                      {slot.temperature.toFixed(1)}°C
                    </Typography>
                  </div>
                )}

                {/* Power Injection Animation (Particles) */}
                {hasData && (
                  <div className="pointer-events-none absolute left-1/2 top-1/2">
                    {[1, 2, 3].map((i) => (
                      <motion.div
                        key={i}
                        initial={{ x: 0, y: 0, opacity: 0, scale: 0.5 }}
                        animate={{
                          x: 400, // Move towards the network section (right)
                          y: Math.sin(i * 2) * 50, // Wave effect
                          opacity: [0, 0.8, 0],
                          scale: [0.5, 1, 0.5]
                        }}
                        transition={{
                          duration: 2 + i,
                          repeat: Infinity,
                          delay: i * 0.8,
                          ease: "linear"
                        }}
                        style={{
                          position: 'absolute',
                          width: 4,
                          height: 4,
                          borderRadius: '50%',
                          backgroundColor: slotColor,
                          boxShadow: `0 0 10px ${slotColor}`
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        );
      })}
    </div>
  );
}
