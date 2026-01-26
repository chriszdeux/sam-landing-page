import React from 'react';
import {
    Stack,
    Typography,
    Box,
    Button,
    Grid,
    Dialog
} from '@mui/material';
import { TechFrame } from '../ui/TechFrame';
import { Shield, AlertTriangle, Zap } from 'lucide-react';

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
    return (
        <Dialog 
            open={open} 
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: {
                    bgcolor: 'transparent',
                    boxShadow: 'none',
                    backgroundImage: 'none',
                }
            }}
        >
            <TechFrame color={transactionType === 'BUY' ? '#00f3ff' : '#ff0055'}>
                <Box sx={{ p: 4, bgcolor: 'rgba(10, 15, 30, 0.95)', backdropFilter: 'blur(20px)' }}>
                    <Box sx={{ textAlign: 'center', mb: 4 }}>
                        {transactionType === 'BUY' ? (
                            <Zap size={48} color="#00f3ff" style={{ marginBottom: 16 }} />
                        ) : (
                            <Shield size={48} color="#ff0055" style={{ marginBottom: 16 }} />
                        )}
                        <Typography variant="h5" sx={{ color: 'white', fontWeight: 'bold', letterSpacing: 2 }}>
                            CONFIRMAR TRANSACCIÓN
                        </Typography>
                        <Typography variant="overline" sx={{ color: 'text.secondary', letterSpacing: 4 }}>
                            {'// LAYER_02_VALIDATION'}
                        </Typography>
                    </Box>

                    <Stack spacing={3}>
                        <Box sx={{ 
                            p: 3, 
                            bgcolor: 'rgba(255,255,255,0.03)', 
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: 1,
                            position: 'relative',
                            overflow: 'hidden'
                        }}>
                            <Box sx={{ position: 'absolute', top: 0, left: 0, width: 4, height: '100%', bgcolor: transactionType === 'BUY' ? '#00f3ff' : '#ff0055' }} />
                            
                            <Grid container spacing={2}>
                                <Grid size={{ xs: 6 }}>
                                    <Typography color="text.secondary" variant="caption" sx={{ display: 'block', mb: 0.5 }}>OPERACIÓN</Typography>
                                    <Typography color="white" variant="body1" fontWeight="bold">
                                        {transactionType === 'BUY' ? 'ADQUISICIÓN' : transactionType === 'SELL' ? 'LIQUIDACIÓN' : 'TRANSFERENCIA'}
                                    </Typography>
                                </Grid>
                                <Grid size={{ xs: 6 }}>
                                    <Typography color="text.secondary" variant="caption" sx={{ display: 'block', mb: 0.5 }}>ACTIVO_DIGITAL</Typography>
                                    <Typography color="white" variant="body1" fontWeight="bold">
                                        {cryptoSymbol} <Box component="span" sx={{ color: 'rgba(255,255,255,0.5)', fontWeight: 'normal', fontSize: '0.8rem' }}>{cryptoName}</Box>
                                    </Typography>
                                </Grid>
                                
                                <Grid size={{ xs: 12 }}>
                                    <Box sx={{ my: 1, borderTop: '1px solid rgba(255,255,255,0.05)' }} />
                                </Grid>

                                <Grid size={{ xs: 6 }}>
                                    <Typography color="text.secondary" variant="caption" sx={{ display: 'block', mb: 0.5 }}>
                                        {transactionType === 'BUY' ? 'VALOR_FIAT' : 'CANTIDAD_TOKEN'}
                                    </Typography>
                                    <Typography sx={{ color: transactionType === 'BUY' ? '#00f3ff' : '#ff0055', variant: 'h6', fontWeight: 'bold' }}>
                                        {transactionType === 'BUY' ? `$${amount.toLocaleString()}` : `${quantity.toLocaleString()} ${cryptoSymbol}`}
                                    </Typography>
                                </Grid>
                                <Grid size={{ xs: 6 }}>
                                    <Typography color="text.secondary" variant="caption" sx={{ display: 'block', mb: 0.5 }}>RED_FEE (EST)</Typography>
                                    <Typography color="white" variant="body1" sx={{ fontFamily: 'monospace' }}>
                                        {fee || '0'} Gwei
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, bgcolor: 'rgba(255, 183, 0, 0.05)', border: '1px solid rgba(255, 183, 0, 0.2)', borderRadius: 1 }}>
                            <AlertTriangle size={20} color="#ffb700" />
                            <Typography variant="caption" sx={{ color: '#ffb700', lineHeight: 1.2 }}>
                                ADVERTENCIA: Esta operación se ejecutará de forma irreversible en el nodo de red descentralizado.
                            </Typography>
                        </Box>

                        <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
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
                        </Box>
                    </Stack>
                </Box>
            </TechFrame>
        </Dialog>
    );
};
