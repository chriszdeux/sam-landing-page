'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Box, Container, Typography, Button, Alert, Stack } from '@mui/material';
import { motion } from 'framer-motion';
import { Background } from '../../../components/layout/Background';
import { useAppSelector, useAppDispatch } from '../../../lib/hooks';
import { updateBalance, updateWalletAssets } from '../../../lib/features/auth/reducer';
import api from '../../../lib/api'; // Adjust path if needed
import { ArrowBack } from '@mui/icons-material';
import { CubeAnimation } from '../../../components/market/CubeAnimation';
import { WalletSelector } from '../../../components/market/WalletSelector';
import { ConfirmationDialog } from '../../../components/market/ConfirmationDialog';
import { TransactionForm } from '../../../components/market/TransactionForm';

// --- Types ---
interface TradeFormData {
  walletId: string;
  cryptoId: string;
  amount: number; // For Fiat
  quantity: number; // For Crypto units
}



// --- Main Page Component ---
const TradeContent = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const transactionType = (searchParams.get('type') as 'BUY' | 'SELL' | 'TRANSFER') || 'BUY';
  const cryptoIdParam = searchParams.get('cryptoId') || '';

  const [form, setForm] = useState<TradeFormData>({
    walletId: '',
    cryptoId: cryptoIdParam,
    amount: 0,
    quantity: 0
  });

  const [status, setStatus] = useState<'IDLE' | 'PROCESSING' | 'SUCCESS' | 'ERROR'>('IDLE');
  const [errorMsg, setErrorMsg] = useState('');
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);

  const { cryptos } = useAppSelector((state) => state.market);
  const { userInfo, walletsInfo } = useAppSelector((state) => state.auth);
  const { selectedNetwork } = useAppSelector((state) => state.blockchain);

  const [networkFee, setNetworkFee] = useState<number | null>(null);

  useEffect(() => {
    const fetchFee = async () => {
        if (selectedNetwork?.id) {
            try {
                const { data } = await api.get(`/blockchain/network/${selectedNetwork.id}/fee-base`);
                // Assuming data is the fee number or an object with value
                const fee = typeof data === 'number' ? data : (data?.feeBase || 0);
                setNetworkFee(fee);
            } catch (error) {
                console.error("Failed to fetch network fee:", error);
                setNetworkFee(0); // Fallback to 0 or handle error
            }
        }
    };
    fetchFee();
  }, [selectedNetwork?.id]);

  useEffect(() => {
    if (cryptoIdParam && form.cryptoId !== cryptoIdParam) {
        const timer = setTimeout(() => {
            setForm(prev => ({ ...prev, cryptoId: cryptoIdParam }));
        }, 0);
        return () => clearTimeout(timer);
    }
  }, [cryptoIdParam, form.cryptoId]);

  // Auto-redirect on Success
  useEffect(() => {
    if (status === 'SUCCESS') {
        const timer = setTimeout(() => {
            router.push('/market');
        }, 3000); // Wait 3 seconds for animation
        return () => clearTimeout(timer);
    }
  }, [status, router]);

  // Handle Input Changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({
        ...prev,
        [name]: name === 'amount' || name === 'quantity' ? parseFloat(value) : value
    }));
  };

  const handleWalletSelect = (walletId: string) => {
      setForm(prev => ({ ...prev, walletId }));
  };

  const selectedCrypto = cryptos.find(c => c.id === form.cryptoId);

  // Submit Handler
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

    // Validation
    if (transactionType === 'BUY') {
        const userBalance = userInfo?.balance || 0;
        if (form.amount > userBalance) {
            setErrorMsg(`Balance insuficiente. Tienes $${userBalance.toLocaleString()} pero intentas gastar $${form.amount.toLocaleString()}.`);
            setStatus('ERROR');
            return;
        }
    } else if (transactionType === 'SELL') {
        // Optimistic check if walletsInfo matches
        if (walletsInfo && form.walletId === userInfo?.wallets[0]?.walletAddress) { 
             const asset = walletsInfo.store.find(a => a.id === form.cryptoId || a.symbol === selectedCrypto?.identification.symbol);
             if (!asset || asset.quantity < form.quantity) {
                 setErrorMsg(`Fondos insuficientes. Tienes ${asset?.quantity || 0} ${selectedCrypto?.identification.symbol} pero intentas vender ${form.quantity}.`);
                 setStatus('ERROR');
                 return;
             }
        }
    }

    setConfirmModalOpen(true);
  };

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
        
        // Update User State (Balance) & Portfolio locally
        const currentBalance = userInfo?.balance || 0;
        
        if (transactionType === 'BUY') {
            dispatch(updateBalance(currentBalance - form.amount));
            if (selectedCrypto) {
                dispatch(updateWalletAssets({
                    id: selectedCrypto.id,
                    name: selectedCrypto.identification.name,
                    symbol: selectedCrypto.identification.symbol,
                    quantity: form.quantity 
                }));
            }
        } else if (transactionType === 'SELL') {
            // For sell, we gain fiat. Ensure amount is calculated if 0.
            const revenue = form.amount > 0 ? form.amount : (form.quantity * (selectedCrypto?.financial?.price || 0));
            dispatch(updateBalance(currentBalance + revenue));
             if (selectedCrypto) {
                dispatch(updateWalletAssets({
                    id: selectedCrypto.id,
                    name: selectedCrypto.identification.name,
                    symbol: selectedCrypto.identification.symbol,
                    quantity: -form.quantity // Negative for sell
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

  if (status === 'SUCCESS' || status === 'PROCESSING') {
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
                            onClick={() => router.push('/market')}
                        >
                            Volver al Mercado
                        </Button>
                    </motion.div>
                  )}
              </motion.div>
          </Container>
      );
  }

  return (
    <Container maxWidth="md" sx={{ pt: 15, pb: 10 }}>
        <Box sx={{ width: '100%', maxWidth: 600, mx: 'auto' }}>
            <Stack spacing={4}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Button startIcon={<ArrowBack />} onClick={() => router.back()} sx={{ mr: 2, color: 'text.secondary' }}>
                        Atrás
                    </Button>
                    <Typography variant="h4" color="white" sx={{ fontWeight: 'bold' }}>
                        {transactionType === 'BUY' ? 'COMPRAR ACTIVO' : transactionType === 'SELL' ? 'VENDER ACTIVO' : 'TRANSFERIR'}
                    </Typography>
                </Box>

                {errorMsg && <Alert severity="error" variant="filled" sx={{ borderRadius: 2 }}>{errorMsg}</Alert>}

                {/* Wallet Selection Phase */}
                <WalletSelector 
                    userInfo={userInfo}
                    walletsInfo={walletsInfo}
                    selectedWalletId={form.walletId}
                    onSelect={handleWalletSelect}
                />

                <TransactionForm 
                    transactionType={transactionType}
                    form={form}
                    onChange={handleChange}
                    cryptos={cryptos}
                    selectedCrypto={selectedCrypto}
                    onSubmit={handlePreSubmit}
                    isProcessing={false}
                    fee={networkFee}
                />

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
    return (
        <Box sx={{ minHeight: '100vh', position: 'relative' }}>
            <Background />
            <Suspense fallback={<Typography color="white" sx={{ pt: 10, textAlign: 'center' }}>Loading...</Typography>}>
                <TradeContent />
            </Suspense>
        </Box>
    );
}
