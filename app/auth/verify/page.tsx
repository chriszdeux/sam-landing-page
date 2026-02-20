// 1-Efecto secundario para sincronización del ciclo de vida
// 2-Obtención del despachador para emitir acciones al store
// 3-Gestión de estado local para code
// 4-Selección de datos desde el estado global de Redux
// 5-Gestión de estado local para step
// 6-Obtención del despachador para emitir acciones al store
// 7-Efecto secundario para sincronización del ciclo de vida
// 8-Procesamiento de envío de formulario para genérico
// 9-Estructuración y renderizado visual del componente UI
// 10-Estructuración y renderizado visual del componente UI
// 11-Estructuración y renderizado visual del componente UI

'use client';

//# 1-Efecto secundario para sincronización del ciclo de vida
import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, TextField, CircularProgress } from '@mui/material';
import { useRouter } from 'next/navigation';

//# 2-Obtención del despachador para emitir acciones al store
import { useAppDispatch, useAppSelector } from '../../../lib/hooks';
import { validateAccount, register as registerUser, login } from '../../../lib/features/auth/actions';
import { CheckCircleOutline, LockOpen } from '@mui/icons-material';
import { motion } from 'framer-motion';

export default function VerifyPage() {
    
    
    //# 3-Gestión de estado local para code
    const [code, setCode] = useState('');
    
    //# 4-Selección de datos desde el estado global de Redux
    const { registrationData, status, error } = useAppSelector((state) => state.auth);
    
    
    //# 5-Gestión de estado local para step
    const [step, setStep] = useState<'registering' | 'verifying' | 'animating_confirmation'>(
        registrationData ? 'registering' : 'verifying'
    );
    const router = useRouter();
    
    //# 6-Obtención del despachador para emitir acciones al store
    const dispatch = useAppDispatch();

    
    
    
    //# 7-Efecto secundario para sincronización del ciclo de vida
    useEffect(() => {
        if (step === 'registering' && registrationData) {
            const performRegister = async () => {
                const result = await dispatch(registerUser(registrationData));
                if (registerUser.fulfilled.match(result)) {
                    setTimeout(() => {
                        setStep('verifying');
                    }, 2000);
                }
            };
            performRegister();
        } else if (step === 'registering' && !registrationData) {
            
             setTimeout(() => setStep('verifying'), 0);
        }
    }, [step, registrationData, dispatch]);

    
    
    //# 8-Procesamiento de envío de formulario para genérico
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        
        setStep('animating_confirmation');

        
        setTimeout(async () => {
            
            const result = await dispatch(validateAccount({ code }));
            
            if (validateAccount.fulfilled.match(result)) {
                
                const email = localStorage.getItem('pending_email');
                const password = localStorage.getItem('pending_password');

                if (email && password) {
                    const loginResult = await dispatch(login({ email, password }));
                     if (login.fulfilled.match(loginResult)) {
                         
                         
                         localStorage.removeItem('pending_email');
                         localStorage.removeItem('pending_password');
                         router.push('/');
                     } else {
                         
                         router.push('/');
                     }
                } else {
                     router.push('/');
                }
            } else {
                
                setStep('verifying');
            }
        }, 4000);
    };

    if (step === 'registering') {
         
         
         
         //# 9-Estructuración y renderizado visual del componente UI
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

    if (step === 'animating_confirmation') {
        
        
        //# 10-Estructuración y renderizado visual del componente UI
        return (
            <Box sx={{ 
                minHeight: '100vh', 
                bgcolor: '#050505',
                display: 'flex', 
                flexDirection: 'column',
                alignItems: 'center', 
                justifyContent: 'center' 
            }}>
                <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <Box sx={{ 
                        width: 120, 
                        height: 120, 
                        borderRadius: '50%', 
                        bgcolor: 'rgba(0, 243, 255, 0.1)', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        mb: 4,
                        position: 'relative',
                        border: '2px solid #00f3ff',
                        boxShadow: '0 0 30px rgba(0,243,255,0.4)'
                    }}>
                        <CheckCircleOutline sx={{ fontSize: 60, color: '#00f3ff' }} />
                        
                        {}
                        <Box sx={{
                            position: 'absolute',
                            width: '100%',
                            height: '100%',
                            borderRadius: '50%',
                            border: '1px dashed rgba(0,243,255,0.5)',
                            animation: 'spin 4s linear infinite'
                        }} />
                         <style jsx>{`
                            @keyframes spin {
                                0% { transform: rotate(0deg); }
                                100% { transform: rotate(360deg); }
                            }
                        `}</style>
                    </Box>
                </motion.div>

                <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold', mb: 2 }}>
                    Verificando Credenciales...
                </Typography>
                <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                    Estableciendo conexión segura
                </Typography>
            </Box>
        );
    }

    
    
    
    //# 11-Estructuración y renderizado visual del componente UI
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
           { }
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
