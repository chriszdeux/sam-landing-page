import React, { useEffect, useState } from "react";
import { X, ShoppingCart, Tag, Power } from "lucide-react";
import { Drawer } from "../ui/Drawer";
import { Typography } from "../ui/Typography";
import { Button } from "../ui/Button";
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

function HardwareCard({ hw, onBuy }: { hw: HardwareItem; onBuy: (hw: HardwareItem) => void }) {
  const color = TYPE_COLORS[hw.type] || TYPE_COLORS.DEFAULT;
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative overflow-hidden rounded-xl bg-black/60 p-4 transition-all duration-300"
      style={{
        border: `1px solid ${hovered ? color : `${color}50`}`,
        boxShadow: hovered ? `0 0 15px ${color}40` : 'none',
        transform: hovered ? 'translateY(-2px)' : 'none',
      }}
    >
      <div className="absolute left-0 top-0 h-full w-1" style={{ backgroundColor: color }} />

      <div className="mb-1 flex items-start justify-between">
        <div>
          <Typography variant="h6" className="font-bold">{hw.name}</Typography>
          <Typography variant="caption" className="mb-1 block text-white/50">
            {hw.description}
          </Typography>
          <Typography variant="caption" className="flex items-center gap-1 text-white/80">
            <Power size={14} /> Consumo: {hw.energyConsumption}W
          </Typography>
        </div>
        <Typography variant="h6" className="ml-1 whitespace-nowrap font-bold" style={{ color }}>
          {hw.hashRate} TH/s
        </Typography>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <Typography variant="body1" className="flex items-center gap-1 font-bold">
          <Tag size={16} className="text-foreground-muted" /> {hw.priceUSD.toLocaleString()} CR
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
          startIcon={<ShoppingCart />}
        >
          {hw.stock > 0 ? "Instalar" : "Agotado"}
        </Button>
      </div>
    </div>
  );
}

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
      open={open}
      onClose={onClose}
      side="right"
      className="w-full border-l border-[#00f3ff] bg-[rgba(10,12,16,0.95)] text-white backdrop-blur-lg sm:w-[400px]"
    >
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between p-6">
          <Typography variant="h5" className="font-bold uppercase tracking-wide text-[#00f3ff]">
            Hardware Market
          </Typography>
          <button onClick={onClose} className="text-foreground-muted transition-colors hover:text-[#ff0055]">
            <X size={20} />
          </button>
        </div>
        <hr className="border-t border-[#00f3ff]/20" />

        <div className="flex-1 overflow-y-auto p-6">
          <Typography variant="body2" className="mb-6 text-white/60">
            Selecciona una máquina minera para asignar al Slot {buyingSlotIndex !== null ? buyingSlotIndex + 1 : ''}.
          </Typography>

          {loading ? (
            <div className="mt-8 flex justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#00f3ff]/20 border-t-[#00f3ff]" />
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {catalog.map((hw) => (
                <HardwareCard key={hw.id} hw={hw} onBuy={onBuy} />
              ))}
            </div>
          )}
        </div>
      </div>
    </Drawer>
  );
}
