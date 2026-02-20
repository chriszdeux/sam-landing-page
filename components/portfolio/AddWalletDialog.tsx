import React, { useState } from 'react';
import { Box, Typography, Button, Dialog } from '@mui/material';
import { TechFrame } from '../ui/TechFrame';
import { Input } from '../ui/Input';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

interface AddWalletDialogProps {
    open: boolean;
    onClose: () => void;
    onAdd: (label: string, address: string) => void;
}

export const AddWalletDialog: React.FC<AddWalletDialogProps> = ({ open, onClose, onAdd }) => {
    const [label, setLabel] = useState('');
    const [walletAddress, setWalletAddress] = useState('');

    const handleSubmit = () => {
        onAdd(label, walletAddress);
        setLabel('');
        setWalletAddress('');
    };

    return (
        <Dialog 
            open={open} 
            onClose={onClose}
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
                            onClick={onClose} 
                            sx={{ color: 'rgba(255,255,255,0.5)', '&:hover': { color: 'white' } }}
                        >
                            Abortar
                        </Button>
                        <Button 
                            onClick={handleSubmit} 
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
    );
};
