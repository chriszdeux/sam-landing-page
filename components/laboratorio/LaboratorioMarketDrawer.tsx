import React, { useEffect, useState } from "react";
import { Box, Typography, Button, IconButton, Paper, Stack, Drawer, Divider, CircularProgress } from "@mui/material";
import { Close, ShoppingCartCheckout, LocalOffer, PowerSettingsNew } from "@mui/icons-material";
import api from "../../lib/api";

export interface HardwareItem {
  id: string;
  name: string;
  description: string;
  hashRate: number;
  energyConsumption: number;
  priceTokens: number;
  priceUSD: number;
  stock: number;
  type: string;
}

interface LaboratorioMarketDrawerProps {
  open: boolean;
  onClose: () => void;
  buyingSlotIndex: number | null;
  onBuy: (hw: HardwareItem) => void;
}

const TYPE_COLORS: Record<string, string> = {
  ASIC: "#00f3ff",
  GPU: "#b000ff",
  FPGA: "#ff0055",
  CPU: "#ffaa00",
  DEFAULT: "#00e676"
};

export function LaboratorioMarketDrawer({ open, onClose, buyingSlotIndex, onBuy }: LaboratorioMarketDrawerProps) {
  const [catalog, setCatalog] = useState<HardwareItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    if (open && catalog.length === 0) {
      const fetchData = async () => {
        setLoading(true);
        try {
          const res = await api.get("/hardware");
          if (isMounted) setCatalog(res.data.catalog || []);
        } catch (err) {
          console.error("Error fetching hardware catalog", err);
        } finally {
          if (isMounted) setLoading(false);
        }
      };
      fetchData();
    }
    return () => { isMounted = false; };
  }, [open, catalog.length]);

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

        {loading ? (
          <Box display="flex" justifyContent="center" mt={4}>
            <CircularProgress sx={{ color: '#00f3ff' }} />
          </Box>
        ) : (
          <Stack spacing={3}>
            {catalog.map((hw) => {
              const color = TYPE_COLORS[hw.type] || TYPE_COLORS.DEFAULT;
              return (
                <Paper 
                  key={hw.id} 
                  sx={{ 
                    p: 2, 
                    bgcolor: 'rgba(0,0,0,0.6)', 
                    border: `1px solid ${color}50`, 
                    borderRadius: 3,
                    position: 'relative',
                    overflow: 'hidden',
                    transition: 'all 0.3s',
                    '&:hover': {
                      borderColor: color,
                      boxShadow: `0 0 15px ${color}40`,
                      transform: 'translateY(-2px)'
                    }
                  }}
                >
                  <Box sx={{ position: 'absolute', top: 0, left: 0, width: 4, height: '100%', bgcolor: color }} />
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                    <Box>
                      <Typography variant="h6" fontWeight="bold">{hw.name}</Typography>
                      <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', display: 'block', mb: 1 }}>
                        {hw.description}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <PowerSettingsNew sx={{ fontSize: 14 }} /> Consumo: {hw.energyConsumption}W
                      </Typography>
                    </Box>
                    <Typography variant="h6" fontWeight="bold" sx={{ color: color, whiteSpace: 'nowrap', ml: 1 }}>
                      {hw.hashRate} TH/s
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                    <Typography variant="body1" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
                      <LocalOffer sx={{ fontSize: 16, color: 'text.secondary' }} /> {hw.priceTokens} USDT
                    </Typography>
                    <Button 
                      variant="contained" 
                      onClick={() => onBuy(hw)}
                      disabled={hw.stock <= 0}
                      sx={{ 
                        bgcolor: `${color}20`, 
                        color: color,
                        border: `1px solid ${color}`,
                        '&:hover': { bgcolor: color, color: '#000', boxShadow: `0 0 10px ${color}` },
                        '&.Mui-disabled': { borderColor: 'rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.2)' }
                      }}
                      startIcon={<ShoppingCartCheckout />}
                    >
                      {hw.stock > 0 ? "Instalar" : "Agotado"}
                    </Button>
                  </Box>
                </Paper>
              );
            })}
          </Stack>
        )}
      </Box>
    </Drawer>
  );
}
