/**
 * Formulario de Registro
 * Recopila datos del nuevo usuario y gestiona el proceso de registro
 * Almacena credenciales temporales para inicio de sesión automático
 */
'use client';

import React from 'react';
import { Typography, Alert, Grid, CircularProgress, Box } from '@mui/material';
import { motion } from 'framer-motion';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAppDispatch, useAppSelector } from '../../lib/hooks';
import { useRouter } from 'next/navigation';
import { setRegistrationData } from '../../lib/features/auth/reducer';
import { closeModal } from '../../lib/features/uiSlice';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { TechFrame } from '../ui/TechFrame';





const registerSchema = z.object({
  name: z.string().min(2, 'El nombre es requerido'),
  lastName: z.string().min(2, 'El apellido es requerido'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  username: z.string().min(3, 'El usuario debe tener al menos 3 caracteres'),
  birthday: z.string().refine((date) => new Date(date).toString() !== 'Invalid Date', 'Fecha inválida'),
  referralCode: z.string().optional(),
});

type RegisterFormInputs = z.infer<typeof registerSchema>;

export const RegisterForm = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { status, error } = useAppSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormInputs>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormInputs) => {
    localStorage.setItem('pending_email', data.email);
    localStorage.setItem('pending_password', data.password);

    dispatch(setRegistrationData({ ...data, profileURL: '' }));
    dispatch(closeModal());
    router.push('/auth/verify');
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ height: '100%' }}>
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} style={{ height: '100%' }}>
        


        <Box sx={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column' }}>
            

            <Box sx={{ position: 'relative', zIndex: 1, flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <TechFrame color="#ff0055">
                     <Box sx={{ p: 4, bgcolor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)' }}>
                        <Box sx={{ mb: 4, textAlign: 'center' }}>
                            <Typography variant="overline" sx={{ color: '#ff0055', letterSpacing: 3, display: 'block', mb: 1 }}>
                                {'// NEW USER REGISTRATION'}
                            </Typography>
                            <Typography variant="h4" gutterBottom sx={{ 
                                color: 'white', 
                                textTransform: 'uppercase', 
                                fontWeight: 'bold',
                                textShadow: '0 0 20px rgba(255, 0, 85, 0.5)', 
                            }}>
                                REGISTRO
                            </Typography>
                        </Box>

                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12, md: 6 }}>
                            <Input label="Nombre" error={!!errors.name} helperText={errors.name?.message} fullWidth {...register('name')} />
                            </Grid>
                            <Grid size={{ xs: 12, md: 6 }}>
                            <Input label="Apellido" error={!!errors.lastName} helperText={errors.lastName?.message} fullWidth {...register('lastName')} />
                            </Grid>
                            <Grid size={{ xs: 12 }}>
                            <Input label="Usuario" error={!!errors.username} helperText={errors.username?.message} fullWidth {...register('username')} />
                            </Grid>
                            <Grid size={{ xs: 12 }}>
                            <Input label="Email" type="email" error={!!errors.email} helperText={errors.email?.message} fullWidth {...register('email')} />
                            </Grid>
                            <Grid size={{ xs: 12 }}>
                            <Input label="Contraseña" type="password" error={!!errors.password} helperText={errors.password?.message} fullWidth {...register('password')} />
                            </Grid>
                            <Grid size={{ xs: 12 }}>
                            <Input label="Fecha de Nacimiento" type="date" error={!!errors.birthday} helperText={errors.birthday?.message} fullWidth {...register('birthday')} />
                            </Grid>
                            <Grid size={{ xs: 12 }}>
                                <Input label="Código de Referencia (Opcional)" error={!!errors.referralCode} helperText={errors.referralCode?.message} fullWidth {...register('referralCode')} />
                            </Grid>
                        </Grid>

                        {error && <Alert severity="error" sx={{ mt: 3, bgcolor: 'rgba(255, 0, 85, 0.1)', border: '1px solid #ff0055', color: '#ffcdd2' }}>{error}</Alert>}

                        <Button type="submit" variant="contained" fullWidth glow sx={{ 
                            mt: 4,
                            bgcolor: '#ff0055',
                            color: 'white',
                            fontWeight: 'bold',
                             fontSize: '1.1rem',
                             py: 1.5,
                            '&:hover': {
                                bgcolor: '#cc0044',
                                boxShadow: '0 0 20px rgba(255, 0, 85, 0.6)'
                            }
                        }} disabled={status === 'loading'}>
                            {status === 'loading' ? <CircularProgress size={24} color="inherit" /> : 'CONFIRMAR REGISTRO'}
                        </Button>
                    </Box>
                </TechFrame>
            </Box>
        </Box>
      </motion.div>
    </form>
  );
};
