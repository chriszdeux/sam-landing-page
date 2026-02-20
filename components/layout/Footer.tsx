// 1-Definir estructura visual del pie de página
// 2-Renderizar enlaces rápidos y redes sociales
// 3-Mostrar información de derechos de autor

//# 1-Definir estructura visual del pie de página
import React from 'react';
import { Box, Container, Grid, Typography, IconButton, Stack } from '@mui/material';
import { Twitter, GitHub, LinkedIn } from '@mui/icons-material';
import { EnvVariables } from '@/lib/constants/variables';

export const Footer = () => {
  
  //# 2-Renderizar enlaces rápidos y redes sociales
  return (
    <Box component="footer" sx={{ bgcolor: 'background.paper', py: 6, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Typography variant="h6" color="primary" gutterBottom>
              {EnvVariables.project.toUpperCase()}
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
        {/* //# 3-Mostrar información de derechos de autor */}
        <Box sx={{ mt: 5, pt: 3, borderTop: '1px solid rgba(255,255,255,0.1)', textAlign: 'center', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} {EnvVariables.project}. Todos los derechos reservados.
          </Typography>
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.3)', fontFamily: 'monospace' }}>
            v0.1.0
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};
