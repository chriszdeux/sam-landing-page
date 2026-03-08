import React from "react";
import { Box, Typography, Button, IconButton, Paper, Stack, Drawer, Divider, LinearProgress, Grid, CircularProgress } from "@mui/material";
import { Close, Settings, DeleteForever, Speed, Thermostat, Timer } from "@mui/icons-material";
import { SlotMachine } from "./LaboratorioMetersSection";

interface LaboratorioHardwareDetailDrawerProps {
  open: boolean;
  onClose: () => void;
  slot: SlotMachine | null;
  onUninstall: () => void;
  onMaintenance: () => void;
  isMaintenanceLoading?: boolean;
}

export function LaboratorioHardwareDetailDrawer({ open, onClose, slot, onUninstall, onMaintenance, isMaintenanceLoading }: LaboratorioHardwareDetailDrawerProps) {
  if (!slot) return null;

  const lifePercent = slot.currentLife && slot.lifeLimit ? (slot.currentLife / slot.lifeLimit) * 100 : 0;
  const color = slot.color || "#00f3ff";

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: { 
          width: { xs: '100%', sm: 400 }, 
          bgcolor: 'rgba(10, 12, 16, 0.95)', 
          backdropFilter: 'blur(15px)',
          borderLeft: `1px solid ${color}`,
          color: '#fff'
        }
      }}
    >
      <Box sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5" fontWeight="bold" sx={{ color: color, textTransform: 'uppercase', letterSpacing: 1 }}>
          Hardware Detalle
        </Typography>
        <IconButton onClick={onClose} sx={{ color: 'text.secondary', '&:hover': { color: '#ff0055' } }}>
          <Close />
        </IconButton>
      </Box>
      <Divider sx={{ borderColor: `${color}30` }} />
      
      <Box sx={{ p: 3, flex: 1, overflowY: 'auto' }}>
        <Typography variant="h4" fontWeight="bold" sx={{ mb: 1 }}>{slot.name}</Typography>
        <Typography variant="body1" sx={{ color: color, fontWeight: 700, mb: 4 }}>
          {slot.performance}
        </Typography>

        <Stack spacing={4}>
          {/* Vida Util */}
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'rgba(255,255,255,0.7)' }}>
                <Timer sx={{ fontSize: 18 }} /> Vida Útil
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 'bold' }}>{Math.round(lifePercent)}%</Typography>
            </Box>
            <LinearProgress 
              variant="determinate" 
              value={lifePercent} 
              sx={{ 
                height: 8, 
                borderRadius: 4, 
                bgcolor: 'rgba(255,255,255,0.1)',
                '& .MuiLinearProgress-bar': { bgcolor: lifePercent < 20 ? '#ff0055' : color }
              }} 
            />
          </Box>

          {/* Efficiency & Temp */}
          <Grid container spacing={2}>
            <Grid size={{ xs: 6 }}>
              <Paper sx={{ p: 2, bgcolor: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', textAlign: 'center' }}>
                <Typography variant="caption" display="block" sx={{ color: 'rgba(255,255,255,0.5)', mb: 1 }}>
                  <Speed sx={{ fontSize: 16, verticalAlign: 'middle', mr: 0.5 }} /> EFICIENCIA
                </Typography>
                <Typography variant="h6" sx={{ color: '#00e676' }}>{slot.efficiency || 0}%</Typography>
              </Paper>
            </Grid>
            <Grid size={{ xs: 6 }}>
              <Paper sx={{ p: 2, bgcolor: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', textAlign: 'center' }}>
                <Typography variant="caption" display="block" sx={{ color: 'rgba(255,255,255,0.5)', mb: 1 }}>
                  <Thermostat sx={{ fontSize: 16, verticalAlign: 'middle', mr: 0.5 }} /> CALOR
                </Typography>
                <Typography variant="h6" sx={{ color: (slot.temperature || 0) > 75 ? '#ff0055' : '#ffaa00' }}>
                  {slot.temperature || 0}°C
                </Typography>
              </Paper>
            </Grid>
          </Grid>

          <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', my: 2 }} />

          {/* Actions */}
          <Stack spacing={2}>
            <Button 
              fullWidth 
              variant="contained" 
              startIcon={isMaintenanceLoading ? <CircularProgress size={20} sx={{ color: '#fff' }} /> : <Settings />}
              onClick={() => onMaintenance()}
              disabled={isMaintenanceLoading}
              sx={{ 
                bgcolor: 'rgba(255,255,255,0.05)', 
                color: '#fff',
                py: 1.5,
                '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' },
                '&.Mui-disabled': { bgcolor: 'rgba(255,255,255,0.02)', color: 'rgba(255,255,255,0.2)' }
              }}
            >
              {isMaintenanceLoading ? "Procesando..." : "Mantenimiento"}
            </Button>
            <Button 
              fullWidth 
              variant="outlined" 
              color="error"
              startIcon={<DeleteForever />}
              onClick={() => onUninstall()}
              sx={{ py: 1.5, border: '1px solid #ff0055', color: '#ff0055', '&:hover': { bgcolor: 'rgba(255,0,85,0.1)', border: '1px solid #ff0055' } }}
            >
              Desinstalar
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Drawer>
  );
}
