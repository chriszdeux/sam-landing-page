"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Box, Grid, Typography, Button, Paper, Stack, CircularProgress } from "@mui/material";
import { PowerSettingsNew, DeveloperBoard, AddCircleOutline } from "@mui/icons-material";
import { MiningBackground } from "./MiningBackground";
import { LaboratorioChartsSection } from "./LaboratorioChartsSection";
import { useAppSelector } from "../../lib/hooks";
import { LaboratorioRegistration } from "./LaboratorioRegistration";
import { LaboratorioMetersSection, LabDataInterface } from "./LaboratorioMetersSection";
import api from "../../lib/api";
import { useEffect } from "react";
import { LaboratorioMarketDrawer, HardwareItem } from "./LaboratorioMarketDrawer";
import { LaboratorioHardwareDetailDrawer } from "./LaboratorioHardwareDetailDrawer";

export function LaboratorioView() {
  const { userInfo, status } = useAppSelector((state) => state.auth);
  const [selectedSlot, setSelectedSlot] = useState<number | string | null>(null);
  const [labData, setLabData] = useState<LabDataInterface | null>(null);
  const [isMarketOpen, setIsMarketOpen] = useState(false);
  const [buyingSlotIndex, setBuyingSlotIndex] = useState<number | null>(null);
  
  // US-003 Inventory Detailed states
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [currentDetailIndex, setCurrentDetailIndex] = useState<number | null>(null);
  
  const hasLab = userInfo?.idLabs && userInfo.idLabs.length > 0;

  const handleOpenMarket = (index: number) => {
    setBuyingSlotIndex(index);
    setIsMarketOpen(true);
  };

  const handleOpenDetail = (index: number) => {
    setCurrentDetailIndex(index);
    setIsDetailOpen(true);
  };

  const handleUninstall = async () => {
    if (labData?.id && currentDetailIndex !== null) {
      try {
        await api.post(`/labs/${labData.id}/uninstall-hardware`, { slotIndex: currentDetailIndex });
        const res = await api.get(`/labs/${labData.id}`);
        setLabData(res.data.laboratory || res.data);
        setIsDetailOpen(false);
      } catch (err) {
        console.error("Error unistalling hardware", err);
      }
    }
  };

  const handleMaintenance = async () => {
    if (labData?.id && currentDetailIndex !== null) {
      try {
        await api.post(`/labs/${labData.id}/maintenance`, { slotIndex: currentDetailIndex });
        const res = await api.get(`/labs/${labData.id}`);
        setLabData(res.data.laboratory || res.data);
      } catch (err) {
        console.error("Error maintenance hardware", err);
      }
    }
  };

  const handleBuy = async (hw: HardwareItem) => {
     if (labData && labData.id && buyingSlotIndex !== null) {
       try {
         await api.post(`/labs/${labData.id}/buy-slot`, {
           hardwareId: hw.id,
           slotIndex: buyingSlotIndex
         });
         
         // Refetch
         const res = await api.get(`/labs/${labData.id}`);
         setLabData(res.data.laboratory || res.data);
         setIsMarketOpen(false);
       } catch (error) {
         console.error("Error comprar hardware", error);
       }
     }
  };

  useEffect(() => {
    if (hasLab && userInfo?.idLabs) {
      api.get(`/labs/${userInfo.idLabs[0]}`)
         .then(res => setLabData(res.data.laboratory || res.data))
         .catch(err => console.error("Error fetching lab data", err));
    }
  }, [hasLab, userInfo]);

  if (status === 'loading') {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', bgcolor: '#0a0c10' }}>
        <CircularProgress sx={{ color: '#00f3ff' }} />
      </Box>
    );
  }

  if (!userInfo) {
    return (
      <Box sx={{ minHeight: '100vh', pt: 12, display: 'flex', justifyContent: 'center', alignItems: 'center', bgcolor: '#0a0c10', position: 'relative' }}>
        <MiningBackground />
        <Paper sx={{ p: 6, bgcolor: 'rgba(10,12,16,0.8)', border: '1px solid #ff0055', textAlign: 'center', zIndex: 1 }}>
          <PowerSettingsNew sx={{ fontSize: 60, color: '#ff0055', mb: 2 }} />
          <Typography variant="h4" color="white" fontWeight="bold">ACCESO DENEGADO</Typography>
          <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.6)', mt: 1 }}>
            Inicia sesión para acceder al Laboratorio.
          </Typography>
        </Paper>
      </Box>
    );
  }

  if (!hasLab && userInfo) {
    return <LaboratorioRegistration userInfo={userInfo} />;
  }

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      pt: 12, 
      pb: 6, 
      px: { xs: 2, sm: 3, lg: 4 }, 
      maxWidth: 1400, 
      mx: 'auto',
      position: 'relative' 
    }}>
      <MiningBackground />

      {/* Top Title and Energy Meter */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Box display="flex" flexDirection="column" alignItems="center" mb={6}>
          <Typography variant="h4" sx={{ 
            color: '#fff', 
            mb: 3, 
            fontWeight: 800, 
            textTransform: 'uppercase', 
            letterSpacing: 2,
            textShadow: '0 0 10px rgba(0, 243, 255, 0.5)'
          }}>
            Cluster <span style={{ color: '#00f3ff' }}>{"->"}</span> Laboratorio
          </Typography>

          <LaboratorioMetersSection labData={labData} />
        </Box>
      </motion.div>

      <Grid container spacing={4}>
        {/* Left Area (Charts and Bottom Slots) */}
        <Grid size={{ xs: 12, md: 10, lg: 11 }}>
          <LaboratorioChartsSection />

          <Grid container spacing={4}>
            <Grid size={{ xs: 12 }}>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.5 }}>
                 <Box display="flex" justifyContent="space-between" alignItems="flex-start" gap={3} flexWrap="wrap" 
                      sx={{ p: 4, bgcolor: 'rgba(0,0,0,0.2)', borderRadius: 4, border: '1px solid rgba(255,255,255,0.05)' }}>
                    {Array.from({ length: labData?.capacity || 6 }).map((_, index) => {
                      const currentSlots = labData?.slots || [];
                      const slot = index < currentSlots.length ? currentSlots[index] : { id: `empty-${index}`, name: "", performance: "", color: "#ffffff" };
                      const slotId = slot.id || `slot-${index}`;
                      const isSelected = selectedSlot === slotId;
                      const hasData = !!slot.performance;
                      const slotColor = slot.color || "#00f3ff";
                      return (
                      <Box key={slotId} display="flex" flexDirection="column" alignItems="center" sx={{ flex: 1, minWidth: 100 }}>
                        <motion.div
                          initial={{ opacity: 0, y: 30 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
                          style={{ width: '100%' }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Paper 
                            onClick={() => {
                              if (!hasData) {
                                handleOpenMarket(index);
                              } else {
                                setSelectedSlot(slotId);
                                handleOpenDetail(index);
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
                                color: isSelected ? slotColor : 'text.secondary', 
                                opacity: 1,
                                filter: isSelected ? `drop-shadow(0 0 8px ${slotColor}80)` : 'none',
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
                              {slot.performance || '-'}
                            </Typography>
                          </Paper>
                        </motion.div>
                        
                        {/* Legacy control buttons removed in favor of US-003 Side Drawer Details */}
                      </Box>
                    )})}
                  </Box>
               </motion.div>
            </Grid>
          </Grid>
        </Grid>

        {/* Right Vertical Buttons */}
        <Grid size={{ xs: 12, md: 2, lg: 1 }}>
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.4 }} style={{ height: '100%' }}>
            <Stack spacing={2} sx={{ 
              height: '100%', 
              bgcolor: 'rgba(10,12,16,0.6)', 
              p: 2, 
              borderRadius: 4, 
              border: '1px solid rgba(255,255,255,0.05)',
              justifyContent: 'center'
            }}>
               {[1, 2, 3, 4, 5].map((btn) => (
                  <Button 
                    key={btn}
                    variant="outlined" 
                    sx={{ 
                      height: 60, 
                      minWidth: 40, 
                      borderRadius: 2,
                      borderColor: 'rgba(255,255,255,0.1)', 
                      bgcolor: 'rgba(0,0,0,0.4)',
                      transition: 'all 0.2s',
                      '&:hover': { 
                        bgcolor: 'rgba(0, 243, 255, 0.1)', 
                        borderColor: '#00f3ff',
                        boxShadow: '0 0 15px rgba(0,243,255,0.2)'
                      }
                    }}
                  />
               ))}
            </Stack>
          </motion.div>
        </Grid>
      </Grid>

      <LaboratorioMarketDrawer 
        open={isMarketOpen} 
        onClose={() => setIsMarketOpen(false)} 
        buyingSlotIndex={buyingSlotIndex}
        onBuy={handleBuy}
      />

      <LaboratorioHardwareDetailDrawer
        open={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        slot={currentDetailIndex !== null ? (labData?.slots?.[currentDetailIndex] || null) : null}
        onUninstall={handleUninstall}
        onMaintenance={handleMaintenance}
      />
    </Box>
  );
}
