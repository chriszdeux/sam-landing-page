import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Stack,
    Typography,
    Box,
    Button
} from '@mui/material';

interface ConfirmationDialogProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    transactionType: 'BUY' | 'SELL' | 'TRANSFER';
    cryptoName?: string;
    cryptoSymbol?: string;
    amount: number;
    quantity: number;
}

export const ConfirmationDialog = ({
    open,
    onClose,
    onConfirm,
    transactionType,
    cryptoName,
    cryptoSymbol,
    amount,
    quantity
}: ConfirmationDialogProps) => {
    return (
        <Dialog 
            open={open} 
            onClose={onClose}
            PaperProps={{
                sx: {
                    bgcolor: 'rgba(10, 10, 25, 0.95)',
                    border: '1px solid rgba(0, 243, 255, 0.3)',
                    backdropFilter: 'blur(20px)',
                    minWidth: 400
                }
            }}
        >
            <DialogTitle sx={{ color: 'primary.main', textAlign: 'center' }}>Confirmar Transacción</DialogTitle>
            <DialogContent>
                <Stack spacing={2} sx={{ mt: 1 }}>
                    <Typography color="white" align="center">
                        ¿Estás seguro de que deseas realizar la siguiente operación?
                    </Typography>
                    <Box sx={{ p: 2, bgcolor: 'rgba(255,255,255,0.05)', borderRadius: 2 }}>
                         <Typography color="text.secondary" variant="caption">Tipo</Typography>
                         <Typography color="white" variant="body1" fontWeight="bold">
                             {transactionType === 'BUY' ? 'COMPRA' : transactionType === 'SELL' ? 'VENTA' : 'TRANSFERENCIA'}
                         </Typography>
                         
                         <Typography color="text.secondary" variant="caption" sx={{ mt: 1, display: 'block' }}>Activo</Typography>
                         <Typography color="white" variant="body1" fontWeight="bold">
                             {cryptoName} ({cryptoSymbol})
                         </Typography>

                         {transactionType === 'BUY' && (
                            <>
                             <Typography color="text.secondary" variant="caption" sx={{ mt: 1, display: 'block' }}>Monto a Invertir</Typography>
                             <Typography color="success.main" variant="h6" fontWeight="bold">
                                 ${amount.toLocaleString()}
                             </Typography>
                            </>
                         )}
                         {transactionType === 'SELL' && (
                            <>
                             <Typography color="text.secondary" variant="caption" sx={{ mt: 1, display: 'block' }}>Cantidad a Vender</Typography>
                             <Typography color="error.main" variant="h6" fontWeight="bold">
                                 {quantity} {cryptoSymbol}
                             </Typography>
                            </>
                         )}
                    </Box>
                    <Typography variant="caption" color="text.secondary" align="center">
                        Esta acción es irreversible y será registrada en la blockchain.
                    </Typography>
                </Stack>
            </DialogContent>
            <DialogActions sx={{ p: 3, justifyContent: 'center' }}>
                <Button onClick={onClose} sx={{ color: 'text.secondary' }}>Cancelar</Button>
                <Button 
                    onClick={onConfirm} 
                    variant="contained" 
                    color={transactionType === 'BUY' ? 'success' : 'error'}
                    size="large"
                >
                    Confirmar y Proceder
                </Button>
            </DialogActions>
        </Dialog>
    );
};
