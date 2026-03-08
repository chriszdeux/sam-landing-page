import React from "react";
import { Box, Typography, Button, IconButton, Paper, Stack, Drawer, Divider } from "@mui/material";
import { Close, ShoppingCartCheckout, LocalOffer, PowerSettingsNew } from "@mui/icons-material";

export const HARDWARE_CATALOG = [
  { hw_id: "hw-1", name: "Antminer S19 Pro", performance: "110 TH/s", energy: "3250W", price: "1500 USDT", color: "#00f3ff" },
  { hw_id: "hw-2", name: "Whatsminer M30s", performance: "88 TH/s", energy: "3344W", price: "1200 USDT", color: "#ff0055" },
  { hw_id: "hw-3", name: "Goldshell KD5", performance: "18 TH/s", energy: "2250W", price: "2000 USDT", color: "#b000ff" },
  { hw_id: "hw-4", name: "Avalon A1246", performance: "90 TH/s", energy: "3420W", price: "1150 USDT", color: "#ffaa00" },
];

interface LaboratorioMarketDrawerProps {
  open: boolean;
  onClose: () => void;
  buyingSlotIndex: number | null;
  onBuy: (hw: typeof HARDWARE_CATALOG[0]) => void;
}

export function LaboratorioMarketDrawer({ open, onClose, buyingSlotIndex, onBuy }: LaboratorioMarketDrawerProps) {
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
          borderLeft: '1px solid #00f3ff',
          color: '#fff'
        }
      }}
    >
      <Box sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5" fontWeight="bold" sx={{ color: '#00f3ff', textTransform: 'uppercase', letterSpacing: 1 }}>
          Hardware Market
        </Typography>
        <IconButton onClick={onClose} sx={{ color: 'text.secondary', '&:hover': { color: '#ff0055' } }}>
          <Close />
        </IconButton>
      </Box>
      <Divider sx={{ borderColor: 'rgba(0, 243, 255, 0.2)' }} />
      
      <Box sx={{ p: 3, overflowY: 'auto', flex: 1 }}>
        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)', mb: 3 }}>
          Selecciona una máquina minera para asignar al Slot {buyingSlotIndex !== null ? buyingSlotIndex + 1 : ''}.
        </Typography>

        <Stack spacing={3}>
          {HARDWARE_CATALOG.map((hw) => (
            <Paper 
              key={hw.hw_id} 
              sx={{ 
                p: 2, 
                bgcolor: 'rgba(0,0,0,0.6)', 
                border: `1px solid ${hw.color}50`, 
                borderRadius: 3,
                position: 'relative',
                overflow: 'hidden',
                transition: 'all 0.3s',
                '&:hover': {
                  borderColor: hw.color,
                  boxShadow: `0 0 15px ${hw.color}40`,
                  transform: 'translateY(-2px)'
                }
              }}
            >
              <Box sx={{ position: 'absolute', top: 0, left: 0, width: 4, height: '100%', bgcolor: hw.color }} />
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Box>
                  <Typography variant="h6" fontWeight="bold">{hw.name}</Typography>
                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <PowerSettingsNew sx={{ fontSize: 14 }} /> Consumo: {hw.energy}
                  </Typography>
                </Box>
                <Typography variant="h6" fontWeight="bold" sx={{ color: hw.color }}>
                  {hw.performance}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                <Typography variant="body1" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LocalOffer sx={{ fontSize: 16, color: 'text.secondary' }} /> {hw.price}
                </Typography>
                <Button 
                  variant="contained" 
                  onClick={() => onBuy(hw)}
                  sx={{ 
                    bgcolor: `${hw.color}20`, 
                    color: hw.color,
                    border: `1px solid ${hw.color}`,
                    '&:hover': { bgcolor: hw.color, color: '#000', boxShadow: `0 0 10px ${hw.color}` }
                  }}
                  startIcon={<ShoppingCartCheckout />}
                >
                  Instalar
                </Button>
              </Box>
            </Paper>
          ))}
        </Stack>
      </Box>
    </Drawer>
  );
}
