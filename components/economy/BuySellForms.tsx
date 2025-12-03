'use client';

import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Stack, Alert, CircularProgress } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../lib/hooks';
import { buyAsset, sellAsset } from '../../lib/features/economySlice';

interface BuySellFormsProps {
  assetId: string;
  assetSymbol: string;
  currentPrice: number;
}

export const BuySellForms: React.FC<BuySellFormsProps> = ({ assetId, assetSymbol, currentPrice }) => {
  const dispatch = useAppDispatch();
  const [amount, setAmount] = useState('');
  const [mode, setMode] = useState<'buy' | 'sell'>('buy');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      setMessage('Por favor ingresa una cantidad válida');
      setStatus('error');
      return;
    }

    setStatus('loading');
    setMessage('');

    try {
      if (mode === 'buy') {
        await dispatch(buyAsset({ assetId, amount: Number(amount) })).unwrap();
        setMessage(`Has comprado ${amount} ${assetSymbol} exitosamente!`);
      } else {
        await dispatch(sellAsset({ assetId, amount: Number(amount) })).unwrap();
        setMessage(`Has vendido ${amount} ${assetSymbol} exitosamente!`);
      }
      setStatus('success');
      setAmount('');
    } catch (err: any) {
      setMessage(err || 'Ocurrió un error en la transacción');
      setStatus('error');
    }
  };

  const totalCost = amount ? (Number(amount) * currentPrice).toFixed(2) : '0.00';

  return (
    <Box sx={{ p: 3, bgcolor: 'rgba(255,255,255,0.05)', borderRadius: 4, border: '1px solid rgba(255,255,255,0.1)' }}>
      <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
        <Button
          fullWidth
          variant={mode === 'buy' ? 'contained' : 'outlined'}
          color="success"
          onClick={() => { setMode('buy'); setMessage(''); setStatus('idle'); }}
        >
          Comprar
        </Button>
        <Button
          fullWidth
          variant={mode === 'sell' ? 'contained' : 'outlined'}
          color="error"
          onClick={() => { setMode('sell'); setMessage(''); setStatus('idle'); }}
        >
          Vender
        </Button>
      </Stack>

      <form onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <TextField
            label={`Cantidad de ${assetSymbol}`}
            variant="outlined"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            fullWidth
            InputProps={{
              style: { color: 'white' }
            }}
            InputLabelProps={{
              style: { color: 'rgba(255,255,255,0.7)' }
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.4)' },
              }
            }}
          />

          <Box sx={{ display: 'flex', justifyContent: 'space-between', color: 'text.secondary' }}>
            <Typography>Precio por unidad:</Typography>
            <Typography>${currentPrice.toFixed(2)}</Typography>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', color: 'white', fontWeight: 'bold' }}>
            <Typography>Total estimado:</Typography>
            <Typography>${totalCost}</Typography>
          </Box>

          {message && (
            <Alert severity={status === 'success' ? 'success' : 'error'} sx={{ bgcolor: 'transparent', color: 'white' }}>
              {message}
            </Alert>
          )}

          <Button
            type="submit"
            variant="contained"
            color={mode === 'buy' ? 'success' : 'error'}
            size="large"
            disabled={status === 'loading'}
            fullWidth
          >
            {status === 'loading' ? <CircularProgress size={24} /> : (mode === 'buy' ? `Comprar ${assetSymbol}` : `Vender ${assetSymbol}`)}
          </Button>
        </Stack>
      </form>
    </Box>
  );
};
