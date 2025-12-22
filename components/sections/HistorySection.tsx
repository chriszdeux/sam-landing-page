import { Box, Typography, Stepper, Step, StepLabel, StepContent, Button } from '@mui/material';
import Link from 'next/link';
import { ArrowForward } from '@mui/icons-material';
import { Section } from '../ui/Section';
import { historyData } from '../../lib/data/history';

export const HistorySection = () => {
  return (
    <Section id="history">
      <Typography variant="h2" align="center" gutterBottom sx={{ mb: 8, color: 'primary.main' }}>
        Nuestra Historia
      </Typography>

      <Box sx={{ maxWidth: 800, mx: 'auto' }}>
        <Stepper orientation="vertical">
          {historyData.map((event, index) => (
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
                <Link href={`/history/${event.year}`} passHref>
                  <Button 
                    variant="text" 
                    endIcon={<ArrowForward />}
                    sx={{ ml: 1, mt: 1, color: 'secondary.main' }}
                  >
                    Leer Historia Completa
                  </Button>
                </Link>
              </StepContent>
            </Step>
          ))}
        </Stepper>
      </Box>
    </Section>
  );
};
