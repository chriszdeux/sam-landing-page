// 1-Estructuración y renderizado visual del componente UI

'use client';

import React from 'react';
import { Box, Typography, Container, Grid, Divider } from '@mui/material';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowBack } from '@mui/icons-material';
import { Button } from '../../components/ui/Button';
import Image from 'next/image';
import { ParticleBackground } from '../../components/ui/ParticleBackground';
import { EnvVariables } from '@/lib/constants/variables';

import GalacticExplorer from '../../components/space/GalacticExplorer';

export default function InfiniteExplorationPage() {
  const router = useRouter();

  return (
    <Box sx={{ 
      width: '100vw', 
      height: '100vh', 
      bgcolor: '#050514',
      overflow: 'hidden',
      position: 'relative'
    }}>
      {/* Background Particles */}
      <ParticleBackground />

      {/* Back Button - Positioned overlay */}
      <Box sx={{ position: 'absolute', top: 20, left: 20, zIndex: 100 }}>
        <Button 
            variant="outlined" 
            startIcon={<ArrowBack />} 
            onClick={() => router.back()}
            sx={{ 
              backdropFilter: 'blur(5px)',
              borderColor: 'rgba(0, 243, 255, 0.5)',
              color: '#00f3ff',
              '&:hover': {
                borderColor: '#00f3ff',
                bgcolor: 'rgba(0, 243, 255, 0.1)'
              }
            }}
        >
            Regresar
        </Button>
      </Box>

      {/* Full Screen Map Container */}
      <Box sx={{ width: '100%', height: '100%' }}>
        <GalacticExplorer />
      </Box>
    </Box>
  );
}
