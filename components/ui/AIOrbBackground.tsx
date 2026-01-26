'use client';

import React from 'react';
import { Box } from '@mui/material';
import { motion } from 'framer-motion';

interface AIOrbBackgroundProps {
    color?: string;
    secondaryColor?: string;
    intensity?: number;
}

export const AIOrbBackground = ({ 
    color = '#00f3ff', // default Cyan
    secondaryColor = '#7b00ff',
    intensity = 1 
}: AIOrbBackgroundProps) => {

    return (
        <Box sx={{ position: 'absolute', inset: 0, overflow: 'hidden', zIndex: 0, bgcolor: '#050a14' }}>
            
            {/* Core Orb */}
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    width: '300px',
                    height: '300px',
                    transform: 'translate(-50%, -50%)',
                    borderRadius: '50%',
                    background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
                    filter: 'blur(40px)',
                    zIndex: 1
                }}
            />

            {/* Orbiting Glow 1 */}
            <motion.div
                 animate={{
                    rotate: 360,
                    scale: [1, 1.1, 1],
                }}
                transition={{
                    rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                    scale: { duration: 5, repeat: Infinity, ease: "easeInOut" }
                }}
                style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    width: '500px',
                    height: '500px',
                    marginLeft: '-250px',
                    marginTop: '-250px',
                    borderRadius: '40%',
                    border: `2px solid ${color}20`,
                    boxShadow: `0 0 50px ${secondaryColor}30`,
                    zIndex: 0
                }}
            />

             {/* Orbiting Glow 2 (Counter rotating) */}
             <motion.div
                 animate={{
                    rotate: -360,
                    scale: [1.2, 1, 1.2],
                }}
                transition={{
                    rotate: { duration: 25, repeat: Infinity, ease: "linear" },
                    scale: { duration: 7, repeat: Infinity, ease: "easeInOut" }
                }}
                style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    width: '400px',
                    height: '400px',
                    marginLeft: '-200px',
                    marginTop: '-200px',
                    borderRadius: '45%',
                    border: `1px solid ${secondaryColor}20`,
                    zIndex: 0
                }}
            />

            {/* Drifting Particles/Nebula effect */}
            <motion.div
                animate={{
                    opacity: [0.2, 0.4, 0.2],
                    background: [
                        `radial-gradient(circle at 30% 30%, ${color}20 0%, transparent 60%)`,
                        `radial-gradient(circle at 70% 70%, ${secondaryColor}20 0%, transparent 60%)`,
                        `radial-gradient(circle at 30% 30%, ${color}20 0%, transparent 60%)`
                    ]
                }}
                transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                style={{
                    position: 'absolute',
                    inset: 0,
                    zIndex: 0
                }}
            />
            
            {/* Grid Overlay for Tech Feel */}
            <Box sx={{ 
                position: 'absolute', 
                inset: 0, 
                opacity: 0.1, 
                backgroundImage: `linear-gradient(${color}30 1px, transparent 1px), linear-gradient(90deg, ${color}30 1px, transparent 1px)`, 
                backgroundSize: '40px 40px',
                zIndex: 2
            }} />
        </Box>
    );
};
