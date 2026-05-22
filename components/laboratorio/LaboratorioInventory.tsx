import { useState, useEffect } from "react";
import { 
  Box, 
  Typography, 
  Button, 
  Paper, 
  Grid, 
  Card, 
  CardContent, 
  Chip, 
  CircularProgress,
  IconButton,
  Snackbar,
  Alert
} from "@mui/material";
import { 
  PrecisionManufacturing, 
  Inventory, 
  Delete,
  Add
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { StationModule } from "../../lib/types/core_modules";
import api, { hadesApi } from "../../lib/api";

export function LaboratorioInventory() {
  const [inventory, setInventory] = useState<StationModule[]>([]);
  const [loading, setLoading] = useState(true);
  const [forging, setForging] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchInventory = async () => {
    try {
      const res = await hadesApi.get('/user/inventory');
      setInventory(res.data.inventory || []);
    } catch (error) {
      console.error("Error fetching inventory:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
    
    const token = window.addEventListener('core_modules-inventory-refresh', fetchInventory);
    return () => window.removeEventListener('core_modules-inventory-refresh', fetchInventory);
  }, []);

  const handleForge = async () => {
    setForging(true);
    try {
      const types = ["energy", "science", "bio", "habitat"];
      const randomType = types[Math.floor(Math.random() * types.length)];
      
      const res = await hadesApi.post('/modules', {
        moduleType: randomType,
        shapeType: randomType === "energy" ? "square" : randomType === "science" ? "triangle" : randomType === "bio" ? "circle" : "rectangle"
      });
      
      if (res.data.module) {
        setInventory(prev => [...prev, res.data.module]);
      }
    } catch (error) {
      console.error("Error forging module:", error);
    } finally {
      setForging(false);
    }
  };

  const handleDelete = async (moduleId: string) => {
    setDeletingId(moduleId);
    try {
      await hadesApi.delete(`/modules/${moduleId}`);
      setInventory(prev => prev.filter(m => m.moduleId !== moduleId));
    } catch (error: any) {
      console.error("Error deleting module:", error);
      const message = error.response?.data?.message || "Error al eliminar el módulo. Puede que esté anclado.";
      setErrorMsg(message);
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress sx={{ color: '#00f3ff' }} />
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box display="flex" alignItems="center" gap={1}>
          <Inventory sx={{ color: '#00f3ff' }} />
          <Typography variant="h5" sx={{ color: 'white', fontWeight: 'bold' }}>
            ALMACÉN DE ESTRUCTURAS
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={forging ? <CircularProgress size={20} color="inherit" /> : <PrecisionManufacturing />}
          onClick={handleForge}
          disabled={forging}
          sx={{
            bgcolor: '#00f3ff',
            color: '#0a0c10',
            fontWeight: 'bold',
            '&:hover': { bgcolor: '#00d8e4' }
          }}
        >
          {forging ? 'FORJANDO...' : 'FORJAR ESTRUCTURA'}
        </Button>
      </Box>

      {inventory.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center', bgcolor: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(0,243,255,0.2)' }}>
          <Typography sx={{ color: 'rgba(255,255,255,0.5)' }}>
            No hay estructuras en el almacén. Utiliza la forja para crear una o adquiere módulos en el Mercado Galáctico.
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={2}>
          {inventory.map((mod) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={mod.moduleId}>
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <Card sx={{ 
                  bgcolor: 'rgba(10,12,16,0.8)', 
                  border: '1px solid rgba(0,243,255,0.2)',
                  position: 'relative',
                  '&:hover': { border: '1px solid #00f3ff' }
                }}>
                  <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                      <Box>
                        <Typography variant="overline" sx={{ color: '#00f3ff', fontWeight: 'bold' }}>
                          {mod.moduleType.toUpperCase()}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'white', fontFamily: 'monospace' }}>
                          ID: {mod.moduleId.slice(0, 8)}
                        </Typography>
                      </Box>
                      <IconButton 
                        size="small" 
                        disabled={deletingId === mod.moduleId}
                        onClick={() => handleDelete(mod.moduleId)}
                        sx={{ color: 'rgba(255,255,255,0.3)', '&:hover': { color: '#ff3366' } }}
                      >
                        {deletingId === mod.moduleId ? <CircularProgress size={16} color="inherit" /> : <Delete fontSize="small" />}
                      </IconButton>
                    </Box>
                    <Box mt={2} display="flex" gap={1}>
                      <Chip 
                        label={`HP: ${mod.baseVitality}`} 
                        size="small" 
                        sx={{ bgcolor: 'rgba(0,243,255,0.1)', color: '#00f3ff', border: '1px solid rgba(0,243,255,0.2)' }} 
                      />
                      <Chip 
                        label={mod.shapeType || 'Standard'} 
                        size="small" 
                        sx={{ bgcolor: 'rgba(255,255,255,0.05)', color: 'white' }} 
                      />
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      )}

      <Snackbar open={!!errorMsg} autoHideDuration={6000} onClose={() => setErrorMsg(null)}>
        <Alert onClose={() => setErrorMsg(null)} severity="error" variant="filled" sx={{ width: '100%' }}>
          {errorMsg}
        </Alert>
      </Snackbar>
    </Box>
  );
}
