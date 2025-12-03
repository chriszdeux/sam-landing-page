import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Typography, Alert, Stack, TextField } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../lib/hooks';
import { login } from '../../lib/features/authSlice';
import { closeModal } from '../../lib/features/uiSlice';
import { Button } from '../ui/Button';

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(5, 'La contraseña debe tener al menos 6 caracteres'),
});

type LoginFormInputs = z.infer<typeof loginSchema>;

export const LoginForm = () => {
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
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Typography variant="h4" align="center" gutterBottom sx={{ color: 'primary.main', mb: 4 }}>
        Iniciar Sesiónsss
      </Typography>

      <Stack spacing={3}>
        <TextField
          id="email"
          label="Email"
          type="email"
          // placeholder="usuario@ejemplo.com"
          error={!!errors.email}
          helperText={errors.email?.message}
          fullWidth
          variant="outlined"
          InputLabelProps={{ shrink: true }}
          {...register('email')}
        />

        <TextField
          id="password"
          label="Contraseña"
          type="password"
          placeholder="******"
          error={!!errors.password}
          helperText={errors.password?.message}
          fullWidth
          variant="outlined"
          InputLabelProps={{ shrink: true }}
          {...register('password')}
        />

        {error && <Alert severity="error">{error}</Alert>}

        <Button type="submit" variant="contained" fullWidth glow disabled={status === 'loading'}>
          {status === 'loading' ? 'Cargando...' : 'Entrar'}
        </Button>
      </Stack>
    </form>
  );
};
