// 1-Obtención del despachador para emitir acciones al store
// 2-Gestión de estado local para time left
// 3-Efecto secundario para sincronización del ciclo de vida
// 4-Estructuración y renderizado visual del componente UI
// 5-Estructuración y renderizado visual del componente UI
// 6-Obtención del despachador para emitir acciones al store
// 7-Selección de datos desde el estado global de Redux
// 8-Selección de datos desde el estado global de Redux
// 9-Gestión de estado local para tick
// 10-Efecto secundario para sincronización del ciclo de vida
// 11-Efecto secundario para sincronización del ciclo de vida
// 12-Gestión de estado local para claiming reward id
// 13-Manejo de lógica de usuario para handleClaim
// 14-Estructuración y renderizado visual del componente UI
// 15-Estructuración y renderizado visual del componente UI

'use client';

import React from 'react';
import { Typography } from '../../components/ui/Typography';
import { CustomButton } from '../../components/ui/CustomButton';
import { Background } from '../../components/layout/Background';
import { TechFrame } from '../../components/ui/TechFrame';
import { PageHeader } from '../../components/ui/PageHeader';

//# 1-Obtención del despachador para emitir acciones al store
import { useAppDispatch, useAppSelector } from '../../lib/hooks';
import { claimReward, fetchRewards } from '../../lib/features/blockchain/actions';
import { setRewardCooldown } from '../../lib/features/blockchain/reducer';
import { motion } from 'framer-motion';
import { Reward } from '../../lib/features/blockchain/types';
import { TaoIcon } from '../../components/ui/TaoIcon';
import { Check } from 'lucide-react';
import { addNotification } from '../../lib/features/uiSlice';

const Countdown = ({ targetDate, onComplete }: { targetDate: number; onComplete?: () => void }) => {
    
    //# 2-Gestión de estado local para time left
    const [timeLeft, setTimeLeft] = React.useState('');

    
    
    //# 3-Efecto secundario para sincronización del ciclo de vida
    React.useEffect(() => {
        const calculateTimeLeft = () => {
            const difference = targetDate - Date.now();
            
            if (difference > 0) {
                const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
                const minutes = Math.floor((difference / 1000 / 60) % 60);
                const seconds = Math.floor((difference / 1000) % 60);
                setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
            } else {
                setTimeLeft('');
                if (onComplete) onComplete();
            }
        };

        calculateTimeLeft();
        const timer = setInterval(calculateTimeLeft, 1000);
        
        
        //# 4-Estructuración y renderizado visual del componente UI
        return () => clearInterval(timer);
    }, [targetDate, onComplete]);

    if (!timeLeft) return null;

    
    
    //# 5-Estructuración y renderizado visual del componente UI
    return (
        <div className="absolute top-4 left-1/2 z-10 -translate-x-1/2 rounded-2xl border border-white/10 bg-black/60 px-4 py-1">
            <Typography variant="caption" className="font-bold text-[#00e676]">
                {timeLeft}
            </Typography>
        </div>
    );
};

