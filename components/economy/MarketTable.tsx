// 1-Importar dependencias y slices de economía
// 2-Obtener estado y despachador de Redux
// 3-Sincronizar lista de activos del mercado
// 4-Manejar interacción y paginación
// 5-Renderizar tabla de activos del mercado

'use client';

//# 1-Importar dependencias y slices de economía
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { TrendingUp, TrendingDown, Activity, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Typography } from '../ui/Typography';
import { Button } from '../ui/Button';


import { useAppDispatch, useAppSelector } from '../../lib/hooks';
import { fetchAssets, setPage } from '../../lib/features/economySlice';



export const MarketTable = () => {
  const router = useRouter();

  //# 2-Obtener estado y despachador de Redux
  const dispatch = useAppDispatch();


  const { assets, loading, error, page, totalPages } = useAppSelector((state) => state.economy);



  //# 3-Sincronizar lista de activos del mercado
  useEffect(() => {
    dispatch(fetchAssets({ page, limit: 10 }));
  }, [page, dispatch]);



  //# 4-Manejar interacción y paginación
  const handlePageChange = (value: number) => {
    dispatch(setPage(value));
  };




  const handleRowClick = (id: string) => {
    router.push(`/economia-real/${id}`);
  };

  if (loading && assets.length === 0) {


    //# 5-Renderizar tabla de activos del mercado
    return (
      <div className="flex justify-center p-8">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-[#00f3ff]" />
      </div>
    );
  }

  if (error) {


    //# 9-Estructuración y renderizado visual del componente UI
    return (
      <div className="mb-4 flex items-start gap-2 rounded border-l-4 border-error bg-error/10 p-3 text-sm text-error">
        {error}
      </div>
    );
  }



  //# 10-Estructuración y renderizado visual del componente UI
  return (
    <div>
      <div className="mb-8 overflow-hidden overflow-x-auto rounded-2xl border border-white/10 bg-[rgba(10,10,26,0.8)] backdrop-blur-md">
        <table className="w-full min-w-[650px] border-collapse" aria-label="market table">
          <thead>
            <tr className="bg-white/5">
              <th className="px-4 py-3 text-left text-sm font-bold text-foreground-muted">Nombre</th>
              <th className="px-4 py-3 text-right text-sm font-bold text-foreground-muted">Precio</th>
              <th className="px-4 py-3 text-right text-sm font-bold text-foreground-muted">24h %</th>
              <th className="px-4 py-3 text-right text-sm font-bold text-foreground-muted">Market Cap</th>
              <th className="px-4 py-3 text-right text-sm font-bold text-foreground-muted">Volumen (24h)</th>
              <th className="px-4 py-3 text-right text-sm font-bold text-foreground-muted">Suministro</th>
              <th className="px-4 py-3 text-center text-sm font-bold text-foreground-muted">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {assets?.map((row, index) => {



              //# 11-Estructuración y renderizado visual del componente UI
              return (
                <motion.tr
                  key={row.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="cursor-pointer border-b border-white/5 last:border-0 hover:bg-white/[0.03]"
                  onClick={() => handleRowClick(row.id)}
                >
                  <td className="px-4 py-3 text-white">
                    <div className="flex flex-row items-center gap-4">
                      <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-[#00f3ff]/10">
                        {row.identification.image128 ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={row.identification.image128} alt={row.identification.symbol} className="h-full w-full object-cover" />
                        ) : (
                          <Activity size={18} />
                        )}
                      </div>
                      <div>
                        <Typography variant="subtitle2" className="font-bold">
                          {row.identification.name}
                        </Typography>
                        <Typography variant="caption" className="text-foreground-muted">
                          {row.identification.symbol}
                        </Typography>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right font-bold text-white">
                    ${row.financial.price}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div
                      className="flex flex-row items-center justify-end gap-1"
                      style={{ color: row.financial.change24h >= 0 ? '#00ff88' : '#ff0055' }}
                    >
                      {row.financial.change24h >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                      <Typography variant="body2" className="font-bold" style={{ color: 'inherit' }}>
                        {Math.abs(row.financial.change24h)}%
                      </Typography>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right text-foreground-muted">
                    {row.financial.marketCap || 'N/A'}
                  </td>
                  <td className="px-4 py-3 text-right text-foreground-muted">
                    {row.financial.volume || 'N/A'}
                  </td>
                  <td className="px-4 py-3 text-right text-foreground-muted">
                    {row.financial.supply ? `${row.financial.supply} ${row.identification.symbol}` : 'N/A'}
                  </td>
                  <td className="px-4 py-3 text-center" onClick={(e) => e.stopPropagation()}>
                    <div className="flex flex-row justify-center gap-2">
                      <Button
                        variant="outlined"
                        color="success"
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/economia-real/${row.id}`);
                        }}
                      >
                        Comprar
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/economia-real/${row.id}`);
                        }}
                      >
                        Vender
                      </Button>
                    </div>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-8 flex items-center justify-center gap-1">
        <button
          onClick={() => handlePageChange(Math.max(1, page - 1))}
          disabled={page <= 1}
          className="rounded p-1 text-white transition-colors hover:bg-white/10 disabled:opacity-30"
        >
          <ChevronLeft size={20} />
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
          <button
            key={p}
            onClick={() => handlePageChange(p)}
            className={`h-8 w-8 rounded text-sm transition-colors ${
              p === page ? 'bg-[#00f3ff]/20 text-white' : 'text-white/70 hover:bg-white/10'
            }`}
          >
            {p}
          </button>
        ))}
        <button
          onClick={() => handlePageChange(Math.min(totalPages, page + 1))}
          disabled={page >= totalPages}
          className="rounded p-1 text-white transition-colors hover:bg-white/10 disabled:opacity-30"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
};
