// 1-Definir columnas para la página de transacciones
// 2-Configurar renderizado condicional de tipo y estado de transacción

//# 1-Definir columnas para la página de transacciones
import React from 'react';
import { TaoIcon } from '../ui/TaoIcon';
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
import { Column } from '../ui/CustomTable';
import { TransactionsInterface, TransactionType } from '../../lib/features/transactions/types';

export const transactionsPageColumns: Column<TransactionsInterface>[] = [
    {
        label: "Fecha",
        key: "dateCreated",
        sortable: true,
        render: ({ value }) => (
            <Box>
                {new Date(value as string).toLocaleDateString()}
                <Typography variant="caption" display="block" color="text.secondary">
                    {new Date(value as string).toLocaleTimeString()}
                </Typography>
            </Box>
        )
    },
    {
        label: "Tipo",
        key: "transactionType",
        filterable: true,
        sortable: true,
        render: ({ value }) => {
           let label = value as string;
           let color = '#00f3ff';
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

           //# 2-Configurar renderizado condicional de tipo y estado de transacción
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
        label: "Activo",
        key: (row) => row.financialInfo?.symbol,
        sortable: true,
        filterable: true,
        render: ({ row }) => (
            <Box>
                {row.financialInfo?.symbol}
                <Typography variant="caption" display="block" color="text.secondary">
                    {row.financialInfo?.crypto}
                </Typography>
            </Box>
        )
    },
    {
        label: "Monto (Fiat)",
        key: (row) => row.financialInfo?.amount,
        sortable: true,
        render: ({ value }) => (
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span>{(value as number)?.toLocaleString()}</span> <TaoIcon size={14} />
            </div>
        )
    },
    {
        label: "Cantidad",
        key: (row) => row.financialInfo?.quantity,
        sortable: true
    },
    {
        label: "Origen",
        key: (row) => row.addresses?.senderWalletAddress,
        sortable: true,
    },
    {
        label: "Destino",
        key: (row) => row.addresses?.recipientWalletAddress,
        sortable: true,
    },
    {
        label: "Estado",
        key: "status",
        sortable: true,
        filterable: true,
        render: ({ value }) => {
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
            
            
            
            //# 2-Estructuración y renderizado visual del componente UI
            return (
                <Typography variant="body2" sx={{ color }}>
                    {label as React.ReactNode}
                </Typography>
            );
        }
    }
];
