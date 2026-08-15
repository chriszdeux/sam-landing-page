// 1-Efecto secundario para sincronización del ciclo de vida
// 2-Obtención del despachador para emitir acciones al store
// 3-Obtención del despachador para emitir acciones al store
// 4-Manejo de datos de formulario para form
// 5-Gestión de estado local para status
// 6-Gestión de errores y excepciones para error msg
// 7-Estado de apertura para modal o menú confirm modal open
// 8-Selección de datos desde el estado global de Redux
// 9-Selección de datos desde el estado global de Redux
// 10-Selección de datos desde el estado global de Redux
// 11-Gestión de estado local para network fee
// 12-Efecto secundario para sincronización del ciclo de vida
// 13-Efecto secundario para sincronización del ciclo de vida
// 14-Estructuración y renderizado visual del componente UI
// 15-Efecto secundario para sincronización del ciclo de vida
// 16-Estructuración y renderizado visual del componente UI
// 17-Manejo de cambios en el input genérico
// 18-Selección de ítem y actualización de wallet
// 19-Manejo de lógica de usuario para handleSetMax
// 20-Procesamiento de envío de formulario para pre
// 21-Manejo de lógica de usuario para handleConfirmTransaction
// 22-Estructuración y renderizado visual del componente UI
// 23-Estructuración y renderizado visual del componente UI
// 24-Estructuración y renderizado visual del componente UI

'use client';

//# 1-Efecto secundario para sincronización del ciclo de vida
import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { MenuItem } from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import { CustomButton } from '../../../components/ui/CustomButton';
import { motion } from 'framer-motion';
import { Background } from '../../../components/layout/Background';
import { Typography } from '../../../components/ui/Typography';
import { Button } from '../../../components/ui/Button';
import { Combobox } from '../../../components/ui/Combobox';

