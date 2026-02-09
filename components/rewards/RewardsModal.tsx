import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, CircularProgress } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../lib/hooks';
import { fetchRewards, claimReward } from '../../lib/features/blockchain/actions';
import { Reward } from '../../lib/features/blockchain/types';
import { CardGiftcard, CheckCircle, MonetizationOn } from '@mui/icons-material';
import { TechFrame } from '../ui/TechFrame';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

export const RewardsModal = () => {
    const dispatch = useAppDispatch();
    const { rewards, isLoading, error } = useAppSelector((state) => state.blockchain);
    const { userInfo } = useAppSelector((state) => state.auth);
    const [claimingId, setClaimingId] = useState<string | null>(null);
    const [showSuccess, setShowSuccess] = useState<string | null>(null);

    useEffect(() => {
        if (userInfo && rewards.length === 0 && !isLoading && !error) {
            dispatch(fetchRewards());
        }
    }, [dispatch, userInfo, rewards.length, isLoading, error]);

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

    const handleClaim = async (reward: Reward) => {
        if (!userInfo?.id) return;
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
        } finally {
            setClaimingId(null);
        }
    };

    if (isLoading && rewards.length === 0) {
        return (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 5, gap: 2 }}>
                <CircularProgress sx={{ color: '#00f3ff' }} />
                <Typography variant="overline" sx={{ color: '#00f3ff', letterSpacing: 4 }}>Sincronizando Recompensas...</Typography>
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ p: 4, textAlign: 'center' }}>
                <Typography color="error" sx={{ mb: 2 }}>ERROR_DE_ENLACE: {error}</Typography>
                <Button 
                    variant="outlined" 
                    color="error" 
                    onClick={() => dispatch(fetchRewards())}
                >
                    REINTENTAR_CONEXION
                </Button>
            </Box>
        );
    }

    return (
        <Box sx={{ position: 'relative' }}>
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
                        <Box sx={{ 
                            p: 3, 
                            bgcolor: 'rgba(0, 243, 255, 0.2)', 
                            backdropFilter: 'blur(20px)',
                            border: '2px solid #00f3ff',
                            borderRadius: '50%',
                            boxShadow: '0 0 50px rgba(0, 243, 255, 0.5)',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            minWidth: 200
                        }}>
                            <CheckCircle sx={{ color: '#00f3ff', fontSize: 60, mb: 1 }} />
                            <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold', textShadow: '0 0 10px #00f3ff' }}>
                                {showSuccess}
                            </Typography>
                            <Typography variant="overline" sx={{ color: '#00f3ff', fontWeight: 'bold' }}>
                                RECOMPENSA_ADQUIRIDA
                            </Typography>
                        </Box>
                    </motion.div>
                )}
            </AnimatePresence>

            <Typography variant="overline" sx={{ color: 'rgba(255,255,255,0.5)', letterSpacing: 4, mb: 1, display: 'block' }}>
                {'// REWARD_CENTRAL_TERMINAL'}
            </Typography>
            <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold', mb: 1, display: 'flex', alignItems: 'center', gap: 2 }}>
                <CardGiftcard sx={{ color: '#00f3ff' }} /> BOTÍN DISPONIBLE
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)', mb: 4 }}>
                Optimiza tus activos mediante la ejecución de protocolos diarios y metas de sistema.
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {rewards.length === 0 ? (
                    <Box sx={{ p: 6, textAlign: 'center', border: '1px dashed rgba(255,255,255,0.1)', borderRadius: 2 }}>
                        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.3)', fontStyle: 'italic' }}>
                            No se han detectado paquetes de recompensa activos en la red.
                        </Typography>
                    </Box>
                ) : (
                    rewards.map((reward) => (
                        <TechFrame key={reward.id} color={reward.isClaimed ? 'rgba(255,255,255,0.2)' : '#00f3ff'}>
                            <Box sx={{ 
                                p: 3, 
                                display: 'flex', 
                                flexDirection: { xs: 'column', sm: 'row' },
                                alignItems: { xs: 'flex-start', sm: 'center' },
                                gap: 3,
                                bgcolor: reward.isClaimed ? 'rgba(255,255,255,0.02)' : 'rgba(0, 243, 255, 0.03)',
                                transition: 'all 0.3s'
                            }}>
                                <Box sx={{ 
                                    width: 60, 
                                    height: 60, 
                                    borderRadius: 1, 
                                    bgcolor: reward.isClaimed ? 'rgba(255,255,255,0.05)' : 'rgba(0, 243, 255, 0.1)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    border: `1px solid ${reward.isClaimed ? 'rgba(255,255,255,0.1)' : 'rgba(0, 243, 255, 0.2)'}`
                                }}>
                                    <MonetizationOn sx={{ color: reward.isClaimed ? 'rgba(255,255,255,0.3)' : '#00f3ff', fontSize: 32 }} />
                                </Box>

                                <Box sx={{ flex: 1 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                                        <Typography variant="h6" sx={{ color: reward.isClaimed ? 'rgba(255,255,255,0.4)' : 'white', fontWeight: 'bold' }}>
                                            {reward.name}
                                        </Typography>
                                        <Box sx={{ 
                                            px: 1, 
                                            py: 0.2, 
                                            bgcolor: 'rgba(255,255,255,0.05)', 
                                            border: '1px solid rgba(255,255,255,0.1)', 
                                            borderRadius: 0.5 
                                        }}>
                                            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', fontWeight: 'bold', fontSize: '0.6rem' }}>
                                                {reward.rewardType || 'SISTEMA'}
                                            </Typography>
                                        </Box>
                                    </Box>
                                    <Typography variant="body2" sx={{ color: reward.isClaimed ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.6)' }}>
                                        {reward.description}
                                    </Typography>
                                </Box>

                                <Box sx={{ textAlign: { xs: 'left', sm: 'right' }, minWidth: 140 }}>
                                    <Typography variant="h5" sx={{ 
                                        color: reward.isClaimed ? 'rgba(255,255,255,0.2)' : '#00ff88', 
                                        fontWeight: 'bold', 
                                        mb: 1,
                                        fontFamily: 'monospace'
                                    }}>
                                        +{reward.amount} CR
                                    </Typography>
                                    <Button
                                        fullWidth
                                        variant={reward.isClaimed ? "text" : "contained"}
                                        disabled={!!reward.isClaimed || claimingId === reward.id}
                                        onClick={() => handleClaim(reward)}
                                        sx={{ 
                                            bgcolor: reward.isClaimed ? 'transparent' : '#00f3ff',
                                            color: reward.isClaimed ? 'rgba(255,255,255,0.2)' : '#000',
                                            fontWeight: 'bold',
                                            '&:hover': {
                                                bgcolor: reward.isClaimed ? 'transparent' : '#00d0db',
                                            }
                                        }}
                                    >
                                        {claimingId === reward.id ? (
                                            <CircularProgress size={20} color="inherit" />
                                        ) : (
                                            reward.isClaimed ? 'ADQUIRIDO' : 'RECLAMAR'
                                        )}
                                    </Button>
                                </Box>
                            </Box>
                        </TechFrame>
                    ))
                )}
            </Box>
        </Box>
    );
};

