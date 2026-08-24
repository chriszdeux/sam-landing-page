"use client";

import React from 'react';
import { Zap, Leaf, Users, FlaskConical, PlusCircle } from 'lucide-react';
import { Dialog } from '../ui/Dialog';
import { Typography } from '../ui/Typography';
import { StationModule } from '../../lib/types/core_modules';
import api, { hadesApi } from '../../lib/api';

interface ModuleModuleModuleAnchorModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: (module: StationModule) => void;
  coordinate?: { x: number, y: number };
}

export const ModuleModuleModuleAnchorModal: React.FC<ModuleModuleModuleAnchorModalProps> = ({ open, onClose, onSelect, coordinate }) => {
  const [inventory, setInventory] = React.useState<StationModule[]>([]);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (open) {
      setLoading(true);
      hadesApi.get('/user/inventory')
        .then(res => setInventory(res.data.inventory || []))
        .catch(err => console.error("Error fetching inventory for modal:", err))
        .finally(() => setLoading(false));
    }
  }, [open]);

  const getIcon = (type: string) => {
    switch (type) {
      case 'energy': return <Zap style={{ color: '#FF2200' }} />;
      case 'bio': return <Leaf style={{ color: '#22FF44' }} />;
      case 'habitat': return <Users style={{ color: '#C0C0C0' }} />;
      case 'science': return <FlaskConical style={{ color: '#0055FF' }} />;
      default: return <FlaskConical style={{ color: '#00f3ff' }} />;
    }
  };

  const getColor = (type: string) => {
    switch (type) {
      case 'energy': return '#FF2200';
      case 'bio': return '#22FF44';
      case 'habitat': return '#C0C0C0';
      case 'science': return '#0055FF';
      default: return '#00f3ff';
    }
  };
  return (
    <Dialog
      open={open}
      onClose={onClose}
      className="min-w-[400px] rounded-2xl border border-[#00f3ff]/30 bg-[rgba(10,15,25,0.95)] text-white backdrop-blur-xl"
    >
      <div className="flex items-center gap-2 px-6 pb-1 pt-6">
        <PlusCircle className="text-[#00f3ff]" />
        <Typography variant="h6" className="font-bold tracking-wide">
          ANCLAR ESTRUCTURA
        </Typography>
      </div>

      {coordinate && (
        <Typography variant="caption" component="span" className="mb-1 block px-6 text-white/50">
          COORDENADAS SELECCIONADAS: [ {coordinate.x}, {coordinate.y} ]
        </Typography>
      )}

      <hr className="mb-1 border-t border-[#00f3ff]/10" />

      <div className="min-h-[200px] px-6 pb-6 pt-1">
        {loading ? (
          <div className="flex h-[150px] items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#00f3ff]/20 border-t-[#00f3ff]" />
          </div>
        ) : inventory.length === 0 ? (
          <div className="p-8 text-center">
            <Typography variant="body2" className="text-white/40">
              No tienes estructuras disponibles en tu almacén.
            </Typography>
          </div>
        ) : (
          <ul className="flex flex-col gap-2">
            {inventory.map((mod) => {
              const color = getColor(mod.moduleType);
              return (
                <li key={mod.moduleId}>
                  <button
                    onClick={() => {
                      onSelect(mod);
                      onClose();
                    }}
                    className="group flex w-full items-center gap-3 rounded-lg border border-white/5 p-2 text-left transition-all hover:bg-white/5"
                    style={{ '--hover-color': color } as React.CSSProperties}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = color;
                      e.currentTarget.style.boxShadow = `0 0 10px ${color}44`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '';
                      e.currentTarget.style.boxShadow = '';
                    }}
                  >
                    <span className="flex min-w-[45px] items-center justify-center">
                      {getIcon(mod.moduleType)}
                    </span>
                    <div>
                      <Typography component="p" className="font-bold" style={{ color }}>{mod.moduleType.toUpperCase()}</Typography>
                      <Typography variant="caption" component="p" className="text-white/60">ID: {mod.moduleId.slice(0, 8)} | HP: {mod.baseVitality}%</Typography>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </Dialog>
  );
};
