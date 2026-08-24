'use client';

import React from 'react';
import Image from 'next/image';
import { Button } from '../ui/Button';
import { Typography } from '../ui/Typography';
import { TaoIcon } from '../ui/TaoIcon';
import { Cryptocurrency } from '../../lib/types/crypto';

interface MarketTableViewProps {
  cryptos: Cryptocurrency[];
  onTrade: (e: React.MouseEvent, type: 'BUY' | 'SELL' | 'TRANSFER', cryptoId: string) => void;
  onRowClick: (cryptoId: string) => void;
}

export const MarketTableView = ({ cryptos, onTrade, onRowClick }: MarketTableViewProps) => {
  return (
    <div className="mb-8 overflow-hidden overflow-x-auto rounded-xl border border-white/10 bg-[rgba(10,10,20,0.6)] backdrop-blur-md">
      <table className="w-full min-w-[650px] border-collapse" aria-label="market table">
        <thead>
          <tr className="bg-white/[0.03]">
            <th className="border-b border-white/10 px-4 py-3 text-left font-bold text-foreground-muted">
              Token
            </th>
            <th className="border-b border-white/10 px-4 py-3 text-right font-bold text-foreground-muted">
              Precio
            </th>
            <th className="border-b border-white/10 px-4 py-3 text-right font-bold text-foreground-muted">
              Cambio 24h
            </th>
            <th className="hidden border-b border-white/10 px-4 py-3 text-right font-bold text-foreground-muted md:table-cell">
              Market Cap
            </th>
            <th className="hidden border-b border-white/10 px-4 py-3 text-right font-bold text-foreground-muted md:table-cell">
              Volumen (24h)
            </th>
            <th className="hidden border-b border-white/10 px-4 py-3 text-right font-bold text-foreground-muted lg:table-cell">
              Suministro
            </th>
            <th className="border-b border-white/10 px-4 py-3 text-center font-bold text-foreground-muted">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody>
          {cryptos.map((crypto) => {
            const isPositive = (crypto.financial.change24h || 0) >= 0;
            const rowColor = crypto.additionalInfo?.pColor || '#00f3ff';
            return (
              <tr
                key={crypto.id}
                onClick={() => onRowClick(crypto.id)}
                className="cursor-pointer [&_td]:border-b [&_td]:border-white/5 last:[&_td]:border-0 hover:bg-white/[0.03]"
              >
                <th scope="row" className="px-4 py-3 text-left font-normal text-white">
                  <div className="flex items-center gap-4">
                    <div
                      className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-[24%] bg-white/[0.03]"
                      style={{ border: `1px solid ${rowColor}40` }}
                    >
                      {crypto.identification.image128 ? (
                        <Image
                          src={crypto.identification.image128}
                          alt={crypto.identification.name}
                          fill
                          sizes="36px"
                          style={{ objectFit: 'contain', borderRadius: '24%' }}
                        />
                      ) : (
                        <Typography className="text-[0.9rem] font-bold text-white">
                          {crypto.identification.symbol[0]}
                        </Typography>
                      )}
                    </div>
                    <div>
                      <Typography variant="subtitle2" className="font-bold text-white">
                        {crypto.identification.symbol}
                      </Typography>
                      <Typography variant="caption" className="text-foreground-muted">
                        {crypto.identification.name}
                      </Typography>
                    </div>
                  </div>
                </th>
                <td className="px-4 py-3 text-right font-bold text-white">
                  <div className="inline-flex w-full items-center justify-end gap-1">
                    {(crypto.financial.price || 0).toLocaleString(undefined, { maximumFractionDigits: 5 })}
                    <TaoIcon size={16} />
                  </div>
                </td>
                <td className="px-4 py-3 text-right">
                  <div
                    className="inline-flex items-center gap-1 text-[0.85rem] font-bold"
                    style={{ color: isPositive ? '#00ff9d' : '#ff3333' }}
                  >
                    {isPositive ? '+' : ''}{(crypto.financial.change24h || 0).toFixed(2)}%
                  </div>
                </td>
                <td className="hidden px-4 py-3 text-right text-foreground-muted md:table-cell">
                  {crypto.financial.marketCap ? `${crypto.financial.marketCap.toLocaleString()} CR` : 'N/A'}
                </td>
                <td className="hidden px-4 py-3 text-right text-foreground-muted md:table-cell">
                  {crypto.financial.volume24h ? `${crypto.financial.volume24h.toLocaleString()} CR` : 'N/A'}
                </td>
                <td className="hidden px-4 py-3 text-right text-foreground-muted lg:table-cell">
                  {crypto.financial.circulatingSupply ? `${crypto.financial.circulatingSupply.toLocaleString()} ${crypto.identification.symbol}` : 'N/A'}
                </td>
                <td className="px-4 py-3 text-center" onClick={(e) => e.stopPropagation()}>
                  <div className="flex justify-center gap-2">
                    <Button
                      variant="outlined"
                      color="success"
                      size="small"
                      onClick={(e) => onTrade(e, 'BUY', crypto.id)}
                    >
                      Compra
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      onClick={(e) => onTrade(e, 'SELL', crypto.id)}
                    >
                      Venta
                    </Button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
