// 1-Definir componente de formulario de transacción
// 2-Renderizar formulario con validación y costos

//# 1-Definir componente de formulario de transacción
import React from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Typography } from '../ui/Typography';
import { Cryptocurrency } from '../../lib/types/crypto';
import { TaoIcon } from '../ui/TaoIcon';
import { formatHash } from '../../lib/utils/formatHash';
import { useAppSelector } from '../../lib/hooks';
import { RootState } from '../../lib/store';
import { Flame, ArrowLeftRight, TrendingUp } from 'lucide-react';

// Semáforo único para compra / venta / transferencia: el mismo token alimenta
// el acento del encabezado, el borde del input y el color del CTA, para que el
// formulario no mezcle un neón vivo con un botón de otra paleta.
const SEMANTIC = {
    BUY: { color: 'success', hex: '#a5d6a7' },
    SELL: { color: 'error', hex: '#ef9a9a' },
    TRANSFER: { color: 'warning', hex: '#ffcc80' },
} as const;

interface TradeFormData {
  walletId: string;
  cryptoId: string;
  amount: number;
  quantity: number;
}

interface TransactionFormProps {
    transactionType: 'BUY' | 'SELL' | 'TRANSFER';
    form: TradeFormData;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
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
    const accentColor = SEMANTIC[transactionType].hex;
    const submitColor = SEMANTIC[transactionType].color;

