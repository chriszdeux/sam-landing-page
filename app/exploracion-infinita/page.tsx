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

      {/* Full Screen Map Container */}
      <Box sx={{ width: '100%', height: '100%' }}>
        <GalacticExplorer />
      </Box>
    </Box>
  );
}
