/**
 * Componente AuthLoader
 * Gestiona la carga inicial de autenticación y datos del usuario
 * Verifica el estado de la sesión y carga detalles de la billetera
 */
'use client';

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../lib/hooks';
import { checkAuth, fetchWalletDetails } from '../../lib/features/auth';
import { fetchNetworks } from '../../lib/features/blockchain/actions';

export const AuthLoader = ({ children }: { children: React.ReactNode }) => {
    const dispatch = useAppDispatch();
    const { userInfo } = useAppSelector((state) => state.auth);


    useEffect(() => {
        dispatch(checkAuth());
        dispatch(fetchNetworks());
    }, [dispatch]);

    useEffect(() => {
        if (userInfo) {

            
            if (userInfo.wallets && userInfo.wallets.length > 0) {
               const primaryWallet = userInfo.wallets[0];
               if (!primaryWallet.details) {
                    dispatch(fetchWalletDetails(primaryWallet.walletAddress));
               }
           }
        }
    }, [userInfo, dispatch]);

    return <>{children}</>;
};
