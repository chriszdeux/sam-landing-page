"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Box, Grid, Typography, Paper, CircularProgress, Snackbar, Alert } from "@mui/material";
import { PowerSettingsNew } from "@mui/icons-material";
import { MiningBackground } from "./MiningBackground";
import { LaboratorioChartsSection } from "./LaboratorioChartsSection";
import { useAppSelector } from "../../lib/hooks";
import { LaboratorioRegistration } from "./LaboratorioRegistration";
import { LaboratorioMetersSection, LabDataInterface } from "./LaboratorioMetersSection";
import api from "../../lib/api";import { LaboratorioMarketDrawer, HardwareItem } from "./LaboratorioMarketDrawer";
import { LaboratorioHardwareDetailDrawer } from "./LaboratorioHardwareDetailDrawer";
import { LaboratorioSlotsGrid } from "./LaboratorioSlotsGrid";
import { AxiosError } from "axios";
import { LaboratorioNetworkSection } from "./LaboratorioNetworkSection";

/** Normaliza la respuesta del GET /labs/:id al shape de LabDataInterface */
function normalizeLab(data: Record<string, unknown>): LabDataInterface {
  const lab = (data.laboratory ?? data) as LabDataInterface;
  if (data.blockchainProps && typeof data.blockchainProps === 'object') {
    const bp = data.blockchainProps as Record<string, unknown>;
    lab.blockchainEnergy = bp.energy as number | undefined;
    lab.blockchainMaxEnergy = bp.maxEnergy as number | undefined;
    lab.operationStatus = bp.operationStatus as string | undefined;
  }
  return lab;
}

export function LaboratorioView() {
  const { userInfo, status } = useAppSelector((state) => state.auth);
  const [selectedSlot, setSelectedSlot] = useState<number | string | null>(null);
  const [labData, setLabData] = useState<LabDataInterface | null>(null);
  const [localEnergy, setLocalEnergy] = useState<number | null>(null);
  const [isMarketOpen, setIsMarketOpen] = useState(false);
  const [buyingSlotIndex, setBuyingSlotIndex] = useState<number | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [currentDetailIndex, setCurrentDetailIndex] = useState<number | null>(null);
  const [isMaintenanceLoading, setIsMaintenanceLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  const hasLab = userInfo?.idLabs && userInfo.idLabs.length > 0;
  const labId = userInfo?.idLabs?.[0];

  // Derived: current energy — local takes precedence over server value
  const maxEnergy = labData?.maxEnergy ?? 50;
  const currentEnergy = localEnergy ?? labData?.energy ?? 0;

  const refetchLab = useCallback(async () => {
    if (!labId) return;
    try {
      const res = await api.get(`/labs/${labId}`);
      const fresh = normalizeLab(res.data);
      setLabData(fresh);
      setLocalEnergy(null); // reset local delta — server is source of truth after GET
    } catch (err) {
      console.error('Error fetching lab data', err);
    }
  }, [labId]);

  // Initial load
  useEffect(() => {
    if (hasLab) refetchLab();
  }, [hasLab, refetchLab]);

  // Passive energy recharge — frontend-driven: +5 to +10 EP per minute, capped at maxEnergy
  useEffect(() => {
    if (!labData?.id) return;
    const interval = setInterval(() => {
      const recharge = Math.floor(Math.random() * 6) + 5; // 5–10 EP
      setLocalEnergy(prev => {
        const base = prev ?? labData?.energy ?? 0;
        return Math.min(maxEnergy, base + recharge);
      });
    }, 60000);
    return () => clearInterval(interval);
  }, [labData?.id, maxEnergy, labData?.energy]);

  const handleOpenMarket = (index: number) => { setBuyingSlotIndex(index); setIsMarketOpen(true); };
  const handleOpenDetail = (index: number) => { setCurrentDetailIndex(index); setIsDetailOpen(true); };

  const handleBuy = async (hw: HardwareItem) => {
    if (!labData?.id || buyingSlotIndex === null) return;
    try {
      await api.post(`/labs/${labData.id}/buy-slot`, { hardwareId: hw.id, slotIndex: buyingSlotIndex });
      await refetchLab();
      setIsMarketOpen(false);
    } catch (error) {
      console.error("Error comprar hardware", error);
    }
  };

  const handleUninstall = async () => {
    if (!labData?.id || currentDetailIndex === null) return;
    try {
      await api.post(`/labs/${labData.id}/uninstall-hardware`, { slotIndex: currentDetailIndex });
      await refetchLab();
      setIsDetailOpen(false);
    } catch (err) {
      console.error("Error uninstalling hardware", err);
    }
  };

  const handleMaintenance = async () => {
    if (!labData?.id || currentDetailIndex === null) return;
    setIsMaintenanceLoading(true);
    try {
      await api.post(`/labs/${labData.id}/slot/${currentDetailIndex}/repair`);
      await refetchLab();
      setSnackbar({ open: true, message: 'Hardware reparado exitosamente (10 tokens consumidos)', severity: 'success' });
    } catch (err: unknown) {
      const errorMsg = (err as AxiosError<{ message: string }>).response?.data?.message ?? 'Error al intentar reparar el hardware';
      setSnackbar({ open: true, message: errorMsg, severity: 'error' });
    } finally {
      setIsMaintenanceLoading(false);
    }
  };

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

  if (!hasLab) return <LaboratorioRegistration userInfo={userInfo} />;

  return (
    <Box sx={{ minHeight: '100vh', pt: 12, pb: 6, px: { xs: 2, sm: 3, lg: 4 }, maxWidth: 1600, mx: 'auto', position: 'relative' }}>
      <MiningBackground />

      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Box display="flex" flexDirection="column" alignItems="center" mb={6}>
          <Typography variant="h4" sx={{
            color: '#fff', mb: 3, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 2,
            textShadow: '0 0 10px rgba(0, 243, 255, 0.5)'
          }}>
            Cluster <span style={{ color: '#00f3ff' }}>{"->"}</span> Laboratorio
          </Typography>

          {/* Lab Energy Mini-Indicator */}
          <Box sx={{
            mb: 3, px: 2, py: 0.5,
            bgcolor: 'rgba(255, 215, 0, 0.05)',
            border: '1px solid rgba(255, 215, 0, 0.2)',
            borderRadius: 2,
            display: 'flex', alignItems: 'center', gap: 1,
            boxShadow: '0 0 15px rgba(255, 215, 0, 0.1)'
          }}>
            <Box sx={{ width: 8, height: 8, bgcolor: '#ffd700', borderRadius: '50%', boxShadow: '0 0 8px #ffd700' }} />
            <Typography variant="caption" sx={{ color: '#ffd700', fontWeight: 'bold', letterSpacing: 1 }}>
              LAB ENERGY: {currentEnergy} / {maxEnergy} EP
            </Typography>
          </Box>

          <LaboratorioMetersSection labData={labData} currentEnergy={currentEnergy} />
        </Box>
      </motion.div>

      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 8, lg: 9 }}>
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

        <Grid size={{ xs: 12, md: 4, lg: 3 }}>
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.4 }}>
            <LaboratorioNetworkSection labData={labData} currentEnergy={currentEnergy} onEnergyChange={setLocalEnergy} onRefetch={refetchLab} />
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
        slot={currentDetailIndex !== null ? (labData?.slots?.[currentDetailIndex] ?? null) : null}
        onUninstall={handleUninstall}
        onMaintenance={handleMaintenance}
        isMaintenanceLoading={isMaintenanceLoading}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity} variant="filled" sx={{ width: '100%', borderRadius: 2, boxShadow: '0 0 15px rgba(0,0,0,0.5)' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
