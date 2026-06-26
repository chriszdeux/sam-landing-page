// 1-Definir componente de formulario de transacción
// 2-Renderizar formulario con validación y costos

//# 1-Definir componente de formulario de transacción
import React from 'react';
import { Box, MenuItem, Paper, Typography, Button, CircularProgress, SelectChangeEvent, Alert, Chip } from '@mui/material';
import { Input } from '../ui/Input';
import { Cryptocurrency } from '../../lib/types/crypto';
import { TaoIcon } from '../ui/TaoIcon';
import { formatHash } from '../../lib/utils/formatHash';
import { useAppSelector } from '../../lib/hooks';
import { RootState } from '../../lib/store';
import { LocalFireDepartment, SwapHoriz, TrendingUp } from '@mui/icons-material';

interface TradeFormData {
  walletId: string;
  cryptoId: string;
  amount: number;
  quantity: number;
}

interface TransactionFormProps {
    transactionType: 'BUY' | 'SELL' | 'TRANSFER';
    form: TradeFormData;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>) => void;
    cryptos: Cryptocurrency[];
    selectedCrypto?: Cryptocurrency;
    onSubmit: () => void;
    isProcessing: boolean;
    fee?: number | null;
    availableQuantity?: number;
    onSetMax?: () => void;
}

export const TransactionForm = ({
    transactionType,
    form,
    onChange,
    cryptos,
    selectedCrypto,
    onSubmit,
    isProcessing,
    fee,
    availableQuantity,
    onSetMax
}: TransactionFormProps) => {
    const chronoBurstFreqTypes = useAppSelector((state: RootState) => state.blockchain.chronoBurstFreqTypes);
    const networkDifficulty = 3; // Base difficulty factor for hash cost estimate
    const estimatedHashCost = fee != null ? fee * networkDifficulty * 1000 : null;
    const formattedHashCost = estimatedHashCost != null ? formatHash(estimatedHashCost, chronoBurstFreqTypes) : null;
    const accentColor = transactionType === 'BUY' ? '#00e676' : transactionType === 'SELL' ? '#ff1744' : '#ffab00';

    //# 2-Renderizar formulario con validación y costos
    return (
        <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3, mt: 4 }}>
                <Box sx={{ width: 4, height: 24, bgcolor: accentColor, borderRadius: 1, boxShadow: `0 0 8px ${accentColor}` }} />
                <Typography variant="h6" sx={{ color: accentColor, fontWeight: 'bold', letterSpacing: 1.5, textTransform: 'uppercase', fontSize: '0.85rem' }}>
                    Detalles de la Transacción
                </Typography>
                <Chip
                    label={transactionType === 'BUY' ? 'COMPRA' : transactionType === 'SELL' ? 'VENTA' : 'TRANSFERENCIA'}
                    icon={transactionType === 'BUY' ? <TrendingUp style={{ fontSize: 14 }} /> : transactionType === 'SELL' ? <SwapHoriz style={{ fontSize: 14 }} /> : undefined}
                    size="small"
                    sx={{ bgcolor: `${accentColor}15`, color: accentColor, border: `1px solid ${accentColor}40`, fontWeight: 'bold', fontSize: '0.65rem' }}
                />
            </Box>

            {transactionType === 'TRANSFER' && (
                <Alert severity="warning" sx={{ mb: 3, bgcolor: 'transparent', color: '#ffb700' }}>
                    Las transferencias entre billeteras tienen un costo de red del 0.5%.
                </Alert>
            )}
            
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 4 }}>
                <Box>
                    <Input
                        select
                        label="Activo / Criptomoneda"
                        name="cryptoId"
                        value={form.cryptoId}
                        onChange={onChange}
                        fullWidth
                        containerSx={{
                            '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' },
                            mb: 3
                        }}
                    >
                        {cryptos.map((crypto) => (
                            <MenuItem key={crypto.id} value={crypto.id}>
                                {crypto.identification.symbol} - {crypto.identification.name}
                            </MenuItem>
                        ))}
                    </Input>

                    <Paper sx={{ p: 2, bgcolor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                        <Typography variant="caption" color="text.secondary">PRECIO DE MERCADO</Typography>
                        <Typography variant="h4" color="white" fontWeight="bold" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {selectedCrypto?.financial.price.toLocaleString() || '0.00'} <TaoIcon size={24} />
                        </Typography>
                        <Typography variant="body2" color={(selectedCrypto?.financial.change24h || 0) > 0 ? 'success.main' : 'error.main'}>
                            {selectedCrypto?.financial.change24h || 0}% (24h)
                        </Typography>
                    </Paper>
                </Box>

                <Box>
                        {transactionType === 'BUY' && (
                            <Box>
                                <Input
                                    label="Monto a Invertir (CR)"
                                    name="amount"
                                    type="number"
                                    value={form.amount}
                                    onChange={onChange}
                                    fullWidth
                                    autoFocus
                                    inputProps={{ min: 0 }}
                                    containerSx={{
                                        '& .MuiInputLabel-root': { color: '#00f3ff' },
                                        mb: 2
                                    }}
                                    sx={{
                                        '& .MuiInputBase-input': { 
                                            color: 'white', 
                                            fontSize: '1.5rem',
                                            borderColor: 'rgba(0, 243, 255, 0.3)',
                                            '&:hover': { borderColor: '#00f3ff' },
                                            '&:focus': { borderColor: '#00f3ff', boxShadow: '0 0 0 0.2rem rgba(0, 243, 255, 0.25)' }
                                        },
                                    }}
                                />
                                <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', mb: 2, gap: 1 }}>
                                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                        Liquidez Disponible: {selectedCrypto?.financial.supplyToTrade ? selectedCrypto.financial.supplyToTrade.toLocaleString() : '0'} {selectedCrypto?.identification.symbol}
                                    </Typography>
                                </Box>
                            </Box>
                        )}

                    {transactionType === 'SELL' && (
                        <Box>
                            <Input
                                label="Cantidad a Vender (Unidades)"
                                name="quantity"
                                type="number"
                                value={form.quantity}
                                onChange={onChange}
                                fullWidth
                                autoFocus
                                inputProps={{ min: 0, max: availableQuantity }}
                                containerSx={{
                                    '& .MuiInputLabel-root': { color: '#ff1744' },
                                    mb: 1
                                }}
                                sx={{
                                    '& .MuiInputBase-input': { 
                                        color: 'white', 
                                        fontSize: '1.5rem',
                                        borderColor: 'rgba(255, 23, 68, 0.3)',
                                        '&:hover': { borderColor: '#ff1744' },
                                        '&:focus': { borderColor: '#ff1744', boxShadow: '0 0 0 0.2rem rgba(255, 23, 68, 0.25)' }
                                    },
                                }}
                            />
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', mb: 2, gap: 1 }}>
                                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                    Disponible: {availableQuantity?.toLocaleString()} {selectedCrypto?.identification.symbol}
                                </Typography>
                                {onSetMax && (
                                    <Button 
                                        size="small" 
                                        variant="outlined" 
                                        color="error"
                                        onClick={onSetMax}
                                        sx={{ 
                                            minWidth: 'auto', 
                                            padding: '2px 8px', 
                                            fontSize: '0.7rem' 
                                        }}
                                    >
                                        MAX
                                    </Button>
                                )}
                            </Box>
                        </Box>
                    )}

                        {transactionType === 'TRANSFER' && (
                            <Input
                            label="Dirección de Destino"
                            name="recipientAddress"
                            fullWidth
                            
                            sx={{ mb: 2, '& input': { color: 'white' } }}
                        />
                        )}
                    

                    <Box sx={{
                        p: 2.5, borderRadius: 2,
                        bgcolor: `${accentColor}08`,
                        border: `1px solid ${accentColor}30`,
                        position: 'relative',
                        overflow: 'hidden',
                    }}>
                        {/* Glow */}
                        <Box sx={{ position: 'absolute', top: -20, right: -20, width: 80, height: 80, borderRadius: '50%', bgcolor: accentColor, filter: 'blur(30px)', opacity: 0.1 }} />
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                            <Box>
                                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', display: 'block', letterSpacing: 1, mb: 0.5, fontSize: '0.65rem' }}>RECIBIRÁS</Typography>
                                {transactionType === 'BUY' ? (
                                    <Typography variant="h5" sx={{ color: 'white', fontWeight: 900, fontFamily: 'monospace' }}>
                                        +{(form.amount / (selectedCrypto?.financial.price || 1)).toFixed(6)} <Box component="span" sx={{ color: accentColor, fontSize: '0.8em' }}>{selectedCrypto?.identification.symbol}</Box>
                                    </Typography>
                                ) : (
                                    <Typography variant="h5" sx={{ color: 'white', fontWeight: 900, display: 'flex', alignItems: 'center', gap: 1, fontFamily: 'monospace' }}>
                                        +{(form.quantity * (selectedCrypto?.financial.price || 0)).toLocaleString()} <TaoIcon size={20} />
                                    </Typography>
                                )}
                            </Box>
                            <Box sx={{ textAlign: 'right' }}>
                                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', display: 'block', letterSpacing: 1, mb: 0.5, fontSize: '0.65rem' }}>TARIFA CR</Typography>
                                <Typography variant="body2" sx={{ color: accentColor, fontWeight: 'bold', fontFamily: 'monospace' }}>
                                    {fee === null ? '—' : `${fee} CR`}
                                </Typography>
                            </Box>
                        </Box>

                        {/* Hash cost estimado */}
                        <Box sx={{
                            mt: 1.5, pt: 1.5,
                            borderTop: '1px solid rgba(255,255,255,0.06)',
                            display: 'flex', alignItems: 'center', gap: 1
                        }}>
                            <LocalFireDepartment sx={{ fontSize: 14, color: '#ff6d00' }} />
                            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.7rem' }}>
                                Costo de Hash estimado por dificultad de red:
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#ff6d00', fontWeight: 'bold', fontFamily: 'monospace', fontSize: '0.75rem' }}>
                                {formattedHashCost ?? '...'}
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            </Box>

            <Button
                variant="contained"
                size="large"
                onClick={onSubmit}
                disabled={!form.walletId || isProcessing || fee === null}
                startIcon={isProcessing ? <CircularProgress size={20} color="inherit" /> : null}
                sx={{
                    py: 2,
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    width: '100%',
                    mt: 4,
                    bgcolor: accentColor,
                    color: transactionType === 'BUY' ? 'black' : 'white',
                    boxShadow: `0 0 20px ${accentColor}40`,
                    letterSpacing: 1.5,
                    transition: 'all 0.25s ease',
                    '&:hover': {
                        bgcolor: transactionType === 'BUY' ? '#00c853' : transactionType === 'SELL' ? '#d50000' : '#e65100',
                        transform: 'scale(1.01)',
                        boxShadow: `0 0 35px ${accentColor}60`,
                    },
                    '&:disabled': { opacity: 0.5 },
                    '&:active': { transform: 'scale(0.99)' },
                }}
            >
                {isProcessing
                    ? 'Procesando Transacción...'
                    : `CONFIRMAR ${transactionType === 'BUY' ? 'COMPRA' : transactionType === 'SELL' ? 'VENTA' : 'TRANSFERENCIA'}`}
            </Button>
        </Box>
    );
};