//# 2-Obtención del despachador para emitir acciones al store
import { useAppSelector, useAppDispatch } from '../../../lib/hooks';
import { updateBalance, updateWalletAssets } from '../../../lib/features/auth/reducer';
import api from '../../../lib/api';
import { ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import { ProcessingAnimation } from '../../../components/market/ProcessingAnimation';
import { WalletSelector } from '../../../components/market/WalletSelector';
import { ConfirmationDialog } from '../../../components/market/ConfirmationDialog';
import { TechFrame } from '../../../components/ui/TechFrame';
import { PageHeader } from '../../../components/ui/PageHeader';
import { Input } from '../../../components/ui/Input';
import { EnvVariables } from '../../../lib/constants/variables';
import { TaoIcon } from '../../../components/ui/TaoIcon';
import { formatHash } from '../../../lib/utils/formatHash';

interface TradeFormData {
  walletId: string;
  cryptoId: string;
  amount: number;
  quantity: number;
}

const TradeContent = () => {
  const router = useRouter();

  //# 3-Obtención del despachador para emitir acciones al store
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const initialTransactionType = (searchParams.get('type') as 'BUY' | 'SELL' | 'TRANSFER') || 'BUY';
  const [mode, setMode] = useState<'BUY' | 'SELL' | 'TRANSFER'>(initialTransactionType);
  const cryptoIdParam = searchParams.get('cryptoId') || '';



  //# 4-Manejo de datos de formulario para form
  const [form, setForm] = useState<TradeFormData>({
    walletId: '',
    cryptoId: cryptoIdParam,
    amount: 0,
    quantity: 0
  });



  //# 5-Gestión de estado local para status
  const [status, setStatus] = useState<'IDLE' | 'PROCESSING' | 'SUCCESS' | 'ERROR'>('IDLE');
  const [customPrice, setCustomPrice] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<'LOCAL' | 'BANK'>('LOCAL');
  const [processingStep, setProcessingStep] = useState(1);
  const [quantityFocus, setQuantityFocus] = useState(false);
  const [priceFocus, setPriceFocus] = useState(false);


  //# 6-Gestión de errores y excepciones para error msg
  const [errorMsg, setErrorMsg] = useState('');


  //# 7-Estado de apertura para modal o menú confirm modal open
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);


  //# 8-Selección de datos desde el estado global de Redux
  const { cryptos } = useAppSelector((state) => state.market);

  //# 9-Selección de datos desde el estado global de Redux
  const { userInfo, walletsInfo } = useAppSelector((state) => state.auth);
  const displayCryptos = React.useMemo(() => { if (mode === "SELL" && walletsInfo?.store) { return cryptos.filter(c => walletsInfo.store.some(a => a.id === c.id || a.symbol === c.identification.symbol)); } return cryptos; }, [cryptos, mode, walletsInfo?.store]);

  //# 10-Selección de datos desde el estado global de Redux
  const { selectedNetwork } = useAppSelector((state) => state.blockchain);



  //# 11-Gestión de estado local para network fee
  const [networkFee, setNetworkFee] = useState<number | null>(null);



  //# 12-Efecto secundario para sincronización del ciclo de vida
  useEffect(() => {
    const fetchFee = async () => {
        if (selectedNetwork?.id) {
            try {
                const { data } = await api.get(`/blockchain/network/${selectedNetwork.id}/estimate-fee?type=${mode}`);
                const fee = typeof data === 'number' ? data : (data?.fee || 0);
                setNetworkFee(fee);
            } catch (error) {
                console.error("Failed to fetch network fee:", error);
                setNetworkFee(0);
            }
        }
    };
    fetchFee();
  }, [selectedNetwork?.id, mode]);



  //# 13-Efecto secundario para sincronización del ciclo de vida
  useEffect(() => {
    if (cryptoIdParam && form.cryptoId !== cryptoIdParam) {
        const timer = setTimeout(() => {
            setForm(prev => ({ ...prev, cryptoId: cryptoIdParam }));
        }, 0);


        //# 14-Estructuración y renderizado visual del componente UI
        return () => clearTimeout(timer);
    }
  }, [cryptoIdParam, form.cryptoId]);



  //# 15-Efecto secundario para sincronización del ciclo de vida
  useEffect(() => {
    if (status === 'SUCCESS') {
        const timer = setTimeout(() => {
            const redirectParam = searchParams.get('redirect');
            if (redirectParam === 'detail' && form.cryptoId) {
                router.push(`/market/${form.cryptoId}`);
            } else if (redirectParam === 'market') {
                router.push('/market');
            } else {
                router.push('/market');
            }
        }, 6000);


        //# 16-Estructuración y renderizado visual del componente UI
        return () => clearTimeout(timer);
    }
  }, [status, router, searchParams, form.cryptoId]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (status === 'PROCESSING') {
      setProcessingStep(1);
      interval = setInterval(() => {
        setProcessingStep(prev => (prev < 4 ? prev + 1 : prev));
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [status]);



  //# 17-Manejo de cambios en el input genérico
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setForm(prev => ({
        ...prev,
        [name]: name === 'amount' || name === 'quantity' ? parseFloat(value) : value
    }));
  };



  //# 18-Selección de ítem y actualización de wallet
  const handleWalletSelect = (walletId: string) => {
      setForm(prev => ({ ...prev, walletId }));
  };

  const selectedCrypto = cryptos.find(c => c.id === form.cryptoId);

  useEffect(() => {
    if (selectedCrypto) {
      setCustomPrice(selectedCrypto.financial.price);
    }
  }, [selectedCrypto]);

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value.replace(/[^0-9.]/g, '');
    const val = parseFloat(rawVal) || 0;
    setForm(prev => ({
      ...prev,
      quantity: val,
      amount: val * customPrice
    }));
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value.replace(/[^0-9.]/g, '');
    const val = parseFloat(rawVal) || 0;
    setCustomPrice(val);
    setForm(prev => ({
      ...prev,
      amount: prev.quantity * val
    }));
  };

  const displayQuantity = quantityFocus
    ? (form.quantity === 0 ? '' : form.quantity.toString())
    : form.quantity.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 6 });

  const displayPrice = priceFocus
    ? (customPrice === 0 ? '' : customPrice.toString())
    : customPrice.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 6 });

  const selectedAsset = walletsInfo?.store?.find(a => a.id === form.cryptoId || a.symbol === selectedCrypto?.identification.symbol);
  const availableQuantity = selectedAsset ? Number(selectedAsset.quantity) : 0;

  const validationError = React.useMemo(() => {
    if (!form.walletId) return '';
    if (mode === 'BUY') {
      if (form.quantity <= 0) return 'La cantidad debe ser mayor a 0';
      const userBalance = userInfo?.balance || 0;
      const totalCost = form.quantity * customPrice;
      if (totalCost > userBalance) {
        return `Balance insuficiente. Máximo disponible: $${userBalance.toLocaleString()}`;
      }
      const maxSupply = selectedCrypto?.financial.supplyToTrade || 0;
      if (form.quantity > maxSupply) {
        return `Liquidez insuficiente en el mercado. Máximo: ${maxSupply.toLocaleString()} unidades`;
      }
    } else if (mode === 'SELL') {
      if (form.quantity <= 0) return 'La cantidad debe ser mayor a 0';
      if (form.quantity > availableQuantity) {
        return `Balance de activo insuficiente. Tienes ${availableQuantity.toLocaleString()} ${selectedCrypto?.identification.symbol || ''}`;
      }
    }
    return '';
  }, [form.walletId, mode, form.quantity, customPrice, userInfo?.balance, selectedCrypto, availableQuantity]);



  //# 19-Manejo de lógica de usuario para handleSetMax
  const handleSetMax = () => {
    if (availableQuantity > 0) {
        setForm(prev => ({
            ...prev,
            quantity: availableQuantity,
            amount: availableQuantity * customPrice
        }));
    }
  };

  const handleModeChange = (newMode: 'BUY' | 'SELL') => {
    setErrorMsg('');
    setStatus('IDLE');
    setMode(newMode);
    setForm(prev => ({
      ...prev,
      amount: 0,
      quantity: 0
    }));
  };



  //# 20-Procesamiento de envío de formulario para pre
  const handlePreSubmit = () => {
    if (!form.walletId || !form.cryptoId) {
        setErrorMsg('Por favor selecciona una wallet y una criptomoneda.');
        setStatus('ERROR');
        return;
    }
    if ((mode === 'BUY' && form.amount <= 0) || (mode === 'SELL' && form.quantity <= 0)) {
         setErrorMsg('Los valores deben ser mayores a 0.');
         setStatus('ERROR');
         return;
    }

    if (mode === 'BUY') {
        const userBalance = userInfo?.balance || 0;
        if (form.amount > userBalance) {
            setErrorMsg(`Balance insuficiente. Tienes $${userBalance.toLocaleString()} pero intentas gastar $${form.amount.toLocaleString()}.`);
            setStatus('ERROR');
            return;
        }

        const buyQuantity = form.amount / (selectedCrypto?.financial.price || 1);
        const maxSupply = selectedCrypto?.financial.supplyToTrade || 0;
        if (buyQuantity > maxSupply) {
            setErrorMsg(`Liquidez insuficiente en el mercado. Intentas adquirir ${buyQuantity.toLocaleString(undefined, {maximumFractionDigits:4})} pero solo hay ${maxSupply.toLocaleString()} disponibles.`);
            setStatus('ERROR');
            return;
        }
    } else if (mode === 'SELL') {
        if (form.quantity > availableQuantity) {
             setErrorMsg(`Fondos insuficientes. Tienes ${availableQuantity} ${selectedCrypto?.identification.symbol} pero intentas vender ${form.quantity}.`);
             setStatus('ERROR');
             return;
        }
    }

    setConfirmModalOpen(true);
  };



  //# 21-Manejo de lógica de usuario para handleConfirmTransaction
  const handleConfirmTransaction = async () => {
    setConfirmModalOpen(false);
    setStatus('PROCESSING');
    setErrorMsg('');

    try {
        await new Promise(resolve => setTimeout(resolve, 8000));

        const contractUUID = selectedCrypto?.financial.contractAddress || '00000000-0000-0000-0000-000000000000';
        const payload = {
            recipientWalletAddress: mode === 'BUY' ? form.walletId : contractUUID,
            senderWalletAddress: mode === 'SELL' ? form.walletId : contractUUID,
            cryptoID: form.cryptoId,
            amount: mode === 'SELL' ? 0 : form.amount,
            quantity: mode === 'BUY' ? 0 : form.quantity,
            fee: networkFee,
            transactionType: mode
        };

        const endpoint = mode === 'BUY'
            ? '/blockchain/trade/start-buy-transaction'
            : '/blockchain/trade/start-sell-transaction';

        await api.post(endpoint, payload);

        const currentBalance = userInfo?.balance || 0;

        const feeAmount = networkFee || 0;

        if (mode === 'BUY') {
            dispatch(updateBalance(currentBalance - form.amount - feeAmount));
            if (selectedCrypto) {
                dispatch(updateWalletAssets({
                    id: selectedCrypto.id,
                    name: selectedCrypto.identification.name,
                    symbol: selectedCrypto.identification.symbol,
                    quantity: form.quantity
                }));
            }
        } else if (mode === 'SELL') {
            const revenue = form.amount > 0 ? form.amount : (form.quantity * (selectedCrypto?.financial?.price || 0));
            dispatch(updateBalance(currentBalance + revenue - feeAmount));
             if (selectedCrypto) {
                dispatch(updateWalletAssets({
                    id: selectedCrypto.id,
                    name: selectedCrypto.identification.name,
                    symbol: selectedCrypto.identification.symbol,
                    quantity: -form.quantity
                }));
            }
        }

        setStatus('SUCCESS');

    } catch (err: unknown) {
        console.error(err);
        setStatus('ERROR');
        setErrorMsg((err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Transaction Failed');
    }
  };

  const getStepText = (step: number) => {
    switch(step) {
      case 1: return "PASO 1/4: Iniciando Protocolo Seguro...";
      case 2: return "PASO 2/4: Verificando Suministro Líquido y Billeteras...";
      case 3: return "PASO 3/4: Transmitiendo Transacción a la Red Core...";
      case 4: return "PASO 4/4: Confirmando Bloque y Sellando Ledger...";
      default: return "";
    }
  };

  const coinName = EnvVariables.coin1
    ? EnvVariables.coin1.charAt(0).toUpperCase() + EnvVariables.coin1.slice(1).toLowerCase() + 's'
    : 'Thaos';

  const allWallets = [
    ...(userInfo?.wallet ? [userInfo.wallet] : []),
    ...(userInfo?.wallets || []),
    ...(userInfo?.walletsSaved || [])
  ].filter((v, i, a) => a.findIndex(t => t.walletAddress === v.walletAddress) === i);

  const modeAccentColor = mode === 'BUY' ? '#00e676' : mode === 'SELL' ? '#ff1744' : '#ffab00';

  return (
    <div className="mx-auto w-full max-w-[1200px] px-4 pt-[120px] pb-20 sm:px-6 lg:px-8">
        {/* Top Header */}
        <div className="mb-8">
            <Button startIcon={<ArrowLeft size={18} />} onClick={() => router.back()} sx={{ mr: 2, color: 'text.secondary', mb: 2 }}>
                Atrás
            </Button>
            <PageHeader
                title={mode === 'BUY' ? 'COMPRAR ACTIVO' : mode === 'SELL' ? 'VENDER ACTIVO' : 'TRANSFERIR'}
                subtitle={mode === 'BUY' ? 'Adquiere nuevos activos para tu cartera.' : mode === 'SELL' ? 'Liquida tus activos en el mercado.' : 'Transfiere activos a otra billetera.'}
            />
        </div>

        {errorMsg && <div className="mb-8 rounded-lg bg-error p-4 text-sm font-bold text-black">{errorMsg}</div>}

        <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
            {/* Panel Izquierdo: Controles de Trading */}
            <div className="md:col-span-7">
                <TechFrame color={modeAccentColor}>
                    <div
                        className="p-8 transition-all duration-[400ms] ease-in-out"
                        style={{
                            background: mode === 'BUY'
                              ? 'linear-gradient(135deg, rgba(0, 230, 118, 0.05) 0%, rgba(10, 10, 15, 0.98) 100%)'
                              : mode === 'SELL'
                                ? 'linear-gradient(135deg, rgba(255, 23, 68, 0.05) 0%, rgba(10, 10, 15, 0.98) 100%)'
                                : 'linear-gradient(135deg, rgba(255, 171, 0, 0.05) 0%, rgba(10, 10, 15, 0.98) 100%)'
                        }}
                    >
                        <Typography variant="caption" className="mb-1 block font-bold tracking-[1px] text-white/50">
                            BILLETERA ORIGEN (UUIDv4)
                        </Typography>
                        <div style={{ ['--trade-accent' as string]: modeAccentColor } as React.CSSProperties}>
                            <Combobox
                                options={allWallets.map(w => w.walletAddress)}
                                value={form.walletId}
                                onChange={(newValue) => setForm(prev => ({ ...prev, walletId: newValue }))}
                                placeholder="Ingresa o selecciona una dirección UUIDv4"
                                disabled={status === 'PROCESSING' || status === 'SUCCESS'}
                                className="focus:shadow-[0_0_0_1px_var(--trade-accent)]"
                            />
                        </div>
                        {form.walletId && (
                            <Typography variant="caption" className="mt-1 block text-white/50">
                                Balance disponible en billetera: ${userInfo?.balance?.toLocaleString() || 0}
                            </Typography>
                        )}

                        <div className="my-6 h-px bg-white/10" />

                        {/* Mode toggle switches */}
                        {mode !== 'TRANSFER' && (
                            <div className="mb-6">
                                <Typography variant="caption" className="mb-1 block font-bold tracking-[1px] text-white/50">
                                    MODO DE OPERACIÓN
                                </Typography>
                                <div className="flex rounded-xl border border-white/[0.08] bg-black/40 p-1">
                                    <Button
                                        fullWidth
                                        disabled={status === 'PROCESSING' || status === 'SUCCESS'}
                                        onClick={() => handleModeChange('BUY')}
                                        sx={{
                                            borderRadius: '8px',
                                            bgcolor: mode === 'BUY' ? 'rgba(0, 230, 118, 0.15)' : 'transparent',
                                            color: mode === 'BUY' ? '#00e676' : 'rgba(255,255,255,0.5)',
                                            border: mode === 'BUY' ? '1px solid rgba(0, 230, 118, 0.3)' : '1px solid transparent',
                                            fontWeight: 'bold',
                                            '&:hover': { bgcolor: mode === 'BUY' ? 'rgba(0, 230, 118, 0.2)' : 'rgba(255,255,255,0.05)' }
                                        }}
                                    >
                                        COMPRAR
                                    </Button>
                                    <Button
                                        fullWidth
                                        disabled={status === 'PROCESSING' || status === 'SUCCESS'}
                                        onClick={() => handleModeChange('SELL')}
                                        sx={{
                                            borderRadius: '8px',
                                            bgcolor: mode === 'SELL' ? 'rgba(255, 23, 68, 0.15)' : 'transparent',
                                            color: mode === 'SELL' ? '#ff1744' : 'rgba(255,255,255,0.5)',
                                            border: mode === 'SELL' ? '1px solid rgba(255, 23, 68, 0.3)' : '1px solid transparent',
                                            fontWeight: 'bold',
                                            '&:hover': { bgcolor: mode === 'SELL' ? 'rgba(255, 23, 68, 0.2)' : 'rgba(255,255,255,0.05)' }
                                        }}
                                    >
                                        VENDER
                                    </Button>
                                </div>
                            </div>
                        )}

                        {/* Criptomoneda Dropdown */}
                        <div className="mb-6">
                            <Typography variant="caption" className="mb-1 block font-bold tracking-[1px] text-white/50">
                                SELECCIONAR CRIPTOMONEDA
                            </Typography>
                            <Input
                                select
                                name="cryptoId"
                                disabled={status === 'PROCESSING' || status === 'SUCCESS'}
                                value={form.cryptoId}
                                onChange={handleChange}
                            >
                                {displayCryptos.map((crypto) => (
                                    <MenuItem key={crypto.id} value={crypto.id}>
                                        {crypto.identification.symbol} - {crypto.identification.name}
                                    </MenuItem>
                                ))}
                            </Input>
                        </div>

                        {/* Inputs Lado a Lado */}
                        {mode !== 'TRANSFER' && (
                            <div className="mb-6">
                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <Typography variant="caption" className="mb-1 block font-bold tracking-[1px] text-white/50">
                                            CANTIDAD ({selectedCrypto?.identification.symbol || ''})
                                        </Typography>
                                        <Input
                                            name="quantity"
                                            type="text"
                                            disabled={status === 'PROCESSING' || status === 'SUCCESS'}
                                            value={displayQuantity}
                                            onFocus={() => setQuantityFocus(true)}
                                            onBlur={() => setQuantityFocus(false)}
                                            onChange={handleQuantityChange}
                                        />
                                    </div>
                                    <div>
                                        <Typography variant="caption" className="mb-1 block font-bold tracking-[1px] text-white/50">
                                            PRECIO ({coinName})
                                        </Typography>
                                        <Input
                                            name="price"
                                            type="text"
                                            disabled={status === 'PROCESSING' || status === 'SUCCESS'}
                                            value={displayPrice}
                                            onFocus={() => setPriceFocus(true)}
                                            onBlur={() => setPriceFocus(false)}
                                            onChange={handlePriceChange}
                                        />
                                    </div>
                                </div>

                                <div className="mt-4 flex items-center justify-between">
                                    <Typography
                                        variant="body1"
                                        className="font-mono text-[1.1rem] font-bold"
                                        style={{ color: mode === 'BUY' ? '#00e676' : '#ff1744' }}
                                    >
                                        Total: {(form.quantity * customPrice).toLocaleString()} {coinName}
                                    </Typography>
                                    {mode === 'SELL' && (
                                        <div className="flex items-center gap-2">
                                            <Typography variant="caption" className="text-foreground-muted">
                                                Disponible: {availableQuantity.toLocaleString()} {selectedCrypto?.identification.symbol}
                                            </Typography>
                                            <Button
                                                size="small"
                                                variant="outlined"
                                                color="error"
                                                disabled={status === 'PROCESSING' || status === 'SUCCESS'}
                                                onClick={handleSetMax}
                                                sx={{ minWidth: 'auto', padding: '2px 8px', fontSize: '0.7rem' }}
                                            >
                                                MAX
                                            </Button>
                                        </div>
                                    )}
                                    {mode === 'BUY' && (
                                        <Typography variant="caption" className="text-foreground-muted">
                                            Liquidez Disponible: {selectedCrypto?.financial.supplyToTrade ? selectedCrypto.financial.supplyToTrade.toLocaleString() : '0'} {selectedCrypto?.identification.symbol}
                                        </Typography>
                                    )}
                                </div>
                                {validationError && (
                                    <Typography variant="caption" className="mt-4 block text-[0.75rem] font-bold text-[#ff1744]">
                                        ⚠️ {validationError}
                                    </Typography>
                                )}
                            </div>
                        )}

                        {mode === 'TRANSFER' && (
                            <div className="mb-6">
                                <Typography variant="caption" className="mb-1 block font-bold tracking-[1px] text-white/50">
                                    DIRECCIÓN DE DESTINO
                                </Typography>
                                <Input
                                    name="recipientAddress"
                                    disabled={status === 'PROCESSING' || status === 'SUCCESS'}
                                    className="text-white"
                                />
                            </div>
                        )}

                        {/* Botón de acción principal */}
                        <CustomButton
                            variant={mode === 'BUY' ? 'success' : mode === 'SELL' ? 'error' : 'warning'}
                            onClick={handlePreSubmit}
                            disabled={!form.walletId || status === 'PROCESSING' || status === 'SUCCESS' || networkFee === null || !!validationError}
                            startIcon={status === 'PROCESSING' ? <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current/30 border-t-current" /> : null}
                            glow
                            fullWidth
                            sx={{ mt: 3, py: 1.25, fontSize: '0.85rem' }}
                        >
                            {status === 'PROCESSING'
                                ? 'Procesando Transacción...'
                                : `CONFIRMAR ${mode === 'BUY' ? 'COMPRA' : mode === 'SELL' ? 'VENTA' : 'TRANSFERENCIA'}`}
                        </CustomButton>
                    </div>
                </TechFrame>
            </div>

            {/* Panel Derecho: Feedback & Animaciones */}
            <div className="md:col-span-5">
                <div
                    className="relative flex min-h-[520px] flex-col items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-[rgba(10,10,15,0.8)] p-8 shadow-[0_20px_40px_rgba(0,0,0,0.5)]"
                    style={{ background: 'linear-gradient(145deg, rgba(20,20,30,0.9) 0%, rgba(10,10,15,0.95) 100%)' }}
                >
                    {/* IDLE VIEW */}
                    {status === 'IDLE' && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            style={{ textAlign: 'center', width: '100%' }}
                        >
                            <Typography variant="h6" className="mb-4 font-bold tracking-[1.5px] text-white">
                                DETALLES DEL ACTIVO
                            </Typography>

                            <div className="mb-6 flex justify-center">
                                <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-[24%] border-2 border-white/10 bg-white/5">
                                    {selectedCrypto?.identification.image256 || selectedCrypto?.identification.image128 ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img
                                            src={selectedCrypto?.identification.image256 || selectedCrypto?.identification.image128}
                                            alt={selectedCrypto?.identification.symbol || 'asset'}
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <span className="text-lg font-bold text-white">{selectedCrypto?.identification.symbol[0] || 'S'}</span>
                                    )}
                                </div>
                            </div>

                            <Typography variant="h5" className="mb-1 font-bold text-[#00f3ff]">
                                {selectedCrypto?.identification.name || 'Selecciona Activo'}
                            </Typography>
                            <Typography variant="body2" className="mb-8 font-mono text-foreground-muted">
                                Ticker: {selectedCrypto?.identification.symbol || '—'}
                            </Typography>

                            <div className="flex w-full flex-col gap-4 rounded-lg border border-white/5 bg-white/[0.02] p-6">
                                <div className="flex justify-between">
                                    <Typography variant="body2" className="text-foreground-muted">Precio de Mercado:</Typography>
                                    <Typography variant="body2" className="font-bold text-white">
                                        {selectedCrypto?.financial.price.toLocaleString() || '0'} {coinName}
                                    </Typography>
                                </div>
                                <div className="flex justify-between">
                                    <Typography variant="body2" className="text-foreground-muted">Tarifa Estimada de Red:</Typography>
                                    <Typography variant="body2" className="font-bold text-[#ffab00]">
                                        {networkFee ? `${networkFee} CR` : '0 CR'}
                                    </Typography>
                                </div>
                                <div className="flex justify-between">
                                    <Typography variant="body2" className="text-foreground-muted">Variación (24h):</Typography>
                                    <Typography
                                        variant="body2"
                                        className="font-bold"
                                        style={{ color: (selectedCrypto?.financial.change24h || 0) >= 0 ? '#00e676' : '#ff1744' }}
                                    >
                                        {selectedCrypto?.financial.change24h || 0}%
                                    </Typography>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* PROCESSING VIEW */}
                    {status === 'PROCESSING' && (
                        <ProcessingAnimation
                            processingStep={processingStep}
                            walletId={form.walletId}
                            networkFee={networkFee}
                            selectedCrypto={selectedCrypto}
                            getStepText={getStepText}
                        />
                    )}

                    {/* SUCCESS VIEW */}

                    {status === 'SUCCESS' && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            style={{ textAlign: 'center', width: '100%' }}
                        >
                            <div className="mb-4 flex justify-center">
                                <motion.div
                                    animate={{ scale: [1, 1.2, 1] }}
                                    transition={{ repeat: Infinity, duration: 2 }}
                                >
                                    <CheckCircle2 size={80} className="text-[#00ff88] [filter:drop-shadow(0_0_15px_#00ff88)]" />
                                </motion.div>
                            </div>

                            <Typography variant="h5" className="mb-4 font-bold text-[#00ff88]">
                                TRANSACCIÓN COMPLETADA
                            </Typography>

                            <Typography variant="body2" className="mb-8 text-foreground-muted">
                                La operación se ha registrado y confirmado en la red Lyncore.
                            </Typography>

                            <div className="mb-8 flex w-full flex-col gap-3 rounded-lg border border-[#00ff88]/10 bg-[#00ff88]/[0.03] p-6 font-mono">
                                <div className="flex justify-between">
                                    <Typography variant="caption" className="text-foreground-muted">Tipo:</Typography>
                                    <Typography variant="caption" className="font-bold text-white">
                                        {mode === 'BUY' ? 'COMPRA' : 'VENTA'}
                                    </Typography>
                                </div>
                                <div className="flex justify-between">
                                    <Typography variant="caption" className="text-foreground-muted">Cantidad:</Typography>
                                    <Typography variant="caption" className="font-bold text-white">
                                        {form.quantity} {selectedCrypto?.identification.symbol}
                                    </Typography>
                                </div>
                                <div className="flex justify-between">
                                    <Typography variant="caption" className="text-foreground-muted">Monto Procesado:</Typography>
                                    <Typography variant="caption" className="font-bold text-[#ffab00]">
                                        {(form.quantity * customPrice).toLocaleString()} {coinName}
                                    </Typography>
                                </div>
                            </div>

                            <Button
                                variant="outlined"
                                color="success"
                                sx={{ borderColor: '#00ff88', color: '#00ff88', '&:hover': { bgcolor: 'rgba(0, 255, 136, 0.1)', borderColor: '#00ff88' } }}
                                onClick={() => {
                                    const redirectParam = searchParams.get('redirect');
                                    if (redirectParam === 'detail' && form.cryptoId) {
                                        router.push(`/market/${form.cryptoId}`);
                                    } else {
                                        router.push('/market');
                                    }
                                }}
                            >
                                {searchParams.get('redirect') === 'detail' ? 'Volver al Detalle' : 'Volver al Mercado'}
                            </Button>
                        </motion.div>
                    )}

                    {/* ERROR VIEW */}
                    {status === 'ERROR' && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            style={{ textAlign: 'center', width: '100%' }}
                        >
                            <div className="mb-4 flex justify-center">
                                <AlertCircle size={80} className="text-[#ff1744] [filter:drop-shadow(0_0_15px_#ff1744)]" />
                            </div>

                            <Typography variant="h5" className="mb-4 font-bold text-[#ff1744]">
                                ERROR EN TRANSACCIÓN
                            </Typography>

                            <Typography variant="body2" className="mb-8 text-foreground-muted">
                                {errorMsg || 'Ha ocurrido un error inesperado al procesar la operación.'}
                            </Typography>

                            <Button
                                variant="contained"
                                color="error"
                                onClick={() => setStatus('IDLE')}
                                sx={{ bgcolor: '#ff1744', color: '#fff', '&:hover': { bgcolor: '#b2102f' } }}
                            >
                                Reintentar
                            </Button>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>

        <ConfirmationDialog
            open={confirmModalOpen}
            onClose={() => setConfirmModalOpen(false)}
            onConfirm={handleConfirmTransaction}
            transactionType={mode}
            cryptoName={selectedCrypto?.identification.name}
            cryptoSymbol={selectedCrypto?.identification.symbol}
            amount={form.amount}
            quantity={form.quantity}
            fee={networkFee}
        />
    </div>
  );
};

export default function TradePage() {


    //# 24-Estructuración y renderizado visual del componente UI
    return (
        <div className="relative min-h-screen">
            <Background />
            <Suspense fallback={<Typography className="pt-10 text-center text-white">Loading...</Typography>}>
                <TradeContent />
            </Suspense>
        </div>
    );
}
