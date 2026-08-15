// 1-Definir vista de detalles de criptomoneda
// 2-Obtener estado global, autenticación y configuración
// 3-Manejar navegación a transacción
// 4-Renderizar vista de carga o error
// 5-Renderizar detalles completos de la criptomoneda

//# 1-Definir vista de detalles de criptomoneda
'use client';

import React from 'react';
import { Typography } from '../ui/Typography';
import { Button } from '../ui/Button';
import { ParticleBackground } from '../ui/ParticleBackground';
import { ArrowLeft, TrendingUp, TrendingDown, Clock, Code, ShoppingCart, DollarSign } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { CryptoChart } from './CryptoChart';
import { CryptoStats } from './CryptoStats';
import { TransactionHistory } from './TransactionHistory';
import { MarketSentiment } from './MarketSentiment';
import { Card } from '../ui/Card';
import { TaoIcon } from '../ui/TaoIcon';

import { useAppDispatch, useAppSelector } from '../../lib/hooks';
import { addNotification } from '../../lib/features/uiSlice';

interface CryptoDetailViewProps {
    id: string;
}

export const CryptoDetailView = ({ id }: CryptoDetailViewProps) => {
    const router = useRouter();

    //# 2-Obtener estado global, autenticación y configuración
    const dispatch = useAppDispatch();
    const { cryptos, isLoading } = useAppSelector((state) => state.market);
    const { token } = useAppSelector((state) => state.auth);

    const [selectedRange, setSelectedRange] = React.useState('1d');

    const crypto = cryptos.find((c) => c.id === id);

    //# 3-Manejar navegación a transacción
    const handleTransaction = (type: 'BUY' | 'SELL' | 'TRANSFER') => {
        if (!token) {
            dispatch(addNotification({
                type: 'warning',
                message: 'Operación restringida: Debes iniciar sesión para realizar transacciones.'
            }));
            return;
        }
        router.push(`/market/trade?type=${type}&cryptoId=${id}&redirect=detail`);
    };

    //# 4-Renderizar vista de carga o error
    if (isLoading && !crypto) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-black">
               <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-primary" />
            </div>
        );
    }

    if (!crypto) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-black">
                <Typography variant="h5" className="text-error">Criptomoneda no encontrada</Typography>
                <Button onClick={() => router.push('/market')} variant="outlined">Volver al Mercado</Button>
            </div>
        );
    }

    const isPositive = (crypto.financial.change24h || 0) >= 0;
    const color = isPositive ? '#00ff88' : '#ff0055';
    const description = crypto.additionalInfo?.description || [
        `${crypto.identification.name} is a cryptocurrency on the ${crypto.network.name} network.`
    ];

    //# 5-Renderizar detalles completos de la criptomoneda
    return (
        <div className="relative min-h-screen overflow-hidden pt-20 pb-20">
            <ParticleBackground />

            <div className="mx-auto w-full max-w-[1536px] px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col gap-8">
                    <Button
                        startIcon={<ArrowLeft />}
                        onClick={() => router.back()}
                        sx={{ color: 'text.secondary', width: 'fit-content', '&:hover': { color: 'primary.main' } }}
                    >
                        Volver al Mercado
                    </Button>

                    <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
                        <div className="flex flex-row items-center gap-4">
                            <div
                                className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-[24%] text-lg font-bold text-white"
                                style={{ backgroundColor: crypto.additionalInfo?.pColor || '#00f3ff' }}
                            >
                                {crypto.identification.image256 || crypto.identification.image128 ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img
                                        src={crypto.identification.image256 || crypto.identification.image128}
                                        alt={crypto.identification.name}
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    crypto.identification.symbol[0]
                                )}
                            </div>
                            <div>
                                <Typography variant="h3" className="font-bold text-white">
                                    {crypto.identification.name} <Typography component="span" variant="h5" className="ml-2 text-foreground-muted">{crypto.identification.symbol}</Typography>
                                </Typography>
                                <div className="mt-2 flex flex-row gap-2">
                                    <span className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-xs text-white">Rank #N/A</span>
                                    <span className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-xs text-white">Coin</span>
                                    <span className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-xs text-white">{crypto.network.name}</span>
                                    {crypto.isActive !== undefined && (
                                        <span
                                            className="inline-flex items-center rounded-full border px-3 py-1 text-xs"
                                            style={{
                                                backgroundColor: crypto.isActive ? 'rgba(0, 255, 136, 0.1)' : 'rgba(255, 0, 85, 0.1)',
                                                color: crypto.isActive ? '#00ff88' : '#ff0055',
                                                borderColor: crypto.isActive ? '#00ff88' : '#ff0055',
                                            }}
                                        >
                                            {crypto.isActive ? 'Activo' : 'Inactivo'}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="text-left md:text-right">
                            <Typography variant="h3" className="flex items-center justify-start gap-2 font-bold text-white md:justify-end">
                                {crypto.financial.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
                                <TaoIcon size={32} />
                            </Typography>
                            <div className="flex flex-row items-center justify-start gap-2 md:justify-end">
                                <span
                                    className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm font-bold"
                                    style={{
                                        backgroundColor: isPositive ? 'rgba(0, 255, 136, 0.1)' : 'rgba(255, 0, 85, 0.1)',
                                        color,
                                    }}
                                >
                                    {isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                                    {`${isPositive ? '+' : ''}${crypto.financial.change24h?.toFixed(2)}% (24h)`}
                                </span>
                            </div>
                        </div>
                    </div>

                    <hr className="border-t border-white/10" />

                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
                        <div className="lg:col-span-8">
                            <div className="flex flex-col gap-8">
                                <div>
                                    <div className="mb-4 flex flex-row items-center justify-between">
                                        <Typography variant="h5" className="font-bold text-white">Rendimiento</Typography>
                                        <div className="flex flex-row gap-2">
                                            {['1h', '6h', '1d', '7d', '1m', '3m', '12m', 'all'].map((tf) => (
                                                <button
                                                    key={tf}
                                                    onClick={() => setSelectedRange(tf)}
                                                    className={`min-w-fit rounded px-2 py-1 text-sm uppercase transition-colors ${tf === selectedRange ? 'bg-[#00f3ff]/10 text-primary' : 'bg-transparent text-foreground-muted'}`}
                                                >
                                                    {tf}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <CryptoChart color={color} cryptoId={id} range={selectedRange} />
                                </div>

                                <div>
                                     <MarketSentiment cryptoId={id} />
                                     <TransactionHistory walletId={crypto.financial.contractAddress} />
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-4">
                            <div className="flex flex-col gap-8">
                                <div className="flex flex-row gap-4">
                                    <Button
                                        fullWidth
                                        variant="contained"
                                        startIcon={<ShoppingCart />}
                                        onClick={() => handleTransaction('BUY')}
                                        sx={{
                                            bgcolor: '#00ff88',
                                            color: '#000',
                                            fontWeight: 'bold',
                                            '&:hover': { bgcolor: '#00cc6a' }
                                        }}
                                    >
                                        Comprar
                                    </Button>
                                    <Button
                                        fullWidth
                                        variant="outlined"
                                        startIcon={<DollarSign />}
                                        onClick={() => handleTransaction('SELL')}
                                        sx={{
                                            color: '#ff0055',
                                            borderColor: '#ff0055',
                                            fontWeight: 'bold',
                                            '&:hover': {
                                                bgcolor: 'rgba(255, 0, 85, 0.1)',
                                                borderColor: '#ff0055'
                                            }
                                        }}
                                    >
                                        Vender
                                    </Button>
                                </div>
                                <div>
                                    <Typography variant="h6" className="mb-4 inline-block border-b-2 border-primary pb-1 text-white">
                                        Estadísticas de Mercado
                                    </Typography>
                                    <CryptoStats financial={crypto.financial} color={color} />
                                </div>

                                <Card glowColor={crypto.additionalInfo?.pColor || color} sx={{ p: 3, border: `1px solid ${crypto.additionalInfo?.pColor || 'rgba(255,255,255,0.1)'}40` }}>
                                    <Typography variant="h6" className="mb-4 flex items-center gap-2 text-white">
                                        Sobre {crypto.identification.name}
                                        {crypto.additionalInfo?.pColor && (
                                            <span
                                                className="h-3 w-3 rounded-full"
                                                style={{ backgroundColor: crypto.additionalInfo.pColor, boxShadow: `0 0 10px ${crypto.additionalInfo.pColor}` }}
                                            />
                                        )}
                                    </Typography>

                                    <div className="mb-6">
                                        {description.map((desc, i) => (
                                            <Typography key={i} variant="body2" className="mb-3 leading-[1.8] text-foreground-muted">
                                                {desc}
                                            </Typography>
                                        ))}
                                    </div>

                                    <hr className="my-4" style={{ borderColor: `${crypto.additionalInfo?.sColor || 'rgba(255,255,255,0.1)'}40` }} />

                                    <div className="flex flex-col gap-4">
                                        <div className="flex flex-row items-center gap-2">
                                            <Clock size={16} style={{ color: crypto.additionalInfo?.pColor || '#00f3ff' }} />
                                            <Typography variant="body2" className="text-foreground-muted">
                                                <span className="font-bold text-foreground">Creado:</span> {crypto.additionalInfo?.dateCreated ? new Date(crypto.additionalInfo.dateCreated).toLocaleDateString() : 'Desconocido'}
                                            </Typography>
                                        </div>

                                        {crypto.updatedAt && (
                                            <div className="flex flex-row items-center gap-2">
                                                <Clock size={16} style={{ color: crypto.additionalInfo?.sColor || undefined }} className={!crypto.additionalInfo?.sColor ? 'text-foreground-muted' : undefined} />
                                                <Typography variant="body2" className="text-foreground-muted">
                                                    <span className="font-bold text-foreground">Actualizado:</span> {new Date(crypto.updatedAt).toLocaleString('en-US')}
                                                </Typography>
                                            </div>
                                        )}

                                        <div>
                                            <div className="mb-1 flex flex-row items-center gap-2">
                                                <Code size={16} style={{ color: crypto.additionalInfo?.pColor || '#00f3ff' }} />
                                                <Typography variant="body2" className="font-bold text-foreground">
                                                    Developers:
                                                </Typography>
                                            </div>
                                            <div className="flex flex-row flex-wrap gap-2">
                                                {crypto.additionalInfo?.developers && crypto.additionalInfo.developers.length > 0 ? (
                                                    crypto.additionalInfo.developers.map((dev, index) => (
                                                        <span
                                                            key={index}
                                                            className="inline-flex items-center rounded-full border px-3 py-1 text-xs"
                                                            style={{
                                                                color: crypto.additionalInfo?.sColor || undefined,
                                                                borderColor: `${crypto.additionalInfo?.pColor || 'rgba(255,255,255,0.2)'}60`,
                                                                backgroundColor: `${crypto.additionalInfo?.pColor || '#ffffff'}10`,
                                                            }}
                                                        >
                                                            {dev}
                                                        </span>
                                                    ))
                                                ) : (
                                                    <Typography variant="caption" className="text-foreground-muted">N/A</Typography>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
