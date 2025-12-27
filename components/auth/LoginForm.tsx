'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
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
      dispatch(closeModal());
      router.push('/auth/logging-in');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
            <Image 
                src="https://res.cloudinary.com/dja3ngzj6/image/upload/v1734898516/login_header_secure_1766323766696_k3j34.png" 
                alt="Secure Login" 
                width={400}
                height={200}
                priority
                style={{ width: '100%', maxWidth: 400, borderRadius: 8, border: '1px solid rgba(0,243,255,0.2)', height: 'auto' }} 
            />
        </Box>
        <Typography variant="h4" align="center" gutterBottom sx={{ color: 'primary.main', mb: 4 }}>
            Iniciar Sesión
        </Typography>

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
                    <Email sx={{ color: 'primary.main' }} />
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
                    <Lock sx={{ color: 'primary.main' }} />
                </InputAdornment>
            }
            {...register('password')}
            />

            <AnimatePresence>
                {error && (
                    <motion.div
                        initial={{ opacity: 0, x: 0 }}
                        animate={{ 
                            opacity: 1, 
                            x: [-5, 5, -5, 5, 0],
                            transition: { duration: 0.5 } 
                        }}
                        exit={{ opacity: 0 }}
                    >
                        <Alert 
                            severity="error" 
                            icon={
                                <motion.div
                                    animate={{ 
                                        rotate: [0, 10, -10, 10, 0],
                                        scale: [1, 1.2, 1]
                                    }}
                                    transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
                                >
                                    <ErrorOutline />
                                </motion.div>
                            }
                            sx={{ 
                                bgcolor: 'rgba(211, 47, 47, 0.1)', 
                                border: '1px solid #d32f2f',
                                color: '#ffcdd2' 
                            }}
                        >
                            {error}
                        </Alert>
                    </motion.div>
                )}
            </AnimatePresence>

            <Button type="submit" variant="contained" fullWidth glow disabled={status === 'loading'}>
            {status === 'loading' ? <CircularProgress size={24} color="inherit" /> : 'Entrar'}
            </Button>
        </Stack>
      </motion.div>
    </form>
  );
};
