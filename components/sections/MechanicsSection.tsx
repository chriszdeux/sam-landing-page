import React from 'react';
import { Typography, Grid, Box } from '@mui/material';
import { Rocket, Pickaxe, Building2, FlaskConical, Coins, Shield } from 'lucide-react';
import { Section } from '../ui/Section';
import { Card } from '../ui/Card';
import { useAppDispatch, useAppSelector } from '../../lib/hooks';
import { collectResource } from '../../lib/features/gameSlice';

const mechanics = [
  {
    title: 'Exploración Espacial',
    description: 'Descubre nuevos planetas y sistemas solares con recursos únicos.',
    icon: Rocket,
    color: '#00f3ff',
  },
  {
    title: 'Recolección',
    description: 'Extrae minerales y recursos vitales para la expansión.',
    icon: Pickaxe,
    color: '#ffb700',
  },
  {
    title: 'Civilización',
    description: 'Construye y gestiona colonias prósperas.',
    icon: Building2,
    color: '#00f3ff',
  },
  {
    title: 'Laboratorio',
    description: 'Investiga nuevas tecnologías y mejoras.',
    icon: FlaskConical,
    color: '#ffb700',
  },
  {
    title: 'Economía',
    description: 'Comercia recursos y activos en un mercado libre.',
    icon: Coins,
    color: '#00f3ff',
  },
  {
    title: 'Combate Espacial',
    description: 'Defiende tus colonias de piratas y facciones rivales.',
    icon: Shield,
    color: '#ffb700',
  },
];

export const MechanicsSection = () => {
  const dispatch = useAppDispatch();
  const { collectedResources } = useAppSelector((state) => state.game);

  return (
    <Section id="mechanics">
      <Typography variant="h2" align="center" gutterBottom sx={{ mb: 8, color: 'primary.main' }}>
        Mecánicas de Juego
      </Typography>

      <Grid container spacing={4} justifyContent="center">
        {mechanics.map((mechanic, index) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
            <Card
              onClick={() => mechanic.title === 'Recolección' && dispatch(collectResource())}
              sx={{
                height: '100%',
                p: 4,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                cursor: mechanic.title === 'Recolección' ? 'pointer' : 'default',
                transition: 'all 0.3s ease',
                '&:hover': mechanic.title === 'Recolección' ? {
                  transform: 'translateY(-5px)',
                  boxShadow: `0 0 20px ${mechanic.color}66`
                } : undefined
              }}
            >
              <Box sx={{
                p: 2,
                borderRadius: '50%',
                bgcolor: `${mechanic.color}1a`,
                mb: 3,
                border: `1px solid ${mechanic.color}33`
              }}>
                <mechanic.icon size={32} color={mechanic.color} />
              </Box>
              <Typography variant="h5" gutterBottom fontWeight="bold">
                {mechanic.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {mechanic.description}
              </Typography>
              {mechanic.title === 'Recolección' && (
                <Typography variant="h6" sx={{ mt: 2, color: mechanic.color, fontWeight: 'bold' }}>
                  Recolectado: {collectedResources}
                </Typography>
              )}
            </Card>
          </Grid>
        ))}
      </Grid>
    </Section>
  );
};
