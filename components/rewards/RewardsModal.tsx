// 1-Efecto secundario para sincronización del ciclo de vida
// 2-Obtención del despachador para emitir acciones al store
// 3-Obtención del despachador para emitir acciones al store
// 4-Selección de datos desde el estado global de Redux
// 5-Selección de datos desde el estado global de Redux
// 6-Gestión de estado local para claiming id
// 7-Control de visibilidad para interface de show success
// 8-Efecto secundario para sincronización del ciclo de vida
// 9-Manejo de lógica de usuario para handleClaim
// 10-Estructuración y renderizado visual del componente UI
// 11-Estructuración y renderizado visual del componente UI
// 12-Estructuración y renderizado visual del componente UI

//# 1-Efecto secundario para sincronización del ciclo de vida
import React, { useEffect, useState } from 'react';
import { Gift, CheckCircle, Coins } from 'lucide-react';
import { CustomButton } from '../ui/CustomButton';
import { Typography } from '../ui/Typography';

//# 2-Obtención del despachador para emitir acciones al store
import { useAppDispatch, useAppSelector } from '../../lib/hooks';
import { fetchRewards, claimReward } from '../../lib/features/blockchain/actions';
import { Reward } from '../../lib/features/blockchain/types';
import { TechFrame } from '../ui/TechFrame';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { addNotification } from '../../lib/features/uiSlice';
import { setRewardCooldown } from '../../lib/features/blockchain/reducer';
import { Countdown } from './Countdown';

const Spinner = ({ className = 'h-6 w-6 border-2' }: { className?: string }) => (
    <div className={`animate-spin rounded-full border-white/20 border-t-[#00f3ff] ${className}`} />
);

