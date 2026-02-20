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
import { Box, Container, Typography, Grid, CircularProgress, Button } from '@mui/material';
import { Background } from '../../components/layout/Background';
import { TechFrame } from '../../components/ui/TechFrame';
import { PageHeader } from '../../components/ui/PageHeader';

//# 1-Obtención del despachador para emitir acciones al store
import { useAppDispatch, useAppSelector } from '../../lib/hooks';
import { claimReward, fetchRewards } from '../../lib/features/blockchain/actions';
import { motion } from 'framer-motion';
import { Reward } from '../../lib/features/blockchain/types';
import { TaoIcon } from '../../components/ui/TaoIcon';
import { Check } from 'lucide-react';
import { addNotification } from '../../lib/features/uiSlice';
import { EnvVariables } from '@/lib/constants/variables';

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
        <Box sx={{ 
            position: 'absolute', 
            top: 16, 
            left: '50%', 
            transform: 'translateX(-50%)', 
            zIndex: 10,
            bgcolor: 'rgba(0,0,0,0.6)',
            px: 2,
            py: 0.5,
            borderRadius: 4,
            border: '1px solid rgba(255,255,255,0.1)'
        }}>
            <Typography variant="caption" sx={{ color: '#00e676', fontWeight: 'bold' }}>
                {timeLeft}
            </Typography>
        </Box>
    );
};

export default function RewardsPage() {
  
  //# 6-Obtención del despachador para emitir acciones al store
  const dispatch = useAppDispatch();
  
  //# 7-Selección de datos desde el estado global de Redux
  const { rewards, isLoading, error } = useAppSelector((state) => state.blockchain);
  
  //# 8-Selección de datos desde el estado global de Redux
  const { userInfo } = useAppSelector((state) => state.auth);
  
  
  //# 9-Gestión de estado local para tick
  const [tick, setTick] = React.useState(0);
  
  
  
  
  //# 10-Efecto secundario para sincronización del ciclo de vida
  React.useEffect(() => {
    
    
  }, [tick]);

  
  
  //# 11-Efecto secundario para sincronización del ciclo de vida
  React.useEffect(() => {
    if (rewards.length === 0 && !isLoading && !error) {
        dispatch(fetchRewards());
    }
  }, [dispatch, rewards.length, isLoading, error]);

  
  //# 12-Gestión de estado local para claiming reward id
  const [claimingRewardId, setClaimingRewardId] = React.useState<string | null>(null);

  
  
  //# 13-Manejo de lógica de usuario para handleClaim
  const handleClaim = async (reward: Reward) => {
    if (!userInfo) {
         dispatch(addNotification({ type: 'warning', message: 'Debes iniciar sesión para reclamar recompensas.' }));
         return;
    }

    
    
    

    setClaimingRewardId(reward.id);
    try {
        await dispatch(claimReward({ id: reward.id, userId: userInfo.id, rewardType: reward?.rewardType, amount: reward?.amount })).unwrap();
        dispatch(addNotification({ type: 'success', message: '¡Recompensa reclamada con éxito!' }));
    } catch (err) {
        dispatch(addNotification({ type: 'error', message: err as string || 'Error al reclamar recompensa.' }));
    } finally {
        setClaimingRewardId(null);
    }
  };

  
  
  //# 14-Estructuración y renderizado visual del componente UI
  return (
    <Box sx={{ minHeight: '100vh', position: 'relative' }}>
      <Background />
      
      <Container maxWidth="xl" sx={{ pt: 20, pb: 10, position: 'relative', zIndex: 1 }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <PageHeader 
                title="Centro de Recompensas" 
                subtitle="Reclama suministros diarios y bonificaciones por tus logros en la expansión de la red."
                color="#ff0055"
            />
        </motion.div>

        {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 10 }}>
                <CircularProgress color="primary" />
            </Box>
        ) : error ? (
            <Typography align="center" color="error">Error al cargar recompensas: {error}</Typography>
        ) : (
            <Grid container spacing={4} sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}>
                {rewards.map((reward, index) => {
                    
                    const userReward = userInfo?.rewards?.find((r) => r.id === reward.id);
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
                    <Grid size={{ xs: 12, sm: 6, md: 4 }} key={reward.id}>
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
                                <Box sx={{
                                    p: 4,
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    textAlign: 'center',
                                    position: 'relative'
                                }}>
                                    {isClaimedNow && targetTime > 0 && (
                                        <Countdown 
                                            targetDate={targetTime} 
                                            onComplete={() => setTick(t => t + 1)} 
                                        />
                                    )}
                                    <Box sx={{
                                        position: 'relative',
                                        width: 80,
                                        height: 80,
                                        borderRadius: '50%',
                                        bgcolor: reward.isClaimed ? 'rgba(0, 255, 157, 0.1)' : 'rgba(255, 0, 85, 0.1)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        mb: 3,
                                        border: `1px solid ${isClaimedNow ? '#00ff9d' : '#ff0055'}`,
                                        boxShadow: `0 0 20px ${isClaimedNow ? '#00ff9d' : '#ff0055'}40`
                                    }}>
                                        {isClaimedNow ? (
                                            <Check size={40} color="#00ff9d" />
                                        ) : (
                                            <TaoIcon size={40} />
                                        )}
                                    </Box>

                                    <Typography variant="h5" gutterBottom sx={{ color: 'white', fontWeight: 'bold' }}>
                                        {reward.name}
                                    </Typography>
                                    
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 4, flexGrow: 1 }}>
                                        {reward.description}
                                    </Typography>

                                    <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Typography variant="h6" sx={{ color: isClaimedNow ? '#00ff9d' : '#ffb700', fontWeight: 'bold' }}>
                                            {reward.amount.toLocaleString()}
                                        </Typography>
                                        <TaoIcon size={12} />
                                    </Box>

                                    <Button
                                        variant={isClaimedNow ? "outlined" : "contained"}
                                        color={isClaimedNow ? "success" : "primary"}
                                        fullWidth
                                        disabled={isClaimedNow || claimingRewardId === reward.id}
                                        onClick={() => handleClaim(reward)}
                                        sx={{
                                            bgcolor: isClaimedNow ? 'transparent' : '#ff0055',
                                            borderColor: '#ff0055',
                                            position: 'relative',
                                            '&:hover': {
                                                bgcolor: isClaimedNow ? 'transparent' : '#cc0044',
                                                borderColor: '#cc0044'
                                            }
                                        }}
                                    >
                                        {claimingRewardId === reward.id ? (
                                            <CircularProgress size={24} color="inherit" />
                                        ) : isClaimedNow ? (
                                            'RECLAMADO'
                                        ) : (
                                            'RECLAMAR'
                                        )}
                                    </Button>
                                </Box>
                            </TechFrame>
                        </motion.div>
                    </Grid>
                    );
                })}
            </Grid>
        )}
      </Container>
    </Box>
  );
}
