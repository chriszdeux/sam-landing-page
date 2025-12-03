'use client';

import React, { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Box, Container, Typography, Grid, Stack, Chip, CircularProgress, Alert } from '@mui/material';
import { motion } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '../../../lib/hooks';
import { fetchAssetDetails } from '../../../lib/features/economySlice';
import { BuySellForms } from '../../../components/economy/BuySellForms';
import { TrendingUp, TrendingDown, Activity, DollarSign, Globe } from 'lucide-react';

export default function AssetDetailPage() {
  const params = useParams();
  const dispatch = useAppDispatch();
  const { selectedAsset, loading, error } = useAppSelector((state) => state.economy);
  const id = params.id as string;

  useEffect(() => {
    if (id) {
      dispatch(fetchAssetDetails(id));
    }
  }, [dispatch, id]);

  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress color="secondary" />
      </Box>
    );
  }

  if (error || !selectedAsset) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Alert severity="error">{error || 'Asset not found'}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', pt: 16, pb: 8 }}>
      <Container maxWidth="xl">
        <Grid container spacing={4}>
          {/* Header & Chart Section */}
          <Grid size={{ xs: 12, md: 8 }}>
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 4 }}>
                {/* Dynamic Icon */}
                <Box
                  component="img"
                  src={selectedAsset?.identification?.image256}
                  alt={selectedAsset?.identification?.name}
                  sx={{ width: 64, height: 64, borderRadius: '50%' }}
                />
                <Typography variant="h2" fontWeight="bold" sx={{ color: 'white' }}>
                  {selectedAsset?.identification?.name}
                </Typography>
                <Chip label={selectedAsset?.identification?.symbol} color="primary" variant="outlined" />
              </Stack>

              <Stack direction="row" alignItems="baseline" spacing={2} sx={{ mb: 6 }}>
                <Typography variant="h3" fontWeight="bold" sx={{ color: 'white' }}>
                  ${selectedAsset?.financial?.price?.toFixed(4)}
                </Typography>
                <Stack direction="row" alignItems="center" spacing={0.5}
                  sx={{ color: (selectedAsset?.financial?.change24h || 0) >= 0 ? '#00ff88' : '#ff0055' }}
                >
                  {(selectedAsset?.financial?.change24h || 0) >= 0 ? <TrendingUp size={24} /> : <TrendingDown size={24} />}
                  <Typography variant="h5" fontWeight="bold">
                    {Math.abs(selectedAsset?.financial?.change24h || 0)}% (24h)
                  </Typography>
                </Stack>
              </Stack>

              {/* Chart Placeholder */}
              <Box sx={{
                height: 400,
                bgcolor: 'rgba(255,255,255,0.03)',
                borderRadius: 4,
                border: '1px solid rgba(255,255,255,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 4
              }}>
                <Typography color="text.secondary">Chart Visualization Placeholder</Typography>
              </Box>

              {/* Description */}
              <Typography variant="body1" sx={{ color: 'text.secondary', fontSize: '1.1rem', lineHeight: 1.8 }}>
                {selectedAsset?.additionalInfo?.description || `Detailed market analysis and historical data for ${selectedAsset?.identification?.name}. This asset is a key component of the SAM economy.`}
              </Typography>
            </motion.div>
          </Grid>

          {/* Sidebar: Stats & Trade */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Stack spacing={4}>
              {/* Trading Form */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <BuySellForms
                  assetId={selectedAsset?.id || ''}
                  assetSymbol={selectedAsset?.identification?.symbol || ''}
                  currentPrice={selectedAsset?.financial?.price || 0}
                />
              </motion.div>

              {/* Market Stats */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Box sx={{ p: 3, bgcolor: 'rgba(255,255,255,0.03)', borderRadius: 4, border: '1px solid rgba(255,255,255,0.1)' }}>
                  <Typography variant="h6" sx={{ color: 'white', mb: 3 }}>Estadísticas de Mercado</Typography>
                  <Stack spacing={2}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography color="text.secondary">Market Cap</Typography>
                      <Typography color="white" fontWeight="bold">{selectedAsset?.financial?.marketCap || 'N/A'}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography color="text.secondary">Volumen (24h)</Typography>
                      <Typography color="white" fontWeight="bold">{selectedAsset?.financial?.volume || 'N/A'}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography color="text.secondary">Suministro Circulante</Typography>
                      <Typography color="white" fontWeight="bold">
                        {selectedAsset?.financial?.supply ? `${selectedAsset.financial.supply} ${selectedAsset.identification.symbol}` : 'N/A'}
                      </Typography>
                    </Box>
                  </Stack>
                </Box>
              </motion.div>
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
