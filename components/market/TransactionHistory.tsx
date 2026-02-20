// 1-Definir componente de historial de transacciones
// 2-Obtener despachador y datos de Redux
// 3-Efecto para cargar transacciones
// 4-Preparar datos para la tabla
// 5-Renderizar tabla de transacciones

//# 1-Definir componente de historial de transacciones
'use client';

import React from 'react';
import { Box, Typography } from '@mui/material';

import { useAppDispatch, useAppSelector } from '../../lib/hooks';
import { fetchTransactions } from '../../lib/features/transactions/actions';

import { GenericTable } from '../../components/ui/GenericTable';
import { TransactionsInterface } from '../../lib/features/transactions/types';
import { transactionColumns } from './transactionColumns';

interface TransactionHistoryProps {
  walletId?: string;
}

export const TransactionHistory = ({ walletId }: TransactionHistoryProps) => {
  
  //# 2-Obtener despachador y datos de Redux
  const dispatch = useAppDispatch();
  const { selectedNetwork, networks } = useAppSelector((state) => state.blockchain);
  const { byStoreBoxId: transactions } = useAppSelector((state) => state.transactions);

  const currentNetwork = networks.find(n => n.id === selectedNetwork?.id);
  const storeId = selectedNetwork?.storeTransactions?.transactionStoreID || currentNetwork?.storeTransactions?.transactionStoreID;

  //# 3-Efecto para cargar transacciones
  React.useEffect(() => {
    if (storeId) {
        dispatch(fetchTransactions({ storeId, walletId }));
    }
  }, [storeId, walletId, dispatch]);

  //# 4-Preparar datos para la tabla
  const rawData = storeId ? transactions[storeId] : null;
  let transactionData: TransactionsInterface[] = [];
  
  if (rawData) {
      if (Array.isArray(rawData)) {
          transactionData = rawData;
      } else if (rawData.transactions && Array.isArray(rawData.transactions)) {
          transactionData = rawData.transactions;
      }
  }
console.log(transactions)
  
  //# 5-Renderizar tabla de transacciones
  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h6" sx={{ mb: 2, color: 'text.secondary' }}>Últimas Transacciones</Typography>
      <GenericTable 
         columns={transactionColumns} 
         data={transactionData} 
         pageSize={10} 
      />
    </Box>
  );
};
