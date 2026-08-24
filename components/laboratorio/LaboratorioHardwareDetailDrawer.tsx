import React from "react";
import { X, Settings, Trash2, Gauge, Thermometer, Timer } from "lucide-react";
import { Drawer } from "../ui/Drawer";
import { Typography } from "../ui/Typography";
import { Button } from "../ui/Button";
import { SlotMachine } from "./LaboratorioMetersSection";
import { getCBUnit, getCBDivisor } from "../../lib/constants/blockchainFrequencies";

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

  const lifePercent = slot.currentUsage !== undefined && slot.lifeLimit ? (1 - slot.currentUsage / slot.lifeLimit) * 100 : 100;
  const anySlot = slot as any;
  const color = anySlot.color || "#00f3ff";
  const performance = anySlot.performance || (slot.hashRate ? `${(slot.hashRate / getCBDivisor(slot.hashRate)).toFixed(1)} ${getCBUnit(slot.hashRate)}` : '0.0 Mcb');
  const efficiency = anySlot.efficiency !== undefined ? anySlot.efficiency : Math.round(lifePercent);

  return (
    <Drawer
      open={open}
      onClose={onClose}
      side="right"
      className="w-full bg-[rgba(10,12,16,0.95)] text-white backdrop-blur-lg sm:w-[400px]"
    >
      <div style={{ borderLeft: `1px solid ${color}` }} className="flex h-full flex-col">
        <div className="flex items-center justify-between p-6">
          <Typography variant="h5" className="font-bold uppercase tracking-wide" style={{ color }}>
            Hardware Detalle
          </Typography>
          <button onClick={onClose} className="text-foreground-muted transition-colors hover:text-[#ff0055]">
            <X size={20} />
          </button>
        </div>
        <hr className="border-t" style={{ borderColor: `${color}30` }} />

        <div className="flex-1 overflow-y-auto p-6">
          <Typography variant="h4" className="mb-1 font-bold">{slot.name}</Typography>
          <Typography variant="body1" className="mb-8 font-bold" style={{ color }}>
            {performance}
          </Typography>

          <div className="flex flex-col gap-8">
            {/* Vida Util */}
            <div>
              <div className="mb-1 flex justify-between">
                <Typography variant="body2" className="flex items-center gap-1 text-white/70">
                  <Timer size={18} /> Vida Útil
                </Typography>
                <Typography variant="body2" className="font-bold">{Math.round(lifePercent)}%</Typography>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${lifePercent}%`, backgroundColor: lifePercent < 20 ? '#ff0055' : color }}
                />
              </div>
            </div>

            {/* Efficiency & Temp */}
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-paper border border-white/10 bg-black/30 p-4 text-center">
                <Typography variant="caption" component="span" className="mb-1 block text-white/50">
                  <Gauge size={16} className="mr-1 inline-block align-middle" /> EFICIENCIA
                </Typography>
                <Typography variant="h6" className="text-[#00e676]">{efficiency}%</Typography>
              </div>
              <div className="rounded-paper border border-white/10 bg-black/30 p-4 text-center">
                <Typography variant="caption" component="span" className="mb-1 block text-white/50">
                  <Thermometer size={16} className="mr-1 inline-block align-middle" /> CALOR
                </Typography>
                <Typography variant="h6" style={{ color: (slot.temperature || 0) > 75 ? '#ff0055' : '#ffaa00' }}>
                  {slot.temperature || 0}°C
                </Typography>
              </div>
            </div>

            <hr className="my-2 border-t border-white/10" />

            {/* Actions */}
            <div className="flex flex-col gap-4">
              <Button
                fullWidth
                variant="contained"
                startIcon={isMaintenanceLoading ? <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/20 border-t-white" /> : <Settings />}
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
                startIcon={<Trash2 />}
                onClick={() => onUninstall()}
                sx={{ py: 1.5, border: '1px solid #ff0055', color: '#ff0055', '&:hover': { bgcolor: 'rgba(255,0,85,0.1)', border: '1px solid #ff0055' } }}
              >
                Desinstalar
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Drawer>
  );
}
