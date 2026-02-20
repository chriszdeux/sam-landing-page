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
import { Box, Container, Typography, Button, Alert, Stack, SelectChangeEvent } from '@mui/material';
import { motion } from 'framer-motion';
import { Background } from '../../../components/layout/Background';

//# 2-Obtención del despachador para emitir acciones al store
import { useAppSelector, useAppDispatch } from '../../../lib/hooks';
import { updateBalance, updateWalletAssets } from '../../../lib/features/auth/reducer';
import { refreshUserInfo } from '../../../lib/features/auth/actions';
import api from '../../../lib/api'; 
import { ArrowBack } from '@mui/icons-material';
import { CubeAnimation } from '../../../components/market/CubeAnimation';
import { WalletSelector } from '../../../components/market/WalletSelector';
import { ConfirmationDialog } from '../../../components/market/ConfirmationDialog';
import { TransactionForm } from '../../../components/market/TransactionForm';
import { TechFrame } from '../../../components/ui/TechFrame';
import { PageHeader } from '../../../components/ui/PageHeader';

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
  const transactionType = (searchParams.get('type') as 'BUY' | 'SELL' | 'TRANSFER') || 'BUY';
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
  
  
  //# 6-Gestión de errores y excepciones para error msg
  const [errorMsg, setErrorMsg] = useState('');
  
  
  //# 7-Estado de apertura para modal o menú confirm modal open
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);

  
  //# 8-Selección de datos desde el estado global de Redux
  const { cryptos } = useAppSelector((state) => state.market);
  
  //# 9-Selección de datos desde el estado global de Redux
  const { userInfo, walletsInfo } = useAppSelector((state) => state.auth);
  
  //# 10-Selección de datos desde el estado global de Redux
  const { selectedNetwork } = useAppSelector((state) => state.blockchain);

  
  
  //# 11-Gestión de estado local para network fee
  const [networkFee, setNetworkFee] = useState<number | null>(null);

  
  
  //# 12-Efecto secundario para sincronización del ciclo de vida
  useEffect(() => {
    const fetchFee = async () => {
        if (selectedNetwork?.id) {
            try {
                const { data } = await api.get(`/blockchain/network/${selectedNetwork.id}/fee-base`);
                const fee = typeof data === 'number' ? data : (data?.feeBase || 0);
                setNetworkFee(fee);
            } catch (error) {
                console.error("Failed to fetch network fee:", error);
                setNetworkFee(0); 
            }
        }
    };
    fetchFee();
  }, [selectedNetwork?.id]);

  
  
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
        }, 3000); 
        
        
        //# 16-Estructuración y renderizado visual del componente UI
        return () => clearTimeout(timer);
    }
  }, [status, router, searchParams, form.cryptoId]);

  
  
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

  const selectedAsset = walletsInfo?.store?.find(a => a.id === form.cryptoId || a.symbol === selectedCrypto?.identification.symbol);
  const availableQuantity = selectedAsset ? Number(selectedAsset.quantity) : 0;

  
  
  //# 19-Manejo de lógica de usuario para handleSetMax
  const handleSetMax = () => {
    if (availableQuantity > 0) {
        setForm(prev => ({ ...prev, quantity: availableQuantity }));
    }
  };

  
  
  //# 20-Procesamiento de envío de formulario para pre
  const handlePreSubmit = () => {
    if (!form.walletId || !form.cryptoId) {
        setErrorMsg('Por favor selecciona una wallet y una criptomoneda.');
        setStatus('ERROR');
        return;
    }
    if ((transactionType === 'BUY' && form.amount <= 0) || (transactionType === 'SELL' && form.quantity <= 0)) {
         setErrorMsg('Los valores deben ser mayores a 0.');
         setStatus('ERROR');
         return;
    }

    if (transactionType === 'BUY') {
        const userBalance = userInfo?.balance || 0;
        if (form.amount > userBalance) {
            setErrorMsg(`Balance insuficiente. Tienes $${userBalance.toLocaleString()} pero intentas gastar $${form.amount.toLocaleString()}.`);
            setStatus('ERROR');
            return;
        }
    } else if (transactionType === 'SELL') {
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
        await new Promise(resolve => setTimeout(resolve, 3000));

        const payload = {
            recipientWalletAddress: form.walletId, 
            senderWalletAddress: 'x', 
            cryptoID: form.cryptoId,
            amount: transactionType === 'SELL' ? 0 : form.amount, 
            quantity: transactionType === 'BUY' ? 0 : form.quantity, 
            fee: networkFee, 
            transactionType: transactionType
        };

        const endpoint = transactionType === 'BUY' 
            ? '/blockchain/trade/start-buy-transaction' 
            : '/blockchain/trade/start-sell-transaction';

        await api.post(endpoint, payload);
        
        const currentBalance = userInfo?.balance || 0;
        
        const feeAmount = networkFee || 0;

        if (transactionType === 'BUY') {
            dispatch(updateBalance(currentBalance - form.amount - feeAmount));
            if (selectedCrypto) {
                dispatch(updateWalletAssets({
                    id: selectedCrypto.id,
                    name: selectedCrypto.identification.name,
                    symbol: selectedCrypto.identification.symbol,
                    quantity: form.quantity 
                }));
            }
        } else if (transactionType === 'SELL') {
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

        dispatch(refreshUserInfo());

        setStatus('SUCCESS');

    } catch (err: unknown) {
        console.error(err);
        setStatus('ERROR');
        setErrorMsg((err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Transaction Failed');
    }
  };

  if (status === 'SUCCESS' || status === 'PROCESSING') {
      
      
      //# 22-Estructuración y renderizado visual del componente UI
      return (
          <Container maxWidth="md" sx={{ pt: 15, textAlign: 'center' }}>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <Typography variant="h3" sx={{ color: 'primary.main', mb: 4, textTransform: 'uppercase' }}>
                      {status === 'PROCESSING' ? 'Procesando Transacción...' : 'Transacción Completada'}
                  </Typography>
                  <CubeAnimation type={transactionType} status={status} />
                  
                  {status === 'SUCCESS' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <Typography variant="h5" sx={{ mt: 4, color: 'white' }}>
                            Operación confirmada exitosamente
                        </Typography>
                        <Button 
                            variant="outlined" 
                            sx={{ mt: 4 }} 
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
              </motion.div>
          </Container>
      );
  }

  
  
  //# 23-Estructuración y renderizado visual del componente UI
  return (
    <Container maxWidth="md" sx={{ pt: 15, pb: 10 }}>
        <Box sx={{ width: '100%', maxWidth: 600, mx: 'auto' }}>
            <Stack spacing={4}>
                <Box sx={{ mb: 4 }}>
                    <Button startIcon={<ArrowBack />} onClick={() => router.back()} sx={{ mr: 2, color: 'text.secondary', mb: 2 }}>
                        Atrás
                    </Button>
                    <PageHeader 
                        title={transactionType === 'BUY' ? 'COMPRAR ACTIVO' : transactionType === 'SELL' ? 'VENDER ACTIVO' : 'TRANSFERIR'}
                        subtitle={transactionType === 'BUY' ? 'Adquiere nuevos activos para tu cartera.' : transactionType === 'SELL' ? 'Liquida tus activos en el mercado.' : 'Transfiere activos a otra billetera.'}
                    />
                </Box>

                {errorMsg && <Alert severity="error" variant="filled" sx={{ borderRadius: 2 }}>{errorMsg}</Alert>}

                <TechFrame>
                    <Box sx={{ p: 4 }}>
                        <WalletSelector 
                            userInfo={userInfo}
                            walletsInfo={walletsInfo}
                            selectedWalletId={form.walletId}
                            onSelect={handleWalletSelect}
                        />

                        <Box sx={{ my: 4, height: '1px', bgcolor: 'rgba(255,255,255,0.1)' }} />

                        <TransactionForm 
                            transactionType={transactionType}
                            form={form}
                            onChange={handleChange}
                            cryptos={cryptos}
                            selectedCrypto={selectedCrypto}
                            onSubmit={handlePreSubmit}
                            isProcessing={false}
                            fee={networkFee}
                            availableQuantity={availableQuantity}
                            onSetMax={handleSetMax}
                        />
                    </Box>
                </TechFrame>
            </Stack>
        </Box>
        
        <ConfirmationDialog 
            open={confirmModalOpen}
            onClose={() => setConfirmModalOpen(false)}
            onConfirm={handleConfirmTransaction}
            transactionType={transactionType}
            cryptoName={selectedCrypto?.identification.name}
            cryptoSymbol={selectedCrypto?.identification.symbol}
            amount={form.amount}
            quantity={form.quantity}
            fee={networkFee}
        />
    </Container>
  );
};

export default function TradePage() {
    
    
    //# 24-Estructuración y renderizado visual del componente UI
    return (
        <Box sx={{ minHeight: '100vh', position: 'relative' }}>
            <Background />
            <Suspense fallback={<Typography color="white" sx={{ pt: 10, textAlign: 'center' }}>Loading...</Typography>}>
                <TradeContent />
            </Suspense>
        </Box>
    );
}
