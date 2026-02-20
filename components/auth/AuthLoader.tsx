// 1-Importar dependencias y acciones de Redux
// 2-Definir componente y obtener hooks de despacho
// 3-Efecto para verificar autenticación y redes
// 4-Efecto para sincronizar detalles de la billetera
// 5-Renderizar los componentes hijos contenidos

'use client';

//# 1-Importar dependencias y acciones de Redux
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../lib/hooks';
import { checkAuth, fetchWalletDetails } from '../../lib/features/auth';
import { fetchNetworks } from '../../lib/features/blockchain/actions';

export const AuthLoader = ({ children }: { children: React.ReactNode }) => {

    //# 2-Definir componente y obtener hooks de despacho
    const dispatch = useAppDispatch();
    const { userInfo } = useAppSelector((state) => state.auth);

    //# 3-Efecto para verificar autenticación y redes
    useEffect(function loadInitialData() {
        dispatch(checkAuth());
        dispatch(fetchNetworks());
    }, [dispatch]);

    //# 4-Efecto para sincronizar detalles de la billetera
    useEffect(function syncWalletDetails() {
        if (userInfo) {
            if (userInfo.wallets && userInfo.wallets.length > 0) {
               const primaryWallet = userInfo.wallets[0];
               if (!primaryWallet.details) {
                    dispatch(fetchWalletDetails(primaryWallet.walletAddress));
               }
           }
        }
    }, [userInfo, dispatch]);

    //# 5-Renderizar los componentes hijos contenidos
    return <>{children}</>;
};
