import React from 'react';
import { Box, Typography } from '@mui/material';

interface CountdownProps {
    targetDate: number;
    onComplete?: () => void;
}

export const Countdown = ({ targetDate, onComplete }: CountdownProps) => {
    const [timeLeft, setTimeLeft] = React.useState('');

    React.useEffect(() => {
        const calculateTimeLeft = () => {
            const difference = targetDate - Date.now();
            if (difference > 0) {
                const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
                const minutes = Math.floor((difference / 1000 / 60) % 60);
                const seconds = Math.floor((difference / 1000) % 60);
                setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
            } else {
                setTimeLeft('');
                if (onComplete) onComplete();
            }
        };
        calculateTimeLeft();
        const timer = setInterval(calculateTimeLeft, 1000);
        return () => clearInterval(timer);
    }, [targetDate, onComplete]);

    if (!timeLeft) return null;

    return (
        <Box sx={{ 
            bgcolor: 'rgba(0,0,0,0.6)',
            px: 1.5,
            py: 0.5,
            borderRadius: 1,
            border: '1px solid rgba(255,255,255,0.1)',
            display: 'inline-block',
            mt: 0.5,
            mb: 0.5
        }}>
            <Typography variant="caption" sx={{ color: '#00e676', fontWeight: 'bold', fontFamily: 'monospace' }}>
                {timeLeft}
            </Typography>
        </Box>
    );
};
