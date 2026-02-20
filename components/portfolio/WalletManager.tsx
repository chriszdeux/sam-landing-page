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

import React, { useState } from 'react';
import { Box, Typography, Grid, Avatar, Button, Snackbar, Alert, IconButton } from '@mui/material';
import { TechFrame } from '../ui/TechFrame';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
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
        <Box sx={{ mb: 8 }}>
            {}
            <Box sx={{ overflowX: 'hidden', p: 1 }}>
                
                {}
                <Grid container spacing={4} sx={{ display: 'flex', flexWrap: 'wrap-reverse' }}>
                    <Grid size={{ xs: 12 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                             <Typography variant="overline" sx={{ color: '#00f3ff', fontWeight: 'bold', letterSpacing: 2 }}>
                                {'// MIS_BILLETERAS'}
                            </Typography>
                            <Button
                                variant="outlined"
                                startIcon={<AddCircleOutlineIcon />}
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
                        </Box>
                        
                        <Box sx={{ 
                            display: 'flex', 
                            gap: 2, 
                            overflowX: 'auto', 
                            pb: 2,
                            '::-webkit-scrollbar': { height: 6 },
                            '::-webkit-scrollbar-track': {  background: 'rgba(255, 255, 255, 0.05)' },
                            '::-webkit-scrollbar-thumb': { background: '#00f3ff', borderRadius: 4 }
                        }}>
                            {userInfo.wallets && userInfo.wallets.map((wallet, index) => (
                                <Box key={index} sx={{ minWidth: 320, maxWidth: 320 }}>
                                    <TechFrame color="#00f3ff">
                                        <Box sx={{ 
                                            p: 3,
                                            height: 180,
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'space-between',
                                            position: 'relative',
                                            background: 'linear-gradient(135deg, rgba(0, 243, 255, 0.1) 0%, rgba(0,0,0,0) 100%)',
                                            transition: 'transform 0.2s',
                                            '&:hover': { transform: 'translateY(-4px)' }
                                        }}>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                <Box>
                                                    <Box sx={{ 
                                                        width: 40, 
                                                        height: 28, 
                                                        bgcolor: 'rgba(255, 215, 0, 0.15)', 
                                                        border: '1px solid rgba(255, 215, 0, 0.3)', 
                                                        borderRadius: 1, 
                                                        mb: 2,
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center'
                                                    }}>
                                                        <Box sx={{ width: 20, height: 16, border: '1px solid rgba(255, 215, 0, 0.4)', borderRadius: 0.5 }} />
                                                    </Box>
                                                </Box>
                                                <AccountBalanceWalletIcon sx={{ color: 'rgba(255,255,255,0.1)', fontSize: 60, position: 'absolute', top: 10, right: 10 }} />
                                            </Box>

                                            <Box>
                                                <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'white', mb: 0.5, letterSpacing: 1 }}>
                                                    {wallet.label.toUpperCase()}
                                                </Typography>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <Typography variant="caption" sx={{ fontFamily: 'monospace', color: 'rgba(0, 243, 255, 0.8)', fontSize: '0.8rem', letterSpacing: 1 }}>
                                                        {wallet.walletAddress.substring(0, 8)} •••• {wallet.walletAddress.substring(wallet.walletAddress.length - 6)}
                                                    </Typography>
                                                    <IconButton 
                                                        size="small" 
                                                        onClick={() => handleCopyToClipboard(wallet.walletAddress)}
                                                        sx={{ color: '#00f3ff', p: 0.5 }}
                                                    >
                                                        <ContentCopyIcon sx={{ fontSize: 14 }} />
                                                    </IconButton>
                                                </Box>
                                            </Box>
                                        </Box>
                                    </TechFrame>
                                </Box>
                            ))}
                            
                            {(!userInfo.wallets || userInfo.wallets.length === 0) && (
                                <Box sx={{ minWidth: 320, height: 180, display: 'flex', alignItems: 'center', justifyItems: 'center' }}>
                                    <Button 
                                        variant="outlined" 
                                        fullWidth 
                                        sx={{ height: '100%', borderStyle: 'dashed', borderColor: 'rgba(255,255,255,0.1)', color: 'text.secondary' }}
                                        onClick={() => setOpenDialog(true)}
                                    >
                                        Agregar Primera Wallet
                                    </Button>
                                </Box>
                            )}
                        </Box>
                    </Grid>

                    {}
                    <Grid size={{ xs: 12 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Typography variant="overline" sx={{ color: '#ce93d8', fontWeight: 'bold', letterSpacing: 4 }}>
                                {'// EXTERNAL_LINKS'}
                            </Typography>
                        </Box>
                        
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
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
                                            <Box sx={{ position: 'relative' }}>
                                                <TechFrame color="#ce93d8">
                                                    <Box sx={{ 
                                                        p: 2, 
                                                        display: 'flex', 
                                                        alignItems: 'center',
                                                        position: 'relative'
                                                    }}>
                                                        <Avatar sx={{ 
                                                            width: 36, 
                                                            height: 36, 
                                                            bgcolor: 'rgba(206, 147, 216, 0.1)', 
                                                            border: '1px solid #ce93d8',
                                                            color: '#ce93d8', 
                                                            mr: 2,
                                                            fontSize: '1rem',
                                                            fontWeight: 'bold'
                                                        }}>
                                                            {wallet.label.charAt(0).toUpperCase()}
                                                        </Avatar>
                                                        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                                                            <Typography variant="body2" sx={{ color: 'white', fontWeight: 'bold', lineHeight: 1.2 }}>
                                                                {wallet.label}
                                                            </Typography>
                                                            <Typography variant="caption" sx={{ color: 'rgba(206, 147, 216, 0.6)', fontFamily: 'monospace', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                                {wallet.walletAddress.substring(0, 6)}...{wallet.walletAddress.substring(wallet.walletAddress.length - 4)}
                                                            </Typography>
                                                        </Box>
                                                        <Box sx={{ display: 'flex' }}>
                                                            <IconButton 
                                                                size="small" 
                                                                onClick={() => handleCopyToClipboard(wallet.walletAddress)}
                                                                sx={{ color: 'rgba(255,255,255,0.3)', '&:hover': { color: 'white' } }}
                                                            >
                                                                <ContentCopyIcon sx={{ fontSize: 14 }} />
                                                            </IconButton>
                                                            <IconButton 
                                                                size="small"
                                                                onClick={() => handleRemoveWallet(wallet.walletAddress)}
                                                                sx={{ color: 'rgba(255,0,0,0.3)', '&:hover': { color: '#ff4444' } }}
                                                            >
                                                                <DeleteOutlineIcon sx={{ fontSize: 14 }} />
                                                            </IconButton>
                                                        </Box>
                                                    </Box>
                                                </TechFrame>
                                            </Box>
                                        </motion.div>
                                    ))
                                ) : (
                                    <Box sx={{ p: 4, textAlign: 'center', bgcolor: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.1)', borderRadius: 1 }}>
                                        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.3)', fontStyle: 'italic' }}>
                                            No hay wallets guardadas
                                        </Typography>
                                    </Box>
                                )}
                            </AnimatePresence>
                        </Box>
                    </Grid>
                </Grid>
            </Box>

            <AddWalletDialog 
                open={openDialog} 
                onClose={() => setOpenDialog(false)} 
                onAdd={handleAddWallet} 
            />

            <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
                <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};
