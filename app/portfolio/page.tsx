'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Box, CircularProgress, Typography } from '@mui/material';
import { Background } from '../../components/layout/Background';

export default function PortfolioRedirect() {
    const router = useRouter();

    useEffect(() => {
        router.replace('/dashboard');
    }, [router]);

    return (
        <main className="min-h-screen relative flex flex-col items-center justify-center">
            <Background />
            <Box sx={{ position: 'relative', zIndex: 10, textAlign: 'center' }}>
                <CircularProgress sx={{ mb: 2, color: '#00f3ff' }} />
                <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.5)', letterSpacing: 2 }}>
                    REDIRECCIONANDO AL CENTRO DE OPERACIONES...
                </Typography>
            </Box>
        </main>
    );
}