    //# 2-Renderizar formulario con validación y costos
    return (
        <div>
            <div className="mb-6 mt-8 flex items-center gap-4">
                <div className="h-6 w-1 rounded" style={{ backgroundColor: accentColor, boxShadow: `0 0 8px ${accentColor}` }} />
                <Typography variant="h6" className="text-[0.85rem] font-bold uppercase tracking-[1.5px]" style={{ color: accentColor }}>
                    Detalles de la Transacción
                </Typography>
                <span
                    className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-[0.65rem] font-bold"
                    style={{ backgroundColor: `${accentColor}15`, color: accentColor, border: `1px solid ${accentColor}40` }}
                >
                    {transactionType === 'BUY' ? <TrendingUp size={14} /> : transactionType === 'SELL' ? <ArrowLeftRight size={14} /> : null}
                    {transactionType === 'BUY' ? 'COMPRA' : transactionType === 'SELL' ? 'VENTA' : 'TRANSFERENCIA'}
                </span>
            </div>

            {transactionType === 'TRANSFER' && (
                <div className="mb-6 rounded border-l-4 border-warning bg-transparent p-3 text-[#ffb700]">
                    Las transferencias entre billeteras tienen un costo de red del 0.5%.
                </div>
            )}

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                <div>
                    <Input
                        select
                        label="Activo / Criptomoneda"
                        name="cryptoId"
                        value={form.cryptoId}
                        onChange={onChange}
                        containerClassName="mb-6"
                    >
                        {cryptos.map((crypto) => (
                            <option key={crypto.id} value={crypto.id}>
                                {crypto.identification.symbol} - {crypto.identification.name}
                            </option>
                        ))}
                    </Input>

                    <div className="rounded-paper border border-border bg-white/5 p-4">
                        <Typography variant="caption" className="text-foreground-muted">PRECIO DE MERCADO</Typography>
                        <Typography variant="h4" className="flex items-center gap-2 font-bold text-white">
                            {selectedCrypto?.financial.price.toLocaleString() || '0.00'} <TaoIcon size={24} />
                        </Typography>
                        <Typography variant="body2" className={(selectedCrypto?.financial.change24h || 0) > 0 ? 'text-success' : 'text-error'}>
                            {selectedCrypto?.financial.change24h || 0}% (24h)
                        </Typography>
                    </div>
                </div>

                <div>
                        {transactionType === 'BUY' && (
                            <div>
                                <Input
                                    label="Monto a Invertir (CR)"
                                    name="amount"
                                    type="number"
                                    value={form.amount}
                                    onChange={onChange}
                                    autoFocus
                                    inputProps={{ min: 0 }}
                                    containerClassName="mb-4"
                                    className="border-[#a5d6a7]/30 text-[1.5rem] text-white hover:border-[#a5d6a7] focus:border-[#a5d6a7] focus:shadow-[0_0_0_3px_rgba(165,214,167,0.18)]"
                                />
                                <div className="mb-4 flex items-center justify-end gap-2">
                                    <Typography variant="caption" className="text-foreground-muted">
                                        Liquidez Disponible: {selectedCrypto?.financial.supplyToTrade ? selectedCrypto.financial.supplyToTrade.toLocaleString() : '0'} {selectedCrypto?.identification.symbol}
                                    </Typography>
                                </div>
                            </div>
                        )}

                    {transactionType === 'SELL' && (
                        <div>
                            <Input
                                label="Cantidad a Vender (Unidades)"
                                name="quantity"
                                type="number"
                                value={form.quantity}
                                onChange={onChange}
                                autoFocus
                                inputProps={{ min: 0, max: availableQuantity }}
                                containerClassName="mb-2"
                                className="border-[#ef9a9a]/30 text-[1.5rem] text-white hover:border-[#ef9a9a] focus:border-[#ef9a9a] focus:shadow-[0_0_0_3px_rgba(239,154,154,0.18)]"
                            />
                            <div className="mb-4 flex items-center justify-end gap-2">
                                <Typography variant="caption" className="text-foreground-muted">
                                    Disponible: {availableQuantity?.toLocaleString()} {selectedCrypto?.identification.symbol}
                                </Typography>
                                {onSetMax && (
                                    <Button
                                        size="small"
                                        variant="outlined"
                                        color="error"
                                        onClick={onSetMax}
                                    >
                                        MAX
                                    </Button>
                                )}
                            </div>
                        </div>
                    )}

                        {transactionType === 'TRANSFER' && (
                            <Input
                            label="Dirección de Destino"
                            name="recipientAddress"
                            containerClassName="mb-4"
                            className="text-white"
                        />
                        )}


                    <div
                        className="relative overflow-hidden rounded-lg p-5"
                        style={{ backgroundColor: `${accentColor}08`, border: `1px solid ${accentColor}30` }}
                    >
                        {/* Glow */}
                        <div className="absolute -right-5 -top-5 h-20 w-20 rounded-full opacity-10 blur-[30px]" style={{ backgroundColor: accentColor }} />
                        <div className="mb-3 flex items-start justify-between">
                            <div>
                                <Typography variant="caption" className="mb-1 block text-[0.65rem] tracking-wide text-white/40">RECIBIRÁS</Typography>
                                {transactionType === 'BUY' ? (
                                    <Typography variant="h5" className="font-mono font-black text-white">
                                        +{(form.amount / (selectedCrypto?.financial.price || 1)).toFixed(6)} <span className="text-[0.8em]" style={{ color: accentColor }}>{selectedCrypto?.identification.symbol}</span>
                                    </Typography>
                                ) : (
                                    <Typography variant="h5" className="flex items-center gap-2 font-mono font-black text-white">
                                        +{(form.quantity * (selectedCrypto?.financial.price || 0)).toLocaleString()} <TaoIcon size={20} />
                                    </Typography>
                                )}
                            </div>
                            <div className="text-right">
                                <Typography variant="caption" className="mb-1 block text-[0.65rem] tracking-wide text-white/40">TARIFA CR</Typography>
                                <Typography variant="body2" className="font-mono font-bold" style={{ color: accentColor }}>
                                    {fee === null ? '—' : `${fee} CR`}
                                </Typography>
                            </div>
                        </div>

                        {/* Hash cost estimado */}
                        <div className="mt-3 flex items-center gap-2 border-t border-white/[0.06] pt-3">
                            <Flame size={14} className="text-[#ff6d00]" />
                            <Typography variant="caption" className="text-[0.7rem] text-white/45">
                                Costo de Hash estimado por dificultad de red:
                            </Typography>
                            <Typography variant="caption" className="font-mono text-[0.75rem] font-bold text-[#ff6d00]">
                                {formattedHashCost ?? '...'}
                            </Typography>
                        </div>
                    </div>
                </div>
            </div>

            {/* Compra = success, venta = error: el color del CTA es el mismo
                semáforo que ya usan el acento y el badge de la cabecera. */}
            <Button
                variant="contained"
                size="large"
                color={submitColor}
                onClick={onSubmit}
                disabled={!form.walletId || isProcessing || fee === null}
                startIcon={isProcessing ? <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" /> : null}
                fullWidth
                className="mt-8"
            >
                {isProcessing
                    ? 'Procesando Transacción...'
                    : `CONFIRMAR ${transactionType === 'BUY' ? 'COMPRA' : transactionType === 'SELL' ? 'VENTA' : 'TRANSFERENCIA'}`}
            </Button>
        </div>
    );
};
