import React from 'react';
import { Typography, Alert, Stack, Grid, MenuItem, TextField, Autocomplete } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAppDispatch, useAppSelector } from '../../lib/hooks';
import { register as registerUser } from '../../lib/features/authSlice';
import { closeModal, openModal } from '../../lib/features/uiSlice';
import { Button } from '../ui/Button';

const registerSchema = z.object({
  name: z.string().min(2, 'El nombre es requerido'),
  lastName: z.string().min(2, 'El apellido es requerido'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  username: z.string().min(3, 'El usuario debe tener al menos 3 caracteres'),
  birthday: z.string().refine((date) => new Date(date).toString() !== 'Invalid Date', 'Fecha inválida'),
  country: z.string().min(2, 'El país es requerido'),
  genre: z.enum(['M', 'F', 'Other'] as const),
  phone: z.string().min(10, 'Teléfono inválido'),
});

type RegisterFormInputs = z.infer<typeof registerSchema>;

const genreOptions = [
  { label: 'Masculino', value: 'M' },
  { label: 'Femenino', value: 'F' },
  { label: 'Otro', value: 'Other' },
];

export const RegisterForm = () => {
  const dispatch = useAppDispatch();
  const { status, error } = useAppSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<RegisterFormInputs>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormInputs) => {
    const payload = { ...data, profileURL: '' };
    const resultAction = await dispatch(registerUser(payload));
    if (registerUser.fulfilled.match(resultAction)) {
      dispatch(openModal('validate'));
      alert('Registro exitoso! Por favor revisa tu correo para el código de validación.');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Typography variant="h4" align="center" gutterBottom sx={{ color: 'secondary.main', mb: 4 }}>
        Registro
      </Typography>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField label="Nombre" error={!!errors.name} helperText={errors.name?.message} fullWidth variant="outlined" InputLabelProps={{ shrink: true }} {...register('name')} />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField label="Apellido" error={!!errors.lastName} helperText={errors.lastName?.message} fullWidth variant="outlined" InputLabelProps={{ shrink: true }} {...register('lastName')} />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <TextField label="Usuario" error={!!errors.username} helperText={errors.username?.message} fullWidth variant="outlined" InputLabelProps={{ shrink: true }} {...register('username')} />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <TextField label="Email" type="email" error={!!errors.email} helperText={errors.email?.message} fullWidth variant="outlined" InputLabelProps={{ shrink: true }} {...register('email')} />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <TextField label="Contraseña" type="password" error={!!errors.password} helperText={errors.password?.message} fullWidth variant="outlined" InputLabelProps={{ shrink: true }} {...register('password')} />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField label="Fecha de Nacimiento" type="date" error={!!errors.birthday} helperText={errors.birthday?.message} fullWidth variant="outlined" InputLabelProps={{ shrink: true }} {...register('birthday')} />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField label="Teléfono" error={!!errors.phone} helperText={errors.phone?.message} fullWidth variant="outlined" InputLabelProps={{ shrink: true }} {...register('phone')} />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField label="País" error={!!errors.country} helperText={errors.country?.message} fullWidth variant="outlined" InputLabelProps={{ shrink: true }} {...register('country')} />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Controller
            name="genre"
            control={control}
            defaultValue="M"
            render={({ field: { onChange, value } }) => (
              <Autocomplete
                options={genreOptions}
                getOptionLabel={(option) => option.label}
                isOptionEqualToValue={(option, value) => option.value === value.value}
                value={genreOptions.find((option) => option.value === value) || null}
                onChange={(_, newValue) => {
                  onChange(newValue ? newValue.value : '');
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Género"
                    error={!!errors.genre}
                    helperText={errors.genre?.message}
                    fullWidth
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                  />
                )}
              />
            )}
          />
        </Grid>
      </Grid>

      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}

      <Button type="submit" variant="contained" color="secondary" fullWidth glow sx={{ mt: 3 }} disabled={status === 'loading'}>
        {status === 'loading' ? 'Registrando...' : 'Registrarse'}
      </Button>
    </form>
  );
};
