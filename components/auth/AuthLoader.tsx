'use client';

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../lib/hooks';
import { checkAuth, fetchWalletDetails } from '../../lib/features/auth';
import { fetchNetworks } from '../../lib/features/blockchain/actions';
import { fetchCryptos } from '../../lib/features/market/actions';

export const AuthLoader = ({ children }: { children: React.ReactNode }) => {
    const dispatch = useAppDispatch();
    const { selectedNetwork } = useAppSelector((state) => state.blockchain);
    const { userInfo } = useAppSelector((state) => state.auth);

    // Initial Load
    useEffect(() => {
        dispatch(checkAuth());
        dispatch(fetchNetworks());
    }, []);

    // Fetch Cryptos when Network changes/loads
    useEffect(() => {
        if (selectedNetwork?.id) {
            dispatch(fetchCryptos(selectedNetwork.id));
        }
    }, [selectedNetwork?.id]);

    // Fetch Wallet Details when User is logged in (and implicitly after network init if we want strict ordering, 
    // but usually user data is independent. User said "after blockchain... immediately wallet".
    // We can just watch userInfo here.
    useEffect(() => {
         if (userInfo && userInfo.wallets && userInfo.wallets.length > 0) {
            const primaryWallet = userInfo.wallets[0];
            if (!primaryWallet.details) {
                 dispatch(fetchWalletDetails(primaryWallet.walletAddress));
            }
        }
    }, [userInfo]);

    return <>{children}</>;
};
