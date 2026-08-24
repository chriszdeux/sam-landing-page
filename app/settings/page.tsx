// 1-Selección de datos desde el estado global de Redux
// 2-Definición de variantes de animación de entrada
// 3-Estructuración y renderizado visual del componente UI

'use client';

import React from 'react';
import { motion, useReducedMotion, type Variants } from 'framer-motion';
import { Background } from '../../components/layout/Background';

//# 1-Selección de datos desde el estado global de Redux
import { useAppDispatch, useAppSelector } from '../../lib/hooks';
import { PageHeader } from '../../components/ui/PageHeader';
import { Button } from '../../components/ui/Button';
import { SettingsPanel } from '../../components/settings/SettingsPanel';
import { DataField } from '../../components/settings/DataField';
import { IdentityCard } from '../../components/settings/IdentityCard';
import { ShieldOff } from 'lucide-react';
import { addNotification } from '../../lib/features/uiSlice';

export default function SettingsPage() {
  const dispatch = useAppDispatch();
  const { userInfo } = useAppSelector((state) => state.auth);
  const reduceMotion = useReducedMotion();

  const copyToClipboard = (text: string, label: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    dispatch(addNotification({
      type: 'success',
      message: `${label} copiado al portapapeles`
    }));
  };

  //# 2-Definición de variantes de animación de entrada
  // Entrada escalonada: los paneles aparecen en el orden en que se leen, así el
  // primer segundo de la página guía la lectura en vez de mostrar todo de golpe.
  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: reduceMotion ? 0 : 0.09,
        delayChildren: reduceMotion ? 0 : 0.1,
      },
    },
  };

  // Misma variante para bloques que no son SettingsPanel (tarjeta de identidad).
  const itemVariants: Variants = {
    hidden: { opacity: 0, y: reduceMotion ? 0 : 14 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: reduceMotion ? 0 : 0.4, ease: [0.22, 1, 0.36, 1] },
    },
  };

  //# 3-Estructuración y renderizado visual del componente UI
  return (
    <div className="relative min-h-screen">
      <Background />
      <div className="relative z-[1] mx-auto w-full max-w-[1100px] px-4 pb-20 pt-32 sm:px-6 lg:px-8">
        <PageHeader
            title="CONFIGURACIÓN DE CUENTA"
            subtitle="Administra tu perfil personal, preferencias y seguridad del sistema."
            color="#00f3ff"
        />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 items-start gap-5 md:grid-cols-12"
        >
            {/* Identidad */}
            <motion.div variants={itemVariants} className="md:col-span-4">
                <SettingsPanel label="Identidad">
                    <IdentityCard
                        initial={userInfo?.username?.[0]?.toUpperCase() || 'U'}
                        fullName={`${userInfo?.name ?? ''} ${userInfo?.lastName ?? ''}`.trim() || 'Sin nombre'}
                        username={userInfo?.username}
                        confirmedAccount={userInfo?.confirmedAccount}
                        isBanned={userInfo?.isBanned}
                    />
                </SettingsPanel>
            </motion.div>

            {/* motion.div y no div: las variantes solo se propagan a través de
                componentes motion, con un div plano los paneles no escalonan. */}
            <motion.div variants={containerVariants} className="flex flex-col gap-5 md:col-span-8">

                {/* Datos de usuario */}
                <SettingsPanel label="Datos de usuario">
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <DataField
                            label="ID de usuario"
                            display={userInfo?.id ? `${userInfo.id.substring(0, 12)}...` : 'N/A'}
                            value={userInfo?.id}
                            onCopy={() => copyToClipboard(userInfo?.id || '', 'ID de Usuario')}
                            mono
                        />
                        <DataField
                            label="Correo electrónico"
                            display={userInfo?.email || 'N/A'}
                            value={userInfo?.email}
                            onCopy={() => copyToClipboard(userInfo?.email || '', 'Correo electrónico')}
                        />
                        <DataField
                            label="Fecha de nacimiento"
                            display={userInfo?.birthday || 'No definida'}
                        />
                        <DataField
                            label="Código de referencia"
                            display={userInfo?.referralCode || 'N/A'}
                            value={userInfo?.referralCode}
                            onCopy={() => copyToClipboard(userInfo?.referralCode || '', 'Código de Referencia')}
                            mono
                            valueClassName="font-bold text-[#ffb700]"
                        />
                    </div>
                </SettingsPanel>

                {/* Seguridad */}
                <SettingsPanel label="Zona de seguridad" accent="#ffcc80">
                    <div className="flex flex-wrap items-center gap-4">
                        <Button variant="outlined" color="error" startIcon={<ShieldOff size={16} />}>
                            Cerrar Sesión en otros dispositivos
                        </Button>
                        <p className="text-[0.75rem] leading-snug text-white/40">
                            Revoca las sesiones activas fuera de este navegador.
                        </p>
                    </div>
                </SettingsPanel>

            </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
