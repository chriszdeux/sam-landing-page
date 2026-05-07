"use client";

import React from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText, 
  Typography, 
  Box,
  Divider,
  CircularProgress
} from '@mui/material';
import { 
  ElectricBolt, 
  Nature, 
  Groups, 
  Science, 
  AddCircleOutline 
} from '@mui/icons-material';
import { StationModule } from '../../lib/types/core_modules';
import api from '../../lib/api';

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
      api.get('modules-v1/user/inventory')
        .then(res => setInventory(res.data.inventory || []))
        .catch(err => console.error("Error fetching inventory for modal:", err))
        .finally(() => setLoading(false));
    }
  }, [open]);

  const getIcon = (type: string) => {
    switch (type) {
      case 'energy': return <ElectricBolt sx={{ color: '#FF2200' }} />;
      case 'bio': return <Nature sx={{ color: '#22FF44' }} />;
      case 'habitat': return <Groups sx={{ color: '#C0C0C0' }} />;
      case 'science': return <Science sx={{ color: '#0055FF' }} />;
      default: return <Science sx={{ color: '#00f3ff' }} />;
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
      PaperProps={{
        sx: {
          bgcolor: 'rgba(10, 15, 25, 0.95)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(0, 243, 255, 0.3)',
          borderRadius: 4,
          color: 'white',
          minWidth: '400px'
        }
      }}
    >
      <DialogTitle component="div" sx={{ display: 'flex', alignItems: 'center', gap: 1, pb: 1 }}>
        <AddCircleOutline sx={{ color: '#00f3ff' }} />
        <Typography variant="h6" sx={{ fontWeight: 'bold', letterSpacing: 1 }}>
          ANCLAR ESTRUCTURA
        </Typography>
      </DialogTitle>
      
      {coordinate && (
        <Typography variant="caption" sx={{ px: 3, color: 'rgba(255,255,255,0.5)', display: 'block', mb: 1 }}>
          COORDENADAS SELECCIONADAS: [ {coordinate.x}, {coordinate.y} ]
        </Typography>
      )}
      
      <Divider sx={{ bgcolor: 'rgba(0, 243, 255, 0.1)', mb: 1 }} />
      
      <DialogContent sx={{ pt: 1, minHeight: 200 }}>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" height={150}>
            <CircularProgress sx={{ color: '#00f3ff' }} />
          </Box>
        ) : inventory.length === 0 ? (
          <Box p={4} textAlign="center">
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.4)' }}>
              No tienes estructuras disponibles en tu almacén.
            </Typography>
          </Box>
        ) : (
          <List sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {inventory.map((mod) => (
              <ListItem key={mod.moduleId} disablePadding>
                <ListItemButton 
                  onClick={() => {
                    onSelect(mod);
                    onClose();
                  }}
                  sx={{
                    borderRadius: 2,
                    border: '1px solid rgba(255,255,255,0.05)',
                    '&:hover': {
                      bgcolor: 'rgba(255,255,255,0.05)',
                      borderColor: getColor(mod.moduleType),
                      boxShadow: `0 0 10px ${getColor(mod.moduleType)}44`
                    }
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 45 }}>
                    {getIcon(mod.moduleType)}
                  </ListItemIcon>
                  <ListItemText 
                    primary={<Typography sx={{ fontWeight: 'bold', color: getColor(mod.moduleType) }}>{mod.moduleType.toUpperCase()}</Typography>}
                    secondary={<Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>ID: {mod.moduleId.slice(0, 8)} | HP: {mod.baseVitality}%</Typography>}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        )}
      </DialogContent>
    </Dialog>
  );
};
