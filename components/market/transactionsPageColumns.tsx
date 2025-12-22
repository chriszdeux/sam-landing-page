import React from 'react';
import { Chip, Typography, Box } from '@mui/material';
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
import { TransactionsInterface, TransactionType, TransactionStatus } from '../../lib/features/transactions/types';

export const transactionsPageColumns: Column<TransactionsInterface>[] = [
    {
        Header: "Fecha",
        accessor: "dateCreated",
        sortable: true,
        Cell: ({ value }) => (
            <Box>
                {new Date(value).toLocaleDateString()}
                <Typography variant="caption" display="block" color="text.secondary">
                    {new Date(value).toLocaleTimeString()}
                </Typography>
            </Box>
        )
    },
    {
        Header: "Tipo",
        accessor: "transactionType",
        filterable: true,
        sortable: true,
        Cell: ({ value }) => {
           const isBuy = value === TransactionType.BUY;
           const isSell = value === TransactionType.SELL;
           
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
        Header: "Activo",
        accessor: (row) => row.financialInfo?.symbol,
        sortable: true,
        Cell: ({ row }) => (
            <Box>
                {row.financialInfo?.symbol}
                <Typography variant="caption" display="block" color="text.secondary">
                    {row.financialInfo?.crypto}
                </Typography>
            </Box>
        )
    },
    {
        Header: "Monto (Fiat)",
        accessor: (row) => row.financialInfo?.amount,
        sortable: true,
        Cell: ({ value }) => `$${value?.toLocaleString()}`
    },
    {
        Header: "Cantidad",
        accessor: (row) => row.financialInfo?.quantity,
        sortable: true
    },
    {
        Header: "Origen",
        accessor: (row) => row.addresses?.senderWalletAddress,
        sortable: true,
    },
    {
        Header: "Destino",
        accessor: (row) => row.addresses?.recipientWalletAddress,
        sortable: true,
    },
    {
        Header: "Estado",
        accessor: "status",
        sortable: true,
        filterable: true,
        Cell: ({ value }) => {
            const status = String(value).toUpperCase();
            let label = value;
            let color = 'warning.main';
            
            if (status === 'CONFIRMED') {
                label = 'CONFIRMADO';
                color = '#00ff9d';
            } else if (status === 'FAILED') {
                label = 'FALLIDO';
                color = '#ff3333';
            } else if (status === 'PENDING') {
                label = 'PENDIENTE';
                color = 'warning.main';
            }
            
            return (
                <Typography variant="body2" sx={{ color }}>
                    {label}
                </Typography>
            );
        }
    }
];
