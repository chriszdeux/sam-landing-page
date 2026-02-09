import React from 'react';
import { Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { EnvVariables } from '@/lib/constants/variables';
import { cyan } from '@mui/material/colors';

interface TaoIconProps {
    size?: number;
    color?: string;
    style?: React.CSSProperties;
}

export const TaoIcon: React.FC<TaoIconProps> = ({ size = 12, color: customColor, style}) => { 
    const color = customColor || cyan[200];
    return (
        <Typography 
            component={motion.span}
            initial={{ opacity: 0.8 }}
            animate={{ 
                opacity: [0.8, 1, 0.8],
                textShadow: [
                    `0 0 0px ${color}00`,
                    `0 0 10px ${color}80`,
                    `0 0 0px ${color}00`
                ]
            }}
            transition={{ 
                duration: 2, 
                repeat: Infinity,
                ease: "easeInOut"
            }}
            sx={{ 
                color: color,
                fontWeight: 900, 
                fontSize: size,
                fontFamily: 'monospace',
                lineHeight: 1,
                display: 'inline-flex',
                alignItems: 'baseline', // Align with text baseline
                letterSpacing: 1,
                ml: 0.5, // Small margin left for spacing after numbers
                verticalAlign: 'middle',
                ...style 
            }}
        >
            {EnvVariables.coin1}
        </Typography>
    );
};