export default function RewardsPage() {
  
  //# 6-Obtención del despachador para emitir acciones al store
  const dispatch = useAppDispatch();
  
  //# 7-Selección de datos desde el estado global de Redux
  const { rewards, isLoading, error } = useAppSelector((state) => state.blockchain);
  
  //# 8-Selección de datos desde el estado global de Redux
  const { userInfo } = useAppSelector((state) => state.auth);
  
  // forceUpdate: flips when a countdown finishes to refresh card claimed-state
  // without triggering a re-fetch (safe unlike the old tick + useEffect combo)
  const [, forceUpdate] = React.useReducer(x => x + 1, 0);

  // FIX: hasFetched ref prevents the infinite loop.
  // The original deps (rewards.length, isLoading, error) all change as a
  // side effect of calling fetchRewards() itself, creating an endless cycle.
  const hasFetched = React.useRef(false);
  const prevUserId = React.useRef<string | null>(null);

  //# 11-Efecto secundario para sincronización del ciclo de vida
  React.useEffect(() => {
    if (!userInfo) return;

    // Reset when the logged-in user changes (logout / re-login)
    if (prevUserId.current && prevUserId.current !== userInfo.id) {
      hasFetched.current = false;
    }
    prevUserId.current = userInfo.id ?? null;

    if (!hasFetched.current) {
      hasFetched.current = true;
      dispatch(fetchRewards());
    }
  }, [dispatch, userInfo]);

  
  //# 12-Gestión de estado local para claiming reward id
  const [claimingRewardId, setClaimingRewardId] = React.useState<string | null>(null);

  
  
  //# 13-Manejo de lógica de usuario para handleClaim
  const handleClaim = async (reward: Reward) => {
    if (!userInfo) {
         dispatch(addNotification({ type: 'warning', message: 'Debes iniciar sesión para reclamar recompensas.' }));
         return;
    }

    const userReward = userInfo?.rewards?.find((r) => r.id === reward.id) || userInfo?.rewards?.[0];
    if (userReward?.claimedAt) {
        const intervalVal = typeof reward.interval === 'number' ? reward.interval : parseInt(reward.interval || '1', 10);
        const nextClaimTime = new Date(userReward.claimedAt).getTime() + (intervalVal * 60 * 1000);
        const difference = nextClaimTime - Date.now();
        if (difference > 0) {
            const remainingMinutes = Math.ceil(difference / (1000 * 60));
            dispatch(addNotification({ 
                type: 'error', 
                message: `Reward not available. You need to wait ${remainingMinutes} minutes.` 
            }));
            return;
        }
    }

    setClaimingRewardId(reward.id);
    try {
        await dispatch(claimReward({ id: reward.id, userId: userInfo.id, rewardType: reward?.rewardType, amount: reward?.amount })).unwrap();
        dispatch(addNotification({ type: 'success', message: '¡Recompensa reclamada con éxito!' }));
    } catch (err) {
        const errMsg = err as string || '';
        const match = errMsg.match(/wait (\d+) minutes/);
        if (match) {
            const minutes = parseInt(match[1], 10);
            const cooldownTime = Date.now() + (minutes * 60 * 1000);
            dispatch(setRewardCooldown({ rewardId: reward.id, nextClaimTime: cooldownTime }));
        }
        dispatch(addNotification({ type: 'error', message: errMsg || 'Error al reclamar recompensa.' }));
    } finally {
        setClaimingRewardId(null);
    }
  };

  
  
  //# 14-Estructuración y renderizado visual del componente UI
  return (
    <div className="relative min-h-screen">
      <Background />

      <div className="relative z-10 mx-auto w-full max-w-[1536px] px-4 pt-40 pb-20 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <PageHeader
                title="Centro de Recompensas"
                subtitle="Reclama suministros diarios y bonificaciones por tus logros en la expansión de la red."
                color="#ff0055"
            />
        </motion.div>

        {isLoading ? (
            <div className="my-20 flex justify-center">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-white/20 border-t-white" />
            </div>
        ) : error ? (
            <Typography variant="body1" className="text-center text-error">Error al cargar recompensas: {error}</Typography>
        ) : (
            <div className="grid grid-cols-1 items-center justify-center gap-8 sm:grid-cols-2 md:grid-cols-3">
                {rewards.map((reward, index) => {
                    
                    const userReward = userInfo?.rewards?.find((r) => r.id === reward.id) || userInfo?.rewards?.[0];
                    const lastClaimedAt = userReward?.claimedAt;
                    
                    const intervalVal = typeof reward.interval === 'number' ? reward.interval : parseInt(reward.interval || '1', 10);
                    const intervalMinutes = intervalVal; 
                    const nextClaimTime = lastClaimedAt 
                        ? new Date(lastClaimedAt).getTime() + (intervalMinutes * 60 * 1000)
                        : null;
                        
                    
                    
                    const isClaimedPersisted = !!nextClaimTime && Date.now() < nextClaimTime;
                    const isClaimedSession = !!(reward.nextClaimTime && Date.now() < reward.nextClaimTime);
                    
                    const isClaimedNow = isClaimedPersisted || isClaimedSession;
                    const targetTime = isClaimedSession ? (reward.nextClaimTime || 0) : (nextClaimTime || 0);

                    
                    
                    //# 15-Estructuración y renderizado visual del componente UI
                    return (
                    <div key={reward.id}>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                            style={{ height: '100%' }}
                        >
                            <TechFrame
                                color={isClaimedNow ? '#00ff9d' : '#ff0055'}
                                className="h-full w-full"
                            >
                                <div className="relative flex h-full flex-col items-center p-8 text-center">
                                    {isClaimedNow && targetTime > 0 && (
                                        <Countdown
                                            targetDate={targetTime}
                                            onComplete={forceUpdate}
                                        />
                                    )}
                                    <div
                                        className="relative mb-6 flex h-20 w-20 items-center justify-center rounded-full"
                                        style={{
                                            backgroundColor: reward.isClaimed ? 'rgba(0, 255, 157, 0.1)' : 'rgba(255, 0, 85, 0.1)',
                                            border: `1px solid ${isClaimedNow ? '#00ff9d' : '#ff0055'}`,
                                            boxShadow: `0 0 20px ${isClaimedNow ? '#00ff9d' : '#ff0055'}40`,
                                        }}
                                    >
                                        {isClaimedNow ? (
                                            <Check size={40} color="#00ff9d" />
                                        ) : (
                                            <TaoIcon size={40} />
                                        )}
                                    </div>

                                    <Typography variant="h5" className="mb-2 font-bold text-white">
                                        {reward.name}
                                    </Typography>

                                    <Typography variant="body2" className="mb-8 flex-grow text-foreground-muted">
                                        {reward.description}
                                    </Typography>

                                    <div className="mb-6 flex items-center gap-2">
                                        <Typography variant="h6" className="font-bold" style={{ color: isClaimedNow ? '#00ff9d' : '#ffb700' }}>
                                            {reward.amount.toLocaleString()}
                                        </Typography>
                                        <TaoIcon size={12} />
                                    </div>

                                    <CustomButton
                                        variant={isClaimedNow ? "neutral" : "info"}
                                        fullWidth
                                        disabled={isClaimedNow || claimingRewardId === reward.id}
                                        onClick={() => handleClaim(reward)}
                                        glow={!isClaimedNow}
                                        startIcon={claimingRewardId === reward.id ? <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current/20 border-t-current" /> : null}
                                    >
                                        {claimingRewardId === reward.id ? 'Reclamando...' : isClaimedNow ? 'RECLAMADO' : 'RECLAMAR'}
                                    </CustomButton>
                                </div>
                            </TechFrame>
                        </motion.div>
                    </div>
                    );
                })}
            </div>
        )}
      </div>
    </div>
  );
}
