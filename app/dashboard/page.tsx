'use client';

import React, { useEffect } from 'react';
import { Box, Container, Grid, Typography, CircularProgress } from '@mui/material';
import { motion } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '../../lib/hooks';
import { fetchLabData } from '../../lib/features/labs/actions';
import { FinancialPanel } from '../../components/dashboard/FinancialPanel';
import { LabMetersPanel } from '../../components/dashboard/LabMetersPanel';
import { ControlRewardsPanel } from '../../components/dashboard/ControlRewardsPanel';
import { Background } from '../../components/layout/Background';
import { RootState } from '../../lib/store';

export default function DashboardPage() {
    const dispatch = useAppDispatch();
    const { userInfo, status: authStatus } = useAppSelector((state) => state.auth);
    const { status: labStatus } = useAppSelector((state: RootState) => state.reducerLabs);

    const labId = userInfo?.idLabs?.[0];

    useEffect(() => {
        if (labId) {
            dispatch(fetchLabData(labId));
        }
    }, [dispatch, labId]);

    if (authStatus === 'loading' || (labId && labStatus === 'loading')) {
        return (
            <Box sx={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', bgcolor: '#0a0a0a' }}>
                <CircularProgress sx={{ color: '#00f3ff' }} />
            </Box>
        );
    }

    return (
        <main className="min-h-screen relative flex items-center justify-center overflow-hidden bg-[#0a0a0a]">
            <Background />
            
            <Container maxWidth="xl" sx={{ 
                position: 'relative', 
                zIndex: 10,
                py: { xs: 12, md: 8 },
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                minHeight: '100vh'
            }}>
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <Box sx={{ mb: 6 }}>
                        <Typography variant="h3" sx={{ 
                            color: '#fff', 
                            fontWeight: 900, 
                            textTransform: 'uppercase', 
                            letterSpacing: 4,
                            mb: 1
                        }}>
                            Centro de <Box component="span" sx={{ color: '#00f3ff' }}>Operaciones</Box>
                        </Typography>
                        <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.5)', letterSpacing: 1 }}>
                            Gestión unificada de activos, laboratorio y protocolos de red.
                        </Typography>
                    </Box>

                    <Grid container spacing={4}>
                        {/* Column 1: Financial */}
                        <Grid size={{ xs: 12, lg: 4 }}>
                            <FinancialPanel />
                        </Grid>

                        {/* Column 2: Laboratory State */}
                        <Grid size={{ xs: 12, lg: 4 }}>
                            <LabMetersPanel />
                        </Grid>

                        {/* Column 3: Control & Rewards */}
                        <Grid size={{ xs: 12, lg: 4 }}>
                            <ControlRewardsPanel />
                        </Grid>
                    </Grid>
                </motion.div>
            </Container>
        </main>
    );
}
