import React from 'react';
import { Chip, Typography } from '@mui/material';
import { 
    ArrowUpward, 
    ArrowDownward, 
    SwapHoriz, 
    CurrencyExchange, 
    Engineering, 
    EmojiEvents, 
    Layers 
} from '@mui/icons-material';
import { Column } from '../ui/GenericTable';
import { TransactionsInterface, TransactionType } from '../../lib/features/transactions/types';

export const transactionColumns: Column<TransactionsInterface>[] = [
    {
        Header: "Tipo",
        accessor: "transactionType",
        filterable: true,
        sortable: true,
        Cell: ({ value }) => {
           let label = value as string;
           let color = '#00f3ff'; // Default cyan
           let bgcolor = 'rgba(0, 243, 255, 0.1)';
           let icon = <SwapHoriz sx={{ '&&': { fontSize: 14 } }} />;

           switch (value) {
               case TransactionType.BUY:
                   label = 'COMPRA';
                   color = '#00ff88';
                   bgcolor = 'rgba(0, 255, 136, 0.1)';
                   icon = <ArrowUpward sx={{ '&&': { fontSize: 14 } }} />;
                   break;
               case TransactionType.SELL:
                   label = 'VENTA';
                   color = '#ff0055';
                   bgcolor = 'rgba(255, 0, 85, 0.1)';
                   icon = <ArrowDownward sx={{ '&&': { fontSize: 14 } }} />;
                   break;
               case TransactionType.TRANSFER:
                   label = 'TRANSFERENCIA';
                   break;
               case TransactionType.CONVERT:
                   label = 'CONVERSIÓN';
                   icon = <CurrencyExchange sx={{ '&&': { fontSize: 14 } }} />;
                   break;
               case TransactionType.MINE:
                   label = 'MINERÍA';
                   color = '#ffaa00';
                   bgcolor = 'rgba(255, 170, 0, 0.1)';
                   icon = <Engineering sx={{ '&&': { fontSize: 14 } }} />;
                   break;
               case TransactionType.REWARD:
                   label = 'RECOMPENSA';
                   color = '#ffd700';
                   bgcolor = 'rgba(255, 215, 0, 0.1)';
                   icon = <EmojiEvents sx={{ '&&': { fontSize: 14 } }} />;
                   break;
               case TransactionType.STAKING:
                   label = 'STAKING';
                   color = '#9c27b0';
                   bgcolor = 'rgba(156, 39, 176, 0.1)';
                   icon = <Layers sx={{ '&&': { fontSize: 14 } }} />;
                   break;
           }

           return (
               <Chip 
                  label={label} 
                  size="small" 
                  sx={{ 
                      bgcolor: bgcolor,
                      color: color,
                      fontWeight: 'bold',
                      border: `1px solid ${bgcolor.replace('0.1', '0.3')}` 
                  }} 
                  icon={icon}
              />
           );
        }
    },
    {
        Header: "Cantidad",
        accessor: (row) => `${row.financialInfo?.quantity || 0} ${row.financialInfo?.symbol || ''}`,
        sortable: true
    },
    {
        Header: "Precio",
        accessor: (row) => row.financialInfo?.price || 0,
        Cell: ({ value }) => `$${(value || 0).toLocaleString()}`,
        sortable: true
    },
    {
        Header: "Tiempo",
        accessor: "dateCreated",
        sortable: true,
        Cell: ({ value }) => new Date(value).toLocaleTimeString()
    },
    {
        Header: "Origen",
        accessor: (row) => row.addresses?.senderWalletAddress || 'N/A',
        Cell: ({ value }) => <Typography color="primary" variant="caption">{value}</Typography>
    }
];
