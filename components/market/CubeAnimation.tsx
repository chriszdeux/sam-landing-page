import React from 'react';
import { Box } from '@mui/material';
import { motion } from 'framer-motion';
import { CheckCircleOutline } from '@mui/icons-material';

interface CubeAnimationProps {
  type: 'BUY' | 'SELL' | 'TRANSFER';
  status?: 'IDLE' | 'PROCESSING' | 'SUCCESS' | 'ERROR';
}

const BURST_POSITIONS = [
  { x: 200, y: -150 }, { x: -200, y: 150 }, { x: 100, y: 250 }, { x: -100, y: -250 },
  { x: 300, y: 0 }, { x: -300, y: 0 }, { x: 0, y: 300 }, { x: 0, y: -300 },
  { x: 150, y: 150 }, { x: -150, y: -150 }, { x: 150, y: -150 }, { x: -150, y: 150 }
];

export const CubeAnimation = ({ type, status = 'PROCESSING' }: CubeAnimationProps) => {
  const isBuy = type === 'BUY';
  const isSuccess = status === 'SUCCESS';
  
  const burstPositions = BURST_POSITIONS;

  return (
    <Box sx={{ position: 'relative', width: '100%', height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
      
      {/* Center Cube / Success Indicator */}
      <motion.div
  // ... (rest is same until burst part)
        animate={{ 
          rotateX: isSuccess ? 0 : [0, 360], 
          rotateY: isSuccess ? 0 : [0, 360],
          scale: isSuccess ? [1, 1.5, 1.2] : [1, 1.1, 1],
        }}
        transition={{ 
          duration: isSuccess ? 0.8 : 10, 
          repeat: isSuccess ? 0 : Infinity, 
          ease: isSuccess ? "backOut" : "linear" 
        }}
        style={{
          width: 100,
          height: 100,
          background: isSuccess ? 'rgba(0, 255, 157, 0.1)' : 'rgba(0, 243, 255, 0.2)',
          border: isSuccess ? '2px solid #00ff9d' : '2px solid #00f3ff',
          boxShadow: isSuccess ? '0 0 80px #00ff9d' : '0 0 50px #00f3ff',
          borderRadius: isSuccess ? '50%' : 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          zIndex: 10,
          transformStyle: 'preserve-3d'
        }}
      >
         {!isSuccess ? (
           <>
             <Box sx={{ position: 'absolute', width: '100%', height: '100%', border: '1px solid rgba(0,243,255,0.3)', transform: 'translateZ(50px)' }} />
             <Box sx={{ position: 'absolute', width: '100%', height: '100%', border: '1px solid rgba(0,243,255,0.3)', transform: 'translateZ(-50px)' }} />
             <Box sx={{ position: 'absolute', width: '100%', height: '100%', border: '1px solid rgba(0,243,255,0.3)', transform: 'rotateY(90deg) translateZ(50px)' }} />
             <Box sx={{ position: 'absolute', width: '100%', height: '100%', border: '1px solid rgba(0,243,255,0.3)', transform: 'rotateY(90deg) translateZ(-50px)' }} />
             <Box sx={{ position: 'absolute', width: '100%', height: '100%', border: '1px solid rgba(0,243,255,0.3)', transform: 'rotateX(90deg) translateZ(50px)' }} />
             <Box sx={{ position: 'absolute', width: '100%', height: '100%', border: '1px solid rgba(0,243,255,0.3)', transform: 'rotateX(90deg) translateZ(-50px)' }} />
           </>
         ) : (
           <motion.div
             initial={{ scale: 0, opacity: 0 }}
             animate={{ scale: 1, opacity: 1 }}
             transition={{ delay: 0.2 }}
           >
             <CheckCircleOutline sx={{ fontSize: 60, color: '#00ff9d' }} />
           </motion.div>
         )}
      </motion.div>

      {/* Input Stream (Left) - Stops on success */}
      {!isSuccess && (
      <Box sx={{ position: 'absolute', left: 0, width: '50%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'flex-start', pl: 5 }}>
          {[...Array(8)].map((_, i) => (
             <motion.div
                key={`in-${i}`}
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: '100%', opacity: [0, 1, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2, ease: "linear" }}
                style={{
                    position: 'absolute',
                    width: isBuy ? 40 : 20, 
                    height: 10,
                    backgroundColor: isBuy ? '#00ff9d' : '#00f3ff', 
                    borderRadius: 2,
                    boxShadow: `0 0 15px ${isBuy ? '#00ff9d' : '#00f3ff'}`
                }}
             />
          ))}
      </Box>
      )}

      {/* Output Stream (Right) - Bursts on success */}
      <Box sx={{ position: 'absolute', right: 0, width: '50%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {/* Normal flow */}
          {!isSuccess && [...Array(8)].map((_, i) => (
             <motion.div
                key={`out-${i}`}
                initial={{ x: -50, opacity: 0, scale: 0.5 }}
                animate={{ x: 300, opacity: [0, 1, 0], scale: 1 }}
                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2, ease: "easeOut" }}
                style={{
                    position: 'absolute',
                    left: 0,
                    width: isBuy ? 15 : 40,
                    height: isBuy ? 15 : 10,
                    backgroundColor: isBuy ? '#00f3ff' : '#00ff9d',
                    borderRadius: 2,
                    boxShadow: `0 0 15px ${isBuy ? '#00f3ff' : '#00ff9d'}`
                }}
             />
          ))}
          
          {/* Success Burst */}
          {isSuccess && burstPositions.map((pos, i) => (
             <motion.div
                key={`burst-${i}`}
                initial={{ x: 0, y: 0, opacity: 1, scale: 0.5 }}
                animate={{ 
                    x: pos.x, 
                    y: pos.y,
                    opacity: 0,
                    scale: 0
                }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                style={{
                    position: 'absolute',
                    left: 0,
                    width: 10,
                    height: 10,
                    backgroundColor: '#00ff9d',
                    borderRadius: '50%',
                    boxShadow: '0 0 20px #00ff9d'
                }}
             />
          ))}
      </Box>

    </Box>
  );
};
