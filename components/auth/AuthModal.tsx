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
import {
  Box, Typography, Stack, CircularProgress, InputAdornment, Alert,
  Grid, LinearProgress, Chip
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Email, Lock, Person, CalendarToday, Badge,
  ErrorOutline, CheckCircleOutline, ArrowForward
} from '@mui/icons-material';

import { useAppDispatch, useAppSelector } from '../../lib/hooks';
import { login } from '../../lib/features/auth';
import { setRegistrationData } from '../../lib/features/auth/reducer';
import { closeModal } from '../../lib/features/uiSlice';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

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
    localStorage.setItem('pending_email', data.email);
    localStorage.setItem('pending_password', data.password);
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
    <Box sx={{
      display: 'flex',
      minHeight: { xs: 'auto', md: '600px' },
      borderRadius: 4,
      overflow: 'hidden',
      position: 'relative',
    }}>
      {/* Left decorative panel */}
      <Box sx={{
        display: { xs: 'none', md: 'flex' },
        width: '42%',
        flexShrink: 0,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        p: 5,
        background: isLogin
          ? 'linear-gradient(145deg, rgba(0,243,255,0.08) 0%, rgba(0,20,40,0.95) 100%)'
          : 'linear-gradient(145deg, rgba(255,0,85,0.08) 0%, rgba(30,0,20,0.95) 100%)',
        borderRight: `1px solid ${isLogin ? 'rgba(0,243,255,0.15)' : 'rgba(255,0,85,0.15)'}`,
        transition: 'all 0.5s ease',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Glow orb */}
        <Box sx={{
          position: 'absolute',
          width: 250,
          height: 250,
          borderRadius: '50%',
          bgcolor: isLogin ? '#00f3ff' : '#ff0055',
          filter: 'blur(80px)',
          opacity: 0.08,
          top: '20%',
          left: '50%',
          transform: 'translateX(-50%)',
        }} />

        <AnimatePresence mode="wait">
          <motion.div
            key={mode}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}
          >
            <Typography variant="overline" sx={{
              color: isLogin ? '#00f3ff' : '#ff0055',
              letterSpacing: 4,
              fontWeight: 'bold',
              display: 'block',
              mb: 2,
              fontSize: '0.65rem',
            }}>
              {isLogin ? '// SYSTEM ACCESS' : '// NEW OPERATOR'}
            </Typography>
            <Typography variant="h3" sx={{
              color: 'white',
              fontWeight: 900,
              textTransform: 'uppercase',
              lineHeight: 1.1,
              mb: 2,
              textShadow: `0 0 30px ${isLogin ? 'rgba(0,243,255,0.4)' : 'rgba(255,0,85,0.4)'}`,
            }}>
              {isLogin ? 'Bienvenido\nde vuelta' : 'Únete al\nsistema'}
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, mb: 4, maxWidth: 240, mx: 'auto' }}>
              {isLogin
                ? 'Accede a tu panel de operaciones, gestiona tu hash y audita tus activos en la red.'
                : 'Crea tu perfil de operador, inicializa tu laboratorio y comienza a minar en la simulación blockchain.'}
            </Typography>

            <Button
              variant="outlined"
              size="small"
              endIcon={<ArrowForward />}
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
      </Box>

      {/* Right form panel */}
      <Box sx={{
        flex: 1,
        p: { xs: 3, md: 5 },
        bgcolor: 'rgba(8,10,20,0.97)',
        backdropFilter: 'blur(20px)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        overflowY: 'auto',
      }}>
        {/* Mobile mode switcher */}
        <Box sx={{ display: { xs: 'flex', md: 'none' }, gap: 1, mb: 3, justifyContent: 'center' }}>
          <Chip
            label="Iniciar Sesión"
            onClick={() => setMode('login')}
            variant={isLogin ? 'filled' : 'outlined'}
            sx={{
              bgcolor: isLogin ? '#00f3ff' : 'transparent',
              color: isLogin ? '#000' : '#00f3ff',
              borderColor: '#00f3ff',
              fontWeight: 'bold',
              fontSize: '0.7rem',
            }}
          />
          <Chip
            label="Registro"
            onClick={() => setMode('register')}
            variant={!isLogin ? 'filled' : 'outlined'}
            sx={{
              bgcolor: !isLogin ? '#ff0055' : 'transparent',
              color: !isLogin ? '#fff' : '#ff0055',
              borderColor: '#ff0055',
              fontWeight: 'bold',
              fontSize: '0.7rem',
            }}
          />
        </Box>

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
                <Typography variant="h5" sx={{
                  color: 'white', fontWeight: 900, textTransform: 'uppercase',
                  mb: 0.5, letterSpacing: 1,
                }}>
                  Iniciar Sesión
                </Typography>
                <Box sx={{ width: 40, height: 2, bgcolor: '#00f3ff', mb: 4, boxShadow: '0 0 8px #00f3ff' }} />

                <Stack spacing={2.5}>
                  <Input
                    id="login-email"
                    label="Email"
                    type="email"
                    error={!!loginForm.formState.errors.email}
                    helperText={loginForm.formState.errors.email?.message}
                    fullWidth
                    startAdornment={<InputAdornment position="start"><Email sx={{ color: '#00f3ff', fontSize: 18 }} /></InputAdornment>}
                    {...loginForm.register('email')}
                  />
                  <Input
                    id="login-password"
                    label="Contraseña"
                    type="password"
                    error={!!loginForm.formState.errors.password}
                    helperText={loginForm.formState.errors.password?.message}
                    fullWidth
                    startAdornment={<InputAdornment position="start"><Lock sx={{ color: '#00f3ff', fontSize: 18 }} /></InputAdornment>}
                    {...loginForm.register('password')}
                  />

                  <AnimatePresence>
                    {error && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                        <Alert
                          severity="error"
                          icon={<ErrorOutline sx={{ color: '#ff0055' }} />}
                          sx={{ bgcolor: 'rgba(255,0,85,0.08)', border: '1px solid rgba(255,0,85,0.3)', color: '#ffcdd2', fontSize: '0.8rem' }}
                        >
                          {error}
                        </Alert>
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
                    {status === 'loading' ? <CircularProgress size={22} color="inherit" /> : 'ACCEDER AL SISTEMA'}
                  </Button>
                </Stack>
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
                <Typography variant="h5" sx={{
                  color: 'white', fontWeight: 900, textTransform: 'uppercase',
                  mb: 0.5, letterSpacing: 1,
                }}>
                  Crear Cuenta
                </Typography>
                <Box sx={{ width: 40, height: 2, bgcolor: '#ff0055', mb: 4, boxShadow: '0 0 8px #ff0055' }} />

                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Input
                      id="reg-name"
                      label="Nombre"
                      error={!!registerForm.formState.errors.name}
                      helperText={registerForm.formState.errors.name?.message}
                      fullWidth
                      startAdornment={<InputAdornment position="start"><Person sx={{ color: '#ff0055', fontSize: 18 }} /></InputAdornment>}
                      {...registerForm.register('name')}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Input
                      id="reg-lastname"
                      label="Apellido"
                      error={!!registerForm.formState.errors.lastName}
                      helperText={registerForm.formState.errors.lastName?.message}
                      fullWidth
                      startAdornment={<InputAdornment position="start"><Person sx={{ color: '#ff0055', fontSize: 18 }} /></InputAdornment>}
                      {...registerForm.register('lastName')}
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <Input
                      id="reg-username"
                      label="Nombre de Usuario"
                      error={!!registerForm.formState.errors.username}
                      helperText={registerForm.formState.errors.username?.message}
                      fullWidth
                      startAdornment={<InputAdornment position="start"><Badge sx={{ color: '#ff0055', fontSize: 18 }} /></InputAdornment>}
                      {...registerForm.register('username')}
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <Input
                      id="reg-email"
                      label="Email"
                      type="email"
                      error={!!registerForm.formState.errors.email}
                      helperText={registerForm.formState.errors.email?.message}
                      fullWidth
                      startAdornment={<InputAdornment position="start"><Email sx={{ color: '#ff0055', fontSize: 18 }} /></InputAdornment>}
                      {...registerForm.register('email')}
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <Input
                      id="reg-password"
                      label="Contraseña"
                      type="password"
                      error={!!registerForm.formState.errors.password}
                      helperText={registerForm.formState.errors.password?.message}
                      fullWidth
                      startAdornment={<InputAdornment position="start"><Lock sx={{ color: '#ff0055', fontSize: 18 }} /></InputAdornment>}
                      {...registerForm.register('password', {
                        onChange: (e) => setPassword(e.target.value),
                      })}
                    />
                    {password && (
                      <Box sx={{ mt: 1 }}>
                        <LinearProgress
                          variant="determinate"
                          value={(strength.score / 4) * 100}
                          sx={{
                            height: 3, borderRadius: 2,
                            bgcolor: 'rgba(255,255,255,0.08)',
                            '& .MuiLinearProgress-bar': { bgcolor: strength.color, transition: 'all 0.3s ease' },
                          }}
                        />
                        <Typography variant="caption" sx={{ color: strength.color, mt: 0.5, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          {strength.score >= 3 && <CheckCircleOutline sx={{ fontSize: 12 }} />}
                          {strength.label}
                        </Typography>
                      </Box>
                    )}
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <Input
                      id="reg-birthday"
                      label="Fecha de Nacimiento"
                      type="date"
                      error={!!registerForm.formState.errors.birthday}
                      helperText={registerForm.formState.errors.birthday?.message}
                      fullWidth
                      startAdornment={<InputAdornment position="start"><CalendarToday sx={{ color: '#ff0055', fontSize: 18 }} /></InputAdornment>}
                      {...registerForm.register('birthday')}
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <Input
                      id="reg-referral"
                      label="Código de Referencia (Opcional)"
                      error={!!registerForm.formState.errors.referralCode}
                      helperText={registerForm.formState.errors.referralCode?.message}
                      fullWidth
                      {...registerForm.register('referralCode')}
                    />
                  </Grid>
                </Grid>

                {error && (
                  <Alert
                    severity="error"
                    sx={{ mt: 2, bgcolor: 'rgba(255,0,85,0.08)', border: '1px solid rgba(255,0,85,0.3)', color: '#ffcdd2', fontSize: '0.8rem' }}
                  >
                    {error}
                  </Alert>
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
                  {status === 'loading' ? <CircularProgress size={22} color="inherit" /> : 'CREAR CUENTA'}
                </Button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </Box>
    </Box>
  );
};
