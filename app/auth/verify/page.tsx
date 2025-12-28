'use client';

import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, TextField, CircularProgress } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '../../../lib/hooks';
import { validateAccount, register as registerUser } from '../../../lib/features/auth/actions';
import { motion } from 'framer-motion';
import { LockOpen } from '@mui/icons-material';

export default function VerifyPage() {
    const [code, setCode] = useState('');
    const { registrationData, status, error } = useAppSelector((state) => state.auth);
    const [step, setStep] = useState<'registering' | 'verifying'>(registrationData ? 'registering' : 'verifying');
    const router = useRouter();
    const dispatch = useAppDispatch();

    // Handle Registration
    useEffect(() => {
        if (step === 'registering' && registrationData) {
            const performRegister = async () => {
                // ... logic
                const result = await dispatch(registerUser(registrationData));
                if (registerUser.fulfilled.match(result)) {
                    // Success -> Move to verify
                    setTimeout(() => {
                        setStep('verifying');
                    }, 2000);
                }
            };
            performRegister();
        } else if (step === 'registering' && !registrationData) {
            // Should not happen if initialized correctly, but safe fallback
            setStep('verifying');
        }
    }, [step, registrationData, dispatch]);


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const result = await dispatch(validateAccount({ code }));
        if (validateAccount.fulfilled.match(result)) {
            router.push('/');
        }
    };

    if (step === 'registering') {
         return (
            <Box sx={{ 
                minHeight: '100vh', 
                bgcolor: '#050505',
                display: 'flex', 
                flexDirection: 'column',
                alignItems: 'center', 
                justifyContent: 'center' 
            }}>
                <Box sx={{ position: 'relative', mb: 4 }}>
                     <CircularProgress size={80} thickness={2} sx={{ color: '#00f3ff' }} />
                     <CircularProgress 
                        size={80} 
                        thickness={2} 
                        sx={{ 
                            color: 'rgba(0,243,255,0.2)', 
                            position: 'absolute', 
                            left: 0, 
                            animationDuration: '3s' 
                        }} 
                        disableShrink
                     />
                </Box>
                
                <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold', mb: 2 }}>
                    Creando tu identidad digital...
                </Typography>
                
                {error && (
                    <Box sx={{ textAlign: 'center', mt: 2 }}>
                        <Typography color="error">
                            Error: {error}
                        </Typography>
                        <Button 
                            onClick={() => router.back()} 
                            sx={{ mt: 2, color: '#00f3ff' }}
                        >
                            Volver
                        </Button>
                    </Box>
                )}
            </Box>
         );
    }

    return (
        <Box sx={{ 
            minHeight: '100vh', 
            bgcolor: '#050510',
            display: 'flex', 
            flexDirection: 'column',
            alignItems: 'center', 
            justifyContent: 'center',
            p: 3
        }}>
            <motion.div 
                initial={{ scale: 0.8, opacity: 0 }} 
                animate={{ scale: 1, opacity: 1 }} 
                transition={{ duration: 0.5 }}
            >
                <Box sx={{ 
                    bgcolor: 'rgba(255,255,255,0.05)', 
                    p: 6, 
                    borderRadius: 4, 
                    border: '1px solid rgba(0,243,255,0.2)',
                    backdropFilter: 'blur(10px)',
                    maxWidth: 400,
                    width: '100%',
                    textAlign: 'center',
                    boxShadow: '0 0 30px rgba(0,243,255,0.1)'
                }}>
                    <Box sx={{ 
                        width: 80, 
                        height: 80, 
                        borderRadius: '50%', 
                        bgcolor: 'rgba(0,243,255,0.1)', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        mx: 'auto',
                        mb: 4,
                        border: '1px solid rgba(0,243,255,0.3)'
                    }}>
                        <LockOpen sx={{ fontSize: 40, color: '#00f3ff' }} />
                    </Box>

                    <Typography variant="h4" color="white" fontWeight="bold" gutterBottom>
                        Verificación
                    </Typography>
                    
                    <Typography variant="body2" color="rgba(255,255,255,0.7)" sx={{ mb: 4 }}>
                        {registrationData ? 'Registro iniciado. ' : ''}Ingrese el código enviado a tu correo.
                    </Typography>

                    <form onSubmit={handleSubmit}>
                        <TextField
                            fullWidth
                            variant="outlined"
                            placeholder="Código"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            sx={{ 
                                mb: 3,
                                '& .MuiOutlinedInput-root': {
                                    color: 'white',
                                    bgcolor: 'rgba(0,0,0,0.3)',
                                    '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                                    '&:hover fieldset': { borderColor: '#00f3ff' },
                                    '&.Mui-focused fieldset': { borderColor: '#00f3ff' },
                                }
                             }}
                             inputProps={{ style: { textAlign: 'center', letterSpacing: 4, fontWeight: 'bold' } }}
                        />

                        {error && (
                             <Typography color="error" variant="caption" display="block" sx={{ mb: 2 }}>
                                {error}
                            </Typography>
                        )}

                        <Button 
                            type="submit" 
                            variant="contained" 
                            fullWidth 
                            size="large"
                            disabled={status === 'loading'}
                            sx={{ 
                                bgcolor: '#00f3ff', 
                                color: '#000', 
                                fontWeight: 'bold',
                                '&:hover': { bgcolor: '#00c2cc', boxShadow: '0 0 20px rgba(0,243,255,0.4)' } 
                            }}
                        >
                            {status === 'loading' ? 'Confirmando...' : 'Confirmar Cuenta'}
                        </Button>
                    </form>
                </Box>
            </motion.div>
        </Box>
    );
}
