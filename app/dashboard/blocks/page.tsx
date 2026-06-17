'use client';

import React from 'react';
import { Box, Stack, IconButton, Divider, Container } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { BlocksModule } from '../../../components/modules/blocks/BlocksModule';
import { Background } from '../../../components/layout/Background';

export default function BlocksPage() {
    const router = useRouter();

    return (
        <main className="min-h-screen relative pb-20">
            <Background />
            
            <Container maxWidth="xl" sx={{ pt: { xs: 12, md: 16 }, position: 'relative', zIndex: 10 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                    <Stack direction="row" spacing={3} alignItems="center">
                        <IconButton 
                            onClick={() => router.back()} 
                            sx={{ 
                                color: '#00f3ff', 
                                border: '1px solid rgba(0, 243, 255, 0.3)',
                                bgcolor: 'rgba(0, 243, 255, 0.05)',
                                '&:hover': { bgcolor: 'rgba(0, 243, 255, 0.1)' }
                            }}
                        >
                            <ArrowBack />
                        </IconButton>
                    </Stack>
                </Box>

                <Divider sx={{ mb: 4, borderColor: 'rgba(255,255,255,0.05)' }} />

                <BlocksModule />
            </Container>
        </main>
    );
}
