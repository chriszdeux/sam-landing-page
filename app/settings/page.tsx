// 1-Selección de datos desde el estado global de Redux
// 2-Selección de datos desde el estado global de Redux
// 3-Estructuración y renderizado visual del componente UI

'use client';

import React from 'react';
import { Background } from '../../components/layout/Background';

//# 1-Selección de datos desde el estado global de Redux
import { useAppDispatch, useAppSelector } from '../../lib/hooks';
import { TechFrame } from '../../components/ui/TechFrame';
import { PageHeader } from '../../components/ui/PageHeader';
import { Typography } from '../../components/ui/Typography';
import { Button } from '../../components/ui/Button';
import { Copy, BadgeCheck, ShieldOff } from 'lucide-react';
import { addNotification } from '../../lib/features/uiSlice';

export default function SettingsPage() {
  const dispatch = useAppDispatch();
  const { userInfo } = useAppSelector((state) => state.auth);

  const copyToClipboard = (text: string, label: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    dispatch(addNotification({
      type: 'success',
      message: `${label} copiado al portapapeles`
    }));
  };



  //# 3-Estructuración y renderizado visual del componente UI
  return (
    <div className="relative min-h-screen">
      <Background />
      <div className="relative z-[1] mx-auto w-full max-w-[1200px] px-4 pb-20 pt-32 sm:px-6 lg:px-8">
        <PageHeader
            title="CONFIGURACIÓN DE CUENTA"
            subtitle="Administra tu perfil personal, preferencias y seguridad del sistema."
            color="#00f3ff"
        />

        <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
            {}
            <div className="md:col-span-4">
                <TechFrame>
                    <div className="flex flex-col items-center p-8 text-center">
                         <div className="relative mb-6 h-[120px] w-[120px]">
                             <div className="flex h-full w-full items-center justify-center rounded-full border-2 border-[#00f3ff] bg-primary text-5xl shadow-[0_0_20px_rgba(0,243,255,0.4)]">
                                {userInfo?.username?.[0]?.toUpperCase() || 'U'}
                            </div>
                            <div
                                className="absolute bottom-0 right-0 h-6 w-6 rounded-full border-2 border-black shadow-[0_0_10px_currentColor]"
                                style={{
                                    backgroundColor: userInfo?.confirmedAccount ? '#00e676' : '#ff1744',
                                    color: userInfo?.confirmedAccount ? '#00e676' : '#ff1744',
                                }}
                            />
                         </div>

                         <Typography variant="h5" component="p" className="mb-1 font-bold text-white">
                             {userInfo?.name} {userInfo?.lastName}
                         </Typography>
                         <Typography variant="body1" component="p" className="mb-1 flex items-center gap-2 text-primary">
                             @{userInfo?.username}
                             {userInfo?.confirmedAccount && <BadgeCheck size={18} />}
                         </Typography>

                         <div className="mt-4 w-full">
                            <span
                                className={
                                  'inline-flex w-full items-center justify-center rounded-full border px-3 py-1.5 text-sm font-bold ' +
                                  (userInfo?.isBanned
                                    ? 'border-error text-error'
                                    : 'border-success text-success')
                                }
                            >
                                {userInfo?.isBanned ? "ACCESO DENEGADO" : "ACCESO AUTORIZADO"}
                            </span>
                         </div>
                    </div>
                </TechFrame>
            </div>

            {}
            <div className="md:col-span-8">
                <div className="flex flex-col gap-8">

                    {}
                    <TechFrame color="#ff0055">
                        <div className="p-8">
                            <Typography variant="h6" component="p" className="mb-6 flex items-center gap-2 text-[#ff0055]">
                                {'// DATOS DE USUARIO'}
                            </Typography>

                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                <div>
                                    <Typography variant="caption" component="p" className="text-foreground-muted">ID DE USUARIO</Typography>
                                    <div
                                        onClick={() => copyToClipboard(userInfo?.id || '', 'ID de Usuario')}
                                        className="flex cursor-pointer items-center gap-2 text-white hover:text-primary"
                                    >
                                        <Typography variant="body1" component="p" className="font-mono">
                                            {userInfo?.id ? `${userInfo.id.substring(0, 12)}...` : 'N/A'}
                                        </Typography>
                                        <Copy size={16} className="opacity-50" />
                                    </div>
                                </div>
                                <div>
                                    <Typography variant="caption" component="p" className="text-foreground-muted">CORREO ELECTRÓNICO</Typography>
                                    <div
                                        onClick={() => copyToClipboard(userInfo?.email || '', 'Correo electrónico')}
                                        className="flex cursor-pointer items-center gap-2 text-white hover:text-primary"
                                    >
                                        <Typography variant="body1" component="p">
                                            {userInfo?.email || 'N/A'}
                                        </Typography>
                                        <Copy size={16} className="opacity-50" />
                                    </div>
                                </div>
                                <div>
                                    <Typography variant="caption" component="p" className="text-foreground-muted">FECHA DE NACIMIENTO</Typography>
                                    <Typography variant="body1" component="p" className="text-white">{userInfo?.birthday || 'No definida'}</Typography>
                                </div>
                                <div>
                                    <Typography variant="caption" component="p" className="text-foreground-muted">CÓDIGO DE REFERENCIA</Typography>
                                    <div
                                        onClick={() => copyToClipboard(userInfo?.referralCode || '', 'Código de Referencia')}
                                        className="flex cursor-pointer items-center gap-2 font-bold text-[#ffb700]"
                                    >
                                        <Typography variant="body1" component="p" className="font-mono">
                                            {userInfo?.referralCode || 'N/A'}
                                        </Typography>
                                        <Copy size={16} className="opacity-50" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </TechFrame>

                    {}
                    {}

                     {}
                     <TechFrame color="#ffb700">
                        <div className="flex flex-col gap-4 p-8">
                            <Typography variant="h6" component="p" className="mb-2 text-[#ffb700]">
                                {'// ZONA DE SEGURIDAD'}
                            </Typography>
                            <div className="flex flex-wrap gap-4">
                                <Button variant="outlined" color="error" startIcon={<ShieldOff size={18} />}>Cerrar Sesión en otros dispositivos</Button>
                            </div>
                        </div>
                     </TechFrame>

                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
