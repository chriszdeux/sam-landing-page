import React from 'react';
import { Box } from '@mui/material';
import { ParticleBackground } from '../ui/ParticleBackground';

export const Background = () => {
  return (
    <>
      {/* Particle Background */}
      <ParticleBackground />

      {/* Overlay for better text readability */}
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: -1,
          backgroundColor: 'rgba(0, 0, 0, 0.4)', // Semi-transparent overlay
          pointerEvents: 'none', // Allow clicks to pass through to canvas if needed (though canvas is bg)
        }}
      />
    </>
  );
};
