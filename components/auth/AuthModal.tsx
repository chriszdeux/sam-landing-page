// 1-Importar dependencias y componentes
// 2-Definir esquemas y tipos de formularios
// 3-Componente unificado de autenticación con split-screen

//# 1-Importar dependencias y componentes
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail, Lock, User, Calendar, IdCard,
  AlertCircle, CheckCircle2, ArrowRight
} from 'lucide-react';

import { useAppDispatch, useAppSelector } from '../../lib/hooks';
import { login } from '../../lib/features/auth';
import { setRegistrationData } from '../../lib/features/auth/reducer';
import { closeModal } from '../../lib/features/uiSlice';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Typography } from '../ui/Typography';

//# 2-Definir esquemas y tipos de formularios
const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(5, 'Mínimo 6 caracteres'),
});

const registerSchema = z.object({
  name: z.string().min(2, 'El nombre es requerido'),
  lastName: z.string().min(2, 'El apellido es requerido'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
  username: z.string().min(3, 'Mínimo 3 caracteres'),
  birthday: z.string().refine((d) => new Date(d).toString() !== 'Invalid Date', 'Fecha inválida'),
  referralCode: z.string().optional(),
});

type LoginInputs = z.infer<typeof loginSchema>;
type RegisterInputs = z.infer<typeof registerSchema>;

//# Indicador de fortaleza de contraseña
const getPasswordStrength = (pwd: string) => {
  if (!pwd) return { score: 0, label: '', color: 'transparent' };
  let score = 0;
  if (pwd.length >= 8) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;
  const map = [
    { label: 'Muy débil', color: '#ff1744' },
    { label: 'Débil', color: '#ff6d00' },
    { label: 'Moderada', color: '#ffab00' },
    { label: 'Fuerte', color: '#00e676' },
    { label: 'Muy fuerte', color: '#00f3ff' },
  ];
  return { score, ...map[score] };
};

//# 3-Componente unificado de autenticación
interface AuthModalProps {
  initialMode?: 'login' | 'register';
}

export const AuthModal = ({ initialMode = 'login' }: AuthModalProps) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [password, setPassword] = useState('');
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { status, error } = useAppSelector((s) => s.auth);

  const loginForm = useForm<LoginInputs>({ resolver: zodResolver(loginSchema) });
  const registerForm = useForm<RegisterInputs>({ resolver: zodResolver(registerSchema) });

  const strength = getPasswordStrength(password);

  const onLogin = async (data: LoginInputs) => {
    const result = await dispatch(login(data));
    if (login.fulfilled.match(result)) {
      router.push('/auth/logging-in');
      setTimeout(() => dispatch(closeModal()), 1000);
    }
  };

  const onRegister = async (data: RegisterInputs) => {
    dispatch(setRegistrationData({ ...data, profileURL: '' }));
    dispatch(closeModal());
    router.push('/auth/verify');
  };

  const panelVariants = {
    enter: (dir: number) => ({ x: dir * 60, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir * -60, opacity: 0 }),
  };

  const isLogin = mode === 'login';

  return (
    <div className="relative flex min-h-0 overflow-hidden rounded-2xl md:min-h-[600px]">
      {/* Left decorative panel */}
      <div
        className="relative hidden w-[42%] flex-shrink-0 flex-col items-center justify-center overflow-hidden border-r p-10 transition-all duration-500 md:flex"
        style={{
          background: isLogin
            ? 'linear-gradient(145deg, rgba(0,243,255,0.08) 0%, rgba(0,20,40,0.95) 100%)'
            : 'linear-gradient(145deg, rgba(255,0,85,0.08) 0%, rgba(30,0,20,0.95) 100%)',
          borderColor: isLogin ? 'rgba(0,243,255,0.15)' : 'rgba(255,0,85,0.15)',
        }}
      >
        {/* Glow orb */}
        <div
          className="absolute left-1/2 top-[20%] h-[250px] w-[250px] -translate-x-1/2 rounded-full opacity-[0.08] blur-[80px]"
          style={{ backgroundColor: isLogin ? '#00f3ff' : '#ff0055' }}
        />

        <AnimatePresence mode="wait">
          <motion.div
            key={mode}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}
          >
            <Typography
              variant="overline"
              className="mb-4 block text-[0.65rem] font-bold tracking-[4px]"
              style={{ color: isLogin ? '#00f3ff' : '#ff0055' }}
            >
              {isLogin ? '// SYSTEM ACCESS' : '// NEW OPERATOR'}
            </Typography>
            <Typography
              variant="h3"
              className="mb-4 font-black uppercase leading-[1.1] text-white"
              style={{ textShadow: `0 0 30px ${isLogin ? 'rgba(0,243,255,0.4)' : 'rgba(255,0,85,0.4)'}` }}
            >
              {isLogin ? 'Bienvenido\nde vuelta' : 'Únete al\nsistema'}
            </Typography>
            <Typography variant="body2" className="mx-auto mb-8 max-w-[240px] leading-[1.7] text-white/50">
              {isLogin
                ? 'Accede a tu panel de operaciones, gestiona tu hash y audita tus activos en la red.'
                : 'Crea tu perfil de operador, inicializa tu laboratorio y comienza a minar en la simulación blockchain.'}
            </Typography>

            <Button
              variant="outlined"
              size="small"
              endIcon={<ArrowRight size={18} />}
              onClick={() => setMode(isLogin ? 'register' : 'login')}
              sx={{
                borderColor: isLogin ? 'rgba(0,243,255,0.4)' : 'rgba(255,0,85,0.4)',
                color: isLogin ? '#00f3ff' : '#ff0055',
                '&:hover': {
                  borderColor: isLogin ? '#00f3ff' : '#ff0055',
                  bgcolor: isLogin ? 'rgba(0,243,255,0.05)' : 'rgba(255,0,85,0.05)',
                }
              }}
            >
              {isLogin ? 'Crear cuenta' : 'Iniciar sesión'}
            </Button>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Right form panel */}
      <div className="flex flex-1 flex-col justify-center overflow-y-auto bg-[rgba(8,10,20,0.97)] p-6 backdrop-blur-xl md:p-10">
        {/* Mobile mode switcher */}
        <div className="mb-6 flex justify-center gap-2 md:hidden">
          <button
            onClick={() => setMode('login')}
            className="rounded-full border px-3 py-1 text-[0.7rem] font-bold transition-colors"
            style={{
              backgroundColor: isLogin ? '#00f3ff' : 'transparent',
              color: isLogin ? '#000' : '#00f3ff',
              borderColor: '#00f3ff',
            }}
          >
            Iniciar Sesión
          </button>
          <button
            onClick={() => setMode('register')}
            className="rounded-full border px-3 py-1 text-[0.7rem] font-bold transition-colors"
            style={{
              backgroundColor: !isLogin ? '#ff0055' : 'transparent',
              color: !isLogin ? '#fff' : '#ff0055',
              borderColor: '#ff0055',
            }}
          >
            Registro
          </button>
        </div>

        <AnimatePresence mode="wait" custom={isLogin ? -1 : 1}>
          {isLogin ? (
            <motion.div
              key="login"
              custom={-1}
              variants={panelVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.35, ease: 'easeInOut' }}
            >
              <form onSubmit={loginForm.handleSubmit(onLogin)}>
                <Typography variant="h5" className="mb-1 font-black uppercase tracking-[1px] text-white">
                  Iniciar Sesión
                </Typography>
                <div className="mb-8 h-0.5 w-10 bg-[#00f3ff] shadow-[0_0_8px_#00f3ff]" />

                <div className="flex flex-col gap-5">
                  <Input
                    id="login-email"
                    label="Email"
                    type="email"
                    error={!!loginForm.formState.errors.email}
                    helperText={loginForm.formState.errors.email?.message}
                    startAdornment={<Mail size={18} className="text-[#00f3ff]" />}
                    {...loginForm.register('email')}
                  />
                  <Input
                    id="login-password"
                    label="Contraseña"
                    type="password"
                    error={!!loginForm.formState.errors.password}
                    helperText={loginForm.formState.errors.password?.message}
                    startAdornment={<Lock size={18} className="text-[#00f3ff]" />}
                    {...loginForm.register('password')}
                  />

                  <AnimatePresence>
                    {error && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                        <div className="flex items-start gap-2 rounded border border-[#ff0055]/30 bg-[#ff0055]/[0.08] p-3 text-[0.8rem] text-[#ffcdd2]">
                          <AlertCircle size={18} className="mt-0.5 shrink-0 text-[#ff0055]" />
                          {error}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <Button
                    id="login-submit"
                    type="submit"
                    variant="contained"
                    fullWidth
                    disabled={status === 'loading'}
                    sx={{
                      bgcolor: '#00f3ff', color: 'black', fontWeight: 'bold',
                      fontSize: '0.95rem', py: 1.5, mt: 1,
                      '&:hover': { bgcolor: '#00c2cc', boxShadow: '0 0 25px rgba(0,243,255,0.5)' },
                      '&:active': { transform: 'scale(0.98)' },
                      transition: 'all 0.2s ease',
                    }}
                  >
                    {status === 'loading' ? (
                      <div className="h-[22px] w-[22px] animate-spin rounded-full border-2 border-black/20 border-t-black" />
                    ) : 'ACCEDER AL SISTEMA'}
                  </Button>
                </div>
              </form>
            </motion.div>
          ) : (
            <motion.div
              key="register"
              custom={1}
              variants={panelVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.35, ease: 'easeInOut' }}
            >
              <form onSubmit={registerForm.handleSubmit(onRegister)}>
                <Typography variant="h5" className="mb-1 font-black uppercase tracking-[1px] text-white">
                  Crear Cuenta
                </Typography>
                <div className="mb-8 h-0.5 w-10 bg-[#ff0055] shadow-[0_0_8px_#ff0055]" />

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Input
                    id="reg-name"
                    label="Nombre"
                    error={!!registerForm.formState.errors.name}
                    helperText={registerForm.formState.errors.name?.message}
                    startAdornment={<User size={18} className="text-[#ff0055]" />}
                    {...registerForm.register('name')}
                  />
                  <Input
                    id="reg-lastname"
                    label="Apellido"
                    error={!!registerForm.formState.errors.lastName}
                    helperText={registerForm.formState.errors.lastName?.message}
                    startAdornment={<User size={18} className="text-[#ff0055]" />}
                    {...registerForm.register('lastName')}
                  />
                  <div className="sm:col-span-2">
                    <Input
                      id="reg-username"
                      label="Nombre de Usuario"
                      error={!!registerForm.formState.errors.username}
                      helperText={registerForm.formState.errors.username?.message}
                      startAdornment={<IdCard size={18} className="text-[#ff0055]" />}
                      {...registerForm.register('username')}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <Input
                      id="reg-email"
                      label="Email"
                      type="email"
                      error={!!registerForm.formState.errors.email}
                      helperText={registerForm.formState.errors.email?.message}
                      startAdornment={<Mail size={18} className="text-[#ff0055]" />}
                      {...registerForm.register('email')}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <Input
                      id="reg-password"
                      label="Contraseña"
                      type="password"
                      error={!!registerForm.formState.errors.password}
                      helperText={registerForm.formState.errors.password?.message}
                      startAdornment={<Lock size={18} className="text-[#ff0055]" />}
                      {...registerForm.register('password', {
                        onChange: (e) => setPassword(e.target.value),
                      })}
                    />
                    {password && (
                      <div className="mt-1">
                        <div className="h-[3px] w-full overflow-hidden rounded bg-white/[0.08]">
                          <div
                            className="h-full rounded transition-all duration-300"
                            style={{ width: `${(strength.score / 4) * 100}%`, backgroundColor: strength.color }}
                          />
                        </div>
                        <Typography
                          variant="caption"
                          className="mt-1 flex items-center gap-1"
                          style={{ color: strength.color }}
                        >
                          {strength.score >= 3 && <CheckCircle2 size={12} />}
                          {strength.label}
                        </Typography>
                      </div>
                    )}
                  </div>
                  <div className="sm:col-span-2">
                    <Input
                      id="reg-birthday"
                      label="Fecha de Nacimiento"
                      type="date"
                      error={!!registerForm.formState.errors.birthday}
                      helperText={registerForm.formState.errors.birthday?.message}
                      startAdornment={<Calendar size={18} className="text-[#ff0055]" />}
                      {...registerForm.register('birthday')}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <Input
                      id="reg-referral"
                      label="Código de Referencia (Opcional)"
                      error={!!registerForm.formState.errors.referralCode}
                      helperText={registerForm.formState.errors.referralCode?.message}
                      {...registerForm.register('referralCode')}
                    />
                  </div>
                </div>

                {error && (
                  <div className="mt-4 flex items-start gap-2 rounded border border-[#ff0055]/30 bg-[#ff0055]/[0.08] p-3 text-[0.8rem] text-[#ffcdd2]">
                    <AlertCircle size={18} className="mt-0.5 shrink-0 text-[#ff0055]" />
                    {error}
                  </div>
                )}

                <Button
                  id="register-submit"
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={status === 'loading'}
                  sx={{
                    mt: 3, bgcolor: '#ff0055', color: 'white', fontWeight: 'bold',
                    fontSize: '0.95rem', py: 1.5,
                    '&:hover': { bgcolor: '#cc0044', boxShadow: '0 0 25px rgba(255,0,85,0.5)' },
                    '&:active': { transform: 'scale(0.98)' },
                    transition: 'all 0.2s ease',
                  }}
                >
                  {status === 'loading' ? (
                    <div className="h-[22px] w-[22px] animate-spin rounded-full border-2 border-white/20 border-t-white" />
                  ) : 'CREAR CUENTA'}
                </Button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
