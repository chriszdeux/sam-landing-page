import React from 'react';
import { Typography, Grid, Chip, Box } from '@mui/material';
import { Section } from '../ui/Section';
import { Card } from '../ui/Card';
import { useAppSelector } from '../../lib/hooks';

const getRarityColor = (rarity: string) => {
  switch (rarity) {
    case 'Legendary': return '#ffb700'; // Orange (was Purple)
    case 'Rare': return '#00f3ff'; // Cyan
    case 'Common': return '#b3b3b3'; // Gray
    default: return '#fff';
  }
};

export const ResourcesSection = () => {
  const { resources } = useAppSelector((state) => state.game);

  return (
    <Section id="resources">
      <Typography variant="h2" align="center" gutterBottom sx={{ mb: 8, color: 'primary.main' }}>
        Recursos Galácticos
      </Typography>

      <Grid container spacing={4}>
        {resources.map((resource) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={resource.id}>
            <Card sx={{ textAlign: 'center', p: 3 }}>
              <Box sx={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                bgcolor: 'rgba(255,255,255,0.05)',
                mx: 'auto',
                mb: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2rem'
              }}>
                {resource.type === 'Mineral' ? '💎' : resource.type === 'Energy' ? '⚡' : '📦'}
              </Box>
              <Typography variant="h6" gutterBottom>
                {resource.name}
              </Typography>
              <Chip
                label={resource.rarity}
                size="small"
                sx={{
                  bgcolor: `${getRarityColor(resource.rarity)}33`,
                  color: getRarityColor(resource.rarity),
                  border: `1px solid ${getRarityColor(resource.rarity)}`,
                  mb: 1
                }}
              />
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {resource.description}
              </Typography>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Section>
  );
};
