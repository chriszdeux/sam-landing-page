import React from "react";
import { Box, Paper, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { DeveloperBoard, AddCircleOutline } from "@mui/icons-material";
import { LabDataInterface } from "./LaboratorioMetersSection";

interface LaboratorioSlotsGridProps {
  labData: LabDataInterface | null;
  selectedSlot: number | string | null;
  onOpenMarket: (index: number) => void;
  onOpenDetail: (index: number) => void;
  onSelectSlot: (id: string | number) => void;
}

export function LaboratorioSlotsGrid({ labData, selectedSlot, onOpenMarket, onOpenDetail, onSelectSlot }: LaboratorioSlotsGridProps) {
  return (
    <Box display="flex" justifyContent="space-between" alignItems="flex-start" gap={3} flexWrap="wrap" 
         sx={{ p: 4, bgcolor: 'rgba(0,0,0,0.2)', borderRadius: 4, border: '1px solid rgba(255,255,255,0.05)' }}>
      {Array.from({ length: labData?.capacity || 6 }).map((_, index) => {
        const currentSlots = labData?.slots || [];
        // Backend can return null for empty slots
        const rawSlot = index < currentSlots.length ? currentSlots[index] : null;
        const slot = rawSlot ?? { id: `empty-${index}`, name: '', performance: '', color: '#ffffff', currentLife: 100, lifeLimit: 100 };
        const slotId = slot.id || `slot-${index}`;
        const isSelected = selectedSlot === slotId;
        // A slot is active if it has a name or a hashRate (real data from backend)
        const hasData = !!(slot.name || slot.hashRate);
        const slotColor = slot.color || '#00f3ff';
        const displayPerf = slot.performance || (slot.hashRate ? `${slot.hashRate} TH/s` : '');
        const lifePercent = slot.currentLife && slot.lifeLimit ? (slot.currentLife / slot.lifeLimit) * 100 : 100;
        const isLowLife = hasData && lifePercent < 20;

        return (
          <Box key={slotId} display="flex" flexDirection="column" alignItems="center" sx={{ flex: 1, minWidth: 100 }}>
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
              <Paper 
                onClick={() => {
                  if (!hasData) {
                    onOpenMarket(index);
                  } else {
                    onSelectSlot(slotId);
                    onOpenDetail(index);
                  }
                }}
                variant="outlined" 
                sx={{ 
                  width: '100%', 
                  aspectRatio: '1', 
                  display: 'flex', 
                  flexDirection: 'column',
                  justifyContent: 'center', 
                  alignItems: 'center',
                  cursor: 'pointer',
                  bgcolor: isSelected ? `${slotColor}15` : 'rgba(10,12,16,0.8)', 
                  backdropFilter: 'blur(10px)', 
                  borderWidth: isSelected ? 2 : 1,
                  borderColor: isSelected ? slotColor : 'rgba(255,255,255,0.1)',
                  borderRadius: 3,
                  boxShadow: isSelected ? `0 0 15px ${slotColor}30` : 'none',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    borderColor: isSelected ? slotColor : (hasData ? 'rgba(255,255,255,0.3)' : '#00f3ff'),
                    transform: 'translateY(-2px)'
                  },
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                {hasData ? (
                  <DeveloperBoard sx={{ 
                    fontSize: 40, 
                    color: isSelected ? slotColor : (isLowLife ? '#ff0055' : 'text.secondary'), 
                    opacity: 1,
                    filter: isSelected ? `drop-shadow(0 0 8px ${slotColor}80)` : (isLowLife ? 'drop-shadow(0 0 5px #ff005590)' : 'none'),
                    transition: 'all 0.3s'
                  }} />
                ) : (
                  <Box sx={{ 
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1,
                    opacity: 0.5, transition: 'all 0.3s',
                    '&:hover': { opacity: 1 }
                  }}>
                    <AddCircleOutline sx={{ fontSize: 40, color: 'rgba(255,255,255,0.7)', transition: 'all 0.2s', '&:hover': { color: '#00f3ff', filter: 'drop-shadow(0 0 8px #00f3ff)' } }} />
                  </Box>
                )}
                
                <Typography variant="caption" sx={{ mt: 1, color: isSelected ? '#fff' : 'rgba(255,255,255,0.5)', fontWeight: 600 }}>
                  {slot.name || 'SLOT VACÍO'}
                </Typography>

                <Typography variant="h6" sx={{ 
                  mt: 0.5, 
                  fontWeight: 700, 
                  color: isSelected ? '#fff' : 'text.secondary',
                  textShadow: isSelected ? '0 2px 4px rgba(0,0,0,0.5)' : 'none'
                }}>
                  {displayPerf || '-'}
                </Typography>

                {/* Power Injection Animation (Particles) */}
                {hasData && (
                  <Box sx={{ position: 'absolute', top: '50%', left: '50%', pointerEvents: 'none' }}>
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
                  </Box>
                )}
              </Paper>
            </motion.div>
          </Box>
        );
      })}
    </Box>
  );
}
