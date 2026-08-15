import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Receipt, PiggyBank } from "lucide-react";
import { useAppSelector, useAppDispatch } from "../../lib/hooks";
import { updateNetworkPower } from "../../lib/features/blockchain/reducer";
import api from "../../lib/api";
import { RootState } from "../../lib/store";
import { getCBUnit, processingFrequencies } from "../../lib/constants/blockchainFrequencies";
import { formatHash } from "../../lib/utils/formatHash";
import { Typography } from "../ui/Typography";
import { Button } from "../ui/Button";

interface NetworkSectionProps {
  onRefetch?: () => void;
}

export function LaboratorioNetworkSection({ onRefetch }: NetworkSectionProps) {
  const dispatch = useAppDispatch();
  const { currentLab, isPoweredOn } = useAppSelector((state: RootState) => state.reducerLabs);
  const { selectedNetwork, chronoBurstFreqTypes } = useAppSelector((state: RootState) => state.blockchain);

  const blockchainId = selectedNetwork?.id ?? null;
  const totalPowerMining = selectedNetwork?.blockchainProps?.totalPowerMining || 0;

  const [isClaiming, setIsClaiming] = useState(false);
  const [isInjecting, setIsInjecting] = useState(false);
  const [showGoldenPulse, setShowGoldenPulse] = useState(false);
  const [prevRewards, setPrevRewards] = useState(0);
  const [rewardsChanged, setRewardsChanged] = useState(false);

  const pendingRewards = currentLab?.pendingRewards || 0;
  const currentEnergy = (currentLab?.energy || 0).toFixed(3);

  const slots = currentLab?.slots || [];
  const labFrequency = slots.length > 0
    ? slots.reduce((acc, s) => Math.max(acc, s.hashRate || processingFrequencies.MEGA_CB), processingFrequencies.MEGA_CB)
    : processingFrequencies.MEGA_CB;
  const frequencyMultiplier = labFrequency / processingFrequencies.MEGA_CB;
  const totalPower = isPoweredOn ? ((currentLab?.hashRate || 0) * frequencyMultiplier) : 0;
  const labUnit = getCBUnit(labFrequency);

  // Animation Trigger for Rewards
  useEffect(() => {
    if (pendingRewards > prevRewards) {
      setRewardsChanged(true);
      const timer = setTimeout(() => setRewardsChanged(false), 2000);
      setPrevRewards(pendingRewards);
      return () => clearTimeout(timer);
    }
    setPrevRewards(pendingRewards);
  }, [pendingRewards, prevRewards]);

  const handleClaim = async () => {
    if (!currentLab?.id || pendingRewards <= 0) return;
    setIsClaiming(true);
    try {
      await api.put(`/labs/${currentLab.id}/claim`);
      onRefetch?.();
    } catch (error) {
      console.error("Error claiming rewards:", error);
    } finally {
      setIsClaiming(false);
    }
  };

  const totalFees = totalPower ? (totalPower * 0.12).toFixed(2) : '0.00';

  return (
    <div className="flex h-full flex-col gap-6" style={{ opacity: currentLab ? 1 : 0.6 }}>

      {/* Network Stats Cards */}
      <div className="flex flex-col gap-4">
        <div className="relative flex items-center gap-6 overflow-hidden rounded-2xl border border-[#00f3ff]/20 bg-[#00f3ff]/5 p-6 shadow-[0_0_30px_rgba(0,243,255,0.1)]">
            <div className="flex items-center justify-center rounded-xl border border-[#00f3ff]/30 bg-[#00f3ff]/10 p-3">
                <Zap size={32} className="pulse-animation text-[#00f3ff]" />
            </div>
            <div>
                <Typography variant="overline" className="mb-1 block font-bold leading-none tracking-[2px] text-[#00f3ff]">
                    NETWORK MINING POWER
                </Typography>
                <div className="flex items-baseline gap-2">
                    <Typography variant="h4" className="font-black tracking-tight text-white [text-shadow:0_0_20px_rgba(0,243,255,0.5)]">
                        {(totalPowerMining || 0).toLocaleString('en-US')}
                    </Typography>
                    <Typography variant="h6" className="font-bold text-[#00f3ff]/80">
                        GH/s
                    </Typography>
                </div>
            </div>
        </div>

        <div className="rounded-xl border border-[#b000ff]/10 bg-[#b000ff]/5 p-4 text-center">
          <Receipt size={24} className="mx-auto mb-2 text-[#b000ff]" />
          <Typography variant="caption" component="p" className="text-white/50">Fees Históricos</Typography>
          <Typography variant="h6" component="p" className="font-bold text-white">+{totalFees} SAMT</Typography>
        </div>
      </div>

      {/* Power Info Section */}
      <div className="rounded-2xl border border-[#00f3ff]/[0.08] bg-[rgba(10,12,16,0.6)] p-5">
        <div className="mb-2 flex justify-between">
          <Typography variant="caption" className="text-[0.65rem] text-white/35">
            Poder Total Lab: <span className="font-bold text-[#00f3ff]">{totalPower.toFixed(1)} {labUnit}</span>
          </Typography>
          <Typography variant="caption" className="text-[0.65rem] text-white/35">
            Hash Acumulado: <span className="font-bold text-[#00f3ff]">{formatHash(currentLab?.energy || 0, chronoBurstFreqTypes)}</span>
          </Typography>
        </div>
        <Typography variant="caption" component="p" className="block text-center text-[0.6rem] italic text-white/20">
            Inyección automática cada 10 rounds de simulación activa.
        </Typography>
      </div>

      {/* Rewards Claim Section */}
      <motion.div
        animate={rewardsChanged ? {
            scale: [1, 1.05, 1],
            boxShadow: ["0 0 0px #28a74500", "0 0 25px #28a74560", "0 0 0px #28a74500"]
        } : {}}
        className="flex items-center justify-between rounded-2xl p-5 transition-[border] duration-300"
        style={{
          backgroundColor: 'rgba(40, 167, 69, 0.08)',
          border: `1px solid ${rewardsChanged ? '#28a745' : 'rgba(40, 167, 69, 0.2)'}`,
          boxShadow: pendingRewards > 0 ? '0 0 20px rgba(40, 167, 69, 0.15)' : 'none'
        }}
      >
        <div>
          <div className="mb-1 flex flex-row items-center gap-2">
            <PiggyBank size={20} className="text-[#28a745]" />
            <Typography variant="subtitle2" component="p" className="font-bold text-white">RECOMPENSAS PENDIENTES</Typography>
          </div>
          <AnimatePresence mode="wait">
            <motion.div
                key={pendingRewards}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
            >
                <Typography variant="h5" component="p" className="font-bold text-[#28a745]">
                    {pendingRewards.toFixed(4)}{' '}
                    <Typography component="span" variant="caption" className="text-white/50">SAMT</Typography>
                </Typography>
            </motion.div>
          </AnimatePresence>
        </div>
        <Button
          variant="contained"
          size="large"
          disabled={isClaiming || pendingRewards <= 0}
          onClick={handleClaim}
          sx={{
            borderRadius: 3, px: 4,
            bgcolor: '#28a745',
            '&:hover': { bgcolor: '#218838' },
            '&.Mui-disabled': { bgcolor: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.2)' },
            textTransform: 'none', fontWeight: 'bold',
            boxShadow: '0 4px 15px rgba(40, 167, 69, 0.3)'
          }}
        >
          {isClaiming ? <div className="h-6 w-6 animate-spin rounded-full border-2 border-current/30 border-t-current" /> : 'RECLAMAR (CLAIM)'}
        </Button>
      </motion.div>
    </div>
  );
}
