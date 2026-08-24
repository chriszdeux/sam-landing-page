import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '../../lib/hooks';
import { createLaboratory } from '../../lib/features/labs/actions';
import { setUserInfo } from '../../lib/features/auth/reducer';
import { Typography } from '../ui/Typography';
import { Button } from '../ui/Button';

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
                        idLab: labResult.laboratory.id
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
        <div className="flex min-h-[50vh] flex-col items-center justify-center rounded-2xl border border-[#00f3ff]/20 bg-black/50 p-12 text-center backdrop-blur-md">
            <AnimatePresence mode="wait">
                {!isAnimating ? (
                    <motion.div
                        key="button"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.4 }}
                    >
                        <Typography variant="h4" className="mb-4 font-bold text-white">
                            Laboratorio Inactivo
                        </Typography>
                        <Typography variant="body1" className="mx-auto mb-8 max-w-[400px] text-white/70">
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
                        className="flex flex-col items-center"
                    >
                        <div className="mb-8 h-[60px] w-[60px] animate-spin rounded-full border-4 border-[#00f3ff]/20 border-t-[#00f3ff]" />
                        <motion.div
                            key={currentStepIndex}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <Typography
                                variant="h6"
                                className="font-medium tracking-wide text-[#00f3ff]"
                            >
                                {animationSteps[currentStepIndex].text}
                            </Typography>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
