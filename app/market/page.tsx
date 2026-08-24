// 1-Efecto secundario para sincronización del ciclo de vida
// 2-Obtención del despachador para emitir acciones al store
// 3-Obtención del despachador para emitir acciones al store
// 4-Selección de datos desde el estado global de Redux
// 5-Selección de datos desde el estado global de Redux
// 6-Selección de datos desde el estado global de Redux
// 7-Efecto secundario para sincronización del ciclo de vida
// 8-Manejo de lógica de usuario para handleTransaction
// 9-Estructuración y renderizado visual del componente UI

'use client';

//# 1-Efecto secundario para sincronización del ciclo de vida
import React, { useEffect, useState } from 'react';
import { Grid3x3, List } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Background } from '../../components/layout/Background';
import { TechFrame } from '../../components/ui/TechFrame';
import { PageHeader } from '../../components/ui/PageHeader';
import { Reveal } from '../../components/ui/TextReveal';
import { Button } from '../../components/ui/Button';
import { Typography } from '../../components/ui/Typography';
import { motion } from 'framer-motion';
import { TaoIcon } from '../../components/ui/TaoIcon';

//# 2-Obtención del despachador para emitir acciones al store
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../lib/store';
import { fetchCryptos } from '../../lib/features/market/actions';
import { addNotification } from '../../lib/features/uiSlice';
import { BlockchainDataDisplay } from '../../components/market/BlockchainDataDisplay';
import { MarketTableView } from '../../components/market/MarketTableView';

