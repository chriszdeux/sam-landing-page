// 1-Definir componente de historial de transacciones
// 2-Obtener despachador y datos de Redux
// 3-Efecto para cargar transacciones
// 4-Preparar datos para la tabla con columnas CB sincronizadas al store
// 5-Renderizar tabla de transacciones

//# 1-Definir componente de historial de transacciones
'use client';

import React, { useMemo } from 'react';
import { Box, Typography } from '@mui/material';

import { useAppDispatch, useAppSelector } from '../../lib/hooks';
import { fetchTransactions } from '../../lib/features/transactions/actions';

import { CustomTable, Column } from '../../components/ui/CustomTable';
import { TransactionsInterface } from '../../lib/features/transactions/types';
import { transactionColumns } from './transactionColumns';
import { formatHash } from '../../lib/utils/formatHash';
import { RootState } from '../../lib/store';

interface TransactionHistoryProps {
  walletId?: string;
}

export const TransactionHistory = ({ walletId }: TransactionHistoryProps) => {
  
  //# 2-Obtener despachador y datos de Redux
  const dispatch = useAppDispatch();
  const { selectedNetwork, networks, chronoBurstFreqTypes } = useAppSelector(
    (state: RootState) => state.blockchain
  );
  const { transactions } = useAppSelector((state: RootState) => state.transactions);

  const currentNetwork = networks.find(n => n.id === selectedNetwork?.id);
  const storeId = selectedNetwork?.storeTransactions?.storeTransactionId || selectedNetwork?.storeTransactionId || currentNetwork?.storeTransactionId;

  //# 3-Efecto para cargar transacciones
  React.useEffect(() => {
    if (storeId) {
        dispatch(fetchTransactions({ storeId, walletId }));
    }
  }, [storeId, walletId, dispatch]);

  //# 4-Preparar datos para la tabla con columnas CB sincronizadas al store
  const transactionData: TransactionsInterface[] = transactions || [];

  // Override the "Potencia CB" column to use the live freqMap from the store
  // so the scale matches exactly what Navbar / blockchain viewer shows.
  const syncedColumns = useMemo((): Column<TransactionsInterface>[] => {
    return transactionColumns.map(col => {
      if (col.label === 'Potencia CB') {
        return {
          ...col,
          render: ({ value }) => {
            const raw = value as number;
            if (!raw || raw === 0) {
              return (
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.3)' }}>
                  —
                </Typography>
              );
            }
            return (
              <Typography
                variant="caption"
                sx={{ color: '#00f3ff', fontFamily: 'monospace', fontWeight: 'bold' }}
              >
                {formatHash(raw * 1000000, chronoBurstFreqTypes)}
              </Typography>
            );
          },
        };
      }
      return col;
    });
  }, [chronoBurstFreqTypes]);

  //# 5-Renderizar tabla de transacciones
  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h6" sx={{ mb: 2, color: 'text.secondary' }}>Últimas Transacciones</Typography>
      <CustomTable 
         columns={syncedColumns} 
         data={transactionData} 
         pageSize={10} 
      />
    </Box>
  );
};
