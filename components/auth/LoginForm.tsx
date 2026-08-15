// 1-Importar dependencias y componentes de UI
// 2-Definir esquema de validación y tipos
// 3-Definir componente y hooks de formulario
// 4-Función para manejar el envío del formulario
// 5-Renderizar formulario de inicio de sesión


//# 1-Importar dependencias y componentes de UI
'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Typography } from '../ui/Typography';

import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, AlertCircle } from 'lucide-react';

import { useAppDispatch, useAppSelector } from '../../lib/hooks';
import { login } from '../../lib/features/auth';
import { closeModal } from '../../lib/features/uiSlice';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { TechFrame } from '../ui/TechFrame';

//# 2-Definir esquema de validación y tipos

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(5, 'La contraseña debe tener al menos 6 caracteres'),
});

type LoginFormInputs = z.infer<typeof loginSchema>;

export const LoginForm = () => {
  //# 3-Definir componente y hooks de formulario
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

  //# 4-Función para manejar el envío del formulario
  const onSubmit = async (data: LoginFormInputs) => {
    const resultAction = await dispatch(login(data));
    if (login.fulfilled.match(resultAction)) {
        router.push('/auth/logging-in');
        setTimeout(() => {
            dispatch(closeModal());
        }, 1000);
    }
  };



  //# 5-Renderizar formulario de inicio de sesión
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="h-full">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} className="h-full">


        <div className="relative flex h-full flex-col">


            <div className="relative z-[1] flex flex-grow flex-col justify-center">
                <TechFrame color="#00f3ff">
                    <div className="bg-black/80 p-8 backdrop-blur-md">
                        <div className="mb-8 text-center">
                            <Typography variant="overline" className="mb-1 block tracking-[3px] text-[#00f3ff]">
                                {'// SYSTEM ACCESS'}
                            </Typography>
                            <Typography variant="h4" className="font-bold uppercase text-white [text-shadow:0_0_20px_rgba(0,243,255,0.5)]">
                                INICIAR SESIÓN
                            </Typography>
                        </div>

                        <div className="flex flex-col gap-6">
                            <Input
                            id="email"
                            label="Email"
                            type="email"
                            error={!!errors.email}
                            helperText={errors.email?.message}
                            startAdornment={<Mail size={18} className="text-[#00f3ff]" />}
                            {...register('email')}
                            />

                            <Input
                            id="password"
                            label="Contraseña"
                            type="password"
                            placeholder="******"
                            error={!!errors.password}
                            helperText={errors.password?.message}
                            startAdornment={<Lock size={18} className="text-[#00f3ff]" />}
                            {...register('password')}
                            />

                            <AnimatePresence>
                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                    >
                                        <div className="flex items-start gap-2 rounded border border-[#ff0055] bg-[#ff0055]/10 p-3 text-sm text-[#ffcdd2]">
                                            <AlertCircle size={18} className="mt-0.5 shrink-0 text-[#ff0055]" />
                                            {error}
                                        </div>
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
                            {status === 'loading' ? (
                                <div className="h-6 w-6 animate-spin rounded-full border-2 border-black/20 border-t-black" />
                            ) : 'ACCEDER'}
                            </Button>
                        </div>
                    </div>
                </TechFrame>
            </div>
        </div>
      </motion.div>
    </form>
  );
};
