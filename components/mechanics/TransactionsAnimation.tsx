import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';

interface Block {
    id: number;
    hash: string;
    from: string;
    to: string;
}

export const TransactionsAnimation = ({ color }: { color: string }) => {
    const [blocks, setBlocks] = useState<Block[]>([]);
    
    useEffect(() => {
        const interval = setInterval(() => {
            setBlocks(prev => {
                const newBlock = {
                    id: Date.now(),
                    hash: Math.random().toString(36).substring(7),
                    from: Math.random().toString(16).substring(0, 8),
                    to: Math.random().toString(16).substring(0, 8),
                };
                return [newBlock, ...prev].slice(0, 10);
            });
        }, 800);
        return () => clearInterval(interval);
    }, []);

    return (
        <Box sx={{ 
            width: '100%', 
            height: '100%', 
            position: 'relative',
            overflow: 'hidden',
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            gap: 2
        }}>
            <AnimatePresence>
                {blocks.map((block) => (
                    <motion.div
                        key={block.id}
                        initial={{ opacity: 0, x: -100 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 100 }}
                        transition={{ duration: 0.5 }}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 20,
                            padding: '12px 24px',
                            background: `${color}10`,
                            border: `1px solid ${color}30`,
                            borderRadius: 8,
                            color: color,
                            fontFamily: 'monospace'
                        }}
                    >
                        <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: color, boxShadow: `0 0 10px ${color}` }} />
                        <Box sx={{ color: 'white' }}>Block #{block.hash}</Box>
                        <Box sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem' }}>{block.from} → {block.to}</Box>
                    </motion.div>
                ))}
            </AnimatePresence>
            
            {/* Background Lines */}
            <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: -1 }}>
                <line x1="10%" y1="0" x2="10%" y2="100%" stroke={color} strokeOpacity="0.1" strokeDasharray="5,5" />
                <line x1="90%" y1="0" x2="90%" y2="100%" stroke={color} strokeOpacity="0.1" strokeDasharray="5,5" />
            </svg>
        </Box>
    );
};
