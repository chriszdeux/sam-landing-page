// 1-Definir componente de estadísticas de criptomoneda
// 2-Renderizar grid de estadísticas financieras

//# 1-Definir componente de estadísticas de criptomoneda
import React from 'react';
import { Typography } from '../ui/Typography';
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
        <Typography variant="body2" className="mb-1 text-foreground-muted">{label}</Typography>
        <Typography variant="body1" component="div" className="flex items-center gap-1 font-bold text-white">
            {value}
        </Typography>
        {subValue && <Typography variant="caption" style={{ color: color || 'var(--primary)' }}>{subValue}</Typography>}
    </Card>
);

export const CryptoStats = ({ financial, color }: CryptoStatsProps) => {

    //# 2-Renderizar grid de estadísticas financieras
    return (
        <div className="grid grid-cols-2 gap-4">
            <div>
                <StatItem
                    label="Capitalización de Mercado"
                    value={<>{financial.marketCap.toLocaleString()} <TaoIcon size={16} /></>}
                />
            </div>
            <div>
                <StatItem
                    label="Volumen (24h)"
                    value={<>{financial.volume24h ? financial.volume24h.toLocaleString() : '0'} <TaoIcon size={16} /></>}
                />
            </div>
            <div>
                <StatItem
                    label="Liquidez (Trading)"
                    value={financial.supplyToTrade ? financial.supplyToTrade.toLocaleString() : '0'}
                />
            </div>
            <div>
                <StatItem
                    label="Suministro Total"
                    value={financial.isInfiniteSupply ? 'Infinito' : financial.totalSupply.toLocaleString()}
                    subValue={!financial.isInfiniteSupply && financial.maxSupply ? `Max: ${financial.maxSupply.toLocaleString()}` : undefined}
                />
            </div>
            <div>
                <StatItem
                    label="Máximo Histórico"
                    value={<>{financial.allTimeHigh.toLocaleString()} <TaoIcon size={16} /></>}
                    subValue={financial.allTimeHighDate ? new Date(financial.allTimeHighDate).toLocaleDateString() : 'N/A'}
                />
            </div>
            <div>
                <StatItem
                    label="Mínimo Histórico"
                    value={<>{financial.allTimeLow.toLocaleString()} <TaoIcon size={16} /></>}
                    subValue={financial.allTimeLowDate ? new Date(financial.allTimeLowDate).toLocaleDateString() : 'N/A'}
                    color={color}
                />
            </div>
            <div className="col-span-2 md:col-span-1">
                <StatItem
                    label="Decimales"
                    value={financial.decimals?.toString() || 'N/A'}
                />
            </div>
            <div className="col-span-2 md:col-span-1">
                <StatItem
                    label="Contrato"
                    value={financial.contractAddress ? `${financial.contractAddress.substring(0, 6)}...${financial.contractAddress.substring(financial.contractAddress.length - 4)}` : 'N/A'}
                    subValue={financial.contractAddress}
                />
            </div>
        </div>
    );
};
