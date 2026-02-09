import React from 'react';
import { Box } from '@mui/material';
import { Zap } from 'lucide-react';

interface LynIconProps {
    size?: number;
    color?: string;
    style?: React.CSSProperties;
}

export const LynIcon: React.FC<LynIconProps> = ({ size = 20, color = '#00f3ff', style }) => {
    return (
        <Box sx={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', ...style }}>
            <Zap size={size} color={color} fill={color} style={{ opacity: 0.8 }} />
        </Box>
    );
};
