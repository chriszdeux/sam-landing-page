'use client';

import React from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Button,
} from '@mui/material';
import Image from 'next/image';
import { TaoIcon } from '../ui/TaoIcon';
import { Cryptocurrency } from '../../lib/types/crypto';

interface MarketTableViewProps {
  cryptos: Cryptocurrency[];
  onTrade: (e: React.MouseEvent, type: 'BUY' | 'SELL' | 'TRANSFER', cryptoId: string) => void;
  onRowClick: (cryptoId: string) => void;
}

export const MarketTableView = ({ cryptos, onTrade, onRowClick }: MarketTableViewProps) => {
  return (
    <TableContainer
      component={Paper}
      sx={{
        bgcolor: 'rgba(10, 10, 20, 0.6)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        borderRadius: 3,
        overflow: 'hidden',
        mb: 4,
      }}
    >
      <Table sx={{ minWidth: 650 }} aria-label="market table">
        <TableHead>
          <TableRow sx={{ bgcolor: 'rgba(255, 255, 255, 0.03)' }}>
            <TableCell sx={{ color: 'text.secondary', fontWeight: 'bold', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
              Token
            </TableCell>
            <TableCell align="right" sx={{ color: 'text.secondary', fontWeight: 'bold', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
              Precio
            </TableCell>
            <TableCell align="right" sx={{ color: 'text.secondary', fontWeight: 'bold', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
              Cambio 24h
            </TableCell>
            <TableCell
              align="right"
              sx={{
                color: 'text.secondary',
                fontWeight: 'bold',
                borderBottom: '1px solid rgba(255,255,255,0.1)',
                display: { xs: 'none', md: 'table-cell' },
              }}
            >
              Market Cap
            </TableCell>
            <TableCell
              align="right"
              sx={{
                color: 'text.secondary',
                fontWeight: 'bold',
                borderBottom: '1px solid rgba(255,255,255,0.1)',
                display: { xs: 'none', md: 'table-cell' },
              }}
            >
              Volumen (24h)
            </TableCell>
            <TableCell
              align="right"
              sx={{
                color: 'text.secondary',
                fontWeight: 'bold',
                borderBottom: '1px solid rgba(255,255,255,0.1)',
                display: { xs: 'none', lg: 'table-cell' },
              }}
            >
              Suministro
            </TableCell>
            <TableCell align="center" sx={{ color: 'text.secondary', fontWeight: 'bold', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
              Acciones
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {cryptos.map((crypto) => {
            const isPositive = (crypto.financial.change24h || 0) >= 0;
            const rowColor = crypto.additionalInfo?.pColor || '#00f3ff';
            return (
              <TableRow
                key={crypto.id}
                hover
                onClick={() => onRowClick(crypto.id)}
                sx={{
                  cursor: 'pointer',
                  '&:last-child td, &:last-child th': { border: 0 },
                  '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.03)' },
                  'td, th': { borderBottom: '1px solid rgba(255,255,255,0.05)' },
                }}
              >
                <TableCell component="th" scope="row" sx={{ color: 'white' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box
                      sx={{
                        width: 36,
                        height: 36,
                        borderRadius: '24%',
                        bgcolor: 'rgba(255,255,255,0.03)',
                        border: `1px solid ${rowColor}40`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative',
                        overflow: 'hidden',
                      }}
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
                        <Typography sx={{ fontWeight: 'bold', color: 'white', fontSize: '0.9rem' }}>
                          {crypto.identification.symbol[0]}
                        </Typography>
                      )}
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" fontWeight="bold" color="white">
                        {crypto.identification.symbol}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {crypto.identification.name}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell align="right" sx={{ color: 'white', fontWeight: 'bold' }}>
                  <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5, justifyContent: 'flex-end', width: '100%' }}>
                    {(crypto.financial.price || 0).toLocaleString(undefined, { maximumFractionDigits: 5 })}
                    <TaoIcon size={16} />
                  </Box>
                </TableCell>
                <TableCell align="right">
                  <Box
                    sx={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 0.5,
                      color: isPositive ? '#00ff9d' : '#ff3333',
                      fontWeight: 'bold',
                      fontSize: '0.85rem',
                    }}
                  >
                    {isPositive ? '+' : ''}{(crypto.financial.change24h || 0).toFixed(2)}%
                  </Box>
                </TableCell>
                <TableCell align="right" sx={{ color: 'text.secondary', display: { xs: 'none', md: 'table-cell' } }}>
                  {crypto.financial.marketCap ? `${crypto.financial.marketCap.toLocaleString()} CR` : 'N/A'}
                </TableCell>
                <TableCell align="right" sx={{ color: 'text.secondary', display: { xs: 'none', md: 'table-cell' } }}>
                  {crypto.financial.volume24h ? `${crypto.financial.volume24h.toLocaleString()} CR` : 'N/A'}
                </TableCell>
                <TableCell align="right" sx={{ color: 'text.secondary', display: { xs: 'none', lg: 'table-cell' } }}>
                  {crypto.financial.circulatingSupply ? `${crypto.financial.circulatingSupply.toLocaleString()} ${crypto.identification.symbol}` : 'N/A'}
                </TableCell>
                <TableCell align="center" onClick={(e) => e.stopPropagation()}>
                  <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={(e) => onTrade(e, 'BUY', crypto.id)}
                      sx={{
                        borderColor: 'rgba(0, 230, 118, 0.3)',
                        color: '#00e676',
                        '&:hover': { borderColor: '#00e676', bgcolor: 'rgba(0, 230, 118, 0.1)' },
                      }}
                    >
                      Compra
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={(e) => onTrade(e, 'SELL', crypto.id)}
                      sx={{
                        borderColor: 'rgba(255, 23, 68, 0.3)',
                        color: '#ff1744',
                        '&:hover': { borderColor: '#ff1744', bgcolor: 'rgba(255, 23, 68, 0.1)' },
                      }}
                    >
                      Venta
                    </Button>
                  </Box>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
