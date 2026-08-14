'use client';

import React from 'react';
import { Box, Typography, Stack, Grid } from '@mui/material';
import { Compass, Cpu, Wallet, Users, Activity, Rocket, Blocks, BarChart3 } from 'lucide-react';

export const LyncoreFeaturesGrid = () => (
  <Grid container spacing={3} sx={{ mt: 1 }}>
    {[
      { text: 'Exploración Galáctica', desc: 'Explora planetas hostiles y recolecta recursos para tus naves y bases.', icon: Compass },
      { text: 'Contratos de Energía', desc: 'Crea estructuras y realiza acuerdos de suministro energético entre usuarios.', icon: Cpu },
      { text: 'Gestión de Wallet', desc: 'Administra tus activos y realiza transferencias inmutables seguras.', icon: Wallet },
      { text: 'Cooperación Estratégica', desc: 'Únete a clanes y coopera para erigir una civilización tecnológica avanzada.', icon: Users }
    ].map((item, idx) => {
      const Icon = item.icon;
      return (
        <Grid size={{ xs: 12, sm: 6, md: 3 }} key={idx}>
          <Box sx={{
            p: 2.5,
            borderRadius: 2,
            bgcolor: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid rgba(0, 243, 255, 0.1)',
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
            '&:hover': {
              bgcolor: 'rgba(0, 243, 255, 0.04)',
              borderColor: 'rgba(0, 243, 255, 0.3)',
            },
            transition: 'all 0.2s ease-in-out'
          }}>
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Icon size={18} color="#00f3ff" />
              <Typography variant="subtitle2" sx={{ color: 'white', fontWeight: 'bold' }}>
                {item.text}
              </Typography>
            </Stack>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              {item.desc}
            </Typography>
          </Box>
        </Grid>
      );
    })}
  </Grid>
);

export const OperationsFeaturesGrid = () => (
  <Grid container spacing={3} sx={{ mt: 1 }}>
    {[
      { text: 'Visualizar tus activos', icon: Wallet, desc: 'Control centralizado de wallets, balances y recursos recolectados.' },
      { text: 'Inyectar hash a la red', icon: Activity, desc: 'Asegura la red procesando y firmando bloques con tu hash local.' },
      { text: 'Incrementar la potencia', icon: Cpu, desc: 'Overclockea tus reactores para acelerar los ciclos de procesamiento.' },
      { text: 'Gestionar tus naves', icon: Rocket, desc: 'Despliega flotas de exploración y cargueros mineros en el yermo.' },
      { text: 'Tus estructuras', icon: Blocks, desc: 'Construye módulos de soporte vital, plantas solares y reactores.' },
      { text: 'Economía integrada', icon: BarChart3, desc: 'Establece contratos de suministro energético y comercio directo.' }
    ].map((item, idx) => {
      const Icon = item.icon;
      return (
        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={idx}>
          <Box sx={{
            p: 2.5,
            borderRadius: 2,
            bgcolor: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid rgba(0, 230, 118, 0.1)',
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
            '&:hover': {
              bgcolor: 'rgba(0, 230, 118, 0.04)',
              borderColor: 'rgba(0, 230, 118, 0.3)',
            },
            transition: 'all 0.2s ease-in-out'
          }}>
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Icon size={18} color="#00e676" />
              <Typography variant="subtitle2" sx={{ color: 'white', fontWeight: 'bold' }}>
                {item.text}
              </Typography>
            </Stack>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              {item.desc}
            </Typography>
          </Box>
        </Grid>
      );
    })}
  </Grid>
);

export const MarketFeaturesGrid = () => (
  <Grid container spacing={3} sx={{ mt: 1 }}>
    {[
      { text: 'Intercambio Galáctico', desc: 'Comercio instantáneo de tokens, naves y recursos en tiempo real.' },
      { text: 'Liquidez Extrema', desc: 'Sistemas de orden inmediata respaldados por las pools de red.' },
      { text: 'Transferencias Seguras', desc: 'Envío directo de activos entre billeteras seguras del yermo.' }
    ].map((item, idx) => (
      <Grid size={{ xs: 12, md: 4 }} key={idx}>
        <Box sx={{
          p: 2.5,
          borderRadius: 2,
          bgcolor: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid rgba(255, 171, 0, 0.1)',
          '&:hover': {
            bgcolor: 'rgba(255, 171, 0, 0.04)',
            borderColor: 'rgba(255, 171, 0, 0.3)',
          },
          transition: 'all 0.25s ease'
        }}>
          <Typography variant="subtitle2" sx={{ color: 'white', fontWeight: 'bold', mb: 1 }}>
            ✨ {item.text}
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            {item.desc}
          </Typography>
        </Box>
      </Grid>
    ))}
  </Grid>
);

export const LedgerFeaturesGrid = () => (
  <Grid container spacing={3} sx={{ mt: 1 }}>
    {[
      { text: 'Bloques Elásticos', desc: 'Los bloques ajustan su capacidad un 25% para optimizar el rendimiento.' },
      { text: 'Ledger Inmutable', desc: 'Registro inalterable firmado por consenso de red y forja solar.' },
      { text: 'Auditoría en Tiempo Real', desc: 'Visualiza y sigue transacciones conforme se sellan al vacío.' }
    ].map((item, idx) => (
      <Grid size={{ xs: 12, md: 4 }} key={idx}>
        <Box sx={{
          p: 2.5,
          borderRadius: 2,
          bgcolor: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid rgba(255, 0, 85, 0.1)',
          '&:hover': {
            bgcolor: 'rgba(255, 0, 85, 0.04)',
            borderColor: 'rgba(255, 0, 85, 0.3)',
          },
          transition: 'all 0.25s ease'
        }}>
          <Typography variant="subtitle2" sx={{ color: 'white', fontWeight: 'bold', mb: 1 }}>
            ⛓️ {item.text}
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            {item.desc}
          </Typography>
        </Box>
      </Grid>
    ))}
  </Grid>
);
