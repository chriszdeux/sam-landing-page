"use client";

import React from 'react';
import { Box } from '@mui/material';
import { motion } from 'framer-motion';

export const MiningBackground = () => {
    return (
        <Box sx={{ position: 'fixed', inset: 0, overflow: 'hidden', zIndex: -1, bgcolor: '#050a14' }}>
            {/* Base grid */}
            <Box sx={{ 
                position: 'absolute', 
                inset: 0, 
                opacity: 0.15, 
                backgroundImage: `linear-gradient(#00f3ff30 1px, transparent 1px), linear-gradient(90deg, #00f3ff30 1px, transparent 1px)`, 
                backgroundSize: '50px 50px',
                zIndex: 2,
                transform: 'perspective(500px) rotateX(60deg) translateY(-100px) translateZ(-200px)',
            }} />

            {/* Glowing Orbs representing processing nodes */}
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.1, 0.3, 0.1],
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                style={{
                    position: 'absolute', top: '30%', left: '20%', width: '400px', height: '400px',
                    transform: 'translate(-50%, -50%)', borderRadius: '50%',
                    background: `radial-gradient(circle, #00f3ff 0%, transparent 70%)`,
                    filter: 'blur(50px)', zIndex: 1
                }}
            />

            <motion.div
                animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.1, 0.4, 0.1],
                }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                style={{
                    position: 'absolute', top: '60%', right: '10%', width: '500px', height: '500px',
                    borderRadius: '50%', background: `radial-gradient(circle, #ff0055 0%, transparent 70%)`,
                    filter: 'blur(60px)', zIndex: 1
                }}
            />

            {/* Scanning line effect */}
            <motion.div
                animate={{ y: ['-100%', '100%'] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                style={{
                    position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                    background: 'linear-gradient(to bottom, transparent, rgba(0, 243, 255, 0.05) 50%, transparent)',
                    zIndex: 3,
                    pointerEvents: 'none'
                }}
            />
        </Box>
    );
};
