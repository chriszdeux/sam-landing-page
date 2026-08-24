// 1-Definir columnas para la tabla de transacciones simplificada
// 2-Configurar renderizado condicional de tipo de transacción

//# 1-Definir columnas para la tabla de transacciones simplificada
import React from 'react';
import { TaoIcon } from '../ui/TaoIcon';
import { Typography } from '../ui/Typography';
import {
    ArrowUp,
    ArrowDown,
    ArrowLeftRight,
    RefreshCcw,
    HardHat,
    Trophy,
    Layers
} from 'lucide-react';
import { Column } from '../ui/CustomTable';
import { TransactionsInterface, TransactionType } from '../../lib/features/transactions/types';
import { formatHashLocal } from '../../lib/utils/formatHash';

export const transactionColumns: Column<TransactionsInterface>[] = [
    {
        label: "Tipo",
        key: "transactionType",
        filterable: true,
        sortable: true,
        render: ({ value }) => {
           let label = value as string;
           let color = '#00f3ff';
           let bgcolor = 'rgba(0, 243, 255, 0.1)';
           let icon = <ArrowLeftRight size={14} />;

           switch (value) {
               case TransactionType.BUY:
                   label = 'COMPRA';
                   color = '#00ff88';
                   bgcolor = 'rgba(0, 255, 136, 0.1)';
                   icon = <ArrowUp size={14} />;
                   break;
               case TransactionType.SELL:
                   label = 'VENTA';
                   color = '#ff0055';
                   bgcolor = 'rgba(255, 0, 85, 0.1)';
                   icon = <ArrowDown size={14} />;
                   break;
               case TransactionType.TRANSFER:
                   label = 'TRANSFERENCIA';
                   break;
               case TransactionType.CONVERT:
                   label = 'CONVERSIÓN';
                   icon = <RefreshCcw size={14} />;
                   break;
               case TransactionType.MINE:
                   label = 'MINERÍA';
                   color = '#ffaa00';
                   bgcolor = 'rgba(255, 170, 0, 0.1)';
                   icon = <HardHat size={14} />;
                   break;
               case TransactionType.REWARD:
                   label = 'RECOMPENSA';
                   color = '#ffd700';
                   bgcolor = 'rgba(255, 215, 0, 0.1)';
                   icon = <Trophy size={14} />;
                   break;
               case TransactionType.STAKING:
                   label = 'STAKING';
                   color = '#9c27b0';
                   bgcolor = 'rgba(156, 39, 176, 0.1)';
                   icon = <Layers size={14} />;
                   break;
           }

           //# 2-Configurar renderizado condicional de tipo de transacción
           return (
               <span
                  className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold"
                  style={{
                      backgroundColor: bgcolor,
                      color: color,
                      border: `1px solid ${bgcolor.replace('0.1', '0.3')}`
                  }}
              >
                  {icon}
                  {label}
              </span>
           );
        }
    },
    {
        label: "Cantidad",
        key: (row) => `${row.financialInfo?.quantity || 0} ${row.financialInfo?.symbol || ''}`,
        sortable: true
    },
    {
        label: "Precio",
        key: (row) => row.financialInfo?.price || 0,
        render: ({ value }) => (
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span>{(value as number || 0).toLocaleString()}</span> <TaoIcon size={14} />
            </div>
        ),
        sortable: true
    },
    {
        label: "Tiempo",
        key: "dateCreated",
        sortable: true,
        render: ({ value }) => new Date(value as string | number).toLocaleTimeString()
    },
    {
        label: "Potencia CB",
        key: (row) => row.powerRequired ?? 0,
        sortable: true,
        render: ({ value }) => {
            const raw = value as number;
            if (!raw || raw === 0) return <Typography variant="caption" className="text-white/30">—</Typography>;
            return (
                <Typography variant="caption" className="font-mono font-bold text-[#00f3ff]">
                    {formatHashLocal(raw * 1000000)}
                </Typography>
            );
        }
    },
    {
        label: "Origen",
        key: (row) => row.addresses?.senderWalletAddress || 'N/A',
        render: ({ value }) => <Typography className="text-primary" variant="caption">{value as React.ReactNode}</Typography>
    }
];
