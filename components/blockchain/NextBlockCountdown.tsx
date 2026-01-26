"use client";

import React, { useEffect, useState } from 'react';
import { Box, Typography, Tooltip } from '@mui/material';
import { AccessTime } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../../lib/hooks';
import { fetchNextBlockTime } from '../../lib/features/blockchain/actions';

interface NextBlockCountdownProps {
    networkId: string;
}

export const NextBlockCountdown: React.FC<NextBlockCountdownProps> = ({ networkId }) => {
    const dispatch = useAppDispatch();
    const { nextBlockTime } = useAppSelector((state) => state.blockchain);
    const [timeLeft, setTimeLeft] = useState<string>('--:--');

    useEffect(() => {
        if (networkId) {
            dispatch(fetchNextBlockTime(networkId));
        }
    }, [dispatch, networkId]);

    useEffect(() => {
        if (!nextBlockTime) return;

        const calculateTime = () => {
            const now = Date.now();
            const diff = nextBlockTime - now;

            if (diff <= 0) {
                setTimeLeft('Processing...');
                if (diff < -2000) { 
                    dispatch(fetchNextBlockTime(networkId));
                }
            } else {
                const minutes = Math.floor(diff / 60000);
                const seconds = Math.floor((diff % 60000) / 1000);
                setTimeLeft(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
            }
        };

        // Calculate immediately
        calculateTime();

        const interval = setInterval(calculateTime, 1000);

        return () => clearInterval(interval);
    }, [nextBlockTime, dispatch, networkId]);


    return (
        <Tooltip title="Próximo bloque">
            <Box 
                sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 1,
                    bgcolor: 'rgba(0, 243, 255, 0.05)',
                    border: '1px solid rgba(0, 243, 255, 0.2)',
                    borderRadius: '16px',
                    px: 1.5,
                    py: 0.5,
                }}
            >
                <AccessTime sx={{ fontSize: 16, color: 'primary.main' }} />
                <Typography variant="body2" sx={{ color: 'primary.main', fontFamily: 'monospace', fontWeight: 'bold' }}>
                    {timeLeft}
                </Typography>
            </Box>
        </Tooltip>
    );
};
