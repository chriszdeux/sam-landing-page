import React from 'react';
import { Box, Typography, Stepper, Step, StepLabel, StepContent } from '@mui/material';
import { Section } from '../ui/Section';

const historyEvents = [
  {
    year: '2024',
    title: 'El Colapso',
    description: 'La economía global se fractura. Las monedas fiat pierden su valor.',
  },
  {
    year: '2025',
    title: 'El Renacimiento Digital',
    description: 'Surge SAM como el nuevo estándar económico descentralizado.',
  },
  {
    year: '2028',
    title: 'La Expansión',
    description: 'La humanidad mira hacia las estrellas en busca de nuevos recursos.',
  },
  {
    year: '2030',
    title: 'La Era de la Colonización',
    description: 'Se establecen las primeras colonias en el sistema solar.',
  },
  {
    year: '2035',
    title: 'La Federación Galáctica',
    description: 'Se forma un gobierno unificado para gestionar los recursos del sistema solar.',
  },
  {
    year: '2040',
    title: 'El Descubrimiento del Vacío',
    description: 'Se detectan señales de una antigua civilización en los bordes del sistema.',
  },
];

export const HistorySection = () => {
  return (
    <Section id="history">
      <Typography variant="h2" align="center" gutterBottom sx={{ mb: 8, color: 'primary.main' }}>
        Nuestra Historia
      </Typography>

      <Box sx={{ maxWidth: 800, mx: 'auto' }}>
        <Stepper orientation="vertical">
          {historyEvents.map((event, index) => (
            <Step key={index} active={true}>
              <StepLabel
                StepIconProps={{
                  sx: { color: 'primary.main', '&.Mui-active': { color: 'secondary.main' } }
                }}
              >
                <Typography variant="h5" color="primary" fontWeight="bold">
                  {event.year} - {event.title}
                </Typography>
              </StepLabel>
              <StepContent>
                <Typography color="text.secondary" sx={{ ml: 2, mb: 2 }}>
                  {event.description}
                </Typography>
              </StepContent>
            </Step>
          ))}
        </Stepper>
      </Box>
    </Section>
  );
};
