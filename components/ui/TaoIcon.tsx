import React from 'react';
import { Box } from '@mui/material';
import { IMAGES } from '../../lib/constants/images';

interface TaoIconProps {
    size?: number;
    style?: React.CSSProperties;
}

export const TaoIcon: React.FC<TaoIconProps> = ({ size = 20, style }) => {
    return (
        <Box 
            component="img" 
            src={IMAGES.TAO} 
            alt="TAO" 
            sx={{ 
                width: size, 
                height: size, 
                objectFit: 'contain', 
                verticalAlign: 'middle',
                display: 'inline-block',
                ...style 
            }} 
        />
    );
};
