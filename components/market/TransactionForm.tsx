import React from 'react';
import { Box, TextField, MenuItem, Paper, Typography, Button, CircularProgress } from '@mui/material';
import { Cryptocurrency } from '../../lib/types/crypto';

interface TradeFormData {
  walletId: string;
  cryptoId: string;
  amount: number;
  quantity: number;
}

interface TransactionFormProps {
    transactionType: 'BUY' | 'SELL' | 'TRANSFER';
    form: TradeFormData;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    cryptos: Cryptocurrency[];
    selectedCrypto?: Cryptocurrency;
    onSubmit: () => void;
    isProcessing: boolean;
}

export const TransactionForm = ({
    transactionType,
    form,
    onChange,
    cryptos,
    selectedCrypto,
    onSubmit,
    isProcessing
}: TransactionFormProps) => {
    return (
        <Box>
            <Typography variant="h6" color="primary.main" gutterBottom sx={{ mt: 4, mb: 2, borderBottom: '1px solid rgba(0,243,255,0.2)', display: 'inline-block', pb: 1 }}>
                2. DETALLES DE LA TRANSACCIÓN
            </Typography>
            
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 4 }}>
                <Box>
                    <TextField
                        select
                        label="Activo / Criptomoneda"
                        name="cryptoId"
                        value={form.cryptoId}
                        onChange={onChange}
                        fullWidth
                        disabled
                        variant="filled"
                        sx={{
                            '& .MuiFilledInput-root': { bgcolor: 'rgba(255,255,255,0.05)', color: 'white' },
                            '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' },
                            mb: 3
                        }}
                    >
                        {cryptos.map((crypto) => (
                            <MenuItem key={crypto.id} value={crypto.id}>
                                {crypto.identification.symbol} - {crypto.identification.name}
                            </MenuItem>
                        ))}
                    </TextField>

                    <Paper sx={{ p: 2, bgcolor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                        <Typography variant="caption" color="text.secondary">PRECIO DE MERCADO</Typography>
                        <Typography variant="h4" color="white" fontWeight="bold">
                            ${selectedCrypto?.financial.price.toLocaleString() || '0.00'}
                        </Typography>
                        <Typography variant="body2" color={(selectedCrypto?.financial.change24h || 0) > 0 ? 'success.main' : 'error.main'}>
                            {selectedCrypto?.financial.change24h || 0}% (24h)
                        </Typography>
                    </Paper>
                </Box>

                <Box>
                        {transactionType === 'BUY' && (
                            <TextField
                            label="Monto a Invertir (Fiat)"
                            name="amount"
                            type="number"
                            value={form.amount}
                            onChange={onChange}
                            fullWidth
                            variant="outlined"
                            autoFocus
                            inputProps={{ min: 0 }}
                            sx={{
                                '& .MuiOutlinedInput-root': { 
                                    color: 'white', 
                                    fontSize: '1.5rem',
                                    '& fieldset': { borderColor: 'rgba(0, 243, 255, 0.3)' },
                                    '&:hover fieldset': { borderColor: '#00f3ff' },
                                    '&.Mui-focused fieldset': { borderColor: '#00f3ff' }
                                },
                                '& .MuiInputLabel-root': { color: '#00f3ff' },
                                mb: 2
                            }}
                        />
                    )}

                    {transactionType === 'SELL' && (
                            <TextField
                            label="Cantidad a Vender (Unidades)"
                            name="quantity"
                            type="number"
                            value={form.quantity}
                            onChange={onChange}
                            fullWidth
                            variant="outlined"
                            autoFocus
                            inputProps={{ min: 0 }}
                                sx={{
                                '& .MuiOutlinedInput-root': { 
                                    color: 'white', 
                                    fontSize: '1.5rem',
                                    '& fieldset': { borderColor: 'rgba(255, 23, 68, 0.3)' },
                                    '&:hover fieldset': { borderColor: '#ff1744' },
                                    '&.Mui-focused fieldset': { borderColor: '#ff1744' }
                                },
                                '& .MuiInputLabel-root': { color: '#ff1744' },
                                mb: 2
                            }}
                        />
                    )}

                        {transactionType === 'TRANSFER' && (
                            <TextField
                            label="Dirección de Destino"
                            name="recipientAddress"
                            fullWidth
                            // State logic for recipient needed if implemented
                            sx={{ mb: 2, '& input': { color: 'white' } }}
                        />
                        )}
                    
                    {/* Summary / Calculation */}
                    <Box sx={{ p: 2, borderRadius: 2, bgcolor: transactionType === 'BUY' ? 'rgba(0, 230, 118, 0.1)' : 'rgba(255, 23, 68, 0.1)', border: '1px dashed', borderColor: transactionType === 'BUY' ? '#00e676' : '#ff1744' }}>
                        <Typography variant="subtitle2" sx={{ color: transactionType === 'BUY' ? '#00e676' : '#ff1744' }}>ESTIMADO</Typography>
                        {transactionType === 'BUY' ? (
                            <Typography variant="h5" color="white">
                                + {(form.amount / (selectedCrypto?.financial.price || 1)).toFixed(6)} {selectedCrypto?.identification.symbol}
                            </Typography>
                        ) : (
                            <Typography variant="h5" color="white">
                                + ${(form.quantity * (selectedCrypto?.financial.price || 0)).toLocaleString()}
                            </Typography>
                        )}
                    </Box>
                </Box>
            </Box>

            <Button
                variant="contained"
                size="large"
                onClick={onSubmit}
                disabled={!form.walletId || isProcessing}
                startIcon={isProcessing ? <CircularProgress size={20} color="inherit" /> : null}
                sx={{
                    py: 2,
                    fontSize: '1.2rem',
                    fontWeight: 'bold',
                    width: '100%',
                    mt: 4,
                    bgcolor: transactionType === 'BUY' ? '#00e676' : '#ff1744',
                    color: transactionType === 'BUY' ? 'black' : 'white',
                    boxShadow: transactionType === 'BUY' ? '0 0 20px rgba(0, 230, 118, 0.4)' : '0 0 20px rgba(255, 23, 68, 0.4)',
                    '&:hover': {
                        bgcolor: transactionType === 'BUY' ? '#00c853' : '#d50000',
                        transform: 'scale(1.02)'
                    }
                }}
            >
                {isProcessing ? 'Procesando...' : `CONFIRMAR ${transactionType === 'BUY' ? 'COMPRA' : transactionType === 'SELL' ? 'VENTA' : 'TRANSFERENCIA'}`}
            </Button>
        </Box>
    );
};
