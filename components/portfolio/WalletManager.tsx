'use client';

import React, { useState } from 'react';
import { Box, Typography, Grid, Avatar, Button, Dialog, Snackbar, Alert, IconButton } from '@mui/material';
import { Input } from '../ui/Input';
import { TechFrame } from '../ui/TechFrame';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { useAppDispatch, useAppSelector } from '../../lib/hooks';
import { addWallet, removeWallet } from '../../lib/features/auth/actions';
import { AnimatePresence, motion } from 'framer-motion';

export const WalletManager = () => {
    const dispatch = useAppDispatch();
    const { userInfo } = useAppSelector((state) => state.auth);

    const [openDialog, setOpenDialog] = useState(false);
    const [label, setLabel] = useState('');
    const [walletAddress, setWalletAddress] = useState('');
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

    const handleAddWallet = async () => {
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
                 setLabel('');
                 setWalletAddress('');
            } else {
                setSnackbar({ open: true, message: resultAction.payload as string || 'Failed to add wallet', severity: 'error' });
            }
        } catch {
             setSnackbar({ open: true, message: 'An unexpected error occurred', severity: 'error' });
        }
    };

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

    const handleCopyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setSnackbar({ open: true, message: 'Address copied to clipboard', severity: 'success' });
    };

    if (!userInfo) return null;

    return (
        <Box sx={{ mb: 8 }}>
            {/* Xbox Dashboard Layout Container */}
            <Box sx={{ overflowX: 'hidden', p: 1 }}>
                
                {/* Header Status Bar style */}
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, borderBottom: '2px solid rgba(255,255,255,0.1)', pb: 2 }}>
                    <Typography variant="h3" sx={{ color: 'white', fontWeight: 'bold', letterSpacing: 1, mr: 3 }}>
                        PORTFOLIO
                    </Typography>
                    <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.5)', fontWeight: 'light', textTransform: 'uppercase' }}>
                        Dashboard
                    </Typography>
                </Box>

                <Grid container spacing={3}>
                    {/* MAIN CONTENT - ACTIVE APPS STYLE (Mis Wallets) */}
                    <Grid size={{ xs: 12, md: 8, lg: 9 }}>
                        <Typography variant="overline" sx={{ color: '#00f3ff', fontWeight: 'bold', mb: 2, display: 'block', letterSpacing: 4 }}>
                            {'// ACTIVOS_LOCALES'}
                        </Typography>
                        
                        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 3 }}>
                            {userInfo.wallets && userInfo.wallets.map((wallet, index) => (
                                <Box key={index} sx={{ height: 200 }}>
                                    <TechFrame color="#00f3ff" className="h-full">
                                        <Box sx={{ 
                                            p: 3,
                                            height: '100%',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'space-between',
                                            position: 'relative'
                                        }}>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                <Box>
                                                    <Typography variant="overline" sx={{ color: 'rgba(0, 243, 255, 0.6)', letterSpacing: 2 }}>
                                                        LOCAL_WALLET_NODES
                                                    </Typography>
                                                    <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'white', mt: 1 }}>
                                                        {wallet.label}
                                                    </Typography>
                                                </Box>
                                                <AccountBalanceWalletIcon sx={{ color: '#00f3ff', opacity: 0.3, fontSize: 40 }} />
                                            </Box>

                                            <Box>
                                                <Box sx={{ display: 'flex', alignItems: 'center', bgcolor: 'rgba(0,0,0,0.3)', p: 1, borderRadius: 1, mb: 1 }}>
                                                    <Typography variant="caption" sx={{ fontFamily: 'monospace', color: '#00f3ff', flexGrow: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                        {wallet.walletAddress}
                                                    </Typography>
                                                    <IconButton 
                                                        size="small" 
                                                        onClick={() => handleCopyToClipboard(wallet.walletAddress)}
                                                        sx={{ color: '#00f3ff', ml: 1 }}
                                                    >
                                                        <ContentCopyIcon sx={{ fontSize: 16 }} />
                                                    </IconButton>
                                                </Box>
                                                <Box sx={{ display: 'flex', gap: 1 }}>
                                                    <Box sx={{ px: 1, py: 0.25, bgcolor: 'rgba(0, 243, 255, 0.1)', border: '1px solid rgba(0, 243, 255, 0.3)', borderRadius: 0.5 }}>
                                                        <Typography variant="caption" sx={{ color: '#00f3ff', fontSize: '0.6rem', fontWeight: 'bold' }}>SYSTEM_ACTIVE</Typography>
                                                    </Box>
                                                    <Box sx={{ px: 1, py: 0.25, bgcolor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 0.5 }}>
                                                        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.6rem' }}>GENESIS_01</Typography>
                                                    </Box>
                                                </Box>
                                            </Box>
                                        </Box>
                                    </TechFrame>
                                </Box>
                            ))}
                        </Box>
                    </Grid>

                    {/* SIDEBAR - FRIENDS/ACTIVITY STYLE (Wallets Guardadas) */}
                    <Grid size={{ xs: 12, md: 4, lg: 3 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Typography variant="overline" sx={{ color: '#ce93d8', fontWeight: 'bold', letterSpacing: 4 }}>
                                {'// EXTERNAL_LINKS'}
                            </Typography>
                            <Button
                                variant="text"
                                startIcon={<AddCircleOutlineIcon />}
                                onClick={() => setOpenDialog(true)}
                                sx={{
                                    color: '#ce93d8',
                                    fontSize: '0.75rem',
                                    fontWeight: 'bold',
                                    textTransform: 'uppercase',
                                    '&:hover': { bgcolor: 'rgba(206, 147, 216, 0.1)' }
                                }}
                            >
                                Registrar
                            </Button>
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

            {/* Add Wallet Dialog */}
            <Dialog 
                open={openDialog} 
                onClose={() => setOpenDialog(false)}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: {
                        bgcolor: 'transparent',
                        boxShadow: 'none',
                        backgroundImage: 'none',
                    }
                }}
            >
                <TechFrame color="#00f3ff">
                    <Box sx={{ p: 4, bgcolor: 'rgba(10, 15, 30, 0.95)', backdropFilter: 'blur(10px)' }}>
                        <Typography variant="h5" sx={{ color: '#00f3ff', fontWeight: 'bold', mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
                            <AddCircleOutlineIcon /> REGISTRAR NUEVA WALLET
                        </Typography>
                        
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                            <Box>
                                <Typography variant="overline" sx={{ color: 'text.secondary', display: 'block', mb: 1 }}>ETIQUETA_SISTEMA</Typography>
                                <Input
                                    autoFocus
                                    placeholder="Ej. Principal, Trading, Reserva"
                                    fullWidth
                                    value={label}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLabel(e.target.value)}
                                />
                            </Box>
                            <Box>
                                <Typography variant="overline" sx={{ color: 'text.secondary', display: 'block', mb: 1 }}>DIRECCION_DE_ENLACE</Typography>
                                <Input
                                    placeholder="0x..."
                                    fullWidth
                                    value={walletAddress}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setWalletAddress(e.target.value)}
                                />
                            </Box>
                        </Box>

                        <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                            <Button 
                                onClick={() => setOpenDialog(false)} 
                                sx={{ color: 'rgba(255,255,255,0.5)', '&:hover': { color: 'white' } }}
                            >
                                Abortar
                            </Button>
                            <Button 
                                onClick={handleAddWallet} 
                                variant="contained"
                                sx={{
                                    bgcolor: '#00f3ff',
                                    color: '#000',
                                    fontWeight: 'bold',
                                    px: 4,
                                    '&:hover': { bgcolor: '#00d0db' }
                                }}
                            >
                                Vincular Portafolio
                            </Button>
                        </Box>
                    </Box>
                </TechFrame>
            </Dialog>

            <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
                <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};
