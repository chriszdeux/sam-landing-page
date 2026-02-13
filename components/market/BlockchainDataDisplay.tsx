
/**
 * Componente para Visualización de Datos Blockchain
 * Muestra métricas detalladas y estado de la red seleccionada
 * Incluye animaciones de escaneo y visualización de identidad
 */
import React from 'react';
import { Box, Typography, Paper, Avatar } from '@mui/material';
import { motion } from 'framer-motion';
import { BlockchainInterface } from '../../lib/types/blockchain';

interface BlockchainDataDisplayProps {
  network: BlockchainInterface | null | undefined;
}

export const BlockchainDataDisplay: React.FC<BlockchainDataDisplayProps> = ({ network }) => {

  if (!network) {
    return (
        <Paper sx={{ p: 4, bgcolor: 'rgba(10,12,16,0.8)', border: '1px solid rgba(255,255,255,0.1)', textAlign: 'center' }}>
            <Typography color="text.secondary">Seleccione una red para ver sus datos.</Typography>
        </Paper>
    );
  }

  const { identification, additionalInfo } = network;
  const color = additionalInfo?.color || '#00f3ff';

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <Box sx={{ width: '100%', mb: 6 }}>
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >

            <Paper 
                elevation={0}
                sx={{ 
                    p: 3, 
                    mb: 3, 
                    background: `linear-gradient(90deg, rgba(10,12,16,0.9) 0%, ${color}15 100%)`,
                    border: '1px solid rgba(255,255,255,0.05)',
                    borderLeft: `4px solid ${color}`,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 3,
                    position: 'relative',
                    overflow: 'hidden'
                }}
            >

                <motion.div
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '1px',
                        background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
                        boxShadow: `0 0 15px ${color}`,
                        opacity: 0.5,
                        zIndex: 2
                    }}
                    animate={{ top: ['0%', '100%', '0%'] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                />

                 <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ 
                        scale: 1, 
                        opacity: 1,
                        boxShadow: [`0 0 20px ${color}40`, `0 0 40px ${color}60`, `0 0 20px ${color}40`] 
                    }}
                    transition={{ 
                        type: "spring", stiffness: 200,
                        boxShadow: { duration: 3, repeat: Infinity, ease: "easeInOut" }
                    }}
                 >
                    <Avatar 
                        src={identification.image} 
                        sx={{ width: 80, height: 80, border: `2px solid ${color}` }}
                    >
                        {identification.symbol[0]}
                    </Avatar>
                 </motion.div>
                
                 <Box sx={{ zIndex: 1 }}>
                     <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        <Typography variant="h3" sx={{ fontWeight: 'bold', color: 'white', letterSpacing: 1, lineHeight: 1 }}>
                            {identification.name}
                        </Typography>
                        <motion.div
                            animate={{ opacity: [1, 0.3, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: color, boxShadow: `0 0 10px ${color}` }} />
                        </motion.div>
                     </Box>
                     
                     <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography component="span" variant="h6" sx={{ color, opacity: 0.8, fontWeight: 'bold' }}>{identification.symbol}</Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary', fontFamily: 'monospace', opacity: 0.6 }}>
                            | MODULE ID: {network.id}
                        </Typography>
                     </Box>
                 </Box>


                 <Box component="img" src={identification.image} sx={{ position: 'absolute', top: -20, right: -20, opacity: 0.05, width: 300, height: 300 }} alt="" />
            </Paper>
        </motion.div>
    </Box>
  );
};







