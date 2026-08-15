// 1-Definir componente de diálogo de confirmación
// 2-Renderizar diálogo modal

//# 1-Definir componente de diálogo de confirmación
import React from 'react';
import { Dialog } from '../ui/Dialog';
import { TechFrame } from '../ui/TechFrame';
import { Typography } from '../ui/Typography';
import { Button } from '../ui/Button';
import { Shield, AlertTriangle, Zap } from 'lucide-react';
import { EnvVariables } from '@/lib/constants/variables';

interface ConfirmationDialogProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    transactionType: 'BUY' | 'SELL' | 'TRANSFER';
    cryptoName?: string;
    cryptoSymbol?: string;
    amount: number;
    quantity: number;
    fee?: number | null;
}

export const ConfirmationDialog = ({
    open,
    onClose,
    onConfirm,
    transactionType,
    cryptoName,
    cryptoSymbol,
    amount,
    quantity,
    fee
}: ConfirmationDialogProps) => {

    //# 2-Renderizar diálogo modal
    return (
        <Dialog
            open={open}
            onClose={onClose}
            className="w-full max-w-[600px]"
        >
            <TechFrame color={transactionType === 'BUY' ? '#00f3ff' : '#ff0055'}>
                <div className="bg-[rgba(10,15,30,0.95)] p-8 backdrop-blur-2xl">
                    <div className="mb-8 text-center">
                        {transactionType === 'BUY' ? (
                            <Zap size={48} color="#00f3ff" style={{ marginBottom: 16 }} />
                        ) : (
                            <Shield size={48} color="#ff0055" style={{ marginBottom: 16 }} />
                        )}
                        <Typography variant="h5" className="font-bold tracking-[2px] text-white">
                            CONFIRMAR TRANSACCIÓN
                        </Typography>
                        <Typography variant="overline" className="tracking-[4px] text-foreground-muted">
                            {'// LAYER_02_VALIDATION'}
                        </Typography>
                    </div>

                    <div className="flex flex-col gap-6">
                        <div className="relative overflow-hidden rounded border border-white/10 bg-white/[0.03] p-6">
                            <div
                                className="absolute left-0 top-0 h-full w-1"
                                style={{ backgroundColor: transactionType === 'BUY' ? '#00f3ff' : '#ff0055' }}
                            />

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Typography variant="caption" className="mb-1 block text-foreground-muted">OPERACIÓN</Typography>
                                    <Typography variant="body1" className="font-bold text-white">
                                        {transactionType === 'BUY' ? 'ADQUISICIÓN' : transactionType === 'SELL' ? 'LIQUIDACIÓN' : 'TRANSFERENCIA'}
                                    </Typography>
                                </div>
                                <div>
                                    <Typography variant="caption" className="mb-1 block text-foreground-muted">ACTIVO_DIGITAL</Typography>
                                    <Typography variant="body1" className="font-bold text-white">
                                        {cryptoSymbol} <span className="text-[0.8rem] font-normal text-white/50">{cryptoName}</span>
                                    </Typography>
                                </div>

                                <div className="col-span-2">
                                    <div className="my-2 border-t border-white/5" />
                                </div>

                                <div>
                                    <Typography variant="caption" className="mb-1 block text-foreground-muted">
                                        {transactionType === 'BUY' ? 'VALOR_FIAT' : 'CANTIDAD_TOKEN'}
                                    </Typography>
                                    <Typography
                                        variant="h6"
                                        className="font-bold"
                                        style={{ color: transactionType === 'BUY' ? '#00f3ff' : '#ff0055' }}
                                    >
                                        {transactionType === 'BUY' ? `$${amount.toLocaleString()}` : `${quantity.toLocaleString()} ${cryptoSymbol}`}
                                    </Typography>
                                </div>
                                <div>
                                    <Typography variant="caption" className="mb-1 block text-foreground-muted">RED_FEE (EST)</Typography>
                                    <Typography variant="body1" className="font-mono text-white">
                                        {fee || '0'} {EnvVariables.coin1}
                                    </Typography>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 rounded border border-[#ffb700]/20 bg-[#ffb700]/5 p-4">
                            <AlertTriangle size={20} color="#ffb700" />
                            <Typography variant="caption" className="leading-[1.2] text-[#ffb700]">
                                ADVERTENCIA: Esta operación se ejecutará de forma irreversible en el nodo de red descentralizado.
                            </Typography>
                        </div>

                        <div className="mt-4 flex gap-4">
                            <Button
                                fullWidth
                                onClick={onClose}
                                sx={{ color: 'rgba(255,255,255,0.5)', py: 1.5 }}
                            >
                                CANCELAR
                            </Button>
                            <Button
                                fullWidth
                                onClick={onConfirm}
                                variant="contained"
                                sx={{
                                    bgcolor: transactionType === 'BUY' ? '#00f3ff' : '#ff0055',
                                    color: transactionType === 'BUY' ? '#000' : '#fff',
                                    fontWeight: 'bold',
                                    py: 1.5,
                                    '&:hover': {
                                        bgcolor: transactionType === 'BUY' ? '#00d0db' : '#e6004c',
                                    }
                                }}
                            >
                                EJECUTAR_PROTOCOLO
                            </Button>
                        </div>
                    </div>
                </div>
            </TechFrame>
        </Dialog>
    );
};
