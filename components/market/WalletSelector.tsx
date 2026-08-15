// 1-Definir componente de selección de wallet
// 2-Renderizar selector de wallet con grid
// 3-Renderizar carta de wallet individual

//# 1-Definir componente de selección de wallet
import React from 'react';
import { Typography } from '../ui/Typography';
import { Card } from '../ui/Card';
import { User, WalletInterface } from '../../lib/features/auth/types';

interface WalletSelectorProps {
    userInfo: User | null;
    walletsInfo: WalletInterface | null;
    selectedWalletId: string;
    onSelect: (id: string) => void;
}

export const WalletSelector = ({ userInfo, walletsInfo, selectedWalletId, onSelect }: WalletSelectorProps) => {
    const allWallets = [
      ...(userInfo?.wallet ? [userInfo.wallet] : []),
      ...(userInfo?.wallets || []),
      ...(userInfo?.walletsSaved || [])
    ].filter((v, i, a) => a.findIndex(t => t.walletAddress === v.walletAddress) === i);

    //# 2-Renderizar selector de wallet con grid
    return (
        <div>
            <Typography variant="h6" className="mb-4 inline-block border-b border-[#00f3ff]/20 pb-2 text-primary">
                1. SELECCIONAR WALLET
            </Typography>

            <div className="flex flex-col flex-wrap gap-6 md:flex-row">
                {allWallets.map((wallet, index) => {
                    const isSelected = selectedWalletId === wallet.walletAddress;
                    const walletAssetsCount = (walletsInfo && (userInfo?.wallet?.walletAddress === wallet.walletAddress || userInfo?.wallets?.[0]?.walletAddress === wallet.walletAddress || userInfo?.walletsSaved?.[0]?.walletAddress === wallet.walletAddress)) 
                    ? walletsInfo.store.length 
                    : '?';

                    //# 3-Renderizar carta de wallet individual
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
                                bgcolor: isSelected ? 'rgba(0, 243, 255, 0.05)' : undefined,
                            }}
                        >
                            <div className="mb-4 flex items-center justify-between">
                                <Typography variant="h6" className="font-bold text-white">{wallet.label}</Typography>
                                {isSelected && <div className="h-2.5 w-2.5 rounded-full bg-[#00f3ff] shadow-[0_0_10px_#00f3ff]" />}
                            </div>
                            <Typography variant="caption" className="mb-4 block font-mono text-foreground-muted">
                                {wallet.walletAddress.substring(0, 12)}...
                            </Typography>

                            <div className="mt-2 flex gap-4">
                                <div className="flex-1 rounded bg-black/30 p-2">
                                    <Typography variant="caption" className="text-foreground-muted">Dinero</Typography>
                                    <Typography variant="body1" className="font-bold text-success">
                                        ${userInfo?.balance?.toLocaleString() || 0}
                                    </Typography>
                                </div>
                                <div className="flex-1 rounded bg-black/30 p-2">
                                    <Typography variant="caption" className="text-foreground-muted">Activos</Typography>
                                    <Typography variant="body1" className="font-bold text-primary">
                                        {walletAssetsCount}
                                    </Typography>
                                </div>
                            </div>

                            {isSelected && (
                                <div className="absolute bottom-0 left-0 h-1 w-full bg-[#00f3ff]" />
                            )}
                        </Card>
                    );
                })}
                {allWallets.length === 0 && (
                    <Typography className="text-foreground-muted">No se encontraron wallets asociadas.</Typography>
                )}
            </div>
        </div>
    );
};
