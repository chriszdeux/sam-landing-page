import React from 'react';
import { Box, Container, Grid, Typography, IconButton, Stack } from '@mui/material';
import { Twitter, GitHub, LinkedIn } from '@mui/icons-material';

export const Footer = () => {
  return (
    <Box component="footer" sx={{ bgcolor: 'background.paper', py: 6, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Typography variant="h6" color="primary" gutterBottom>
              PROYECTO SAM
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Explora el universo, recolecta recursos y construye tu imperio en esta simulación de cripto-economía de próxima generación.
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Enlaces Rápidos
            </Typography>
            <Stack spacing={1}>
              {['Inicio', 'Historia', 'Mecánicas', 'Recursos'].map((item) => (
                <Typography key={item} variant="body2" color="text.secondary" sx={{ cursor: 'pointer', '&:hover': { color: 'primary.main' } }}>
                  {item}
                </Typography>
              ))}
            </Stack>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Síguenos
            </Typography>
            <Stack direction="row" spacing={1}>
              <IconButton color="primary" aria-label="twitter">
                <Twitter />
              </IconButton>
              <IconButton color="primary" aria-label="github">
                <GitHub />
              </IconButton>
              <IconButton color="primary" aria-label="linkedin">
                <LinkedIn />
              </IconButton>
            </Stack>
          </Grid>
        </Grid>
        <Box sx={{ mt: 5, pt: 3, borderTop: '1px solid rgba(255,255,255,0.1)', textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} Proyecto SAM. Todos los derechos reservados.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};
