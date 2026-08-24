// 1-Obtención del despachador para emitir acciones al store
// 2-Obtención del despachador para emitir acciones al store
// 3-Selección de datos desde el estado global de Redux
// 4-Estado de apertura para modal o menú open dialog
// 5-Gestión de estado local para label
// 6-Gestión de estado local para wallet address
// 7-Gestión de estado local para snackbar
// 8-Manejo de lógica de usuario para handleAddWallet
// 9-Manejo de lógica de usuario para handleRemoveWallet
// 10-Manejo de lógica de usuario para handleCopyToClipboard
// 11-Estructuración y renderizado visual del componente UI

'use client';

import React, { useEffect, useState } from 'react';
import { PlusCircle, Wallet, Copy, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { Typography } from '../ui/Typography';
import { Button } from '../ui/Button';
import { TechFrame } from '../ui/TechFrame';
import { AddWalletDialog } from './AddWalletDialog';

//# 1-Obtención del despachador para emitir acciones al store
import { useAppDispatch, useAppSelector } from '../../lib/hooks';
import { addWallet, removeWallet } from '../../lib/features/auth/actions';
import { AnimatePresence, motion } from 'framer-motion';

export const WalletManager = () => {
    
    //# 2-Obtención del despachador para emitir acciones al store
    const dispatch = useAppDispatch();
    
    //# 3-Selección de datos desde el estado global de Redux
    const { userInfo } = useAppSelector((state) => state.auth);

    
    
    //# 4-Estado de apertura para modal o menú open dialog
    const [openDialog, setOpenDialog] = useState(false);
    
    
    
    
    //# 7-Gestión de estado local para snackbar
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

    useEffect(() => {
        if (!snackbar.open) return;
        const timeout = setTimeout(() => setSnackbar((s) => ({ ...s, open: false })), 6000);
        return () => clearTimeout(timeout);
    }, [snackbar.open]);

    
    
    //# 8-Manejo de lógica de usuario para handleAddWallet
    const handleAddWallet = async (label: string, walletAddress: string) => {
        if (!label || !walletAddress) {
            setSnackbar({ open: true, message: 'Please fill in all fields', severity: 'error' });
            return;
        }
        
        try {
            if (!userInfo?.id) return;
            const resultAction = await dispatch(addWallet({ userId: userInfo.id, label, walletAddress }));
            if (addWallet.fulfilled.match(resultAction)) {
                 setSnackbar({ open: true, message: 'Wallet added successfully!', severity: 'success' });
                 setOpenDialog(false);
            } else {
                setSnackbar({ open: true, message: resultAction.payload as string || 'Failed to add wallet', severity: 'error' });
            }
        } catch {
             setSnackbar({ open: true, message: 'An unexpected error occurred', severity: 'error' });
        }
    };

    
    
    //# 9-Manejo de lógica de usuario para handleRemoveWallet
    const handleRemoveWallet = async (walletAddress: string) => {
        if (!userInfo?.id) return;
        try {
           const resultAction = await dispatch(removeWallet({ userId: userInfo.id, walletAddress }));
           if (removeWallet.fulfilled.match(resultAction)) {
               setSnackbar({ open: true, message: 'Wallet removed', severity: 'success' });
           } else {
               setSnackbar({ open: true, message: 'Failed to remove', severity: 'error' });
           }
        } catch {
            setSnackbar({ open: true, message: 'Error removing wallet', severity: 'error' });
        }
    };

    
    
    //# 10-Manejo de lógica de usuario para handleCopyToClipboard
    const handleCopyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setSnackbar({ open: true, message: 'Address copied to clipboard', severity: 'success' });
    };

    if (!userInfo) return null;

    
    
    //# 11-Estructuración y renderizado visual del componente UI
    return (
        <div className="mb-16">
            {}
            <div className="overflow-x-hidden p-2">

                {}
                <div className="flex flex-wrap-reverse gap-8">
                    <div className="w-full">
                        <div className="mb-4 flex items-center justify-between">
                             <Typography variant="overline" className="font-bold tracking-[2px] text-[#00f3ff]">
                                {'// MIS_BILLETERAS'}
                            </Typography>
                            <Button
                                variant="outlined"
                                startIcon={<PlusCircle size={16} />}
                                onClick={() => setOpenDialog(true)}
                                size="small"
                                sx={{
                                    color: '#00f3ff',
                                    borderColor: 'rgba(0, 243, 255, 0.3)',
                                    fontSize: '0.7rem',
                                    '&:hover': { borderColor: '#00f3ff', bgcolor: 'rgba(0, 243, 255, 0.1)' }
                                }}
                            >
                                NUEVA WALLET
                            </Button>
                        </div>

                        <div className="flex gap-4 overflow-x-auto px-0 pb-4 md:px-2">
                            {userInfo.wallets && userInfo.wallets.map((wallet, index) => (
                                <div key={index} className="w-[280px] max-w-[85vw] flex-shrink-0 sm:w-[320px] sm:max-w-[320px]">
                                    <TechFrame color="#00f3ff">
                                        <div className="group relative flex h-[180px] flex-col justify-between bg-gradient-to-br from-[#00f3ff]/10 to-transparent p-4 transition-transform duration-200 hover:-translate-y-1 sm:p-6">
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <div className="mb-4 flex h-7 w-10 items-center justify-center rounded border border-[#ffd700]/30 bg-[#ffd700]/[0.15]">
                                                        <div className="h-4 w-5 rounded-sm border border-[#ffd700]/40" />
                                                    </div>
                                                </div>
                                                <Wallet size={48} className="absolute right-2.5 top-2.5 text-white/10" />
                                            </div>

                                            <div>
                                                <Typography variant="h6" className="mb-1 text-base font-bold tracking-wide text-white sm:text-xl">
                                                    {wallet.label.toUpperCase()}
                                                </Typography>
                                                <div className="flex items-center gap-2">
                                                    <Typography variant="caption" className="font-mono text-[0.7rem] tracking-wide text-[#00f3ff]/80 sm:text-[0.8rem]">
                                                        {wallet.walletAddress.substring(0, 8)} •••• {wallet.walletAddress.substring(wallet.walletAddress.length - 6)}
                                                    </Typography>
                                                    <button
                                                        onClick={() => handleCopyToClipboard(wallet.walletAddress)}
                                                        className="rounded p-1 text-[#00f3ff]"
                                                    >
                                                        <Copy size={14} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </TechFrame>
                                </div>
                            ))}

                            {(!userInfo.wallets || userInfo.wallets.length === 0) && (
                                <div className="flex h-[180px] w-[280px] items-center sm:w-[320px]">
                                    <Button
                                        variant="outlined"
                                        fullWidth
                                        sx={{ height: '100%', borderStyle: 'dashed', borderColor: 'rgba(255,255,255,0.1)', color: 'text.secondary' }}
                                        onClick={() => setOpenDialog(true)}
                                    >
                                        Agregar Primera Wallet
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>

                    {}
                    <div className="w-full">
                        <div className="mb-4 flex items-center justify-between">
                            <Typography variant="overline" className="font-bold tracking-[4px] text-[#ce93d8]">
                                {'// EXTERNAL_LINKS'}
                            </Typography>
                        </div>

                        <div className="flex flex-col gap-4">
                            <AnimatePresence>
                                {userInfo.walletsSaved && userInfo.walletsSaved.length > 0 ? (
                                    userInfo.walletsSaved.map((wallet) => (
                                        <motion.div
                                            key={wallet.walletAddress}
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <div className="relative">
                                                <TechFrame color="#ce93d8">
                                                    <div className="relative flex items-center p-4">
                                                        <div className="mr-4 flex h-9 w-9 items-center justify-center rounded-full border border-[#ce93d8] bg-[#ce93d8]/10 text-base font-bold text-[#ce93d8]">
                                                            {wallet.label.charAt(0).toUpperCase()}
                                                        </div>
                                                        <div className="min-w-0 flex-1">
                                                            <Typography variant="body2" className="font-bold leading-tight text-white">
                                                                {wallet.label}
                                                            </Typography>
                                                            <Typography variant="caption" className="block overflow-hidden text-ellipsis font-mono text-[#ce93d8]/60">
                                                                {wallet.walletAddress.substring(0, 6)}...{wallet.walletAddress.substring(wallet.walletAddress.length - 4)}
                                                            </Typography>
                                                        </div>
                                                        <div className="flex">
                                                            <button
                                                                onClick={() => handleCopyToClipboard(wallet.walletAddress)}
                                                                className="rounded p-1 text-white/30 hover:text-white"
                                                            >
                                                                <Copy size={14} />
                                                            </button>
                                                            <button
                                                                onClick={() => handleRemoveWallet(wallet.walletAddress)}
                                                                className="rounded p-1 text-red-500/30 hover:text-red-500"
                                                            >
                                                                <Trash2 size={14} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </TechFrame>
                                            </div>
                                        </motion.div>
                                    ))
                                ) : (
                                    <div className="rounded border border-dashed border-white/10 bg-white/[0.02] p-8 text-center">
                                        <Typography variant="caption" className="italic text-white/30">
                                            No hay wallets guardadas
                                        </Typography>
                                    </div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>

            <AddWalletDialog
                open={openDialog}
                onClose={() => setOpenDialog(false)}
                onAdd={handleAddWallet}
            />

            <AnimatePresence>
                {snackbar.open && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className={cn(
                            'fixed bottom-6 right-6 z-50 rounded-lg border px-4 py-3 text-sm shadow-lg',
                            snackbar.severity === 'success'
                                ? 'border-green-500/30 bg-green-950/90 text-green-200'
                                : 'border-red-500/30 bg-red-950/90 text-red-200'
                        )}
                    >
                        {snackbar.message}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
