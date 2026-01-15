import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, Paper, CircularProgress, Chip, Alert } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../lib/hooks';
import { fetchRewards, claimReward } from '../../lib/features/blockchain/actions';
import { Reward } from '../../lib/features/blockchain/types';
import { CardGiftcard, CheckCircle, MonetizationOn } from '@mui/icons-material';

export const RewardsModal = () => {
    const dispatch = useAppDispatch();
    const { rewards, isLoading, error } = useAppSelector((state) => state.blockchain);
    const { userInfo } = useAppSelector((state) => state.auth);
    const [claimingId, setClaimingId] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    useEffect(() => {
        dispatch(fetchRewards());
    }, [dispatch]);

    const handleClaim = async (reward: Reward) => {
        if (!userInfo?.id) return;
        setClaimingId(reward.id);
        setSuccessMessage(null);
        
        try {
            await dispatch(claimReward({ id: reward.id, userId: userInfo.id })).unwrap();
            setSuccessMessage(`¡Recompensa "${reward.name}" reclamada exitosamente! +${reward.amount} Créditos`);
            // Refresh rewards list to update status if backend changes it
            dispatch(fetchRewards());
        } catch (err) {
            console.error(err);
        } finally {
            setClaimingId(null);
        }
    };

    if (isLoading && rewards.length === 0) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
                <CircularProgress color="primary" />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ p: 2, textAlign: 'center' }}>
                <Typography color="error">Error al cargar recompensas: {error}</Typography>
                <Button onClick={() => dispatch(fetchRewards())} sx={{ mt: 2 }}>Reintentar</Button>
            </Box>
        );
    }

    return (
        <Box>
            <Typography variant="h5" color="primary.main" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CardGiftcard /> Centro de Recompensas
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Reclama tus recompensas diarias y logros especiales para aumentar tus créditos.
            </Typography>

            {successMessage && (
                <Alert severity="success" sx={{ mb: 3, bgcolor: 'rgba(0, 255, 136, 0.1)', color: '#00ff88' }} icon={<CheckCircle fontSize="inherit" />}>
                     {successMessage}
                </Alert>
            )}

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {rewards.length === 0 && (
                     <Typography align="center" color="text.secondary" sx={{ py: 4 }}>No hay recompensas disponibles en este momento.</Typography>
                )}
                
                {rewards.map((reward) => (
                    <Paper 
                        key={reward.id} 
                        sx={{ 
                            p: 2, 
                            border: '1px solid rgba(255,255,255,0.1)', 
                            bgcolor: 'rgba(255,255,255,0.02)',
                            display: 'flex',
                            flexDirection: { xs: 'column', sm: 'row' },
                            alignItems: { xs: 'flex-start', sm: 'center' },
                            gap: 2,
                            position: 'relative',
                            overflow: 'hidden'
                        }}
                    >
                         {/* Decoration optional */}
                         {reward.type === 'DAILY' && <Box sx={{ position: 'absolute', top: 0, right: 0, width: 40, height: 40, background: 'linear-gradient(45deg, transparent 50%, #00f3ff 50%)', opacity: 0.2 }} />}

                         <Box sx={{ flex: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                                <Typography variant="subtitle1" fontWeight="bold" color="white">{reward.name}</Typography>
                                <Chip label={reward.type} size="small" variant="outlined" color="primary" sx={{ height: 20, fontSize: '0.65rem' }} />
                            </Box>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>{reward.description}</Typography>
                            <Typography variant="body2" color="success.main" fontWeight="bold" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <MonetizationOn fontSize="inherit" /> +{reward.amount} Créditos
                            </Typography>
                         </Box>

                         <Button
                            variant="contained"
                            disabled={!!reward.isClaimed || claimingId === reward.id}
                            onClick={() => handleClaim(reward)}
                            sx={{ 
                                minWidth: 120,
                                background: reward.isClaimed ? 'rgba(255,255,255,0.1)' : 'linear-gradient(45deg, #00f3ff, #0066ff)',
                                '&:hover': {
                                     background: 'linear-gradient(45deg, #00c2cc, #0052cc)'
                                }
                            }}
                         >
                            {claimingId === reward.id ? <CircularProgress size={24} color="inherit" /> : (reward.isClaimed ? 'Reclamado' : 'Reclamar')}
                         </Button>
                    </Paper>
                ))}
            </Box>
        </Box>
    );
};
