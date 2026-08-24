// 1-Definir componente de validación de cuenta
// 2-Obtener despachador y estado
// 3-Definir esquema de validación y manejo de envío
// 4-Renderizar formulario de ingreso de código

//# 1-Definir componente de validación de cuenta
'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Typography } from '../ui/Typography';

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

  //# 2-Obtención del despachador y estado
  const dispatch = useAppDispatch();
  const { status, error } = useAppSelector((state) => state.auth);

  //# 3-Definir esquema de validación y manejo de envío
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

  //# 4-Renderizar formulario de ingreso de código
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="h-full">
      <div className="relative flex h-full flex-col">
        <div className="relative z-[1] flex flex-grow flex-col justify-center">
            <TechFrame color="#00f3ff">
                <div className="bg-black/80 p-8 backdrop-blur-md">
                    <div className="mb-8 text-center">
                        <Typography variant="overline" className="mb-1 block tracking-[3px] text-[#00f3ff]">
                            {'// SECURITY CHECK'}
                        </Typography>
                        <Typography variant="h4" className="font-bold uppercase text-white [text-shadow:0_0_20px_rgba(0,243,255,0.5)]">
                            VALIDAR CUENTA
                        </Typography>
                        <Typography variant="body2" className="mb-8 text-center font-mono text-foreground-muted">
                             Ingresa el código que enviamos a tu correo electrónico.
                        </Typography>
                    </div>

                    <div className="flex flex-col gap-6">
                        <Input
                        id="code"
                        label="Código de Verificación"
                        placeholder="Ej: 123456"
                        error={!!errors.code}
                        helperText={errors.code?.message}
                        {...register('code')}
                        />

                        {error && (
                            <div className="rounded border border-[#ff0055] bg-[#ff0055]/10 p-3 text-sm text-[#ffcdd2]">
                                {error}
                            </div>
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
                    </div>
                </div>
            </TechFrame>
        </div>
      </div>
    </form>
  );
};
