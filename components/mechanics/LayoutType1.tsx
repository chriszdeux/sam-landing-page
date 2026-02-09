import React from 'react';
import { Box, Typography, Container, Grid, Stack } from '@mui/material';
import { motion } from 'framer-motion';
import { Mechanic } from '../../lib/data/mechanics';
import { useSelector } from 'react-redux';
import { BlockchainState } from '@/lib/features/blockchain/types';


export const ProbePulse = ({ color }: { color: string }) => {
  return (
    <Box sx={{ position: 'relative', width: 300, height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {/* Core */}
      <Box sx={{ width: 16, height: 16, borderRadius: '50%', bgcolor: color, zIndex: 10, boxShadow: `0 0 20px ${color}` }} />
      
      {/* Expanding Pulses */}
      {[0, 1, 2].map((i) => (
        <motion.div
            key={i}
            style={{
                position: 'absolute',
                border: `1px solid ${color}`,
                borderRadius: '50%',
                top: '50%',
                left: '50%',
                x: '-50%',
                y: '-50%',
            }}
            initial={{ opacity: 0, width: 0, height: 0 }}
            animate={{
                width: [0, 500],
                height: [0, 500],
                opacity: [0, 0.5, 0],
                borderWidth: [2, 0]
            }}
            transition={{
                duration: 6,
                repeat: Infinity,
                delay: i * 2,
                ease: "linear",
                times: [0, 0.2, 1]
            }}
        />
      ))}
      
      {/* Rotating Orbit/Galaxy ring */}
       <motion.div
            style={{
                position: 'absolute',
                width: 250,
                height: 250,
                border: `1px dashed ${color}30`,
                borderRadius: '50%'
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
       />
       <motion.div
            style={{
                position: 'absolute',
                width: 180,
                height: 180,
                border: `1px dashed ${color}50`,
                borderRadius: '50%'
            }}
            animate={{ rotate: -360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
       />
    </Box>
  )
}

export const LayoutType1 = ({ mechanic }: { mechanic: Mechanic }) => {
  const { networks } = useSelector((state: { blockchain: BlockchainState }) => state.blockchain);
   return (
     <Container maxWidth="xl" sx={{ pt: 20 }}>
    <Grid container spacing={8} alignItems="center">
      <Grid size={{ xs: 12, md: 6 }}>
        <motion.div initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
          <Typography variant="overline" color={mechanic.color} sx={{ letterSpacing: 3, fontWeight: 'bold' }}>
             MECÁNICA PRINCIPAL
          </Typography>
          <Typography variant="h1" sx={{ mt: 2, mb: 4, fontWeight: 800, fontSize: { xs: '3rem', md: '5rem' } }}>
            {mechanic.title}
          </Typography>
          <Typography variant="h5" color="text.secondary" sx={{ mb: 4, lineHeight: 1.6 }}>
            {mechanic.content.paragraphs[0]}
          </Typography>
          <Stack direction="row" spacing={2} sx={{ mb: 6 }}>
            <Box sx={{ p: 2, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 2 }}>
                <Typography variant="caption" color="text.secondary">{mechanic.content.statLabel}</Typography>
                <Typography variant="h4" color="white" fontWeight="bold">{mechanic.content.statValue}</Typography>
            </Box>
          </Stack>
        </motion.div>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2 }}>
            <Box sx={{ 
                height: 500, 
                bgcolor: 'rgba(255,255,255,0.03)', 
                borderRadius: 8,
                position: 'relative',
                overflow: 'hidden',
                border: `1px solid ${mechanic.color}40`,
                boxShadow: `0 0 50px ${mechanic.color}20`
            }}>
                <Box sx={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                     {/* Background Stars Effect */}
                     {[...Array(20)].map((_, i) => {
                        // Use a deterministic pseudo-random approach based on index
                        const top = ((i * 17) % 100);
                        const left = ((i * 23) % 100);
                        const delay = (i % 5);
                        return (
                        <motion.div 
                            key={i}
                            style={{
                                position: 'absolute',
                                top: `${top}%`,
                                left: `${left}%`,
                                width: 2,
                                height: 2,
                                backgroundColor: 'white',
                            }}
                            animate={{ opacity: [0.3, 1, 0.3] }}
                            transition={{ duration: 2 + delay, repeat: Infinity, ease: "easeInOut" }}
                        />
                     )})}
                     <ProbePulse color={mechanic.color} />
                </Box>
                {/* Simulated UI Overlay */}
                <Box sx={{ position: 'absolute', bottom: 30, left: 30, right: 30, p: 3, bgcolor: 'rgba(0,0,0,0.8)', borderRadius: 4, backdropFilter: 'blur(10px)' }}>
                    <Typography variant="subtitle2" color={mechanic.color}>Estado del Sistema - {networks[0]?.isActive ? "Operativo" : "No operativo"}</Typography>
                    <Box sx={{ height: 4, bgcolor: 'rgba(255,255,255,0.1)', mt: 1, borderRadius: 2 }}>
                        <Box sx={{ width: '70%', height: '100%', bgcolor: mechanic.color, borderRadius: 2 }} />
                    </Box>
                </Box>
            </Box>
        </motion.div>
      </Grid>
    </Grid>
    
    <Box sx={{ mt: 10 }}>
        <Grid container spacing={4}>
            {mechanic.content.paragraphs.slice(1).map((p: string, i: number) => (
                <Grid size={{ xs: 12, md: 6 }} key={i}>
                    <Typography fontSize="1.1rem" color="text.secondary" lineHeight={1.8}>{p}</Typography>
                </Grid>
            ))}
        </Grid>
    </Box>
    
    <Box sx={{ mt: 10, mb: 10 }}>
        <Typography variant="h4" gutterBottom>Características Clave</Typography>
        <Grid container spacing={2} sx={{ mt: 2 }}>
            {mechanic.content.features.map((f, i) => (
                <Grid size={{ xs: 12, sm: 6, md: 3 }} key={i}>
                    <Box sx={{ p: 3, bgcolor: 'rgba(255,255,255,0.02)', borderRadius: 2, borderLeft: `4px solid ${mechanic.color}`, height: '100%' }}>
                        <Typography fontWeight="bold" gutterBottom>{f.title}</Typography>
                        <Typography variant="body2" color="text.secondary">{f.description}</Typography>
                    </Box>
                </Grid>
            ))}
        </Grid>
    </Box>
  </Container>
   )
}