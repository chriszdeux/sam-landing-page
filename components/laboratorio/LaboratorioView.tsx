"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Box, Grid, Typography, Button, Paper, Stack, CircularProgress, Snackbar, Alert } from "@mui/material";
import { PowerSettingsNew } from "@mui/icons-material";
import { MiningBackground } from "./MiningBackground";
import { LaboratorioChartsSection } from "./LaboratorioChartsSection";
import { useAppSelector } from "../../lib/hooks";
import { LaboratorioRegistration } from "./LaboratorioRegistration";
import { LaboratorioMetersSection, LabDataInterface } from "./LaboratorioMetersSection";
import api from "../../lib/api";
import { useEffect } from "react";
import { LaboratorioMarketDrawer, HardwareItem } from "./LaboratorioMarketDrawer";
import { LaboratorioHardwareDetailDrawer } from "./LaboratorioHardwareDetailDrawer";
import { LaboratorioSlotsGrid } from "./LaboratorioSlotsGrid";
import { AxiosError } from "axios";

export function LaboratorioView() {
  const { userInfo, status } = useAppSelector((state) => state.auth);
  const [selectedSlot, setSelectedSlot] = useState<number | string | null>(null);
  const [labData, setLabData] = useState<LabDataInterface | null>(null);
  const [isMarketOpen, setIsMarketOpen] = useState(false);
  const [buyingSlotIndex, setBuyingSlotIndex] = useState<number | null>(null);
  
  // US-003 Inventory Detailed states
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [currentDetailIndex, setCurrentDetailIndex] = useState<number | null>(null);
  
  // Maintenance states
  const [isMaintenanceLoading, setIsMaintenanceLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  
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
      setIsMaintenanceLoading(true);
      try {
        await api.post(`/labs/${labData.id}/slot/${currentDetailIndex}/repair`);
        const res = await api.get(`/labs/${labData.id}`);
        setLabData(res.data.laboratory || res.data);
        setSnackbar({ open: true, message: 'Hardware reparado exitosamente (10 tokens consumidos)', severity: 'success' });
      } catch (err: unknown) {
        console.error("Error maintenance hardware", err);
        const errorMsg = (err as AxiosError<{message: string}>).response?.data?.message || 'Error al intentar reparar el hardware';
        setSnackbar({ open: true, message: errorMsg, severity: 'error' });
      } finally {
        setIsMaintenanceLoading(false);
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
                  <LaboratorioSlotsGrid 
                    labData={labData}
                    selectedSlot={selectedSlot}
                    onOpenMarket={handleOpenMarket}
                    onOpenDetail={handleOpenDetail}
                    onSelectSlot={setSelectedSlot}
                  />
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
        isMaintenanceLoading={isMaintenanceLoading}
      />

      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={4000} 
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity} variant="filled" sx={{ width: '100%', borderRadius: 2, boxShadow: '0 0 15px rgba(0,0,0,0.5)' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
