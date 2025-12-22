'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Typography, Alert, Stack, TextField } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../lib/hooks';
import { validateAccount } from '../../lib/features/auth';
import { openModal } from '../../lib/features/uiSlice';
import { Button } from '../ui/Button';

const validateSchema = z.object({
  code: z.string().min(4, 'El código es requerido'),
});

type ValidateFormInputs = z.infer<typeof validateSchema>;

export const ValidateAccountForm = () => {
  const dispatch = useAppDispatch();
  const { status, error } = useAppSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ValidateFormInputs>({
    resolver: zodResolver(validateSchema),
  });

  const onSubmit = async (data: ValidateFormInputs) => {
    const resultAction = await dispatch(validateAccount(data));
    if (validateAccount.fulfilled.match(resultAction)) {
      dispatch(openModal('login'));
      alert('Cuenta validada exitosamente! Por favor inicia sesión.');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Typography variant="h4" align="center" gutterBottom sx={{ color: 'primary.main', mb: 2 }}>
        Validar Cuenta
      </Typography>
      <Typography variant="body2" align="center" color="text.secondary" sx={{ mb: 4 }}>
        Ingresa el código que enviamos a tu correo electrónico.
      </Typography>

      <Stack spacing={3}>
        <TextField
          id="code"
          label="Código de Verificación"
          placeholder="Ej: 123456"
          error={!!errors.code}
          helperText={errors.code?.message}
          fullWidth
          variant="outlined"
          InputLabelProps={{ shrink: true }}
          {...register('code')}
        />

        {error && <Alert severity="error">{error}</Alert>}

        <Button type="submit" variant="contained" fullWidth glow disabled={status === 'loading'}>
          {status === 'loading' ? 'Validando...' : 'Validar Cuenta'}
        </Button>
      </Stack>
    </form>
  );
};
