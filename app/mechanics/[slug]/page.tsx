'use client';

import React, { use } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Typography } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { mechanicsData } from '../../../lib/data/mechanics';
import { Button } from '../../../components/ui/Button';
import { LayoutType1, LayoutType2, LayoutType3, LayoutType4, LayoutTypeDefense } from '../../../components/mechanics/MechanicLayouts';

export default function MechanicPage({ params }: { params: Promise<{ slug: string }> }) {
  const router = useRouter();
  const { slug } = use(params);
  
  const mechanic = mechanicsData.find(m => m.slug === slug);

  if (!mechanic) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography>Mecánica no encontrada</Typography>
        <Button onClick={() => router.back()}>Volver</Button>
      </Box>
    );
  }

  const renderLayout = () => {
      switch(mechanic.layoutType) {
          case 'type2': return <LayoutType2 mechanic={mechanic} />;
          case 'type3': return <LayoutType3 mechanic={mechanic} />;
          case 'type4': return <LayoutType4 mechanic={mechanic} />;
          case 'defense': return <LayoutTypeDefense mechanic={mechanic} />;
          default: return <LayoutType1 mechanic={mechanic} />;
      }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', position: 'relative' }}>
      <Box sx={{ position: 'fixed', top: 100, left: { xs: 20, md: 40 }, zIndex: 100 }}>
        <Button 
            variant="outlined" 
            startIcon={<ArrowBack />} 
            onClick={() => router.back()}
            sx={{ backdropFilter: 'blur(5px)' }}
        >
            Atrás
        </Button>
      </Box>
      
      {renderLayout()}
    </Box>
  );
}
