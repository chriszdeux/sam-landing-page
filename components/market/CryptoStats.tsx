import React from 'react';
import { Grid, Typography } from '@mui/material';
import { Financial } from '../../lib/types/crypto';
import { Card } from '../ui/Card';
import { TaoIcon } from '../ui/TaoIcon';

interface CryptoStatsProps {
  financial: Financial;
  color?: string;
}

const StatItem = ({ label, value, subValue, color }: { label: string, value: React.ReactNode, subValue?: string, color?: string }) => (
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
        <Typography variant="body1" component="div" sx={{ fontWeight: 'bold', color: '#fff', display: 'flex', alignItems: 'center', gap: 0.5 }}>
            {value}
        </Typography>
        {subValue && <Typography variant="caption" sx={{ color: color || 'primary.main' }}>{subValue}</Typography>}
    </Card>
);

export const CryptoStats = ({ financial, color }: CryptoStatsProps) => {
  return (
    <Grid container spacing={2}>
        <Grid size={{ xs: 6, md: 6 }}>
            <StatItem 
                label="Capitalización de Mercado" 
                value={<>{financial.marketCap.toLocaleString()} <TaoIcon size={16} /></>}
                subValue={financial.limitMarketCap > 0 ? `Límite: ${financial.limitMarketCap.toLocaleString()}` : undefined}
            />
        </Grid>
        <Grid size={{ xs: 6, md: 6 }}>
            <StatItem 
                label="Volumen (24h)" 
                value={<>{financial.volume24h ? financial.volume24h.toLocaleString() : '0'} <TaoIcon size={16} /></>} 
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
                value={financial.isInfiniteSupply ? 'Infinito' : financial.totalSupply.toLocaleString()} 
                subValue={!financial.isInfiniteSupply && financial.maxSupply ? `Max: ${financial.maxSupply.toLocaleString()}` : undefined}
            />
        </Grid>
        <Grid size={{ xs: 6, md: 6 }}>
            <StatItem 
                label="Máximo Histórico" 
                value={<>{financial.allTimeHigh.toLocaleString()} <TaoIcon size={16} /></>} 
                subValue={financial.allTimeHighDate ? new Date(financial.allTimeHighDate).toLocaleDateString() : 'N/A'}
            />
        </Grid>
        <Grid size={{ xs: 6, md: 6 }}>
            <StatItem 
                label="Mínimo Histórico" 
                value={<>{financial.allTimeLow.toLocaleString()} <TaoIcon size={16} /></>} 
                subValue={financial.allTimeLowDate ? new Date(financial.allTimeLowDate).toLocaleDateString() : 'N/A'}
                color={color}
            />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
            <StatItem 
                label="Decimales" 
                value={financial.decimals?.toString() || 'N/A'} 
            />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
            <StatItem 
                label="Contrato" 
                value={financial.contractAddress ? `${financial.contractAddress.substring(0, 6)}...${financial.contractAddress.substring(financial.contractAddress.length - 4)}` : 'N/A'} 
                subValue={financial.contractAddress} // Full address in subvalue for visibility/copy potentially
            />
        </Grid>
    </Grid>
  );
};
