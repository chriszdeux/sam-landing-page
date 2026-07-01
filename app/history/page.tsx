'use client';

import React from 'react';
import { Container, Box, IconButton } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { HistorySection } from '../../components/sections/HistorySection';
import { Background } from '../../components/layout/Background';

export default function HistoryPage() {
    const router = useRouter();

    return (
        <main className="min-h-screen relative pb-20">
            <Background />
            
            <Container maxWidth="xl" sx={{ pt: { xs: 12, md: 16 }, position: 'relative', zIndex: 10 }}>
                <Box sx={{ display: 'flex', mb: 4 }}>
                    <IconButton 
                        onClick={() => router.push('/')} 
                        sx={{ 
                            color: '#00f3ff', 
                            border: '1px solid rgba(0, 243, 255, 0.3)',
                            bgcolor: 'rgba(0, 243, 255, 0.05)',
                            '&:hover': { bgcolor: 'rgba(0, 243, 255, 0.1)' }
                        }}
                    >
                        <ArrowBack />
                    </IconButton>
                </Box>

                <HistorySection />
            </Container>
        </main>
    );
}
