'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { X, Wrench, ShieldAlert, CheckCircle2, TrendingDown, DollarSign, Cpu } from 'lucide-react';
import { Dialog } from '../ui/Dialog';
import { Typography } from '../ui/Typography';
import { Button } from '../ui/Button';
import { useAppDispatch, useAppSelector } from '../../lib/hooks';
import { repairLaboratory } from '../../lib/features/labs/actions';
import { getRepairQuoteApi } from '../../lib/features/labs/api';
import { addNotification } from '../../lib/features/uiSlice';
import { RootState } from '../../lib/store';

interface RepairEquipmentModalProps {
  open: boolean;
  onClose: () => void;
}

interface QuoteItem {
  blocks: number;
  percentRepaired: number;
  resultingLife: number;
  damageRatio: number;
  wearMultiplier: number;
  usdCostPerBlock: number;
  totalUsdCost: number;
  effectivePrice: number;
  totalCryptoCost: number;
}

interface QuoteData {
  labId: string;
  currentLife: number;
  cryptoGenesis: {
    id: string;
    name: string;
    symbol: string;
    price: number;
  };
  maxBlocksPossible: number;
  quotes: QuoteItem[];
}

export const RepairEquipmentModal: React.FC<RepairEquipmentModalProps> = ({ open, onClose }) => {
  const dispatch = useAppDispatch();
  const lab = useAppSelector((state: RootState) => state.reducerLabs.currentLab);
  const selectedNetwork = useAppSelector((state: RootState) => state.blockchain.selectedNetwork);
  const walletsInfo = useAppSelector((state: RootState) => state.auth.walletsInfo);

  const [loadingQuote, setLoadingQuote] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [quoteData, setQuoteData] = useState<QuoteData | null>(null);
  const [selectedBlocks, setSelectedBlocks] = useState(1);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const currentLife = lab?.currentLife !== undefined ? Number(lab.currentLife) : 100;
  const isCollapsed = currentLife <= 0;
  const maxBlocks = Math.max(1, Math.ceil(Math.max(0, 100 - currentLife) / 10));

  // Load live quotes from backend when opened
  useEffect(() => {
    if (!open || !lab?.id) return;
    let isMounted = true;
    const fetchQuote = async () => {
      setLoadingQuote(true);
      setErrorMessage(null);
      try {
        const blockchainId = selectedNetwork?.id || (lab as any).blockchainId || 'mainnet';
        const data = await getRepairQuoteApi(lab.id, blockchainId);
        if (isMounted) {
          setQuoteData(data);
          // Default selection: restore up to 100% or max possible
          const defaultBlocks = Math.max(1, data.maxBlocksPossible || maxBlocks);
          setSelectedBlocks(defaultBlocks);
        }
      } catch (err: any) {
        if (isMounted) {
          console.error('[REPAIR_MODAL_QUOTE_ERROR]', err);
          setErrorMessage('No se pudo cargar la cotización en tiempo real del servidor.');
        }
      } finally {
        if (isMounted) {
          setLoadingQuote(false);
        }
      }
    };

    fetchQuote();
    return () => {
      isMounted = false;
    };
  }, [open, lab?.id, selectedNetwork?.id]);

  // Active quote calculation
  const activeQuote = useMemo(() => {
    if (quoteData && quoteData.quotes && quoteData.quotes.length > 0) {
      const match = quoteData.quotes.find((q) => q.blocks === selectedBlocks);
      if (match) return match;
    }

    // Client-side fallback calculation matching the backend formula
    const damageRatio = Math.max(0, Math.min(1, (100 - currentLife) / 100));
    const wearMultiplier = 1.0 + 2.0 * Math.pow(damageRatio, 2);
    const usdCostPerBlock = 0.5 * wearMultiplier;
    const totalUsdCost = usdCostPerBlock * selectedBlocks;
    const tokenPrice = quoteData?.cryptoGenesis?.price || 1.0;
    const totalCryptoCost = totalUsdCost / Math.max(0.001, tokenPrice);
    const resultingLife = Math.min(100, currentLife + selectedBlocks * 10);

    return {
      blocks: selectedBlocks,
      percentRepaired: selectedBlocks * 10,
      resultingLife,
      damageRatio,
      wearMultiplier,
      usdCostPerBlock,
      totalUsdCost,
      effectivePrice: tokenPrice,
      totalCryptoCost: Number(totalCryptoCost.toFixed(4)),
    };
  }, [quoteData, selectedBlocks, currentLife]);

  // User wallet balance for Genesis crypto
  const genesisSymbol = quoteData?.cryptoGenesis?.symbol || 'GEN';
  const genesisId = quoteData?.cryptoGenesis?.id;
  const userBalance = useMemo(() => {
    if (!walletsInfo?.store || !genesisId) return 0;
    const item = walletsInfo.store.find((s) => s.id === genesisId || s.symbol === genesisSymbol);
    return item ? Number(item.quantity || 0) : 0;
  }, [walletsInfo, genesisId, genesisSymbol]);

  const hasInsufficientBalance = userBalance < activeQuote.totalCryptoCost && userBalance > 0;

  const handleRepairConfirm = async () => {
    if (!lab?.id) return;
    setSubmitting(true);
    setErrorMessage(null);
    try {
      const blockchainId = selectedNetwork?.id || (lab as any).blockchainId || 'mainnet';
      const result = await dispatch(
        repairLaboratory({
          labId: lab.id,
          blockchainId,
          blocksToRepair: selectedBlocks,
        })
      );

      if (repairLaboratory.fulfilled.match(result)) {
        dispatch(
          addNotification({
            message: `¡Mantenimiento exitoso! Salud restaurada a ${result.payload.laboratory.currentLife.toFixed(1)}%`,
            type: 'success',
            duration: 6000,
          })
        );
        onClose();
      } else {
        const msg = (result.payload as string) || 'Error al ejecutar la reparación del equipo.';
        setErrorMessage(msg);
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Error inesperado durante la reparación');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      className="relative max-h-[90vh] w-full max-w-[560px] overflow-y-auto rounded-2xl border border-[#00f3ff]/30 bg-[#070b14]/95 p-6 shadow-[0_0_50px_rgba(0,243,255,0.15),inset_0_0_20px_rgba(0,243,255,0.05)] backdrop-blur-2xl"
    >
      {/* Close button */}
      <button
        onClick={onClose}
        disabled={submitting}
        className="absolute right-4 top-4 rounded-full p-1 text-white/50 transition-colors hover:bg-white/10 hover:text-white"
      >
        <X size={20} />
      </button>

      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        <div
          className="flex h-12 w-12 items-center justify-center rounded-xl"
          style={{
            backgroundColor: isCollapsed ? 'rgba(255, 23, 68, 0.15)' : 'rgba(0, 243, 255, 0.15)',
            border: `1px solid ${isCollapsed ? '#ff1744' : '#00f3ff'}`,
            color: isCollapsed ? '#ff1744' : '#00f3ff',
          }}
        >
          {isCollapsed ? <ShieldAlert size={26} /> : <Wrench size={24} />}
        </div>
        <div>
          <Typography variant="h6" className="text-lg font-bold text-white">
            {isCollapsed ? 'REPARACIÓN DE EMERGENCIA' : 'MANTENIMIENTO ESTRUCTURAL'}
          </Typography>
          <Typography variant="caption" className="font-mono text-xs text-white/50">
            SISTEMA MODULAR • PROTOCOLO ANTI-VOLATILIDAD
          </Typography>
        </div>
      </div>

      {/* Condition Banner */}
      <div
        className="mb-6 rounded-xl border p-4"
        style={{
          borderColor: isCollapsed ? 'rgba(255, 23, 68, 0.4)' : 'rgba(0, 243, 255, 0.2)',
          backgroundColor: isCollapsed ? 'rgba(255, 23, 68, 0.08)' : 'rgba(0, 243, 255, 0.04)',
        }}
      >
        <div className="flex items-center justify-between">
          <div>
            <Typography variant="caption" className="font-bold text-white/50">
              ESTADO ACTUAL DEL HARDWARE
            </Typography>
            <div className="flex items-center gap-2">
              <span
                className="font-mono text-2xl font-bold"
                style={{ color: isCollapsed ? '#ff1744' : currentLife < 30 ? '#ffb700' : '#00e676' }}
              >
                {currentLife.toFixed(2)}%
              </span>
              <span
                className="rounded px-2 py-0.5 text-[0.65rem] font-bold"
                style={{
                  backgroundColor: isCollapsed ? 'rgba(255, 23, 68, 0.2)' : 'rgba(0, 230, 118, 0.2)',
                  color: isCollapsed ? '#ff1744' : '#00e676',
                }}
              >
                {isCollapsed ? 'COLAPSO TOTAL (INYECCIÓN BLOQUEADA)' : currentLife < 30 ? 'CRÍTICO' : 'OPERATIVO'}
              </span>
            </div>
          </div>
          <div className="text-right">
            <Typography variant="caption" className="font-bold text-white/50">
              SALUD POST-REPARACIÓN
            </Typography>
            <Typography variant="h6" className="font-mono font-bold text-[#00f3ff]">
              → {activeQuote.resultingLife.toFixed(1)}%
            </Typography>
          </div>
        </div>

        {/* Health bar visualization */}
        <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full transition-all duration-300"
            style={{
              width: `${Math.min(100, activeQuote.resultingLife)}%`,
              background: isCollapsed
                ? 'linear-gradient(90deg, #ff1744, #00f3ff)'
                : 'linear-gradient(90deg, #ffb700, #00e676)',
            }}
          />
        </div>
      </div>

      {/* Block Selector */}
      <div className="mb-6 rounded-xl border border-white/10 bg-white/[0.02] p-4">
        <div className="mb-2 flex items-center justify-between">
          <Typography variant="body2" className="font-bold text-white">
            Cantidad de Reparación (Bloques de 10%)
          </Typography>
          <span className="font-mono text-sm font-bold text-[#00f3ff]">
            +{selectedBlocks * 10}% salud ({selectedBlocks} {selectedBlocks === 1 ? 'bloque' : 'bloques'})
          </span>
        </div>

        {/* Stepper buttons */}
        <div className="mb-4 flex items-center gap-3">
          <button
            type="button"
            disabled={selectedBlocks <= 1 || submitting}
            onClick={() => setSelectedBlocks((b) => Math.max(1, b - 1))}
            className="flex h-10 w-12 items-center justify-center rounded-lg border border-white/20 bg-white/5 text-lg font-bold text-white transition hover:bg-white/10 disabled:opacity-30"
          >
            -
          </button>
          <div className="flex-1 text-center font-mono text-lg font-bold text-white">
            {selectedBlocks} {selectedBlocks === 1 ? 'Bloque (10%)' : 'Bloques (' + selectedBlocks * 10 + '%)'}
          </div>
          <button
            type="button"
            disabled={selectedBlocks >= maxBlocks || submitting}
            onClick={() => setSelectedBlocks((b) => Math.min(maxBlocks, b + 1))}
            className="flex h-10 w-12 items-center justify-center rounded-lg border border-white/20 bg-white/5 text-lg font-bold text-white transition hover:bg-white/10 disabled:opacity-30"
          >
            +
          </button>
        </div>

        {/* Quick selection chips */}
        <div className="flex flex-wrap gap-2">
          {[1, 3, 5, maxBlocks].map((b) => {
            if (b > maxBlocks) return null;
            const isFull = b === maxBlocks;
            const isSelected = selectedBlocks === b;
            return (
              <button
                key={b}
                type="button"
                disabled={submitting}
                onClick={() => setSelectedBlocks(b)}
                className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                  isSelected
                    ? 'border border-[#00f3ff] bg-[#00f3ff]/20 text-[#00f3ff]'
                    : 'border border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                {isFull ? `Restaurar al 100% (${b} blq)` : `+${b * 10}%`}
              </button>
            );
          })}
        </div>
      </div>

      {/* Pricing Breakdown & Anti-Volatility Peg */}
      <div className="mb-6 rounded-xl border border-white/10 bg-white/[0.03] p-4 text-xs">
        <div className="mb-3 flex items-center gap-2 border-b border-white/10 pb-2">
          <DollarSign size={16} className="text-[#00f3ff]" />
          <Typography variant="body2" className="font-bold text-white">
            Estructura de Precio Justo Anti-Volatilidad
          </Typography>
        </div>

        <div className="flex flex-col gap-2 font-mono">
          <div className="flex items-center justify-between text-white/70">
            <span>Benchmark base:</span>
            <span className="text-white">$0.50 USD / bloque (10%)</span>
          </div>

          <div className="flex items-center justify-between text-white/70">
            <span>Factor de desgaste ({currentLife.toFixed(0)}% vida):</span>
            <span className={activeQuote.wearMultiplier > 1.5 ? 'font-bold text-[#ff1744]' : 'text-[#00e676]'}>
              {activeQuote.wearMultiplier.toFixed(2)}x penalización
            </span>
          </div>

          <div className="flex items-center justify-between text-white/70">
            <span>Costo por bloque resultante:</span>
            <span className="text-white">${activeQuote.usdCostPerBlock.toFixed(2)} USD</span>
          </div>

          <div className="my-1 border-t border-white/10" />

          <div className="flex items-center justify-between text-sm">
            <span className="font-bold text-white">Total a pagar:</span>
            <div className="text-right">
              <span className="text-base font-bold text-[#00f3ff]">
                {activeQuote.totalCryptoCost} {genesisSymbol}
              </span>
              <span className="block text-[0.7rem] text-white/50">
                (~${activeQuote.totalUsdCost.toFixed(2)} USD indexado)
              </span>
            </div>
          </div>
        </div>

        <div className="mt-3 rounded-lg border border-white/5 bg-white/[0.02] p-2.5 text-[0.7rem] text-white/60">
          <p className="flex items-start gap-1.5">
            <span className="text-[#00e676]">💡</span>
            <span>
              <strong>Ventaja Preventiva:</strong> Realizar mantenimientos con vida útil alta reduce el costo hasta un 66% por bloque frente a reparar tras un colapso.
            </span>
          </p>
        </div>
      </div>

      {/* Error / Warning Alert */}
      {errorMessage && (
        <div className="mb-4 rounded-lg border border-[#ff1744]/40 bg-[#ff1744]/10 p-3 text-xs text-[#ff1744]">
          {errorMessage}
        </div>
      )}

      {hasInsufficientBalance && (
        <div className="mb-4 rounded-lg border border-[#ffb700]/40 bg-[#ffb700]/10 p-3 text-xs text-[#ffb700]">
          Saldo actual: {userBalance.toFixed(4)} {genesisSymbol}. Podrías requerir más fondos para cubrir {activeQuote.totalCryptoCost} {genesisSymbol}.
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-3">
        <Button
          variant="outlined"
          fullWidth
          disabled={submitting}
          onClick={onClose}
          className="border-white/20 text-white hover:bg-white/10"
        >
          CANCELAR
        </Button>
        <Button
          variant="contained"
          fullWidth
          disabled={submitting || loadingQuote || currentLife >= 100}
          onClick={handleRepairConfirm}
          sx={{
            py: 1.5,
            bgcolor: isCollapsed ? '#ff1744' : '#00e676',
            color: '#000',
            fontWeight: 'bold',
            '&:hover': {
              bgcolor: isCollapsed ? '#d50000' : '#00c853',
            },
          }}
        >
          {submitting ? 'REPARANDO HARDWARE...' : `REPARAR (${activeQuote.totalCryptoCost} ${genesisSymbol})`}
        </Button>
      </div>
    </Dialog>
  );
};
