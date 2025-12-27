'use client';

import React, { useEffect } from 'react';
import { Box, Typography, Stack, IconButton } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { Close, CheckCircle, Error, Info, Warning } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../../lib/hooks';
import { removeNotification, Notification } from '../../lib/features/uiSlice';

const ToastItem = ({ notification }: { notification: Notification }) => {
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (notification.duration) {
            const timer = setTimeout(() => {
                dispatch(removeNotification(notification.id));
            }, notification.duration);
            return () => clearTimeout(timer);
        }
    }, [notification, dispatch]);

    const getIcon = () => {
        switch (notification.type) {
            case 'success': return <CheckCircle fontSize="small" sx={{ color: '#00fa9a' }} />;
            case 'error': return <Error fontSize="small" sx={{ color: '#ff4d4d' }} />;
            case 'warning': return <Warning fontSize="small" sx={{ color: '#ffcc00' }} />;
            default: return <Info fontSize="small" sx={{ color: '#00f3ff' }} />;
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

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, transition: { duration: 0.2 } }}
            style={{ marginBottom: 8 }}
        >
            <Box sx={{
                width: 300,
                p: 2,
                borderRadius: 2,
                bgcolor: 'rgba(10, 10, 10, 0.95)',
                border: `1px solid ${colors.border}`,
                borderLeft: `4px solid ${colors.border}`,
                boxShadow: `0 4px 20px rgba(0,0,0,0.5)`,
                backdropFilter: 'blur(10px)',
                display: 'flex',
                alignItems: 'start',
                gap: 2,
                position: 'relative',
                overflow: 'hidden'
            }}>
                <Box sx={{ mt: 0.5 }}>{getIcon()}</Box>
                <Box sx={{ flexGrow: 1 }}>
                     <Typography variant="body2" sx={{ color: 'white', fontWeight: 500 }}>
                         {notification.message}
                     </Typography>
                </Box>
                <IconButton 
                    size="small" 
                    onClick={() => dispatch(removeNotification(notification.id))}
                    sx={{ color: 'rgba(255,255,255,0.5)', '&:hover': { color: 'white' }, p: 0.5, mt: 0 }}
                >
                    <Close fontSize="small" />
                </IconButton>
                
                {/* Progress bar animation could go here if needed, simple timeout is fine for now */}
            </Box>
        </motion.div>
    );
};

export const ToastStack = () => {
    const notifications = useAppSelector(state => state.ui.notifications);

    return (
        <Box sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            pointerEvents: 'none', // Allow clicks through container
            '& > div': { pointerEvents: 'auto' } // Re-enable clicks on toasts
        }}>
            <AnimatePresence>
                {notifications.map(notification => (
                    <ToastItem key={notification.id} notification={notification} />
                ))}
            </AnimatePresence>
        </Box>
    );
};
