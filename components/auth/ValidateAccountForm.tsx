'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Typography, Alert, Stack, Box } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../lib/hooks';
import { validateAccount } from '../../lib/features/auth';
import { openModal } from '../../lib/features/uiSlice';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { TechFrame } from '../ui/TechFrame';

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
    <form onSubmit={handleSubmit(onSubmit)} style={{ height: '100%' }}>
      <Box sx={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ position: 'relative', zIndex: 1, flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <TechFrame color="#00f3ff">
                <Box sx={{ p: 4, bgcolor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)' }}>
                    <Box sx={{ mb: 4, textAlign: 'center' }}>
                        <Typography variant="overline" sx={{ color: '#00f3ff', letterSpacing: 3, display: 'block', mb: 1 }}>
                            {'// SECURITY CHECK'}
                        </Typography>
                        <Typography variant="h4" gutterBottom sx={{ 
                            color: 'white', 
                            textTransform: 'uppercase', 
                            fontWeight: 'bold',
                            textShadow: '0 0 20px rgba(0, 243, 255, 0.5)',
                        }}>
                            VALIDAR CUENTA
                        </Typography>
                        <Typography variant="body2" align="center" color="text.secondary" sx={{ mb: 4, fontFamily: 'monospace' }}>
                             Ingresa el código que enviamos a tu correo electrónico.
                        </Typography>
                    </Box>

                    <Stack spacing={3}>
                        <Input
                        id="code"
                        label="Código de Verificación"
                        placeholder="Ej: 123456"
                        error={!!errors.code}
                        helperText={errors.code?.message}
                        fullWidth
                        {...register('code')}
                        />

                        {error && (
                            <Alert 
                                severity="error" 
                                sx={{ 
                                    bgcolor: 'rgba(255, 0, 85, 0.1)', 
                                    border: '1px solid #ff0055',
                                    color: '#ffcdd2'
                                }}
                            >
                                {error}
                            </Alert>
                        )}

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
                        {status === 'loading' ? 'VALIDANDO...' : 'VALIDAR CUENTA'}
                        </Button>
                    </Stack>
                </Box>
            </TechFrame>
        </Box>
      </Box>
    </form>
  );
};
