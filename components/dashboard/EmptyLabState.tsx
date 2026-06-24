import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, CircularProgress } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '../../lib/hooks';
import { createLaboratory } from '../../lib/features/labs/actions';
import { setUserInfo } from '../../lib/features/auth/reducer';

const animationSteps = [
    { text: '⚙️ Codificando variables de entorno...' },
    { text: '🧪 Preparando materiales y reactivos...' },
    { text: '📂 Sincronizando registros con el sistema central...' }
];

export const EmptyLabState = () => {
    const dispatch = useAppDispatch();
    const userInfo = useAppSelector(state => state.auth.userInfo);
    const [isAnimating, setIsAnimating] = useState(false);
    const [currentStepIndex, setCurrentStepIndex] = useState(0);

    const handleCreateLab = async () => {
        setIsAnimating(true);
        setCurrentStepIndex(0);

        const stepDuration = 2000;
        const totalDuration = animationSteps.length * stepDuration;
        
        const interval = setInterval(() => {
            setCurrentStepIndex((prev) => {
                if (prev < animationSteps.length - 1) return prev + 1;
                return prev;
            });
        }, stepDuration);

        try {
            const startTime = Date.now();
            const labResult = await dispatch(createLaboratory({})).unwrap();
            
            const elapsedTime = Date.now() - startTime;
            const remainingTime = Math.max(0, totalDuration - elapsedTime);

            setTimeout(() => {
                clearInterval(interval);
                setIsAnimating(false);
                if (userInfo && labResult?.laboratory?.id) {
                    dispatch(setUserInfo({
                        ...userInfo,
                        idLabs: [...(userInfo.idLabs || []), labResult.laboratory.id]
                    }));
                }
            }, remainingTime);

        } catch (error) {
            console.error('Error creating lab', error);
            setIsAnimating(false);
            clearInterval(interval);
        }
    };

    return (
        <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center', 
            minHeight: '50vh',
            textAlign: 'center',
            bgcolor: 'rgba(0,0,0,0.5)',
            borderRadius: 4,
            border: '1px solid rgba(0, 243, 255, 0.2)',
            backdropFilter: 'blur(10px)',
            p: 6
        }}>
            <AnimatePresence mode="wait">
                {!isAnimating ? (
                    <motion.div
                        key="button"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.4 }}
                    >
                        <Typography variant="h4" sx={{ color: '#fff', mb: 2, fontWeight: 'bold' }}>
                            Laboratorio Inactivo
                        </Typography>
                        <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.7)', mb: 4, maxWidth: 400, mx: 'auto' }}>
                            Aún no cuentas con un centro de operaciones mineras. Inicia el aprovisionamiento para interactuar con la red.
                        </Typography>
                        <Button 
                            variant="contained" 
                            size="large"
                            onClick={handleCreateLab}
                            sx={{ 
                                bgcolor: '#00f3ff', 
                                color: '#000', 
                                fontWeight: 'bold',
                                py: 2,
                                px: 4,
                                borderRadius: 2,
                                '&:hover': {
                                    bgcolor: '#00c2cc',
                                    boxShadow: '0 0 20px rgba(0,243,255,0.5)'
                                }
                            }}
                        >
                            DAR DE ALTA LABORATORIO
                        </Button>
                    </motion.div>
                ) : (
                    <motion.div
                        key="animation"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                    >
                        <CircularProgress size={60} sx={{ color: '#00f3ff', mb: 4 }} />
                        <motion.div
                            key={currentStepIndex}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <Typography 
                                variant="h6" 
                                sx={{ color: '#00f3ff', fontWeight: 'medium', letterSpacing: 1 }}
                            >
                                {animationSteps[currentStepIndex].text}
                            </Typography>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </Box>
    );
};
