// 1-Definir componente de notificación individual
// 2-Obtener despachador y configurar temporizador
// 3-Efecto para auto-eliminar notificación
// 4-Determinar icono y colores según tipo
// 5-Renderizar notificación con animación de salida
// 6-Definir contenedor de pila de notificaciones
// 7-Seleccionar notificaciones del estado global
// 8-Renderizar lista de notificaciones

//# 1-Definir componente de notificación individual
'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, XCircle, Info, AlertTriangle } from 'lucide-react';

import { useAppDispatch, useAppSelector } from '../../lib/hooks';
import { removeNotification, Notification } from '../../lib/features/uiSlice';
import { Typography } from './Typography';

const ToastItem = ({ notification }: { notification: Notification }) => {

    //# 2-Obtener despachador y configurar temporizador
    const dispatch = useAppDispatch();

    //# 3-Efecto para auto-eliminar notificación
    useEffect(function autoDismiss() {
        if (notification.duration) {
            const timer = setTimeout(() => {
                dispatch(removeNotification(notification.id));
            }, notification.duration);

            return () => clearTimeout(timer);
        }
    }, [notification, dispatch]);

    //# 4-Determinar icono y colores según tipo
    const getIcon = () => {
        switch (notification.type) {
            case 'success': return <CheckCircle size={18} className="text-[#00fa9a]" />;
            case 'error': return <XCircle size={18} className="text-[#ff4d4d]" />;
            case 'warning': return <AlertTriangle size={18} className="text-[#ffcc00]" />;
            default: return <Info size={18} className="text-[#00f3ff]" />;
        }
    };

    const getColors = () => {
         switch (notification.type) {
            case 'success': return { border: '#00fa9a', bg: 'rgba(0, 250, 154, 0.1)' };
            case 'error': return { border: '#ff4d4d', bg: 'rgba(255, 77, 77, 0.1)' };
            case 'warning': return { border: '#ffcc00', bg: 'rgba(255, 204, 0, 0.1)' };
            default: return { border: '#00f3ff', bg: 'rgba(0, 243, 255, 0.1)' };
        }
    };

    const colors = getColors();

    //# 5-Renderizar notificación con animación de salida
    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, transition: { duration: 0.2 } }}
            style={{ marginBottom: 8 }}
        >
            <div
                className="relative flex w-[300px] items-start gap-4 overflow-hidden rounded-lg bg-[rgba(10,10,10,0.95)] p-4 shadow-[0_4px_20px_rgba(0,0,0,0.5)] backdrop-blur-md"
                style={{ border: `1px solid ${colors.border}`, borderLeft: `4px solid ${colors.border}` }}
            >
                <div className="mt-0.5">{getIcon()}</div>
                <div className="flex-grow">
                     <Typography variant="body2" component="p" className="font-medium text-white">
                         {notification.message}
                     </Typography>
                </div>
                <button
                    onClick={() => dispatch(removeNotification(notification.id))}
                    className="mt-0 p-0.5 text-white/50 transition-colors hover:text-white"
                >
                    <X size={18} />
                </button>


            </div>
        </motion.div>
    );
};

//# 6-Definir contenedor de pila de notificaciones
export const ToastStack = () => {

    //# 7-Seleccionar notificaciones del estado global
    const notifications = useAppSelector(state => state.ui.notifications);

    //# 8-Renderizar lista de notificaciones
    return (
        <div className="pointer-events-none fixed bottom-6 right-6 z-[9999] flex flex-col items-end [&>div]:pointer-events-auto">
            <AnimatePresence>
                {notifications.map(notification => (
                    <ToastItem key={notification.id} notification={notification} />
                ))}
            </AnimatePresence>
        </div>
    );
};
