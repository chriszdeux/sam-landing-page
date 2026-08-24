import React, { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import { Dialog } from '../ui/Dialog';
import { TechFrame } from '../ui/TechFrame';
import { Input } from '../ui/Input';
import { Typography } from '../ui/Typography';
import { Button } from '../ui/Button';

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
            className="w-full max-w-[600px]"
        >
            <TechFrame color="#00f3ff">
                <div className="bg-[rgba(10,15,30,0.95)] p-8 backdrop-blur-md">
                    <Typography variant="h5" className="mb-6 flex items-center gap-4 font-bold text-[#00f3ff]">
                        <PlusCircle /> REGISTRAR NUEVA WALLET
                    </Typography>

                    <div className="flex flex-col gap-6">
                        <div>
                            <Typography variant="overline" className="mb-2 block text-foreground-muted">ETIQUETA_SISTEMA</Typography>
                            <Input
                                autoFocus
                                placeholder="Ej. Principal, Trading, Reserva"
                                value={label}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLabel(e.target.value)}
                            />
                        </div>
                        <div>
                            <Typography variant="overline" className="mb-2 block text-foreground-muted">DIRECCION_DE_ENLACE</Typography>
                            <Input
                                placeholder="0x..."
                                value={walletAddress}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setWalletAddress(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="mt-8 flex justify-end gap-4">
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
                    </div>
                </div>
            </TechFrame>
        </Dialog>
    );
};
