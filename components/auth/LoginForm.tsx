'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Typography, Alert, Stack, CircularProgress, InputAdornment, Box } from '@mui/material';

import { motion, AnimatePresence } from 'framer-motion';
import { Email, Lock, ErrorOutline } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../../lib/hooks';
import { login } from '../../lib/features/auth';
import { closeModal } from '../../lib/features/uiSlice';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { TechFrame } from '../ui/TechFrame';







const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(5, 'La contraseña debe tener al menos 6 caracteres'),
});

type LoginFormInputs = z.infer<typeof loginSchema>;

export const LoginForm = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { status, error } = useAppSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormInputs) => {
    const resultAction = await dispatch(login(data));
    if (login.fulfilled.match(resultAction)) {
        router.push('/auth/logging-in');
        setTimeout(() => {
            dispatch(closeModal());
        }, 1000);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ height: '100%' }}>
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} style={{ height: '100%' }}>
        


        <Box sx={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column' }}>
            
            {/* Content Frame */}
            <Box sx={{ position: 'relative', zIndex: 1, flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <TechFrame color="#00f3ff">
                    <Box sx={{ p: 4, bgcolor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)' }}>
                        <Box sx={{ mb: 4, textAlign: 'center' }}>
                            <Typography variant="overline" sx={{ color: '#00f3ff', letterSpacing: 3, display: 'block', mb: 1 }}>
                                {'// SYSTEM ACCESS'}
                            </Typography>
                            <Typography variant="h4" gutterBottom sx={{ 
                                color: 'white', 
                                textTransform: 'uppercase', 
                                fontWeight: 'bold',
                                textShadow: '0 0 20px rgba(0, 243, 255, 0.5)',
                            }}>
                                INICIAR SESIÓN
                            </Typography>
                        </Box>

                        <Stack spacing={3}>
                            <Input
                            id="email"
                            label="Email"
                            type="email"
                            error={!!errors.email}
                            helperText={errors.email?.message}
                            fullWidth
                            startAdornment={
                                <InputAdornment position="start">
                                    <Email sx={{ color: '#00f3ff' }} />
                                </InputAdornment>
                            }
                            {...register('email')}
                            />

                            <Input
                            id="password"
                            label="Contraseña"
                            type="password"
                            placeholder="******"
                            error={!!errors.password}
                            helperText={errors.password?.message}
                            fullWidth
                            startAdornment={
                                <InputAdornment position="start">
                                    <Lock sx={{ color: '#00f3ff' }} />
                                </InputAdornment>
                            }
                            {...register('password')}
                            />

                            <AnimatePresence>
                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                    >
                                        <Alert 
                                            severity="error" 
                                            icon={<ErrorOutline sx={{ color: '#ff0055' }} />}
                                            sx={{ 
                                                bgcolor: 'rgba(255, 0, 85, 0.1)', 
                                                border: '1px solid #ff0055',
                                                color: '#ffcdd2'
                                            }}
                                        >
                                            {error}
                                        </Alert>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <Button type="submit" variant="contained" fullWidth glow disabled={status === 'loading'} sx={{
                                bgcolor: '#00f3ff',
                                color: 'black',
                                fontWeight: 'bold',
                                fontSize: '1.1rem',
                                py: 1.5,
                                '&:hover': {
                                    bgcolor: '#00c2cc',
                                    boxShadow: '0 0 20px rgba(0, 243, 255, 0.6)'
                                }
                            }}>
                            {status === 'loading' ? <CircularProgress size={24} color="inherit" /> : 'ACCEDER'}
                            </Button>
                        </Stack>
                    </Box>
                </TechFrame>
            </Box>
        </Box>
      </motion.div>
    </form>
  );
};
