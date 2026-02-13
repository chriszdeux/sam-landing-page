/**
 * Componente Icono Solis
 * Icono SVG personalizado utilizando Lucide React
 * Variante solar con props configurables
 */
import React from 'react';
import { Box } from '@mui/material';
import { Sun } from 'lucide-react';

interface SolisIconProps {
    size?: number;
    color?: string;
    style?: React.CSSProperties;
}

export const SolisIcon: React.FC<SolisIconProps> = ({ size = 20, color = '#ffb700', style }) => {
    return (
        <Box sx={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', ...style }}>
            <Sun size={size} color={color} fill={color} style={{ opacity: 0.8 }} />
        </Box>
    );
};
