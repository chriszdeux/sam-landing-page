// 1-Importar dependencias y slices de economía
// 2-Definir componente y estados del formulario
// 3-Implementar lógica de compra y venta
// 4-Renderizar formulario de intercambio de activos

'use client';

import React, { useState } from 'react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Typography } from '../ui/Typography';
import { cn } from '@/lib/utils/cn';

//# 1-Importar dependencias y slices de economía
import { useAppDispatch } from '../../lib/hooks';
import { buyAsset, sellAsset } from '../../lib/features/economySlice';

interface BuySellFormsProps {
  assetId: string;
  assetSymbol: string;
  currentPrice: number;
}

const alertClassName = (severity: 'warning' | 'success' | 'error') =>
  cn(
    'mb-2 flex items-start gap-2 rounded border-l-4 p-3 text-sm',
    severity === 'warning' && 'border-warning bg-warning/10 text-warning',
    severity === 'success' && 'border-success bg-success/10 text-white',
    severity === 'error' && 'border-error bg-error/10 text-white'
  );

export const BuySellForms: React.FC<BuySellFormsProps> = ({ assetId, assetSymbol, currentPrice }) => {

  //# 2-Definir componente y estados del formulario
  const dispatch = useAppDispatch();



  const [amount, setAmount] = useState('');



  const [mode, setMode] = useState<'buy' | 'sell'>('buy');



  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');



  const [message, setMessage] = useState('');



  //# 3-Implementar lógica de compra y venta
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
        const payload: any = await dispatch(buyAsset({ assetId, amount: Number(amount) })).unwrap();
        const fee = payload?.transaction?.financialInfo?.fee || payload?.fee || 0;
        setMessage(`Has comprado ${amount} ${assetSymbol} exitosamente! | Impuesto de Red: -${fee}`);
      } else {
        const payload: any = await dispatch(sellAsset({ assetId, amount: Number(amount) })).unwrap();
        const fee = payload?.transaction?.financialInfo?.fee || payload?.fee || 0;
        setMessage(`Has vendido ${amount} ${assetSymbol} exitosamente! | Impuesto de Red: -${fee}`);
      }
      setStatus('success');
      setAmount('');
    } catch (err: unknown) {
      setMessage((typeof err === 'string' ? err : (err as Error).message) || 'Ocurrió un error en la transacción');
      setStatus('error');
    }
  };

  const totalCost = amount ? (Number(amount) * currentPrice).toFixed(2) : '0.00';



  //# 4-Renderizar formulario de intercambio de activos
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
      {mode === 'sell' && (
        <div className={alertClassName('warning')}>
          La venta de activos conlleva un impuesto de red del 3%.
        </div>
      )}
      <div className="mb-6 flex flex-row gap-4">
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
      </div>

      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-6">
          <Input
            label={`Cantidad de ${assetSymbol}`}
            type="number"
            value={amount}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAmount(e.target.value)}
          />

          <div className="flex justify-between text-foreground-muted">
            <Typography component="span">Precio por unidad:</Typography>
            <Typography component="span">${currentPrice.toFixed(2)}</Typography>
          </div>

          <div className="flex justify-between font-bold text-white">
            <Typography component="span">Total estimado:</Typography>
            <Typography component="span">${totalCost}</Typography>
          </div>

          {message && (
            <div className={alertClassName(status === 'success' ? 'success' : 'error')}>
              {message}
            </div>
          )}

          <Button
            type="submit"
            variant="contained"
            color={mode === 'buy' ? 'success' : 'error'}
            size="large"
            disabled={status === 'loading'}
            fullWidth
          >
            {status === 'loading' ? <div className="mx-auto h-6 w-6 animate-spin rounded-full border-2 border-current/30 border-t-current" /> : (mode === 'buy' ? `Comprar ${assetSymbol}` : `Vender ${assetSymbol}`)}
          </Button>
        </div>
      </form>
    </div>
  );
};
