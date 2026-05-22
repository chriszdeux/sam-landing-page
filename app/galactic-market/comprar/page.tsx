"use client";

import { useState, useEffect, useRef } from "react";
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  Button, 
  CircularProgress,
  IconButton,
  Tooltip
} from "@mui/material";
import { 
  ArrowBack, 
  ShoppingCart, 
  ElectricBolt, 
  Nature, 
  Groups, 
  Science,
  InfoOutlined
} from "@mui/icons-material";
import { Snackbar, Alert } from "@mui/material";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import api, { hadesApi } from "../../../lib/api";
import { TechFrame } from "../../../components/ui/TechFrame";
import { StationToast } from "../../../components/core_modules/StationToast";

interface MarketListing {
  listingId: string;
  sellerId: string;
  moduleData: {
    type: string;
    currentLevel: number;
    stats: {
      radiationResistance: number;
      baseVitality: number;
    };
    shapeType?: string;
  };
  price: number;
  description?: string;
}

export default function ComprarModulosPage() {
  const [listings, setListings] = useState<MarketListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [buyingId, setBuyingId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const fetchListings = async () => {
      try {
        const res = await hadesApi.get('/market/listings');
        setListings(res.data.listings || []);
      } catch (error: any) {
        console.error("Error fetching listings:", error);
        setErrorMsg("Error de conexión con el mercado galáctico.");
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  const handleBuy = async (listingId: string) => {
    setBuyingId(listingId);
    try {
      // Phase 1: Purchase logic (Backend handles inventory creation)
      await hadesApi.post('/confirmBuyTransaction', { listingId });
      setErrorMsg(null);
      setToast({ 
        message: "Estructura Forjada con Éxito - Lista en Almacén", 
        type: 'success' 
      });
      setListings(prev => prev.filter(l => l.listingId !== listingId));
    } catch (error: any) {
      console.error("Error buying module:", error);
      setErrorMsg("No se pudo completar la compra. Revisa tu conexión o saldo.");
      setToast({ 
        message: "Fallo en la forja de estructura. Verifique recursos.", 
        type: 'error' 
      });
    } finally {
      setBuyingId(null);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'energy': return <ElectricBolt sx={{ fontSize: 30, color: '#FF2200' }} />;
      case 'bio': return <Nature sx={{ fontSize: 30, color: '#22FF44' }} />;
      case 'habitat': return <Groups sx={{ fontSize: 30, color: '#C0C0C0' }} />;
      case 'science': return <Science sx={{ fontSize: 30, color: '#0055FF' }} />;
      default: return <ShoppingCart sx={{ fontSize: 30, color: '#00f3ff' }} />;
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

  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', pt: 15, display: 'flex', justifyContent: 'center', bgcolor: '#05050c' }}>
        <CircularProgress sx={{ color: '#00f3ff' }} />
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', pt: 15, pb: 10, bgcolor: '#05050c' }}>
      <Container maxWidth="lg">
        <Box display="flex" alignItems="center" gap={2} mb={6}>
          <Link href="/galactic-market">
            <IconButton sx={{ color: 'white' }}>
              <ArrowBack />
            </IconButton>
          </Link>
          <Typography variant="h3" sx={{ color: 'white', fontWeight: 'bold' }}>
            GALACTIC <span style={{ color: '#00f3ff' }}>SHOP</span>
          </Typography>
        </Box>

        {listings.length === 0 ? (
          <Box textAlign="center" py={10}>
            <Typography variant="h5" sx={{ color: 'rgba(255,255,255,0.4)' }}>
              No hay módulos disponibles en el mercado actualmente.
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {listings.map((listing, index) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={listing.listingId}>
                <motion.div 
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <TechFrame color={getColor(listing.moduleData?.type || '')}>
                    <Box p={3}>
                      <Box display="flex" justifyContent="space-between" mb={2}>
                        {getIcon(listing.moduleData?.type || '')}
                        <Chip 
                          label={`${listing.price || 0} THAO`} 
                          sx={{ 
                            bgcolor: 'rgba(0,243,255,0.1)', 
                            color: '#00f3ff', 
                            fontWeight: 'bold',
                            border: '1px solid rgba(0,243,255,0.3)'
                          }} 
                        />
                      </Box>
                      
                      <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold', mb: 1 }}>
                        {(listing.moduleData?.type || 'unknown').toUpperCase()}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)', mb: 3, height: 60, overflow: 'hidden' }}>
                        {listing.description || `Módulo de tipo ${listing.moduleData?.type || 'estándar'} optimizado para sistemas CORE_MODULES-8.`}
                      </Typography>

                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Tooltip title="Integridad Base">
                          <Box display="flex" alignItems="center" gap={0.5}>
                             <InfoOutlined sx={{ fontSize: 14, color: 'rgba(255,255,255,0.4)' }} />
                             <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)' }}>
                               HP: {listing.moduleData?.stats?.baseVitality || 100}%
                             </Typography>
                          </Box>
                        </Tooltip>
                        
                        <Button
                          variant="contained"
                          size="small"
                          disabled={buyingId === listing.listingId}
                          onClick={() => handleBuy(listing.listingId)}
                          sx={{ 
                            bgcolor: getColor(listing.moduleData?.type || ''),
                            '&:hover': { bgcolor: getColor(listing.moduleData?.type || ''), filter: 'brightness(1.2)' }
                          }}
                        >
                          {buyingId === listing.listingId ? <CircularProgress size={20} color="inherit" /> : 'COMPRAR'}
                        </Button>
                      </Box>
                    </Box>
                  </TechFrame>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        )}

        <Snackbar 
          open={!!errorMsg} 
          autoHideDuration={6000} 
          onClose={() => setErrorMsg(null)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert onClose={() => setErrorMsg(null)} severity="error" variant="filled" sx={{ width: '100%' }}>
            {errorMsg}
          </Alert>
        </Snackbar>

        <AnimatePresence>
          {toast && (
            <StationToast 
              message={toast.message} 
              type={toast.type} 
              onClose={() => setToast(null)} 
            />
          )}
        </AnimatePresence>
      </Container>
    </Box>
  );
}

// Internal Chip mock since MUI primary Chip might look too generic here
function Chip({ label, sx }: { label: string, sx: any }) {
  return (
    <Box sx={{ 
      px: 1.5, py: 0.5, 
      borderRadius: 1, 
      fontSize: '0.75rem', 
      ...sx 
    }}>
      {label}
    </Box>
  );
}