export const RewardsModal = () => {

    //# 3-Obtención del despachador para emitir acciones al store
    const dispatch = useAppDispatch();

    //# 4-Selección de datos desde el estado global de Redux
    const { rewards, isLoading, error } = useAppSelector((state) => state.blockchain);

    //# 5-Selección de datos desde el estado global de Redux
    const { userInfo } = useAppSelector((state) => state.auth);


    //# 6-Gestión de estado local para claiming id
    const [claimingId, setClaimingId] = useState<string | null>(null);


    //# 7-Control de visibilidad para interface de show success
    const [showSuccess, setShowSuccess] = useState<string | null>(null);
    const [, forceUpdate] = React.useReducer((x: number) => x + 1, 0);



    //# 8-Efecto secundario para sincronización del ciclo de vida
    // FIX: Use a ref-based guard to prevent the infinite loop caused by
    // having isLoading/error/rewards.length as effect dependencies.
    // Those state changes were re-triggering the effect after each fetch.
    const hasFetched = React.useRef(false);
    const prevUserId = React.useRef<string | null>(null);

    useEffect(() => {
        if (!userInfo) return;

        // Reset fetch guard when the logged-in user changes (logout/re-login)
        if (prevUserId.current && prevUserId.current !== userInfo.id) {
            hasFetched.current = false;
        }
        prevUserId.current = userInfo.id ?? null;

        if (!hasFetched.current) {
            hasFetched.current = true;
            dispatch(fetchRewards());
        }
    }, [dispatch, userInfo]);

    const triggerSuccessConfetti = () => {
        const count = 200;
        const defaults = {
            origin: { y: 0.7 },
            zIndex: 9999
        };

        function fire(particleRatio: number, opts: confetti.Options) {
            confetti({
                ...defaults,
                ...opts,
                particleCount: Math.floor(count * particleRatio)
            });
        }

        fire(0.25, { spread: 26, startVelocity: 55, colors: ['#00f3ff', '#ffffff'] });
        fire(0.2, { spread: 60, colors: ['#00f3ff', '#0066ff'] });
        fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8, colors: ['#00f3ff', '#ffffff'] });
        fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2, colors: ['#00f3ff', '#0066ff'] });
        fire(0.1, { spread: 120, startVelocity: 45, colors: ['#00f3ff', '#ffffff'] });
    };



    //# 9-Manejo de lógica de usuario para handleClaim
    const handleClaim = async (reward: Reward) => {
        if (!userInfo?.id) return;

        const userReward = userInfo?.rewards?.find((r) => r.id === reward.id) || userInfo?.rewards?.[0];
        if (userReward?.claimedAt) {
            const intervalVal = Number(reward.interval) || 1;
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

        setClaimingId(reward.id);

        try {
            await dispatch(claimReward({ id: reward.id, userId: userInfo.id })).unwrap();
            triggerSuccessConfetti();
            setShowSuccess(`+${reward.amount} CRÉDITOS`);

            setTimeout(() => {
                setShowSuccess(null);
                dispatch(fetchRewards());
            }, 3000);
        } catch (err) {
            console.error(err);
            const errMsg = err as string || '';
            const match = errMsg.match(/wait (\d+) minutes/);
            if (match) {
                const minutes = parseInt(match[1], 10);
                const cooldownTime = Date.now() + (minutes * 60 * 1000);
                dispatch(setRewardCooldown({ rewardId: reward.id, nextClaimTime: cooldownTime }));
            }
            dispatch(addNotification({
                type: 'error',
                message: errMsg || 'Error al reclamar recompensa.'
            }));
        } finally {
            setClaimingId(null);
        }
    };

    if (isLoading && rewards.length === 0) {


        //# 10-Estructuración y renderizado visual del componente UI
        return (
            <div className="flex flex-col items-center justify-center gap-4 p-10">
                <Spinner />
                <Typography variant="overline" className="tracking-[4px] text-[#00f3ff]">Sincronizando Recompensas...</Typography>
            </div>
        );
    }

    if (error) {


        //# 11-Estructuración y renderizado visual del componente UI
        return (
            <div className="p-8 text-center">
                <Typography className="mb-4 text-error">ERROR_DE_ENLACE: {error}</Typography>
                <CustomButton
                    variant="error"
                    onClick={() => dispatch(fetchRewards())}
                    glow
                >
                    REINTENTAR_CONEXION
                </CustomButton>
            </div>
        );
    }



    //# 12-Estructuración y renderizado visual del componente UI
    return (
        <div className="relative">
            <AnimatePresence>
                {showSuccess && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5, y: 20 }}
                        animate={{ opacity: 1, scale: 1.1, y: 0 }}
                        exit={{ opacity: 0, scale: 1.5, y: -50 }}
                        style={{
                            position: 'absolute',
                            top: '40%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            zIndex: 100,
                            pointerEvents: 'none'
                        }}
                    >
                        <div className="flex min-w-[200px] flex-col items-center rounded-full border-2 border-[#00f3ff] bg-[#00f3ff]/20 p-6 shadow-[0_0_50px_rgba(0,243,255,0.5)] backdrop-blur-xl">
                            <CheckCircle size={60} className="mb-2 text-[#00f3ff]" />
                            <Typography variant="h4" className="font-bold text-white [text-shadow:0_0_10px_#00f3ff]">
                                {showSuccess}
                            </Typography>
                            <Typography variant="overline" className="font-bold text-[#00f3ff]">
                                RECOMPENSA_ADQUIRIDA
                            </Typography>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <Typography variant="overline" className="mb-2 block tracking-[4px] text-white/50">
                {'// REWARD_CENTRAL_TERMINAL'}
            </Typography>
            <Typography variant="h4" className="mb-2 flex items-center gap-4 font-bold text-white">
                <Gift className="text-[#00f3ff]" /> BOTÍN DISPONIBLE
            </Typography>
            <Typography variant="body2" className="mb-8 text-white/60">
                Optimiza tus activos mediante la ejecución de protocolos diarios y metas de sistema.
            </Typography>

            <div className="flex flex-col gap-6">
                {rewards.length === 0 ? (
                    <div className="rounded-lg border border-dashed border-white/10 p-12 text-center">
                        <Typography variant="caption" className="italic text-white/30">
                            No se han detectado paquetes de recompensa activos en la red.
                        </Typography>
                    </div>
                ) : (
                    rewards.map((reward) => {
                        const userReward = userInfo?.rewards?.find((r) => r.id === reward.id) || userInfo?.rewards?.[0];
                        const lastClaimedAt = userReward?.claimedAt;

                        const intervalVal = Number(reward.interval) || 1;
                        const nextClaimTime = lastClaimedAt
                            ? new Date(lastClaimedAt).getTime() + (intervalVal * 60 * 1000)
                            : null;

                        const isClaimedPersisted = !!nextClaimTime && Date.now() < nextClaimTime;
                        const isClaimedSession = !!(reward.nextClaimTime && Date.now() < reward.nextClaimTime);

                        const isClaimedNow = isClaimedPersisted || isClaimedSession || !!reward.isClaimed;
                        const targetTime = isClaimedSession ? (reward.nextClaimTime || 0) : (nextClaimTime || 0);

                        return (
                        <TechFrame key={reward.id} color={isClaimedNow ? 'rgba(255,255,255,0.2)' : '#00f3ff'}>
                            <div
                                className="flex flex-col items-start gap-6 p-6 transition-all duration-300 sm:flex-row sm:items-center"
                                style={{ backgroundColor: isClaimedNow ? 'rgba(255,255,255,0.02)' : 'rgba(0, 243, 255, 0.03)' }}
                            >
                                <div
                                    className="flex h-[60px] w-[60px] items-center justify-center rounded"
                                    style={{
                                        backgroundColor: isClaimedNow ? 'rgba(255,255,255,0.05)' : 'rgba(0, 243, 255, 0.1)',
                                        border: `1px solid ${isClaimedNow ? 'rgba(255,255,255,0.1)' : 'rgba(0, 243, 255, 0.2)'}`,
                                    }}
                                >
                                    <Coins size={32} style={{ color: isClaimedNow ? 'rgba(255,255,255,0.3)' : '#00f3ff' }} />
                                </div>

                                <div className="flex-1">
                                    <div className="mb-1 flex items-center gap-2">
                                        <Typography
                                            variant="h6"
                                            className="font-bold"
                                            style={{ color: isClaimedNow ? 'rgba(255,255,255,0.4)' : 'white' }}
                                        >
                                            {reward.name}
                                        </Typography>
                                        <div className="rounded-sm border border-white/10 bg-white/5 px-2 py-0.5">
                                            <Typography variant="caption" className="text-[0.6rem] font-bold text-white/50">
                                                {reward.rewardType || 'SISTEMA'}
                                            </Typography>
                                        </div>
                                    </div>
                                    <Typography
                                        variant="body2"
                                        style={{ color: isClaimedNow ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.6)' }}
                                    >
                                        {reward.description}
                                    </Typography>
                                </div>

                                <div className="flex min-w-[140px] flex-col items-start gap-2 text-left sm:items-end sm:text-right">
                                    <Typography
                                        variant="h5"
                                        className="font-mono font-bold"
                                        style={{ color: isClaimedNow ? 'rgba(255,255,255,0.2)' : '#00ff88' }}
                                    >
                                        +{reward.amount} CR
                                    </Typography>

                                    {isClaimedNow && targetTime > 0 && (
                                        <Countdown
                                            targetDate={targetTime}
                                            onComplete={forceUpdate}
                                        />
                                    )}

                                    <CustomButton
                                        fullWidth
                                        variant={isClaimedNow ? "neutral" : "info"}
                                        disabled={isClaimedNow || claimingId === reward.id}
                                        onClick={() => handleClaim(reward)}
                                        glow={!isClaimedNow}
                                        startIcon={claimingId === reward.id ? <Spinner className="h-3.5 w-3.5 border-[1.5px]" /> : null}
                                    >
                                        {claimingId === reward.id ? 'Reclamando...' : (isClaimedNow ? 'ADQUIRIDO' : 'RECLAMAR')}
                                    </CustomButton>
                                </div>
                            </div>
                        </TechFrame>
                        );
                    })
                )}
            </div>
        </div>
    );
};
