import React from 'react';
import { Typography, Grid, Box } from '@mui/material';
import { Section } from '../ui/Section';
import { Card } from '../ui/Card';

const buildings = [
  { name: 'Centro de Comando', type: 'Administrativo', level: 1, icon: '🏢' },
  { name: 'Mina de Cristal', type: 'Recolección', level: 1, icon: '⛏️' },
  { name: 'Refinería Solar', type: 'Procesamiento', level: 2, icon: '🏭' },
  { name: 'Puerto Espacial', type: 'Transporte', level: 3, icon: '🚀' },
];

export const ArchitectureSection = () => {
  return (
    <Section id="architecture">
      <Typography variant="h2" align="center" gutterBottom sx={{ mb: 8, color: 'primary.main' }}>
        Arquitectura
      </Typography>

      <Grid container spacing={4}>
        {buildings.map((building, index) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
            <Card sx={{ p: 3, position: 'relative', overflow: 'hidden' }}>
              <Box sx={{
                position: 'absolute',
                top: -20,
                right: -20,
                fontSize: '8rem',
                opacity: 0.05,
                pointerEvents: 'none'
              }}>
                {building.icon}
              </Box>
              <Typography variant="h1" sx={{ fontSize: '3rem', mb: 2 }}>
                {building.icon}
              </Typography>
              <Typography variant="h6" gutterBottom>
                {building.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Tipo: {building.type}
              </Typography>
              <Typography variant="caption" display="block" sx={{ mt: 1, color: 'primary.main' }}>
                Nivel Requerido: {building.level}
              </Typography>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Section>
  );
};
