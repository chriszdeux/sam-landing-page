// 1-Definir componente de cuenta regresiva de bloque
// 2-Obtener despachador y estado de blockchain
// 3-Efecto para sincronizar tiempo del próximo bloque
// 4-Renderizar contador de tiempo

//# 1-Definir componente de cuenta regresiva de bloque
"use client";

import React, { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';
import { Tooltip } from '../ui/Tooltip';
import { Typography } from '../ui/Typography';

import { useAppDispatch, useAppSelector } from '../../lib/hooks';
import { fetchNextBlockTime } from '../../lib/features/blockchain/actions';

interface NextBlockCountdownProps {
    networkId: string;
}

export const NextBlockCountdown: React.FC<NextBlockCountdownProps> = ({ networkId }) => {

    //# 2-Obtención del despachador y estado de blockchain
    const dispatch = useAppDispatch();
    const { nextBlockTime } = useAppSelector((state) => state.blockchain);

    const [timeLeft, setTimeLeft] = useState<string>('--:--');

    //# 3-Efecto para sincronizar tiempo del próximo bloque
    useEffect(function updateBlockTime() {
        if (networkId) {
            dispatch(fetchNextBlockTime(networkId));
        }
    }, [dispatch, networkId]);

    useEffect(function syncCountdown() {
        if (!nextBlockTime) return;

        const calculateTime = () => {
            const now = Date.now();
            const diff = nextBlockTime - now;

            if (diff <= 0) {
                setTimeLeft('Processing...');
                if (diff < -2000) {
                    dispatch(fetchNextBlockTime(networkId));
                }
            } else {
                const minutes = Math.floor(diff / 60000);
                const seconds = Math.floor((diff % 60000) / 1000);
                setTimeLeft(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
            }
        };

        calculateTime();

        const interval = setInterval(calculateTime, 1000);

        return () => clearInterval(interval);
    }, [nextBlockTime, dispatch, networkId]);

    //# 4-Renderizar contador de tiempo
    return (
        <Tooltip content="Próximo bloque">
            <div className="flex items-center gap-2 rounded-2xl border border-[#00f3ff]/20 bg-[#00f3ff]/5 px-3 py-1">
                <Clock size={16} className="text-primary" />
                <Typography variant="body2" component="span" className="font-mono font-bold text-primary">
                    {timeLeft}
                </Typography>
            </div>
        </Tooltip>
    );
};
