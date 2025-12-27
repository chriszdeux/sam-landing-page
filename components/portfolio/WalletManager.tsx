'use client';

import React, { useState } from 'react';
import { Box, Typography, Grid, Paper, Avatar, Button, Dialog, DialogTitle, DialogContent, DialogActions, Snackbar, Alert, IconButton } from '@mui/material';
import { Input } from '../ui/Input';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { useAppDispatch, useAppSelector } from '../../lib/hooks';
import { addWallet } from '../../lib/features/auth/actions';

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
        } catch (error) { // eslint-disable-line @typescript-eslint/no-unused-vars
             setSnackbar({ open: true, message: 'An unexpected error occurred', severity: 'error' });
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
                
                {/* Header "Status Bar" style */}
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, borderBottom: '2px solid rgba(255,255,255,0.1)', pb: 2 }}>
                    <Typography variant="h3" sx={{ color: 'white', fontWeight: 'bold', letterSpacing: 1, mr: 3 }}>
                        PORTFOLIO
                    </Typography>
                    <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.5)', fontWeight: 'light', textTransform: 'uppercase' }}>
                        Dashboard
                    </Typography>
                </Box>

                <Grid container spacing={2}>
                    {/* MAIN CONTENT - "ACTIVE APPS" STYLE (Mis Wallets) */}
                    <Grid size={{ xs: 12, md: 8, lg: 9 }}>
                        <Typography variant="subtitle1" sx={{ color: '#00f3ff', fontWeight: 'bold', mb: 2, textTransform: 'uppercase', letterSpacing: 2 }}>
                            Mis Wallets
                        </Typography>
                        
                        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 2 }}>
                            {userInfo.wallets && userInfo.wallets.map((wallet, index) => (
                                <Paper key={index} sx={{ 
                                    height: 180,
                                    bgcolor: '#1a1b26', // Darker tile background
                                    color: 'white',
                                    p: 2,
                                    position: 'relative',
                                    overflow: 'hidden',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between',
                                    border: 'none',
                                    transition: 'all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                                    '&:hover': {
                                        outline: '3px solid white', // Xbox focus style
                                        transform: 'scale(1.02)',
                                        zIndex: 10,
                                        boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
                                    },
                                    '&::before': { // Gradient Overlay
                                        content: '""',
                                        position: 'absolute',
                                        top: 0, left: 0, right: 0, bottom: 0,
                                        background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.8) 100%)',
                                        zIndex: 1
                                    }
                                }}>
                                    {/* Background Icon/Watermark */}
                                    <AccountBalanceWalletIcon sx={{ 
                                        position: 'absolute', 
                                        top: -20, 
                                        right: -20, 
                                        fontSize: 140, 
                                        opacity: 0.1, 
                                        transform: 'rotate(-15deg)' 
                                    }} />

                                    <Box sx={{ zIndex: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <Paper sx={{ px: 1, py: 0.5, bgcolor: '#00f3ff', color: 'black', fontWeight: 'bold', fontSize: '0.7rem', textTransform: 'uppercase' }}>
                                            Personal
                                        </Paper>
                                    </Box>

                                    <Box sx={{ zIndex: 2 }}>
                                        <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 0.5, textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                                            {wallet.label}
                                        </Typography>
                                        <Box sx={{ display: 'flex', alignItems: 'center', opacity: 0.8 }}>
                                            <Typography variant="caption" sx={{ fontFamily: 'monospace', mr: 1 }}>
                                                {wallet.walletAddress.substring(0, 12)}...
                                            </Typography>
                                            <IconButton 
                                                size="small" 
                                                onClick={(e) => { e.stopPropagation(); handleCopyToClipboard(wallet.walletAddress); }}
                                                sx={{ p: 0.5, color: 'white', '&:hover': { color: '#00f3ff' } }}
                                            >
                                                <ContentCopyIcon sx={{ fontSize: 14 }} />
                                            </IconButton>
                                        </Box>
                                    </Box>
                                </Paper>
                            ))}
                        </Box>
                    </Grid>

                    {/* SIDEBAR - "FRIENDS/ACTIVITY" STYLE (Wallets Guardadas) */}
                    <Grid size={{ xs: 12, md: 4, lg: 3 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Typography variant="subtitle1" sx={{ color: '#ce93d8', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 2 }}>
                                Guardadas
                            </Typography>
                            <Button
                                variant="outlined"
                                startIcon={<AddCircleOutlineIcon />}
                                onClick={() => setOpenDialog(true)}
                                sx={{
                                    borderColor: 'rgba(206, 147, 216, 0.5)',
                                    color: '#ce93d8',
                                    fontSize: '0.75rem',
                                    py: 0.5,
                                    textTransform: 'none',
                                    '&:hover': {
                                        borderColor: '#ce93d8',
                                        bgcolor: 'rgba(206, 147, 216, 0.1)'
                                    }
                                }}
                            >
                                Nueva
                            </Button>
                        </Box>
                        
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                            {userInfo.walletsSaved && userInfo.walletsSaved.length > 0 ? (
                                userInfo.walletsSaved.map((wallet, index) => (
                                    <Paper key={index} sx={{ 
                                        p: 2, 
                                        bgcolor: 'rgba(255, 255, 255, 0.05)', 
                                        display: 'flex', 
                                        alignItems: 'center',
                                        transition: 'all 0.2s',
                                        borderLeft: '4px solid transparent',
                                        '&:hover': {
                                            bgcolor: 'rgba(255, 255, 255, 0.1)',
                                            borderLeft: '4px solid #ce93d8', // Highlight color
                                            pl: 2.5
                                        }
                                    }}>
                                        <Avatar sx={{ 
                                            width: 40, 
                                            height: 40, 
                                            bgcolor: '#2d2d2d', 
                                            border: '2px solid #ce93d8',
                                            color: 'white', 
                                            mr: 2 
                                        }}>
                                            {wallet.label.charAt(0).toUpperCase()}
                                        </Avatar>
                                        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                                            <Typography variant="body1" sx={{ color: 'white', fontWeight: 'bold', lineHeight: 1.2 }}>
                                                {wallet.label}
                                            </Typography>
                                            
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', fontFamily: 'monospace', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                    {wallet.walletAddress}
                                                </Typography>
                                                <IconButton 
                                                    size="small" 
                                                    onClick={() => handleCopyToClipboard(wallet.walletAddress)}
                                                    sx={{ ml: 0.5, p: 0.5, color: 'rgba(255,255,255,0.3)', '&:hover': { color: 'white' } }}
                                                >
                                                    <ContentCopyIcon sx={{ fontSize: 12 }} />
                                                </IconButton>
                                            </Box>
                                        </Box>
                                    </Paper>
                                ))
                            ) : (
                                <Box sx={{ p: 2, color: 'rgba(255,255,255,0.3)', fontStyle: 'italic' }}>
                                    No hay wallets guardadas
                                </Box>
                            )}
                        </Box>
                    </Grid>
                </Grid>
            </Box>

            {/* Add Wallet Dialog */}
            <Dialog 
                open={openDialog} 
                onClose={() => setOpenDialog(false)}
                PaperProps={{
                    sx: {
                        bgcolor: 'rgba(15, 15, 25, 0.95)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(0, 243, 255, 0.3)',
                        borderRadius: 2,
                        width: '100%',
                        maxWidth: 500
                    }
                }}
            >
                <DialogTitle sx={{ color: '#00f3ff', fontWeight: 'bold' }}>
                    Registrar Nueva Wallet
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ pt: 1, display: 'flex', flexDirection: 'column', gap: 3 }}>
                        <Input
                            autoFocus
                            label="Etiqueta (Ej. Principal, Trading)"
                            fullWidth
                            value={label}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLabel(e.target.value)}
                        />
                        <Input
                            label="Dirección de la Wallet"
                            fullWidth
                            value={walletAddress}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setWalletAddress(e.target.value)}
                        />
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={() => setOpenDialog(false)} sx={{ color: 'text.secondary' }}>
                        Cancelar
                    </Button>
                    <Button 
                        onClick={handleAddWallet} 
                        variant="contained"
                        sx={{
                            bgcolor: '#00f3ff',
                            color: '#000',
                            fontWeight: 'bold',
                            '&:hover': {
                                bgcolor: '#00d0db'
                            }
                        }}
                    >
                        Guardar
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
                <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};