export default function MarketPage() {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');

  //# 3-Obtención del despachador para emitir acciones al store
  const dispatch = useDispatch<AppDispatch>();


  //# 4-Selección de datos desde el estado global de Redux
  const { cryptos, isLoading, error } = useSelector((state: RootState) => state.market);


  //# 5-Selección de datos desde el estado global de Redux
  const { selectedNetwork } = useSelector((state: RootState) => state.blockchain);


  //# 6-Selección de datos desde el estado global de Redux
  const { token } = useSelector((state: RootState) => state.auth);



  //# 7-Efecto secundario para sincronización del ciclo de vida
  useEffect(() => {
    if (selectedNetwork?.id) {
        dispatch(fetchCryptos(selectedNetwork.id));
    }
  }, [dispatch, selectedNetwork?.id]);



  //# 8-Manejo de lógica de usuario para handleTransaction
  const handleTransaction = (e: React.MouseEvent, type: 'BUY' | 'SELL' | 'TRANSFER', cryptoId: string) => {
    e.stopPropagation();

    if (!token) {
        dispatch(addNotification({
            type: 'warning',
            message: 'Operación restringida: Debes iniciar sesión para realizar transacciones.'
        }));
        return;
    }

    router.push(`/market/trade?type=${type}&cryptoId=${cryptoId}&redirect=market`);
  };



  //# 9-Estructuración y renderizado visual del componente UI
  return (
    <div className="relative min-h-screen">
      <Background />

      <div className="relative z-[1] mx-auto w-full max-w-[1536px] px-4 pt-32 pb-20 sm:px-6 lg:px-8">
        <PageHeader
            title="Mercado Galáctico"
            subtitle="Intercambia activos digitales en tiempo real a través del sistema multi-cadena."
            color="#00f3ff"
        />

        <BlockchainDataDisplay network={selectedNetwork} />

        <Reveal className="mt-8 mb-8 flex items-center justify-between">
          <Typography variant="h4" className="text-white">Activos Listados</Typography>
          <div className="flex gap-2">
            {/* La vista activa se marca con el relleno, no con otro color. */}
            <Button
              variant={viewMode === 'cards' ? 'contained' : 'outlined'}
              color="info"
              size="small"
              onClick={() => setViewMode('cards')}
              startIcon={<Grid3x3 size={18} />}
            >
              Tarjetas
            </Button>
            <Button
              variant={viewMode === 'table' ? 'contained' : 'outlined'}
              color="info"
              size="small"
              onClick={() => setViewMode('table')}
              startIcon={<List size={18} />}
            >
              Tabla
            </Button>
          </div>
        </Reveal>

        {isLoading ? (
            <div className="my-20 flex justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-[#00f3ff]" />
            </div>
        ) : error ? (
            <Typography className="text-center text-error">Error al cargar datos: {error}</Typography>
        ) : viewMode === 'table' ? (
            <MarketTableView
              cryptos={cryptos}
              onTrade={handleTransaction}
              onRowClick={(id) => router.push(`/market/${id}`)}
            />
        ) : (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4">
            {cryptos.map((crypto, index) => (
                <motion.div
                    key={crypto.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    style={{ height: '100%' }}
                >
                    <TechFrame
                    onClick={() => router.push(`/market/${crypto.id}`)}
                    color={crypto.additionalInfo?.pColor || '#00f3ff'}
                    className="h-full w-full"
                >
                    <div className="relative flex h-full w-full flex-col items-center justify-between p-6">
                    <div
                        className="pointer-events-none absolute left-1/2 top-[30%] z-0 h-[180px] w-[180px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.15] blur-[80px]"
                        style={{ background: crypto.additionalInfo?.pColor || 'var(--primary)' }}
                    />

                    <div className="z-[1] mb-2 flex w-full items-start justify-between">
                        <div className="text-left">
                             <Typography variant="h6" className="font-bold leading-[1.1] text-white">{crypto.identification.symbol}</Typography>
                             <Typography variant="caption" className="text-[0.7rem] text-foreground-muted">{crypto.identification.name}</Typography>
                        </div>
                        <div className="rounded border border-white/5 bg-white/[0.03] px-2 py-1 text-[0.65rem] font-bold tracking-wide text-foreground-muted">
                            COIN
                        </div>
                    </div>

                    <div className="group relative z-[1] my-4 flex h-[160px] w-[160px] items-center justify-center transition-transform duration-[400ms] [transition-timing-function:cubic-bezier(0.34,1.56,0.64,1)] hover:scale-110 hover:-translate-y-1 [filter:drop-shadow(0_10px_20px_rgba(0,0,0,0.3))]">
                        {crypto.identification.image128 ? (
                             <Image
                                src={crypto.identification.image128}
                                alt={crypto.identification.name}
                                fill
                                sizes="160px"
                                style={{ objectFit: 'contain', borderRadius: '24%' }}
                            />
                        ) : (
                             <div
                                className="flex h-[120px] w-[120px] items-center justify-center rounded-[24%] text-[3.5rem] font-bold text-white"
                                style={{
                                    backgroundColor: crypto.additionalInfo?.pColor || 'var(--primary)',
                                    boxShadow: `0 0 30px ${(crypto.additionalInfo?.pColor || '#00f3ff')}40`,
                                }}
                            >
                                {crypto.identification.symbol[0]}
                            </div>
                        )}
                    </div>


                    <div className="z-[1] mb-6 w-full text-center">
                        <Typography variant="h4" className="mb-1 flex items-center justify-center gap-2 font-bold text-white">
                            {(crypto.financial.price || 0).toLocaleString(undefined, { maximumFractionDigits: 5 })}
                            <TaoIcon size={28} />
                        </Typography>

                        <div
                            className="inline-flex items-center justify-center rounded-full border px-3 py-1"
                            style={{
                                backgroundColor: (crypto.financial.change24h || 0) >= 0 ? 'rgba(0, 255, 157, 0.08)' : 'rgba(255, 51, 51, 0.08)',
                                borderColor: (crypto.financial.change24h || 0) >= 0 ? 'rgba(0, 255, 157, 0.2)' : 'rgba(255, 51, 51, 0.2)',
                            }}
                        >
                             <Typography
                                variant="body2"
                                className="font-bold"
                                style={{ color: (crypto.financial.change24h || 0) >= 0 ? '#00ff9d' : '#ff3333' }}
                             >
                                {(crypto.financial.change24h || 0) > 0 ? '+' : ''}{(crypto.financial.change24h || 0).toFixed(2)}%
                             </Typography>
                            <Typography variant="caption" className="ml-1 text-foreground-muted">24h</Typography>
                        </div>
                    </div>

                    <div className="z-[1] mt-auto grid w-full grid-cols-2 gap-2">
                        <Button
                            variant="outlined"
                            color="success"
                            size="small"
                            onClick={(e) => handleTransaction(e, 'BUY', crypto.id)}
                        >
                            COMPRAR
                        </Button>
                        <Button
                            variant="outlined"
                            color="error"
                            size="small"
                            onClick={(e) => handleTransaction(e, 'SELL', crypto.id)}
                        >
                            VENDER
                        </Button>
                    </div>
                    </div>
                </TechFrame>
                </motion.div>
            ))}
            </div>
        )}
      </div>
    </div>
  );
}
