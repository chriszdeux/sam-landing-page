import React from 'react';
import { Grid, Typography } from '@mui/material';
import { Financial } from '../../lib/types/crypto';
import { Card } from '../ui/Card';

interface CryptoStatsProps {
  financial: Financial;
  color?: string;
}

const StatItem = ({ label, value, subValue, color }: { label: string, value: string, subValue?: string, color?: string }) => (
    <Card 
        glowColor={color}
        sx={{ 
            p: 2, 
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
    }}>
        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>{label}</Typography>
        <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#fff' }}>{value}</Typography>
        {subValue && <Typography variant="caption" sx={{ color: color || 'primary.main' }}>{subValue}</Typography>}
    </Card>
);

export const CryptoStats = ({ financial, color }: CryptoStatsProps) => {
  return (
    <Grid container spacing={2}>
        <Grid size={{ xs: 6, md: 6 }}>
            <StatItem 
                label="Capitalización de Mercado" 
                value={`$${financial.marketCap.toLocaleString()}`} 
            />
        </Grid>
        <Grid size={{ xs: 6, md: 6 }}>
            <StatItem 
                label="Volumen (24h)" 
                value={`$${financial.volume24h ? financial.volume24h.toLocaleString() : 'N/A'}`} 
            />
        </Grid>
        <Grid size={{ xs: 6, md: 6 }}>
            <StatItem 
                label="Suministro Circulante" 
                value={financial.circulatingSupply.toLocaleString()} 
            />
        </Grid>
        <Grid size={{ xs: 6, md: 6 }}>
            <StatItem 
                label="Suministro Total" 
                value={financial.totalSupply.toLocaleString()} 
                subValue={financial.maxSupply ? `Max: ${financial.maxSupply.toLocaleString()}` : 'Infinito'}
            />
        </Grid>
        <Grid size={{ xs: 6, md: 6 }}>
            <StatItem 
                label="Máximo Histórico" 
                value={`$${financial.allTimeHigh.toLocaleString()}`} 
                subValue={new Date(financial.allTimeHighDate).toLocaleDateString()}
            />
        </Grid>
         <Grid size={{ xs: 6, md: 6 }}>
            <StatItem 
                label="Mínimo Histórico" 
                value={`$${financial.allTimeLow.toLocaleString()}`} 
                subValue={new Date(financial.allTimeLowDate).toLocaleDateString()}
                color={color}
            />
        </Grid>
    </Grid>
  );
};
