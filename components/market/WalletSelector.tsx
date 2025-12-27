import React from 'react';
import { Box, Typography, Stack } from '@mui/material';
import { Card } from '../ui/Card';
import { User, WalletInterface } from '../../lib/features/auth/types';

interface WalletSelectorProps {
    userInfo: User | null;
    walletsInfo: WalletInterface | null;
    selectedWalletId: string;
    onSelect: (id: string) => void;
}

export const WalletSelector = ({ userInfo, walletsInfo, selectedWalletId, onSelect }: WalletSelectorProps) => {
    return (
        <Box>
            <Typography variant="h6" color="primary.main" gutterBottom sx={{ mb: 2, borderBottom: '1px solid rgba(0,243,255,0.2)', display: 'inline-block', pb: 1 }}>
                1. SELECCIONAR WALLET
            </Typography>
            
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} useFlexGap sx={{ flexWrap: 'wrap' }}>
                {userInfo?.wallets.map((wallet, index) => {
                    const isSelected = selectedWalletId === wallet.walletAddress;
                    // Try to get asset count if this is the active wallet
                    const walletAssetsCount = (walletsInfo && userInfo.wallets[0]?.walletAddress === wallet.walletAddress) 
                    ? walletsInfo.store.length 
                    : '?';

                    return (

                        <Card
                            key={index}
                            onClick={() => onSelect(wallet.walletAddress)}
                            glowColor={isSelected ? '#00f3ff' : undefined}
                            sx={{
                                p: 3,
                                width: { xs: '100%', md: 300 },
                                cursor: 'pointer',
                                border: isSelected ? '2px solid #00f3ff' : undefined, 
                                // Card has its own border logic but we can override or let glowColor handle it partially.
                                // Actually, Card handles hover glow. For selected state, we might want a permanent glow or border.
                                bgcolor: isSelected ? 'rgba(0, 243, 255, 0.05)' : undefined, // Let Card default handle non-selected bg
                                '&:hover': {
                                     // Card handles this via glowColor
                                }
                            }}
                        >
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                <Typography variant="h6" color="white" fontWeight="bold">{wallet.label}</Typography>
                                {isSelected && <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#00f3ff', boxShadow: '0 0 10px #00f3ff' }} />}
                            </Box>
                            <Typography variant="caption" color="text.secondary" fontFamily="monospace" sx={{ display: 'block', mb: 2 }}>
                                {wallet.walletAddress.substring(0, 12)}...
                            </Typography>
                            
                            <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                                <Box sx={{ flex: 1, bgcolor: 'rgba(0,0,0,0.3)', p: 1, borderRadius: 1 }}>
                                    <Typography variant="caption" color="text.secondary">Dinero</Typography>
                                    <Typography variant="body1" color="success.main" fontWeight="bold">
                                        ${userInfo.balance?.toLocaleString() || 0}
                                    </Typography>
                                </Box>
                                <Box sx={{ flex: 1, bgcolor: 'rgba(0,0,0,0.3)', p: 1, borderRadius: 1 }}>
                                    <Typography variant="caption" color="text.secondary">Activos</Typography>
                                    <Typography variant="body1" color="primary.main" fontWeight="bold">
                                        {walletAssetsCount}
                                    </Typography>
                                </Box>
                            </Box>
                            
                            {isSelected && (
                                <Box sx={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: 4, bgcolor: '#00f3ff' }} />
                            )}
                        </Card>
                    );

                })}
                {(!userInfo?.wallets || userInfo.wallets.length === 0) && (
                    <Typography color="text.secondary">No se encontraron wallets asociadas.</Typography>
                )}
            </Stack>
        </Box>
    );
};
