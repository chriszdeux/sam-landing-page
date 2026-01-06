import React from 'react';
import { Box, Typography, Modal as MuiModal, IconButton } from '@mui/material';
import { Close } from '@mui/icons-material';

export const FeatureModal = ({ open, onClose, title, description, content, image, color }: { open: boolean; onClose: () => void; title: string; description: string; content?: string; image?: string; color: string }) => (
  <MuiModal open={open} onClose={onClose} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <Box sx={{ 
      bgcolor: '#1a1a1a', 
      border: `1px solid ${color}`, 
      borderRadius: 4, 
      maxWidth: 800, 
      width: '90%',
      maxHeight: '90vh',
      overflowY: 'auto',
      mx: 2, 
      position: 'relative',
      boxShadow: `0 0 50px ${color}20`,
      outline: 'none',
      display: 'flex',
      flexDirection: { xs: 'column', md: 'row' }
    }}>
      <IconButton onClick={onClose} sx={{ position: 'absolute', top: 8, right: 8, zIndex: 10, color: 'white', bgcolor: 'rgba(0,0,0,0.5)', '&:hover': { bgcolor: 'rgba(0,0,0,0.8)' } }}>
        <Close />
      </IconButton>
      
      {image && (
        <Box sx={{ width: { xs: '100%', md: '40%' }, height: { xs: 200, md: 'auto' }, position: 'relative' }}>
            <img src={image} alt={title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <Box sx={{ position: 'absolute', inset: 0, background: `linear-gradient(to right, ${color}20, transparent)` }} />
        </Box>
      )}

      <Box sx={{ p: { xs: 3, md: 5 }, flex: 1 }}>
        <Typography variant="overline" color={color} fontWeight="bold" letterSpacing={2}>
            DETALLE DEL SISTEMA
        </Typography>
        <Typography variant="h4" color="white" gutterBottom fontWeight="bold" sx={{ mt: 1, mb: 3 }}>
            {title}
        </Typography>
        
        {content ? (
            content.split('\n\n').map((paragraph, index) => (
                <Typography key={index} variant="body1" color="text.secondary" paragraph sx={{ lineHeight: 1.8, fontSize: '1.05rem' }}>
                    {paragraph}
                </Typography>
            ))
        ) : (
            <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                {description}
            </Typography>
        )}
      </Box>
    </Box>
  </MuiModal>
);
