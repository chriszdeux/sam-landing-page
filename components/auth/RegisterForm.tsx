'use client';

import React from 'react';
import { Typography, Alert, Grid, CircularProgress } from '@mui/material';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAppDispatch, useAppSelector } from '../../lib/hooks';
import { register as registerUser } from '../../lib/features/auth';
import { openModal } from '../../lib/features/uiSlice';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

const registerSchema = z.object({
  name: z.string().min(2, 'El nombre es requerido'),
  lastName: z.string().min(2, 'El apellido es requerido'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  username: z.string().min(3, 'El usuario debe tener al menos 3 caracteres'),
  birthday: z.string().refine((date) => new Date(date).toString() !== 'Invalid Date', 'Fecha inválida'),
});

type RegisterFormInputs = z.infer<typeof registerSchema>;

export const RegisterForm = () => {
  const dispatch = useAppDispatch();
  const { status, error } = useAppSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormInputs>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormInputs) => {
    // We send empty/default values for removed fields if the backend strictly expects them, 
    // or just the data if the backend is flexible. 
    // Assuming flexibility or that these are optional in backend.
    const payload = { ...data, profileURL: '' };
    const resultAction = await dispatch(registerUser(payload));
    if (registerUser.fulfilled.match(resultAction)) {
      dispatch(openModal('validate'));
      alert('Registro exitoso! Por favor revisa tu correo para el código de validación.');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Typography variant="h4" align="center" gutterBottom sx={{ color: 'secondary.main', mb: 4 }}>
            Registro
        </Typography>

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
        </Grid>

        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}

        <Button type="submit" variant="contained" color="secondary" fullWidth glow sx={{ mt: 3 }} disabled={status === 'loading'}>
            {status === 'loading' ? <CircularProgress size={24} color="inherit" /> : 'Registrarse'}
        </Button>
      </motion.div>
    </form>
  );
};
