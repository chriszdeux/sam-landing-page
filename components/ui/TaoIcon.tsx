// 1-Definir componente de icono Tao animado
// 2-Renderizar icono con animación Framer Motion

//# 1-Definir componente de icono Tao animado
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
    const color = customColor || 'var(--neon-cyan, #00f3ff)';
    
    //# 2-Renderizar icono con animación Framer Motion
    return (
        <Typography 
            component={motion.span}
            initial={{ opacity: 0.8 }}
            animate={{ 
                opacity: [0.8, 1, 0.8],
                textShadow: [
                    `0 0 0px ${color === 'var(--neon-cyan, #00f3ff)' ? '#00f3ff00' : color + '00'}`,
                    `0 0 10px ${color === 'var(--neon-cyan, #00f3ff)' ? '#00f3ff80' : color + '80'}`,
                    `0 0 0px ${color === 'var(--neon-cyan, #00f3ff)' ? '#00f3ff00' : color + '00'}`
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
                alignItems: 'baseline',
                letterSpacing: 1,
                ml: 0.5,
                verticalAlign: 'middle',
                ...style 
            }}
        >
            {EnvVariables.coin1}
        </Typography>
    );
};
