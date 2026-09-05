// 1-Definir componente de formulario de registro
// 2-Obtener despachador y router
// 3-Seleccionar estado de autenticación
// 4-Renderizar formulario con validación Zod

//# 1-Definir componente de formulario de registro
'use client';

import React from 'react';
import { Typography } from '../ui/Typography';
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

  //# 2-Obtención del despachador y router
  const dispatch = useAppDispatch();
  const router = useRouter();

  //# 3-Selección de datos desde el estado global de Redux
  const { status, error } = useAppSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormInputs>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormInputs) => {
    dispatch(setRegistrationData({ ...data, profileURL: '' }));
    dispatch(closeModal());
    router.push('/auth/verify');
  };

  //# 4-Renderizar formulario con validación Zod
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="h-full">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} className="h-full">


        <div className="relative flex h-full flex-col">


          <div className="relative z-[1] flex flex-grow flex-col justify-center">
            <TechFrame color="#ff0055">
              <div className="bg-black/80 p-8 backdrop-blur-md">
                <div className="mb-8 text-center">
                  <Typography variant="overline" className="mb-1 block tracking-[3px] text-[#ff0055]">
                    {'// NEW USER REGISTRATION'}
                  </Typography>
                  <Typography variant="h4" className="font-bold uppercase text-white [text-shadow:0_0_20px_rgba(255,0,85,0.5)]">
                    REGISTRO
                  </Typography>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
                  <div className="md:col-span-6">
                    <Input label="Nombre" error={!!errors.name} helperText={errors.name?.message} {...register('name')} />
                  </div>
                  <div className="md:col-span-6">
                    <Input label="Apellido" error={!!errors.lastName} helperText={errors.lastName?.message} {...register('lastName')} />
                  </div>
                  <div className="md:col-span-12">
                    <Input label="Usuario" error={!!errors.username} helperText={errors.username?.message} {...register('username')} />
                  </div>
                  <div className="md:col-span-12">
                    <Input label="Email" type="email" error={!!errors.email} helperText={errors.email?.message} {...register('email')} />
                  </div>
                  <div className="md:col-span-12">
                    <Input label="Contraseña" type="password" error={!!errors.password} helperText={errors.password?.message} {...register('password')} />
                  </div>
                  <div className="md:col-span-12">
                    <Input label="Fecha de Nacimiento" type="date" error={!!errors.birthday} helperText={errors.birthday?.message} {...register('birthday')} />
                  </div>
                  <div className="md:col-span-12">
                    <Input label="Código de Referencia (Opcional)" error={!!errors.referralCode} helperText={errors.referralCode?.message} {...register('referralCode')} />
                  </div>
                </div>

                {error && (
                  <div className="mt-6 rounded border border-[#ff0055] bg-[#ff0055]/10 p-3 text-sm text-[#ffcdd2]">
                    {error}
                  </div>
                )}

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
                  {status === 'loading' ? (
                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                  ) : 'CONFIRMAR REGISTRO'}
                </Button>
              </div>
            </TechFrame>
          </div>
        </div>
      </motion.div>
    </form>
  );
};
