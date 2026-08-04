'use client';

import React from 'react';
import { Box, Typography, Tooltip } from '@mui/material';
import { Bolt } from '@mui/icons-material';
import { useAppSelector } from '../../lib/hooks';
import { RootState } from '../../lib/store';
import { motion } from 'framer-motion';
import { formatHash } from '../../lib/utils/formatHash';

export const LabNavbarIndicator = () => {
    const indicatorData = useAppSelector((state: RootState) => {
        const selectedNetwork = state.blockchain.selectedNetwork;
        return {
            hashAvailable: selectedNetwork?.hashAvailable ?? 0,
            isPoweredOn: state.reducerLabs.isPoweredOn,
            chronoBurstFreqTypes: state.blockchain.chronoBurstFreqTypes
        };
    }, (prev, next) => {
        if (prev === null && next === null) return true;
        if (prev === null || next === null) return false;
        return (
            prev.hashAvailable === next.hashAvailable &&
            prev.isPoweredOn === next.isPoweredOn &&
            prev.chronoBurstFreqTypes === next.chronoBurstFreqTypes
        );
    });
    
    if (!indicatorData) return null;

    const { hashAvailable, isPoweredOn, chronoBurstFreqTypes } = indicatorData;
    const formattedHash = formatHash(hashAvailable, chronoBurstFreqTypes);

    return (
        <Tooltip title={`Hash Disponible: ${formattedHash}`}>
            <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1, 
                px: 1.5, 
                py: 0.5, 
                bgcolor: 'rgba(255,255,255,0.03)', 
                borderRadius: 1,
                border: '1px solid rgba(255,255,255,0.05)',
                cursor: 'default'
            }}>
                <motion.div
                    animate={isPoweredOn ? { 
                        color: ['#00f3ff', '#fff', '#00f3ff'],
                        scale: [1, 1.1, 1]
                    } : { color: 'rgba(255,255,255,0.2)' }}
                    transition={{ repeat: Infinity, duration: 2 }}
                >
                    <Bolt sx={{ fontSize: 18 }} />
                </motion.div>
                
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="caption" sx={{ color: '#00f3ff', fontWeight: 'bold', fontSize: '0.75rem', fontFamily: 'monospace' }}>
                        {formattedHash}
                    </Typography>
                </Box>
            </Box>
        </Tooltip>
    );
};
